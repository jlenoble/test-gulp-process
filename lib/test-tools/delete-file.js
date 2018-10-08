'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _polypath = require('polypath');

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _cleanupWrapper = require('cleanup-wrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deleteFile = exports.deleteFile = _file => options => {
  const destGlob = (0, _polypath.rebaseGlob)(_file, options.dest);

  return (0, _polypath.resolveGlob)(destGlob).then(files => {
    if (!files.length) {
      const str = JSON.stringify(destGlob);

      if (options && options.debug) {
        console.info(`${_chalk2.default.green(str)} cannot be ${_chalk2.default.cyan('deleted')}:`);
      }

      return Promise.reject(new Error(`${_chalk2.default.green(str)} resolves to nothing`));
    }

    const exec = () => {
      return Promise.all(files.map(file => {
        if (options && options.debug) {
          console.info(`${_chalk2.default.cyan('Deleting')} ${_chalk2.default.green(file)}`);
        }
        return (0, _del2.default)(file);
      }));
    };

    return (0, _cleanupWrapper.chDir)(options.dest, exec)();
  });
};