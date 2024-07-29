import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TilingRenderer
 * @augments PIXI.TilingSprite
 * @class draw a sprite repeated as a Tile<br>
 * it works with any texture loaded in PIXI.utils.TextureCache (included json sheets)<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var background = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TilingRenderer( { "backgroundImage": "mountains_repeat", width: 2000 } )
 * } );
 */
export default class TilingRenderer extends PIXI.TilingSprite implements RendererInterface, ContainerExtensions {
  constructor(params: {
    scale?: number | Point2D;
    scaleX?: number;
    scaleY?: number;
    backgroundImage?: string;
    width?: number;
    height?: number;
    spriteName?: string;
    spriteUrl?: string;
    textureName?: string;
  } & Partial<Omit<PIXI.TilingSprite, 'scale'>> & Partial<RendererInterface>) {
    if (
      !params.backgroundImage &&
      !params.spriteName &&
      !params.spriteUrl &&
      !params.textureName
    ) {
      console.error(
        'A TilingRenderer need a spriteName or a spriteUrl argument',
      );
      return;
    }
    super(
      PIXI.utils.TextureCache[
        params.backgroundImage ||
          params.spriteName ||
          params.spriteUrl ||
          params.textureName ||
          ''
      ],
      params.width,
      params.height,
    );
    this.instantiate(params);
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

  static DEName = 'TilingRenderer';
}
