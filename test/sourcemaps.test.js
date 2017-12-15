import testGulpProcess, {hasSourcemap, isFound}
  from '../src/test-gulp-process';

describe('Testing Gulpfile', function () {
  it(`Testing a transpile task with sourcemaps`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-sourcemaps.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec'...`,
      [`Finished 'exec' after`,
        isFound('src/test-gulp-process.js'),
        isFound('build/src/test-gulp-process.js'),
        hasSourcemap('src/**/*.js', 'build')],
      `Finished 'default' after`,
    ],
  }));
});
