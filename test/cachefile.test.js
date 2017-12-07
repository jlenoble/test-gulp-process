import {cacheFiles, getCachedFiles, purgeCache, setDebug} from '../src/file';
import path from 'path';
import {expect} from 'chai';

describe('Testing cache helpers', function () {
  before(function () {
    setDebug(true);
  });

  beforeEach(function () {
    purgeCache();
  });

  after(function () {
    purgeCache();
    setDebug(false);
  });

  it(`Caching with cacheFiles('src/test-*.js', 'build')`, function () {
    return cacheFiles('src/test-*.js', 'build').then(() =>
      getCachedFiles('src/test-*.js', 'build')).then(files => {
      expect(files.map(file => file.filepath)).to.eql(
        ['test-gulp-process.js', 'test-tools.js'].map(
          f => path.join(process.cwd(), 'build/src', f)));
    });
  });

  it(`Caching with cacheFiles('build/src/test-*.js')`, function () {
    return cacheFiles('build/src/test-*.js').then(() =>
      getCachedFiles('build/src/test-*.js')).then(files => {
      expect(files.map(file => file.filepath)).to.eql(
        ['test-gulp-process.js', 'test-tools.js'].map(
          f => path.join(process.cwd(), 'build/src', f)));
    });
  });

  it(`Caching with cacheFiles('src/test-*.js', 'src', 'build/src')`,
    function () {
      return cacheFiles('src/test-*.js', 'src', 'build/src').then(() =>
        getCachedFiles('src/test-*.js', 'src', 'build/src')).then(files => {
        expect(files.map(file => file.filepath)).to.eql(
          ['test-gulp-process.js', 'test-tools.js'].map(
            f => path.join(process.cwd(), 'build/src', f)));
      });
    });
});
