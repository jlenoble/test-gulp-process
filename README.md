# test-gulp-process

Helpers to test Gulp processes

  * [Basic usage](#basic-usage)
  * [Using callbacks](#using-callbacks)
  * [Helper callbacks](#helper-callbacks)
    * [`compareTranspiled` helper function](#comparetranspiled-helper-function)
    * [`touchFile` helper function](#touchfile-helper-function)
  * [License](#license)


## Basic usage

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

## Using callbacks

When a message is intercepted, a custom callback can be run:

```js
import testGulpProcess from 'test-gulp-process';

describe('Testing gulpfile', function () {
  it(`Testing a transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/gulpfile.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`, () => {
        throw new Error('Must still implement a test on correct transpilation')
      }],
      `Finished 'default' after`,
    ],
  }));
});
```

## Helper callbacks

### `compareTranspiled` helper function

```js
import testGulpProcess, {compareTranspiled} from 'test-gulp-process';

describe('Testing gulpfile', function () {
  it(`Testing a transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/gulpfile.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`, compareTranspiled(
        'src/**/*.js', 'build')], // Checks that the buid dir contains the transpiled files from 'src/**/*.js'
      `Finished 'default' after`,
    ],
  }));
});
```

### `touchFile` helper function

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

## License

test-gulp-process is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
