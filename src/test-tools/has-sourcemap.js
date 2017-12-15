import {rebaseGlob} from 'polypath';
import chalk from 'chalk';
import path from 'path';
import gulp from 'gulp';
import equalStreamContents from 'equal-stream-contents';
import reverse from 'gulp-reverse-sourcemaps';

export const hasSourcemap = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = rebaseGlob(_glob, options.dest);
  if (options && options.debug) {
    console.info(`${chalk.cyan('Checking')} sourcemaps for ${
      chalk.green(glob)}`);
  }
  return equalStreamContents(gulp.src(glob), gulp.src(rebaseGlob(_glob, dest))
    .pipe(reverse(options.dest)));
};
