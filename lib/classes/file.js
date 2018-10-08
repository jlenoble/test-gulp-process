'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _polypath = require('polypath');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class File {
  constructor({ filepath, base1, base2, debug, cache }) {
    const [file] = (0, _polypath.rebaseGlob)(filepath, base1 || process.cwd(), base2);
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
      _fs2.default.readFile(this.filepath, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  }

  stat() {
    return new Promise((resolve, reject) => {
      _fs2.default.stat(this.filepath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (this.debug) {
          console.info(`${_chalk2.default.green(this.filepath)} was last modified: ${_chalk2.default.magenta(stats.mtime)}`);
        }
        resolve(stats);
      });
    });
  }

  isNewer() {
    return this._cache[this.filepath].stats.then(stat1 => this.stat().then(stat2 => {
      const yes = stat2.mtime.getTime() > stat1.mtime.getTime();
      if (yes && this.debug) {
        console.info(`${_chalk2.default.green(this.filepath)} is ${_chalk2.default.cyan('newer')}`);
        console.info(`diff is ${_chalk2.default.cyan(stat2.mtime.getTime() - stat1.mtime.getTime())} ms`);
      }
      return yes;
    }));
  }

  isUntouched() {
    return this._cache[this.filepath].stats.then(stat1 => this.stat().then(stat2 => {
      const yes = stat2.mtime.getTime() === stat1.mtime.getTime();
      if (yes && this.debug) {
        console.info(`${_chalk2.default.green(this.filepath)} is ${_chalk2.default.cyan('untouched')}`);
      }
      return yes;
    }));
  }

  isSameContent() {
    return this._cache[this.filepath].content.then(content1 => this.content().then(content2 => {
      const yes = content2 === content1;
      if (yes && this.debug) {
        console.info(`${_chalk2.default.green(this.filepath)} is ${_chalk2.default.cyan('unchanged')}`);
      }
      return yes;
    }));
  }

  isChangedContent() {
    return this._cache[this.filepath].content.then(content1 => this.content().then(content2 => {
      const yes = content2 !== content1;
      if (yes && this.debug) {
        console.info(`${_chalk2.default.green(this.filepath)} is ${_chalk2.default.cyan('changed')}`);
      }
      return yes;
    }));
  }
}
exports.default = File;
module.exports = exports.default;