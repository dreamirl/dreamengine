import GameObject from 'DE.GameObject';
import Time from 'DE.Time';

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
GameObject.prototype.moveTo = function (
  pos,
  duration,
  callback,
  curveName,
  forceLocalPos, // TODO add curveName (not coded)
) {
  if (pos.getWorldPos) {
    pos = pos.getWorldPos();
  }

  var myPos = this;
  var parentPos = null;

  if (!forceLocalPos) {
    myPos = this.getWorldPos();

    if (this.parent && this.parent.getWorldPos) {
      parentPos = this.parent.getWorldPos();
    }
  }

  this._moveData = {
    distX: -(myPos.x - (pos.x !== undefined ? pos.x : myPos.x)),
    distY: -(myPos.y - (pos.y !== undefined ? pos.y : myPos.y)),
    distZ: -(myPos.z - (pos.z !== undefined ? pos.z : myPos.z)),
    dirX: myPos.x > pos.x ? 1 : -1,
    dirY: myPos.y > pos.y ? 1 : -1,
    dirZ: myPos.z > pos.z ? 1 : -1,
    duration: duration || 500,
    oDuration: duration || 500,
    curveName: curveName || 'linear',
    done: false,
    stepValX: 0,
    stepValY: 0,
    stepValZ: 0,
    destX: parentPos ? pos.x - parentPos.x : pos.x,
    destY: parentPos ? pos.y - parentPos.y : pos.y,
    destZ: pos.z,
    callback: callback,
  };
  this._moveData.leftX = this._moveData.distX;
  this._moveData.leftY = this._moveData.distY;
  this._moveData.leftZ = this._moveData.distZ;

  return this;
};

/**
 * apply the move transition each update
 * You shouldn't call or change this method
 * @protected
 * @memberOf GameObject
 */
GameObject.prototype.applyMove = function () {
  if (this._moveData.done) return;

  var move = this._moveData;

  if (move.distX != 0) {
    move.stepValX = (Time.frameDelayScaled / move.oDuration) * move.distX;
    move.leftX -= move.stepValX;
    this.x += move.stepValX;
  }

  if (move.distY != 0) {
    move.stepValY = (Time.frameDelayScaled / move.oDuration) * move.distY;
    move.leftY -= move.stepValY * move.dirY; // * dirY because y is inverted
    this.y += move.stepValY;
  }

  if (move.distZ != 0) {
    move.stepValZ = (Time.frameDelayScaled / move.oDuration) * move.distZ;
    move.leftZ -= move.stepValZ * move.dirZ; // * dirZ because z is inverted
    this.z += move.stepValZ;
  }

  move.duration -= Time.frameDelayScaled;

  // check pos
  if (move.dirX < 0 && move.leftX < 0) {
    this.x += move.leftX;
  } else if (move.dirX > 0 && move.leftX > 0) {
    this.x -= move.leftX;
  }

  if (move.dirY < 0 && move.leftY < 0) {
    this.y += move.leftY;
  } else if (move.dirY > 0 && move.leftY > 0) {
    this.y -= move.leftY;
  }

  if (move.dirZ < 0 && move.leftZ < 0) {
    this.z += move.leftZ;
  } else if (move.dirZ > 0 && move.leftZ > 0) {
    this.z -= move.leftZ;
  }

  if (move.duration <= 0) {
    this._moveData.done = true;
    this.position.set(
      move.destX !== undefined ? move.destX : this.x,
      move.destY !== undefined ? move.destY : this.y,
    );
    this.z = move.destZ !== undefined ? move.destZ : this.z;

    this.trigger('moveEnd');

    if (move.callback) {
      move.callback.call(this, move.callback);
    }
  }
};

export default GameObject;
