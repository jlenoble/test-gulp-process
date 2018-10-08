'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextTask = exports.runNextTask = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runNextTask = exports.runNextTask = options => {
  if (options && options.debug) {
    console.info(`${_chalk2.default.cyan('Running')} next task '${_chalk2.default.green(options.task)}'`);
  }
  return `Run next ${options.task}`;
};
const nextTask = exports.nextTask = () => runNextTask;