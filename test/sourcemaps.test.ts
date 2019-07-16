import testGulpProcess, {
  hasSourcemap,
  isFound
} from "../src/test-gulp-process";

describe("Testing Gulpfile", (): void => {
  it(
    `Testing a transpile task with sourcemaps`,
    testGulpProcess({
      sources: ["src/**/*.ts", "test/**/*.ts", "gulp/**/*.js"],
      gulpfile: "test/gulpfiles/exec-sourcemaps.js",
      transpileGulp: true,

      messages: [
        `Starting 'default'...`,
        `Starting 'exec'...`,
        [
          `Finished 'exec' after`,
          isFound("src/test-gulp-process.ts"),
          isFound("build/src/test-gulp-process.js"),
          hasSourcemap("src/**/*.ts", "build")
        ],
        `Finished 'default' after`
      ]
    })
  );
});
