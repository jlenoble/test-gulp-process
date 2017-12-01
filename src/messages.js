import TaskMessages from './task-messages';

export default class Messages {
  constructor (messages) {
    const taskMessages = new TaskMessages(messages);

    Object.defineProperties(this, {
      taskMessages: {
        value: taskMessages,
      },
    });
  }

  async next (results) {
    const next = await this.taskMessages.next(results);
    this.globalFns = this.taskMessages.globalFns;
    this.message = this.taskMessages.message;
    this.fns = this.taskMessages.fns;
    return next;
  }

  async runCurrentFns (options) {
    const next = await this.taskMessages.runCurrentFns(options);
    this.nextTarget = this.taskMessages.nextTarget;
    return next;
  }
}
