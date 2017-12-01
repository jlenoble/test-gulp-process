import path from 'path';
import destglob from 'destglob';
import equalFileContents from 'equal-file-contents';
import touch from 'touch';
import del from 'del';
import babel from 'gulp-babel';
import {chDir} from 'cleanup-wrapper';
import {expectEventuallyDeleted, expectEventuallyFound} from 'stat-again';

export const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = destglob(_glob, options.dest);
  return equalFileContents(glob, dest, babel, options.dest);
};

export const deleteFile = _file => options => {
  const exec = () => {
    const [file] = destglob(_file, options.dest);
    return del(file);
  };

  return chDir(options.dest, exec)();
};

export const isDeleted = _file => options => {
  const [file] = destglob(_file, options.dest);

  return expectEventuallyDeleted(file);
};

export const isFound = _file => options => {
  const [file] = destglob(_file, options.dest);

  return expectEventuallyFound(file);
};

export const never = _msg => msg => {
  if (msg.match(new RegExp(_msg))) {
    throw new Error(`Forbidden message "${_msg}" was caught`);
  }
  return true;
};

export const nextTask = () => options => {
  return `Run next ${options.target}`;
};

export const touchFile = _file => options => {
  const [file] = destglob(_file, options.dest);
  return touch(file);
};
