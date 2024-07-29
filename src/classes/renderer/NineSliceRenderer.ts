import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';

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

export default class NineSliceRenderer extends PIXI.NineSlicePlane implements RendererInterface, ContainerExtensions {
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
    this.instantiate(params);

    if (!params.x && !params.y && !params.preventCenter) {
      this.center();
    }
  }

  hueFilter?: ColorMatrixFilter | undefined;
  blackAndWhiteFilter?: ColorMatrixFilter | undefined;
  saturationFilter?: ColorMatrixFilter | undefined;
  brightnessFilter?: ColorMatrixFilter | undefined;
  contrastFilter?: ColorMatrixFilter | undefined;
  grayscaleFilter?: ColorMatrixFilter | undefined;
  sleep: boolean = false;
  preventCenter?: boolean | undefined;
  _originalTexture?: PIXI.Texture<PIXI.Resource> | undefined;
  setTint(value: number): void{setTint(this, value);}
  setHue(rotation: number, multiply: boolean): void{setHue(this, rotation, multiply);}
  setBlackAndWhite(multiply: boolean): void{setBlackAndWhite(this, multiply);}
  setSaturation(amount: number, multiply: boolean): void{setSaturation(this, amount, multiply);}
  setBrightness(b: number, multiply: boolean): void{setBrightness(this, b, multiply);}
  setContrast(amount: number, multiply: boolean): void{setContrast(this, amount, multiply);}
  setGreyscale(scale: number, multiply: boolean): void{setGreyscale(this, scale, multiply);}
  setSize(width: number, height: number, preventCenter: boolean): void{setSize(this, width, height, preventCenter);}
  setScale(x: number | { x: number; y: number }, y?: number): void{setScale(this, x, y);}
  center(): void{center(this);}
  instantiate(params: any): void{instantiate(this, params);}
  static DEName = 'NineSliceRenderer';
}
