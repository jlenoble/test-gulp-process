import fs from "fs";
import chalk from "chalk";
import { rebaseGlob } from "polypath";

export default class File {
  constructor({ filepath, base1, base2, debug, cache }) {
    const [file] = rebaseGlob(filepath, base1 || process.cwd(), base2);
    Object.defineProperties(this, {
      filepath: {
        value: file
      },
      _cache: {
        value: cache
      },
      debug: {
        value: debug
      }
    });
  }

  cache() {
    const promises = [this.content(), this.stat()];
    const [content, stats] = promises;
    this._cache[this.filepath] = { file: this, content, stats };
    if (this.debug) {
      console.info(`Cache size is now: ${Object.keys(this._cache).length}`);
    }
    return Promise.all(promises);
  }

  content() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, "utf8", (err, content) => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  }

  stat() {
    return new Promise((resolve, reject) => {
      fs.stat(this.filepath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (this.debug) {
          console.info(
            `${chalk.green(this.filepath)} was last modified: ${chalk.magenta(
              stats.mtime
            )}`
          );
        }
        resolve(stats);
      });
    });
  }

  isNewer() {
    return this._cache[this.filepath].stats.then(stat1 =>
      this.stat().then(stat2 => {
        const yes = stat2.mtime.getTime() > stat1.mtime.getTime();
        if (yes && this.debug) {
          console.info(
            `${chalk.green(this.filepath)} is ${chalk.cyan("newer")}`
          );
          console.info(
            `diff is ${chalk.cyan(
              stat2.mtime.getTime() - stat1.mtime.getTime()
            )} ms`
          );
        }
        return yes;
      })
    );
  }

  isUntouched() {
    return this._cache[this.filepath].stats.then(stat1 =>
      this.stat().then(stat2 => {
        const yes = stat2.mtime.getTime() === stat1.mtime.getTime();
        if (yes && this.debug) {
          console.info(
            `${chalk.green(this.filepath)} is ${chalk.cyan("untouched")}`
          );
        }
        return yes;
      })
    );
  }

  isSameContent() {
    return this._cache[this.filepath].content.then(content1 =>
      this.content().then(content2 => {
        const yes = content2 === content1;
        if (yes && this.debug) {
          console.info(
            `${chalk.green(this.filepath)} is ${chalk.cyan("unchanged")}`
          );
        }
        return yes;
      })
    );
  }

  isChangedContent() {
    return this._cache[this.filepath].content.then(content1 =>
      this.content().then(content2 => {
        const yes = content2 !== content1;
        if (yes && this.debug) {
          console.info(
            `${chalk.green(this.filepath)} is ${chalk.cyan("changed")}`
          );
        }
        return yes;
      })
    );
  }
}
