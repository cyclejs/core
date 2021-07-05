import xs, {Stream} from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
export type Component<So, Si> = (sources: So, ...rest: Array<any>) => Si;

export type FirstArg<
  T extends (r: any, ...args: Array<any>) => any
> = T extends (r: infer R, ...args: Array<any>) => any ? R : any;

export type IsolateableSource<A = any, B = any> = {
  isolateSource(
    source: IsolateableSource<A, B>,
    scope: any
  ): IsolateableSource<A, B>;
  isolateSink(sink: A, scope: any): B;
};

export type Sources = {
  [name: string]: IsolateableSource;
};

export type WildcardScope = {
  ['*']?: string;
};

export type ScopesPerChannel<So> = {[K in keyof So]: any};

export type Scopes<So> =
  | (Partial<ScopesPerChannel<So>> & WildcardScope)
  | string;

function checkIsolateArgs<So, Si>(
  dataflowComponent: Component<So, Si>,
  scope: any
) {
  if (typeof dataflowComponent !== `function`) {
    throw new Error(
      `First argument given to isolate() must be a ` +
        `'dataflowComponent' function`
    );
  }
  if (scope === null) {
    throw new Error(`Second argument given to isolate() must not be null`);
  }
}

function normalizeScopes<So>(
  sources: So,
  scopes: Scopes<So>,
  randomScope: string
): ScopesPerChannel<So> {
  const perChannel = {} as ScopesPerChannel<So>;
  Object.keys(sources).forEach(channel => {
    if (typeof scopes === 'string') {
      perChannel[channel] = scopes;
      return;
    }
    const candidate = (scopes as ScopesPerChannel<So>)[channel];
    if (typeof candidate !== 'undefined') {
      perChannel[channel] = candidate;
      return;
    }
    const wildcard = (scopes as WildcardScope)['*'];
    if (typeof wildcard !== 'undefined') {
      perChannel[channel] = wildcard;
      return;
    }
    perChannel[channel] = randomScope;
  });
  return perChannel;
}

function isolateAllSources<So extends Sources>(
  outerSources: So,
  scopes: ScopesPerChannel<So>
): So {
  const innerSources = {} as So;
  for (const channel in outerSources) {
    const outerSource = outerSources[channel] as IsolateableSource;
    if (
      outerSources.hasOwnProperty(channel) &&
      outerSource &&
      scopes[channel] !== null &&
      typeof outerSource.isolateSource === 'function'
    ) {
      innerSources[channel] = outerSource.isolateSource(
        outerSource,
        scopes[channel]
      ) as any;
    } else if (outerSources.hasOwnProperty(channel)) {
      innerSources[channel] = outerSources[channel];
    }
  }
  return innerSources;
}

function isolateAllSinks<So extends Sources, Si>(
  sources: So,
  innerSinks: Si,
  scopes: ScopesPerChannel<So>
): Si {
  const outerSinks = {} as Si;
  for (const channel in innerSinks) {
    const source = sources[channel] as IsolateableSource;
    const innerSink = innerSinks[channel];
    if (
      innerSinks.hasOwnProperty(channel) &&
      source &&
      scopes[channel] !== null &&
      typeof source.isolateSink === 'function'
    ) {
      outerSinks[channel] = adapt(
        source.isolateSink(xs.fromObservable(innerSink as any), scopes[channel])
      );
    } else if (innerSinks.hasOwnProperty(channel)) {
      outerSinks[channel] = innerSinks[channel];
    }
  }
  return outerSinks;
}

/**
 * `isolate` takes a small component as input, and returns a big component.
 * A "small" component is a component that operates in a deeper scope.
 * A "big" component is a component that operates on a scope that
 * includes/wraps/nests the small component's scope. This is specially true for
 * isolation contexts such as onionify.
 *
 * Notice that we type BigSo/BigSi as any. This is unfortunate, since ideally
 * these would be generics in `isolate`. TypeScript's inference isn't strong
 * enough yet for us to automatically provide the typings that would make
 * `isolate` return a big component. However, we still keep these aliases here
 * in case TypeScript's inference becomes better, then we know how to proceed
 * to provide proper types.
 */

export type OuterSo<ISo> = {
  [K in keyof ISo]: ISo[K] extends IsolateableSource
    ? FirstArg<IsolateableSource['isolateSource']>
    : ISo[K];
};

export type OuterSi<ISo, ISi> = {
  [K in keyof ISo & keyof ISi]: ISo[K] extends IsolateableSource
    ? (ReturnType<ISo[K]['isolateSink']> extends ISi[K]
        ? ISi[K]
        : ReturnType<ISo[K]['isolateSink']> extends Stream<infer T>
        ? Stream<T>
        : (ReturnType<ISo[K]['isolateSink']> extends Stream<any>
            ? Stream<unknown>
            : unknown))
    : ISi[K];
} &
  {[K in Exclude<keyof ISi, keyof ISo>]: ISi[K]};

let counter = 0;
function newScope(): string {
  return `cycle${++counter}`;
}

/**
 * Takes a `component` function and a `scope`, and returns an isolated version
 * of the `component` function.
 *
 * When the isolated component is invoked, each source provided to it is
 * isolated to the given `scope` using `source.isolateSource(source, scope)`,
 * if possible. Likewise, the sinks returned from the isolated component are
 * isolated to the given `scope` using `source.isolateSink(sink, scope)`.
 *
 * The `scope` can be a string or an object. If it is anything else than those
 * two types, it will be converted to a string. If `scope` is an object, it
 * represents "scopes per channel", allowing you to specify a different scope
 * for each key of sources/sinks. For instance
 *
 * ```js
 * const childSinks = isolate(Child, {DOM: 'foo', HTTP: 'bar'})(sources);
 * ```
 *
 * You can also use a wildcard `'*'` to use as a default for source/sinks
 * channels that did not receive a specific scope:
 *
 * ```js
 * // Uses 'bar' as the isolation scope for HTTP and other channels
 * const childSinks = isolate(Child, {DOM: 'foo', '*': 'bar'})(sources);
 * ```
 *
 * If a channel's value is null, then that channel's sources and sinks won't be
 * isolated. If the wildcard is null and some channels are unspecified, those
 * channels won't be isolated. If you don't have a wildcard and some channels
 * are unspecified, then `isolate` will generate a random scope.
 *
 * ```js
 * // Does not isolate HTTP requests
 * const childSinks = isolate(Child, {DOM: 'foo', HTTP: null})(sources);
 * ```
 *
 * If the `scope` argument is not provided at all, a new scope will be
 * automatically created. This means that while **`isolate(component, scope)` is
 * pure** (referentially transparent), **`isolate(component)` is impure** (not
 * referentially transparent). Two calls to `isolate(Foo, bar)` will generate
 * the same component. But, two calls to `isolate(Foo)` will generate two
 * distinct components.
 *
 * ```js
 * // Uses some arbitrary string as the isolation scope for HTTP and other channels
 * const childSinks = isolate(Child, {DOM: 'foo'})(sources);
 * ```
 *
 * Note that both `isolateSource()` and `isolateSink()` are static members of
 * `source`. The reason for this is that drivers produce `source` while the
 * application produces `sink`, and it's the driver's responsibility to
 * implement `isolateSource()` and `isolateSink()`.
 *
 * _Note for Typescript users:_ `isolate` is not currently type-transparent and
 * will explicitly convert generic type arguments to `any`. To preserve types in
 * your components, you can use a type assertion:
 *
 * ```ts
 * // if Child is typed `Component<Sources, Sinks>`
 * const isolatedChild = isolate( Child ) as Component<Sources, Sinks>;
 * ```
 *
 * @param {Function} component a function that takes `sources` as input
 * and outputs a collection of `sinks`.
 * @param {String} scope an optional string that is used to isolate each
 * `sources` and `sinks` when the returned scoped component is invoked.
 * @return {Function} the scoped component function that, as the original
 * `component` function, takes `sources` and returns `sinks`.
 * @function isolate
 */
function isolate<InnerSo, InnerSi>(
  component: Component<InnerSo, InnerSi>,
  scope: any = newScope()
): Component<OuterSo<InnerSo>, OuterSi<InnerSo, InnerSi>> {
  checkIsolateArgs(component, scope);
  const randomScope = typeof scope === 'object' ? newScope() : '';
  const scopes: any =
    typeof scope === 'string' || typeof scope === 'object'
      ? scope
      : scope.toString();
  return function wrappedComponent(
    outerSources: OuterSo<InnerSo>,
    ...rest: Array<any>
  ): OuterSi<InnerSo, InnerSi> {
    const scopesPerChannel = normalizeScopes(outerSources, scopes, randomScope);
    const innerSources = isolateAllSources(
      outerSources as any,
      scopesPerChannel
    );
    const innerSinks = component(innerSources, ...rest);
    const outerSinks = isolateAllSinks(
      outerSources as any,
      innerSinks,
      scopesPerChannel
    );
    return outerSinks as any;
  };
}

(isolate as any).reset = () => (counter = 0);

export default isolate;

export function toIsolated<InnerSo, InnerSi>(
  scope: any = newScope()
): (
  c: Component<InnerSo, InnerSi>
) => Component<OuterSo<InnerSo>, OuterSi<InnerSo, InnerSi>> {
  return component => isolate(component, scope);
}
