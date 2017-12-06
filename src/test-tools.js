import path from 'path';
import {rebase} from 'polypath';
import equalFileContents from 'equal-file-contents';
import touch from 'touch';
import del from 'del';
import babel from 'gulp-babel';
import {chDir} from 'cleanup-wrapper';
import {expectEventuallyDeleted, expectEventuallyFound} from 'stat-again';
import {cacheFiles, getCachedFiles} from './file';

export const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = rebase(_glob, options.dest);
  return equalFileContents(glob, dest, babel, options.dest);
};

export const deleteFile = _file => options => {
  const exec = () => {
    const [file] = rebase(_file, options.dest);
    return del(file);
  };

  return chDir(options.dest, exec)();
};

export const isDeleted = _file => options => {
  const [file] = rebase(_file, options.dest);

  return expectEventuallyDeleted(file);
};

export const isFound = _file => options => {
  const [file] = rebase(_file, options.dest);

  return expectEventuallyFound(file);
};

const isSame = (method, notText) => _glob => options => {
  return getCachedFiles(_glob, options.dest).then(
    files => Promise.all(files.map(file => file[method]()))).then(truths => {
    if (!truths.every(yes => yes)) {
      throw new Error(`${JSON.stringify(_glob)} is not ${notText}`);
    }
    return true;
  });
};

export const isNewer = isSame('isNewer', 'newer');
export const isUntouched = isSame('isUntouched', 'untouched');
export const isSameContent = isSame('isSameContent', 'same content');
export const isChangedContent = isSame('isChangedContent', 'changed content');

export const never = _msg => msg => {
  if (msg.match(new RegExp(_msg))) {
    throw new Error(`Forbidden message "${_msg}" was caught`);
  }
  return true;
};

export const runNextTask = options => {
  return `Run next ${options.task}`;
};
export const nextTask = () => runNextTask;

export const snapshot = glb => options => {
  return cacheFiles(glb, options.dest);
};

export const touchFile = _file => options => {
  const [file] = rebase(_file, options.dest);
  return touch(file);
};
