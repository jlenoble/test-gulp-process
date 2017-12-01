import testGulpProcess, {never, nextTask} from '../src/test-gulp-process';

describe('Testing Gulpfile task', function () {
  it(`Task is default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',

    messages: [
      `Starting 'default'...`,
      'coucou',
      `Finished 'default' after`,
    ],
  }));

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

  it(`Series of tasks`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',
    task: ['hello', 'default', 'hello'],

    messages: [
      `Starting 'hello'...`,
      'hello',
      [`Finished 'hello' after`, nextTask()],
      `Starting 'default'...`,
      'coucou',
      [`Finished 'default' after`, nextTask()],
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
    ],
  }));
});
