'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkNodeModules = exports.copyBabelrc = exports.copyGulpfile = exports.copySources = exports.newDest = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _childProcessData = require('child-process-data');

var _childProcessData2 = _interopRequireDefault(_childProcessData);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counter = 0;

var newDest = function newDest() {
  counter++;
  return '/tmp/' + new Date().getTime() + '_' + counter;
};

var copySources = function copySources(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src(options.sources, { base: process.cwd() }).on('end', resolve).on('error', reject).pipe(_gulp2.default.dest(options.dest));
  });
};

var copyGulpfile = function copyGulpfile(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src(options.gulpfile, { base: 'test/gulpfiles' }).on('end', resolve).on('error', reject).pipe((0, _gulpRename2.default)('gulpfile.babel.js')).pipe(_gulp2.default.dest(options.dest));
  });
};

var copyBabelrc = function copyBabelrc(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src('.babelrc').on('end', resolve).on('error', reject).pipe(_gulp2.default.dest(options.dest));
  });
};

var linkNodeModules = function linkNodeModules(options) {
  return (0, _childProcessData2.default)((0, _child_process.spawn)('ln', ['-s', _path2.default.join(process.cwd(), 'node_modules'), options.dest]));
};

exports.newDest = newDest;
exports.copySources = copySources;
exports.copyGulpfile = copyGulpfile;
exports.copyBabelrc = copyBabelrc;
exports.linkNodeModules = linkNodeModules;