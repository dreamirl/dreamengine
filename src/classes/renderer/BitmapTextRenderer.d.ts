import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
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
export default class BitmapTextRenderer extends PIXI.BitmapText implements RendererInterface, ContainerExtensions {
    localizationKey: string | undefined;
    maxHeight: number;
    constructor(text: string, params?: {
        maxHeight?: number;
        maxWidth?: number;
        fontName?: string;
        fontSize?: number;
        localizationKey?: string;
        resolution?: number;
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
    } & Partial<Omit<PIXI.BitmapText, 'scale'>> & Partial<RendererInterface>);
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
    checkMaxWidth(): void;
    checkMaxHeight(): void;
    getWidth(): number;
    getHeight(): number;
    getSize(): {
        width: number;
        height: number;
    };
    static DEName: string;
}
