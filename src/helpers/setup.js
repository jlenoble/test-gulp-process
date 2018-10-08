import childProcessData from 'child-process-data';
import {spawn} from 'child_process';
import path from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';

let counter = 0;

export const newDest = () => {
  counter++;
  return `/tmp/${path.basename(process.cwd())}_${Date.now()}_${
    counter}`;
};

export const copySources = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.sources, {base: process.cwd()})
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

export const copyGulpfile = options => {
  return new Promise((resolve, reject) => {
    gulp.src(options.gulpfile, {base: 'test/gulpfiles'})
      .on('end', resolve)
      .on('error', reject)
      .pipe(rename('gulpfile.babel.js'))
      .pipe(gulp.dest(options.dest));
  });
};

export const copyBabelrc = options => {
  return new Promise((resolve, reject) => {
    gulp.src('.babelrc')
      .on('end', resolve)
      .on('error', reject)
      .pipe(gulp.dest(options.dest));
  });
};

export const linkNodeModules = options => {
  return childProcessData(spawn('ln', [
    '-s', path.join(process.cwd(), 'node_modules'), options.dest]));
};
