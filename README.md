# test-gulp-process

Helpers to test Gulp processes

  * [Basic usage](#basic-usage)
  * [Options](#options)
  * [Using callbacks](#using-callbacks)
  * [CAVEAT with callbacks](#caveat-with-callbacks)
  * [Helper callbacks](#helper-callbacks)
    * [`nextTask` helper function](#nexttask-helper-function)
    * [`compareTranspiled` helper function](#comparetranspiled-helper-function)
    * [`touchFile` helper function](#touchfile-helper-function)
    * [`deleteFile`, `isDeleted` and `isFound` helper functions](#deletefile-isdeleted-and-isfound-helper-functions)
    * [`never` helper function](#never-helper-function)
    * [`snapshot` helper function](#snapshot-helper-function)
    * [`isNewer` and `isUntouched` helper functions](#isnewer-and-isuntouched-helper-functions)
    * [`isSameContent` and `isChangedContent` helper functions](#issamecontent-and-ischangedcontent-helper-functions)
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

## Options

* `sources`: A glob pointing to the files to be used as sources for the test.
* `gulpfile`: The gulpfile to be used for the test.
* `task` (optional): The task with which to call `gulp`. See [`nextTask` helper function](#nexttask-helper-function).
* `messages`: An array of all the messages to be expected, in order, and of functions to be executed, in order. (see [Using callbacks](#using-callbacks)).

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

## CAVEAT with callbacks

Callbacks are not called at the actual operation time but when its logging message has been caught by the test runner. Therefore only use the callbacks when the tested process is idle (has finished its last batch of operations).

This means either when the spawned gulp processed has returned or when it is watching for a change that you can trigger explicitly with callbacks such as [`touchFile`](#touchfile-helper-function) or [`nextTask`](#nexttask-helper-function). See the [snapshot test](https://github.com/jlenoble/test-gulp-process/blob/master/test/snapshot.test.js) as an example.

## Helper callbacks

### `nextTask` helper function

```js
import testGulpProcess, {never, nextTask} from 'test-gulp-process';

describe('Testing Gulpfile task', function () {
  it(`Series of tasks`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',
    task: ['hello', 'default', 'ciao'],

    messages: [
      never(`Starting 'default'...`),
      never(`Starting 'ciao'...`),
      `Starting 'hello'...`,
      'hello',
      [`Finished 'hello' after`, nextTask()],
      never(`Starting 'hello'...`),
      never(`Starting 'ciao'...`),
      `Starting 'default'...`,
      'coucou',
      [`Finished 'default' after`, nextTask()],
      never(`Starting 'hello'...`),
      never(`Starting 'default'...`),
      `Starting 'ciao'...`,
      'ciao',
      `Finished 'ciao' after`,
    ],
  }));
});
```

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
        'src/**/*.js', 'build')], // Checks that the build dir contains the transpiled files from 'src/**/*.js'
      `Finished 'default' after`,
    ],
  }));
});
```
### `touchFile` helper function

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

### `deleteFile`, `isDeleted` and `isFound` helper functions

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

### `never` helper function

`never` forbids the occurrence of a specific message among all the captured messages.

In the following example, as we launch the process for task `hello`, the message concerning the `default` task should never appear.

```js
import testGulpProcess, {never} from 'test-gulp-process';

describe('Testing Gulpfile task', function () {
  it(`Task is not default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',
    task: 'hello',

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

### `snapshot` helper function

`snapshot` takes a glob as argument and registers the content and the timestamps of the corresponding files. This snapshot is used by helpers `isNewer`, `isOlder`, `isSameContent` and `isDifferentContent` to assess the passed-through files.

```js
import testGulpProcess, {snapshot, touchFile, isSameContent, isNewer}
  from 'test-gulp-process';

describe('Testing snapshots', function () {
  it(`Taking a snapshot and recovering`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-transpile-all.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`,
        snapshot('src/**/*.js'),
        touchFile('src/test-gulp-process.js')],
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        isNewer('src/test-gulp-process.js'),
        isSameContent('src/test-gulp-process.js'),
      ],
    ],
  }));
});
```

### `isNewer` and `isUntouched` helper functions

`isNewer(glob)` will throw if at least one of glob files have not been touched since last `snapshot`.

`isUntouched(glob)` will throw if at least one of glob files have been touched since last `snapshot`.

See [`snapshot` helper function](#snapshot-helper-function) example.

### `isSameContent` and `isChangedContent` helper functions

`isSameContent(glob)` will throw if the content of at least one of glob files have been changed since last `snapshot`.

`isChangedContent(glob)` will throw if the content of at least one of glob files have not been changed since last `snapshot`.

See [`snapshot` helper function](#snapshot-helper-function) example.

## License

test-gulp-process is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
