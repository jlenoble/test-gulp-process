import { cacheFiles, getCachedFiles, purgeCache } from "../src/helpers";
import path from "path";
import { expect } from "chai";

describe("Testing cache helpers", (): void => {
  before(function(): void {
    this.debug = true; // eslint-disable-line no-invalid-this
  });

  beforeEach((): void => {
    purgeCache();
  });

  after((): void => {
    purgeCache();
  });

  it(`Caching with cacheFiles({glob: 'src/test-*.js', base1: 'build'})`, function(): void {
    return cacheFiles({
      glob: "src/test-*.js",
      base1: "build",
      debug: this.debug
    })
      .then((): void =>
        // eslint-disable-line no-invalid-this
        getCachedFiles({
          glob: "src/test-*.js",
          base1: "build",
          // eslint-disable-next-line no-invalid-this
          debug: this.debug
        })
      )
      .then((files): void => {
        expect(files.map(file => file.filepath)).to.eql(
          ["test-gulp-process.js"].map(f =>
            path.join(process.cwd(), "build/src", f)
          )
        );
      });
  });

  it(`Caching with cacheFiles({glob: 'build/src/test-*.js'})`, function() {
    return cacheFiles({ glob: "build/src/test-*.js", debug: this.debug })
      .then(() =>
        // eslint-disable-line no-invalid-this
        getCachedFiles({
          glob: "build/src/test-*.js",
          // eslint-disable-next-line no-invalid-this
          debug: this.debug
        })
      )
      .then(files => {
        expect(files.map(file => file.filepath)).to.eql(
          ["test-gulp-process.js"].map(f =>
            path.join(process.cwd(), "build/src", f)
          )
        );
      });
  });

  it(
    `Caching with cacheFiles({glob: 'src/test-*.js', base1: 'src',` +
      `base2: 'build/src'})`,
    function() {
      return cacheFiles({
        glob: "src/test-*.js",
        base1: "src",
        base2: "build/src",
        debug: this.debug
      })
        .then(() =>
          // eslint-disable-line no-invalid-this
          getCachedFiles({
            glob: "src/test-*.js",
            base1: "src",
            base2: "build/src",
            // eslint-disable-next-line no-invalid-this
            debug: this.debug
          })
        )
        .then(files => {
          expect(files.map(file => file.filepath)).to.eql(
            ["test-gulp-process.js"].map(f =>
              path.join(process.cwd(), "build/src", f)
            )
          );
        });
    }
  );

  it(
    `Caching with cacheFiles({glob: ['src/test-*.js', ` +
      `'!src/test-gulp-process.js'], base1: 'build'})`,
    function() {
      return cacheFiles({
        glob: ["src/test-*.js", "!src/test-gulp-process.js"],
        base1: "build",
        debug: this.debug
      }) // eslint-disable-line no-invalid-this
        .then(() =>
          getCachedFiles({
            glob: ["src/test-*.js", "!src/test-gulp-process.js"],
            base1: "build",
            debug: this.debug
          })
        ) // eslint-disable-line no-invalid-this
        .then(files => {
          expect(files.map(file => file.filepath)).to.eql([]);
        });
    }
  );
});
