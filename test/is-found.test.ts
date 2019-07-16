import testGulpProcess, { isFound } from "../src/test-gulp-process";
import { expect } from "chai";

describe("Testing Gulpfile", (): void => {
  it(
    `Testing isFound(glob)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-transpile-all.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isFound("src/test-tools/*.ts"),
          isFound("build/src/test-tools/*.js")
        ],
        `Finished 'default' after`
      ]
    })
  );

  it(
    `Testing isFound(badglob)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-transpile-all.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isFound("src/test-tools/*.ts"),
          isFound("badbuild/src/test-tools/*.js")
        ],
        `Finished 'default' after`
      ],

      onError(err): void {
        expect(err.message).to.match(/resolves to nothing/);
      }
    })
  );

  it(
    `Testing isFound(badfile)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-transpile-all.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isFound("src/test-tools/is-found.js"),
          isFound("build/src/test-tools/isfnd.js")
        ],
        `Finished 'default' after`
      ],

      onError(err): void {
        expect(err.message).to.match(/resolves to nothing/);
      }
    })
  );
});
