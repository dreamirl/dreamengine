import '../css/default.css';

import * as PIXI from 'pixi.js';
import about, { GameAboutInfo } from './about';
import config from './config';
import MainLoop from './MainLoop';

// Utils
import Events from './utils/Events';
import Time from './utils/Time';
import Achievements from './utils/Achievements';
import Audio, { AudioParam } from './utils/Audio';
import gamepad from './utils/gamepad';
import ImageManager, { InitFunctionParam } from './utils/ImageManager';
import Inputs from './utils/Inputs';
import Localization from './utils/Localization';
import Notifications from './utils/Notifications';
import Platform from './utils/Platform';
import Save, { SaveModel } from './utils/Save';

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

// Custom classes
import Component from './classes/Component';
import ShakeComponent from './classes/components/ShakeComponent';
import TimerComponent from './classes/components/TimerComponent';
import GameObject from './classes/GameObject';
import Tween from './classes/Tween';

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
  dictionary?: any; // TODO Need le typage de Localization
  images?: { baseUrl: string; pools: InitFunctionParam };
  achievements?: any; // TODO Need le typage d'achievements
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

let ___params: InitParams | undefined = {
  onReady: () => {
    return;
  },
};
let paused = false;
const isPaused = () => paused;

const start = () => {
  // Make all audios instance and launch preload if required
  if (___params) {
    Audio.initialize(___params.audios);
    ___params = undefined;
  }

  const _defaultPoolName = config.DEFAULT_POOL_NAME;

  window.addEventListener('unhandledrejection', function (event) {
    // the event object has two special properties:
    console.error(event.promise); // [object Promise] - the promise that generated the error
    console.error(event.reason); // Error: Whoops! - the unhandled error object
  });

  MainLoop.launched = true;
  MainLoop.loop();

  Platform.beforeStartingEngine()
    .catch((e: Error) => console.error(e))
    .then(() => {
      // hack to leave the promise context swallowing throws
      setTimeout(() => {
        if (!Platform.preventEngineLoader) {
          MainLoop.createLoader();
          MainLoop.displayLoader = true;
          Events.once(
            'ImageManager-pool-' + _defaultPoolName + '-loaded',
            () => {
              setTimeout(() => onLoad(), 500);
            },
          );
          ImageManager.loadPool(_defaultPoolName);
        } else {
          onLoad();
        }
      });
    });
  emit('change-debug', config.DEBUG, config.DEBUG_LEVEL);
};

/**
 * Pause the engine.
 */
const pause = () => {
  paused = true;
  MainLoop.launched = false;
  Inputs.isListening = false;
};

/**
 * Unpause the engine.
 */
const unPause = () => {
  paused = false;
  Inputs.isListening = true;
  MainLoop.launched = true;
  Time.lastCalcul = Date.now();
  Time.currentTime = Date.now();
  MainLoop.loop();
};

const onLoad = () => {
  customOnLoad();
  MainLoop.displayLoader = false;
};

// quick event access
const on = (eventName: string, listener: (...args: any) => void) => {
  Events.on(eventName, listener);
};
const emit = (eventName: string, ...params: Array<any>) => {
  Events.emit(eventName, ...params);
};
const trigger = (eventName: string, ...params: Array<any>) => {
  Events.emit(eventName, ...params);
};

let customOnLoad = () => {
  console.log('You have to give a onLoad callback to the DE.init options');
};

/*
 * Init engine with custom inputs, images data, audio data, locales
 * launch the first loader and some utils then call start on loaded
 * call this method when all your stuff is ready
 */
const init = (params: InitParams) => {
  if (params == undefined) {
    throw 'Cannot init DreamEngine without the options, take a sample for easy start';
  }
  // extendPIXI(DE);

  // Set about data
  if (params.about) {
    about.set(params.about);
  }

  // Init the save with your custom scheme
  Save.init(params.saveModel, params.saveIgnoreVersion);

  // Init localization with dictionary
  Localization.init(params.dictionary || {});

  // init SystemDetection (if you develop special features for a special OS release)
  // TODO DE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );

  // set achievements with your custom list
  Achievements.init(params.achievements || []);

  Time.onTimeStop = () => {
    emit('window-lost-focus');
  };
  Time.onTimeResume = () => {
    emit('window-focus');
  };

  if (
    !params.ignoreNotifications &&
    params.useNotifications !== false &&
    !params.ignoreNotification
  ) {
    Notifications.init(params.notifications || {});
  } else {
    config.notifications.enable = false;
  }

  // init input listener with your custom list
  Inputs.init(params.inputs || {});

  if (!params.preventGamepad) {
    gamepad.init();
  }

  if (!params.onLoad) {
    console.error(
      'No onLoad given on init, nothing will happen after images load',
    );
  }
  if (params.onLoad) customOnLoad = params.onLoad;

  emit('change-debug', config.DEBUG, config.DEBUG_LEVEL);

  if (!Platform.preventEngineLoader) {
    if (params.images) {
      ImageManager.init(params.images.baseUrl, params.images.pools);

      // load the loader sprite image
      params.loader = params.loader || {};
      const loader = {
        0: 'loader',
        1: params.loader.url || 'loader.png',
        2: {
          totalFrame: params.loader.totalFrame || 16,
          interval: params.loader.interval || 45,
          animated:
            params.loader.animated !== undefined
              ? params.loader.animated
              : true,
          scale: params.loader.scale || 1,
        },
      };
      Events.once('ImageManager-loader-loaded', () => {
        MainLoop.updateLoaderImage(loader);
      });
      ImageManager.load(loader);
    }
  }

  ___params = params;

  params.onReady();

  emit('change-debug', config.DEBUG, config.DEBUG_LEVEL);
};

export { Audio, ImageManager, MainLoop };

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

  // Utils
  config,
  about,
  Events,
  Time,
  Save,
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
  Tween,

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
  customOnLoad: () => customOnLoad(),
  trigger,
  emit,
  on,
  onLoad,
  unPause,
  pause,
  start,
  isPaused,
};
