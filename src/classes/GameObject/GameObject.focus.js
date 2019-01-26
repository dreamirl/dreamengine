import GameObject from 'DE.GameObject';
import Time from 'DE.Time';

/**
 * give a target to this gameObject, then it will focus it until you changed or removed it
 * you can lock independent axes, and set offsets
 * @public
 * @memberOf GameObject
 * @param {GameObject} gameObject is the target to focus on
 * @param {Object} [params] optional parameters, set offsets or lock
 * @example // create a fx for your ship, decal a little on left, and lock y
 * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
 */
GameObject.prototype.focus = function( gameObject, params )
{
  params = params || {};
  this.target = gameObject;
  this._focusOptions = Object.assign( {
    x: true,
    y: true,
    rotation: false,
  }, params.options );

  // focus default x/y
  this._focusOptions.x = this._focusOptions.x !== false ? true : false;
  this._focusOptions.y = this._focusOptions.y !== false ? true : false;

  this._focusOffsets = Object.assign( { x: 0, y: 0 }, params.offsets || params.offset );
  
  return this;
};

/**
 * apply focus on target if there is one
 * You shouldn't call or change this method
 * @protected
 * @memberOf Camera
 */
GameObject.prototype.applyFocus = function()
{
  if ( !this.target ) {
    return;
  }
  
  var pos = this.target;
  
  if ( this.target.getGlobalPosition ) {
    pos = this.target.getGlobalPosition();
  }
  
  var parentPos = this.parent.getGlobalPosition();
  
  if ( this._focusOptions.x ) {
    this.x = pos.x + ( this._focusOffsets.x || 0 ) - parentPos.x;
  }
  if ( this._focusOptions.y ) {
    this.y = pos.y + ( this._focusOffsets.y || 0 ) - parentPos.y;
  }
  if ( this._focusOptions.rotation ) {
    this.rotation = this.target.rotation;
  }
};

export default GameObject;