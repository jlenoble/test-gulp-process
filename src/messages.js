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

  next () {
    const message = this.messages.next();
    const onMessageFns = this.onMessageFns.next();

    return {
      value: {message: message.value, onMessageFns: onMessageFns.value},
      done: message.done,
    };
  }
}
