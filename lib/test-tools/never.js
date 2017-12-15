'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.never = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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