import {waitForMessage} from './messages-helpers';

export const genMessages = function* (messages) {
  const array = messages.map(msg => {
    return Array.isArray(msg) ? msg[0] : msg;
  }).filter(msg => typeof msg === 'string');
  yield* array;
};

export const genOnAllMessageFunctions = function* (messages) {
  const array = [];
  messages.every(msg => {
    const yes = typeof msg === 'function';
    if (yes) {
      array.push(msg);
    }
    return yes;
  });
  yield* array;
};

export const genOnMessageFunctions = function* (messages) {
  const array = messages.map(msg => {
    if (Array.isArray(msg)) {
      const [, ...fns] = msg;
      return fns;
    }
    return null;
  });
  yield* array;
};

export default class TaskMessages {
  constructor (messages) {
    Object.defineProperties(this, {
      messages: {
        value: genMessages(messages),
      },

      onMessageFns: {
        value: genOnMessageFunctions(messages),
      },

      globalFns: {
        value: [...genOnAllMessageFunctions(messages)],
      },
    });
  }

  async next (results) {
    if (this.nextTask) {
      return this.nextTask = false;
    }

    let message = this.messages.next();

    this.message = message.value;
    this.fns = this.onMessageFns.next().value;

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
