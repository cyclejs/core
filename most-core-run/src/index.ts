import {Stream} from 'xstream';
import * as most from '@most/core';
import {Stream as MostStream} from '@most/types';
import {setAdapt} from '@cycle/run/lib/adapt';
import {
  CycleProgram,
  DisposeFunction,
  Drivers,
  Main,
  Sources,
  Sinks,
  GetValidInputs,
  WidenStream,
  setupReusable,
} from '@cycle/run';
//@ts-ignore
import {newDefaultScheduler} from '@most/scheduler';
//@ts-ignore
import {createAdapter} from '@most/adapter';

export type ToMostStream<S> = S extends Stream<infer T> ? MostStream<T> : S;
export type ToMostStreams<S> = {[k in keyof S]: ToMostStream<S[k]>};

export type MatchingMain<D extends Drivers, M extends Main> =
  | Main & {
      (so: ToMostStreams<Sources<D>>): Sinks<M>;
    }
  | Main & {
      (): Sinks<M>;
    };

function isObjectEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

setAdapt(function adaptXstreamToMost(stream: Stream<any>): MostStream<any> {
  const [dispose, dispose$] = createAdapter();
  const [m, m$] = createAdapter();
  stream.addListener({
    next: m,
    error: err => console.error(err),
    complete: () => {
      dispose(true);
    },
  });
  return most.until(dispose$, m$);
});

// Return an observable like, entagled to the most stream
function mostToObservable(stream: any): [any, {subscribe: any}] {
  const observers: Array<any> = [];
  function next(event: any) {
    observers.forEach(o => o.next(event));
  }
  const onevent = most.tap(next, stream);
  const observable = {
    subscribe: (o: any) => {
      observers.push(o);
    },
  };
  return [onevent, observable];
}

// Take in input sinks maps and return 2 maps
// - The first maps is entagled sinks
// - The seconds map is of observable likes entagled to sinks
function observableSinks(sinks: any): any {
  return Object.keys(sinks).reduce(
    (out, key) => {
      const [stream, observable] = mostToObservable(sinks[key]);
      out[0][key] = stream;
      out[1][key] = observable;
      return out;
    },
    [{}, {}]
  );
}

export function coreSetup<
  D extends MatchingDrivers<D, M>,
  M extends MatchingMain<D, M>
>(main: M, drivers: D): CycleProgram<D, M> {
  if (typeof main !== `function`) {
    throw new Error(
      `First argument given to Cycle must be the 'main' ` + `function.`
    );
  }
  if (typeof drivers !== `object` || drivers === null) {
    throw new Error(
      `Second argument given to Cycle must be an object ` +
        `with driver functions as properties.`
    );
  }
  if (isObjectEmpty(drivers)) {
    throw new Error(
      `Second argument given to Cycle must be an object ` +
        `with at least one driver function declared as a property.`
    );
  }

  const engine = setupReusable(drivers);
  const sinks = main(engine.sources);
  if (typeof window !== 'undefined') {
    (window as any).Cyclejs = (window as any).Cyclejs || {};
    (window as any).Cyclejs.sinks = sinks;
  }
  function _run(): DisposeFunction {
    const [dispose, dispose$] = createAdapter();
    const [mostStreams, observables] = observableSinks(sinks);
    //@ts-ignore
    const getValues = (v: any): any =>
      (Object.values && Object.values(v)) || Object.keys(v).map(k => v[k]);
    const sinks$ = most.mergeArray(getValues(mostStreams));
    const disposeRun = engine.run(observables);

    const disposeEngine$ = most.tap(() => {
      disposeRun();
      engine.dispose();
    }, dispose$);

    most.runEffects(
      most.tap(
        v => console.log('ciclo ', v),
        most.until(disposeEngine$, sinks$)
      ),
      newDefaultScheduler()
    );
    return dispose as DisposeFunction;
  }
  return {sinks, sources: engine.sources, run: _run};
}

// We return S and not never, because isolation currently cannot type the return stream
// resulting in the value being typed any.
export type ToStream<S> = S extends MostStream<infer T> ? Stream<T> : S;

export type MatchingDrivers<D extends Drivers, M extends Main> = Drivers &
  {
    [k in string & keyof Sinks<M>]:
      | (() => Sources<D>[k])
      | ((
          si: Stream<WidenStream<ToStream<Sinks<M>[k]>, GetValidInputs<D[k]>>>
        ) => Sources<D>[k]);
  };

export interface CycleProgram<
  D extends MatchingDrivers<D, M>,
  M extends MatchingMain<D, M>
> {
  sources: ToMostStreams<Sources<D>>;
  sinks: Sinks<M>;
  run(): DisposeFunction;
}

export interface Engine<D extends Drivers> {
  sources: Sources<D>;
  run<M extends MatchingMain<D, M>>(sinks: Sinks<M>): DisposeFunction;
  dispose(): void;
}

/**
 * Takes a `main` function and circularly connects it to the given collection
 * of driver functions.
 *
 * **Example:**
 * ```js
 * import run from '@cycle/most-run';
 * const dispose = run(main, drivers);
 * // ...
 * dispose();
 * ```
 *
 * The `main` function expects a collection of "source" streams (returned from
 * drivers) as input, and should return a collection of "sink" streams (to be
 * given to drivers). A "collection of streams" is a JavaScript object where
 * keys match the driver names registered by the `drivers` object, and values
 * are the streams. Refer to the documentation of each driver to see more
 * details on what types of sources it outputs and sinks it receives.
 *
 * @param {Function} main a function that takes `sources` as input and outputs
 * `sinks`.
 * @param {Object} drivers an object where keys are driver names and values
 * are driver functions.
 * @return {Function} a dispose function, used to terminate the execution of the
 * Cycle.js program, cleaning up resources used.
 * @function run
 */
export function run<
  D extends MatchingDrivers<D, M>,
  M extends MatchingMain<D, M>
>(main: M, drivers: D): DisposeFunction {
  const program = coreSetup(main, drivers as any);
  return program.run();
}

/**
 * A function that prepares the Cycle application to be executed. Takes a `main`
 * function and prepares to circularly connects it to the given collection of
 * driver functions. As an output, `setup()` returns an object with three
 * properties: `sources`, `sinks` and `run`. Only when `run()` is called will
 * the application actually execute. Refer to the documentation of `run()` for
 * more details.
 *
 * **Example:**
 * ```js
 * import {setup} ^1.3.4from '@cycle/most-run';
 * const {sources, sinks, run} = setup(main, drivers);
 * // ...
 * const dispose = run(); // Executes the application
 * // ...
 * dispose();
 * ```
 *
 * @param {Function} main a function that takes `sources` as input
 * and outputs `sinks`.
 * @param {Object} drivers an object where keys are driver names and values
 * are driver functions.
 * @return {Object} an object with three properties: `sources`, `sinks` and
 * `run`. `sources` is the collection of driver sources, `sinks` is the
 * collection of driver sinks, these can be used for debugging or testing. `run`
 * is the function that once called will execute the application.
 * @function setup
 */
export function setup<
  D extends MatchingDrivers<D, M>,
  M extends MatchingMain<D, M>
>(main: M, drivers: D): CycleProgram<D, M> {
  return coreSetup(main, drivers as any) as any;
}

export default run;
