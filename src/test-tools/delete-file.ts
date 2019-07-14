import chalk from 'chalk';
import {rebaseGlob, resolveGlob} from 'polypath';
import del from 'del';
import {chDir} from 'cleanup-wrapper';

export const deleteFile = _file => options => {
  const destGlob = rebaseGlob(_file, options.dest);

  return resolveGlob(destGlob).then(files => {
    if (!files.length) {
      const str = JSON.stringify(destGlob);

      if (options && options.debug) {
        console.info(`${chalk.green(str)} cannot be ${chalk.cyan('deleted')}:`);
      }

      return Promise.reject(new Error(`${
        chalk.green(str)} resolves to nothing`));
    }

    const exec = () => {
      return Promise.all(
        files.map(file => {
          if (options && options.debug) {
            console.info(`${chalk.cyan('Deleting')} ${chalk.green(file)}`);
          }
          return del(file);
        }));
    };

    return chDir(options.dest, exec)();
  });
};
