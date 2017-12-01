import TaskMessages from './task-messages';
import {runNextTask} from './test-tools';

const splitMessages = messages => {
  const msgs = [];
  const taskMessages = [];

  for (let msg of messages) {
    msgs.push(msg);

    if (Array.isArray(msg)) {
      const [, ...fns] = msg;

      if (fns.length && fns.some(fn => fn === runNextTask)) {
        taskMessages.push(new TaskMessages(msgs));
        msgs.length = 0;
      }
    }
  }

  taskMessages.push(new TaskMessages(msgs));

  return taskMessages;
};

export default class Messages {
  constructor (messages) {
    const taskMessages = splitMessages(messages);

    Object.defineProperties(this, {
      index: {
        value: 0,
        writable: true,
      },

      taskMessages: {
        get () {
          return taskMessages[this.index];
        },
      },

      globalFns: {
        get () {
          return this.taskMessages.globalFns;
        },
      },

      message: {
        get () {
          return this.taskMessages.message;
        },
      },
    });
  }

  async next (results) {
    return await this.taskMessages.next(results);
  }

  async runCurrentFns (options) {
    return await this.taskMessages.runCurrentFns(options);
  }
}
