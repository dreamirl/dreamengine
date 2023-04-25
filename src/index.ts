import '../css/default.css';

import * as PIXI from 'pixi.js';
import about, {GameAboutInfo} from './about';
import config from './config';
import MainLoop from './MainLoop';

// Utils
import extendPIXI from './utils/extendPIXI';
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
import BaseRenderer from './classes/renderer/BaseRenderer';
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
  onReady: () => void,
  onLoad?: () => void,
  inputs?: Record<string, {keycodes: string[], interval?: number, isLongPress?: boolean, stayOn?: boolean}>,
  audios?: {
    masterVolume: number;
    channels: Record<string, number>;
    sounds: AudioParam[];
  },
  dictionary?: any, // TODO Need le typage de Localization
  images?: {baseUrl: string, pools: InitFunctionParam},
  achievements?: any, // TODO Need le typage d'achievements
  saveModel?: SaveModel,
  saveIgnoreVersion?: boolean,
  about?: Partial<GameAboutInfo>;
  ignoreNotifications?: boolean;
  ignoreNotification?: boolean;
  useNotifications?: boolean;
  notifications?: any;
  preventGamepad?: boolean;
  loader?: {
    url?: string,
    totalFrame?: number,
    interval?: number,
    animated?: boolean,
    scale?: number
  }
}

export class Engine {
  public ___params?: InitParams = {onReady: ()=>{}};

  public static readonly about = about;

  // Renderers
  public readonly BaseRenderer = BaseRenderer;
  public readonly TextureRenderer = TextureRenderer;
  public readonly SpriteRenderer = SpriteRenderer;
  public readonly TilingRenderer = TilingRenderer;
  public readonly TextRenderer = TextRenderer;
  public readonly BitmapTextRenderer = BitmapTextRenderer;
  public readonly RectRenderer = RectRenderer;
  public readonly GraphicRenderer = GraphicRenderer;
  public readonly NineSliceRenderer = NineSliceRenderer;
  public readonly AnimatedTextureRenderer = AnimatedTextureRenderer;

  // Utils
  public readonly config = config;
  public readonly about = about;
  public readonly Events = Events;
  public readonly Time = Time;
  public readonly MainLoop = MainLoop;
  public readonly Save = Save;
  public readonly Inputs = Inputs;
  public readonly gamepad = gamepad;
  public readonly Audio = Audio;
  public readonly Localization = Localization;
  public readonly Notifications = Notifications;
  public readonly Achievements = Achievements;
  public readonly ImageManager = ImageManager;
  public readonly Render = Render;
  public readonly Scene = Scene;
  public readonly Gui = Gui;
  public readonly Camera = Camera;
  public readonly Vector2 = Vector2;
  public readonly Tween = Tween;

  // GameObject
  public readonly GameObject = GameObject;
  public readonly Component = Component;
  public readonly ShakeComponent = ShakeComponent;
  public readonly TimerComponent = TimerComponent;
  public readonly Platform = Platform;
  public readonly PIXI = PIXI;

  private customOnLoad: () => void = () => {
    console.log('You have to give a onLoad callback to the DE.init options');
  };


  public get CONFIG(): typeof config {
    return config;
  }
  public get VERSION(): string {
    return config.VERSION;
  }

  /**
   * Is the engine paused.
   * @type {boolean}
   */
  public get paused(): boolean {
    return this._paused;
  }
  public set paused(value: boolean) {
    if (this._paused === value) {
      return;
    }

    if (value) {
      this.pause();
    } else {
      this.unPause();
    }
  }
  private _paused: boolean = false;

  public start() {
    // Make all audios instance and launch preload if required
    if(this.___params){
      Audio.initialize(this.___params.audios);
      delete this.___params;
    }
    
    const _defaultPoolName = DE.CONFIG.DEFAULT_POOL_NAME;

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
            if (!this.Platform.preventEngineLoader) {
              this.MainLoop.createLoader();
              this.MainLoop.displayLoader = true;
              this.Events.once(
                  'ImageManager-pool-' + _defaultPoolName + '-loaded',
                  () => {
                    setTimeout(() => this.onLoad(), 500);
                  },
              );
              this.ImageManager.loadPool(_defaultPoolName);
            } else {
              this.onLoad();
            }
          });
        });
    this.emit('change-debug', this.config.DEBUG, this.config.DEBUG_LEVEL);
  }

  /**
   * Pause the engine.
   */
  public pause() {
    this.paused = true;
    this.MainLoop.launched = false;
    this.Inputs.isListening = false;
  }

  /**
   * Unpause the engine.
   */
  public unPause() {
    this.paused = false;
    this.Inputs.isListening = true;
    this.MainLoop.launched = true;
    this.Time.lastCalcul = Date.now();
    this.Time.currentTime = Date.now();
    this.MainLoop.loop();
  }

  /*
   * Init engine with custom inputs, images data, audio data, locales
   * launch the first loader and some utils then call start on loaded
   * call this method when all your stuff is ready
   */
  public init(params: InitParams) {
    if (params == undefined) {
      throw 'Cannot init DreamEngine without the options, take a sample for easy start';
    }
    extendPIXI(DE);

    // configuration through a global script tag is possible
    window.ENGINE_SETTING = window.ENGINE_SETTING || {};

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

    this.Time.onTimeStop = () => {
      this.emit('window-lost-focus');
    };
    this.Time.onTimeResume = () => {
      this.emit('window-focus');
    };

    if (
        !params.ignoreNotifications &&
        params.useNotifications !== false &&
        !params.ignoreNotification
    ) {
      this.Notifications.init(params.notifications || {});
    } else {
      this.config.notifications.enable = false;
    }

    // init input listener with your custom list
    this.Inputs.init(params.inputs || {});

    if (!params.preventGamepad) {
      this.gamepad.init();
    }

    if (!params.onLoad) {
      console.error(
          'No onLoad given on init, nothing will happen after images load',
      );
    }
    if(params.onLoad)
      this.customOnLoad = params.onLoad
        

    this.emit('change-debug', this.config.DEBUG, this.config.DEBUG_LEVEL);

    if (!this.Platform.preventEngineLoader) {
      if(params.images){
        this.ImageManager.init(params.images.baseUrl, params.images.pools);

        // load the loader sprite image
        params.loader = params.loader || {};
        const loader = {
          0: 'loader',
          1: params.loader.url || 'loader.png',
          2: {
            totalFrame: params.loader.totalFrame || 16,
            interval: params.loader.interval || 45,
            animated:
                params.loader.animated !== undefined ? params.loader.animated : true,
            scale: params.loader.scale || 1,
          },
        };
        this.Events.once('ImageManager-loader-loaded', () => {
          this.MainLoop.updateLoaderImage(loader);
        });
        this.ImageManager.load(loader);
      }
    }

    this.___params = params;

    params.onReady();

    this.emit('change-debug', this.config.DEBUG, this.config.DEBUG_LEVEL);
  }

  // quick event access
  on(eventName: string, listener: (...args: any) => void) {
    this.Events.on(eventName, listener);
  }
  emit(eventName: string, ...params: Array<any>) {
    this.Events.emit(eventName, ...params);
  }
  trigger(eventName: string, ...params: Array<any>) {
    this.Events.emit(eventName, ...params);
  }

  onLoad() {
    this.customOnLoad();
    this.MainLoop.displayLoader = false;
  };
}

const DE = new Engine();
export default DE;

/*const DE = {
  config,
  about,
  Events,
  Time,
  MainLoop,
  Save,
  Inputs,
  gamepad,
  Audio,
  Localization,
  Notifications,
  Achievements,
  ImageManager,
  Render,
  Scene,
  Gui,
  Camera,
  Vector2,

  GameObject,
  Component,
  ShakeComponent,
  FadeComponent,
  ScaleComponent,
  TimerComponent,
  Platform,
  PIXI,
};*/

// enhance PIXI

// this is called when the pool "default" is loaded (the MainLoop will display a loader)



