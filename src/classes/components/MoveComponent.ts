import Component from '../Component';
import GameObject from '../GameObject';

export default class MoveComponent extends Component {
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
  protected _name = 'MoveComponent';

  constructor(
    parent,
    pos?: GameObject,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent);

    if (pos) {
      this._selfDestruct = selfDestruct;
      this.moveTo(pos, duration, callback);
    }
  }

  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object / GameObject / PIXI.DisplayObject} pos give x, y, and z destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current object context
   * @example // move to 100,100 in 1 second
   * player.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * player.moveTo( bonus, 1000, function(){ console.log( this ) } );
   */
  moveTo(
    pos: GameObject,
    duration: number = 500,
    callback?,
    curveName?,
    forceLocalPos?, // TODO add curveName (not coded)
  ) {
    if (pos.getWorldPos) {
      pos = pos.getWorldPos();
    }

    var myPos = this.parent;
    var parentPos;

    // TODO: to fix
    // if (!forceLocalPos) {
    //   myPos = this.parent.getWorldPos();

    //   if (this.parent && this.parent.getWorldPos) {
    //     parentPos = this.parent.getWorldPos();
    //   }
    // }

    this._moveData = {
      distX: -(myPos.x - (pos.x !== undefined ? pos.x : myPos.x)),
      distY: -(myPos.y - (pos.y !== undefined ? pos.y : myPos.y)),
      dirX: myPos.x > pos.x ? 1 : -1,
      dirY: myPos.y > pos.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      curveName: curveName || 'linear',
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: parentPos ? pos.x - parentPos.x : pos.x,
      destY: parentPos ? pos.y - parentPos.y : pos.y,
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
  update(time) {
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
      this.parent.position.set(
        move.destX !== undefined ? move.destX : this.parent.x,
        move.destY !== undefined ? move.destY : this.parent.y,
      );
      this.parent.emit('moveEnd');

      if (move.callback) {
        move.callback.call(this, move.callback);
      }
      if (this._selfDestruct) {
        this.destroy();
      }
    }
  }
}
