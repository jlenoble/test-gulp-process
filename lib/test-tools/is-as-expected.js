'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChangedContent = exports.isSameContent = exports.isUntouched = exports.isNewer = undefined;

var _helpers = require('../helpers');

const isAsExpected = (method, notText) => glob => options => {
  return (0, _helpers.getCachedFiles)({ glob, base1: options.dest }).then(files => Promise.all(files.map(file => file[method]()))).then(truths => {
    if (!truths.every(yes => yes)) {
      throw new Error(`${JSON.stringify(glob)} is not ${notText}`);
    }
    return true;
  });
};

const isNewer = exports.isNewer = isAsExpected('isNewer', 'newer');
const isUntouched = exports.isUntouched = isAsExpected('isUntouched', 'untouched');
const isSameContent = exports.isSameContent = isAsExpected('isSameContent', 'same content');
const isChangedContent = exports.isChangedContent = isAsExpected('isChangedContent', 'changed content');