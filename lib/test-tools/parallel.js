'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parallel = undefined;

var _classes = require('../classes');

const parallel = exports.parallel = (...queues) => new _classes.ParallelMessages(queues);