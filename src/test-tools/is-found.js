import {rebaseGlob} from 'polypath';
import chalk from 'chalk';
import {expectEventuallyFound} from 'stat-again';

export const isFound = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} whether ${
      chalk.green(file)} can be found`);
  }
  return expectEventuallyFound(file);
};
