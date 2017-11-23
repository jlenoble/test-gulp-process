'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchFile = exports.compareTranspiled = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = testGulpProcess;

var _childProcessData = require('child-process-data');

var _childProcessData2 = _interopRequireDefault(_childProcessData);

var _destglob3 = require('destglob');

var _destglob4 = _interopRequireDefault(_destglob3);

var _equalFileContents = require('equal-file-contents');

var _equalFileContents2 = _interopRequireDefault(_equalFileContents);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counter = 0;

var newDest = function newDest() {
  counter++;
  return '/tmp/' + new Date().getTime() + '_' + counter;
};

var copySources = function copySources(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src(options.sources, { base: process.cwd() }).on('end', resolve).on('error', reject).pipe(_gulp2.default.dest(options.dest));
  });
};

var copyGulpfile = function copyGulpfile(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src(options.gulpfile, { base: 'test/gulpfiles' }).on('end', resolve).on('error', reject).pipe((0, _gulpRename2.default)('gulpfile.babel.js')).pipe(_gulp2.default.dest(options.dest));
  });
};

var copyBabelrc = function copyBabelrc(options) {
  return new _promise2.default(function (resolve, reject) {
    _gulp2.default.src('.babelrc').on('end', resolve).on('error', reject).pipe(_gulp2.default.dest(options.dest));
  });
};

var linkNodeModules = function linkNodeModules(options) {
  return (0, _childProcessData2.default)((0, _child_process.spawn)('ln', ['-s', _path2.default.join(process.cwd(), 'node_modules'), options.dest]));
};

var cleanUp = function cleanUp(childProcess, destDir, BABEL_DISABLE_CACHE) {
  if (childProcess && childProcess.exitCode === null) {
    process.kill(-childProcess.pid); // Kill test process if still alive
  }

  process.env.BABEL_DISABLE_CACHE = BABEL_DISABLE_CACHE;

  if (_path2.default.resolve(destDir).includes(process.cwd())) {
    return (0, _del2.default)(destDir);
  }

  return _promise2.default.resolve();
};

function onError(err) {
  return this.tearDownTest() // eslint-disable-line no-invalid-this
  .then(function () {
    return _promise2.default.reject(err);
  }, function (e) {
    console.error('Test originally failed with error:', err);
    console.error('But another error occurred in the meantime:');
    return _promise2.default.reject(e);
  });
}

var repeat = function repeat(action) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  var maxDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4000;

  var intervalId = void 0;
  var timeoutId = void 0;

  return new _promise2.default(function (resolve, reject) {
    var timeout = function timeout() {
      clearInterval(intervalId);
      reject(new Error('Waiting too long for child process to finish'));
    };

    intervalId = setInterval(function () {
      try {
        if (action()) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(true);
        }
      } catch (e) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        reject(e);
      }
    }, interval);

    timeoutId = setTimeout(timeout, maxDuration);
  });
};

var testMessage = function testMessage(results, message) {
  return results.allMessages.findIndex(function (el) {
    return el.match(new RegExp(message));
  }) !== -1;
};

function waitForMessage(results, message) {
  return repeat(function () {
    return testMessage(results, message);
  }).catch(function (err) {
    if (err.message.match(/Waiting too long for child process to finish/)) {
      throw new Error('Waiting too long for child process to finish:\nMessage \'' + message + '\' was never intercepted');
    }
    throw err;
  });
}

var compareTranspiled = function compareTranspiled(_glob, _dest) {
  return function (options) {
    var dest = _path2.default.join(options.dest, _dest);
    var glob = (0, _destglob4.default)(_glob, options.dest);
    return (0, _equalFileContents2.default)(glob, dest, _gulpBabel2.default, options.dest);
  };
};

var touchFile = function touchFile(_file) {
  return function (options) {
    var _destglob = (0, _destglob4.default)(_file, options.dest),
        _destglob2 = (0, _slicedToArray3.default)(_destglob, 1),
        file = _destglob2[0];

    return (0, _touch2.default)(file);
  };
};

function testGulpProcess(opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
    || 20000);

    var options = (0, _assign2.default)({
      setupTest: function setupTest() {
        this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
        process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
        // these tests

        return _promise2.default.all([copySources(options), copyGulpfile(options), copyBabelrc(options)]).then(function () {
          return linkNodeModules(options);
        });
      },
      spawnTest: function spawnTest() {
        this.childProcess = (0, _child_process.spawn)('gulp', ['--gulpfile', _path2.default.join(options.dest, 'gulpfile.babel.js')], { detached: true // Make sure all test processes will be killed
        });

        return (0, _childProcessData2.default)(this.childProcess);
      },
      checkResults: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
          var genMessages, genTestFunctions, messages, testFunctions, message, testFn;
          return _regenerator2.default.wrap(function _callee$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  genMessages = /*#__PURE__*/_regenerator2.default.mark(function genMessages(messages) {
                    var array;
                    return _regenerator2.default.wrap(function genMessages$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            array = messages.map(function (msg) {
                              return Array.isArray(msg) ? msg[0] : msg;
                            });
                            return _context.delegateYield(array, 't0', 2);

                          case 2:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, genMessages, this);
                  });
                  genTestFunctions = /*#__PURE__*/_regenerator2.default.mark(function genTestFunctions(messages) {
                    var array;
                    return _regenerator2.default.wrap(function genTestFunctions$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            array = messages.map(function (msg) {
                              return Array.isArray(msg) ? msg[1] : null;
                            });
                            return _context2.delegateYield(array, 't0', 2);

                          case 2:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, genTestFunctions, this);
                  });
                  messages = genMessages(this.messages);
                  testFunctions = genTestFunctions(this.messages);
                  message = messages.next();
                  testFn = testFunctions.next();

                case 6:
                  _context3.t0 = !message.done;

                  if (!_context3.t0) {
                    _context3.next = 11;
                    break;
                  }

                  _context3.next = 10;
                  return this.waitForMessage(results, message.value);

                case 10:
                  _context3.t0 = _context3.sent;

                case 11:
                  if (!_context3.t0) {
                    _context3.next = 20;
                    break;
                  }

                  results.forgetUpTo(message.value, { included: true });

                  if (!(testFn.value !== null)) {
                    _context3.next = 16;
                    break;
                  }

                  _context3.next = 16;
                  return testFn.value(options);

                case 16:

                  message = messages.next();
                  testFn = testFunctions.next();
                  _context3.next = 6;
                  break;

                case 20:
                  return _context3.abrupt('return', results);

                case 21:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee, this);
        }));

        function checkResults(_x3) {
          return _ref.apply(this, arguments);
        }

        return checkResults;
      }(),
      tearDownTest: function tearDownTest() {
        var _this = this;

        return cleanUp(this.childProcess, options.dest, this.BABEL_DISABLE_CACHE).catch(function (err) {
          console.error('Failed to clean up after test');
          console.error('You should take time and check that:');
          console.error('- Directory ' + options.dest + ' is deleted');
          console.error('- Process ' + _this.childProcess.pid + ' is not running any more');
          return _promise2.default.reject(err);
        });
      },


      onSetupError: onError,
      onSpawnError: onError,
      onCheckResultsError: onError,

      waitForMessage: waitForMessage
    }, opts, { dest: newDest() });

    return (0, _childProcessData.makeSingleTest)(options)();
  };
}

exports.compareTranspiled = compareTranspiled;
exports.touchFile = touchFile;