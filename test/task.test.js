import testGulpProcess, {never, nextTask} from '../src/test-gulp-process';

describe('Testing Gulpfile task', function () {
  it(`Task is default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',
    debug: true,

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
    debug: true,

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
    task: ['hello', 'default', 'ciao'],
    debug: true,

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
