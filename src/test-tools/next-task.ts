import chalk from "chalk";
import { NextTaskOptions, NextTaskFn } from "./options";

export const runNextTask = (options: NextTaskOptions): string => {
  if (options && options.debug) {
    console.info(
      `${chalk.cyan("Running")} next task '${chalk.green(options.task)}'`
    );
  }

  return `Run next ${options.task}`;
};

export const nextTask = (): NextTaskFn => runNextTask;
