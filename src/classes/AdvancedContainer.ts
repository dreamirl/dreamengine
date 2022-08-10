import { Container } from 'pixi.js';
import Component from './Component';
import FadeComponent from './components/FadeComponent';
import ScaleComponent from './components/ScaleComponent';
import ShakeComponent from './components/ShakeComponent';
import TimerComponent from './components/TimerComponent';

export default class AdvancedContainer extends Container {
  private _components: Component[] = [];

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

  private _scaleComp?: ScaleComponent = undefined;
  private get scaleComp() {
    if (!this._scaleComp) {
      this._scaleComp = new ScaleComponent(this);
      this.addComponent(this._scaleComp);
    }
    return this._scaleComp;
  }

  private _timerComp?: TimerComponent = undefined;
  private get timerComp() {
    if (!this._timerComp) {
      this._timerComp = new TimerComponent(this);
      this.addComponent(this._timerComp);
    }
    return this._timerComp;
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

  timeout(
    callback: () => void,
    interval: number = 0,
    persistent: boolean = false,
    id?: string,
  ) {
    return this.timerComp.invoke(callback, interval, persistent, id);
  }

  clearTimeout(id: string) {
    this.timerComp.clear(id);
    return this;
  }

  /**
   * quick access to the FadeComponent
   */
  fade(
    from: number = 1,
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fade(from, to, duration, force, callback);
    return this;
  }

  fadeTo(
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fadeTo(to, duration, force, callback);
    return this;
  }

  fadeOut(
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fadeOut(duration, force, callback);
    return this;
  }

  fadeIn(duration: number = 500, force: boolean = true, callback?: () => void) {
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
    duration: number = 500,
    callback = () => {},
  ) {
    this.shakeComp.shake(xRange, yRange, duration, callback);
    return this;
  }

  scaleTo(targetScale: Point2D, duration: number = 500, callback = () => {}) {
    this.scaleComp.scaleTo(targetScale, duration, callback);
    return this;
  }
}
