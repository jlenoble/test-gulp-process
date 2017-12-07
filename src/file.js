import fs from 'fs';
import {rebase, resolve} from 'polypath';
import chalk from 'chalk';

const cache = {};
let debug = false;

export const setDebug = yes => {
  debug = !!yes;
};

export const getDebug = () => debug;

export const purgeCache = () => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

export const cacheFiles = (glb, base1, base2) => {
  return resolve(rebase(glb, base1, base2)).then(files => Promise.all(
    files.map(file => {
      if (debug) {
        console.info(`${chalk.cyan('Caching')} file '${chalk.green(file)}'`);
        console.info(`Cache size is now: ${Object.keys(cache).length}`);
      }
      return (new File(file)).cache();
    })));
};

export const getCachedFiles = (glb, base1, base2) => {
  return resolve(rebase(glb, base1, base2)).then(files => Promise.all(
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

export default class File {
  constructor (filepath, base1, base2) {
    const [file] = rebase(filepath, base1 || process.cwd(), base2);
    Object.defineProperty(this, 'filepath', {
      value: file,
    });
  }

  cache () {
    const promises = [this.content(), this.stat()];
    const [content, stats] = promises;
    cache[this.filepath] = {file: this, content, stats};
    return Promise.all(promises);
  }

  content () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  }

  stat () {
    return new Promise((resolve, reject) => {
      fs.stat(this.filepath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (debug) {
          console.info(`${chalk.green(this.filepath)} was last modified: ${
            chalk.magenta(stats.mtime)}`);
        }
        resolve(stats);
      });
    });
  }

  isNewer () {
    return cache[this.filepath].stats.then(stat1 => this.stat().then(
      stat2 => {
        const yes = stat2.mtime.getTime() > stat1.mtime.getTime();
        if (yes && debug) {
          console.info(`${chalk.green(this.filepath)} is ${
            chalk.cyan('newer')}`);
          console.info(`diff is ${chalk.cyan(stat2.mtime.getTime() -
            stat1.mtime.getTime())} ms`);
        }
        return yes;
      }));
  }

  isUntouched () {
    return cache[this.filepath].stats.then(stat1 => this.stat().then(
      stat2 => {
        const yes = stat2.mtime.getTime() === stat1.mtime.getTime();
        if (yes && debug) {
          console.info(`${chalk.green(this.filepath)} is ${
            chalk.cyan('untouched')}`);
        }
        return yes;
      }));
  }

  isSameContent () {
    return cache[this.filepath].content.then(content1 => this.content().then(
      content2 => {
        const yes = content2 === content1;
        if (yes && debug) {
          console.info(`${chalk.green(this.filepath)} is ${
            chalk.cyan('unchanged')}`);
        }
        return yes;
      }));
  }

  isChangedContent () {
    return cache[this.filepath].content.then(content1 => this.content().then(
      content2 => {
        const yes = content2 !== content1;
        if (yes && debug) {
          console.info(`${chalk.green(this.filepath)} is ${
            chalk.cyan('changed')}`);
        }
        return yes;
      }));
  }
}
