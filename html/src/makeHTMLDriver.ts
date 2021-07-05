import {Driver} from '@cycle/run';
import {Stream} from 'xstream';
import {VNode} from 'snabbdom/vnode';
import {HTMLSource} from './HTMLSource';
const init: Init = require('snabbdom-to-html/init');
const modulesForHTML: ModulesForHTML = require('snabbdom-to-html/modules');

type Init = (modules: Array<Module>) => (vnode: VNode) => string;

interface ModulesForHTML {
  attributes: Module;
  props: Module;
  class: Module;
  style: Module;
  dataset: Module;
}

export type Module = (vnode: VNode, attributes: Map<string, any>) => void;

const defaultModules = [
  modulesForHTML.attributes,
  modulesForHTML.props,
  modulesForHTML.class,
  modulesForHTML.style,
  modulesForHTML.dataset,
];

export interface HTMLDriverOptions {
  modules?: Array<Module>;
  reportSnabbdomError?(err: any): void;
}

export type EffectCallback = (html: string) => void;

function defaultReportSnabbdomError(err: any): void {
  console.error(err);
}

export function makeHTMLDriver(
  effect: EffectCallback,
  options: HTMLDriverOptions = {}
): Driver<Stream<VNode>, HTMLSource> {
  const modules = options.modules || defaultModules;
  const toHTML = init(modules);
  function htmlDriver(vnode$: Stream<VNode>, name: string): HTMLSource {
    const html$ = vnode$.map(vdom => {
      if (typeof vdom !== 'object') {
        throw new Error('Expected virtual dom tree, not ' + typeof vdom);
      } else {
        return toHTML(vdom);
      }
    });
    html$.addListener({
      next: effect,
      error: options.reportSnabbdomError || defaultReportSnabbdomError,
    });
    return new HTMLSource(html$, name);
  }
  return htmlDriver as any;
}
