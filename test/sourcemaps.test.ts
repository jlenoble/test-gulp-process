import testGulpProcess, {
  hasSourcemap,
  isFound
} from "../src/test-gulp-process";

describe("Testing Gulpfile", () => {
  it(
    `Testing a transpile task with sourcemaps`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-sourcemaps.js",
      debug: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec'...`,
        [
          `Finished 'exec' after`,
          isFound("src/test-gulp-process.js"),
          isFound("build/src/test-gulp-process.js"),
          hasSourcemap("src/**/*.ts", "build")
        ],
        `Finished 'default' after`
      ]
    })
  );
});
