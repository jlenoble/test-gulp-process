import path from 'path';
import {rebaseGlob} from 'polypath';
import equalFileContents from 'equal-file-contents';
import touchMs from 'touch-ms';
import del from 'del';
import chalk from 'chalk';
import babel from 'gulp-babel';
import {chDir} from 'cleanup-wrapper';
import {expectEventuallyDeleted, expectEventuallyFound} from 'stat-again';
import {cacheFiles, getCachedFiles} from './file';

export const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = rebaseGlob(_glob, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} transpilation of ${
      chalk.green(glob)}`);
  }
  return equalFileContents(glob, dest, babel, options.dest);
};

export const deleteFile = _file => options => {
  const exec = () => {
    const [file] = rebaseGlob(_file, options.dest);
    if (options && options.debug) {
      console.info(`${chalk.cyan('Deleting')} ${chalk.green(file)}`);
    }
    return del(file);
  };

  return chDir(options.dest, exec)();
};

export const isDeleted = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} whether ${
      chalk.green(file)} is deleted`);
  }
  return expectEventuallyDeleted(file);
};

export const isFound = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} whether ${
      chalk.green(file)} can be found`);
  }
  return expectEventuallyFound(file);
};

const isSame = (method, notText) => glob => options => {
  return getCachedFiles({glob, base1: options.dest}).then(
    files => Promise.all(files.map(file => file[method]()))).then(truths => {
    if (!truths.every(yes => yes)) {
      throw new Error(`${JSON.stringify(glob)} is not ${notText}`);
    }
    return true;
  });
};

export const isNewer = isSame('isNewer', 'newer');
export const isUntouched = isSame('isUntouched', 'untouched');
export const isSameContent = isSame('isSameContent', 'same content');
export const isChangedContent = isSame('isChangedContent', 'changed content');

export const never = _msg => (msg, options) => {
  if (options && options.debug) {
    console.info(`${chalk.cyan('ensuring')} '${chalk.green(
      msg)}' doesn't match '${chalk.green(_msg)}'`);
  }
  if (msg.match(new RegExp(_msg.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')))) {
    throw new Error(`Forbidden message "${_msg}" was caught`);
  }
  return true;
};

export const runNextTask = options => {
  if (options && options.debug) {
    console.info(`${chalk.cyan('Running')} next task '${
      chalk.green(options.task)}'`);
  }
  return `Run next ${options.task}`;
};
export const nextTask = () => runNextTask;

export class ParallelMessages {
  constructor (queues) {
    this.queues = queues.map(queue => queue.concat());
    this.messages = this.queues.map(queue => queue.shift());
    this.notStarted = true;
  }

  next (foundMessage) {
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
      console.info(`Current ${chalk.cyan('parallel')} messages '${
        chalk.green(JSON.stringify(this.messages))}'`);
    }

    return nextMessages;
  }

  setDebug (debug) {
    this.debug = debug;
  }
}
export const parallel = (...queues) => new ParallelMessages(queues);

export const snapshot = glob => options => {
  return cacheFiles({glob, base1: options.dest,
    debug: options && options.debug});
};

export const touchFile = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Touching')} file ${chalk.green(file)}`);
  }
  return touchMs(file);
};
