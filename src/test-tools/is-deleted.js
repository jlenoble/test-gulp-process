import {rebaseGlob} from 'polypath';
import chalk from 'chalk';
import {expectEventuallyDeleted} from 'stat-again';

export const isDeleted = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} whether ${
      chalk.green(file)} is deleted`);
  }
  return expectEventuallyDeleted(file);
};
