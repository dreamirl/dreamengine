import * as PIXI      from 'PIXI';
import Scene          from 'DE.Scene';
import GameObject     from 'DE.GameObject';

/**
 * @author Grimka / http://dreamirl.com
 */

/**
 * @constructor Gui
 * @class a Gui is over a world. You push GameObjects inside this.
 * There is no Gui Size, just objects inside
 * For rendering convenience it inherit from Scene
 * a Gui can be added to a Render and should be on top of everything
 * @example Game.gui = new DE.Gui( "Test" );
 */
function Gui( name )
{
  Scene.call( this, name );
  this.zindex = 1000;
}

Gui.prototype = Object.create( Scene.prototype );
Gui.prototype.constructor = Gui;

/**
 * this update the lifecycle of the Gui, binded on rendering because if a Gui is "off" it doesn't need to be updated
 * @memberOf Camera
 * @protected
 */
Gui.prototype.renderUpdate = function()
{
  this.applyFade();
};

/**
 * check the documentation on GameObject for all fade features
 * @protected
 * @memberOf GameObject
 */
Gui.prototype.fade = GameObject.prototype.fade;
Gui.prototype.fadeTo = GameObject.prototype.fadeTo;
Gui.prototype.fadeOut = GameObject.prototype.fadeOut;
Gui.prototype.fadeIn = GameObject.prototype.fadeIn;
Gui.prototype.applyFade = GameObject.prototype.applyFade;

export default Gui;