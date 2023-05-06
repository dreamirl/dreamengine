import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
export declare type SpriteDataType = {
    startFrame: number;
    endFrame: number;
    totalFrame: number;
    endLine: number;
    totalLine: number;
    interval: number;
    animated: boolean;
    reversed: boolean;
    pingPongMode: boolean;
    loop: boolean;
};
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
export default class SpriteRenderer extends PIXI.Sprite implements RendererInterface, ContainerExtensions {
    startFrame: number;
    endFrame: number;
    private _currentFrame;
    startLine: number;
    private _currentLine;
    totalFrame: number;
    totalLine: number;
    interval: number;
    private _nextAnim;
    animated: boolean;
    isPaused: boolean;
    reversed: boolean;
    isOver: number;
    loop: boolean;
    pingPongMode: boolean;
    spriteName?: string;
    isAtlasTexture?: boolean;
    spriteData?: SpriteDataType;
    lastAnim?: number;
    normalTexture?: PIXI.Texture<PIXI.Resource>;
    fw: number;
    fh: number;
    endLine?: number;
    baseTexture?: PIXI.BaseTexture<PIXI.Resource>;
    normalName?: string;
    baseNormalTexture?: PIXI.BaseTexture<PIXI.Resource>;
    constructor(params: Partial<Omit<PIXI.Sprite, 'scale'>> & {
        spriteName?: string | undefined;
        spriteUrl?: string | undefined;
        textureName?: string | undefined;
        spriteData?: SpriteDataType;
        startFrame?: number;
        endFrame?: number;
        currentFrame?: number;
        startLine?: number;
        endLine?: number;
        totalLine?: number;
        interval?: number;
        animated?: boolean;
        paused?: boolean;
        isPaused?: boolean;
        reversed?: boolean;
        pingPongMode?: boolean;
        loop?: boolean;
        normal?: string;
        tint?: number;
        filters?: any;
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
        hue?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        saturation?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        brightness?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        contrast?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        blackAndWhite?: boolean;
        greyscale?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
    } & Partial<RendererInterface>);
    private static _getTexture;
    /**
     * update the animation (called by the GameObject, if you use it an other way you have to call update)
     * @protected
     * @memberOf SpriteRenderer
     */
    update(): void;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setFrame(frame: number): this;
    onAnimEnd(): void;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setLine(line: number): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    restartAnim(): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Boolean}
     */
    setPause(val: boolean): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    setEndFrame(v: number): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int} interval in ms
     */
    setInterval(interval: number): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Boolean}
     */
    setLoop(bool: boolean): this;
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    changeSprite(spriteName: string, params: {
        spriteName?: string | undefined;
        spriteUrl?: string | undefined;
        textureName?: string | undefined;
        spriteData?: SpriteDataType;
        startFrame?: number;
        endFrame?: number;
        currentFrame?: number;
        startLine?: number;
        endLine?: number;
        totalLine?: number;
        interval?: number;
        animated?: boolean;
        paused?: boolean;
        isPaused?: boolean;
        reversed?: boolean;
        pingPongMode?: boolean;
        loop?: boolean;
        normal?: string;
        tint?: number;
        filters?: any;
        hue?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        saturation?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        brightness?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        contrast?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
        blackAndWhite?: boolean;
        greyscale?: number | {
            value: number;
            multiply: boolean;
        } | Array<number & boolean>;
    }): void;
    hueFilter?: ColorMatrixFilter | undefined;
    blackAndWhiteFilter?: ColorMatrixFilter | undefined;
    saturationFilter?: ColorMatrixFilter | undefined;
    brightnessFilter?: ColorMatrixFilter | undefined;
    contrastFilter?: ColorMatrixFilter | undefined;
    grayscaleFilter?: ColorMatrixFilter | undefined;
    sleep: boolean;
    preventCenter?: boolean | undefined;
    _originalTexture?: PIXI.Texture<PIXI.Resource> | undefined;
    setTint(value: number): void;
    setHue(rotation: number, multiply: boolean): void;
    setBlackAndWhite(multiply: boolean): void;
    setSaturation(amount: number, multiply: boolean): void;
    setBrightness(b: number, multiply: boolean): void;
    setContrast(amount: number, multiply: boolean): void;
    setGreyscale(scale: number, multiply: boolean): void;
    setSize(width: number, height: number, preventCenter: boolean): void;
    setScale(x: number | {
        x: number;
        y: number;
    }, y?: number): void;
    center(): void;
    instantiate(params: any): void;
    static DEName: string;
}
