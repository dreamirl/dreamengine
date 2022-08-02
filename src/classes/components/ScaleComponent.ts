import Component from '../Component';

export default class ScaleComponent extends Component {
  /**
   * object used to apply scale transition
   * @protected
   * @memberOf GameObject
   * @type {Object}
   */
  private _scaleData = {
    duration: 1000,
    done: true,
    valX: 0,
    valY: 0,
    dirX: 0,
    dirY: 0,
    oDuration: 0,
    stepValX: 0,
    stepValY: 0,
    destX: 0,
    destY: 0,
    scaleX: 0,
    scaleY: 0,
    callback: () => {},
    leftX: 0,
    leftY: 0,
  };

  private _savedScale;
  private _selfDestruct = false;
  protected _name = 'ScaleComponent';

  constructor(
    parent,
    scale?: number,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent);

    if (scale !== undefined) {
      this._selfDestruct = selfDestruct;
      this.scaleTo(scale, duration, callback);
    }
  }

  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myGameObject.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  scaleTo(scale, duration, callback) {
    var dscale = {
      x: !isNaN(scale) ? scale : scale.x,
      y: !isNaN(scale) ? scale : scale.y,
    };
    this._scaleData = {
      valX: -(
        this._savedScale.x -
        (dscale.x !== undefined ? dscale.x : this._savedScale.x)
      ),
      valY: -(
        this._savedScale.y -
        (dscale.y !== undefined ? dscale.y : this._savedScale.y)
      ),
      dirX: this._savedScale.x > dscale.x ? 1 : -1,
      dirY: this._savedScale.y > dscale.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: dscale.x,
      destY: dscale.y,
      scaleX: this._savedScale.x,
      scaleY: this._savedScale.y,
      callback,
      leftX: 0,
      leftY: 0,
    };
    this._scaleData.leftX = this._scaleData.valX;
    this._scaleData.leftY = this._scaleData.valY;

    return this;
  }

  /**
   * apply the current scale
   * @protected
   * @memberOf GameObject
   */
  update(time) {
    if (this._scaleData.done) {
      return;
    }

    var scaleD = this._scaleData;

    if (scaleD.valX != 0) {
      scaleD.stepValX = (time / scaleD.oDuration) * scaleD.valX;
      scaleD.leftX -= scaleD.stepValX;
      scaleD.scaleX += scaleD.stepValX;
    }

    if (scaleD.valY != 0) {
      scaleD.stepValY = (time / scaleD.oDuration) * scaleD.valY;
      scaleD.leftY -= scaleD.stepValY;
      scaleD.scaleY += scaleD.stepValY;
    }
    scaleD.duration -= time;

    // check scale
    if (scaleD.dirX < 0 && scaleD.leftX < 0) {
      scaleD.scaleX += scaleD.leftX;
    } else if (scaleD.dirX > 0 && scaleD.leftX > 0) {
      scaleD.scaleX -= scaleD.leftX;
    }

    if (scaleD.dirY < 0 && scaleD.leftY < 0) {
      scaleD.scaleY += scaleD.leftY;
    } else if (scaleD.dirY > 0 && scaleD.leftY > 0) {
      scaleD.scaleY -= scaleD.leftY;
    }

    this.parent.scale.set(scaleD.scaleX, scaleD.scaleY);

    if (scaleD.duration <= 0) {
      this._scaleData.done = true;
      this.parent.scale.set(scaleD.destX, scaleD.destY);

      this.parent.emit('scale-end', this);

      if (this._scaleData.callback) {
        this._scaleData.callback();
      }

      if (this._selfDestruct) {
        this.destroy();
      }
    }
  }
}
