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
import Audio from './utils/Audio';
import gamepad from './utils/gamepad';
import ImageManager from './utils/ImageManager';
import Inputs from './utils/Inputs';
import Localization from './utils/Localization';
import Notifications from './utils/Notifications';
import Platform from './utils/Platform';
import Save from './utils/Save';

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
import FadeComponent from './classes/components/FadeComponent';
import ScaleComponent from './classes/components/ScaleComponent';
import ShakeComponent from './classes/components/ShakeComponent';
import TimerComponent from './classes/components/TimerComponent';
import GameObject from './classes/GameObject';

type InitParams = {
  about?: Partial<GameAboutInfo>;
}

export class Engine {
  public static readonly about = about;

  // Renderers
  public static readonly BaseRenderer = BaseRenderer;
  public static readonly TextureRenderer = TextureRenderer;
  public static readonly SpriteRenderer = SpriteRenderer;
  public static readonly TilingRenderer = TilingRenderer;
  public static readonly TextRenderer = TextRenderer;
  public static readonly BitmapTextRenderer = BitmapTextRenderer;
  public static readonly RectRenderer = RectRenderer;
  public static readonly GraphicRenderer = GraphicRenderer;
  public static readonly NineSliceRenderer = NineSliceRenderer;
  public static readonly AnimatedTextureRenderer = AnimatedTextureRenderer;

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
    Audio.initialize(DE.___params.audios);
    delete DE.___params;

    MainLoop.launched = true;
    MainLoop.loop();

    Platform.beforeStartingEngine()
        .catch((e) => console.error(e))
        .then(() => {
          // hack to leave the promise context swallowing throws
          setTimeout(() => {
            if (!DE.Platform.preventEngineLoader) {
              DE.MainLoop.createLoader();
              DE.MainLoop.displayLoader = true;
              DE.Events.once(
                  'ImageManager-pool-' + _defaultPoolName + '-loaded',
                  function () {
                    setTimeout(() => DE.onLoad(), 500);
                  },
              );
              DE.ImageManager.loadPool(_defaultPoolName);
            } else {
              this.onLoad();
            }
          });
        });
    DE.emit('change-debug', DE.config.DEBUG, DE.config.DEBUG_LEVEL);
  }

  /**
   * Pause the engine.
   */
  public pause() {
    this._paused = true;

    Inputs.stopListening();
  }

  /**
   * Unpause the engine.
   */
  public unPause() {
    this._paused = false;

    Inputs.startListening();
  }

  /*
   * Init engine with custom inputs, images data, audio data, locales
   * launch the first loader and some utils then call start on loaded
   * call this method when all your stuff is ready
   */
  public init(params: InitParams) {
    if (!params) {
      throw 'Cannot init DreamEngine without the options, take a sample for easy start';
    }

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

    DE.Time.onTimeStop = () => {
      DE.emit('window-lost-focus');
    };
    DE.Time.onTimeResume = () => {
      DE.emit('window-focus');
    };

    if (
        !params.ignoreNotifications &&
        params.useNotifications !== false &&
        !params.ignoreNotification
    ) {
      DE.Notifications.init(params.notifications || {});
    } else {
      DE.config.notifications.enable = false;
    }

    // init input listener with your custom list
    DE.Inputs.init(params.inputs || {});

    if (!params.preventGamepad) {
      DE.gamepad.init();
    }

    if (!params.onLoad) {
      console.error(
          'No onLoad given on init, nothing will happen after images load',
      );
    }
    this.customOnLoad =
        params.onLoad ||
        function () {
          console.log('You have to give a onLoad callback to the DE.init options');
        };

    DE.emit('change-debug', DE.config.DEBUG, DE.config.DEBUG_LEVEL);

    if (!DE.Platform.preventEngineLoader) {
      DE.ImageManager.init(params.images.baseUrl, params.images.pools);

      // load the loader sprite image
      params.loader = params.loader || {};
      var loader = [
        'loader',
        params.loader.url || 'loader.png',
        {
          totalFrame: params.loader.totalFrame || 16,
          interval: params.loader.interval || 45,
          animated:
              params.loader.animated !== undefined ? params.loader.animated : true,
          scale: params.loader.scale || 1,
        },
      ];
      DE.Events.once('ImageManager-loader-loaded', function () {
        DE.MainLoop.updateLoaderImage(loader);
      });
      DE.ImageManager.load(loader);
    }

    DE.___params = params;

    params.onReady();

    DE.emit('change-debug', DE.config.DEBUG, DE.config.DEBUG_LEVEL);
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
extendPIXI(DE, PIXI);

// this is called when the pool "default" is loaded (the MainLoop will display a loader)
DE.onLoad = function () {
  DE.customOnLoad();
  DE.MainLoop.displayLoader = false;
};

var _defaultPoolName = DE.CONFIG.DEFAULT_POOL_NAME;
DE.start = function () {
  //

};

window.addEventListener('unhandledrejection', function (event) {
  // the event object has two special properties:
  console.error(event.promise); // [object Promise] - the promise that generated the error
  console.error(event.reason); // Error: Whoops! - the unhandled error object
});

// pause / unpause the game
DE.pause = function () {
  this.paused = true;
  this.MainLoop.launched = false;
  this.Inputs.listening = false;
};
DE.unPause = function () {
  this.paused = false;
  this.Inputs.listening = true;
  this.MainLoop.launched = true;
  this.Time.lastCalcul = Date.now();
  this.Time.currentTime = Date.now();
  this.MainLoop.loop();
};

// quick event access
DE.on = function () {
  this.Events.on.apply(this.Events, arguments);
};
DE.emit = function () {
  this.Events.emit.apply(this.Events, arguments);
};
DE.trigger = function () {
  this.Events.emit.apply(this.Events, arguments);
};

export default DE;
