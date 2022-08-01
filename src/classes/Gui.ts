import GameObject from './GameObject';
import Scene from './Scene';

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
class Gui extends Scene {
  constructor(name: string) {
    super(name);
  }

  /**
   * object used to apply fade transition
   * @protected
   * @memberOf GameObject
   * @type {Object}
   */
  private _fadeData = {
    from: 1,
    to: 0,
    duration: 1000,
    done: true,
  };

  /**
   * zindex used to place the gui over everything
   * @public
   * @memberof GameObject
   * @type {Number}
   */
  public zindex = 1000;

  // support trigger  -nop
  // Gui.prototype.trigger = Gui.prototype.emit;

  /**
   * easy way to shutdown gui rendering/updating
   * @public
   * @memberOf Gui
   * @type {Boolean}
   */
  public get enable() {
    return this.renderable && this.visible;
  }
  public set enable(bool) {
    this.visible = bool;
    this.renderable = bool;
  }

  /**
   * this update the lifecycle of the Gui, binded on rendering because if a Gui is "off" it doesn't need to be updated
   * @memberOf Gui
   * @protected
   */
  renderUpdate() {
    this.applyFade();
  }

  /**
   * check the documentation on GameObject for all fade features
   * @protected
   * @memberOf GameObject
   */
  fade = GameObject.prototype.fade;
  fadeTo = GameObject.prototype.fadeTo;
  fadeOut = GameObject.prototype.fadeOut;
  fadeIn = GameObject.prototype.fadeIn;
  applyFade = GameObject.prototype.applyFade;
}

export default Gui;
