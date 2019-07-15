import chalk from "chalk";
import { waitForMessage } from "../helpers";
import { Fn } from "../test-tools/options";
import ParallelMessages from "./parallel-messages";
import { Result } from "child-process-data";

type MessageOption = string | (string | Fn)[];
export type TaskMessagesArray = MessageOption[];

export interface TaskMessagesOptions {
  debug?: boolean;
}

const genMessages = function*(
  messages: TaskMessagesArray
): IterableIterator<MessageOption> {
  yield* messages;
};

export default class TaskMessages {
  protected debug: boolean;
  protected message?: MessageOption;
  protected messages: IterableIterator<MessageOption>;
  protected currentParallelMessages: string[] = [];
  protected parallelMessages: ParallelMessages | null = null;
  protected globalFns = [];
  protected fns = [];
  protected _nextTask: boolean = false;

  public get nextTask(): boolean {
    return this._nextTask;
  }

  public set nextTask(yes: boolean) {
    this._nextTask = yes;
  }

  public constructor(msgs: TaskMessagesArray, options: TaskMessagesOptions) {
    // Clone msgs to not share it across instances
    const messages = msgs.concat();
    this.messages = genMessages(messages);

    this.debug = !!(options && options.debug);
  }

  public async next(results: Result): Promise<boolean> {
    if (this.parallelMessages) {
      this.currentParallelMessages.push(
        ...this.parallelMessages.next(this.message)
      );
    }

    if (this.currentParallelMessages.length) {
      return this.nextParallel(results);
    } else {
      this.parallelMessages = null;
    }

    // No parallel messages left, process next message
    const message = this.messages.next();
    const value = message.value;

    if (typeof value === "string") {
      this.message = value;
      this.fns = null;
    } else if (Array.isArray(value)) {
      this.fns = value.filter((fn): boolean => typeof fn === "function");
      this.currentParallelMessages.push(
        ...value.filter((fn): boolean => typeof fn !== "function")
      );
      return this.next(results);
    } else if (typeof value === "function") {
      this.globalFns.push(value);
      return this.next(results);
    } else if (value instanceof ParallelMessages) {
      this.parallelMessages = value;
      value.setDebug(this.debug);
      return this.next(results);
    }

    if (!message.done && this.debug) {
      console.info(
        `${chalk.cyan("Waiting for")} message '${chalk.green(this.message)}'`
      );
    }

    return !message.done && (await waitForMessage(results, this.message));
  }

  public async nextParallel(results: Result): Promise<boolean> {
    // Parallel messages are treated as 'equivalent'.
    // We search for the first to appear in results and expose it as
    // this.message while removing it from the buffer.
    // This tries to rectify the mess that occurs when tasks are run
    // in parallel.
    const searchedMessage = this.currentParallelMessages[0];

    if (this.debug) {
      console.info(
        `${chalk.cyan("Waiting for")} message '${chalk.green(searchedMessage)}'`
      );
    }

    await waitForMessage(results, searchedMessage);

    const indices = this.currentParallelMessages.map((msg): [
      number,
      number
    ] => {
      const _msg = msg.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      const index = results
        .allMessages()
        .findIndex((el): boolean => !!el.match(new RegExp(_msg)));
      if (index === -1) {
        return null;
      }
      const pos = results.allMessages()[index].indexOf(msg);
      return [index, pos];
    });

    let pos = 0;
    indices.reduce((idx1, idx2, i): [number, number] => {
      if (
        idx2 &&
        (idx2[0] < idx1[0] || (idx2[0] === idx1[0] && idx2[1] < idx1[1]))
      ) {
        pos = i;
        return idx2;
      }
      return idx1;
    });

    this.message = this.currentParallelMessages[pos];
    this.currentParallelMessages.splice(pos, 1);

    if (this.debug) {
      if (this.message !== searchedMessage) {
        console.info(
          `${chalk.cyan("But")} parallel message '${chalk.green(
            this.message
          )}' was found ${chalk.cyan("first")}`
        );
      }
    }

    return true;
  }

  public async runCurrentFns(options): Promise<void> {
    if (this.fns === null) {
      return;
    }

    for (const fn of this.fns) {
      if (`Run next ${options.task}` === (await fn(options))) {
        this.nextTask = true;
      }
    }
  }
}
