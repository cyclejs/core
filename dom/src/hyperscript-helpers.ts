import { h, VNode } from 'snabbdom';

function isSelector(param: any): boolean {
  return (
    typeof param === 'string' &&
    param.length > 0 &&
    (param[0] === '.' || param[0] === '#')
  );
}

export function createTagFunction(tagName: string): HyperScriptHelperFn {
  return function hyperscript(a?: any, b?: any, c?: any) {
    const hasA = typeof a !== 'undefined';
    const hasB = typeof b !== 'undefined';
    const hasC = typeof c !== 'undefined';

    if (isSelector(a)) {
      if (hasB && hasC) return h(tagName + a, b, c);
      else if (hasB) return h(tagName + a, b);
      else return h(tagName + a, {});
    } else if (hasC) return h(tagName + a, b, c);
    else if (hasB) return h(tagName, a, b);
    else if (hasA) return h(tagName, a);
    else return h(tagName, {});
  };
}

export type Children = Array<VNode | string | null>;
export type Properties = any; //VNodeData // does not work yet, because of https://github.com/snabbdom/snabbdom/pull/325
export interface HyperScriptHelperFn {
  (): VNode;
  (textOrSelector: string): VNode;
  (children: Children): VNode;
  (properties: Properties): VNode;
  (selector: string, children: Children): VNode;
  (selector: string, text: string): VNode;
  (selector: string, properties: Properties): VNode;
  (properties: Properties, children: Children): VNode;
  (properties: Properties, text: string): VNode;
  (selector: string, properties: Properties, text: string): VNode;
  (selector: string, properties: Properties, children: Children): VNode;
}

export const a = /*@__PURE__*/ createTagFunction('a');
export const abbr = /*@__PURE__*/ createTagFunction('abbr');
export const address = /*@__PURE__*/ createTagFunction('address');
export const area = /*@__PURE__*/ createTagFunction('area');
export const article = /*@__PURE__*/ createTagFunction('article');
export const aside = /*@__PURE__*/ createTagFunction('aside');
export const audio = /*@__PURE__*/ createTagFunction('audio');
export const b = /*@__PURE__*/ createTagFunction('b');
export const base = /*@__PURE__*/ createTagFunction('base');
export const bdi = /*@__PURE__*/ createTagFunction('bdi');
export const bdo = /*@__PURE__*/ createTagFunction('bdo');
export const blockquote = /*@__PURE__*/ createTagFunction('blockquote');
export const body = /*@__PURE__*/ createTagFunction('body');
export const br = /*@__PURE__*/ createTagFunction('br');
export const button = /*@__PURE__*/ createTagFunction('button');
export const canvas = /*@__PURE__*/ createTagFunction('canvas');
export const caption = /*@__PURE__*/ createTagFunction('caption');
export const cite = /*@__PURE__*/ createTagFunction('cite');
export const code = /*@__PURE__*/ createTagFunction('code');
export const col = /*@__PURE__*/ createTagFunction('col');
export const colgroup = /*@__PURE__*/ createTagFunction('colgroup');
export const dd = /*@__PURE__*/ createTagFunction('dd');
export const del = /*@__PURE__*/ createTagFunction('del');
export const details = /*@__PURE__*/ createTagFunction('details');
export const dfn = /*@__PURE__*/ createTagFunction('dfn');
export const dir = /*@__PURE__*/ createTagFunction('dir');
export const div = /*@__PURE__*/ createTagFunction('div');
export const dl = /*@__PURE__*/ createTagFunction('dl');
export const dt = /*@__PURE__*/ createTagFunction('dt');
export const em = /*@__PURE__*/ createTagFunction('em');
export const embed = /*@__PURE__*/ createTagFunction('embed');
export const fieldset = /*@__PURE__*/ createTagFunction('fieldset');
export const figcaption = /*@__PURE__*/ createTagFunction('figcaption');
export const figure = /*@__PURE__*/ createTagFunction('figure');
export const footer = /*@__PURE__*/ createTagFunction('footer');
export const form = /*@__PURE__*/ createTagFunction('form');
export const h1 = /*@__PURE__*/ createTagFunction('h1');
export const h2 = /*@__PURE__*/ createTagFunction('h2');
export const h3 = /*@__PURE__*/ createTagFunction('h3');
export const h4 = /*@__PURE__*/ createTagFunction('h4');
export const h5 = /*@__PURE__*/ createTagFunction('h5');
export const h6 = /*@__PURE__*/ createTagFunction('h6');
export const head = /*@__PURE__*/ createTagFunction('head');
export const header = /*@__PURE__*/ createTagFunction('header');
export const hgroup = /*@__PURE__*/ createTagFunction('hgroup');
export const hr = /*@__PURE__*/ createTagFunction('hr');
export const html = /*@__PURE__*/ createTagFunction('html');
export const i = /*@__PURE__*/ createTagFunction('i');
export const iframe = /*@__PURE__*/ createTagFunction('iframe');
export const img = /*@__PURE__*/ createTagFunction('img');
export const input = /*@__PURE__*/ createTagFunction('input');
export const ins = /*@__PURE__*/ createTagFunction('ins');
export const kbd = /*@__PURE__*/ createTagFunction('kbd');
export const keygen = /*@__PURE__*/ createTagFunction('keygen');
export const label = /*@__PURE__*/ createTagFunction('label');
export const legend = /*@__PURE__*/ createTagFunction('legend');
export const li = /*@__PURE__*/ createTagFunction('li');
export const link = /*@__PURE__*/ createTagFunction('link');
export const main = /*@__PURE__*/ createTagFunction('main');
export const map = /*@__PURE__*/ createTagFunction('map');
export const mark = /*@__PURE__*/ createTagFunction('mark');
export const menu = /*@__PURE__*/ createTagFunction('menu');
export const meta = /*@__PURE__*/ createTagFunction('meta');
export const nav = /*@__PURE__*/ createTagFunction('nav');
export const noscript = /*@__PURE__*/ createTagFunction('noscript');
export const object = /*@__PURE__*/ createTagFunction('object');
export const ol = /*@__PURE__*/ createTagFunction('ol');
export const optgroup = /*@__PURE__*/ createTagFunction('optgroup');
export const option = /*@__PURE__*/ createTagFunction('option');
export const p = /*@__PURE__*/ createTagFunction('p');
export const param = /*@__PURE__*/ createTagFunction('param');
export const pre = /*@__PURE__*/ createTagFunction('pre');
export const progress = /*@__PURE__*/ createTagFunction('progress');
export const q = /*@__PURE__*/ createTagFunction('q');
export const rp = /*@__PURE__*/ createTagFunction('rp');
export const rt = /*@__PURE__*/ createTagFunction('rt');
export const ruby = /*@__PURE__*/ createTagFunction('ruby');
export const s = /*@__PURE__*/ createTagFunction('s');
export const samp = /*@__PURE__*/ createTagFunction('samp');
export const script = /*@__PURE__*/ createTagFunction('script');
export const section = /*@__PURE__*/ createTagFunction('section');
export const select = /*@__PURE__*/ createTagFunction('select');
export const small = /*@__PURE__*/ createTagFunction('small');
export const source = /*@__PURE__*/ createTagFunction('source');
export const span = /*@__PURE__*/ createTagFunction('span');
export const strong = /*@__PURE__*/ createTagFunction('strong');
export const style = /*@__PURE__*/ createTagFunction('style');
export const sub = /*@__PURE__*/ createTagFunction('sub');
export const summary = /*@__PURE__*/ createTagFunction('summary');
export const sup = /*@__PURE__*/ createTagFunction('sup');
export const table = /*@__PURE__*/ createTagFunction('table');
export const tbody = /*@__PURE__*/ createTagFunction('tbody');
export const td = /*@__PURE__*/ createTagFunction('td');
export const textarea = /*@__PURE__*/ createTagFunction('textarea');
export const tfoot = /*@__PURE__*/ createTagFunction('tfoot');
export const th = /*@__PURE__*/ createTagFunction('th');
export const thead = /*@__PURE__*/ createTagFunction('thead');
export const time = /*@__PURE__*/ createTagFunction('time');
export const title = /*@__PURE__*/ createTagFunction('title');
export const tr = /*@__PURE__*/ createTagFunction('tr');
export const u = /*@__PURE__*/ createTagFunction('u');
export const ul = /*@__PURE__*/ createTagFunction('ul');
export const video = /*@__PURE__*/ createTagFunction('video');
export const svg = /*@__PURE__*/ createTagFunction('svg');

// SVG tags
export const altGlyph = /*@__PURE__*/ createTagFunction('altGlyph');
export const altGlyphDef = /*@__PURE__*/ createTagFunction('altGlyphDef');
export const altGlyphItem = /*@__PURE__*/ createTagFunction('altGlyphItem');
export const animate = /*@__PURE__*/ createTagFunction('animate');
export const animateColor = /*@__PURE__*/ createTagFunction('animateColor');
export const animateMotion = /*@__PURE__*/ createTagFunction('animateMotion');
export const animateTransform = /*@__PURE__*/ createTagFunction(
  'animateTransform'
);
export const circle = /*@__PURE__*/ createTagFunction('circle');
export const clipPath = /*@__PURE__*/ createTagFunction('clipPath');
export const colorProfile = /*@__PURE__*/ createTagFunction('colorProfile');
export const cursor = /*@__PURE__*/ createTagFunction('cursor');
export const defs = /*@__PURE__*/ createTagFunction('defs');
export const desc = /*@__PURE__*/ createTagFunction('desc');
export const ellipse = /*@__PURE__*/ createTagFunction('ellipse');
export const feBlend = /*@__PURE__*/ createTagFunction('feBlend');
export const feColorMatrix = /*@__PURE__*/ createTagFunction('feColorMatrix');
export const feComponentTransfer = /*@__PURE__*/ createTagFunction(
  'feComponentTransfer'
);
export const feComposite = /*@__PURE__*/ createTagFunction('feComposite');
export const feConvolveMatrix = /*@__PURE__*/ createTagFunction(
  'feConvolveMatrix'
);
export const feDiffuseLighting = /*@__PURE__*/ createTagFunction(
  'feDiffuseLighting'
);
export const feDisplacementMap = /*@__PURE__*/ createTagFunction(
  'feDisplacementMap'
);
export const feDistantLight = /*@__PURE__*/ createTagFunction('feDistantLight');
export const feFlood = /*@__PURE__*/ createTagFunction('feFlood');
export const feFuncA = /*@__PURE__*/ createTagFunction('feFuncA');
export const feFuncB = /*@__PURE__*/ createTagFunction('feFuncB');
export const feFuncG = /*@__PURE__*/ createTagFunction('feFuncG');
export const feFuncR = /*@__PURE__*/ createTagFunction('feFuncR');
export const feGaussianBlur = /*@__PURE__*/ createTagFunction('feGaussianBlur');
export const feImage = /*@__PURE__*/ createTagFunction('feImage');
export const feMerge = /*@__PURE__*/ createTagFunction('feMerge');
export const feMergeNode = /*@__PURE__*/ createTagFunction('feMergeNode');
export const feMorphology = /*@__PURE__*/ createTagFunction('feMorphology');
export const feOffset = /*@__PURE__*/ createTagFunction('feOffset');
export const fePointLight = /*@__PURE__*/ createTagFunction('fePointLight');
export const feSpecularLighting = /*@__PURE__*/ createTagFunction(
  'feSpecularLighting'
);
export const feSpotlight = /*@__PURE__*/ createTagFunction('feSpotlight');
export const feTile = /*@__PURE__*/ createTagFunction('feTile');
export const feTurbulence = /*@__PURE__*/ createTagFunction('feTurbulence');
export const filter = /*@__PURE__*/ createTagFunction('filter');
export const font = /*@__PURE__*/ createTagFunction('font');
export const fontFace = /*@__PURE__*/ createTagFunction('fontFace');
export const fontFaceFormat = /*@__PURE__*/ createTagFunction('fontFaceFormat');
export const fontFaceName = /*@__PURE__*/ createTagFunction('fontFaceName');
export const fontFaceSrc = /*@__PURE__*/ createTagFunction('fontFaceSrc');
export const fontFaceUri = /*@__PURE__*/ createTagFunction('fontFaceUri');
export const foreignObject = /*@__PURE__*/ createTagFunction('foreignObject');
export const g = /*@__PURE__*/ createTagFunction('g');
export const glyph = /*@__PURE__*/ createTagFunction('glyph');
export const glyphRef = /*@__PURE__*/ createTagFunction('glyphRef');
export const hkern = /*@__PURE__*/ createTagFunction('hkern');
export const image = /*@__PURE__*/ createTagFunction('image');
export const line = /*@__PURE__*/ createTagFunction('line');
export const linearGradient = /*@__PURE__*/ createTagFunction('linearGradient');
export const marker = /*@__PURE__*/ createTagFunction('marker');
export const mask = /*@__PURE__*/ createTagFunction('mask');
export const metadata = /*@__PURE__*/ createTagFunction('metadata');
export const missingGlyph = /*@__PURE__*/ createTagFunction('missingGlyph');
export const mpath = /*@__PURE__*/ createTagFunction('mpath');
export const path = /*@__PURE__*/ createTagFunction('path');
export const pattern = /*@__PURE__*/ createTagFunction('pattern');
export const polygon = /*@__PURE__*/ createTagFunction('polygon');
export const polyline = /*@__PURE__*/ createTagFunction('polyline');
export const radialGradient = /*@__PURE__*/ createTagFunction('radialGradient');
export const rect = /*@__PURE__*/ createTagFunction('rect');
export const set = /*@__PURE__*/ createTagFunction('set');
export const stop = /*@__PURE__*/ createTagFunction('stop');
export const symbol = /*@__PURE__*/ createTagFunction('symbol');
export const text = /*@__PURE__*/ createTagFunction('text');
export const textPath = /*@__PURE__*/ createTagFunction('textPath');
export const tref = /*@__PURE__*/ createTagFunction('tref');
export const tspan = /*@__PURE__*/ createTagFunction('tspan');
export const use = /*@__PURE__*/ createTagFunction('use');
export const view = /*@__PURE__*/ createTagFunction('view');
export const vkern = /*@__PURE__*/ createTagFunction('vkern');
