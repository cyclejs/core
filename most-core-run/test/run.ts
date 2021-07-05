// tslint:disable-next-line
import 'mocha';
import * as assert from 'assert';
import * as sinon from 'sinon';
import {run, setup} from '../src/index';
import * as most from '@most/core';
import fromXS from './mostXS';
import {newDefaultScheduler} from '@most/scheduler';

describe('run()', function() {
  it('should be a function', function() {
    assert.strictEqual(typeof run, 'function');
  });

  it('should throw if first argument is not a function', function() {
    assert.throws(() => {
      (run as any)('not a function');
    }, /First argument given to Cycle must be the 'main' function/i);
  });

  it('should throw if second argument is not an object', function() {
    assert.throws(() => {
      (run as any)(() => {}, 'not an object');
    }, /Second argument given to Cycle must be an object with driver functions/i);
  });

  it('should throw if second argument is an empty object', function() {
    assert.throws(() => {
      run(() => ({}), {});
    }, /Second argument given to Cycle must be an object with at least one/i);
  });

  it('should return a dispose function', function(done) {
    const sandbox = sinon.createSandbox();
    const spy = sandbox.spy();
    function app(sources: any) {
      return {
        other: most.startWith('a', most.take(1, sources.other)),
      };
    }
    function driver() {
      return most.tap(spy, most.now('b'));
    }
    const dispose = run(app, {other: driver});
    assert.strictEqual(typeof dispose, 'function');
    setTimeout(() => {
      sinon.assert.calledOnce(spy);
      dispose();
      done();
    }, 100);
  });

  // TODO: Do not know why is not working

  // it('should report errors from main() in the console', function(done) {
  //   const sandbox = sinon.createSandbox();
  //   sandbox.stub(console, 'error');
  //   process.on('uncaughtException', function(err) {
  //     console.error(err);
  //   });
  //   function main(sources: any): any {
  //     return {
  //       other: most.map(() => {
  //         throw new Error('malfunction');
  //       }, sources.other),
  //     };
  //   }
  //   function driver(xsSink: any) {
  //     most.runEffects(fromXS(xsSink), newDefaultScheduler());
  //
  //     return most.now('b');
  //   }
  //
  //   let caught = false;
  //   try {
  //     run(main, {other: driver});
  //   } catch (err) {
  //     assert.strictEqual(err.message, 'malfunction');
  //     caught = true;
  //   }
  //
  //   setTimeout(() => {
  //     sinon.assert.calledOnce(console.error as any);
  //     // sinon.assert.calledWithExactly(
  //     //   console.error as any,
  //     //   sinon.match((err: any) => err.message === 'malfunction')
  //     // );
  //
  //     // Should be false because the error was already reported in the console.
  //     // Otherwise we would have double reporting of the error.
  //     assert.strictEqual(caught, false);
  //     done();
  //   }, 500);
  // });
});
