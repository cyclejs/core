import { Driver } from '@cycle/run';
import {
  makeSubject,
  Producer,
  Operator,
  Dispose,
  pipe,
  subscribe,
  create,
  map,
  flatten,
  scan,
} from '@cycle/callbags';
import {
  Module,
  toVNode,
  init,
  attributesModule,
  styleModule,
  classModule,
  propsModule,
  datasetModule,
} from 'snabbdom';

import { DomEvent, DomCommand } from './types';

export const defaultModules: Module[] = [
  attributesModule,
  styleModule,
  classModule,
  propsModule,
  datasetModule,
];

export class DomDriver implements Driver<DomEvent, DomCommand> {
  private subject = makeSubject<DomEvent>();

  constructor(
    private container: string | Element | DocumentFragment,
    private modules: Module[] = defaultModules
  ) {}

  public consumeSink(sink: Producer<DomCommand>): Dispose {
    const patch = init(this.modules);

    const domReady$: Producer<null> = create((next, complete) => {
      if (document.readyState === 'loading') {
        document.addEventListener('readystatechange', () => {
          const state = document.readyState;
          if (state === 'interactive' || state === 'complete') {
            next(null);
            complete();
          }
        });
      } else {
        next(null);
        complete();
      }
    });

    const handleCommands: Operator<DomCommand, null> = sink => {
      const elem =
        typeof this.container === 'string'
          ? document.querySelector(this.container)!
          : this.container;

      return pipe(
        sink,
        scan((vdom, command) => {
          if ('commandType' in command) {
            return vdom;
          } else {
            return patch(vdom, command);
          }
        }, toVNode(elem))
      );
    };

    const dispose = pipe(
      domReady$,
      map(() => handleCommands(sink)),
      flatten,
      subscribe(() => {})
    );
    return dispose;
  }
}
