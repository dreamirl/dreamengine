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
const ImageManager_1 = __importDefault(require("../../utils/ImageManager"));
const Time_1 = __importDefault(require("../../utils/Time"));
require("../renderer/ContainerExtensions");
const ContainerExtensions_1 = require("../renderer/ContainerExtensions");
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor SpriteRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite<br>
 * if the given sprite is animated, it'll animate it automatically according to you imagesDatas file<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var ship = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.SpriteRenderer( { "spriteName": "ship", "scale": 0.7, "offsetY": -30 } )
 * } );
 */
class SpriteRenderer extends PIXI.Sprite {
    constructor(params) {
        const tempSpriteName = params.spriteName || params.spriteUrl || params.textureName;
        delete params.spriteName;
        if (!tempSpriteName) {
            throw new Error('SpriteRenderer :: No spriteName defined -- declaration canceled');
        }
        const tempTexture = SpriteRenderer._getTexture(tempSpriteName);
        if (!tempTexture) {
            throw new Error("SpriteRenderer :: Can't find image " +
                tempSpriteName +
                ' in ImageManager, is the image a sheet ? Or maybe not loaded ?');
        }
        super(tempTexture);
        this.sleep = false;
        this.spriteName = tempSpriteName;
        this.texture = tempTexture;
        this.isAtlasTexture = false;
        // let texture = this._getTexture(this.spriteName);
        // // only if no texture can be found either using standard url reading or naming in sheets
        // if (!texture) {
        //   throw new Error(
        //     "SpriteRenderer :: Can't find image " +
        //       this.spriteName +
        //       ' in ImageManager, is the image a sheet ? Or maybe not loaded ?',
        //   );
        // }
        if (!ImageManager_1.default.spritesData[this.spriteName]) {
            this.isAtlasTexture = true;
            this.spriteData = params.spriteData;
        }
        //Nb: every value here is set to 0/null/undefined, at the end of the declaration changeSprite is called and everything is correctly set here
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.startFrame = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.endFrame = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this._currentFrame = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.startLine = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this._currentLine = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.totalFrame = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.totalLine = 0;
        /**
         * time in ms
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.interval = 0;
        /**
         * @private
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this._nextAnim = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.animated = false;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.isPaused = false;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.reversed = false;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.isOver = 0;
        /**
         * @public
         * @memberOf SpriteRenderer
         * @type {Int}
         */
        this.loop = false;
        //this._tint = params.tint || undefined;
        /**
         * if true animation will play normal then reversed then normal....
         * @public
         * @memberOf SpriteRenderer
         * @type {Boolean}
         */
        this.pingPongMode = false;
        //Tkt
        this.fw = 0;
        this.fh = 0;
        this.scale = { x: 1, y: 1 };
        /**
         * @public
         * This function is called when the animation is over. Overwrite this function
         * @memberOf SpriteRenderer
         */
        this.onAnimEnd = () => { };
        this.changeSprite(this.spriteName, params);
        this.instantiate(params);
        // was used to handle quality change
        // Events.on( 'quality-changed', function( n, nt, name )
        // {
        //   if ( name != this.spriteName )
        //     return;
        //   this.frameSizes.width  = ImageManager.spritesData[ this.spriteName ].widthFrame;
        //   this.frameSizes.height = ImageManager.spritesData[ this.spriteName ].heightFrame;
        // }, this );
    }
    static _getTexture(spriteName) {
        if (ImageManager_1.default.spritesData[spriteName]) {
            return PIXI.utils.TextureCache[PIXI.Loader.shared.resources[spriteName].url];
        }
        else {
            return PIXI.utils.TextureCache[spriteName];
        }
    }
    /**
     * update the animation (called by the GameObject, if you use it an other way you have to call update)
     * @protected
     * @memberOf SpriteRenderer
     */
    update() {
        if (!this.animated || this.isPaused || this.isOver) {
            return;
        }
        this._nextAnim -= Time_1.default.frameDelayScaled;
        if (this._nextAnim > 0) {
            return;
        }
        this._nextAnim = this.interval + this._nextAnim; // sub rest of previous anim time (if it take 50ms and we goes up to 55, remove 5)
        this.lastAnim = Date.now();
        this._currentFrame += this.reversed ? -1 : 1;
        if (this._currentFrame > this.endFrame) {
            if (this.loop) {
                this._currentFrame = this.startFrame;
                if (this.pingPongMode) {
                    this.reversed = true;
                    this._currentFrame = this.endFrame - 1;
                }
            }
            else {
                this._currentFrame = this.endFrame;
                this.isOver = 1;
                this.onAnimEnd();
            }
        }
        else if (this._currentFrame < this.startFrame) {
            if (this.loop) {
                this._currentFrame = this.endFrame;
                if (this.pingPongMode) {
                    this.reversed = false;
                    this._currentFrame = this.startFrame + 1;
                }
            }
            else {
                this._currentFrame = this.startFrame;
                this.isOver = 1;
                this.onAnimEnd();
            }
        }
        if (this._originalTexture) {
            this._originalTexture.frame.x = this._currentFrame * this.fw;
            this._originalTexture.frame.y = this._currentLine * this.fh;
            this._originalTexture.updateUvs();
        }
        if (this.normalTexture) {
            this.normalTexture.frame.x = this._currentFrame * this.fw;
            this.normalTexture.frame.y = this._currentLine * this.fh;
            this.normalTexture.updateUvs();
        }
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setFrame(frame) {
        this._currentFrame = frame;
        return this;
    }
    onAnimEnd() { }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setLine(line) {
        this._currentLine = line;
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    restartAnim() {
        this.isOver = 0;
        if (!this.reversed) {
            this._currentFrame = this.startFrame;
        }
        else {
            this._currentFrame = this.endFrame - 1;
        }
        this.lastAnim = Time_1.default.currentTime;
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Boolean}
     */
    setPause(val) {
        this.isPaused = val;
        if (!val && !this.animated) {
            this.animated = true;
            this.lastAnim = Date.now();
        }
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setEndFrame(v) {
        if (this.totalFrame <= v) {
            this.endFrame = this.totalFrame - 1;
        }
        else {
            this.endFrame = v;
        }
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int} interval in ms
     */
    setInterval(interval) {
        this.interval = interval;
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Boolean}
     */
    setLoop(bool) {
        this.loop = bool;
        return this;
    }
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    changeSprite(spriteName, params) {
        params = params || {};
        this.spriteName = spriteName;
        if (!this.spriteName) {
            throw new Error('SpriteRenderer :: No spriteName defined -- declaration canceled');
        }
        const d = this.spriteData || ImageManager_1.default.spritesData[this.spriteName];
        this.startFrame = params.startFrame || d.startFrame || 0;
        this.endFrame = params.endFrame || d.endFrame || d.totalFrame - 1 || 0;
        this._currentFrame = this.startFrame || params.currentFrame || 0;
        this._currentLine = params.startLine || 0;
        this.startLine = params.startLine || 0;
        this.endLine = params.endLine || d.totalLine - 1 || 0;
        this.totalFrame = d.totalFrame || 1;
        this.totalLine = params.totalLine || d.totalLine || 1;
        this.interval = params.interval || d.interval || 0;
        this._nextAnim = this.interval;
        this.animated =
            params.animated !== undefined
                ? params.animated
                : d.animated || this.animated;
        this.isPaused =
            params.paused !== undefined
                ? params.paused
                : params.isPaused || this.isPaused;
        this.reversed =
            params.reversed != undefined
                ? params.reversed
                : d.reversed || this.reversed;
        this.pingPongMode =
            params.pingPongMode !== undefined
                ? params.pingPongMode
                : d.pingPongMode || this.pingPongMode;
        this.isOver = 0;
        this.loop = params.loop != undefined ? params.loop : d.loop || this.loop;
        this.baseTexture = SpriteRenderer._getTexture(this.spriteName).baseTexture;
        if (params.normal) {
            this.normalName = params.normal;
            this.baseNormalTexture = SpriteRenderer._getTexture(params.normal).baseTexture;
        }
        if (this.baseTexture) {
            this.fw = (this.baseTexture.width / this.totalFrame) >> 0;
            this.fh = (this.baseTexture.height / this.totalLine) >> 0;
            const size = new PIXI.Rectangle(this._currentFrame * this.fw, this._currentLine * this.fh, this.fw, this.fh);
            this.texture = new PIXI.Texture(this.baseTexture, size, size.clone(), undefined, undefined);
        }
        this._originalTexture = this.texture;
        if (this.baseNormalTexture) {
            const normsize = new PIXI.Rectangle(this._currentFrame * this.fw, this._currentLine * this.fh, this.fw, this.fh);
            this.normalTexture = new PIXI.Texture(this.baseNormalTexture, normsize, normsize.clone(), undefined, undefined);
        }
        this.setTint(params.tint || 0xffffff);
        if (params.filters) {
            this.filters = params.filters;
        }
        if (params.hue) {
            if (params.hue instanceof Object) {
                if (params.hue instanceof Array && params.hue.length) {
                    this.setHue(params.hue[0], params.hue[1]);
                }
                else if (!(params.hue instanceof Array)) {
                    this.setHue(params.hue.value, params.hue.multiply);
                }
            }
            else {
                this.setHue(params.hue, false);
            }
        }
        if (params.saturation) {
            if (params.saturation instanceof Object) {
                if (params.saturation instanceof Array && params.saturation.length) {
                    this.setHue(params.saturation[0], params.saturation[1]);
                }
                else if (!(params.saturation instanceof Array)) {
                    this.setHue(params.saturation.value, params.saturation.multiply);
                }
            }
            else {
                this.setHue(params.saturation, false);
            }
        }
        if (params.brightness) {
            if (params.brightness instanceof Object) {
                if (params.brightness instanceof Array && params.brightness.length) {
                    this.setHue(params.brightness[0], params.brightness[1]);
                }
                else if (!(params.brightness instanceof Array)) {
                    this.setHue(params.brightness.value, params.brightness.multiply);
                }
            }
            else {
                this.setHue(params.brightness, false);
            }
        }
        if (params.contrast) {
            if (params.contrast instanceof Object) {
                if (params.contrast instanceof Array && params.contrast.length) {
                    this.setHue(params.contrast[0], params.contrast[1]);
                }
                else if (!(params.contrast instanceof Array)) {
                    this.setHue(params.contrast.value, params.contrast.multiply);
                }
            }
            else {
                this.setHue(params.contrast, false);
            }
        }
        if (params.blackAndWhite) {
            this.setBlackAndWhite(params.blackAndWhite);
        }
        if (params.greyscale) {
            if (params.greyscale instanceof Object) {
                if (params.greyscale instanceof Array && params.greyscale.length) {
                    this.setHue(params.greyscale[0], params.greyscale[1]);
                }
                else if (!(params.greyscale instanceof Array)) {
                    this.setHue(params.greyscale.value, params.greyscale.multiply);
                }
            }
            else {
                this.setHue(params.greyscale, false);
            }
        }
    }
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
exports.default = SpriteRenderer;
SpriteRenderer.DEName = 'SpriteRenderer';
Object.defineProperties(SpriteRenderer.prototype, {
    currentFrame: {
        get: function () {
            return this._currentFrame;
        },
        set: function (frame) {
            if (frame >= this.endFrame) {
                this._currentFrame = this.endFrame;
            }
            else if (frame < this.startFrame) {
                this._currentFrame = this.startFrame;
            }
            else {
                this._currentFrame = frame;
            }
            this._originalTexture.frame.x = this._currentFrame * this.fw;
            this._originalTexture.updateUvs();
            if (this.normalTexture) {
                this.normalTexture.frame.x = this._currentFrame * this.fw;
                this.normalTexture.updateUvs();
            }
        },
    },
    currentLine: {
        get: function () {
            return this._currentLine;
        },
        set: function (line) {
            if (line >= this.endLine) {
                this._currentLine = this.endLine;
            }
            else if (line < this.startLine) {
                this._currentLine = this.startLine;
            }
            else {
                this._currentLine = line;
            }
            this._originalTexture.frame.y = this._currentLine * this.fh;
            this._originalTexture.updateUvs();
            if (this.normalTexture) {
                this.normalTexture.frame.y = this._currentLine * this.fh;
                this.normalTexture.updateUvs();
            }
        },
    },
});
