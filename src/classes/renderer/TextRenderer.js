import * as PIXI from 'pixi.js';
import config from './../../config';
import Localization from './../../utils/Localization';
import BaseRenderer from './BaseRenderer';

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

function TextRenderer(text, params) {
  // force string conversion to avoid pure numbers
  text =
    text !== null && text !== undefined && text.toString
      ? text.toString()
      : text;
  var _params = params || {};

  if (_params.localizationKey) {
    this.localizationKey = _params.localizationKey;
    text = Localization.get(this.localizationKey);
    delete _params.localizationKey;
  } else if (Localization.get(text) !== text) {
    this.localizationKey = text;
    text = Localization.get(this.localizationKey);
  }

  PIXI.Text.call(this, text, new PIXI.TextStyle(_params.textStyle));
  delete _params.textStyle;

  if (!_params.resolution) {
    _params.resolution = config.DEFAULT_TEXT_RESOLUTION;
  }

  BaseRenderer.instantiate(this, _params);

  this.maxWidth = _params.maxWidth;
  this.checkMaxWidth();

  this.maxHeight = _params.maxHeight;
  this.checkMaxHeight();
}

TextRenderer.prototype = Object.create(PIXI.Text.prototype);
TextRenderer.prototype.constructor = TextRenderer;

BaseRenderer.inherits(TextRenderer);

TextRenderer.prototype.DEName = 'TextRenderer';

TextRenderer.prototype.checkMaxWidth = function () {
  if (this.maxWidth) {
    let textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);

    if (textMetrics.width > this.maxWidth) {
      this.setScale(this.maxWidth / textMetrics.width);
    } else {
      this.setScale(1);
    }
  }
};

TextRenderer.prototype.getWidth = function () {
  const textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);
  return textMetrics.width;
};

TextRenderer.prototype.getHeight = function () {
  const textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);
  return textMetrics.height;
};

TextRenderer.prototype.getSize = function () {
  const textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);
  return textMetrics;
};

TextRenderer.prototype.checkMaxHeight = function () {
  if (this.maxHeight) {
    let textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);

    if (textMetrics.height > this.maxHeight) {
      this.setScale(this.maxHeight / textMetrics.height);
    }
  }
};

export default TextRenderer;
