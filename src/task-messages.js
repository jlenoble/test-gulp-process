import {waitForMessage} from './messages-helpers';

const genMessages = function* (messages) {
  yield* messages;
};

export default class TaskMessages {
  constructor (msgs) {
    // Clone msgs to not share it across instances
    const messages = msgs.concat();

    Object.defineProperties(this, {
      messages: {
        value: genMessages(messages),
      },

      globalFns: {
        value: [],
      },
    });
  }

  async next (results) {
    const message = this.messages.next();
    const value = message.value;

    if (typeof value === 'string') {
      this.message = value;
      this.fns = null;
    } else if (Array.isArray(value)) {
      const [msg, ...fns] = value;
      this.message = msg;
      this.fns = fns;
    } else if (typeof value === 'function') {
      this.globalFns.push(value);
      return this.next(results);
    }

    return !message.done && await waitForMessage(results, this.message);
  }

  async runCurrentFns (options) {
    if (this.fns === null) {
      return;
    }

    for (let fn of this.fns) {
      if (`Run next ${options.task}` === await fn(options)) {
        this.nextTask = true;
      }
    }
  }
}
