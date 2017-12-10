import testGulpProcess from '../src/test-gulp-process';

describe('Testing Gulpfile', function () {
  it(`Testing a queue of ordered messages`, testGulpProcess({
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
});
