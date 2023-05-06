import GameObject from './GameObject';
/**
 * @author Grimka / http://dreamirl.com
 */
/**
 * @constructor Gui
 * @class DEPRECATED: a Gui used to be a Scene, but now it's just a GameObject.
 * You may put it over a world, and push GameObjects inside it.
 * A Gui can be added to a Render and should be on top of everything.
 * @example Game.gui = new DE.Gui( "Test" );
 * @deprecated
 */
declare class Gui extends GameObject {
    /**
     * easy way to shutdown gui rendering/updating
     * @public
     * @memberOf Gui
     * @type {Boolean}
     */
    get enable(): boolean;
    set enable(bool: boolean);
}
export default Gui;
