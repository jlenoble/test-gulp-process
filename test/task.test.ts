import testGulpProcess, { never, nextTask } from "../src/test-gulp-process";
import { ErrorWithHistory } from "child-process-data";
import { expect } from "chai";
import chalk from "chalk";

describe("Testing Gulpfile task", (): void => {
  it(
    `Task is default`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-task.js",
      transpileGulp: true,

      messages: [`Starting 'default'...`, "coucou", `Finished 'default' after`]
    })
  );

  it(
    `Task is not default`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-task.js",
      task: "hello",
      transpileGulp: true,

      messages: [
        never(`Starting 'default'...`),
        never(`Finished 'default' after`),
        `Starting 'hello'...`,
        "hello",
        `Finished 'hello' after`
      ]
    })
  );

  it(
    `Series of tasks`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-task.js",
      task: ["hello", "default", "ciao"],
      transpileGulp: true,

      messages: [
        never(`Starting 'default'...`),
        never(`Starting 'ciao'...`),
        `Starting 'hello'...`,
        "hello",
        [`Finished 'hello' after`, nextTask()],
        never(`Starting 'hello'...`),
        never(`Starting 'ciao'...`),
        `Starting 'default'...`,
        "coucou",
        [`Finished 'default' after`, nextTask()],
        never(`Starting 'hello'...`),
        never(`Starting 'default'...`),
        `Starting 'ciao'...`,
        "ciao",
        `Finished 'ciao' after`
      ]
    })
  );

  it(
    `Series of tasks - no nextTask`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-task.js",
      task: ["hello", "default", "ciao"],
      transpileGulp: true,

      messages: [
        `Starting 'hello'...`,
        "hello",
        `Finished 'hello' after`,
        `Starting 'default'...`,
        "coucou",
        `Finished 'default' after`,
        `Starting 'ciao'...`,
        "ciao",
        `Finished 'ciao' after`
      ],

      onError: function(err: ErrorWithHistory): void {
        try {
          expect(err).to.match(/Waiting too long for child process to finish:/);
          expect(err).to.match(
            /Message 'Starting 'default'...' was never intercepted/
          );
          if (this.debug) {
            console.info(
              `${chalk.cyan("Intercepted")} expected message ${chalk.magenta(
                err.message
              )}`
            );
          }
        } catch (e) {
          try {
            expect(err).to.match(
              /Message 'Starting 'ciao'...' was never intercepted/
            );
            if (this.debug) {
              console.info(
                `${chalk.cyan("Intercepted")} expected message ${chalk.magenta(
                  err.message
                )}`
              );
            }
          } catch (e) {
            throw err;
          }
        }
      }
    })
  );
});
