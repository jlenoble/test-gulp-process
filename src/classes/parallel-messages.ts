import chalk from "chalk";

export default class ParallelMessages {
  constructor(queues) {
    this.queues = queues.map(queue => queue.concat());
    this.messages = this.queues.map(queue => queue.shift());
    this.notStarted = true;
  }

  next(foundMessage) {
    let nextMessages;

    if (this.notStarted) {
      this.notStarted = false;
      nextMessages = this.messages;
    } else {
      const index = this.messages.findIndex(msg => msg === foundMessage);
      const queue = this.queues[index];
      if (queue.length) {
        this.messages[index] = queue.shift();
        nextMessages = [this.messages[index]];
      } else {
        this.messages.splice(index, 1);
        this.queues.splice(index, 1);
        nextMessages = [];
      }
    }

    if (this.debug) {
      console.info(
        `Current ${chalk.cyan("parallel")} messages '${chalk.green(
          JSON.stringify(this.messages)
        )}'`
      );
    }

    return nextMessages;
  }

  setDebug(debug) {
    this.debug = debug;
  }
}
