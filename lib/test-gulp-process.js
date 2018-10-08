'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchFile = exports.snapshot = exports.parallel = exports.nextTask = exports.never = exports.isUntouched = exports.isSameContent = exports.isNewer = exports.isFound = exports.isDeleted = exports.isChangedContent = exports.hasSourcemap = exports.deleteFile = exports.compareTranspiled = undefined;
exports.default = testGulpProcess;

var _testTools = require('./test-tools');

Object.defineProperty(exports, 'compareTranspiled', {
  enumerable: true,
  get: function () {
    return _testTools.compareTranspiled;
  }
});
Object.defineProperty(exports, 'deleteFile', {
  enumerable: true,
  get: function () {
    return _testTools.deleteFile;
  }
});
Object.defineProperty(exports, 'hasSourcemap', {
  enumerable: true,
  get: function () {
    return _testTools.hasSourcemap;
  }
});
Object.defineProperty(exports, 'isChangedContent', {
  enumerable: true,
  get: function () {
    return _testTools.isChangedContent;
  }
});
Object.defineProperty(exports, 'isDeleted', {
  enumerable: true,
  get: function () {
    return _testTools.isDeleted;
  }
});
Object.defineProperty(exports, 'isFound', {
  enumerable: true,
  get: function () {
    return _testTools.isFound;
  }
});
Object.defineProperty(exports, 'isNewer', {
  enumerable: true,
  get: function () {
    return _testTools.isNewer;
  }
});
Object.defineProperty(exports, 'isSameContent', {
  enumerable: true,
  get: function () {
    return _testTools.isSameContent;
  }
});
Object.defineProperty(exports, 'isUntouched', {
  enumerable: true,
  get: function () {
    return _testTools.isUntouched;
  }
});
Object.defineProperty(exports, 'never', {
  enumerable: true,
  get: function () {
    return _testTools.never;
  }
});
Object.defineProperty(exports, 'nextTask', {
  enumerable: true,
  get: function () {
    return _testTools.nextTask;
  }
});
Object.defineProperty(exports, 'parallel', {
  enumerable: true,
  get: function () {
    return _testTools.parallel;
  }
});
Object.defineProperty(exports, 'snapshot', {
  enumerable: true,
  get: function () {
    return _testTools.snapshot;
  }
});
Object.defineProperty(exports, 'touchFile', {
  enumerable: true,
  get: function () {
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

    const silent = !(opts.fullDebug || testGulpProcess.fullDebug);
    const debug = opts.debug || opts.fullDebug || testGulpProcess.debug || testGulpProcess.fullDebug;
    const messages = new _classes.Messages(opts.messages, { debug });
    const dest = (0, _helpers.newDest)();

    let tasks = opts.task || ['default'];

    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    const tests = tasks.map((task, nth) => {
      const options = Object.assign({
        setupTest() {
          this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
          process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
          // these tests

          // nth: Only copy sources on first gulp call in the series of tests
          return !nth ? Promise.all([(0, _helpers.copySources)(options), (0, _helpers.copyGulpfile)(options), (0, _helpers.copyBabelrc)(options)]).then(() => (0, _helpers.linkNodeModules)(options)) : Promise.resolve();
        },

        spawnTest() {
          this.childProcess = (0, _child_process.spawn)('gulp', [options.task, '--gulpfile', _path2.default.join(options.dest, 'gulpfile.babel.js')], { detached: true // Make sure all test processes will be killed
          });

          return (0, _childProcessData2.default)(this.childProcess, { silent });
        },

        async checkResults(results) {
          while (await messages.next(results)) {
            results.testUpTo(messages.globalFns, messages.message, { included: true });
            results.forgetUpTo(messages.message, { included: true });
            await messages.runCurrentFns(options);
          }

          return results;
        },

        tearDownTest() {
          return (0, _helpers.cleanUp)(this.childProcess, options.dest, this.BABEL_DISABLE_CACHE).catch(err => {
            console.error('Failed to clean up after test');
            console.error('You should take time and check that:');
            console.error(`- Directory ${options.dest} is deleted`);
            console.error(`- Process ${this.childProcess.pid} is not running any more`);
            return Promise.reject(err);
          });
        },

        onSetupError: _helpers.onError,
        onSpawnError: _helpers.onError,
        onCheckResultsError: _helpers.onError
      }, opts, { dest, task, debug });

      return (0, _childProcessData.makeSingleTest)((0, _helpers.wrapCallbacks)(options));
    });

    return tests.reduce((promise, test) => {
      return promise.then(() => test());
    }, Promise.resolve());
  };
}

testGulpProcess.setDebug = function (debug) {
  testGulpProcess.debug = debug;
};

testGulpProcess.setFullDebug = function (debug) {
  testGulpProcess.fullDebug = debug;
};