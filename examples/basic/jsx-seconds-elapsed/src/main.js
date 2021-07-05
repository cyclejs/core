import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import {timeDriver} from '@cycle/time';
import {html} from 'snabbdom-jsx';

function main(sources) {
  //map to i + 1 so that Timer begins from 1, since startWith already provides the 0.
  const vdom$ = sources.Time.periodic(1000).map(i => i + 1).startWith(0)
    .map(i =>
      <div>Seconds elapsed {i}</div>
    );

  return {
    DOM: vdom$,
  };
}

run(main, {
  DOM: makeDOMDriver('#main-container'),
  Time: timeDriver
});
