## Basic usage !heading

Let's consider the gulpfile `gulpfile.js`:

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

gulp.task('default', gulp.series('exec:transpile:all'));
```

You want to test the correct succession of the tasks `default` and  `exec:transpile:all` manifested when `gulp` is run. Assuming a `Mocha`-like test runner, you can do it by using the helper function `testGulpProcess`.

```js
import testGulpProcess from 'test-gulp-process';

describe('Testing gulpfile', function () {
  it(`Testing a transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'], // Source files copied into a tmp directory
    gulpfile: 'test/gulpfiles/gulpfile.js', // Renamed automatically as gulpfile.babel.js into the tmp directory

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
      `Finished 'default' after`,
    ],
  })); // the output of the gulp process is checked against the above messages
});
```
