'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedFiles = exports.cacheFiles = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _destglob5 = require('destglob');

var _destglob6 = _interopRequireDefault(_destglob5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _cache = {};

var cacheFiles = exports.cacheFiles = function cacheFiles(glb, dest) {
  return new _promise2.default(function (resolve, reject) {
    (0, _glob2.default)(glb, function (err, files) {
      if (err) {
        return reject(err);
      }
      _promise2.default.all(files.map(function (file) {
        return new File(file, dest).cache();
      })).then(resolve, reject);
    });
  });
};

var getCachedFiles = exports.getCachedFiles = function getCachedFiles(glb, dest) {
  return new _promise2.default(function (resolve, reject) {
    (0, _glob2.default)(glb, function (err, files) {
      if (err) {
        return reject(err);
      }
      _promise2.default.all(files.map(function (file) {
        var _destglob = (0, _destglob6.default)(file, dest),
            _destglob2 = (0, _slicedToArray3.default)(_destglob, 1),
            _file = _destglob2[0];

        return _cache[_file].file;
      })).then(resolve, reject);
    });
  });
};

var File = function () {
  function File(filepath, dest) {
    (0, _classCallCheck3.default)(this, File);

    var _destglob3 = (0, _destglob6.default)(filepath, dest),
        _destglob4 = (0, _slicedToArray3.default)(_destglob3, 1),
        file = _destglob4[0];

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
          return stat2.mtime > stat1.mtime;
        });
      });
    }
  }, {
    key: 'isSameContent',
    value: function isSameContent() {
      var _this4 = this;

      return _cache[this.filepath].content.then(function (content1) {
        return _this4.content().then(function (content2) {
          return content2 === content1;
        });
      });
    }
  }, {
    key: 'isChangedContent',
    value: function isChangedContent() {
      var _this5 = this;

      return _cache[this.filepath].content.then(function (content1) {
        return _this5.content().then(function (content2) {
          return content2 !== content1;
        });
      });
    }
  }]);
  return File;
}();

exports.default = File;