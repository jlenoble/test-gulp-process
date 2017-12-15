'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParallelMessages = function () {
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

exports.default = ParallelMessages;
module.exports = exports['default'];