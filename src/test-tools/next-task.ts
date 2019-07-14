import chalk from 'chalk';

export const runNextTask = options => {
  if (options && options.debug) {
    console.info(`${chalk.cyan('Running')} next task '${
      chalk.green(options.task)}'`);
  }
  return `Run next ${options.task}`;
};
export const nextTask = () => runNextTask;
