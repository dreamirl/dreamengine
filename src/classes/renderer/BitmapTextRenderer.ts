import * as PIXI from 'pixi.js';
import config from '../../config';
import Localization from '../../utils/Localization';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor BitmapTextRenderer
 * @augments PIXI.BitmapText
 * @class draw a bitmap text<br>
 * this just instantiate a PIXI.BitmapText, but it give to "BaseRenderer" the rest of params, so you can easily set position, scaling, rotation, etc, directly on declaration<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var helloWorld = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.BitmapTextRenderer( "Hello World", {
 *     rotation: Math.PI, x: 100, interactive: true,
 *     textStyle: { fontName: "cordova", fontSize: 12, tint: 0xffffff }
 *   } )
 * } );

 * if you use "Localizations" you should give "localizationKey" instead of the text value
 * by doing this, the text will be automatically updated when the lang change if the Renderer exist in a scene (active or not)
 * you can use the locales with one . to go deeper (but only one)
 * => intro.title will do Localization.get( "intro" ).title
 */

export default class BitmapTextRenderer extends PIXI.BitmapText implements RendererInterface, ContainerExtensions {
  localizationKey: string | undefined;
  maxHeight: number;

  constructor(
    text: string,
    params: {
      maxHeight?: number;
      maxWidth?: number;
      fontName?: string;
      fontSize?: number;
      localizationKey?: string;
      resolution?: number;
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
    } & Partial<Omit<PIXI.BitmapText, 'scale'>> & Partial<RendererInterface> = {},
  ) {
    super(text);

    const _params = params;
    if (!_params.resolution) {
      _params.resolution = config.DEFAULT_TEXT_RESOLUTION;
    }
    this.instantiate(_params);
    // force string conversion to avoid pure numbers
    text =
      text !== null && text !== undefined && text.toString
        ? text.toString()
        : text;

    if (_params.localizationKey) {
      this.localizationKey = _params.localizationKey;
      text = Localization.get(this.localizationKey);
      delete _params.localizationKey;
    } else if (Localization.get(text) !== text) {
      this.localizationKey = text;
      text = Localization.get(this.localizationKey);
    }

    if (params.fontName) this.fontName = params.fontName;
    if (!this.fontName) {
      throw new Error(
        'BitmapTextRender :: No fontName defined -- declaration canceled',
      );
    }

    if (!PIXI.BitmapFont.available.hasOwnProperty(this.fontName)) {
      throw new Error(
        'BitmapTextRender :: No fontName with the name "' +
          this.fontName +
          '" found',
      );
    }

    this.fontSize =
      params.fontSize ?? PIXI.BitmapFont.available[this.fontName].size;

    this.maxWidth = _params.maxWidth ? _params.maxWidth : 0;
    this.checkMaxWidth();

    this.maxHeight = _params.maxHeight ? _params.maxHeight : 0;
    this.checkMaxHeight();
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

  checkMaxWidth() {
    if (this.maxWidth) {
      const textLocalBounds = this.getLocalBounds();
      const scaleOneTextMetrics = {
        width: textLocalBounds.width / this.scale.x,
        height: textLocalBounds.height / this.scale.y,
      };

      if (scaleOneTextMetrics.width > this.maxWidth) {
        this.setScale(this.maxWidth / scaleOneTextMetrics.width);
      } else {
        this.setScale(1);
      }
    }
  }

  checkMaxHeight() {
    if (this.maxHeight) {
      const textLocalBounds = this.getLocalBounds();
      const scaleOneTextMetrics = {
        width: textLocalBounds.width / this.scale.x,
        height: textLocalBounds.height / this.scale.y,
      };

      if (scaleOneTextMetrics.height > this.maxHeight) {
        this.setScale(this.maxHeight / scaleOneTextMetrics.height);
      } else {
        this.setScale(1);
      }
    }
  }

  getWidth() {
    const textLocalBounds = this.getLocalBounds();
    return textLocalBounds.width;
  }

  getHeight() {
    const textLocalBounds = this.getLocalBounds();
    return textLocalBounds.height;
  }

  getSize() {
    const textLocalBounds = this.getLocalBounds();
    return {
      width: textLocalBounds.width,
      height: textLocalBounds.height,
    };
  }
  static DEName = 'BitmapTextRenderer';
}
