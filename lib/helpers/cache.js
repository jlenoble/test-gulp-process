'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedFiles = exports.cacheFiles = exports.purgeCache = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _polypath = require('polypath');

var _classes = require('../classes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = {};

const purgeCache = exports.purgeCache = () => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

const cacheFiles = exports.cacheFiles = ({ glob, base1, base2, debug }) => {
  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glob, base1, base2)).then(files => Promise.all(files.map(file => {
    if (debug) {
      console.info(`${_chalk2.default.cyan('Caching')} file '${_chalk2.default.green(file)}'`);
    }
    return new _classes.File({ filepath: file, debug, cache }).cache();
  })));
};

const getCachedFiles = exports.getCachedFiles = ({ glob, base1, base2, debug }) => {
  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glob, base1, base2)).then(files => Promise.all(files.map(file => {
    const f = cache[file] && cache[file].file;
    if (debug) {
      if (f) {
        console.info(`${_chalk2.default.cyan('Remembering')} file '${_chalk2.default.green(f.filepath)}'`);
      } else {
        console.info(`File '${_chalk2.default.green(f.filepath)}' is ${_chalk2.default.cyan('not cached')}`);
      }
    }
    return f;
  })));
};