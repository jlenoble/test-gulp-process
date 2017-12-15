### `never` helper function !heading

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
