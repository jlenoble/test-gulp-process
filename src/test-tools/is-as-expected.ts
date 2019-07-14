import { getCachedFiles } from "../helpers";

const isAsExpected = (method, notText) => glob => options => {
  return getCachedFiles({ glob, base1: options.dest })
    .then(files => Promise.all(files.map(file => file[method]())))
    .then(truths => {
      if (!truths.every(yes => yes)) {
        throw new Error(`${JSON.stringify(glob)} is not ${notText}`);
      }
      return true;
    });
};

export const isNewer = isAsExpected("isNewer", "newer");
export const isUntouched = isAsExpected("isUntouched", "untouched");
export const isSameContent = isAsExpected("isSameContent", "same content");
export const isChangedContent = isAsExpected(
  "isChangedContent",
  "changed content"
);
