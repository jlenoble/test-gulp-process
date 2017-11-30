'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _messagesHelpers = require('./messages-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genMessages = /*#__PURE__*/_regenerator2.default.mark(function genMessages(messages) {
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

var genOnAllMessageFunctions = /*#__PURE__*/_regenerator2.default.mark(function genOnAllMessageFunctions(messages) {
  var array;
  return _regenerator2.default.wrap(function genOnAllMessageFunctions$(_context2) {
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
  }, genOnAllMessageFunctions, this);
});

var genOnMessageFunctions = /*#__PURE__*/_regenerator2.default.mark(function genOnMessageFunctions(messages) {
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

var Messages = function () {
  function Messages(messages) {
    (0, _classCallCheck3.default)(this, Messages);

    (0, _defineProperties2.default)(this, {
      messages: {
        value: genMessages(messages)
      },

      onMessageFns: {
        value: genOnMessageFunctions(messages)
      },

      globalFns: {
        value: [].concat((0, _toConsumableArray3.default)(genOnAllMessageFunctions(messages)))
      }
    });
  }

  (0, _createClass3.default)(Messages, [{
    key: 'next',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
        var message;
        return _regenerator2.default.wrap(function _callee$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.nextTarget) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', this.nextTarget = false);

              case 2:
                message = this.messages.next();


                this.message = message.value;
                this.fns = this.onMessageFns.next().value;

                _context4.t0 = !message.done;

                if (!_context4.t0) {
                  _context4.next = 10;
                  break;
                }

                _context4.next = 9;
                return (0, _messagesHelpers.waitForMessage)(results, this.message);

              case 9:
                _context4.t0 = _context4.sent;

              case 10:
                return _context4.abrupt('return', _context4.t0);

              case 11:
              case 'end':
                return _context4.stop();
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
    key: 'runCurrentFns',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

        return _regenerator2.default.wrap(function _callee2$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.fns === null)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return');

              case 2:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context5.prev = 5;
                _iterator = (0, _getIterator3.default)(this.fns);

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context5.next = 18;
                  break;
                }

                fn = _step.value;
                _context5.t0 = 'Run next ' + options.target;
                _context5.next = 12;
                return fn(options);

              case 12:
                _context5.t1 = _context5.sent;

                if (!(_context5.t0 === _context5.t1)) {
                  _context5.next = 15;
                  break;
                }

                this.nextTarget = true;

              case 15:
                _iteratorNormalCompletion = true;
                _context5.next = 7;
                break;

              case 18:
                _context5.next = 24;
                break;

              case 20:
                _context5.prev = 20;
                _context5.t2 = _context5['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context5.t2;

              case 24:
                _context5.prev = 24;
                _context5.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 27:
                _context5.prev = 27;

                if (!_didIteratorError) {
                  _context5.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context5.finish(27);

              case 31:
                return _context5.finish(24);

              case 32:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee2, this, [[5, 20, 24, 32], [25,, 27, 31]]);
      }));

      function runCurrentFns(_x2) {
        return _ref2.apply(this, arguments);
      }

      return runCurrentFns;
    }()
  }]);
  return Messages;
}();

exports.default = Messages;
module.exports = exports['default'];