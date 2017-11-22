import Muter, {captured} from 'muter';
import {expect} from 'chai';
import TestGulpProcess from '../src/test-gulp-process';

describe('Testing TestGulpProcess', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`Class TestGulpProcess says 'Hello world!'`, captured(muter, function () {
    new TestGulpProcess();
    expect(muter.getLogs()).to.equal('Hello world!\n');
  }));
});
