import fs from 'fs';
import {rebase, resolve} from 'polypath';

const cache = {};

export const cacheFiles = (glb, base1, base2) => {
  return resolve(rebase(glb, base1, base2)).then(files => Promise.all(
    files.map(file => (new File(file)).cache())));
};

export const getCachedFiles = (glb, base1, base2) => {
  return resolve(rebase(glb, base1, base2)).then(files => Promise.all(
    files.map(file => cache[file] && cache[file].file)));
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
        resolve(stats);
      });
    });
  }

  isNewer () {
    return cache[this.filepath].stats.then(stat1 => this.stat().then(
      stat2 => stat2.mtime.getTime() > stat1.mtime.getTime()));
  }

  isUntouched () {
    return cache[this.filepath].stats.then(stat1 => this.stat().then(
      stat2 => stat2.mtime.getTime() === stat1.mtime.getTime()));
  }

  isSameContent () {
    return cache[this.filepath].content.then(content1 => this.content().then(
      content2 => content2 === content1));
  }

  isChangedContent () {
    return cache[this.filepath].content.then(content1 => this.content().then(
      content2 => content2 !== content1));
  }
}