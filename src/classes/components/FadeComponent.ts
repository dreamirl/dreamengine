import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';

export default class FadeComponent extends Component {
  private _fadeData: any;
  private selfDestruct;
  protected override _name = 'FadeComponent';
  protected override _parent: AdvancedContainer;

  constructor(
    parent: AdvancedContainer,
    duration: number = 0,
    to: number = 0,
    from: number = parent.alpha,
    force: boolean = true,
    callback = () => {},
    selfDestruct: boolean = true,
  ) {
    super(parent);

    if (duration != 0) {
      this.fade(from, to, duration, force, callback);
      this.selfDestruct = selfDestruct;
    }

    this._parent = parent;
  }

  fade(
    from: number,
    to: number,
    duration: number,
    force: boolean,
    callback = () => {},
  ) {
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

  fadeTo(to: number, duration: number, force: boolean, callback = () => {}) {
    this.fade(this._parent.alpha, to, duration, force, callback);
  }

  fadeOut(duration: number, force: boolean, callback = () => {}) {
    if (force) {
      this.enable = true;
      this._parent.alpha = this._parent.alpha > 0 ? this._parent.alpha : 1; // make sure to prevent any blink side effect
    }

    this.fade(this._parent.alpha, 0, duration, force, callback);
  }

  fadeIn(duration: number, force: boolean, callback = () => {}) {
    if (force) {
      this.enable = true;
      this._parent.alpha = this._parent.alpha < 1 ? this._parent.alpha : 0; // make sure to prevent any blink side effect
    }

    this.fade(this._parent.alpha, 1, duration, force, callback);
  }

  override update(time: number) {
    if (!this._fadeData.done) {
      this._fadeData.stepVal =
        (time / this._fadeData.oDuration) *
        this._fadeData.dir *
        this._fadeData.fadeScale;
      this._parent.alpha += this._fadeData.stepVal;
      this._fadeData.duration -= time;

      if (
        (this._fadeData.dir < 0 && this._parent.alpha <= this._fadeData.to) ||
        (this._fadeData.dir > 0 && this._parent.alpha >= this._fadeData.to) ||
        this._parent.alpha < 0 ||
        this._parent.alpha > 1
      ) {
        this._parent.alpha = this._fadeData.to;
      }

      if (this._fadeData.duration <= 0) {
        this._fadeData.done = true;

        this._parent.emit('fadeEnd', this);

        this._fadeData.callback();
        if (this.selfDestruct) this.destroy();
      }
    }
  }
}
