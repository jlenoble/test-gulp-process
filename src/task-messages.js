import {waitForMessage} from './messages-helpers';
import {ParallelMessages} from './test-tools';

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

      currentParallelMessages: {
        value: [],
      },

      globalFns: {
        value: [],
      },
    });
  }

  async next (results) {
    if (this.parallelMessages) {
      this.currentParallelMessages.push(
        ...this.parallelMessages.next(this.message));
    }

    if (this.currentParallelMessages.length) {
      return this.nextParallel(results);
    } else {
      this.parallelMessages = null;
    }

    // No parallel messages left, process next message
    const message = this.messages.next();
    const value = message.value;

    if (typeof value === 'string') {
      this.message = value;
      this.fns = null;
    } else if (Array.isArray(value)) {
      this.fns = value.filter(fn => typeof fn === 'function');
      this.currentParallelMessages.push(...value.filter(
        fn => typeof fn !== 'function'));
      return this.next(results);
    } else if (typeof value === 'function') {
      this.globalFns.push(value);
      return this.next(results);
    } else if (value instanceof ParallelMessages) {
      this.parallelMessages = value;
      return this.next(results);
    }

    return !message.done && await waitForMessage(results, this.message);
  }

  async nextParallel (results) {
    // Parallel messages are treated as 'equivalent'.
    // We search for the first to appear in results and expose it as
    // this.message while removing it from the buffer.
    // This tries to rectify the mess that occurs when tasks are run
    // in parallel.
    await waitForMessage(results, this.currentParallelMessages[0]);

    const indices = this.currentParallelMessages.map(msg => {
      const index = results.allMessages.findIndex(
        el => el.match(new RegExp(msg)));
      if (index === -1) {
        return null;
      }
      const pos = results.allMessages[index].indexOf(msg);
      return [index, pos];
    });

    let pos = 0;
    indices.reduce((idx1, idx2, i) => {
      if (idx2 && (idx2[0] < idx1[0] ||
        (idx2[0] === idx1[0] && idx2[1] < idx1[1]))) {
        pos = i;
        return idx2;
      }
      return idx1;
    });

    this.message = this.currentParallelMessages[pos];
    this.currentParallelMessages.splice(pos, 1);

    return true;
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
