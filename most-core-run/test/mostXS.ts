import {currentTime} from '@most/scheduler';
import {Stream} from '@most/types';
import xs, {Stream as xsStream} from 'xstream';

const tryEvent = (t: any, x: any, sink: any): any => {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
};

class MostXS {
  private xsStream: xsStream<any>;

  constructor(stream: xsStream<any>) {
    this.xsStream = stream;
  }

  public run(sink: any, scheduler: any): any {
    const send = (e: any): any => tryEvent(currentTime(scheduler), e, sink);

    const listener = {
      next: send,
      error: (e: any): any => sink.error(currentTime(scheduler), e),
      complete: (): any => sink.end(currentTime(scheduler)),
    };

    this.xsStream.addListener(listener);

    const dispose = () => this.xsStream.removeListener(listener);

    return {dispose};
  }
}

function fromXS(stream: xsStream<any>): Stream<any> {
  return new MostXS(stream);
}

export default fromXS;
