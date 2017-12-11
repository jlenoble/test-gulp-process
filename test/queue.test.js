import testGulpProcess, {parallel} from '../src/test-gulp-process';
import {expect} from 'chai';

describe('Testing Gulpfile', function () {
  it(`Testing a queue of in order messages`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-queue.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      ['hello1', 'hello2', 'hello3', 'hello4'],
      `Finished 'default' after`,
    ],
  }));

  it(`Testing a queue of out of order messages`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-queue.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      ['hello2', 'hello4', 'hello3', 'hello1'],
      `Finished 'default' after`,
    ],
  }));

  it(`Testing parallel queues`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-queue.js',
    debug: true,

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
    debug: true,

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
