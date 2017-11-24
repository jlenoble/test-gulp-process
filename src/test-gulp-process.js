import childProcessData, {makeSingleTest} from 'child-process-data';
import {spawn} from 'child_process';
import path from 'path';
import {newDest, copySources, copyGulpfile, copyBabelrc, linkNodeModules}
  from './setup-helpers';
import {waitForMessage} from './messages-helpers';
import {cleanUp, onError} from './cleanup-helpers';

export default function testGulpProcess (opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
      || 20000);

    const options = Object.assign({
      setupTest () {
        this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
        process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
        // these tests

        return Promise.all([
          copySources(options),
          copyGulpfile(options),
          copyBabelrc(options),
        ]).then(() => linkNodeModules(options));
      },

      spawnTest () {
        this.childProcess = spawn(
          'gulp',
          ['--gulpfile',
            path.join(options.dest, 'gulpfile.babel.js')],
          {detached: true} // Make sure all test processes will be killed
        );

        return childProcessData(this.childProcess);
      },

      async checkResults (results) {
        const genMessages = function* (messages) {
          const array = messages.map(msg => {
            return Array.isArray(msg) ? msg[0] : msg;
          });
          yield* array;
        };
        const genTestFunctions = function* (messages) {
          const array = messages.map(msg => {
            return Array.isArray(msg) ? msg[1] : null;
          });
          yield* array;
        };

        const messages = genMessages(this.messages);
        const testFunctions = genTestFunctions(this.messages);

        let message = messages.next();
        let testFn = testFunctions.next();

        while (!message.done &&
          await this.waitForMessage(results, message.value)) {
          results.forgetUpTo(message.value, {included: true});

          if (testFn.value !== null) {
            await testFn.value(options);
          }

          message = messages.next();
          testFn = testFunctions.next();
        }

        return results;
      },

      tearDownTest () {
        return cleanUp(this.childProcess, options.dest,
          this.BABEL_DISABLE_CACHE)
          .catch(err => {
            console.error('Failed to clean up after test');
            console.error('You should take time and check that:');
            console.error(`- Directory ${options.dest} is deleted`);
            console.error(`- Process ${
              this.childProcess.pid} is not running any more`);
            return Promise.reject(err);
          });
      },

      onSetupError: onError,
      onSpawnError: onError,
      onCheckResultsError: onError,

      waitForMessage,
    }, opts, {dest: newDest()});

    return makeSingleTest(options)();
  };
}

export {compareTranspiled, touchFile} from './test-tools';
