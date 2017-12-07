import testGulpProcess, {never, nextTask} from '../src/test-gulp-process';
import {expect} from 'chai';
import chalk from 'chalk';

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

  it(`Series of tasks - no nextTask`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-task.js',
    task: ['hello', 'default', 'ciao'],
    debug: true,

    messages: [
      `Starting 'hello'...`,
      'hello',
      `Finished 'hello' after`,
      `Starting 'default'...`,
      'coucou',
      `Finished 'default' after`,
      `Starting 'ciao'...`,
      'ciao',
      `Finished 'ciao' after`,
    ],

    onCheckResultsError: function (err) {
      try {
        expect(err).to.match(/Waiting too long for child process to finish:/);
        expect(err).to.match(
          /Message 'Starting 'default'...' was never intercepted/);
        console.info(`${chalk.cyan('Intercepted')} expected message ${
          chalk.magenta(err.message)}`);
        return Promise.resolve(err.results);
      } catch (e) {
        try {
          expect(err).to.match(
            /Message 'Starting 'ciao'...' was never intercepted/);
          console.info(`${chalk.cyan('Intercepted')} expected message ${
            chalk.magenta(err.message)}`);
          return Promise.resolve(err.results);
        } catch (e) {
          return Promise.reject(err);
        }
      }
    },
  }));
});
