'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parallel = undefined;

var _classes = require('../classes');

var parallel = exports.parallel = function parallel() {
  for (var _len = arguments.length, queues = Array(_len), _key = 0; _key < _len; _key++) {
    queues[_key] = arguments[_key];
  }

  return new _classes.ParallelMessages(queues);
};