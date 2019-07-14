import TaskMessages from "./task-messages";
import { runNextTask } from "../test-tools";

const splitMessages = (messages, options) => {
  const msgs = [];
  const taskMessages = [];

  for (const msg of messages) {
    msgs.push(msg);

    if (Array.isArray(msg)) {
      const [, ...fns] = msg;

      if (fns.length && fns.some(fn => fn === runNextTask)) {
        taskMessages.push(new TaskMessages(msgs, options));
        msgs.length = 0;
      }
    }
  }

  taskMessages.push(new TaskMessages(msgs, options));

  return taskMessages;
};

export default class Messages {
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
      return (this.nextTask = false);
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
