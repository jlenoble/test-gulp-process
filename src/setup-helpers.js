import childProcessData from 'child-process-data';
import {spawn} from 'child_process';
import path from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';

let counter = 0;

const newDest = () => {
  counter++;
  return `/tmp/${(new Date()).getTime()}_${counter}`;
};

const copySources = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.sources, {base: process.cwd()})
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

const copyGulpfile = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.gulpfile, {base: 'test/gulpfiles'})
      .on('end', resolve)
      .on('error', reject)
      .pipe(rename('gulpfile.babel.js'))
      .pipe(gulp.dest(options.dest));
  });
};

const copyBabelrc = options => {
  return new Promise((resolve, reject) => {
    gulp.src('.babelrc')
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

const linkNodeModules = options => {
  return childProcessData(spawn('ln', [
    '-s', path.join(process.cwd(), 'node_modules'), options.dest]));
};

export {newDest, copySources, copyGulpfile, copyBabelrc, linkNodeModules};
