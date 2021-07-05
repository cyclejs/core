import {run} from '@cycle/run';
import xs from 'xstream';
import express from 'express';
import browserify from 'browserify';
import serialize from 'serialize-javascript';
import {html, head, title, body, div, script} from '@cycle/dom';
import {makeHTMLDriver} from '@cycle/html';
import app from './app';

function wrapVTreeWithHTMLBoilerplate([vtree, context, clientBundle]) {
  return (
    html([
      head([
        title('Cycle Isomorphism Example')
      ]),
      body([
        div('.app-container', [vtree]),
        script(`window.appContext = ${serialize(context)};`),
        script(clientBundle)
      ])
    ])
  );
}

function prependHTML5Doctype(html) {
  return `<!doctype html>${html}`;
}

function wrapAppResultWithBoilerplate(appFn, context$, bundle$) {
  return function wrappedAppFn(sources) {
    const vdom$ = appFn(sources).DOM;
    const wrappedVDOM$ = xs.combine(vdom$, context$, bundle$.take(1))
      .map(wrapVTreeWithHTMLBoilerplate)
      .last();
    return {
      DOM: wrappedVDOM$
    };
  };
}

const clientBundle$ = (() => {
  const bundle$ = xs.createWithMemory();
  let bundleString = '';
  const bundleStream = browserify()
    .transform('babelify')
    .transform({global: true}, 'uglifyify')
    .add('./client.js')
    .bundle();
  bundleStream.on('data', function (data) {
    bundleString += data;
  });
  bundleStream.on('end', function () {
    bundle$.shamefullySendNext(bundleString);
    console.log('Client bundle successfully compiled.');
  });
  return bundle$;
})();

const server = express();

server.use(function (req, res) {
  // Ignore favicon requests
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }
  console.log(`req: ${req.method} ${req.url}`);

  const context$ = xs.of({route: req.url});
  const wrappedAppFn = wrapAppResultWithBoilerplate(app, context$, clientBundle$);

  run(wrappedAppFn, {
    DOM: makeHTMLDriver(html => res.send(prependHTML5Doctype(html))),
    context: () => context$,
  });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Listening on port ${port}`);
