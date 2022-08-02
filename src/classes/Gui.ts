import AdvancedContainer from './AdvancedContainer';
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
class Gui extends AdvancedContainer {
  constructor(name: string) {
    super();
  }

  public scene: Scene; // TODO la GUI doit avoir une scène séparée car on
  // en fait un container, les container n'ont pas à gérer des objets
  // attention cela dit car la scène s'auto ajoute a la MainLoop
  // a voir si c'est la GUi qui update sa scène ou pas...

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
}

export default Gui;
