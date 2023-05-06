import * as PIXI from 'pixi.js';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
export {};
export interface ContainerExtensions {
    hueFilter?: ColorMatrixFilter;
    blackAndWhiteFilter?: ColorMatrixFilter;
    saturationFilter?: ColorMatrixFilter;
    brightnessFilter?: ColorMatrixFilter;
    contrastFilter?: ColorMatrixFilter;
    grayscaleFilter?: ColorMatrixFilter;
    sleep: boolean;
    anchor?: PIXI.ObservablePoint;
    preventCenter?: boolean;
    tint?: number;
    _originalTexture?: PIXI.Texture<PIXI.Resource>;
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
}
export declare const instantiate: (target: any, params: any) => void;
export declare const setScale: (target: PIXI.Container & ContainerExtensions, x: number | {
    x: number;
    y: number;
}, y?: number) => void;
export declare const setTint: (target: PIXI.Container & ContainerExtensions, value: number) => void;
export declare const setHue: (target: PIXI.Container & ContainerExtensions, rotation: number, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setBlackAndWhite: (target: PIXI.Container & ContainerExtensions, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setSaturation: (target: PIXI.Container & ContainerExtensions, amount: number, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setBrightness: (target: PIXI.Container & ContainerExtensions, b: number, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setContrast: (target: PIXI.Container & ContainerExtensions, amount: number, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setGreyscale: (target: PIXI.Container & ContainerExtensions, scale: number, multiply: boolean) => PIXI.Container<PIXI.DisplayObject> & ContainerExtensions;
export declare const setSize: (target: PIXI.Container & ContainerExtensions, width: number, height: number, preventCenter: boolean) => void;
export declare const center: (target: PIXI.Container & ContainerExtensions) => void;
