import testGulpProcess, {never} from '../src/test-gulp-process';

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
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
    ],
  }));
});
