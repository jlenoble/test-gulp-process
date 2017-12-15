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
