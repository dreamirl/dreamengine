import EventEmitter from 'eventemitter3';

// class Events extends EventEmitter {
//   constructor() {
//     super();
//   }

//   public static Emitter = EventEmitter;
//   public static DEName = 'Events';
// }

// const ev = new Events();
// export default ev;

type EngineEventsTypes = {
  debugModeChanged: number;
};

class Events<
  TGameEventsTypes extends Record<string, any>,
  TEventsTypes = TGameEventsTypes & EngineEventsTypes,
> {
  private readonly emitter = new EventEmitter();

  public readonly DEName = 'Events';
  public readonly Emitter = EventEmitter;

  public on<T extends string & keyof TEventsTypes>(
    event: T,
    listener: (...args: TEventsTypes[T][]) => void,
  ) {
    this.emitter.on(event, listener);
  }

  public once<T extends string & keyof TEventsTypes>(
    event: T,
    listener: (...args: TEventsTypes[T][]) => void,
  ) {
    this.emitter.once(event, listener);
  }

  public emit<T extends string & keyof TEventsTypes>(
    event: T,
    ...args: TEventsTypes[T][]
  ) {
    this.emitter.emit(event, args);
  }

  public removeListener<T extends string & keyof TEventsTypes>(
    event: T,
    listener: (...args: TEventsTypes[T][]) => void,
  ) {
    this.emitter.removeListener(event, listener);
  }
}
const ev = new Events();
export default ev;
