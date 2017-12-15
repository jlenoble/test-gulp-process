import testGulpProcess, {isFound} from '../src/test-gulp-process';
import {expect} from 'chai';

describe('Testing Gulpfile', function () {
  it(`Testing isFound(glob)`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-transpile-all.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        isFound('src/test-tools/*.js'),
        isFound('build/src/test-tools/*.js')],
      `Finished 'default' after`,
    ],
  }));

  it(`Testing isFound(badglob)`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-transpile-all.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        isFound('src/test-tools/*.js'),
        isFound('badbuild/src/test-tools/*.js')],
      `Finished 'default' after`,
    ],

    onCheckResultsError (err) {
      expect(err.message).to.match(/resolves to nothing/);
    },
  }));
});
