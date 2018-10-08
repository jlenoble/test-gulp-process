'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapCallbacks = undefined;

var _cleanup = require('./cleanup');

const wrapCallbacks = exports.wrapCallbacks = opts => {
  const options = Object.assign({}, opts);

  ['onSetupError', 'onSpawnError', 'onCheckResultsError'].forEach(method => {
    if (opts[method]) {
      options[method] = function (err) {
        return _cleanup.onError.call(this, err).catch(() => {
          return opts[method].call(this, err);
        });
      };
    }
  });

  return options;
};