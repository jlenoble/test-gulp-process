'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForMessage = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var autoCleanAction = function autoCleanAction() {
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
    };

    intervalId = setInterval(autoCleanAction, interval);
    timeoutId = setTimeout(timeout, maxDuration);

    autoCleanAction(); // Start immediately
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

exports.waitForMessage = waitForMessage;