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

## Using callbacks !heading

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

## Helper callbacks !heading

### `compareTranspiled` helper function !heading

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
        'src/**/*.js', 'build')], // Checks that the build dir contains the transpiled files from 'src/**/*.js'
      `Finished 'default' after`,
    ],
  }));
});
```
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

### `deleteFile`, `isDeleted` and `isFound` helper functions !heading

Using the gulpfile from [`touchFile` helper function](#touchfile-helper-function), we can use `deleteFile` to delete a file after a succession of events.

With `isDeleted` and `isFound`, we can check whether the file still exists or not.

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
      [`Finished 'exec:transpile:all' after`, isFound('src/some-file.js')],
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`, deleteFile('src/some-file.js')],
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`, isDeleted('src/some-file.js')],
    ],
  }));
});
```

### `never` helper function !heading

`never` forbids the occurrence of a specific message among all the captured messages.

In the following example, as we launch the process for target `hello`, the message concerning the `default` target should never appear.

```js
import testGulpProcess, {never} from 'test-gulp-process';

describe('Testing Gulpfile target', function () {
  it(`Target is not default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-target.js',
    target: 'hello',

    messages: [
      never(`Starting 'default'...`),
      never(`Finished 'default' after`),
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
    ],
  }));
});
```

## License !heading

test-gulp-process is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
