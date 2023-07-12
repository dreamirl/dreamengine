import * as PIXI from 'pixi.js';
import Component from './Component';
import GameObject from './GameObject';
import FocusComponent, { FocusOption } from './components/FocusComponent';
import { ContainerExtensions } from './renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
export default class AdvancedContainer extends PIXI.Container implements ContainerExtensions {
    hueFilter?: ColorMatrixFilter | undefined;
    blackAndWhiteFilter?: ColorMatrixFilter | undefined;
    saturationFilter?: ColorMatrixFilter | undefined;
    brightnessFilter?: ColorMatrixFilter | undefined;
    contrastFilter?: ColorMatrixFilter | undefined;
    grayscaleFilter?: ColorMatrixFilter | undefined;
    sleep: boolean;
    anchor?: PIXI.ObservablePoint<any> | undefined;
    preventCenter?: boolean | undefined;
    tint?: number | undefined;
    _originalTexture?: PIXI.Texture<PIXI.Resource> | undefined;
    private _components;
    private _shakeComp?;
    private get shakeComp();
    private _timerComp?;
    private get timerComp();
    protected _focusComp?: FocusComponent;
    protected get focusComp(): FocusComponent;
    update(time: number): void;
    addComponent(...components: Array<Component>): this;
    addOneComponent(component: Component): this;
    removeComponent(componentReference: Component): this;
    getComponent(name: string): Component | undefined;
    timeout(callback: () => void, interval?: number, persistent?: boolean): number;
    clearTimeout(id: number): this;
    fadeTo(value: number, duration: number, onComplete: () => void, onCompleteParams?: any, autostart?: boolean, easing?: (x: number) => number): void;
    fadeOut(duration: number, onComplete: () => void, onCompleteParams?: any, autostart?: boolean, easing?: (x: number) => number): void;
    fadeIn(duration: number, onComplete: () => void, onCompleteParams?: any, autostart?: boolean, easing?: (x: number) => number): void;
    /**
     * check the documentation on GameObject for all shake features
     * @protected
     * @memberOf GameObject
     */
    shake(xRange: number, yRange: number, duration?: number, callback?: () => void): this;
    scaleTo(targetScale: Point2D, duration: number, onComplete: () => void, onCompleteParams?: any, autostart?: boolean, easing?: (x: number) => number): void;
    moveTo(dest: Point2D, duration: number, onComplete: () => void, onCompleteParams?: any, autostart?: boolean, forceLocalPos?: boolean, easing?: (x: number) => number): this;
    focus(gameObject: GameObject, params: FocusOption): this;
    stopFocus(): this;
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
    instantiate(_params: any): void;
}
