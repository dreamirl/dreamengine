import { Container } from 'pixi.js';
import Component from './Component';
import GameObject from './GameObject';
import FadeComponent from './components/FadeComponent';
import FocusComponent, { FocusOption } from './components/FocusComponent';
import ScaleComponent from './components/ScaleComponent';
import ShakeComponent from './components/ShakeComponent';
import SimpleMoveComponent from './components/SimpleMoveComponent';
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

  protected _moveComp?: SimpleMoveComponent = undefined;
  protected get moveComp() {
    if (!this._moveComp) {
      this._moveComp = new SimpleMoveComponent(this);
      this.addComponent(this._moveComp);
    }
    return this._moveComp;
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
  override fade(
    from: number = 1,
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fade(from, to, duration, force, callback);
    return this;
  }

  override fadeTo(
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fadeTo(to, duration, force, callback);
    return this;
  }

  override fadeOut(
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    this.fadeComp.fadeOut(duration, force, callback);
    return this;
  }

  override fadeIn(
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
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

  override scaleTo(
    targetScale: Point2D,
    duration: number = 500,
    callback = () => {},
  ) {
    this.scaleComp.scaleTo(targetScale, duration, callback);
    return this;
  }

  moveTo(
    pos: Point2D | GameObject,
    duration: number,
    callback = () => {},
    curveName?: string,
    forceLocalPos?: boolean, // TODO add curveName (not coded) && mettre en place un deplacement local
  ) {
    if (pos.x == undefined) pos.x = this.x;
    if (pos.y == undefined) pos.y = this.y;
    this.moveComp.moveTo(pos, duration, callback, curveName);
    return this;
  }

  moveToObject(
    gameObject: GameObject,
    duration: number = 500,
    callback?: () => void,
    curveName?: string,
  ) {
    this.moveComp.moveToObject(gameObject, duration, callback, curveName);
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
}
