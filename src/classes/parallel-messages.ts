import chalk from "chalk";

export default class ParallelMessages {
  protected debug: boolean = false;
  protected notStarted: boolean = true;
  protected queues: string[][];
  protected messages: string[];

  public constructor(queues: string[]) {
    this.queues = queues.map((queue): string[] => [...queue]);
    this.messages = this.queues.map((queue): string => queue.shift() as string);
    this.notStarted = true;
  }

  public next(foundMessage: string): string[] {
    let nextMessages: string[];

    if (this.notStarted) {
      this.notStarted = false;
      nextMessages = this.messages;
    } else {
      const index = this.messages.findIndex(
        (msg): boolean => msg === foundMessage
      );
      const queue = this.queues[index];
      if (queue.length) {
        this.messages[index] = queue.shift() as string;
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

  public setDebug(debug: boolean): void {
    this.debug = debug;
  }
}
