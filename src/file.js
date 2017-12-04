import glob from 'glob';
import fs from 'fs';
import destglob from 'destglob';

const cache = {};

export const cacheFiles = (glb, dest) => {
  return new Promise((resolve, reject) => {
    glob(glb, (err, files) => {
      if (err) {
        return reject(err);
      }
      Promise.all(files.map(file => (new File(file, dest)).cache()))
        .then(resolve, reject);
    });
  });
};

export const getCachedFiles = (glb, dest) => {
  return new Promise((resolve, reject) => {
    glob(glb, (err, files) => {
      if (err) {
        return reject(err);
      }
      Promise.all(files.map(file => {
        const [_file] = destglob(file, dest);
        return cache[_file].file;
      }))
        .then(resolve, reject);
    });
  });
};

export default class File {
  constructor (filepath, dest) {
    const [file] = destglob(filepath, dest);
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
      stat2 => stat2.mtime > stat1.mtime));
  }

  isOlder () {
    return cache[this.filepath].stats.then(stat1 => this.stat().then(
      stat2 => stat2.mtime < stat1.mtime));
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
