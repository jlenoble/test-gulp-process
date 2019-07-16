import testGulpProcess, { parallel } from "../src/test-gulp-process";
import { expect } from "chai";

describe("Testing Gulpfile", (): void => {
  it(
    `Testing a queue of in order messages`,
    testGulpProcess({
      sources: ["src/**/*.ts"],
      gulpfile: "test/gulpfiles/exec-queue.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        ["hello1", "hello2", "hello3", "hello4"],
        `Finished 'default' after`
      ]
    })
  );

  it(
    `Testing a queue of out of order messages`,
    testGulpProcess({
      sources: ["src/**/*.ts"],
      gulpfile: "test/gulpfiles/exec-queue.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        ["hello2", "hello4", "hello3", "hello1"],
        `Finished 'default' after`
      ]
    })
  );

  it(
    `Testing parallel queues`,
    testGulpProcess({
      sources: ["src/**/*.ts"],
      gulpfile: "test/gulpfiles/exec-queue.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        parallel(
          ["hello2", "hello4", "hello7"],
          ["hello1", "hello3"],
          ["hello5"],
          ["hello6", "hello8"]
        ),
        `Finished 'default' after`
      ]
    })
  );

  it(
    `Testing parallel queues - fail on bad order`,
    testGulpProcess({
      sources: ["src/**/*.ts"],
      gulpfile: "test/gulpfiles/exec-queue.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        parallel(
          ["hello2", "hello7", "hello4"],
          ["hello1", "hello3"],
          ["hello5"],
          ["hello6", "hello8"]
        ),
        `Finished 'default' after`
      ],

      onError(err): void {
        expect(err.message).to.match(
          /Waiting too long for child process to finish/
        );
        expect(err.message).to.match(/'hello4' was never intercepted/);
      }
    })
  );

  it(
    `Testing parallel queues - special characters`,
    testGulpProcess({
      sources: ["src/**/*.ts"],
      gulpfile: "test/gulpfiles/exec-queue-bugfix1.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec:transpile'...`,
        `Starting 'exec:copy'...`,
        parallel(
          [
            `Task 'copy' (SRC): src/gulptask.js`,
            `Task 'copy' (NWR): src/gulptask.js`
          ],
          [`Task 'copy' (SRC): 1 item`, `Task 'copy' (NWR): 1 item`]
        ),
        `Finished 'exec:copy' after`,
        `Starting 'transpile'...`,
        parallel(
          [
            `Task 'transpile' (SRC): tmp/src/gulptask.js`,
            `Task 'transpile' (NWR): tmp/src/gulptask.js`,
            `Task 'transpile' (DST): tmp/src/gulptask.js`
          ],
          [
            `Task 'transpile' (SRC): 1 item`,
            `Task 'transpile' (NWR): 1 item`,
            `Task 'transpile' (DST): 1 item`
          ]
        ),
        `Finished 'transpile' after`,
        `Finished 'exec:transpile' after`,
        `Finished 'default' after`
      ]
    })
  );
});
