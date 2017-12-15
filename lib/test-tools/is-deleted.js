'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDeleted = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _polypath = require('polypath');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _statAgain = require('stat-again');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDeleted = exports.isDeleted = function isDeleted(_file) {
  return function (options) {
    var destGlob = (0, _polypath.rebaseGlob)(_file, options.dest);

    return (0, _polypath.resolveGlob)(destGlob).then(function (files) {
      if (!files.length) {
        var str = (0, _stringify2.default)(destGlob);

        if (options && options.debug) {
          console.info(_chalk2.default.cyan('Checking') + ' whether ' + _chalk2.default.green(str) + ' is deleted');

          console.info(_chalk2.default.green(str) + ' resolves to nothing');
        }

        return _promise2.default.resolve();
      }

      return _promise2.default.all(files.map(function (file) {
        if (options && options.debug) {
          console.info(_chalk2.default.cyan('Checking') + ' whether ' + _chalk2.default.green(file) + ' is deleted');
        }

        return (0, _statAgain.expectEventuallyDeleted)(file);
      }));
    });
  };
};