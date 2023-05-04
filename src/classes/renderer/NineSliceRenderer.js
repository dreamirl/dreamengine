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
 * @constructor NineSliceRenderer
 * @augments PIXI.NineSlicePlane
 * @class draw a scalable frame to the specified dimension by using a repeat pattern with the provided texture<br>
 * see https://pixijs.download/dev/docs/PIXI.NineSlicePlane.html
 * @example var frame = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.NineSliceRenderer( { "textureName": "myImageFrameId", width: 500, height: 300 }, left, top, right, bottom )
 * } );
 */
class NineSliceRenderer extends PIXI.NineSlicePlane {
    constructor(params, left, top, right, bottom) {
        if (!params.spriteName &&
            !params.spriteUrl &&
            !params.textureName &&
            !params.texture) {
            console.error('A NineSliceRenderer need a spriteName, a spriteUrl argument or a texture');
            return;
        }
        super(params.texture
            ? params.texture
            : PIXI.utils.TextureCache[params.spriteName || params.spriteUrl || params.textureName], left, top, right, bottom);
        this.sleep = false;
        this.instantiate(params);
        if (!params.x && !params.y && !params.preventCenter) {
            this.center();
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
exports.default = NineSliceRenderer;
NineSliceRenderer.DEName = 'NineSliceRenderer';
