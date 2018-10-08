'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchFile = undefined;

var _polypath = require('polypath');

var _touchMs = require('touch-ms');

var _touchMs2 = _interopRequireDefault(_touchMs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const touchFile = exports.touchFile = _file => options => {
  const destGlob = (0, _polypath.rebaseGlob)(_file, options.dest);

  return (0, _polypath.resolveGlob)(destGlob).then(files => {
    if (!files.length) {
      const str = JSON.stringify(destGlob);

      if (options && options.debug) {
        console.info(`${_chalk2.default.cyan('Checking')} whether ${_chalk2.default.green(str)} can be found`);
      }

      return Promise.reject(new Error(`${str} resolves to nothing`));
    }

    return Promise.all(files.map(file => {
      if (options && options.debug) {
        console.info(`${_chalk2.default.cyan('Touching')} file ${_chalk2.default.green(file)}`);
      }
      return (0, _touchMs2.default)(file);
    }));
  });
};