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
export { default as TweenManager } from './classes/Tween';
export { default as sortGameObjects } from './utils/sortGameObjects';

import config from './config';
import main from './main';
export const init = main.init;
export const start = main.start;
export const VERSION = config.VERSION;
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

// export default main;
import * as PIXI from 'pixi.js';
import about, { GameAboutInfo } from './about';
import MainLoop from './MainLoop';

// Utils
import Achievements from './utils/Achievements';
import Audio, { AudioParam } from './utils/Audio';
import Events from './utils/Events';
import gamepad from './utils/gamepad';
import ImageManager, { InitFunctionParam } from './utils/ImageManager';
import Inputs from './utils/Inputs';
import Localization from './utils/Localization';
import Notifications from './utils/Notifications';
import Platform from './utils/Platform';
import Save, { SaveModel } from './utils/Save';
import Time from './utils/Time';

import Camera from './classes/Camera';
import Gui from './classes/Gui';
import Render from './classes/Render';
import Scene from './classes/Scene';
import Vector2 from './classes/Vector2';

// Engine custom renderers
import AnimatedTextureRenderer from './classes/renderer/AnimatedTextureRenderer';
import BitmapTextRenderer from './classes/renderer/BitmapTextRenderer';
import GraphicRenderer from './classes/renderer/GraphicRenderer';
import NineSliceRenderer from './classes/renderer/NineSliceRenderer';
import RectRenderer from './classes/renderer/RectRenderer';
import SpriteRenderer from './classes/renderer/SpriteRenderer';
import TextRenderer from './classes/renderer/TextRenderer';
import TextureRenderer from './classes/renderer/TextureRenderer';
import TilingRenderer from './classes/renderer/TilingRenderer';
import VideoRenderer from './classes/renderer/VideoRenderer';

// Custom classes
import Component from './classes/Component';
import ShakeComponent from './classes/components/ShakeComponent';
import TimerComponent from './classes/components/TimerComponent';
import GameObject from './classes/GameObject';
import TweenManager, { ChainedTween, Tween, tweens } from './classes/Tween';
const Easing = TweenManager.Easing;
const tweenUpdater = TweenManager.tweenUpdater;

export default {
  // Renderers
  TextureRenderer,
  SpriteRenderer,
  TilingRenderer,
  TextRenderer,
  BitmapTextRenderer,
  RectRenderer,
  GraphicRenderer,
  NineSliceRenderer,
  AnimatedTextureRenderer,
  VideoRenderer,

  // Utils
  config,
  about,
  Events,
  Time,
  Save,
  Audio,
  ImageManager,
  MainLoop,
  Inputs,
  gamepad,
  Localization,
  Notifications,
  Achievements,
  Render,
  Scene,
  Gui,
  Camera,
  Vector2,
  TweenManager,

  // GameObject
  GameObject,
  Component,
  ShakeComponent,
  TimerComponent,
  Platform,
  PIXI,

  CONFIG: config,
  VERSION: config.VERSION,

  init,
  trigger,
  emit,
  on,
  removeListener,
  unPause,
  pause,
  start,
  isPaused,
  main,
};

declare global {
  namespace DE {
    export {
      // Renderers
      TextureRenderer,
      SpriteRenderer,
      TilingRenderer,
      TextRenderer,
      BitmapTextRenderer,
      RectRenderer,
      GraphicRenderer,
      NineSliceRenderer,
      AnimatedTextureRenderer,
      VideoRenderer,

      // Utils
      about,
      Events,
      Time,
      Save,
      Audio,
      ImageManager,
      MainLoop,
      Inputs,
      gamepad,
      Localization,
      Notifications,
      Achievements,
      Render,
      Scene,
      Gui,
      Camera,
      Vector2,

      // GameObject
      GameObject,
      Component,
      ShakeComponent,
      TimerComponent,
      Platform,
      PIXI,
      init,
      trigger,
      emit,
      on,
      removeListener,
      unPause,
      pause,
      start,
      isPaused,
      AudioParam,
      InitFunctionParam,
      SaveModel,
      GameAboutInfo,
    };
  }

  namespace DE.TweenManager {
    export { Tween, ChainedTween, Easing, tweenUpdater, tweens };
  }
}
