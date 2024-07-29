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
const config_1 = __importDefault(require("../../config"));
const Localization_1 = __importDefault(require("../../utils/Localization"));
require("../renderer/ContainerExtensions");
const ContainerExtensions_1 = require("../renderer/ContainerExtensions");
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor BitmapTextRenderer
 * @augments PIXI.BitmapText
 * @class draw a bitmap text<br>
 * this just instantiate a PIXI.BitmapText, but it give to "BaseRenderer" the rest of params, so you can easily set position, scaling, rotation, etc, directly on declaration<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var helloWorld = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.BitmapTextRenderer( "Hello World", {
 *     rotation: Math.PI, x: 100, interactive: true,
 *     textStyle: { fontName: "cordova", fontSize: 12, tint: 0xffffff }
 *   } )
 * } );

 * if you use "Localizations" you should give "localizationKey" instead of the text value
 * by doing this, the text will be automatically updated when the lang change if the Renderer exist in a scene (active or not)
 * you can use the locales with one . to go deeper (but only one)
 * => intro.title will do Localization.get( "intro" ).title
 */
class BitmapTextRenderer extends PIXI.BitmapText {
    constructor(text, params = {}) {
        var _a;
        super(text);
        this.sleep = false;
        const _params = params;
        if (!_params.resolution) {
            _params.resolution = config_1.default.DEFAULT_TEXT_RESOLUTION;
        }
        this.instantiate(_params);
        // force string conversion to avoid pure numbers
        text =
            text !== null && text !== undefined && text.toString
                ? text.toString()
                : text;
        if (_params.localizationKey) {
            this.localizationKey = _params.localizationKey;
            text = Localization_1.default.get(this.localizationKey);
            delete _params.localizationKey;
        }
        else if (Localization_1.default.get(text) !== text) {
            this.localizationKey = text;
            text = Localization_1.default.get(this.localizationKey);
        }
        if (params.fontName)
            this.fontName = params.fontName;
        if (!this.fontName) {
            throw new Error('BitmapTextRender :: No fontName defined -- declaration canceled');
        }
        if (!PIXI.BitmapFont.available.hasOwnProperty(this.fontName)) {
            throw new Error('BitmapTextRender :: No fontName with the name "' +
                this.fontName +
                '" found');
        }
        this.fontSize =
            (_a = params.fontSize) !== null && _a !== void 0 ? _a : PIXI.BitmapFont.available[this.fontName].size;
        this.maxWidth = _params.maxWidth ? _params.maxWidth : 0;
        this.checkMaxWidth();
        this.maxHeight = _params.maxHeight ? _params.maxHeight : 0;
        this.checkMaxHeight();
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
    checkMaxWidth() {
        if (this.maxWidth) {
            const textLocalBounds = this.getLocalBounds();
            const scaleOneTextMetrics = {
                width: textLocalBounds.width / this.scale.x,
                height: textLocalBounds.height / this.scale.y,
            };
            if (scaleOneTextMetrics.width > this.maxWidth) {
                this.setScale(this.maxWidth / scaleOneTextMetrics.width);
            }
            else {
                this.setScale(1);
            }
        }
    }
    checkMaxHeight() {
        if (this.maxHeight) {
            const textLocalBounds = this.getLocalBounds();
            const scaleOneTextMetrics = {
                width: textLocalBounds.width / this.scale.x,
                height: textLocalBounds.height / this.scale.y,
            };
            if (scaleOneTextMetrics.height > this.maxHeight) {
                this.setScale(this.maxHeight / scaleOneTextMetrics.height);
            }
            else {
                this.setScale(1);
            }
        }
    }
    getWidth() {
        const textLocalBounds = this.getLocalBounds();
        return textLocalBounds.width;
    }
    getHeight() {
        const textLocalBounds = this.getLocalBounds();
        return textLocalBounds.height;
    }
    getSize() {
        const textLocalBounds = this.getLocalBounds();
        return {
            width: textLocalBounds.width,
            height: textLocalBounds.height,
        };
    }
}
exports.default = BitmapTextRenderer;
BitmapTextRenderer.DEName = 'BitmapTextRenderer';
