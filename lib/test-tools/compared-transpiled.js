'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareTranspiled = undefined;

var _polypath = require('polypath');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _equalFileContents = require('equal-file-contents');

var _equalFileContents2 = _interopRequireDefault(_equalFileContents);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const compareTranspiled = exports.compareTranspiled = (_glob, _dest) => options => {
  const dest = _path2.default.join(options.dest, _dest);
  const glob = (0, _polypath.rebaseGlob)(_glob, options.dest);
  if (options && options.debug) {
    console.info(`${_chalk2.default.cyan('Checking')} transpilation of ${_chalk2.default.green(glob)}`);
  }
  return (0, _equalFileContents2.default)(glob, dest, _gulpBabel2.default, options.dest);
};