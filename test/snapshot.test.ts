import testGulpProcess, {
  snapshot,
  touchFile,
  isSameContent,
  isNewer,
  isUntouched
} from "../src/test-gulp-process";

describe("Testing snapshots", () => {
  it(
    `Taking a snapshot and recovering`,
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
          snapshot("src/**/*.ts"),
          touchFile("src/test-gulp-process.js")
        ],
        `Starting 'exec:transpile:all'...`,
        [
          `Finished 'exec:transpile:all' after`,
          isNewer("src/test-gulp-process.js"),
          isSameContent("src/test-gulp-process.js"),
          snapshot("src/**/*.ts"),
          isUntouched("src/test-gulp-process.js"),
          isSameContent("src/test-gulp-process.js")
        ]
      ]
    })
  );
});
