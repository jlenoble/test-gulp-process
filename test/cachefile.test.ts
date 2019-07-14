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

  it(`Caching with cacheFiles({glob: 'src/test-*.js', base1: 'build'})`, async function(): Promise<
    void
  > {
    await cacheFiles({
      glob: "src/test-*.js",
      base1: "build",
      debug: this.debug // eslint-disable-line no-invalid-this
    });

    const files = await getCachedFiles({
      glob: "src/test-*.js",
      base1: "build",
      debug: this.debug // eslint-disable-line no-invalid-this
    });

    expect(files.map((file): string => file.filepath)).to.eql(
      ["test-gulp-process.js"].map((f): string =>
        path.join(process.cwd(), "build/src", f)
      )
    );
  });

  it(`Caching with cacheFiles({glob: 'build/src/test-*.js'})`, async function(): Promise<
    void
  > {
    await cacheFiles({
      glob: "build/src/test-*.js",
      debug: this.debug // eslint-disable-line no-invalid-this
    });

    const files = await getCachedFiles({
      glob: "build/src/test-*.js",
      debug: this.debug // eslint-disable-line no-invalid-this
    });

    expect(files.map((file): string => file.filepath)).to.eql(
      ["test-gulp-process.js"].map((f): string =>
        path.join(process.cwd(), "build/src", f)
      )
    );
  });

  it(
    `Caching with cacheFiles({glob: 'src/test-*.js', base1: 'src',` +
      `base2: 'build/src'})`,
    async function(): Promise<void> {
      await cacheFiles({
        glob: "src/test-*.js",
        base1: "src",
        base2: "build/src",
        debug: this.debug // eslint-disable-line no-invalid-this
      });

      const files = await getCachedFiles({
        glob: "src/test-*.js",
        base1: "src",
        base2: "build/src",
        debug: this.debug // eslint-disable-line no-invalid-this
      });

      expect(files.map((file): string => file.filepath)).to.eql(
        ["test-gulp-process.js"].map((f): string =>
          path.join(process.cwd(), "build/src", f)
        )
      );
    }
  );

  it(
    `Caching with cacheFiles({glob: ['src/test-*.js', ` +
      `'!src/test-gulp-process.js'], base1: 'build'})`,
    async function(): Promise<void> {
      await cacheFiles({
        glob: ["src/test-*.js", "!src/test-gulp-process.js"],
        base1: "build",
        debug: this.debug // eslint-disable-line no-invalid-this
      });

      const files = await getCachedFiles({
        glob: ["src/test-*.js", "!src/test-gulp-process.js"],
        base1: "build",
        debug: this.debug // eslint-disable-line no-invalid-this
      });

      expect(files.map((file): string => file.filepath)).to.eql([]);
    }
  );
});
