import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import { ILineStyleOptions } from 'pixi.js';
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
 * @constructor RectRenderer
 * @augments PIXI.Graphics
 * @class draw a simple rectangle
 * checkout Renderer for standard parameters
 * @example var rectangle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.RectRenderer( 50, 70, "red", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false } )
 * } );
 */

export default class RectRenderer
  extends PIXI.Graphics
  implements RendererInterface, ContainerExtensions
{
  private _initial: {
    width?: number;
    height?: number;
    fill?: boolean;
    color?: number;
    lineStyle?: [options?: ILineStyleOptions];
  };

  constructor(
    width: number,
    height: number,
    color: number,
    params: Partial<Omit<PIXI.Graphics, 'scale'>> & {
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
      color?: number;
      fill?: boolean;
      lineStyle?: [options?: ILineStyleOptions];
    } & Partial<RendererInterface> = {},
  ) {
    super();
    const _params = params;

    _params.width = width;
    _params.height = height;
    _params.color = color;

    /**
     * save last parameters
     * @memberOf RectRenderer
     * @private
     */
    this._initial = {
      width: _params.width,
      height: _params.height,
      fill: _params.fill,
      color: _params.color,
      lineStyle: _params.lineStyle,
    };

    this.updateRender(_params);
    delete _params.lineStyle;
    delete _params.fill;

    this.instantiate(params);
  }

  updateRender(params: {
    width?: number;
    height?: number;
    color?: number;
    fill?: boolean;
    lineStyle?: [options?: ILineStyleOptions];
  }) {
    this.clear();

    if (params && (params.lineStyle || this._initial.lineStyle)) {
      if (params.lineStyle !== undefined) {
        this.lineStyle.apply(this, params.lineStyle); // 4, 0xFF3300, 1);
      } else if (this._initial.lineStyle !== undefined) {
        this.lineStyle.apply(this, this._initial.lineStyle); // 4, 0xFF3300, 1);
      }
    }

    if (
      !params ||
      params.fill !== false ||
      (params.fill === undefined && this._initial.fill !== false)
    ) {
      this.beginFill(params.color || this._initial.color || 0xff3300);
    }

    this.drawRect(
      0,
      0,
      params.width || this._initial.width || 0,
      params.height || this._initial.height || 0,
    );

    this.endFill();

    this._initial = {
      width: params.width || this._initial.width,
      height: params.height || this._initial.height,
      fill: params.fill || this._initial.fill,
      color: params.color || this._initial.color,
      lineStyle: params.lineStyle || this._initial.lineStyle,
    };

    return this;
  }

  hueFilter?: ColorMatrixFilter | undefined;
  blackAndWhiteFilter?: ColorMatrixFilter | undefined;
  saturationFilter?: ColorMatrixFilter | undefined;
  brightnessFilter?: ColorMatrixFilter | undefined;
  contrastFilter?: ColorMatrixFilter | undefined;
  grayscaleFilter?: ColorMatrixFilter | undefined;
  sleep = false;
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

  static DEName = 'RectRenderer';
}
