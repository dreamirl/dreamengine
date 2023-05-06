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
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = __importStar(require("pixi.js"));
require("../renderer/ContainerExtensions");
const ContainerExtensions_1 = require("../renderer/ContainerExtensions");
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor RectRenderer
 * @augments PIXI.Graphics
 * @class draw a simple rectangle
 * checkout Renderer for standard parameters
 * @example var rectangle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.RectRenderer( 50, 70, "red", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false } )
 * } );
 */
class RectRenderer extends PIXI.Graphics {
    constructor(width, height, color, params = {}) {
        super();
        this.sleep = false;
        const _params = params;
        _params.width = width;
        _params.height = height;
        _params.color = color;
        /**
         * save last parameters
         * @memberOf RectRenderer
         * @private
         */
        this._initial = {
            width: _params.width,
            height: _params.height,
            fill: _params.fill,
            color: _params.color,
            lineStyle: _params.lineStyle,
        };
        this.updateRender(_params);
        delete _params.lineStyle;
        delete _params.fill;
        this.instantiate(params);
    }
    updateRender(params) {
        this.clear();
        if (params && (params.lineStyle || this._initial.lineStyle)) {
            if (params.lineStyle !== undefined) {
                this.lineStyle.apply(this, params.lineStyle); // 4, 0xFF3300, 1);
            }
            else if (this._initial.lineStyle !== undefined) {
                this.lineStyle.apply(this, this._initial.lineStyle); // 4, 0xFF3300, 1);
            }
        }
        if (!params ||
            params.fill !== false ||
            (params.fill === undefined && this._initial.fill !== false)) {
            this.beginFill(params.color || this._initial.color || 0xff3300);
        }
        this.drawRect(0, 0, params.width || this._initial.width || 0, params.height || this._initial.height || 0);
        this.endFill();
        this._initial = {
            width: params.width || this._initial.width,
            height: params.height || this._initial.height,
            fill: params.fill || this._initial.fill,
            color: params.color || this._initial.color,
            lineStyle: params.lineStyle || this._initial.lineStyle,
        };
        return this;
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
exports.default = RectRenderer;
RectRenderer.DEName = 'RectRenderer';
