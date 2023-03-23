import * as PIXI from 'pixi.js';
import BaseRenderer from './BaseRenderer';

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

export default class TextureRenderer extends PIXI.Sprite {
  private _textureName: string | undefined;
  public sprite: PIXI.Sprite | undefined;
  constructor(params: {
    spriteName: string;
    spriteUrl: string;
    textureName: string;
    texture: PIXI.Texture<PIXI.Resource> | undefined;
  }) {
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
    if (textureName !== undefined) {
      this.changeTexture(textureName);
    }
  }

  /**
   * @public
   * @memberOf TextureRenderer
   * @type {Int}
   */
  changeTexture(textureName: string) {
    if (!textureName) {
      throw new Error('TextureRenderer :: changeTexture -- need textureName');
    }

    this._textureName = textureName;
    this.texture = PIXI.utils.TextureCache[textureName];
  }
  static DEName = 'TextureRenderer';
}

BaseRenderer.inherits(TextureRenderer);
