import * as PIXI from 'pixi.js';
import '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import { ContainerExtensions } from '../renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
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
export default class TextRenderer extends PIXI.Text implements RendererInterface, ContainerExtensions {
    maxHeight?: number;
    maxWidth?: number;
    localizationKey?: string;
    constructor(text: string, params?: {
        scale?: number | Point2D;
        scaleX?: number;
        scaleY?: number;
        maxHeight?: number;
        maxWidth?: number;
        resolution?: number;
        localizationKey?: string;
        textStyle?: Partial<PIXI.TextStyle>;
    } & Partial<Omit<PIXI.Text, 'scale'>> & Partial<RendererInterface>);
    checkMaxWidth(): void;
    getWidth(): number;
    getHeight(): number;
    getSize(): PIXI.TextMetrics;
    checkMaxHeight(): void;
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
