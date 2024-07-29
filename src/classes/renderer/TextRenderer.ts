import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import config from '../../config';
import Localization from '../../utils/Localization';
import '../renderer/ContainerExtensions';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextRenderer
 * @augments PIXI.Text
 * @class draw text<br>
 * this just instantiate a PIXI.Text with a PIXI.TextStyle, but it give to "BaseRenderer" the rest of params, so you can easily set position, scaling, rotation, etc, directly on declaration<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var helloWorld = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TextRenderer( "Hello World", {
 *     rotation: Math.PI, x: 100, interactive: true,
 *     textStyle: { fontFamily: "cordova", fontSize: 12, fill: "white" }
 *   } )
 * } );

 * if you use "Localizations" you should give "localizationKey" instead of the text value
 * by doing this, the text will be automatically updated when the lang change if the Renderer exist in a scene (active or not)
 * you can use the locales with one . to go deeper (but only one)
 * => intro.title will do Localization.get( "intro" ).title
 */

export default class TextRenderer extends PIXI.Text implements RendererInterface, ContainerExtensions {
  maxHeight?: number;
  maxWidth?: number;
  localizationKey?: string;

  constructor(
    text: string,
    params: {
      anchor?: Point2D;
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
      maxHeight?: number;
      maxWidth?: number;
      resolution?: number;
      localizationKey?: string;
      textStyle?: Partial<PIXI.TextStyle>;
    } & Partial<Omit<PIXI.Text, 'scale' | 'anchor'>> & Partial<RendererInterface> = {},
  ) {
    super(text, new PIXI.TextStyle(params.textStyle));
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
      this.text = Localization.get(this.localizationKey);
      delete _params.localizationKey;
    } else if (Localization.get(text) !== text) {
      this.localizationKey = text;
      this.text = Localization.get(this.localizationKey);
    }
    delete _params.textStyle;

    this.maxWidth = _params.maxWidth;
    this.checkMaxWidth();

    this.maxHeight = _params.maxHeight;
    this.checkMaxHeight();
  }

  checkMaxWidth() {
    if (this.maxWidth) {
      const textMetrics = PIXI.TextMetrics.measureText(
        this.text,
        new PIXI.TextStyle(this.style),
      );

      if (textMetrics.width > this.maxWidth) {
        this.setScale(this.maxWidth / textMetrics.width);
      } else {
        this.setScale(1);
      }
    }
  }

  getWidth() {
    const textMetrics = PIXI.TextMetrics.measureText(
      this.text,
      new PIXI.TextStyle(this.style),
    );
    return textMetrics.width;
  }

  getHeight() {
    const textMetrics = PIXI.TextMetrics.measureText(
      this.text,
      new PIXI.TextStyle(this.style),
    );
    return textMetrics.height;
  }

  getSize() {
    const textMetrics = PIXI.TextMetrics.measureText(
      this.text,
      new PIXI.TextStyle(this.style),
    );
    return textMetrics;
  }

  checkMaxHeight() {
    if (this.maxHeight) {
      const textMetrics = PIXI.TextMetrics.measureText(
        this.text,
        new PIXI.TextStyle(this.style),
      );

      if (textMetrics.height > this.maxHeight) {
        this.setScale(this.maxHeight / textMetrics.height);
      }
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

  static DEName = 'TextRenderer';
}
