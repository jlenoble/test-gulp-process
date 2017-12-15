import {resolveGlob, rebaseGlob} from 'polypath';
import chalk from 'chalk';
import {expectEventuallyFound} from 'stat-again';

export const isFound = _file => options => {
  return resolveGlob(rebaseGlob(_file, options.dest)).then(files => Promise.all(
    files.map(file => {
      if (options && options.debug) {
        console.info(`${chalk.cyan('Checking')} whether ${
          chalk.green(file)} can be found`);
      }
      return expectEventuallyFound(file);
    })));
};
