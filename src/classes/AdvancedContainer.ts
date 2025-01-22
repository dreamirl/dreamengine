import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import Component from './Component';
import GameObject from './GameObject';
import Tween from './Tween';
import FadeComponent from './components/FadeComponent';
import FocusComponent, { FocusOption } from './components/FocusComponent';
import ShakeComponent from './components/ShakeComponent';
import TimerComponent from './components/TimerComponent';
import { ContainerExtensions, center, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from './renderer/ContainerExtensions';

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

  override destroy(params: any = {}) {

    while (this._components.length > 0) {
      let comp = this._components[0];
      this.removeComponent(comp, true);
    }
    this._shakeComp = undefined;
    this._fadeComp = undefined;
    this._timerComp = undefined;
    this._focusComp = undefined;

    super.destroy(params);
  }

  private _shakeComp?: ShakeComponent = undefined;
  private get shakeComp() {
    if (!this._shakeComp) {
      this._shakeComp = new ShakeComponent(this);
      this.addComponent(this._shakeComp);
    }
    return this._shakeComp;
  }

  private _fadeComp?: FadeComponent = undefined;
  private get fadeComp() {
    if (!this._fadeComp) {
      this._fadeComp = new FadeComponent(this);
      this.addComponent(this._fadeComp);
    }
    return this._fadeComp;
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
    const index = this._components.indexOf(component);
    if (index !== -1) {
      console.warn('You are adding the same component twice in an AdvancedContainer (GameObject), you should not do that.');
      return;
    }

    this._components.push(component);
    return this;
  }

  removeComponent(componentReference: Component, destroy: boolean = true) {
    const index = this._components.indexOf(componentReference);

    if (destroy) {
      componentReference.destroy(false);
    }
    
    if (index !== -1) {
      this._components.splice(index, 1);
    }

    return this;
  }

  getComponent(name: string) {
    return this._components.find((v) => v.name === name);
  }

  timeout(callback: () => void, interval = 0, persistent = false, id: number | undefined = undefined) {
    return this.timerComp.invoke(callback, interval, persistent, id);
  }

  clearTimeout(id: number) {
    this.timerComp.clear(id);
    return this;
  }

  clearAllTimeout(){
    this.timerComp.clearAll();
    return this;
  }

  /**
   * quick access to the FadeComponent
   */
  fade(
    from: number = 1,
    to: number = 0,
    duration: number = 500,
    callback?: () => void,
    force: boolean = true,
  ) {
    this.fadeComp.fade(from, to, duration, force, callback);
    return this;
  }

  fadeTo(
    to: number = 0,
    duration: number = 500,
    callback?: () => void,
    force: boolean = true,
  ) {
    this.fadeComp.fadeTo(to, duration, force, callback);
    return this;
  }

  fadeOut(
    duration: number = 500,
    callback?: () => void,
    force: boolean = true,
  ) {
    this.fadeComp.fadeOut(duration, force, callback);
    return this;
  }

  fadeIn(duration: number = 500, callback?: () => void, force: boolean = true) {
    this.fadeComp.fadeIn(duration, force, callback);
    return this;
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
    return [
      new Tween.Tween(
        this,
        'scale.x',
        targetScale.x,
        duration,
        autostart,
        easing,
      ),
      new Tween.Tween(
        this,
        'scale.y',
        targetScale.y,
        duration,
        autostart,
        easing,
      ).setOnComplete(onComplete, onCompleteParams || {})
    ];
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
