'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _file = require('./file');

var _messagesHelpers = require('./messages-helpers');

var _testTools = require('./test-tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genMessages = /*#__PURE__*/_regenerator2.default.mark(function genMessages(messages) {
  return _regenerator2.default.wrap(function genMessages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.delegateYield(messages, 't0', 1);

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, genMessages, this);
});

var TaskMessages = function () {
  function TaskMessages(msgs) {
    (0, _classCallCheck3.default)(this, TaskMessages);

    // Clone msgs to not share it across instances
    var messages = msgs.concat();

    (0, _defineProperties2.default)(this, {
      messages: {
        value: genMessages(messages)
      },

      currentParallelMessages: {
        value: []
      },

      globalFns: {
        value: []
      }
    });
  }

  (0, _createClass3.default)(TaskMessages, [{
    key: 'next',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
        var _currentParallelMessa, message, value, _currentParallelMessa2;

        return _regenerator2.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.parallelMessages) {
                  (_currentParallelMessa = this.currentParallelMessages).push.apply(_currentParallelMessa, (0, _toConsumableArray3.default)(this.parallelMessages.next(this.message)));
                }

                if (!this.currentParallelMessages.length) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', this.nextParallel(results));

              case 5:
                this.parallelMessages = null;

              case 6:

                // No parallel messages left, process next message
                message = this.messages.next();
                value = message.value;

                if (!(typeof value === 'string')) {
                  _context2.next = 13;
                  break;
                }

                this.message = value;
                this.fns = null;
                _context2.next = 27;
                break;

              case 13:
                if (!Array.isArray(value)) {
                  _context2.next = 19;
                  break;
                }

                this.fns = value.filter(function (fn) {
                  return typeof fn === 'function';
                });
                (_currentParallelMessa2 = this.currentParallelMessages).push.apply(_currentParallelMessa2, (0, _toConsumableArray3.default)(value.filter(function (fn) {
                  return typeof fn !== 'function';
                })));
                return _context2.abrupt('return', this.next(results));

              case 19:
                if (!(typeof value === 'function')) {
                  _context2.next = 24;
                  break;
                }

                this.globalFns.push(value);
                return _context2.abrupt('return', this.next(results));

              case 24:
                if (!(value instanceof _testTools.ParallelMessages)) {
                  _context2.next = 27;
                  break;
                }

                this.parallelMessages = value;
                return _context2.abrupt('return', this.next(results));

              case 27:

                if (!message.done && (0, _file.getDebug)()) {
                  console.info(_chalk2.default.cyan('Waiting for') + ' message \'' + _chalk2.default.green(this.message) + '\'');
                }

                _context2.t0 = !message.done;

                if (!_context2.t0) {
                  _context2.next = 33;
                  break;
                }

                _context2.next = 32;
                return (0, _messagesHelpers.waitForMessage)(results, this.message);

              case 32:
                _context2.t0 = _context2.sent;

              case 33:
                return _context2.abrupt('return', _context2.t0);

              case 34:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function next(_x) {
        return _ref.apply(this, arguments);
      }

      return next;
    }()
  }, {
    key: 'nextParallel',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(results) {
        var searchedMessage, indices, pos;
        return _regenerator2.default.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Parallel messages are treated as 'equivalent'.
                // We search for the first to appear in results and expose it as
                // this.message while removing it from the buffer.
                // This tries to rectify the mess that occurs when tasks are run
                // in parallel.
                searchedMessage = this.currentParallelMessages[0];


                if ((0, _file.getDebug)()) {
                  console.info(_chalk2.default.cyan('Waiting for') + ' parallel message \'' + _chalk2.default.green(searchedMessage) + '\'');
                }

                _context3.next = 4;
                return (0, _messagesHelpers.waitForMessage)(results, searchedMessage);

              case 4:
                indices = this.currentParallelMessages.map(function (msg) {
                  var _msg = msg.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
                  var index = results.allMessages.findIndex(function (el) {
                    return el.match(new RegExp(_msg));
                  });
                  if (index === -1) {
                    return null;
                  }
                  var pos = results.allMessages[index].indexOf(msg);
                  return [index, pos];
                });
                pos = 0;

                indices.reduce(function (idx1, idx2, i) {
                  if (idx2 && (idx2[0] < idx1[0] || idx2[0] === idx1[0] && idx2[1] < idx1[1])) {
                    pos = i;
                    return idx2;
                  }
                  return idx1;
                });

                this.message = this.currentParallelMessages[pos];
                this.currentParallelMessages.splice(pos, 1);

                if ((0, _file.getDebug)()) {
                  if (this.message !== searchedMessage) {
                    console.info(_chalk2.default.cyan('But') + ' parallel message \'' + _chalk2.default.green(this.message) + '\' was found ' + _chalk2.default.cyan('first'));
                  }
                }

                return _context3.abrupt('return', true);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      function nextParallel(_x2) {
        return _ref2.apply(this, arguments);
      }

      return nextParallel;
    }()
  }, {
    key: 'runCurrentFns',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(options) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

        return _regenerator2.default.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.fns === null)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return');

              case 2:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 5;
                _iterator = (0, _getIterator3.default)(this.fns);

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 18;
                  break;
                }

                fn = _step.value;
                _context4.t0 = 'Run next ' + options.task;
                _context4.next = 12;
                return fn(options);

              case 12:
                _context4.t1 = _context4.sent;

                if (!(_context4.t0 === _context4.t1)) {
                  _context4.next = 15;
                  break;
                }

                this.nextTask = true;

              case 15:
                _iteratorNormalCompletion = true;
                _context4.next = 7;
                break;

              case 18:
                _context4.next = 24;
                break;

              case 20:
                _context4.prev = 20;
                _context4.t2 = _context4['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context4.t2;

              case 24:
                _context4.prev = 24;
                _context4.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 27:
                _context4.prev = 27;

                if (!_didIteratorError) {
                  _context4.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context4.finish(27);

              case 31:
                return _context4.finish(24);

              case 32:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee3, this, [[5, 20, 24, 32], [25,, 27, 31]]);
      }));

      function runCurrentFns(_x3) {
        return _ref3.apply(this, arguments);
      }

      return runCurrentFns;
    }()
  }]);
  return TaskMessages;
}();

exports.default = TaskMessages;
module.exports = exports['default'];