import AnimatedTextureRenderer from '../classes/renderer/AnimatedTextureRenderer';
import BitmapTextRenderer from '../classes/renderer/BitmapTextRenderer';
import GraphicRenderer from '../classes/renderer/GraphicRenderer';
import NineSliceRenderer from '../classes/renderer/NineSliceRenderer';
import RectRenderer from '../classes/renderer/RectRenderer';
import SpriteRenderer from '../classes/renderer/SpriteRenderer';
import TextRenderer from '../classes/renderer/TextRenderer';
import TextureRenderer from '../classes/renderer/TextureRenderer';
import TilingRenderer from '../classes/renderer/TilingRenderer';

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

  type Automatism = {
    methodName: string;
    interval: number;
    persistent: boolean;
    timeSinceLastCall: number;
    value1: any;
    value2: any;
    args: any;
  };

  type TimerComponentData = {
    callback: () => void;
    interval: number;
    persistent?: boolean;
    id?: number;
    timeSinceLastCall: number;
  };

  type Nullable<T> = T | null;
}
