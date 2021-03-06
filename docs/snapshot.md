### `snapshot` helper function !heading

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
