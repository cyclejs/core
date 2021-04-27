import { VNode } from 'snabbdom';

export type DomEvent = any;

export type DomCommand = VNode | AttachEventListenerCommand;

export type AttachEventListenerCommand = {
  commandType: 'attachEventListener';
};

export type Scope =
  | string
  | symbol
  | { type: 'total' | 'sibling'; value: string | symbol };
