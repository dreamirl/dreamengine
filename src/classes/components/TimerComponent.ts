import Component from '../Component';

export default class TimerComponent extends Component {
  /**
   * object used to apply shake
   * @protected
   * @memberOf GameObject
   * @type {Object}
   */
  private _timers: Record<number, TimerComponentData> = {};

  protected override _name = 'TimerComponent';

  counter = 0;

  invoke(
    callback: () => void,
    interval = 0,
    persistent = false,
    id: number = ++this.counter
  ) {
    this._timers[id] = {
      callback,
      interval,
      persistent,
      id: id,
      timeSinceLastCall: 0,
    };
    return id;
  }

  clear(id: number) {
    delete this._timers[id];
  }

  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  override update(time: number) {
    for (const key in this._timers) {
      const timer = this._timers[key];
      timer.timeSinceLastCall += time;
      if (timer.timeSinceLastCall > timer.interval) {
        timer.timeSinceLastCall -= timer.interval;

        timer.callback();
        if (!timer.persistent) {
          delete this._timers[key];
        }
      }
    }
  }
}
