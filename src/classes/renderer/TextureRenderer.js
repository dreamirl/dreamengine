import * as PIXI from 'PIXI';
import BaseRenderer from 'DE.BaseRenderer';

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

class TextureRenderer extends PIXI.Sprite {
  constructor(params) {
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
            params.spriteName || params.spriteUrl || params.textureName
          ],
    );
    this._textureName =
      params.spriteName || params.spriteUrl || params.textureName;
    BaseRenderer.instantiate(this, params);
  }

  get textureName() {
    return this._textureName;
  }
  set textureName(textureName) {
    this.changeTexture(textureName);
  }
}

BaseRenderer.inherits(TextureRenderer);
TextureRenderer.prototype.DEName = 'TextureRenderer';

/**
 * @public
 * @memberOf TextureRenderer
 * @type {Int}
 */
TextureRenderer.prototype.changeTexture = function (textureName) {
  if (!textureName) {
    throw new Error('TextureRenderer :: changeTexture -- need textureName');
  }

  this._textureName = textureName;
  this.texture = PIXI.utils.TextureCache[textureName];
};
export default TextureRenderer;
