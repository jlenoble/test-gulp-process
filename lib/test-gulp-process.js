'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFound = exports.isDeleted = exports.deleteFile = exports.touchFile = exports.compareTranspiled = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
        this.childProcess = (0, _child_process.spawn)('gulp', ['--gulpfile', _path2.default.join(options.dest, 'gulpfile.babel.js')], { detached: true // Make sure all test processes will be killed
        });

        return (0, _childProcessData2.default)(this.childProcess);
      },
      checkResults: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
          var genMessages, genTestFunctions, messages, testFunctions, message, testFns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

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
                              if (Array.isArray(msg)) {
                                var _msg = (0, _toArray3.default)(msg),
                                    fns = _msg.slice(1);

                                return fns;
                              }
                              return null;
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
                  testFns = testFunctions.next();

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
                    _context3.next = 44;
                    break;
                  }

                  results.forgetUpTo(message.value, { included: true });

                  if (!(testFns.value !== null)) {
                    _context3.next = 40;
                    break;
                  }

                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context3.prev = 17;
                  _iterator = (0, _getIterator3.default)(testFns.value);

                case 19:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context3.next = 26;
                    break;
                  }

                  fn = _step.value;
                  _context3.next = 23;
                  return fn(options);

                case 23:
                  _iteratorNormalCompletion = true;
                  _context3.next = 19;
                  break;

                case 26:
                  _context3.next = 32;
                  break;

                case 28:
                  _context3.prev = 28;
                  _context3.t1 = _context3['catch'](17);
                  _didIteratorError = true;
                  _iteratorError = _context3.t1;

                case 32:
                  _context3.prev = 32;
                  _context3.prev = 33;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 35:
                  _context3.prev = 35;

                  if (!_didIteratorError) {
                    _context3.next = 38;
                    break;
                  }

                  throw _iteratorError;

                case 38:
                  return _context3.finish(35);

                case 39:
                  return _context3.finish(32);

                case 40:

                  message = messages.next();
                  testFns = testFunctions.next();
                  _context3.next = 6;
                  break;

                case 44:
                  return _context3.abrupt('return', results);

                case 45:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee, this, [[17, 28, 32, 40], [33,, 35, 39]]);
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
    }, opts, { dest: (0, _setupHelpers.newDest)() });

    return (0, _childProcessData.makeSingleTest)(options)();
  };
}