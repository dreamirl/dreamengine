import AdvancedContainer from './AdvancedContainer';
import * as PIXI from 'pixi.js';

export default class Component {
  private _enable = true;
  protected _name = 'Component';

  constructor(public readonly parent: AdvancedContainer) {}

  public destroy() {
    if (this.parent) {
      this.parent.removeComponent(this);
    }
    this._onDestroy();
    this._emitter.removeAllListeners();
  }

  _update(time: number) {
    if (this.enable === false) {
      return;
    }
    this.update(time);
  }

  protected update(_time: number) {}

  public get name() {
    return this._name;
  }

  public get enable() {
    return this._enable;
  }

  public set enable(bool: boolean) {
    this._enable = bool;
    if (bool) this.onEnable();
    else this.onDisable();
  }

  public destroy() {
    this.parent.removeComponent(this);
    this._onDestroy();
  }

  protected _onEnable = () => {};
  public get onEnable() {
    return this._onEnable;
  }
  public set onEnable(callback: () => void) {
    this._onEnable = callback;
  }

  protected _onDisable = () => {};
  public get onDisable() {
    return this._onDisable;
  }
  public set onDisable(callback: () => void) {
    this._onDisable = callback;
  }

  protected _onDestroy = () => {};
  public get onDestroy() {
    return this._onDestroy;
  }
  public set onDestroy(callback: () => void) {
    this._onDestroy = callback;
  }

  private _emitter = new PIXI.utils.EventEmitter();
  public get emitter(){
    return this._emitter;
  }
}
