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
exports.ImageManager = void 0;
const PIXI = __importStar(require("pixi.js"));
const about_1 = __importDefault(require("../about"));
const config_1 = __importDefault(require("../config"));
const Events_1 = __importDefault(require("./Events"));
const PIXI_LOADER = PIXI.Loader.shared;
PIXI_LOADER.pre((resource, next) => {
    if (resource.url.split('://').length > 1) {
        resource.crossOrigin = true;
        // resource.loadType = PIXI.loaders.Resource.LOAD_TYPE.XHR;
    }
    next();
});
class ImageManager {
    constructor() {
        this.DEName = 'ImageManager';
        this.pools = { default: [] };
        // quality var define what we need and how to use it
        this.pathPrefix = '';
        this.imageNotRatio = false;
        this.ratioToConception = 1;
        this.baseUrl = 'img/';
        this.spritesData = {}; // store data for SpriteRenderer
        this._waitingPools = []; // cannot load multiple resources / pools // have to queue
        this._waitingSolo = []; // cannot load multiple resources / pools // have to queue
    }
    /**
     * main init function, create pool and set baseUrl in an object, used to load things later
     * call ImageManager.loadPool( poolName ) to start loading things
     * @protected
     * @memberOf ImageManager
     */
    init(baseUrl, pools) {
        this.baseUrl = baseUrl;
        PIXI_LOADER.baseUrl = baseUrl;
        this.pools = {};
        const version = '?v' + about_1.default.gameVersion;
        for (const i in pools) {
            const p = pools[i];
            this.pools[i] = [];
            for (let n = 0; n < Object.keys(p).length; ++n) {
                const data = p[n];
                if (typeof data === 'string') {
                    this.pools[i].push({ url: data });
                }
                else if (typeof data[0] === typeof data[1]) {
                    if (!data[2]) {
                        data[2] = {};
                    }
                    this.spritesData[data[0]] = {
                        totalLine: data[2].totalLine || 1,
                        totalFrame: data[2].totalFrame || 1,
                        startFrame: data[2].startFrame || 0,
                        endFrame: data[2].endFrame || data[2].totalFrame - 1 || 0,
                        interval: data[2].interval || 16,
                        reversed: data[2].reversed || false,
                        loop: data[2].loop !== undefined ? data[2].loop : true,
                        animated: data[2].animated !== undefined ? data[2].animated : true,
                        pingPongMode: data[2].pingPongMode !== undefined ? data[2].pingPongMode : false,
                    };
                    this.pools[i].push({ name: data[0], url: data[1] + version });
                }
                else {
                    console.error('File format not recognized, make sure you follow the guidelines', data);
                }
            }
        }
    }
    /**
     * load a complete pool in memory
     * @public
     * @memberOf ImageManager
     */
    loadPool(poolName, customEventName, resetLoader = false) {
        const self = this;
        if (this.pools[poolName].length == 0) {
            setTimeout(() => {
                self._onComplete(poolName, customEventName);
            }, 500);
            return;
        }
        if (PIXI_LOADER.loading) {
            // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
            this._waitingPools.push({
                name: poolName,
                customEventName: customEventName,
            });
            return;
        }
        if (resetLoader) {
            PIXI_LOADER.reset();
        }
        PIXI_LOADER.onProgress.add((loader, _resource) => {
            self._onProgress(poolName, loader, customEventName);
        });
        PIXI_LOADER.add(this.pools[poolName]).load(() => {
            self._onComplete(poolName, customEventName);
        });
    }
    /**
     * onProgress event
     * @private
     * @memberOf ImageManager
     */
    _onProgress(poolName, loader, customEventName) {
        Events_1.default.emit('ImageManager-pool-progress', poolName, loader.progress.toString().slice(0, 5));
        Events_1.default.emit('ImageManager-pool-' + poolName + '-progress', poolName, loader.progress.toString().slice(0, 5));
        if (customEventName)
            Events_1.default.emit('ImageManager-' + customEventName + '-progress', poolName, loader.progress.toString().slice(0, 5));
    }
    /**
     * when a load is completed
     * @private
     * @memberOf ImageManager
     */
    _onComplete(poolName, customEventName) {
        console.log('ImageManager load complete: ', poolName);
        Events_1.default.emit('ImageManager-pool-complete', poolName);
        Events_1.default.emit('ImageManager-pool-' + poolName + '-loaded');
        if (customEventName)
            Events_1.default.emit('ImageManager-' + customEventName + '-loaded');
        // dequeue waiting pools here
        if (this._waitingPools.length != 0) {
            const pool = this._waitingPools.shift();
            this.loadPool(pool.name, pool.customEventName);
        }
        else if (this._waitingSolo.length != 0) {
            const solo = this._waitingSolo.shift();
            this.load(solo);
        }
    }
    /**
     * load one resource
     * @public
     * @memberOf ImageManager
     */
    load(data) {
        if (PIXI_LOADER.resources[data[0]]) {
            PIXI.utils.TextureCache[PIXI_LOADER.resources[data[0]].url].destroy();
            delete PIXI_LOADER.resources[data[0]];
        }
        let dataLoad = data;
        if (typeof data !== 'string' && typeof data[0] === typeof data[1]) {
            if (!data[2]) {
                data[2] = {};
            }
            this.spritesData[data[0]] = {
                totalLine: data[2].totalLine || 1,
                totalFrame: data[2].totalFrame || 1,
                startFrame: data[2].startFrame || 0,
                endFrame: data[2].endFrame || data[2].totalFrame - 1 || 0,
                interval: data[2].interval || 16,
                reversed: data[2].reversed || false,
                loop: data[2].loop !== undefined ? data[2].loop : true,
                animated: data[2].animated !== undefined ? data[2].animated : true,
                pingPongMode: data[2].pingPongMode !== undefined ? data[2].pingPongMode : false,
            };
            let url = data[1];
            // external images don't receive the version as they could already have custom params
            if (url.split('://').length === 1) {
                url += '?v' + config_1.default.VERSION;
            }
            dataLoad = { name: data[0], url };
        }
        if (PIXI_LOADER.loading) {
            // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
            this._waitingSolo.push(data);
            return;
        }
        const self = this;
        PIXI_LOADER.add(dataLoad).load(() => {
            // PIXI_LOADER.reset();
            // TODO find a way to prevent "success" trigger if the image failed to load
            PIXI_LOADER.onProgress.detachAll();
            if (typeof dataLoad === 'string')
                self._onComplete('', dataLoad);
            else
                self._onComplete('', dataLoad.name);
        });
    }
    /**
     * unload a complete pool (clean memory)
     * @public
     * @memberOf ImageManager
     */
    unloadPool(poolName) {
        const pool = this.pools[poolName];
        for (let i = 0, res, t = pool.length; i < t; ++i) {
            res = pool[i];
            PIXI.utils.TextureCache[PIXI_LOADER.resources[res.name || res.url].url].destroy(true);
            // needed ?
            // PIXI doesn't remove it from resources after the texture has been destroyed
            // what is the best practice for this ?
            delete PIXI_LOADER.resources[pool[i].name || pool[i].url];
        }
    }
}
exports.ImageManager = ImageManager;
const imgManag = new ImageManager();
exports.default = imgManag;
