### `has-sourcemap` helper function !heading

`has-sourcemap(glob, dest)` whether provided glob has its sourcemap converted files in the `dest` directory.

In the following example, `src/**/*.js` were transpiled, appended with associated source maps and written to `build`. We check that the original glob can be restored identically from the files found in `build`.

```js
import testGulpProcess, {hasSourcemap, isFound} from 'test-gulp-process';

describe('Testing Gulpfile', function () {
  it(`Testing a transpile task with sourcemaps`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-sourcemaps.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec'...`,
      [`Finished 'exec' after`,
        isFound('src/test-gulp-process.js'),
        isFound('build/src/test-gulp-process.js'),
        hasSourcemap('src/**/*.js', 'build')],
      `Finished 'default' after`,
    ],
  }));
});
```
