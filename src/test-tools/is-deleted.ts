import {rebaseGlob, resolveGlob} from 'polypath';
import chalk from 'chalk';
import {expectEventuallyDeleted} from 'stat-again';

export const isDeleted = _file => options => {
  const destGlob = rebaseGlob(_file, options.dest);

  return resolveGlob(destGlob).then(files => {
    if (!files.length) {
      const str = JSON.stringify(destGlob);

      if (options && options.debug) {
        console.info(`${chalk.cyan('Checking')} whether ${
          chalk.green(str)} is deleted`);

        console.info(`${chalk.green(str)} resolves to nothing`);
      }

      return Promise.resolve();
    }

    return Promise.all(
      files.map(file => {
        if (options && options.debug) {
          console.info(`${chalk.cyan('Checking')} whether ${
            chalk.green(file)} is deleted`);
        }

        return expectEventuallyDeleted(file);
      }));
  });
};
