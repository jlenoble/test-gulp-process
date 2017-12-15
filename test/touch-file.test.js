import testGulpProcess, {touchFile} from '../src/test-gulp-process';
import {expect} from 'chai';

describe('Testing Gulpfile', function () {
  it(`Testing touchFile(glob)`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-transpile-all.js',
    fullDebug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`,
        touchFile('src/test-tools/*.js')],
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
    ],
  }));

  it(`Testing touchFile(badglob)`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-transpile-all.js',
    fullDebug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`,
        touchFile('badsrc/test-tools/*.js')],
      `Starting 'exec:transpile:all'...`,
      `Finished 'exec:transpile:all' after`,
    ],

    onCheckResultsError (err) {
      expect(err.message).to.match(/resolves to nothing/);
    },
  }));
});
