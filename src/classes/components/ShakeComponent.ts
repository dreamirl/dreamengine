import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';

export default class ShakeComponent extends Component {
  /**
   * object used to apply shake
   * @protected
   * @memberOf GameObject
   * @type {Object}
   */
  private _shakeData = {
    duration: 0,
    xRange: 0,
    yRange: 0,
    done: true,
    prevX: 0,
    prevY: 0,
    callback: () => {},
  };
  private _selfDestruct = false;
  protected override _name = 'ShakeComponent';
  protected override _parent: AdvancedContainer;

  constructor(
    parent: AdvancedContainer,
    xRange = 0,
    yRange = 0,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent);

    if (xRange !== 0 || yRange !== 0) {
      this._selfDestruct = selfDestruct;
      this.shake(xRange, yRange, duration, callback);
    }
    this._parent = parent;
  }

  /**
   * create a shake with given range
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Int} xRange max X gameObject will move to shake
   * @param {Int} yRange max Y gameObject will move to shake
   * @param {Int} [duration=500] time duration
   * @example // shake with 10-10 force during 1sec
   * player.shake( 10, 10, 1000 );
   */
  shake(xRange: number, yRange: number, duration = 500, callback = () => {}) {
    this._shakeData = {
      done: false,
      duration,
      xRange: xRange,
      yRange: yRange,
      prevX: this._shakeData ? this._shakeData.prevX : 0,
      prevY: this._shakeData ? this._shakeData.prevY : 0,
      callback,
    };

    return this;
  }

  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  override update(time: number) {
    if (this._shakeData.done) {
      return;
    }

    const shake = this._shakeData;
    // restore previous shake
    this._parent.x -= shake.prevX;
    this._parent.y -= shake.prevY;
    shake.duration -= time;
    // old way - Date.now() - this._shakeData.startedAt > this._shakeData.duration )
    if (shake.duration <= 0) {
      shake.done = true;
      shake.prevX = 0;
      shake.prevY = 0;

      this._parent.emit('shakeEnd');

      shake.callback();
      if (this._selfDestruct) {
        this.destroy();
      }
      return;
    }

    shake.prevX =
      (-(Math.random() * shake.xRange) + Math.random() * shake.xRange) >> 0;
    shake.prevY =
      (-(Math.random() * shake.yRange) + Math.random() * shake.yRange) >> 0;

    this._parent.x += shake.prevX;
    this._parent.y += shake.prevY;
  }
}
