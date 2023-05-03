import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor GraphicRenderer
 * @augments PIXI.Graphics
 * @class Generate a PIXI.Graphics
 * checkout PIXI.Graphics documentation, you can pass in the first "methods" arguments any function to call in an array format declaration
 * @example var customShape = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.GraphicRenderer( [ { "beginFill": "0x66CCFF" }, { "drawRect": [ 0, 0, 50, 50 ] }, { "endFill": [] } ] )
 * } );
 */
export default class GraphicRenderer extends PIXI.Graphics implements RendererInterface{
  constructor(methods?: any[], params?: Partial<Omit<GraphicRenderer, 'scale'>> & Partial<RendererInterface> & {
    scale?: number | Point2D;
    scaleX?: number;
    scaleY?: number;
  }) {
    super();
    if (methods) {
      for (let i = 0; i < methods.length; ++i) {
        for (const n in methods[i]) {
          if (methods[i][n] instanceof Array) {
            (this as any)[n].apply(this, methods[i][n]);
          } else {
            (this as any)[n].call(this, methods[i][n]);
          }
        }
      }
    }
    this.instantiate(this, params);
  }

  static DEName = 'GraphicRenderer';
}
