import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor TilingRenderer
 * @augments PIXI.TilingSprite
 * @class draw a sprite repeated as a Tile<br>
 * it works with any texture loaded in PIXI.utils.TextureCache (included json sheets)<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var background = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TilingRenderer( { "backgroundImage": "mountains_repeat", width: 2000 } )
 * } );
 */
export default class TilingRenderer extends PIXI.TilingSprite implements RendererInterface, ContainerExtensions {
    constructor(params: {
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
        backgroundImage?: string;
        width?: number;
        height?: number;
        spriteName?: string;
        spriteUrl?: string;
        textureName?: string;
    } & Partial<Omit<PIXI.TilingSprite, 'scale'>> & Partial<RendererInterface>);
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
