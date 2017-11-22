import childProcessData, {makeSingleTest} from 'child-process-data';
import destglob from 'destglob';
import equalFileContents from 'equal-file-contents';
import {spawn} from 'child_process';
import path from 'path';
import del from 'del';
import touch from 'touch';
import gulp from 'gulp';
import rename from 'gulp-rename';
import babel from 'gulp-babel';

let counter = 0;

const newDest = () => {
  counter++;
  return `/tmp/${(new Date()).getTime()}_${counter}`;
};

const copySources = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.sources, {base: process.cwd()})
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

const copyGulpfile = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.gulpfile, {base: 'test/gulpfiles'})
      .on('end', resolve)
      .on('error', reject)
      .pipe(rename('gulpfile.babel.js'))
      .pipe(gulp.dest(options.dest));
  });
};

const copyBabelrc = options => {
  return new Promise((resolve, reject) => {
    gulp.src('.babelrc')
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

const linkNodeModules = options => {
  return childProcessData(spawn('ln', [
    '-s', path.join(process.cwd(), 'node_modules'), options.dest]));
};

const cleanUp = (childProcess, destDir, BABEL_DISABLE_CACHE) => {
  if (childProcess && childProcess.exitCode === null) {
    process.kill(-childProcess.pid); // Kill test process if still alive
  }

  process.env.BABEL_DISABLE_CACHE = BABEL_DISABLE_CACHE;

  if (path.resolve(destDir).includes(process.cwd())) {
    return del(destDir);
  }

  return Promise.resolve();
};

function onError (err) {
  return this.tearDownTest() // eslint-disable-line no-invalid-this
    .then(() => Promise.reject(err), e => {
      console.error('Test originally failed with error:', err);
      console.error('But another error occurred in the meantime:');
      return Promise.reject(e);
    });
}

const repeat = (action, interval = 200, maxDuration = 4000) => {
  let intervalId;
  let timeoutId;

  return new Promise((resolve, reject) => {
    const timeout = () => {
      clearInterval(intervalId);
      reject(new Error('Waiting too long for child process to finish'));
    };

    intervalId = setInterval(() => {
      try {
        if (action()) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(true);
        }
      } catch (e) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        reject(e);
      }
    }, interval);

    timeoutId = setTimeout(timeout, maxDuration);
  });
};

const testMessage = (results, message) => {
  return results.allMessages.findIndex(
    el => el.match(new RegExp(message))) !== -1;
};

function waitForMessage (results, message) {
  return repeat(() => testMessage(results, message)).catch(err => {
    if (err.message.match(/Waiting too long for child process to finish/)) {
      throw new Error(`Waiting too long for child process to finish:
Message '${message}' was never intercepted`);
    }
    throw err;
  });
}

const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = destglob(_glob, options.dest);
  return equalFileContents(glob, dest, babel, options.dest);
};

const touchFile = _file => options => {
  const [file] = destglob(_file, options.dest);
  return touch(file);
};

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

export {compareTranspiled, touchFile};
