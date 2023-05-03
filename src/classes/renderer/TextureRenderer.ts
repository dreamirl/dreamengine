import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
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

export default class TextureRenderer extends PIXI.Sprite implements RendererInterface {
  private _textureName?: string;
  public sprite?: PIXI.Sprite;
  constructor(params: {
    spriteName?: string;
    spriteUrl?: string;
    textureName?: string;
    texture?: PIXI.Texture<PIXI.Resource> | undefined;
  } & Partial<PIXI.Sprite> & Partial<RendererInterface>) {
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
            params.spriteName! || params.spriteUrl! || params.textureName!
          ],
    );
    this.instantiate(this, params);
    this._textureName =
      params.spriteName || params.spriteUrl || params.textureName;
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
