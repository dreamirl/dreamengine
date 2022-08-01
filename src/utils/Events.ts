import EventEmitter from 'eventemitter3';

class Events extends EventEmitter {
  constructor() {
    super();
  }

  public static Emitter = EventEmitter;
  public static DEName = 'Events';
}

const ev = new Events();
export default ev;
