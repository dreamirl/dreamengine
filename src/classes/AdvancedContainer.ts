import * as PIXI from 'pixi.js';
import Component from './Component';
import GameObject from './GameObject';
import Tween from './Tween';
import FocusComponent, { FocusOption } from './components/FocusComponent';
import ShakeComponent from './components/ShakeComponent';
import TimerComponent from './components/TimerComponent';
import { ContainerExtensions, center, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from './renderer/ContainerExtensions';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';

export default class AdvancedContainer extends PIXI.Container implements ContainerExtensions {
  hueFilter?: ColorMatrixFilter | undefined;
  blackAndWhiteFilter?: ColorMatrixFilter | undefined;
  saturationFilter?: ColorMatrixFilter | undefined;
  brightnessFilter?: ColorMatrixFilter | undefined;
  contrastFilter?: ColorMatrixFilter | undefined;
  grayscaleFilter?: ColorMatrixFilter | undefined;
  sleep: boolean = false;
  anchor?: PIXI.ObservablePoint<any> | undefined;
  preventCenter?: boolean | undefined;
  tint?: number | undefined;
  _originalTexture?: PIXI.Texture<PIXI.Resource> | undefined;


  private _components: Component[] = [];

  private _shakeComp?: ShakeComponent = undefined;
  private get shakeComp() {
    if (!this._shakeComp) {
      this._shakeComp = new ShakeComponent(this);
      this.addComponent(this._shakeComp);
    }
    return this._shakeComp;
  }

  private _timerComp?: TimerComponent = undefined;
  private get timerComp() {
    if (!this._timerComp) {
      this._timerComp = new TimerComponent(this);
      this.addComponent(this._timerComp);
    }
    return this._timerComp;
  }

  protected _focusComp?: FocusComponent = undefined;
  protected get focusComp() {
    if (!this._focusComp) {
      this._focusComp = new FocusComponent(this);
      this.addComponent(this._focusComp);
    }
    return this._focusComp;
  }

  update(time: number) {
    this._components.forEach((c) => {
      c._update(time);
    });
  }

  addComponent(...components: Array<Component>) {
    components.forEach((c) => this.addOneComponent(c));
    return this;
  }
  addOneComponent(component: Component) {
    this._components.push(component);
    return this;
  }

  removeComponent(componentReference: Component) {
    this._components.splice(this._components.indexOf(componentReference), 1);
    return this;
  }

  getComponent(name: string) {
    return this._components.find((v) => v.name === name);
  }

  timeout(callback: () => void, interval = 0, persistent = false, id?: string) {
    return this.timerComp.invoke(callback, interval, persistent, id);
  }

  clearTimeout(id: string) {
    this.timerComp.clear(id);
    return this;
  }

  fadeTo(
    value: number,
    duration: number,
    onComplete: () => void,
    onCompleteParams?: any,
    autostart = true,
    easing: (x: number) => number = Tween.Easing.noEase,
  ) {
    new Tween.Tween(
      this,
      'alpha',
      value,
      duration,
      autostart,
      easing,
    ).setOnComplete(onComplete, onCompleteParams || {});
  }

  fadeOut(
    duration: number,
    onComplete: () => void,
    onCompleteParams?: any,
    autostart = true,
    easing: (x: number) => number = Tween.Easing.noEase,
  ) {
    new Tween.Tween(
      this,
      'alpha',
      0,
      duration,
      autostart,
      easing,
    ).setOnComplete(onComplete, onCompleteParams || {});
  }

  fadeIn(
    duration: number,
    onComplete: () => void,
    onCompleteParams?: any,
    autostart = true,
    easing: (x: number) => number = Tween.Easing.noEase,
  ) {
    new Tween.Tween(
      this,
      'alpha',
      1,
      duration,
      autostart,
      easing,
    ).setOnComplete(onComplete, onCompleteParams || {});
  }

  /**
   * check the documentation on GameObject for all shake features
   * @protected
   * @memberOf GameObject
   */

  shake(
    xRange: number,
    yRange: number,
    duration = 500,
    callback = () => {
      return;
    },
  ) {
    this.shakeComp.shake(xRange, yRange, duration, callback);
    return this;
  }

  scaleTo(
    targetScale: Point2D,
    duration: number,
    onComplete: () => void,
    onCompleteParams?: any,
    autostart = true,
    easing: (x: number) => number = Tween.Easing.noEase,
  ) {
    new Tween.Tween(
      this,
      'scale.x',
      targetScale.x,
      duration,
      autostart,
      easing,
    );
    new Tween.Tween(
      this,
      'scale.y',
      targetScale.y,
      duration,
      autostart,
      easing,
    ).setOnComplete(onComplete, onCompleteParams || {});
  }

  moveTo(
    dest: Point2D,
    duration: number,
    onComplete: () => void,
    onCompleteParams?: any,
    autostart = true,
    forceLocalPos = false,
    easing: (x: number) => number = Tween.Easing.noEase,
  ) {
    if (this.parent && !forceLocalPos) {
      const parentPos = this.parent.getGlobalPosition();
      dest = { x: dest.x - parentPos.x, y: dest.y - parentPos.y };
    }
    new Tween.Tween(this, 'x', dest.x, duration, autostart, easing);
    new Tween.Tween(
      this,
      'y',
      dest.y,
      duration,
      autostart,
      easing,
    ).setOnComplete(onComplete, onCompleteParams || {});
    return this;
  }

  focus(gameObject: GameObject, params: FocusOption) {
    this.focusComp.focus(gameObject, params);
    return this;
  }

  stopFocus() {
    this.focusComp.stopFocus();
    return this;
  }

  setTint(value: number): void{setTint(this, value);}
  setHue(rotation: number, multiply: boolean): void{setHue(this, rotation, multiply);}
  setBlackAndWhite(multiply: boolean): void{setBlackAndWhite(this, multiply);}
  setSaturation(amount: number, multiply: boolean): void{setSaturation(this, amount, multiply);}
  setBrightness(b: number, multiply: boolean): void{setBrightness(this, b, multiply);}
  setContrast(amount: number, multiply: boolean): void{setContrast(this, amount, multiply);}
  setGreyscale(scale: number, multiply: boolean): void{setGreyscale(this, scale, multiply);}
  setSize(width: number, height: number, preventCenter: boolean): void{setSize(this, width, height, preventCenter);}
  setScale(x: number | { x: number; y: number }, y?: number): void{setScale(this, x, y);}
  center(): void{center(this);}
  instantiate(_params: any): void{}
}
