import '../css/default.css';

import about, { GameAboutInfo } from './about';
import config from './config';
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

const onLoad = () => {
  customOnLoad();
  MainLoop.displayLoader = false;
};

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
      // hack to let the promise context swallowing throws
      setTimeout(() => {
        if (!Platform.preventEngineLoader) {
          // wait the loading image to be loaded before the other events
          Events.once('ImageManager-loader-loaded', () => {
            Events.once(
              'ImageManager-pool-' + _defaultPoolName + '-loaded',
              () => {
                setTimeout(() => onLoad(), 500);
              },
            );
            ImageManager.loadPool(_defaultPoolName);
          });

          MainLoop.createLoader();
          MainLoop.displayLoader = true;
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

// quick event access
const on = (eventName: string, listener: (...args: any) => void) => {
  Events.on(eventName, listener);
};
const removeListener = (
  eventName: string,
  listener: (...args: any) => void,
) => {
  Events.removeListener(eventName, listener);
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

  // Set about data
  if (params.about) {
    about.set(params.about);
  }

  // Init the save with your custom scheme
  Save.init(params.saveModel, params.saveIgnoreVersion);

  // Init localization with dictionary
  Localization.init(params.dictionary || {});

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
    gamepad.init(Inputs);
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
      const loader = [
        'loader',
        params.loader.url || 'loader.png',
        {
          totalFrame: params.loader.totalFrame || 1,
          interval: params.loader.interval || 0,
          animated:
            params.loader.animated !== undefined
              ? params.loader.animated
              : false,
        },
      ] as InitImageData;
      Events.once('ImageManager-loader-loaded', () => {
        MainLoop.updateLoaderImage(loader, params?.loader?.scale ?? 0.4);
      });
      ImageManager.load(loader);
    }
  }

  ___params = params;

  params.onReady();

  emit('change-debug', config.DEBUG, config.DEBUG_LEVEL);
};

export default {
  init,
  start,
  trigger,
  emit,
  on,
  removeListener,
  unPause,
  pause,
  isPaused,
};
