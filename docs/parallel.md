### `parallel` helper function !heading

`parallel` helps with intercepting concurrent logging threads, typically when running `gulp` tasks in parallel.

```js
import testGulpProcess, {parallel} from 'test-gulp-process';

describe('Testing Gulpfile', function () {
  it(`Testing parallel queues`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-queue.js',

    messages: [
      `Starting 'default'...`,
      parallel(
        ['hello2', 'hello4', 'hello7'],
        ['hello1', 'hello3'],
        ['hello5'],
        ['hello6', 'hello8']
      ),
      `Finished 'default' after`,
    ],
  }));

  it(`Testing parallel queues - fail on bad order`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-queue.js',

    messages: [
      `Starting 'default'...`,
      parallel(
        ['hello2', 'hello7', 'hello4'],
        ['hello1', 'hello3'],
        ['hello5'],
        ['hello6', 'hello8']
      ),
      `Finished 'default' after`,
    ],

    onCheckResultsError (err) {
      expect(err.message).to.match(
        /Waiting too long for child process to finish/);
      expect(err.message).to.match(/'hello4' was never intercepted/);
    },
  }));
});
```
