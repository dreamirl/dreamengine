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
const PIXI = __importStar(require("pixi.js"));
const Time_1 = __importDefault(require("../../utils/Time"));
require("../renderer/ContainerExtensions");
const ContainerExtensions_1 = require("../renderer/ContainerExtensions");
class AnimatedTextureRenderer extends PIXI.Sprite {
    constructor(imageNames, params = {}) {
        super();
        this.sleep = false;
        this.instantiate(params);
        this._imageNames = [];
        this._textures = [];
        this._currentFrame = 0;
        this.lastAnim = Date.now();
        this.animated = params.animated !== undefined ? !!params.animated : true;
        this._isPaused = false;
        this.loop = params.loop !== undefined ? !!params.loop : true;
        this.reversed = params.reversed || false;
        this.interval = params.interval || 16;
        this.pingPongMode = params.pingPongMode || false;
        this._startFrame = 0;
        this._endFrame = 0;
        this.isOver = false;
        if (imageNames) {
            this.imageNames = imageNames;
        }
        else {
            if (params.sheetName && params.animationName)
                this.changeSheet(params.sheetName, params.animationName);
        }
        if (params.endFrame) {
            this.endFrame = params.endFrame;
        }
        if (params.startFrame) {
            this.startFrame = params.startFrame;
        }
        this.pause = !!params.pause;
        this._currentFrame = params.currentFrame ? params.currentFrame : 0;
        this._nextAnim = this.interval;
        this.setTint(params.tint || 0xffffff);
        delete params.tint;
        delete params.currentFrame;
        delete params.endFrame;
        delete params.startFrame;
        if (params.randomFrame) {
            this.currentFrame = (Math.random() * this.textures.length) >> 0;
        }
    }
    changeSheet(sheetName, animationName) {
        this.sheetName = sheetName;
        this.animationName = animationName;
        this.imageNames =
            PIXI.Loader.shared.resources[sheetName].data.animations[animationName];
        this.restart();
    }
    get pause() {
        return this._isPaused;
    }
    set pause(bool) {
        this._isPaused = bool;
        if (bool) {
            this._nextAnim = this.interval;
        }
    }
    get textures() {
        return this._textures;
    }
    set textures(textures) {
        this._textures = textures;
        this.endFrame = textures.length - 1;
        // if current frame is greater than the new amount of textures
        // reset to 0
        if (this._currentFrame < textures.length) {
            this.currentFrame = 0;
        }
    }
    get currentFrame() {
        return this._currentFrame;
    }
    set currentFrame(val) {
        this._currentFrame = val;
        this.texture = this._textures[this._currentFrame];
    }
    get endFrame() {
        return this._endFrame;
    }
    set endFrame(frame) {
        this._endFrame = Math.min(Math.max(0, frame), this._textures.length - 1);
        if (this._endFrame < this._startFrame) {
            this.startFrame = this._endFrame;
        }
    }
    get startFrame() {
        return this._startFrame;
    }
    set startFrame(frame) {
        this._startFrame = Math.min(Math.max(0, frame), this._textures.length - 1);
        if (this._startFrame > this._endFrame) {
            this.endFrame = this._startFrame;
        }
    }
    get imageNames() {
        return this._imageNames;
    }
    set imageNames(names) {
        this._imageNames = names;
        const textures = [];
        names.forEach((imgName) => textures.push(PIXI.utils.TextureCache[imgName]));
        this.textures = textures;
    }
    update() {
        if (!this.animated || this.pause || this.isOver) {
            return;
        }
        this._nextAnim -= Time_1.default.frameDelayScaled;
        if (this._nextAnim > 0) {
            return;
        }
        this._nextAnim = this.interval + this._nextAnim; // sub rest of previous anim time (if it take 50ms and we goes up to 55, remove 5)
        this.lastAnim = Date.now();
        const tempCurrentFrame = this._currentFrame + (this.reversed ? -1 : 1);
        if (tempCurrentFrame > this.endFrame) {
            if (this.loop) {
                if (this.pingPongMode) {
                    this.reversed = true;
                    this.currentFrame = this.endFrame;
                }
                else {
                    this.currentFrame = this.startFrame;
                }
            }
            else {
                this.isOver = true;
                this.onAnimEnd();
            }
        }
        else if (tempCurrentFrame < this.startFrame) {
            if (this.loop) {
                if (this.pingPongMode) {
                    this.reversed = false;
                    this.currentFrame = this.startFrame;
                }
                else {
                    this.currentFrame = this.endFrame;
                }
            }
            else {
                this.isOver = true;
                this.onAnimEnd();
            }
        }
        else {
            this.currentFrame = tempCurrentFrame;
        }
    }
    gotoAndPause(frame) {
        this.isOver = false;
        this.currentFrame = frame;
        this.pause = true;
    }
    stop() {
        this.gotoAndPause(this.reversed ? this.endFrame : this.startFrame);
    }
    restart() {
        this.pause = false;
        this.isOver = false;
        this.currentFrame = this.reversed ? this.endFrame : this.startFrame;
    }
    onAnimEnd() { }
    setTint(value) { (0, ContainerExtensions_1.setTint)(this, value); }
    setHue(rotation, multiply) { (0, ContainerExtensions_1.setHue)(this, rotation, multiply); }
    setBlackAndWhite(multiply) { (0, ContainerExtensions_1.setBlackAndWhite)(this, multiply); }
    setSaturation(amount, multiply) { (0, ContainerExtensions_1.setSaturation)(this, amount, multiply); }
    setBrightness(b, multiply) { (0, ContainerExtensions_1.setBrightness)(this, b, multiply); }
    setContrast(amount, multiply) { (0, ContainerExtensions_1.setContrast)(this, amount, multiply); }
    setGreyscale(scale, multiply) { (0, ContainerExtensions_1.setGreyscale)(this, scale, multiply); }
    setSize(width, height, preventCenter) { (0, ContainerExtensions_1.setSize)(this, width, height, preventCenter); }
    setScale(x, y) { (0, ContainerExtensions_1.setScale)(this, x, y); }
    center() { (0, ContainerExtensions_1.center)(this); }
    instantiate(params) { (0, ContainerExtensions_1.instantiate)(this, params); }
}
exports.default = AnimatedTextureRenderer;
AnimatedTextureRenderer.DEName = 'AnimatedTextureRenderer';
