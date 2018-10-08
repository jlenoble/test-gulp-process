'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFound = undefined;

var _polypath = require('polypath');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _statAgain = require('stat-again');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isFound = exports.isFound = _file => options => {
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
        console.info(`${_chalk2.default.cyan('Checking')} whether ${_chalk2.default.green(file)} can be found`);
      }

      return (0, _statAgain.expectEventuallyFound)(file);
    }));
  });
};