'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snapshot = undefined;

var _helpers = require('../helpers');

var snapshot = exports.snapshot = function snapshot(glob) {
  return function (options) {
    return (0, _helpers.cacheFiles)({ glob: glob, base1: options.dest,
      debug: options && options.debug });
  };
};