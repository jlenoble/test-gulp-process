'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextTarget = exports.never = exports.isFound = exports.isDeleted = exports.deleteFile = exports.touchFile = exports.compareTranspiled = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _destglob9 = require('destglob');

var _destglob10 = _interopRequireDefault(_destglob9);

var _equalFileContents = require('equal-file-contents');

var _equalFileContents2 = _interopRequireDefault(_equalFileContents);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _cleanupWrapper = require('cleanup-wrapper');

var _statAgain = require('stat-again');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compareTranspiled = exports.compareTranspiled = function compareTranspiled(_glob, _dest) {
  return function (options) {
    var dest = _path2.default.join(options.dest, _dest);
    var glob = (0, _destglob10.default)(_glob, options.dest);
    return (0, _equalFileContents2.default)(glob, dest, _gulpBabel2.default, options.dest);
  };
};

var touchFile = exports.touchFile = function touchFile(_file) {
  return function (options) {
    var _destglob = (0, _destglob10.default)(_file, options.dest),
        _destglob2 = (0, _slicedToArray3.default)(_destglob, 1),
        file = _destglob2[0];

    return (0, _touch2.default)(file);
  };
};

var deleteFile = exports.deleteFile = function deleteFile(_file) {
  return function (options) {
    var exec = function exec() {
      var _destglob3 = (0, _destglob10.default)(_file, options.dest),
          _destglob4 = (0, _slicedToArray3.default)(_destglob3, 1),
          file = _destglob4[0];

      return (0, _del2.default)(file);
    };

    return (0, _cleanupWrapper.chDir)(options.dest, exec)();
  };
};

var isDeleted = exports.isDeleted = function isDeleted(_file) {
  return function (options) {
    var _destglob5 = (0, _destglob10.default)(_file, options.dest),
        _destglob6 = (0, _slicedToArray3.default)(_destglob5, 1),
        file = _destglob6[0];

    return (0, _statAgain.expectEventuallyDeleted)(file);
  };
};

var isFound = exports.isFound = function isFound(_file) {
  return function (options) {
    var _destglob7 = (0, _destglob10.default)(_file, options.dest),
        _destglob8 = (0, _slicedToArray3.default)(_destglob7, 1),
        file = _destglob8[0];

    return (0, _statAgain.expectEventuallyFound)(file);
  };
};

var never = exports.never = function never(_msg) {
  return function (msg) {
    if (msg.match(new RegExp(_msg))) {
      throw new Error('Forbidden message "' + _msg + '" was caught');
    }
    return true;
  };
};

var nextTarget = exports.nextTarget = function nextTarget() {
  return function (options) {
    return 'Run next ' + options.target;
  };
};