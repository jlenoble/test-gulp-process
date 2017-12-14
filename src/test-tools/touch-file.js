import {rebaseGlob} from 'polypath';
import touchMs from 'touch-ms';
import chalk from 'chalk';

export const touchFile = _file => options => {
  const [file] = rebaseGlob(_file, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Touching')} file ${chalk.green(file)}`);
  }
  return touchMs(file);
};
