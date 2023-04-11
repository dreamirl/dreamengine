import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';
import GameObject from '../GameObject';

export default class SimpleMoveComponent extends Component {
  /**
   * object used to apply move translation
   * @protected
   * @memberOf GameObject
   * @type {Object}
   */
  private _moveData = {
    done: true,
    distX: 0,
    distY: 0,
    dirX: 0,
    dirY: 0,
    duration: 0,
    oDuration: 0,
    curveName: '',
    stepValX: 0,
    stepValY: 0,
    destX: 0,
    destY: 0,
    callback: () => {},
    leftX: 0,
    leftY: 0,
  };
  private _selfDestruct = false;
  protected override _name = 'MoveComponent';

  constructor(
    public override readonly parent: AdvancedContainer,
    origin?: Point2D,
    pos?: Point2D,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent);

    if (pos && origin) {
      this._selfDestruct = selfDestruct;
      this.moveTo(origin, pos, duration, callback);
    }
  }

  moveToObject(
    gameObject: GameObject,
    duration: number = 500,
    callback?: () => void,
    curveName?: string,
  ) {
    let dest = gameObject.getWorldPos();

    this.moveTo(this.parent, dest, duration, callback, curveName);
  }

  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object / GameObject / PIXI.DisplayObject} pos give x, y destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current object context
   * @example // move to 100,100 in 1 second
   * player.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * player.moveTo( bonus, 1000, function(){ console.log( this ) } );
   */
  moveTo(
    origin: Point2D,
    dest: Point2D,
    duration: number = 500,
    callback = () => {},
    curveName?: string,
  ) {
    this._moveData = {
      distX: -(origin.x - dest.x),
      distY: -(origin.y - dest.y),
      dirX: origin.x > dest.x ? 1 : -1,
      dirY: origin.y > dest.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      curveName: curveName || 'linear',
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: dest.x,
      destY: dest.y,
      callback: callback,
      leftX: 0,
      leftY: 0,
    };
    this._moveData.leftX = this._moveData.distX;
    this._moveData.leftY = this._moveData.distY;

    return this;
  }

  /**
   * apply the move transition each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  override update(time: number) {
    if (this._moveData.done) return;

    var move = this._moveData;

    if (move.distX != 0) {
      move.stepValX = (time / move.oDuration) * move.distX;
      move.leftX -= move.stepValX;
      this.parent.x += move.stepValX;
    }

    if (move.distY != 0) {
      move.stepValY = (time / move.oDuration) * move.distY;
      move.leftY -= move.stepValY * move.dirY; // * dirY because y is inverted
      this.parent.y += move.stepValY;
    }

    move.duration -= time;

    // check pos
    if (move.dirX < 0 && move.leftX < 0) {
      this.parent.x += move.leftX;
    } else if (move.dirX > 0 && move.leftX > 0) {
      this.parent.x -= move.leftX;
    }

    if (move.dirY < 0 && move.leftY < 0) {
      this.parent.y += move.leftY;
    } else if (move.dirY > 0 && move.leftY > 0) {
      this.parent.y -= move.leftY;
    }

    if (move.duration <= 0) {
      this._moveData.done = true;
      this.parent.position.set(move.destX, move.destY);
      this.parent.emit('moveEnd');

      if (move.callback) move.callback();
      if (this._selfDestruct) {
        this.destroy();
      }
    }
  }
}
