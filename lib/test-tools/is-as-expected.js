'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChangedContent = exports.isSameContent = exports.isUntouched = exports.isNewer = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isAsExpected = function isAsExpected(method, notText) {
  return function (glob) {
    return function (options) {
      return (0, _helpers.getCachedFiles)({ glob: glob, base1: options.dest }).then(function (files) {
        return _promise2.default.all(files.map(function (file) {
          return file[method]();
        }));
      }).then(function (truths) {
        if (!truths.every(function (yes) {
          return yes;
        })) {
          throw new Error((0, _stringify2.default)(glob) + ' is not ' + notText);
        }
        return true;
      });
    };
  };
};

var isNewer = exports.isNewer = isAsExpected('isNewer', 'newer');
var isUntouched = exports.isUntouched = isAsExpected('isUntouched', 'untouched');
var isSameContent = exports.isSameContent = isAsExpected('isSameContent', 'same content');
var isChangedContent = exports.isChangedContent = isAsExpected('isChangedContent', 'changed content');