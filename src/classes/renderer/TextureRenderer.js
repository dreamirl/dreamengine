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

function TextureRenderer(params) {
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

  PIXI.Sprite.call(
    this,
    params.texture
      ? params.texture
      : PIXI.utils.TextureCache[
          params.spriteName || params.spriteUrl || params.textureName
        ],
  );
  BaseRenderer.instantiate(this, params);
}

TextureRenderer.prototype = Object.create(PIXI.Sprite.prototype);
TextureRenderer.prototype.constructor = TextureRenderer;

BaseRenderer.inherits(TextureRenderer);

TextureRenderer.prototype.DEName = 'TextureRenderer';

export default TextureRenderer;
