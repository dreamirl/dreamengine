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
 * @constructor TextRenderer
 * @augments PIXI.Text
 * @class draw text<br>
 * this just instantiate a PIXI.Text with a PIXI.TextStyle, but it give to "BaseRenderer" the rest of params, so you can easily set position, scaling, rotation, etc, directly on declaration<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var helloWorld = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TextRenderer( "Hello World", {
 *     rotation: Math.PI, x: 100, interactive: true,
 *     textStyle: { fontFamily: "cordova", fontSize: 12, fill: "white" }
 *   } )
 * } );

 * if you use "Localizations" you should give "localizationKey" instead of the text value
 * by doing this, the text will be automatically updated when the lang change if the Renderer exist in a scene (active or not)
 * you can use the locales with one . to go deeper (but only one)
 * => intro.title will do Localization.get( "intro" ).title
 */
class TextRenderer extends PIXI.Text {
    constructor(text, params = {}) {
        super(text, new PIXI.TextStyle(params.textStyle));
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
            this.text = Localization_1.default.get(this.localizationKey);
            delete _params.localizationKey;
        }
        else if (Localization_1.default.get(text) !== text) {
            this.localizationKey = text;
            this.text = Localization_1.default.get(this.localizationKey);
        }
        delete _params.textStyle;
        this.maxWidth = _params.maxWidth;
        this.checkMaxWidth();
        this.maxHeight = _params.maxHeight;
        this.checkMaxHeight();
    }
    checkMaxWidth() {
        if (this.maxWidth) {
            const textMetrics = PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.style));
            if (textMetrics.width > this.maxWidth) {
                this.setScale(this.maxWidth / textMetrics.width);
            }
            else {
                this.setScale(1);
            }
        }
    }
    getWidth() {
        const textMetrics = PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.style));
        return textMetrics.width;
    }
    getHeight() {
        const textMetrics = PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.style));
        return textMetrics.height;
    }
    getSize() {
        const textMetrics = PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.style));
        return textMetrics;
    }
    checkMaxHeight() {
        if (this.maxHeight) {
            const textMetrics = PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.style));
            if (textMetrics.height > this.maxHeight) {
                this.setScale(this.maxHeight / textMetrics.height);
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
exports.default = TextRenderer;
TextRenderer.DEName = 'TextRenderer';
