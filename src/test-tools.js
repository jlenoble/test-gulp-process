import path from 'path';
import destglob from 'destglob';
import equalFileContents from 'equal-file-contents';
import touch from 'touch';
import del from 'del';
import babel from 'gulp-babel';
import cleanupWrapper from 'cleanup-wrapper';
import {expectEventuallyDeleted, expectEventuallyFound} from 'stat-again';

const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = destglob(_glob, options.dest);
  return equalFileContents(glob, dest, babel, options.dest);
};

const touchFile = _file => options => {
  const [file] = destglob(_file, options.dest);
  return touch(file);
};

const deleteFile = _file => options => {
  const exec = () => {
    const [file] = destglob(_file, options.dest);
    return del(file);
  };

  const cwd = process.cwd();

  const opts = {
    before () {
      process.chdir(options.dest);
    },
    after () {
      process.chdir(cwd);
    },
  };

  const safeExec = cleanupWrapper(exec, opts);

  return safeExec();
};

const isDeleted = _file => options => {
  const [file] = destglob(_file, options.dest);

  return expectEventuallyDeleted(file);
};

const isFound = _file => options => {
  const [file] = destglob(_file, options.dest);

  return expectEventuallyFound(file);
};

export {compareTranspiled, touchFile, deleteFile, isDeleted, isFound};
