import childProcessData, {makeSingleTest} from 'child-process-data';
import {spawn} from 'child_process';
import path from 'path';
import {newDest, copySources, copyGulpfile, copyBabelrc, linkNodeModules}
  from './setup-helpers';
import {waitForMessage} from './messages-helpers';
import {cleanUp, onError} from './cleanup-helpers';
import Messages from './messages';

export default function testGulpProcess (opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
      || 20000);

    const messages = new Messages(opts.messages);
    const dest = newDest();

    let targets = opts.target || ['default'];

    if (!Array.isArray(targets)) {
      targets = [targets];
    }

    const tests = targets.map(target => {
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
          while (messages.next() &&
            await this.waitForMessage(results, messages.message)) {
            results.testUpTo(messages.globalFns, messages.message);
            results.forgetUpTo(messages.message, {included: true});
            await messages.runCurrentFns(options);
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
      }, opts, {dest, target});

      return makeSingleTest(options);
    });

    return tests.reduce((promise, test) => {
      return promise.then(() => test());
    }, Promise.resolve());
  };
}

export {compareTranspiled, touchFile, deleteFile, isDeleted, isFound, never,
  nextTarget} from './test-tools';
