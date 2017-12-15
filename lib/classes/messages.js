'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _taskMessages = require('./task-messages');

var _taskMessages2 = _interopRequireDefault(_taskMessages);

var _testTools = require('../test-tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var splitMessages = function splitMessages(messages, options) {
  var msgs = [];
  var taskMessages = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(messages), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var msg = _step.value;

      msgs.push(msg);

      if (Array.isArray(msg)) {
        var _msg = (0, _toArray3.default)(msg),
            fns = _msg.slice(1);

        if (fns.length && fns.some(function (fn) {
          return fn === _testTools.runNextTask;
        })) {
          taskMessages.push(new _taskMessages2.default(msgs, options));
          msgs.length = 0;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  taskMessages.push(new _taskMessages2.default(msgs, options));

  return taskMessages;
};

var Messages = function () {
  function Messages(messages, options) {
    (0, _classCallCheck3.default)(this, Messages);

    var taskMessages = splitMessages(messages, options);

    (0, _defineProperties2.default)(this, {
      index: {
        value: 0,
        writable: true
      },

      taskMessages: {
        get: function get() {
          return taskMessages[this.index];
        }
      },

      globalFns: {
        get: function get() {
          return this.taskMessages.globalFns;
        }
      },

      message: {
        get: function get() {
          return this.taskMessages.message;
        }
      }
    });
  }

  (0, _createClass3.default)(Messages, [{
    key: 'next',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(results) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.nextTask) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this.nextTask = false);

              case 2:
                _context.next = 4;
                return this.taskMessages.next(results);

              case 4:
                return _context.abrupt('return', _context.sent);

              case 5:
              case 'end':
                return _context.stop();
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
        var next;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.taskMessages.runCurrentFns(options);

              case 2:
                next = _context2.sent;


                if (this.taskMessages.nextTask) {
                  this.index++;
                  this.nextTask = true;
                }

                return _context2.abrupt('return', next);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
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