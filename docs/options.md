## Options !heading

* `sources`: A glob pointing to the files to be used as sources for the test.
* `gulpfile`: The gulpfile to be used for the test.
* `task` (optional): The task with which to call `gulp`. See [`nextTask` helper function](#nexttask-helper-function).
* `messages`: An array of all the messages to be expected, in order, and of functions to be executed, in order. (see [Using callbacks](#using-callbacks)).

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
