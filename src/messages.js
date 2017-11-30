import {waitForMessage} from './messages-helpers';

const genMessages = function* (messages) {
  const array = messages.map(msg => {
    return Array.isArray(msg) ? msg[0] : msg;
  }).filter(msg => typeof msg === 'string');
  yield* array;
};

const genOnEachMessageFunctions = function* (messages) {
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

const genOnMessageFunctions = function* (messages) {
  const array = messages.map(msg => {
    if (Array.isArray(msg)) {
      const [, ...fns] = msg;
      return fns;
    }
    return null;
  });
  yield* array;
};

export default class Messages {
  constructor (messages) {
    Object.defineProperties(this, {
      messages: {
        value: genMessages(messages),
      },

      onMessageFns: {
        value: genOnMessageFunctions(messages),
      },

      globalFns: {
        value: [...genOnEachMessageFunctions(messages)],
      },
    });
  }

  async next (results) {
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
      await fn(options);
    }
  }
}
