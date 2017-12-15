'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchFile = exports.snapshot = exports.parallel = exports.nextTask = exports.never = exports.isUntouched = exports.isSameContent = exports.isNewer = exports.isFound = exports.isDeleted = exports.isChangedContent = exports.hasSourcemap = exports.deleteFile = exports.compareTranspiled = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = testGulpProcess;

var _testTools = require('./test-tools');

Object.defineProperty(exports, 'compareTranspiled', {
  enumerable: true,
  get: function get() {
    return _testTools.compareTranspiled;
  }
});
Object.defineProperty(exports, 'deleteFile', {
  enumerable: true,
  get: function get() {
    return _testTools.deleteFile;
  }
});
Object.defineProperty(exports, 'hasSourcemap', {
  enumerable: true,
  get: function get() {
    return _testTools.hasSourcemap;
  }
});
Object.defineProperty(exports, 'isChangedContent', {
  enumerable: true,
  get: function get() {
    return _testTools.isChangedContent;
  }
});
Object.defineProperty(exports, 'isDeleted', {
  enumerable: true,
  get: function get() {
    return _testTools.isDeleted;
  }
});
Object.defineProperty(exports, 'isFound', {
  enumerable: true,
  get: function get() {
    return _testTools.isFound;
  }
});
Object.defineProperty(exports, 'isNewer', {
  enumerable: true,
  get: function get() {
    return _testTools.isNewer;
  }
});
Object.defineProperty(exports, 'isSameContent', {
  enumerable: true,
  get: function get() {
    return _testTools.isSameContent;
  }
});
Object.defineProperty(exports, 'isUntouched', {
  enumerable: true,
  get: function get() {
    return _testTools.isUntouched;
  }
});
Object.defineProperty(exports, 'never', {
  enumerable: true,
  get: function get() {
    return _testTools.never;
  }
});
Object.defineProperty(exports, 'nextTask', {
  enumerable: true,
  get: function get() {
    return _testTools.nextTask;
  }
});
Object.defineProperty(exports, 'parallel', {
  enumerable: true,
  get: function get() {
    return _testTools.parallel;
  }
});
Object.defineProperty(exports, 'snapshot', {
  enumerable: true,
  get: function get() {
    return _testTools.snapshot;
  }
});
Object.defineProperty(exports, 'touchFile', {
  enumerable: true,
  get: function get() {
    return _testTools.touchFile;
  }
});

var _childProcessData = require('child-process-data');

var _childProcessData2 = _interopRequireDefault(_childProcessData);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./helpers');

var _classes = require('./classes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testGulpProcess(opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
    || 20000);

    var silent = !(opts.fullDebug || testGulpProcess.fullDebug);
    var debug = opts.debug || opts.fullDebug || testGulpProcess.debug || testGulpProcess.fullDebug;
    var messages = new _classes.Messages(opts.messages, { debug: debug });
    var dest = (0, _helpers.newDest)();

    var tasks = opts.task || ['default'];

    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    var tests = tasks.map(function (task, nth) {
      var options = (0, _assign2.default)({
        setupTest: function setupTest() {
          this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
          process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
          // these tests

          // nth: Only copy sources on first gulp call in the series of tests
          return !nth ? _promise2.default.all([(0, _helpers.copySources)(options), (0, _helpers.copyGulpfile)(options), (0, _helpers.copyBabelrc)(options)]).then(function () {
            return (0, _helpers.linkNodeModules)(options);
          }) : _promise2.default.resolve();
        },
        spawnTest: function spawnTest() {
          this.childProcess = (0, _child_process.spawn)('gulp', [options.task, '--gulpfile', _path2.default.join(options.dest, 'gulpfile.babel.js')], { detached: true // Make sure all test processes will be killed
          });

          return (0, _childProcessData2.default)(this.childProcess, { silent: silent });
        },
        checkResults: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return messages.next(results);

                  case 2:
                    if (!_context.sent) {
                      _context.next = 9;
                      break;
                    }

                    results.testUpTo(messages.globalFns, messages.message, { included: true });
                    results.forgetUpTo(messages.message, { included: true });
                    _context.next = 7;
                    return messages.runCurrentFns(options);

                  case 7:
                    _context.next = 0;
                    break;

                  case 9:
                    return _context.abrupt('return', results);

                  case 10:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function checkResults(_x) {
            return _ref.apply(this, arguments);
          }

          return checkResults;
        }(),
        tearDownTest: function tearDownTest() {
          var _this = this;

          return (0, _helpers.cleanUp)(this.childProcess, options.dest, this.BABEL_DISABLE_CACHE).catch(function (err) {
            console.error('Failed to clean up after test');
            console.error('You should take time and check that:');
            console.error('- Directory ' + options.dest + ' is deleted');
            console.error('- Process ' + _this.childProcess.pid + ' is not running any more');
            return _promise2.default.reject(err);
          });
        },


        onSetupError: _helpers.onError,
        onSpawnError: _helpers.onError,
        onCheckResultsError: _helpers.onError
      }, opts, { dest: dest, task: task, debug: debug });

      return (0, _childProcessData.makeSingleTest)((0, _helpers.wrapCallbacks)(options));
    });

    return tests.reduce(function (promise, test) {
      return promise.then(function () {
        return test();
      });
    }, _promise2.default.resolve());
  };
}

testGulpProcess.setDebug = function (debug) {
  testGulpProcess.debug = debug;
};

testGulpProcess.setFullDebug = function (debug) {
  testGulpProcess.fullDebug = debug;
};