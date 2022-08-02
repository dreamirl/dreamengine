import Component from '../Component';

export default class FadeComponent extends Component {
  private _fadeData;
  private selfDestruct;
  protected _name = 'FadeComponent';

  constructor(
    parent,
    duration: number = 0,
    to: number = 0,
    from: number = parent.alpha,
    force: boolean = true,
    callback?: () => void,
    selfDestruct: boolean = true,
  ) {
    super(parent);

    if (duration != 0) {
      this.fade(from, to, duration, force, callback);
      this.selfDestruct = selfDestruct;
    }
  }

  fade(from, to, duration, force, callback) {
    if (force) {
      this.enable = true;
    }

    let dir = (from != undefined ? from : 1) > to ? -1 : 1;

    var data = {
      from: from != undefined ? from : 1,
      to: to != undefined ? to : 0,
      duration: duration || 500,
      oDuration: duration || 500,
      fadeScale: Math.abs(from - to),
      done: false,
      callback: callback,
      dir: dir,
    };

    this._fadeData = data;
  }

  fadeTo(to, duration, force, callback) {
    this.fade(this.parent.alpha, to, duration, force, callback);
  }

  fadeOut(duration, force, callback) {
    if (force) {
      this.enable = true;
      this.parent.alpha = this.parent.alpha > 0 ? this.parent.alpha : 1; // make sure to prevent any blink side effect
    }

    this.fade(this.parent.alpha, 0, duration, force, callback);
  }

  fadeIn(duration, force, callback) {
    if (force) {
      this.enable = true;
      this.parent.alpha = this.parent.alpha < 1 ? this.parent.alpha : 0; // make sure to prevent any blink side effect
    }

    this.fade(this.parent.alpha, 1, duration, force, callback);
  }

  update(time) {
    if (!this._fadeData.done) {
      this._fadeData.stepVal =
        (time / this._fadeData.oDuration) *
        this._fadeData.dir *
        this._fadeData.fadeScale;
      this.parent.alpha += this._fadeData.stepVal;
      this._fadeData.duration -= time;

      if (
        (this._fadeData.dir < 0 && this.parent.alpha <= this._fadeData.to) ||
        (this._fadeData.dir > 0 && this.parent.alpha >= this._fadeData.to) ||
        this.parent.alpha < 0 ||
        this.parent.alpha > 1
      ) {
        this.parent.alpha = this._fadeData.to;
      }

      if (this._fadeData.duration <= 0) {
        this._fadeData.done = true;

        this.parent.emit('fadeEnd', this);

        if (this._fadeData.callback) {
          this._fadeData.callback.call(this);
        }

        if (this.selfDestruct) this.destroy();
      }
    }
  }
}
