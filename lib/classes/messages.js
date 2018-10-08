'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taskMessages = require('./task-messages');

var _taskMessages2 = _interopRequireDefault(_taskMessages);

var _testTools = require('../test-tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const splitMessages = (messages, options) => {
  const msgs = [];
  const taskMessages = [];

  for (let msg of messages) {
    msgs.push(msg);

    if (Array.isArray(msg)) {
      const [, ...fns] = msg;

      if (fns.length && fns.some(fn => fn === _testTools.runNextTask)) {
        taskMessages.push(new _taskMessages2.default(msgs, options));
        msgs.length = 0;
      }
    }
  }

  taskMessages.push(new _taskMessages2.default(msgs, options));

  return taskMessages;
};

class Messages {
  constructor(messages, options) {
    const taskMessages = splitMessages(messages, options);

    Object.defineProperties(this, {
      index: {
        value: 0,
        writable: true
      },

      taskMessages: {
        get() {
          return taskMessages[this.index];
        }
      },

      globalFns: {
        get() {
          return this.taskMessages.globalFns;
        }
      },

      message: {
        get() {
          return this.taskMessages.message;
        }
      }
    });
  }

  async next(results) {
    if (this.nextTask) {
      return this.nextTask = false;
    }

    return await this.taskMessages.next(results);
  }

  async runCurrentFns(options) {
    const next = await this.taskMessages.runCurrentFns(options);

    if (this.taskMessages.nextTask) {
      this.index++;
      this.nextTask = true;
    }

    return next;
  }
}
exports.default = Messages;
module.exports = exports.default;