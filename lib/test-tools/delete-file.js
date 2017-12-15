'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _polypath = require('polypath');

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _cleanupWrapper = require('cleanup-wrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteFile = exports.deleteFile = function deleteFile(_file) {
  return function (options) {
    var destGlob = (0, _polypath.rebaseGlob)(_file, options.dest);

    return (0, _polypath.resolveGlob)(destGlob).then(function (files) {
      if (!files.length) {
        var str = (0, _stringify2.default)(destGlob);

        if (options && options.debug) {
          console.info(_chalk2.default.green(str) + ' cannot be ' + _chalk2.default.cyan('deleted') + ':');
        }

        return _promise2.default.reject(new Error(_chalk2.default.green(str) + ' resolves to nothing'));
      }

      var exec = function exec() {
        return _promise2.default.all(files.map(function (file) {
          if (options && options.debug) {
            console.info(_chalk2.default.cyan('Deleting') + ' ' + _chalk2.default.green(file));
          }
          return (0, _del2.default)(file);
        }));
      };

      return (0, _cleanupWrapper.chDir)(options.dest, exec)();
    });
  };
};