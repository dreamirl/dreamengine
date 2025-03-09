import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import {
  ContainerExtensions,
  center,
  instantiate,
  setBlackAndWhite,
  setBrightness,
  setContrast,
  setGreyscale,
  setHue,
  setSaturation,
  setScale,
  setSize,
  setTint,
} from '../renderer/ContainerExtensions';
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
export default class GraphicRenderer
  extends PIXI.Graphics
  implements RendererInterface, ContainerExtensions
{
  private _texture: undefined;

  get texture() {
    console.error(
      'Texture is not supposed to be get or set on graphic renderer',
    );
    return this._texture;
  }

  set texture(value: PIXI.Texture<PIXI.Resource> | undefined) {
    throw new Error('Texture is not settable on graphic renderer');
  }

  constructor(
    methods?: any[],
    params?: Partial<Omit<GraphicRenderer, 'scale'>> &
      Partial<RendererInterface> & {
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
      },
  ) {
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
  setTint(value: number): void {
    setTint(this, value);
  }
  setHue(rotation: number, multiply: boolean): void {
    setHue(this, rotation, multiply);
  }
  setBlackAndWhite(multiply: boolean): void {
    setBlackAndWhite(this, multiply);
  }
  setSaturation(amount: number, multiply: boolean): void {
    setSaturation(this, amount, multiply);
  }
  setBrightness(b: number, multiply: boolean): void {
    setBrightness(this, b, multiply);
  }
  setContrast(amount: number, multiply: boolean): void {
    setContrast(this, amount, multiply);
  }
  setGreyscale(scale: number, multiply: boolean): void {
    setGreyscale(this, scale, multiply);
  }
  setSize(width: number, height: number, preventCenter: boolean): void {
    setSize(this, width, height, preventCenter);
  }
  setScale(x: number | { x: number; y: number }, y?: number): void {
    setScale(this, x, y);
  }
  center(): void {
    center(this);
  }
  instantiate(params: any): void {
    instantiate(this, params);
  }

  static DEName = 'GraphicRenderer';
}
