'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapCallbacks = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _cleanup = require('./cleanup');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapCallbacks = exports.wrapCallbacks = function wrapCallbacks(opts) {
  var options = (0, _assign2.default)({}, opts);

  ['onSetupError', 'onSpawnError', 'onCheckResultsError'].forEach(function (method) {
    if (opts[method]) {
      options[method] = function (err) {
        var _this = this;

        return _cleanup.onError.call(this, err).catch(function () {
          return opts[method].call(_this, err);
        });
      };
    }
  });

  return options;
};