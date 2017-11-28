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
          [options.target,
            '--gulpfile',
            path.join(options.dest, 'gulpfile.babel.js')],
          {detached: true} // Make sure all test processes will be killed
        );

        return childProcessData(this.childProcess);
      },

      async checkResults (results) {
        const genMessages = function* (messages) {
          const array = messages.map(msg => {
            return Array.isArray(msg) ? msg[0] : msg;
          }).filter(msg => typeof msg === 'string');
          yield* array;
        };
        const genOnEachMessageFunctions = function* (messages) {
          const array = [];
          messages.every(msg => {
            const yes = typeof msg === 'function';
            if (yes) {
              array.push(msg);
            }
            return yes;
          });
          yield* array;
        };
        const genOnMessageFunctions = function* (messages) {
          const array = messages.map(msg => {
            if (Array.isArray(msg)) {
              const [, ...fns] = msg;
              return fns;
            }
            return null;
          });
          yield* array;
        };

        const messages = genMessages(this.messages);
        const onMessageFunctions = genOnMessageFunctions(this.messages);

        let message = messages.next();
        let onMessageFns = onMessageFunctions.next();

        while (!message.done &&
          await this.waitForMessage(results, message.value)) {
          for (let tester of genOnEachMessageFunctions(this.messages)) {
            results.allMessages.every(tester);
          }

          results.forgetUpTo(message.value, {included: true});

          if (onMessageFns.value !== null) {
            for (let fn of onMessageFns.value) {
              await fn(options);
            }
          }

          message = messages.next();
          onMessageFns = onMessageFunctions.next();
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
    }, {target: 'default'}, opts, {dest: newDest()});

    return makeSingleTest(options)();
  };
}

export {compareTranspiled, touchFile, deleteFile, isDeleted, isFound, never}
  from './test-tools';
