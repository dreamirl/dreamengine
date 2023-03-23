import * as PIXI from 'pixi.js';
import BaseRenderer, { BaseRendererParams } from './BaseRenderer';

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
export default class GraphicRenderer extends PIXI.Graphics {
  constructor(methods: any[], params: BaseRendererParams) {
    super();
    PIXI.Graphics.call(this);
    if (methods) {
      for (var i = 0; i < methods.length; ++i) {
        for (var n in methods[i]) {
          if (methods[i][n] instanceof Array) {
            (this as any)[n].apply(this, methods[i][n]);
          } else {
            (this as any)[n].call(this, methods[i][n]);
          }
        }
      }
    }

    BaseRenderer.instantiate(this, params);
  }

  static DEName = 'GraphicRenderer';
}
