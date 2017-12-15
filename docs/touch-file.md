### `touchFile` helper function !heading

Considering the gulpfile:

```js
import gulp from 'gulp';
import babel from 'gulp-babel';

const glob = 'src/**/*.js';
const dest = 'build';

gulp.task('exec:transpile:all', () => {
  return gulp.src(glob, {base: process.cwd()})
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task('watch:transpile:all', done => {
  gulp.watch(glob, gulp.series('exec:transpile:all'));
  done();
});

gulp.task('tdd:transpile:all', gulp.series('exec:transpile:all',
  'watch:transpile:all'));

gulp.task('default', gulp.series('tdd:transpile:all'));
```

We can test if files are correctly watched with helper function `touchFile`:

```js
import testGulpProcess, {touchFile} from 'test-gulp-process';

describe('Testing Gulpfile', function () {
  it(`Testing a tdd transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/gulpfile.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`, touchFile('src/some-file.js')],
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
    ],
  }));
});
```
