export * as PIXI from 'pixi.js';
export type { default as about, GameAboutInfo } from './about';
export { default as CONFIG } from './config';
export { default as MainLoop } from './MainLoop';

// Utils
export { default as Achievements } from './utils/Achievements';
export type { default as Audio, AudioParam } from './utils/Audio';
export { default as Events } from './utils/Events';
export { default as gamepad } from './utils/gamepad';
export type {
  default as ImageManager,
  InitFunctionParam,
} from './utils/ImageManager';
export { default as Inputs } from './utils/Inputs';
export { default as Localization } from './utils/Localization';
export { default as Notifications } from './utils/Notifications';
export { default as Platform } from './utils/Platform';
export type { default as Save, SaveModel } from './utils/Save';
export { default as Time } from './utils/Time';

export { default as Camera } from './classes/Camera';
export { default as Gui } from './classes/Gui';
export { default as Render } from './classes/Render';
export { default as Scene } from './classes/Scene';
export { default as Vector2 } from './classes/Vector2';

// Engine custom renderers
export { default as AnimatedTextureRenderer } from './classes/renderer/AnimatedTextureRenderer';
export { default as BitmapTextRenderer } from './classes/renderer/BitmapTextRenderer';
export { default as GraphicRenderer } from './classes/renderer/GraphicRenderer';
export { default as NineSliceRenderer } from './classes/renderer/NineSliceRenderer';
export { default as RectRenderer } from './classes/renderer/RectRenderer';
export { default as SpriteRenderer } from './classes/renderer/SpriteRenderer';
export { default as TextRenderer } from './classes/renderer/TextRenderer';
export { default as TextureRenderer } from './classes/renderer/TextureRenderer';
export { default as TilingRenderer } from './classes/renderer/TilingRenderer';
export { default as VideoRenderer } from './classes/renderer/VideoRenderer';

// Custom classes
export { default as Component } from './classes/Component';
export { default as ShakeComponent } from './classes/components/ShakeComponent';
export { default as TimerComponent } from './classes/components/TimerComponent';
export { default as GameObject } from './classes/GameObject';
export { default as Tween } from './classes/Tween';

import { default as CONFIG } from './config';
import main from './main';
export const init = main.init;
export const start = main.start;
// export const start = main.onLoad;
// export const customOnLoad = () => main.customOnLoad();
export const VERSION = CONFIG.VERSION;
// quick event access
export const on = (eventName: string, listener: (...args: any) => void) => {
  main.on(eventName, listener);
};
export const removeListener = (
  eventName: string,
  listener: (...args: any) => void,
) => {
  main.removeListener(eventName, listener);
};
export const emit = (eventName: string, ...params: Array<any>) => {
  main.emit(eventName, ...params);
};
export const trigger = (eventName: string, ...params: Array<any>) => {
  main.emit(eventName, ...params);
};
export const unPause = main.unPause;
export const pause = main.pause;
export const isPaused = main.isPaused;

export default main;
