'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchFile = exports.snapshot = exports.parallel = exports.ParallelMessages = exports.nextTask = exports.runNextTask = exports.never = exports.isChangedContent = exports.isSameContent = exports.isUntouched = exports.isNewer = exports.isFound = exports.isDeleted = exports.deleteFile = exports.compareTranspiled = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _polypath = require('polypath');

var _equalFileContents = require('equal-file-contents');

var _equalFileContents2 = _interopRequireDefault(_equalFileContents);

var _touchMs = require('touch-ms');

var _touchMs2 = _interopRequireDefault(_touchMs);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _cleanupWrapper = require('cleanup-wrapper');

var _statAgain = require('stat-again');

var _file2 = require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compareTranspiled = exports.compareTranspiled = function compareTranspiled(_glob, _dest) {
  return function (options) {
    var dest = _path2.default.join(options.dest, _dest);
    var glob = (0, _polypath.rebaseGlob)(_glob, options.dest);
    if (options && options.debug) {
      console.info(_chalk2.default.cyan('Checking') + ' transpilation of ' + _chalk2.default.green(glob));
    }
    return (0, _equalFileContents2.default)(glob, dest, _gulpBabel2.default, options.dest);
  };
};

var deleteFile = exports.deleteFile = function deleteFile(_file) {
  return function (options) {
    var exec = function exec() {
      var _rebaseGlob = (0, _polypath.rebaseGlob)(_file, options.dest),
          _rebaseGlob2 = (0, _slicedToArray3.default)(_rebaseGlob, 1),
          file = _rebaseGlob2[0];

      if (options && options.debug) {
        console.info(_chalk2.default.cyan('Deleting') + ' ' + _chalk2.default.green(file));
      }
      return (0, _del2.default)(file);
    };

    return (0, _cleanupWrapper.chDir)(options.dest, exec)();
  };
};

var isDeleted = exports.isDeleted = function isDeleted(_file) {
  return function (options) {
    var _rebaseGlob3 = (0, _polypath.rebaseGlob)(_file, options.dest),
        _rebaseGlob4 = (0, _slicedToArray3.default)(_rebaseGlob3, 1),
        file = _rebaseGlob4[0];

    if (options && options.debug) {
      console.info(_chalk2.default.cyan('Checking') + ' whether ' + _chalk2.default.green(file) + ' is deleted');
    }
    return (0, _statAgain.expectEventuallyDeleted)(file);
  };
};

var isFound = exports.isFound = function isFound(_file) {
  return function (options) {
    var _rebaseGlob5 = (0, _polypath.rebaseGlob)(_file, options.dest),
        _rebaseGlob6 = (0, _slicedToArray3.default)(_rebaseGlob5, 1),
        file = _rebaseGlob6[0];

    if (options && options.debug) {
      console.info(_chalk2.default.cyan('Checking') + ' whether ' + _chalk2.default.green(file) + ' can be found');
    }
    return (0, _statAgain.expectEventuallyFound)(file);
  };
};

var isSame = function isSame(method, notText) {
  return function (glob) {
    return function (options) {
      return (0, _file2.getCachedFiles)({ glob: glob, base1: options.dest }).then(function (files) {
        return _promise2.default.all(files.map(function (file) {
          return file[method]();
        }));
      }).then(function (truths) {
        if (!truths.every(function (yes) {
          return yes;
        })) {
          throw new Error((0, _stringify2.default)(glob) + ' is not ' + notText);
        }
        return true;
      });
    };
  };
};

var isNewer = exports.isNewer = isSame('isNewer', 'newer');
var isUntouched = exports.isUntouched = isSame('isUntouched', 'untouched');
var isSameContent = exports.isSameContent = isSame('isSameContent', 'same content');
var isChangedContent = exports.isChangedContent = isSame('isChangedContent', 'changed content');

var never = exports.never = function never(_msg) {
  return function (msg, options) {
    if (options && options.debug) {
      console.info(_chalk2.default.cyan('ensuring') + ' \'' + _chalk2.default.green(msg) + '\' doesn\'t match \'' + _chalk2.default.green(_msg) + '\'');
    }
    if (msg.match(new RegExp(_msg.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')))) {
      throw new Error('Forbidden message "' + _msg + '" was caught');
    }
    return true;
  };
};

var runNextTask = exports.runNextTask = function runNextTask(options) {
  if (options && options.debug) {
    console.info(_chalk2.default.cyan('Running') + ' next task \'' + _chalk2.default.green(options.task) + '\'');
  }
  return 'Run next ' + options.task;
};
var nextTask = exports.nextTask = function nextTask() {
  return runNextTask;
};

var ParallelMessages = exports.ParallelMessages = function () {
  function ParallelMessages(queues) {
    (0, _classCallCheck3.default)(this, ParallelMessages);

    this.queues = queues.map(function (queue) {
      return queue.concat();
    });
    this.messages = this.queues.map(function (queue) {
      return queue.shift();
    });
    this.notStarted = true;
  }

  (0, _createClass3.default)(ParallelMessages, [{
    key: 'next',
    value: function next(foundMessage) {
      var nextMessages = void 0;

      if (this.notStarted) {
        this.notStarted = false;
        nextMessages = this.messages;
      } else {
        var index = this.messages.findIndex(function (msg) {
          return msg === foundMessage;
        });
        var queue = this.queues[index];
        if (queue.length) {
          this.messages[index] = queue.shift();
          nextMessages = [this.messages[index]];
        } else {
          this.messages.splice(index, 1);
          this.queues.splice(index, 1);
          nextMessages = [];
        }
      }

      if (this.debug) {
        console.info('Current ' + _chalk2.default.cyan('parallel') + ' messages \'' + _chalk2.default.green((0, _stringify2.default)(this.messages)) + '\'');
      }

      return nextMessages;
    }
  }, {
    key: 'setDebug',
    value: function setDebug(debug) {
      this.debug = debug;
    }
  }]);
  return ParallelMessages;
}();

var parallel = exports.parallel = function parallel() {
  for (var _len = arguments.length, queues = Array(_len), _key = 0; _key < _len; _key++) {
    queues[_key] = arguments[_key];
  }

  return new ParallelMessages(queues);
};

var snapshot = exports.snapshot = function snapshot(glob) {
  return function (options) {
    return (0, _file2.cacheFiles)({ glob: glob, base1: options.dest,
      debug: options && options.debug });
  };
};

var touchFile = exports.touchFile = function touchFile(_file) {
  return function (options) {
    var _rebaseGlob7 = (0, _polypath.rebaseGlob)(_file, options.dest),
        _rebaseGlob8 = (0, _slicedToArray3.default)(_rebaseGlob7, 1),
        file = _rebaseGlob8[0];

    if (options && options.debug) {
      console.info(_chalk2.default.cyan('Touching') + ' file ' + _chalk2.default.green(file));
    }
    return (0, _touchMs2.default)(file);
  };
};