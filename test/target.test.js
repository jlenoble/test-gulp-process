import testGulpProcess, {never, nextTarget} from '../src/test-gulp-process';

describe('Testing Gulpfile target', function () {
  it(`Target is default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-target.js',

    messages: [
      `Starting 'default'...`,
      'coucou',
      `Finished 'default' after`,
    ],
  }));

  it(`Target is not default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-target.js',
    target: 'hello',

    messages: [
      never(`Starting 'default'...`),
      never(`Finished 'default' after`),
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
    ],
  }));

  it(`Target is not default`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-target.js',
    target: ['hello', 'default', 'hello'],

    messages: [
      `Starting 'hello'...`,
      'hello',
      [`Finished 'hello' after`, nextTarget()],
      `Starting 'default'...`,
      'coucou',
      [`Finished 'default' after`, nextTarget()],
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
    ],
  }));
});
