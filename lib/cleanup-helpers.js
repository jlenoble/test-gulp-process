'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onError = exports.cleanUp = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cleanUp = function cleanUp(childProcess, destDir, BABEL_DISABLE_CACHE) {
  if (childProcess && childProcess.exitCode === null) {
    process.kill(-childProcess.pid); // Kill test process if still alive
  }

  process.env.BABEL_DISABLE_CACHE = BABEL_DISABLE_CACHE;

  if (_path2.default.resolve(destDir).includes(process.cwd())) {
    return (0, _del2.default)(destDir);
  }

  return _promise2.default.resolve();
};

function onError(err) {
  return this.tearDownTest() // eslint-disable-line no-invalid-this
  .then(function () {
    return _promise2.default.reject(err);
  }, function (e) {
    console.error('Test originally failed with error:', err);
    console.error('But another error occurred in the meantime:');
    return _promise2.default.reject(e);
  });
}

exports.cleanUp = cleanUp;
exports.onError = onError;