import * as PIXI from 'pixi.js';
import AdvancedContainer from './AdvancedContainer';

export default class Component {
  private _enable = true;
  protected _name = 'Component';
  protected _parent: AdvancedContainer | undefined;

  constructor(parent: AdvancedContainer) {
    this._parent = parent;
  }

  public get parent() {
    return this._parent;
  }

  public destroy(removeFromParent = true) {
    this.enable = false;

    if (removeFromParent && this._parent && this._parent.removeComponent) {
      this._parent.removeComponent(this);
    }

    this._parent = undefined;
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
  public get emitter() {
    return this._emitter;
  }
}
