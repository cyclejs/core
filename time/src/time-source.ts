import {Stream} from 'xstream';
import {Frame} from './animation-frames';
import {Comparator, OperatorArgs} from './types';

export type Operator = <T>(stream: Stream<T>) => Stream<T>;

export interface ObjectDictionary<T> {
  [key: string]: T;
}

export interface TimeSource {
  createOperator<T>(): OperatorArgs<T>;
  animationFrames(): Stream<Frame>;
  delay(delayTime: number): Operator;
  debounce(period: number): Operator;
  throttle(period: number): Operator;
  periodic(period: number): Stream<number>;
  throttleAnimation: Operator;
  dispose(): void;
}

export interface MockTimeSource extends TimeSource {
  diagram<T>(str: string, values: ObjectDictionary<T> | Array<T>): Stream<T>;
  diagram(str: string): Stream<number | string>;
  diagram(str: string, values?: Object): Stream<any>;
  record(stream: Stream<any>): Stream<Array<any>>;
  assertEqual(
    actual: Stream<any>,
    expected: Stream<any>,
    comparator?: Comparator
  ): void;
  run(cb?: (err?: Error) => void): void;
}
