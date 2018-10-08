'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanUp = undefined;
exports.onError = onError;

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cleanUp = exports.cleanUp = (childProcess, destDir, BABEL_DISABLE_CACHE) => {
  if (childProcess && childProcess.exitCode === null) {
    process.kill(-childProcess.pid); // Kill test process if still alive
  }

  process.env.BABEL_DISABLE_CACHE = BABEL_DISABLE_CACHE;

  if (_path2.default.resolve(destDir).includes(process.cwd())) {
    return (0, _del2.default)(destDir);
  }

  return Promise.resolve();
};

function onError(err) {
  return this.tearDownTest() // eslint-disable-line no-invalid-this
  .then(() => Promise.reject(err), e => {
    console.error('Test originally failed with error:', err);
    console.error('But another error occurred in the meantime:');
    return Promise.reject(e);
  });
}