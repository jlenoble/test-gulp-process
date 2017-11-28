'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.never = exports.isFound = exports.isDeleted = exports.deleteFile = exports.touchFile = exports.compareTranspiled = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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
Object.defineProperty(exports, 'touchFile', {
  enumerable: true,
  get: function get() {
    return _testTools.touchFile;
  }
});
Object.defineProperty(exports, 'deleteFile', {
  enumerable: true,
  get: function get() {
    return _testTools.deleteFile;
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
Object.defineProperty(exports, 'never', {
  enumerable: true,
  get: function get() {
    return _testTools.never;
  }
});

var _childProcessData = require('child-process-data');

var _childProcessData2 = _interopRequireDefault(_childProcessData);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _setupHelpers = require('./setup-helpers');

var _messagesHelpers = require('./messages-helpers');

var _cleanupHelpers = require('./cleanup-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testGulpProcess(opts) {
  return function () {
    this.timeout(opts.timeout // eslint-disable-line no-invalid-this
    || 20000);

    var options = (0, _assign2.default)({
      setupTest: function setupTest() {
        this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
        process.env.BABEL_DISABLE_CACHE = 1; // Don't use Babel caching for
        // these tests

        return _promise2.default.all([(0, _setupHelpers.copySources)(options), (0, _setupHelpers.copyGulpfile)(options), (0, _setupHelpers.copyBabelrc)(options)]).then(function () {
          return (0, _setupHelpers.linkNodeModules)(options);
        });
      },
      spawnTest: function spawnTest() {
        this.childProcess = (0, _child_process.spawn)('gulp', [options.target, '--gulpfile', _path2.default.join(options.dest, 'gulpfile.babel.js')], { detached: true // Make sure all test processes will be killed
        });

        return (0, _childProcessData2.default)(this.childProcess);
      },
      checkResults: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
          var genMessages, genOnEachMessageFunctions, genOnMessageFunctions, messages, onMessageFunctions, globalFunctions, message, onMessageFns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

          return _regenerator2.default.wrap(function _callee$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  genMessages = /*#__PURE__*/_regenerator2.default.mark(function genMessages(messages) {
                    var array;
                    return _regenerator2.default.wrap(function genMessages$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            array = messages.map(function (msg) {
                              return Array.isArray(msg) ? msg[0] : msg;
                            }).filter(function (msg) {
                              return typeof msg === 'string';
                            });
                            return _context.delegateYield(array, 't0', 2);

                          case 2:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, genMessages, this);
                  });
                  genOnEachMessageFunctions = /*#__PURE__*/_regenerator2.default.mark(function genOnEachMessageFunctions(messages) {
                    var array;
                    return _regenerator2.default.wrap(function genOnEachMessageFunctions$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            array = [];

                            messages.every(function (msg) {
                              var yes = typeof msg === 'function';
                              if (yes) {
                                array.push(msg);
                              }
                              return yes;
                            });
                            return _context2.delegateYield(array, 't0', 3);

                          case 3:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, genOnEachMessageFunctions, this);
                  });
                  genOnMessageFunctions = /*#__PURE__*/_regenerator2.default.mark(function genOnMessageFunctions(messages) {
                    var array;
                    return _regenerator2.default.wrap(function genOnMessageFunctions$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            array = messages.map(function (msg) {
                              if (Array.isArray(msg)) {
                                var _msg = (0, _toArray3.default)(msg),
                                    fns = _msg.slice(1);

                                return fns;
                              }
                              return null;
                            });
                            return _context3.delegateYield(array, 't0', 2);

                          case 2:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, genOnMessageFunctions, this);
                  });
                  messages = genMessages(this.messages);
                  onMessageFunctions = genOnMessageFunctions(this.messages);
                  globalFunctions = [].concat((0, _toConsumableArray3.default)(genOnEachMessageFunctions(this.messages)));
                  message = messages.next();
                  onMessageFns = onMessageFunctions.next();

                case 8:
                  _context4.t0 = !message.done;

                  if (!_context4.t0) {
                    _context4.next = 13;
                    break;
                  }

                  _context4.next = 12;
                  return this.waitForMessage(results, message.value);

                case 12:
                  _context4.t0 = _context4.sent;

                case 13:
                  if (!_context4.t0) {
                    _context4.next = 47;
                    break;
                  }

                  results.testUpTo(globalFunctions);

                  results.forgetUpTo(message.value, { included: true });

                  if (!(onMessageFns.value !== null)) {
                    _context4.next = 43;
                    break;
                  }

                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context4.prev = 20;
                  _iterator = (0, _getIterator3.default)(onMessageFns.value);

                case 22:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context4.next = 29;
                    break;
                  }

                  fn = _step.value;
                  _context4.next = 26;
                  return fn(options);

                case 26:
                  _iteratorNormalCompletion = true;
                  _context4.next = 22;
                  break;

                case 29:
                  _context4.next = 35;
                  break;

                case 31:
                  _context4.prev = 31;
                  _context4.t1 = _context4['catch'](20);
                  _didIteratorError = true;
                  _iteratorError = _context4.t1;

                case 35:
                  _context4.prev = 35;
                  _context4.prev = 36;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 38:
                  _context4.prev = 38;

                  if (!_didIteratorError) {
                    _context4.next = 41;
                    break;
                  }

                  throw _iteratorError;

                case 41:
                  return _context4.finish(38);

                case 42:
                  return _context4.finish(35);

                case 43:

                  message = messages.next();
                  onMessageFns = onMessageFunctions.next();
                  _context4.next = 8;
                  break;

                case 47:
                  return _context4.abrupt('return', results);

                case 48:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee, this, [[20, 31, 35, 43], [36,, 38, 42]]);
        }));

        function checkResults(_x) {
          return _ref.apply(this, arguments);
        }

        return checkResults;
      }(),
      tearDownTest: function tearDownTest() {
        var _this = this;

        return (0, _cleanupHelpers.cleanUp)(this.childProcess, options.dest, this.BABEL_DISABLE_CACHE).catch(function (err) {
          console.error('Failed to clean up after test');
          console.error('You should take time and check that:');
          console.error('- Directory ' + options.dest + ' is deleted');
          console.error('- Process ' + _this.childProcess.pid + ' is not running any more');
          return _promise2.default.reject(err);
        });
      },


      onSetupError: _cleanupHelpers.onError,
      onSpawnError: _cleanupHelpers.onError,
      onCheckResultsError: _cleanupHelpers.onError,

      waitForMessage: _messagesHelpers.waitForMessage
    }, { target: 'default' }, opts, { dest: (0, _setupHelpers.newDest)() });

    return (0, _childProcessData.makeSingleTest)(options)();
  };
}