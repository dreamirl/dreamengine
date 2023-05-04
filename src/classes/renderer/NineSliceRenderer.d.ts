import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
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
export default class NineSliceRenderer extends PIXI.NineSlicePlane implements RendererInterface, ContainerExtensions {
    constructor(params: {
        texture?: PIXI.Texture<PIXI.Resource>;
        spriteName?: string;
        spriteUrl?: string;
        textureName?: string;
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
        x?: number;
        y?: number;
        preventCenter?: boolean;
    } & Partial<Omit<PIXI.NineSlicePlane, 'scale'>> & Partial<RendererInterface>, left?: number, top?: number, right?: number, bottom?: number);
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
