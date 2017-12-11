import childProcessData, {makeSingleTest} from 'child-process-data';
import {spawn} from 'child_process';
import path from 'path';
import {newDest, copySources, copyGulpfile, copyBabelrc, linkNodeModules}
  from './setup-helpers';
import {cleanUp, onError} from './cleanup-helpers';
import Messages from './messages';
import {setDebug} from './file';

export default function testGulpProcess (opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
      || 20000);

    setDebug(opts.debug);

    const messages = new Messages(opts.messages);
    const dest = newDest();

    let tasks = opts.task || ['default'];

    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    const tests = tasks.map((task, nth) => {
      const options = Object.assign({
        setupTest () {
          this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
          process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
          // these tests

          // nth: Only copy sources on first gulp call in the series of tests
          return !nth ? Promise.all([
            copySources(options),
            copyGulpfile(options),
            copyBabelrc(options),
          ]).then(() => linkNodeModules(options)) : Promise.resolve();
        },

        spawnTest () {
          this.childProcess = spawn(
            'gulp',
            [options.task,
              '--gulpfile',
              path.join(options.dest, 'gulpfile.babel.js')],
            {detached: true} // Make sure all test processes will be killed
          );

          return childProcessData(this.childProcess);
        },

        async checkResults (results) {
          while (await messages.next(results)) {
            results.testUpTo(messages.globalFns, messages.message,
              {included: true});
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
      }, opts, {dest, task});

      return makeSingleTest(options);
    });

    return tests.reduce((promise, test) => {
      return promise.then(() => test());
    }, Promise.resolve());
  };
}

export {
  compareTranspiled,
  deleteFile,
  isChangedContent,
  isDeleted,
  isFound,
  isNewer,
  isSameContent,
  isUntouched,
  never,
  nextTask,
  parallel,
  snapshot,
  touchFile,
} from './test-tools';
