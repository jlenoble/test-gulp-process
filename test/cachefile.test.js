import {cacheFiles, getCachedFiles, purgeCache} from '../src/file';
import path from 'path';
import {expect} from 'chai';

describe('Testing cache helpers', function () {
  before(function () {
    this.debug = true; // eslint-disable-line no-invalid-this
  });

  beforeEach(function () {
    purgeCache();
  });

  after(function () {
    purgeCache();
  });

  it(`Caching with cacheFiles({glob: 'src/test-*.js', base1: 'build'})`,
    function () {
      return cacheFiles({glob: 'src/test-*.js', base1: 'build',
        debug: this.debug}).then(() => // eslint-disable-line no-invalid-this
        getCachedFiles({glob: 'src/test-*.js', base1: 'build',
          // eslint-disable-next-line no-invalid-this
          debug: this.debug})).then(files => {
        expect(files.map(file => file.filepath)).to.eql(
          ['test-gulp-process.js', 'test-tools.js'].map(
            f => path.join(process.cwd(), 'build/src', f)));
      });
    });

  it(`Caching with cacheFiles({glob: 'build/src/test-*.js'})`, function () {
    return cacheFiles({glob: 'build/src/test-*.js',
      debug: this.debug}).then(() => // eslint-disable-line no-invalid-this
      getCachedFiles({glob: 'build/src/test-*.js',
        // eslint-disable-next-line no-invalid-this
        debug: this.debug})).then(files => {
      expect(files.map(file => file.filepath)).to.eql(
        ['test-gulp-process.js', 'test-tools.js'].map(
          f => path.join(process.cwd(), 'build/src', f)));
    });
  });

  it(`Caching with cacheFiles({glob: 'src/test-*.js', base1: 'src',` +
    `base2: 'build/src'})`, function () {
    return cacheFiles({glob: 'src/test-*.js', base1: 'src',
      base2: 'build/src',
      debug: this.debug}).then(() => // eslint-disable-line no-invalid-this
      getCachedFiles({glob: 'src/test-*.js', base1: 'src',
        base2: 'build/src',
        // eslint-disable-next-line no-invalid-this
        debug: this.debug})).then(files => {
      expect(files.map(file => file.filepath)).to.eql(
        ['test-gulp-process.js', 'test-tools.js'].map(
          f => path.join(process.cwd(), 'build/src', f)));
    });
  });

  it(`Caching with cacheFiles({glob: ['src/test-*.js', ` +
    `'!src/test-tools.js'], base1: 'build'})`, function () {
    return cacheFiles({glob: ['src/test-*.js', '!src/test-tools.js'],
      base1: 'build',
      debug: this.debug}) // eslint-disable-line no-invalid-this
      .then(() =>
        getCachedFiles({glob: ['src/test-*.js', '!src/test-tools.js'],
          base1: 'build',
          debug: this.debug})) // eslint-disable-line no-invalid-this
      .then(files => {
        expect(files.map(file => file.filepath)).to.eql(
          [path.join(process.cwd(), 'build/src', 'test-gulp-process.js')]);
      });
  });
});
