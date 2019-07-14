import testGulpProcess, {
  deleteFile,
  isDeleted
} from "../src/test-gulp-process";
import { expect } from "chai";

describe("Testing Gulpfile", () => {
  it(
    `Testing deleteFile(glob) and isDeleted(glob)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`,
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-tools/*.js"),
          deleteFile("build/src/test-tools/*.js")
        ],
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isDeleted("src/test-tools/*.js"),
          isDeleted("build/src/test-tools/*.js"),
          isDeleted("src/test-tools/delete-file.js"),
          isDeleted("build/src/test-tools/delete-file.js")
        ]
      ]
    })
  );

  it(
    `Testing deleteFile(badGlob)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`,
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-tools/*.js"),
          deleteFile("badbuild/src/test-tools/*.js")
        ],
        `Starting 'exec:transpile:all'...`
      ],

      onCheckResultsError(err) {
        expect(err.message).to.match(/resolves to nothing/);
      }
    })
  );

  it(
    `Testing deleteFile(badFile)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`,
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-tools/*.js"),
          deleteFile("build/src/test-tools/badfile.js")
        ],
        `Starting 'exec:transpile:all'...`
      ],

      onCheckResultsError(err) {
        expect(err.message).to.match(/resolves to nothing/);
      }
    })
  );

  it(
    `Testing isDeleted(badGlob)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`,
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-tools/*.js"),
          deleteFile("build/src/test-tools/*.js")
        ],
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isDeleted("src/test-tools/*.js"),
          isDeleted("badbuild/src/test-tools/*.js")
        ]
      ]
    })
  );

  it(
    `Testing isDeleted(badFile)`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`,
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-tools/*.js"),
          deleteFile("build/src/test-tools/is-deleted.js")
        ],
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isDeleted("src/test-tools/*.js"),
          isDeleted("build/src/test-tools/badfile.js")
        ]
      ]
    })
  );
});
