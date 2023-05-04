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
const RectRenderer_1 = __importDefault(require("./renderer/RectRenderer"));
const TilingRenderer_1 = __importDefault(require("./renderer/TilingRenderer"));
// update is the one requiring all the features, so prototype is complete
const AdvancedContainer_1 = __importDefault(require("./AdvancedContainer"));
/**
 * @constructor Camera
 * @class a Camera will render a Scene<br>
 * This class is optional but provide some cool stuff.<br>
 * With a Camera you can easily make translation in your Scene or GameObjects focuses, without changing every GameObjects positions (which is painful for logic)<br>
 * You have to append the Camera to a Render and have to give it a scene to look at<br>
 * You can move your camera inside a render as you want<br>
 * Also you can make more than one camera in a Render or looking in a scene, this can be used to create split-screen games<br>
 * For this last features you have to use a mask filter, remember this is a heavy operation and can drop your performances<br>
 * <br><br>
 * example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2)
 * and maybe override the render method to call custom rendering for mini-map<br>
 * then you got two camera, these two are looking at the same scene, and are in the same Render
 * your "mini-map" camera is over the first camera
 * <br><br>
 * example2: on a split-screen local multi-player game, you can make one camera by player, with input for each cameras
 * @example Game.camera = new DE.Camera( 1920, 1080, 0, 0, { "name": "mainGame", "backgroundColor": "green" } );
 * @param {Int} width initial width inside the render
 * @param {Int} height initial height inside the render
 * @param {Int} x position in the Render
 * @param {Int} y position in the Render
 * @param {Object} [params] optional parameters
 * @property {String} [name="noname"] name your camera
 * @property {String} [tag="none"] assign tags if it's can be useful for you
 * @property {Scene} [scene=null] you can give a scene on creation, or later
 **/
class Camera extends AdvancedContainer_1.default {
    constructor(x, y, width, height, params) {
        super();
        /**
         * your custom method for handling pointer events is _customPointerEventType (where EventType is the Move/Down etc.)
         * you can directly override these functions or just set via "pointerevent" (the setter will do it correctly for you).
         * @private
         * @memberOf Camera
         */
        this._customPointerMove = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerDown = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerUp = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerOver = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerOut = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerTap = function (_pos, _event) { };
        /**
         * @private
         * @memberOf Camera
         */
        this._customPointerUpOutside = function (_pos, _event) { };
        this.renderSizes = new PIXI.Point(width, height);
        this.pivot.set((x + width / 2) >> 0, (y + height / 2) >> 0);
        this.x = (this.renderSizes.x / 2) >> 0;
        this.y = (this.renderSizes.y / 2) >> 0;
        const _params = params || {};
        this.interactive =
            params.interactive !== undefined ? params.interactive : true;
        this.name = _params.name || '';
        this.id = 'camera_' + Date.now() + '-' + Math.random() * Date.now();
        this._scene = undefined;
        // this._gui   = _params.gui || undefined;
        if (_params.backgroundImage) {
            this.background = new TilingRenderer_1.default({
                backgroundImage: _params.backgroundImage,
                width: width,
                height: height,
            });
            this.background.interactive = false;
            this.background.anchor.set(-0.5);
            this.addChild(this.background);
        }
        else if (_params.backgroundColor) {
            this.background = new RectRenderer_1.default(width, height, _params.backgroundColor);
            this.addChild(this.background);
        }
        if (_params.scale == undefined)
            this.scale.set(1);
        else if (typeof _params.scale == 'number')
            this.scale.set(_params.scale);
        else
            this.scale.set(_params.scale.x, _params.scale.y);
        /**
         * allow to set limits on the Camera, useful to block the camera when it reach the end of level scroll
         * @public
         * @memberOf Camera
         */
        this.limits = {
            minX: _params.minX != undefined ? _params.minX : undefined,
            maxX: _params.maxX != undefined ? _params.maxX : undefined,
            minY: _params.minY != undefined ? _params.minY : undefined,
            maxY: _params.maxY != undefined ? _params.maxY : undefined,
        };
        if (_params.scene) {
            this.scene = _params.scene;
        }
    }
    /**
     * easy way to shutdown a camera rendering
     * NB: shutdown a camera wont prevent scene to update, set your scene to enable = false if you want to kill it too
     * @public
     * @memberOf Camera
     * @type {Boolean}
     */
    get enable() {
        return this.renderable && this.visible;
    }
    set enable(bool) {
        this.visible = bool;
        this.renderable = bool;
    }
    /**
     * Camera is rendering this scene
     * @public
     * @memberOf Camera
     */
    get scene() {
        return this._scene;
    }
    set scene(scene) {
        if (this._scene) {
            this.removeChild(this._scene);
        }
        this._scene = scene;
        this.addChild(scene);
    }
    /**
     * override the PIXI pointer event to add the "local" camera position in 2nd argument
     * you get/set this method as usual, nothing change
     * WARN: the engine give pos in first argument, and original event in second (not like PIXI)
     * @override
     * @public
     * @memberOf Camera
     */
    get pointermove() {
        return this._pointermove;
    }
    set pointermove(fn) {
        this._customPointerMove = fn;
    }
    get pointerdown() {
        return this._pointerdown;
    }
    set pointerdown(fn) {
        this._customPointerDown = fn;
    }
    get pointerup() {
        return this._pointerup;
    }
    set pointerup(fn) {
        this._customPointerUp = fn;
    }
    get pointerover() {
        return this._pointerover;
    }
    set pointerover(fn) {
        this._customPointerOver = fn;
    }
    get pointerout() {
        return this._pointerout;
    }
    set pointerout(fn) {
        this._customPointerOut = fn;
    }
    get pointertap() {
        return this._pointertap;
    }
    set pointertap(fn) {
        this._customPointerTap = fn;
    }
    get pointerupoutside() {
        return this._pointerupoutside;
    }
    set pointerupoutside(fn) {
        this._customPointerUpOutside = fn;
    }
    // support trigger not anymore
    // trigger = Camera.prototype.emit;
    /**
     * handle pointerevents before calling your custom function
     * this method add an argument "pos" which is the pointer event position + local camera position (to retrieve the true position of the event)
     * @private
     * @memberOf Camera
     */
    _pointerHandler(type, event) {
        const pos = {
            x: event.data.global.x + (this.pivot.x - this.x),
            y: event.data.global.y + (this.pivot.y - this.y),
        };
        this[type](pos, event);
    }
    _pointermove(e) {
        this._pointerHandler('_customPointerMove', e);
    }
    _pointerdown(e) {
        this._pointerHandler('_customPointerDown', e);
    }
    _pointerup(e) {
        this._pointerHandler('_customPointerUp', e);
    }
    _pointerover(e) {
        this._pointerHandler('_customPointerOver', e);
    }
    _pointerout(e) {
        this._pointerHandler('_customPointerOut', e);
    }
    _pointertap(e) {
        this._pointerHandler('_customPointerTap', e);
    }
    _pointerupoutside(e) {
        this._pointerHandler('_customPointerUpOutside', e);
    }
    /**
     * this update the lifecycle of the camera, binded on rendering because if a Camera is "off" it doesn't need to be updated
     * @memberOf Camera
     * @protected
     */
    update(time) {
        super.update(time);
        // TODO: It works as it is but it was used with the quality ratio (not reimplemented atm)
        this.checkLimits(1);
        if (this.background) {
            this.background.x = -this.x;
            this.background.y = -this.y;
        }
    }
    /**
     * Check camera limits fixed by limits object you set in camera previously.
     * It's useful to setup a world limits, or in a plate-former limit the Y axis (then your camera will stop at the floor, for example)
     * @protected
     * @memberOf Camera
     */
    checkLimits(qualityRatio = 1) {
        const limits = this.limits;
        if (limits.minX != undefined && this.x < limits.minX * qualityRatio) {
            this.x = limits.minX * qualityRatio;
        }
        else if (limits.maxX != undefined &&
            this.x + this.renderSizes.x > limits.maxX * qualityRatio * this.scale.x) {
            this.x = limits.maxX * qualityRatio * this.scale.x - this.renderSizes.x;
        }
        if (limits.minY != undefined && this.y < limits.minY * qualityRatio) {
            this.y = limits.minY * qualityRatio;
        }
        else if (limits.maxY != undefined &&
            this.y + this.renderSizes.y > limits.maxY * qualityRatio * this.scale.y) {
            this.y = limits.maxY * qualityRatio * this.scale.y - this.renderSizes.y;
        }
    }
}
exports.default = Camera;
// name registered in engine declaration
Camera.DEName = 'Camera';
