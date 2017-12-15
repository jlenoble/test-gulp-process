'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedFiles = exports.cacheFiles = exports.purgeCache = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _polypath = require('polypath');

var _classes = require('../classes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

var purgeCache = exports.purgeCache = function purgeCache() {
  (0, _keys2.default)(cache).forEach(function (key) {
    delete cache[key];
  });
};

var cacheFiles = exports.cacheFiles = function cacheFiles(_ref) {
  var glob = _ref.glob,
      base1 = _ref.base1,
      base2 = _ref.base2,
      debug = _ref.debug;

  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glob, base1, base2)).then(function (files) {
    return _promise2.default.all(files.map(function (file) {
      if (debug) {
        console.info(_chalk2.default.cyan('Caching') + ' file \'' + _chalk2.default.green(file) + '\'');
      }
      return new _classes.File({ filepath: file, debug: debug, cache: cache }).cache();
    }));
  });
};

var getCachedFiles = exports.getCachedFiles = function getCachedFiles(_ref2) {
  var glob = _ref2.glob,
      base1 = _ref2.base1,
      base2 = _ref2.base2,
      debug = _ref2.debug;

  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glob, base1, base2)).then(function (files) {
    return _promise2.default.all(files.map(function (file) {
      var f = cache[file] && cache[file].file;
      if (debug) {
        if (f) {
          console.info(_chalk2.default.cyan('Remembering') + ' file \'' + _chalk2.default.green(f.filepath) + '\'');
        } else {
          console.info('File \'' + _chalk2.default.green(f.filepath) + '\' is ' + _chalk2.default.cyan('not cached'));
        }
      }
      return f;
    }));
  });
};