import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const glob = 'src/**/*.js';
const dest = 'build';

gulp.task('exec', () => {
  return gulp.src(glob, {base: process.cwd()})
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
});

gulp.task('default', gulp.series('exec'));
