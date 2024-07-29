"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/default.css");
const PIXI = __importStar(require("pixi.js"));
const about_1 = __importDefault(require("./about"));
const config_1 = __importDefault(require("./config"));
const MainLoop_1 = __importDefault(require("./MainLoop"));
// Utils
const Achievements_1 = __importDefault(require("./utils/Achievements"));
const Audio_1 = __importDefault(require("./utils/Audio"));
const Events_1 = __importDefault(require("./utils/Events"));
const gamepad_1 = __importDefault(require("./utils/gamepad"));
const ImageManager_1 = __importDefault(require("./utils/ImageManager"));
const Inputs_1 = __importDefault(require("./utils/Inputs"));
const Localization_1 = __importDefault(require("./utils/Localization"));
const Notifications_1 = __importDefault(require("./utils/Notifications"));
const Platform_1 = __importDefault(require("./utils/Platform"));
const Save_1 = __importDefault(require("./utils/Save"));
const Time_1 = __importDefault(require("./utils/Time"));
const Camera_1 = __importDefault(require("./classes/Camera"));
const Gui_1 = __importDefault(require("./classes/Gui"));
const Render_1 = __importDefault(require("./classes/Render"));
const Scene_1 = __importDefault(require("./classes/Scene"));
const Vector2_1 = __importDefault(require("./classes/Vector2"));
// Engine custom renderers
const AnimatedTextureRenderer_1 = __importDefault(require("./classes/renderer/AnimatedTextureRenderer"));
const BitmapTextRenderer_1 = __importDefault(require("./classes/renderer/BitmapTextRenderer"));
const GraphicRenderer_1 = __importDefault(require("./classes/renderer/GraphicRenderer"));
const NineSliceRenderer_1 = __importDefault(require("./classes/renderer/NineSliceRenderer"));
const RectRenderer_1 = __importDefault(require("./classes/renderer/RectRenderer"));
const SpriteRenderer_1 = __importDefault(require("./classes/renderer/SpriteRenderer"));
const TextRenderer_1 = __importDefault(require("./classes/renderer/TextRenderer"));
const TextureRenderer_1 = __importDefault(require("./classes/renderer/TextureRenderer"));
const TilingRenderer_1 = __importDefault(require("./classes/renderer/TilingRenderer"));
// Custom classes
const Component_1 = __importDefault(require("./classes/Component"));
const ShakeComponent_1 = __importDefault(require("./classes/components/ShakeComponent"));
const TimerComponent_1 = __importDefault(require("./classes/components/TimerComponent"));
const GameObject_1 = __importDefault(require("./classes/GameObject"));
const Tween_1 = __importDefault(require("./classes/Tween"));
let ___params = {
    onReady: () => {
        return;
    },
};
let paused = false;
const isPaused = () => paused;
const start = () => {
    // Make all audios instance and launch preload if required
    if (___params) {
        Audio_1.default.initialize(___params.audios);
        ___params = undefined;
    }
    const _defaultPoolName = config_1.default.DEFAULT_POOL_NAME;
    window.addEventListener('unhandledrejection', function (event) {
        // the event object has two special properties:
        console.error(event.promise); // [object Promise] - the promise that generated the error
        console.error(event.reason); // Error: Whoops! - the unhandled error object
    });
    MainLoop_1.default.launched = true;
    MainLoop_1.default.loop();
    Platform_1.default.beforeStartingEngine()
        .catch((e) => console.error(e))
        .then(() => {
        // hack to leave the promise context swallowing throws
        setTimeout(() => {
            if (!Platform_1.default.preventEngineLoader) {
                MainLoop_1.default.createLoader();
                MainLoop_1.default.displayLoader = true;
                Events_1.default.once('ImageManager-pool-' + _defaultPoolName + '-loaded', () => {
                    setTimeout(() => onLoad(), 500);
                });
                ImageManager_1.default.loadPool(_defaultPoolName);
            }
            else {
                onLoad();
            }
        });
    });
    emit('change-debug', config_1.default.DEBUG, config_1.default.DEBUG_LEVEL);
};
/**
 * Pause the engine.
 */
const pause = () => {
    paused = true;
    MainLoop_1.default.launched = false;
    Inputs_1.default.isListening = false;
};
/**
 * Unpause the engine.
 */
const unPause = () => {
    paused = false;
    Inputs_1.default.isListening = true;
    MainLoop_1.default.launched = true;
    Time_1.default.lastCalcul = Date.now();
    Time_1.default.currentTime = Date.now();
    MainLoop_1.default.loop();
};
const onLoad = () => {
    customOnLoad();
    MainLoop_1.default.displayLoader = false;
};
// quick event access
const on = (eventName, listener) => {
    Events_1.default.on(eventName, listener);
};
const removeListener = (eventName, listener) => {
    Events_1.default.removeListener(eventName, listener);
};
const emit = (eventName, ...params) => {
    Events_1.default.emit(eventName, ...params);
};
const trigger = (eventName, ...params) => {
    Events_1.default.emit(eventName, ...params);
};
let customOnLoad = () => {
    console.log('You have to give a onLoad callback to the DE.init options');
};
/*
 * Init engine with custom inputs, images data, audio data, locales
 * launch the first loader and some utils then call start on loaded
 * call this method when all your stuff is ready
 */
const init = (params) => {
    if (params == undefined) {
        throw 'Cannot init DreamEngine without the options, take a sample for easy start';
    }
    // extendPIXI(DE);
    // Set about data
    if (params.about) {
        about_1.default.set(params.about);
    }
    // Init the save with your custom scheme
    Save_1.default.init(params.saveModel, params.saveIgnoreVersion);
    // Init localization with dictionary
    Localization_1.default.init(params.dictionary || {});
    // init SystemDetection (if you develop special features for a special OS release)
    // TODO DE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );
    // set achievements with your custom list
    Achievements_1.default.init(params.achievements || []);
    Time_1.default.onTimeStop = () => {
        emit('window-lost-focus');
    };
    Time_1.default.onTimeResume = () => {
        emit('window-focus');
    };
    if (!params.ignoreNotifications &&
        params.useNotifications !== false &&
        !params.ignoreNotification) {
        Notifications_1.default.init(params.notifications || {});
    }
    else {
        config_1.default.notifications.enable = false;
    }
    // init input listener with your custom list
    Inputs_1.default.init(params.inputs || {});
    if (!params.preventGamepad) {
        gamepad_1.default.init(Inputs_1.default);
    }
    if (!params.onLoad) {
        console.error('No onLoad given on init, nothing will happen after images load');
    }
    if (params.onLoad)
        customOnLoad = params.onLoad;
    emit('change-debug', config_1.default.DEBUG, config_1.default.DEBUG_LEVEL);
    if (!Platform_1.default.preventEngineLoader) {
        if (params.images) {
            ImageManager_1.default.init(params.images.baseUrl, params.images.pools);
            // load the loader sprite image
            params.loader = params.loader || {};
            const loader = {
                0: 'loader',
                1: params.loader.url || 'loader.png',
                2: {
                    totalFrame: params.loader.totalFrame || 1,
                    interval: params.loader.interval || 0,
                    animated: params.loader.animated !== undefined
                        ? params.loader.animated
                        : false,
                    scale: params.loader.scale || 0.15,
                },
            };
            Events_1.default.once('ImageManager-loader-loaded', () => {
                MainLoop_1.default.updateLoaderImage(loader);
            });
            ImageManager_1.default.load(loader);
        }
    }
    ___params = params;
    params.onReady();
    emit('change-debug', config_1.default.DEBUG, config_1.default.DEBUG_LEVEL);
};
exports.default = {
    // Renderers
    TextureRenderer: TextureRenderer_1.default,
    SpriteRenderer: SpriteRenderer_1.default,
    TilingRenderer: TilingRenderer_1.default,
    TextRenderer: TextRenderer_1.default,
    BitmapTextRenderer: BitmapTextRenderer_1.default,
    RectRenderer: RectRenderer_1.default,
    GraphicRenderer: GraphicRenderer_1.default,
    NineSliceRenderer: NineSliceRenderer_1.default,
    AnimatedTextureRenderer: AnimatedTextureRenderer_1.default,
    // Utils
    config: config_1.default,
    about: about_1.default,
    Events: Events_1.default,
    Time: Time_1.default,
    Save: Save_1.default,
    Audio: Audio_1.default,
    ImageManager: ImageManager_1.default,
    MainLoop: MainLoop_1.default,
    Inputs: Inputs_1.default,
    gamepad: gamepad_1.default,
    Localization: Localization_1.default,
    Notifications: Notifications_1.default,
    Achievements: Achievements_1.default,
    Render: Render_1.default,
    Scene: Scene_1.default,
    Gui: Gui_1.default,
    Camera: Camera_1.default,
    Vector2: Vector2_1.default,
    Tween: Tween_1.default,
    // GameObject
    GameObject: GameObject_1.default,
    Component: Component_1.default,
    ShakeComponent: ShakeComponent_1.default,
    TimerComponent: TimerComponent_1.default,
    Platform: Platform_1.default,
    PIXI,
    CONFIG: config_1.default,
    VERSION: config_1.default.VERSION,
    init,
    customOnLoad: () => customOnLoad(),
    trigger,
    emit,
    on,
    removeListener,
    onLoad,
    unPause,
    pause,
    start,
    isPaused,
};
