'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snapshot = undefined;

var _helpers = require('../helpers');

const snapshot = exports.snapshot = glob => options => {
  return (0, _helpers.cacheFiles)({ glob, base1: options.dest,
    debug: options && options.debug });
};