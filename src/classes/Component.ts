import AdvancedContainer from './AdvancedContainer';

export default class Component {
  private _enable = false;
  protected _name = 'Component';

  constructor(public readonly parent: AdvancedContainer) {}

  _update(time: number) {
    if (this.enable === false) {
      return;
    }
    this.update(time);
  }

  protected update(time: number) {}

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

  private _onEnable = () => {};
  public get onEnable() {
    return this._onEnable;
  }
  public set onEnable(callback: () => void) {
    this._onEnable = callback;
  }

  private _onDisable = () => {};
  public get onDisable() {
    return this._onDisable;
  }
  public set onDisable(callback: () => void) {
    this._onDisable = callback;
  }

  private _onDestroy = () => {};
  public get onDestroy() {
    return this._onDestroy;
  }
  public set onDestroy(callback: () => void) {
    this._onDestroy = callback;
  }
}
