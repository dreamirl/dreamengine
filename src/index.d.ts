import * as PIXI from 'pixi.js';
import '../css/default.css';
import { GameAboutInfo } from './about';
import Camera from './classes/Camera';
import Component from './classes/Component';
import ShakeComponent from './classes/components/ShakeComponent';
import TimerComponent from './classes/components/TimerComponent';
import GameObject from './classes/GameObject';
import Gui from './classes/Gui';
import Render from './classes/Render';
import AnimatedTextureRenderer from './classes/renderer/AnimatedTextureRenderer';
import BitmapTextRenderer from './classes/renderer/BitmapTextRenderer';
import GraphicRenderer from './classes/renderer/GraphicRenderer';
import NineSliceRenderer from './classes/renderer/NineSliceRenderer';
import RectRenderer from './classes/renderer/RectRenderer';
import SpriteRenderer from './classes/renderer/SpriteRenderer';
import TextRenderer from './classes/renderer/TextRenderer';
import TextureRenderer from './classes/renderer/TextureRenderer';
import TilingRenderer from './classes/renderer/TilingRenderer';
import Scene from './classes/Scene';
import Vector2 from './classes/Vector2';
import { AudioParam } from './utils/Audio';
import { InitFunctionParam } from './utils/ImageManager';
import { SaveModel } from './utils/Save';
import Time from './utils/Time';

type InitParams = {
  onReady: () => void;
  onLoad?: () => void;
  inputs?: Record<
    string,
    {
      keycodes: string[];
      interval?: number;
      isLongPress?: boolean;
      stayOn?: boolean;
    }
  >;
  audios?: {
    masterVolume: number;
    channels: Record<string, number>;
    sounds: AudioParam[];
  };
  dictionary?: any;
  images?: {
    baseUrl: string;
    pools: InitFunctionParam;
  };
  achievements?: any;
  saveModel?: SaveModel;
  saveIgnoreVersion?: boolean;
  about?: Partial<GameAboutInfo>;
  ignoreNotifications?: boolean;
  ignoreNotification?: boolean;
  useNotifications?: boolean;
  notifications?: any;
  preventGamepad?: boolean;
  loader?: {
    url?: string;
    totalFrame?: number;
    interval?: number;
    animated?: boolean;
    scale?: number;
  };
};
declare const _default: {
  TextureRenderer: typeof TextureRenderer;
  SpriteRenderer: typeof SpriteRenderer;
  TilingRenderer: typeof TilingRenderer;
  TextRenderer: typeof TextRenderer;
  BitmapTextRenderer: typeof BitmapTextRenderer;
  RectRenderer: typeof RectRenderer;
  GraphicRenderer: typeof GraphicRenderer;
  NineSliceRenderer: typeof NineSliceRenderer;
  AnimatedTextureRenderer: typeof AnimatedTextureRenderer;
  config: {
    DEName: string;
    VERSION: string;
    _DEBUG: boolean;
    _DEBUG_LEVEL: number;
    ALLOW_ONBEFOREUNLOAD: boolean;
    DEFAULT_TEXT_RESOLUTION: number;
    DEFAULT_SORTABLE_CHILDREN: boolean;
    DEFAULT_POOL_NAME: string;
    notifications: {
      enable: boolean;
      gamepadEnable: boolean;
      gamepadAvalaible: string;
      gamepadChange: boolean;
      achievementUnlockDuration: number;
    };
    DEBUG: boolean;
    DEBUG_LEVEL: number;
  };
  about: import('./about').About;
  Events: import('./utils/Event').default<
    Record<string, any>,
    Record<string, any> & {
      debugModeChanged: number;
    }
  >;
  Time: typeof Time;
  Save: import('./utils/Save').Save;
  Audio: import('./utils/Audio').Audio;
  ImageManager: import('./utils/ImageManager').ImageManager;
  MainLoop: import('./MainLoop').MainLoop;
  Inputs: import('./utils/Inputs').Inputs;
  gamepad: import('./utils/gamepad').gamepads;
  Localization: import('./utils/Localization').Localization;
  Notifications: import('./utils/Notifications').Notifications;
  Achievements: import('./utils/Achievements').Achievements<
    import('./utils/Achievements').Achievement
  >;
  Render: typeof Render;
  Scene: typeof Scene;
  Gui: typeof Gui;
  Camera: typeof Camera;
  Vector2: typeof Vector2;
  Tween: {
    Tween: typeof import('./classes/Tween').Tween;
    ChainedTween: typeof import('./classes/Tween').ChainedTween;
    update: (deltaTime: number) => void;
    Easing: {
      noEase: (x: number) => number;
      inSine: (x: number) => number;
      outSine: (x: number) => number;
      inOutSine: (x: number) => number;
      inCirc: (x: number) => number;
      outCirc: (x: number) => number;
      inOutCirc: (x: number) => number;
      inQuad: (x: number) => number;
      outQuad: (x: number) => number;
      inOutQuad: (x: number) => number;
      inQuart: (x: number) => number;
      outQuart: (x: number) => number;
      inOutQuart: (x: number) => number;
      inCubic: (x: number) => number;
      outCubic: (x: number) => number;
      inOutCubic: (x: number) => number;
      inQuintic: (x: number) => number;
      outQuintic: (x: number) => number;
      inOutQuintic: (x: number) => number;
      inExpo: (x: number) => number;
      outExpo: (x: number) => number;
      inOutExpo: (x: number) => number;
      inBack: (x: number) => number;
      outBack: (x: number) => number;
      inOutBack: (x: number) => number;
      inElastic: (x: number) => number;
      outElastic: (x: number) => number;
      inOutElastic: (x: number) => number;
      inBounce: (x: number) => number;
      outBounce: (x: number) => number;
      inOutBounce: (x: number) => number;
    };
  };
  GameObject: typeof GameObject;
  Component: typeof Component;
  ShakeComponent: typeof ShakeComponent;
  TimerComponent: typeof TimerComponent;
  Platform: import('./utils/Platform').Platform;
  PIXI: typeof PIXI;
  CONFIG: {
    DEName: string;
    VERSION: string;
    _DEBUG: boolean;
    _DEBUG_LEVEL: number;
    ALLOW_ONBEFOREUNLOAD: boolean;
    DEFAULT_TEXT_RESOLUTION: number;
    DEFAULT_SORTABLE_CHILDREN: boolean;
    DEFAULT_POOL_NAME: string;
    notifications: {
      enable: boolean;
      gamepadEnable: boolean;
      gamepadAvalaible: string;
      gamepadChange: boolean;
      achievementUnlockDuration: number;
    };
    DEBUG: boolean;
    DEBUG_LEVEL: number;
  };
  VERSION: string;
  init: (params: InitParams) => void;
  customOnLoad: () => void;
  trigger: (eventName: string, ...params: any[]) => void;
  emit: (eventName: string, ...params: any[]) => void;
  on: (eventName: string, listener: (...args: any) => void) => void;
  removeListener: (eventName: string, listener: (...args: any) => void) => void;
  onLoad: () => void;
  unPause: () => void;
  pause: () => void;
  start: () => void;
  isPaused: () => boolean;
};
export default _default;
