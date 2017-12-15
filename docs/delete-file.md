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
