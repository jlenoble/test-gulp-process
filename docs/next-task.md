### `nextTask` helper function !heading

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
