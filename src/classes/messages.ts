import TaskMessages, {
  TaskMessagesArray,
  TaskMessagesOptions,
  TestFunction
} from "./task-messages";
import { runNextTask } from "../test-tools";
import { Result } from "child-process-data";

const splitMessages = (
  messages: TaskMessagesArray,
  options: TaskMessagesOptions
): TaskMessages[] => {
  const msgs = [];
  const taskMessages = [];

  for (const msg of messages) {
    msgs.push(msg);

    if (Array.isArray(msg)) {
      const [, ...fns] = msg;

      if (fns.length && fns.some((fn): boolean => fn === runNextTask)) {
        taskMessages.push(new TaskMessages(msgs, options));
        msgs.length = 0;
      }
    }
  }

  taskMessages.push(new TaskMessages(msgs, options));

  return taskMessages;
};

export default class Messages {
  protected nextTask: boolean = false;
  protected index: number = 0;
  protected _taskMessages: TaskMessages[];

  public get taskMessages(): TaskMessages {
    return this._taskMessages[this.index];
  }

  public get globalFns(): TestFunction[] {
    return this.taskMessages.globalFns;
  }

  public get message(): string {
    return this.taskMessages.message;
  }

  public constructor(
    messages: TaskMessagesArray,
    options: TaskMessagesOptions
  ) {
    this._taskMessages = splitMessages(messages, options);
  }

  public async next(results: Result): Promise<boolean> {
    if (this.nextTask) {
      return (this.nextTask = false);
    }

    return this.taskMessages.next(results);
  }

  public async runCurrentFns(options: TaskMessagesOptions): Promise<void> {
    await this.taskMessages.runCurrentFns(options);

    if (this.taskMessages.nextTask) {
      this.index++;
      this.nextTask = true;
    }
  }
}
