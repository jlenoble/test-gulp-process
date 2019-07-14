import fs, { Stats } from "fs";
import chalk from "chalk";
import { rebaseGlob } from "polypath";

interface CacheValue {
  file: File;
  content: Promise<string>;
  stats: Promise<Stats>;
}

export interface Cache {
  [key: string]: CacheValue;
}

interface FileOption {
  filepath: string;
  base1?: string;
  base2?: string;
  debug: boolean;
  cache: Cache;
}

export default class File {
  public readonly filepath: string;
  public readonly debug: boolean;
  public readonly _cache: Cache;

  public constructor({ filepath, base1, base2, debug, cache }: FileOption) {
    const [file] = rebaseGlob(filepath, base1 || process.cwd(), base2);

    this.filepath = file;
    this.debug = debug;
    this._cache = cache;
  }

  public cache(): void {
    this._cache[this.filepath] = {
      file: this,
      content: this.content(),
      stats: this.stat()
    };

    if (this.debug) {
      console.info(`Cache size is now: ${Object.keys(this._cache).length}`);
    }
  }

  public content(): Promise<string> {
    return new Promise((resolve, reject): void => {
      fs.readFile(this.filepath, "utf8", (err, content): void => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  }

  public stat(): Promise<Stats> {
    return new Promise((resolve, reject): void => {
      fs.stat(this.filepath, (err, stats): void => {
        if (err) {
          return reject(err);
        }
        if (this.debug) {
          console.info(
            `${chalk.green(this.filepath)} was last modified: ${chalk.magenta(
              stats.mtime.toLocaleString()
            )}`
          );
        }
        resolve(stats);
      });
    });
  }

  public async isNewer(): Promise<boolean> {
    const stat1 = await this._cache[this.filepath].stats;
    const stat2 = await this.stat();

    const yes = stat2.mtime.getTime() > stat1.mtime.getTime();

    if (yes && this.debug) {
      console.info(`${chalk.green(this.filepath)} is ${chalk.cyan("newer")}`);
      console.info(
        `diff is ${chalk.cyan(
          (stat2.mtime.getTime() - stat1.mtime.getTime()).toString()
        )} ms`
      );
    }

    return yes;
  }

  public async isUntouched(): Promise<boolean> {
    const stat1 = await this._cache[this.filepath].stats;
    const stat2 = await this.stat();

    const yes = stat2.mtime.getTime() === stat1.mtime.getTime();

    if (yes && this.debug) {
      console.info(
        `${chalk.green(this.filepath)} is ${chalk.cyan("untouched")}`
      );
    }

    return yes;
  }

  public async isSameContent(): Promise<boolean> {
    const content1 = await this._cache[this.filepath].content;
    const content2 = await this.content();

    const yes = content2 === content1;

    if (yes && this.debug) {
      console.info(
        `${chalk.green(this.filepath)} is ${chalk.cyan("unchanged")}`
      );
    }

    return yes;
  }

  public async isChangedContent(): Promise<boolean> {
    const content1 = await this._cache[this.filepath].content;
    const content2 = await this.content();

    const yes = content2 !== content1;

    if (yes && this.debug) {
      console.info(`${chalk.green(this.filepath)} is ${chalk.cyan("changed")}`);
    }

    return yes;
  }
}
