import * as PIXI from 'PIXI';
import BaseRenderer from 'DE.BaseRenderer';
import Localization from 'DE.Localization';
import config from 'DE.config';

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

function BitmapTextRenderer(text, params) {
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

  this.fontName = params.fontName;
  delete params.fontName;
  if (!this.fontName) {
    throw new Error(
      'BitmapTextRender :: No fontName defined -- declaration canceled',
    );
  }

  if (!PIXI.BitmapFont.available.hasOwnProperty(this.fontName)) {
    throw new Error(
      'BitmapTextRender :: No fontName with the name "' + this.fontName + '" found',
    );
  }

  this.fontSize = params.fontSize;
  delete params.fontSize;
  if (!this.fontSize) {
    this.fontSize = PIXI.BitmapFont.available[this.fontName].size;
  }

  PIXI.BitmapText.call(this, text, {
    fontName: this.fontName,
    fontSize: this.fontSize,
    ..._params,
  });

  if (!_params.resolution) {
    _params.resolution = config.DEFAULT_TEXT_RESOLUTION;
  }

  BaseRenderer.instantiate(this, _params);

  this.maxWidth = _params.maxWidth;
  this.checkMaxWidth();

  this.maxHeight = _params.maxHeight;
  this.checkMaxHeight();
}

BitmapTextRenderer.prototype = Object.create(PIXI.BitmapText.prototype);
BitmapTextRenderer.prototype.constructor = BitmapTextRenderer;
BitmapTextRenderer.prototype.DEName = 'BitmapTextRenderer';

BaseRenderer.inherits(BitmapTextRenderer);

BitmapTextRenderer.prototype.checkMaxWidth = function () {
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
};

BitmapTextRenderer.prototype.checkMaxHeight = function () {
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
};

BitmapTextRenderer.prototype.getWidth = function () {
  const textLocalBounds = this.getLocalBounds();
  return textLocalBounds.width;
};

BitmapTextRenderer.prototype.getHeight = function () {
  const textLocalBounds = this.getLocalBounds();
  return textLocalBounds.height;
};

BitmapTextRenderer.prototype.getSize = function () {
  const textLocalBounds = this.getLocalBounds();
  return {
    width: textLocalBounds.width,
    height: textLocalBounds.height,
  };
};

export default BitmapTextRenderer;