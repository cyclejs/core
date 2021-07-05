import xs, {Stream, MemoryStream} from 'xstream';
import {
  HistoryInput,
  HistoryDriver,
  GoBackHistoryInput,
  GoForwardHistoryInput,
  GoHistoryInput,
  PushHistoryInput,
  ReplaceHistoryInput,
} from './types';

const CLICK_EVENT =
  typeof document !== 'undefined' && document.ontouchstart
    ? 'touchstart'
    : 'click';

function which(ev: any) {
  if (typeof window === 'undefined') {
    return false;
  }
  const e = ev || window.event;
  return e.which === null ? e.button : e.which;
}

function sameOrigin(href: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  return href && href.indexOf(window.location.origin) === 0;
}

function makeClickListener(push: (input: HistoryInput) => void) {
  return function clickListener(event: MouseEvent) {
    if (which(event) !== 1) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    let element: any = event.target;
    while (element && element.nodeName !== 'A') {
      element = element.parentNode;
    }

    if (!element || element.nodeName !== 'A') {
      return;
    }

    if (
      element.hasAttribute('download') ||
      element.getAttribute('rel') === 'external'
    ) {
      return;
    }

    if (element.target) {
      return;
    }

    const link = element.getAttribute('href');

    if ((link && link.indexOf('mailto:') > -1) || link.charAt(0) === '#') {
      return;
    }

    if (!sameOrigin(element.href)) {
      return;
    }

    event.preventDefault();
    const {pathname, search, hash = ''} = element;
    push({type: 'push', pathname, search, hash});
  };
}

function captureAnchorClicks(push: (input: HistoryInput) => void) {
  const listener = makeClickListener(push);
  if (typeof window !== 'undefined') {
    document.addEventListener(CLICK_EVENT, listener as EventListener, false);
  }
  return () =>
    document.removeEventListener(CLICK_EVENT, listener as EventListener);
}

export function captureClicks(historyDriver: HistoryDriver): HistoryDriver {
  return function historyDriverWithClickCapture(sink$: Stream<HistoryInput>) {
    let cleanup: Function | undefined;
    const internalSink$ = xs.create<HistoryInput>({
      start: () => {},
      stop: () => typeof cleanup === 'function' && cleanup(),
    });
    cleanup = captureAnchorClicks((input: HistoryInput) => {
      internalSink$._n(input);
    });
    sink$._add(internalSink$);
    return historyDriver(internalSink$);
  };
}
