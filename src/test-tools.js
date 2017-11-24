import path from 'path';
import destglob from 'destglob';
import equalFileContents from 'equal-file-contents';
import touch from 'touch';
import babel from 'gulp-babel';

const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = destglob(_glob, options.dest);
  return equalFileContents(glob, dest, babel, options.dest);
};

const touchFile = _file => options => {
  const [file] = destglob(_file, options.dest);
  return touch(file);
};

export {compareTranspiled, touchFile};
