import chalk from 'chalk';
import {rebaseGlob, resolveGlob} from 'polypath';
import {File} from '../classes';

const cache = {};

export const purgeCache = () => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

export const cacheFiles = ({glob, base1, base2, debug}) => {
  return resolveGlob(rebaseGlob(glob, base1, base2)).then(files => Promise.all(
    files.map(file => {
      if (debug) {
        console.info(`${chalk.cyan('Caching')} file '${chalk.green(file)}'`);
      }
      return (new File({filepath: file, debug, cache})).cache();
    })));
};

export const getCachedFiles = ({glob, base1, base2, debug}) => {
  return resolveGlob(rebaseGlob(glob, base1, base2)).then(files => Promise.all(
    files.map(file => {
      const f = cache[file] && cache[file].file;
      if (debug) {
        if (f) {
          console.info(`${chalk.cyan('Remembering')} file '${
            chalk.green(f.filepath)}'`);
        } else {
          console.info(`File '${chalk.green(f.filepath)}' is ${
            chalk.cyan('not cached')}`);
        }
      }
      return f;
    })));
};
