import * as PIXI    from 'PIXI';
import BaseRenderer from 'DE.BaseRenderer';
import Localization from 'DE.Localization';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextureRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite<br>
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

function TextRenderer(text, params)
{
  // force string conversion to avoid pure numbers
  text = text !== null && text !== undefined && text.toString ? text.toString() : text;
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

  BaseRenderer.instantiate(this, _params);

  this.maxWidth = _params.maxWidth;
  this.checkMaxWidth();
}

TextRenderer.prototype = Object.create(PIXI.Text.prototype);
TextRenderer.prototype.constructor = TextRenderer;

BaseRenderer.inherits(TextRenderer);

TextRenderer.prototype.DEName = "TextRenderer";

TextRenderer.prototype.checkMaxWidth = function() {
  if (this.maxWidth) {
    let textMetrics = new PIXI.TextMetrics.measureText(this.text, this.style);

    if (textMetrics.width > this.maxWidth) {
      this.setScale(this.maxWidth / textMetrics.width);
    }
  }
}

export default TextRenderer;
