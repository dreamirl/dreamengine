import * as PIXI      from 'PIXI';
import Scene          from 'DE.Scene';

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
}

Gui.prototype = Object.create( Scene.prototype );
Gui.prototype.constructor = Gui;

export default Gui;