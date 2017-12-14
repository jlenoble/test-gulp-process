import chalk from 'chalk';
import {rebaseGlob} from 'polypath';
import del from 'del';
import {chDir} from 'cleanup-wrapper';

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
