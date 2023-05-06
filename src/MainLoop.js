"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLoop = void 0;
const GameObject_1 = __importDefault(require("./classes/GameObject"));
const SpriteRenderer_1 = __importDefault(require("./classes/renderer/SpriteRenderer"));
const TextRenderer_1 = __importDefault(require("./classes/renderer/TextRenderer"));
const config_1 = __importDefault(require("./config"));
const Events_1 = __importDefault(require("./utils/Events"));
const gamepad_1 = __importDefault(require("./utils/gamepad"));
const Localization_1 = __importDefault(require("./utils/Localization"));
const Time_1 = __importDefault(require("./utils/Time"));
/**
 * @namespace MainLoop
 * The MainLoop namespace handle the call of the next frame, updating scene, rendering and so on
 * MainLoop start when calling DE.start();
 */
class MainLoop {
    constructor() {
        this.scenes = [];
        this.renders = [];
        this.additionalModules = {};
        this.launched = false;
        this.displayLoader = false;
        this.loader = new GameObject_1.default({});
    }
    createLoader() {
        const loaderTextRd = new TextRenderer_1.default('Loading...', {
            textStyle: {
                fill: 'white',
                fontSize: 35,
                fontFamily: 'Snippet, Monaco, monospace',
                strokeThickness: 1,
                align: 'center',
            },
        });
        this.loader.addRenderer(loaderTextRd);
        let n_dots = 0;
        this.loader.timeout(() => {
            let dots = '.';
            for (let i = 0; i < 3; ++i) {
                dots += n_dots < i ? ' ' : '.';
            }
            ++n_dots;
            if (n_dots > 3) {
                n_dots = 0;
            }
            loaderTextRd.text = 'Loading' + dots;
        }, 500, true);
        this.loader.renderer.y += 150;
        Events_1.default.on('ImageManager-pool-progress', (poolName, progression) => {
            this.loader.removeAutomatism('animateLoader');
            poolName == config_1.default.DEFAULT_POOL_NAME
                ? (loaderTextRd.text = progression + '%')
                : (loaderTextRd.text = poolName + ': ' + progression + '%');
        });
        Events_1.default.on('ImageManager-pool-complete', () => {
            this.loader.removeAutomatism('animateLoader');
            loaderTextRd.text = '100%';
        });
    }
    updateLoaderImage(loader) {
        // TOTO créer un type "imageParams"
        this.loader.addRenderer(new SpriteRenderer_1.default({ spriteName: loader[0], scale: loader[2].scale }));
    }
    loop() {
        if (!this.launched) {
            console.warn('MainLoop has stopped');
            return;
        }
        requestAnimationFrame(() => this.loop());
        // regulate fps OR if the Time machine is stopped
        if (!Time_1.default.update()) {
            return;
        }
        if (this.displayLoader) {
            for (let i = 0, j; (j = this.renders[i]); i++) {
                this.loader.x = j.pixiRenderer.width * 0.5;
                this.loader.y = j.pixiRenderer.height * 0.5;
                this.loader.update(Time_1.default.currentTime);
                j.directRender(this.loader);
            }
            return;
        }
        // TODO render only if framerate is ok then ?
        for (let i = 0, r; (r = this.renders[i]); ++i) {
            r.render();
        }
        gamepad_1.default.update(Time_1.default.currentTime);
        while (Time_1.default.timeSinceLastFrame >= Time_1.default.frameDelay) {
            for (const r in this.additionalModules)
                this.additionalModules[r]._update(Time_1.default.frameDelayScaled);
            for (let i = 0, r; (r = this.renders[i]); ++i) {
                r.update(Time_1.default.frameDelayScaled);
            }
            for (let i = 0, s; (s = this.scenes[i]); ++i) {
                if (s.enable) {
                    s.update(Time_1.default.frameDelayScaled);
                }
            }
            Time_1.default.timeSinceLastFrame -= Time_1.default.frameDelay;
        }
    }
    addScene(scene) {
        this.scenes.push(scene);
    }
    addRender(render) {
        this.renders.push(render);
    }
}
exports.MainLoop = MainLoop;
MainLoop.DEName = 'MainLoop';
const mainLoop = new MainLoop();
Events_1.default.on('lang-changed', () => {
    for (let i = 0, s; (s = mainLoop.scenes[i]); ++i) {
        for (let ii = 0, g; (g = s.gameObjects[ii]); ++ii) {
            checkGameObjectsTextRenderer(g);
        }
    }
});
function checkGameObjectsTextRenderer(go) {
    for (let ix = 0, sub; (sub = go.gameObjects[ix]); ++ix) {
        checkGameObjectsTextRenderer(sub);
    }
    if (!go.renderers) {
        return;
    }
    for (let ir = 0, r; (r = go.renderers[ir]); ++ir) {
        if (r.localizationKey) {
            r.text = Localization_1.default.get(r.localizationKey);
            r.checkMaxWidth();
        }
    }
}
exports.default = mainLoop;
