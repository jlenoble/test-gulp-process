import {resolveGlob, rebaseGlob} from 'polypath';
import chalk from 'chalk';
import {expectEventuallyFound} from 'stat-again';

export const isFound = _file => options => {
  const destGlob = rebaseGlob(_file, options.dest);

  return resolveGlob(destGlob).then(files => {
    if (!files.length) {
      const str = JSON.stringify(destGlob);

      if (options && options.debug) {
        console.info(`${chalk.cyan('Checking')} whether ${
          chalk.green(str)} can be found`);
      }

      return Promise.reject(new Error(`${str} resolves to nothing`));
    }

    return Promise.all(
      files.map(file => {
        if (options && options.debug) {
          console.info(`${chalk.cyan('Checking')} whether ${
            chalk.green(file)} can be found`);
        }

        return expectEventuallyFound(file);
      }));
  });
};
