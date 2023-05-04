import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextureRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite<br>
 * this is like SpriteRenderer but without all "animated" stuff inside, so it will work with any texture loaded in PIXI.utils.TextureCache (included json sheets)<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var ship = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TextureRenderer( { "spriteUrl": "myImageFrameId" } )
 * } );
 */

export default class TextureRenderer extends PIXI.Sprite implements RendererInterface, ContainerExtensions {
  private _textureName?: string;
  public sprite?: PIXI.Sprite;
  constructor(params: {
    scale?: number | Point2D;
    scaleX?: number;
    scaleY?: number;
    spriteName?: string;
    spriteUrl?: string;
    textureName?: string;
    texture?: PIXI.Texture<PIXI.Resource> | undefined;
  } & Partial<Omit<PIXI.Sprite, 'scale'>> & Partial<RendererInterface>) {
    if (
      !params.spriteName &&
      !params.spriteUrl &&
      !params.textureName &&
      !params.texture
    ) {
      console.error(
        'A TextureRenderer need a spriteName, a spriteUrl argument or a texture',
      );
      return;
    }

    super(
      params.texture
        ? params.texture
        : PIXI.utils.TextureCache[
            params.spriteName! || params.spriteUrl! || params.textureName!
          ],
    );
    this.instantiate(params);
    this._textureName =
      params.spriteName || params.spriteUrl || params.textureName;
  }

  get textureName() {
    return this._textureName;
  }
  set textureName(textureName) {
    if (textureName !== undefined) {
      this.changeTexture(textureName);
    }
  }

  /**
   * @public
   * @memberOf TextureRenderer
   * @type {Int}
   */
  changeTexture(textureName: string) {
    if (!textureName) {
      throw new Error('TextureRenderer :: changeTexture -- need textureName');
    }

    this._textureName = textureName;
    this.texture = PIXI.utils.TextureCache[textureName];
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

  static DEName = 'TextureRenderer';
}
