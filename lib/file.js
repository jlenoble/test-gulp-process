'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedFiles = exports.cacheFiles = exports.purgeCache = exports.getDebug = exports.setDebug = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _polypath = require('polypath');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _cache = {};
var debug = false;

var setDebug = exports.setDebug = function setDebug(yes) {
  debug = !!yes;
};

var getDebug = exports.getDebug = function getDebug() {
  return debug;
};

var purgeCache = exports.purgeCache = function purgeCache() {
  (0, _keys2.default)(_cache).forEach(function (key) {
    delete _cache[key];
  });
};

var cacheFiles = exports.cacheFiles = function cacheFiles(glb, base1, base2) {
  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glb, base1, base2)).then(function (files) {
    return _promise2.default.all(files.map(function (file) {
      if (debug) {
        console.info(_chalk2.default.cyan('Caching') + ' file \'' + _chalk2.default.green(file) + '\'');
        console.info('Cache size is now: ' + (0, _keys2.default)(_cache).length);
      }
      return new File(file).cache();
    }));
  });
};

var getCachedFiles = exports.getCachedFiles = function getCachedFiles(glb, base1, base2) {
  return (0, _polypath.resolveGlob)((0, _polypath.rebaseGlob)(glb, base1, base2)).then(function (files) {
    return _promise2.default.all(files.map(function (file) {
      var f = _cache[file] && _cache[file].file;
      if (debug) {
        if (f) {
          console.info(_chalk2.default.cyan('Remembering') + ' file \'' + _chalk2.default.green(f.filepath) + '\'');
        } else {
          console.info('File \'' + _chalk2.default.green(f.filepath) + '\' is ' + _chalk2.default.cyan('not cached'));
        }
      }
      return f;
    }));
  });
};

var File = function () {
  function File(filepath, base1, base2) {
    (0, _classCallCheck3.default)(this, File);

    var _rebaseGlob = (0, _polypath.rebaseGlob)(filepath, base1 || process.cwd(), base2),
        _rebaseGlob2 = (0, _slicedToArray3.default)(_rebaseGlob, 1),
        file = _rebaseGlob2[0];

    Object.defineProperty(this, 'filepath', {
      value: file
    });
  }

  (0, _createClass3.default)(File, [{
    key: 'cache',
    value: function cache() {
      var promises = [this.content(), this.stat()];
      var content = promises[0],
          stats = promises[1];

      _cache[this.filepath] = { file: this, content: content, stats: stats };
      return _promise2.default.all(promises);
    }
  }, {
    key: 'content',
    value: function content() {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        _fs2.default.readFile(_this.filepath, 'utf8', function (err, content) {
          if (err) {
            return reject(err);
          }
          resolve(content);
        });
      });
    }
  }, {
    key: 'stat',
    value: function stat() {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        _fs2.default.stat(_this2.filepath, function (err, stats) {
          if (err) {
            return reject(err);
          }
          if (debug) {
            console.info(_chalk2.default.green(_this2.filepath) + ' was last modified: ' + _chalk2.default.magenta(stats.mtime));
          }
          resolve(stats);
        });
      });
    }
  }, {
    key: 'isNewer',
    value: function isNewer() {
      var _this3 = this;

      return _cache[this.filepath].stats.then(function (stat1) {
        return _this3.stat().then(function (stat2) {
          var yes = stat2.mtime.getTime() > stat1.mtime.getTime();
          if (yes && debug) {
            console.info(_chalk2.default.green(_this3.filepath) + ' is ' + _chalk2.default.cyan('newer'));
            console.info('diff is ' + _chalk2.default.cyan(stat2.mtime.getTime() - stat1.mtime.getTime()) + ' ms');
          }
          return yes;
        });
      });
    }
  }, {
    key: 'isUntouched',
    value: function isUntouched() {
      var _this4 = this;

      return _cache[this.filepath].stats.then(function (stat1) {
        return _this4.stat().then(function (stat2) {
          var yes = stat2.mtime.getTime() === stat1.mtime.getTime();
          if (yes && debug) {
            console.info(_chalk2.default.green(_this4.filepath) + ' is ' + _chalk2.default.cyan('untouched'));
          }
          return yes;
        });
      });
    }
  }, {
    key: 'isSameContent',
    value: function isSameContent() {
      var _this5 = this;

      return _cache[this.filepath].content.then(function (content1) {
        return _this5.content().then(function (content2) {
          var yes = content2 === content1;
          if (yes && debug) {
            console.info(_chalk2.default.green(_this5.filepath) + ' is ' + _chalk2.default.cyan('unchanged'));
          }
          return yes;
        });
      });
    }
  }, {
    key: 'isChangedContent',
    value: function isChangedContent() {
      var _this6 = this;

      return _cache[this.filepath].content.then(function (content1) {
        return _this6.content().then(function (content2) {
          var yes = content2 !== content1;
          if (yes && debug) {
            console.info(_chalk2.default.green(_this6.filepath) + ' is ' + _chalk2.default.cyan('changed'));
          }
          return yes;
        });
      });
    }
  }]);
  return File;
}();

exports.default = File;