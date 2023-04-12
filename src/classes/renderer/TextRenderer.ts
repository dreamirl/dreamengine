import * as PIXI from 'pixi.js';
import config from '../../config';
import Localization from '../../utils/Localization';
import '../renderer/ContainerExtensions';

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

export default class TextRenderer extends PIXI.Text {
  maxHeight?: number;
  maxWidth?: number;
  localizationKey?: string;

  constructor(
    text: string,
    params: {
      maxHeight?: number;
      maxWidth?: number;
      resolution?: number;
      localizationKey?: string;
      textStyle?: PIXI.TextStyle;
    },
  ) {
    super(text);
    this.instantiate(this, params);
    // force string conversion to avoid pure numbers
    text =
      text !== null && text !== undefined && text.toString
        ? text.toString()
        : text;
    var _params = params || {};

    if (_params.localizationKey) {
      this.localizationKey = _params.localizationKey;
      this.text = Localization.get(this.localizationKey);
      delete _params.localizationKey;
    } else if (Localization.get(text) !== text) {
      this.localizationKey = text;
      this.text = Localization.get(this.localizationKey);
    }
    delete _params.textStyle;

    if (!_params.resolution) {
      _params.resolution = config.DEFAULT_TEXT_RESOLUTION;
    }

    this.maxWidth = _params.maxWidth;
    this.checkMaxWidth();

    this.maxHeight = _params.maxHeight;
    this.checkMaxHeight();
  }

  checkMaxWidth() {
    if (this.maxWidth) {
      let textMetrics = PIXI.TextMetrics.measureText(
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
      let textMetrics = PIXI.TextMetrics.measureText(
        this.text,
        new PIXI.TextStyle(this.style),
      );

      if (textMetrics.height > this.maxHeight) {
        this.setScale(this.maxHeight / textMetrics.height);
      }
    }
  }

  static DEName = 'TextRenderer';
}
