import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor NineSliceRenderer
 * @augments PIXI.NineSlicePlane
 * @class draw a scalable frame to the specified dimension by using a repeat pattern with the provided texture<br>
 * see https://pixijs.download/dev/docs/PIXI.NineSlicePlane.html
 * @example var frame = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.NineSliceRenderer( { "textureName": "myImageFrameId", width: 500, height: 300 }, left, top, right, bottom )
 * } );
 */

export default class NineSliceRenderer extends PIXI.NineSlicePlane implements RendererInterface {
  constructor(
    params: {
      texture?: PIXI.Texture<PIXI.Resource>;
      spriteName?: string;
      spriteUrl?: string;
      textureName?: string;
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
      x?: number;
      y?: number;
      preventCenter?: boolean;
    } & Partial<Omit<PIXI.NineSlicePlane, 'scale'>> & Partial<RendererInterface>,
    left?: number,
    top?: number,
    right?: number,
    bottom?: number,
  ) {
    if (
      !params.spriteName &&
      !params.spriteUrl &&
      !params.textureName &&
      !params.texture
    ) {
      console.error(
        'A NineSliceRenderer need a spriteName, a spriteUrl argument or a texture',
      );
      return;
    }
    super(
      params.texture
        ? params.texture
        : PIXI.utils.TextureCache[
            params.spriteName! || params.spriteUrl! || params.textureName!
          ],
      left,
      top,
      right,
      bottom,
    );
    this.instantiate(this, params);

    if (!params.x && !params.y && !params.preventCenter) {
      this.center();
    }
  }
  static DEName = 'NineSliceRenderer';
}
