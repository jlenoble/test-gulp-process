'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSourcemap = undefined;

var _polypath = require('polypath');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _equalStreamContents = require('equal-stream-contents');

var _equalStreamContents2 = _interopRequireDefault(_equalStreamContents);

var _gulpReverseSourcemaps = require('gulp-reverse-sourcemaps');

var _gulpReverseSourcemaps2 = _interopRequireDefault(_gulpReverseSourcemaps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hasSourcemap = exports.hasSourcemap = (_glob, _dest) => options => {
  const dest = _path2.default.join(options.dest, _dest);
  const glob = (0, _polypath.rebaseGlob)(_glob, options.dest);
  if (options && options.debug) {
    console.info(`${_chalk2.default.cyan('Checking')} sourcemaps for ${_chalk2.default.green(glob)}`);
  }
  return (0, _equalStreamContents2.default)(_gulp2.default.src(glob), _gulp2.default.src((0, _polypath.rebaseGlob)(_glob, dest)).pipe((0, _gulpReverseSourcemaps2.default)(options.dest)));
};