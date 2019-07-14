import testGulpProcess, {
  compareTranspiled,
  touchFile,
  deleteFile,
  isDeleted,
  isFound
} from "../src/test-gulp-process";

describe("Testing Gulpfile", (): void => {
  it(
    `Testing a transpile task`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isFound("src/test-gulp-process.js"),
          isFound("build/src/test-gulp-process.js"),
          compareTranspiled("src/**/*.ts", "build")
        ],
        `Finished 'default' after`
      ]
    })
  );

  it(
    `Testing a tdd transpile task - touching`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          compareTranspiled("src/**/*.ts", "build")
        ],
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [`Finished 'default' after`, touchFile("src/test-gulp-process.js")],
        `Starting 'exec:transpile:all'...`,
        `Finished 'exec:transpile:all' after`
      ]
    })
  );

  it(
    `Testing a tdd transpile task - deleting`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/tdd-transpile-all.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'tdd:transpile:all'...`,
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          compareTranspiled("src/**/*.ts", "build")
        ],
        `Starting 'watch:transpile:all'...`,
        `Finished 'watch:transpile:all' after`,
        `Finished 'tdd:transpile:all' after`,
        [
          `Finished 'default' after`,
          deleteFile("src/test-gulp-process.js"),
          deleteFile("build/src/test-gulp-process.js")
        ],
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          compareTranspiled("src/**/*.ts", "build"),
          isDeleted("src/test-gulp-process.js"),
          isDeleted("build/src/test-gulp-process.js")
        ]
      ]
    })
  );
});
