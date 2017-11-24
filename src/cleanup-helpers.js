import del from 'del';
import path from 'path';

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

export {cleanUp, onError};
