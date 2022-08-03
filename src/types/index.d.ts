import AnimatedTextureRenderer from './renderer/AnimatedTextureRenderer';
import BitmapTextRenderer from './renderer/BitmapTextRenderer';
import GraphicRenderer from './renderer/GraphicRenderer';
import NineSliceRenderer from './renderer/NineSliceRenderer';
import RectRenderer from './renderer/RectRenderer';
import SpriteRenderer from './renderer/SpriteRenderer';
import TextRenderer from './renderer/TextRenderer';
import TextureRenderer from './renderer/TextureRenderer';
import TilingRenderer from './renderer/TilingRenderer';

export {};
declare global {
  interface Window {
    leavePage: boolean;
  }

  type ResizeMode =
    | 'stretch-ratio'
    | 'ratio-stretch'
    | 'stretch'
    | 'full'
    | 'ratio'
    | '';
  type Point2D = { x: number; y: number };

  type DERenderers =
    | AnimatedTextureRenderer
    | BitmapTextRenderer
    | GraphicRenderer
    | NineSliceRenderer
    | RectRenderer
    | SpriteRenderer
    | TextRenderer
    | TextureRenderer
    | TilingRenderer;
}
