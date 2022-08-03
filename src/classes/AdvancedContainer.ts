import { Container } from 'pixi.js';
import Component from './Component';
import FadeComponent from './components/FadeComponent';
import ShakeComponent from './components/ShakeComponent';

export default class AdvancedContainer extends Container {
  private components: Component[] = [];
  private shakeComp?: ShakeComponent = undefined;
  private fadeComp?: FadeComponent = undefined;

  update(time: number) {
    this.components.forEach((c) => {
      c._update(time);
    });
  }

  addComponent(component: Component) {
    this.components.push(component);
  }

  removeComponent(componentReference: Component) {
    this.components.splice(this.components.indexOf(componentReference), 1);
  }

  getComponent(name: string) {
    const c = this.components.find((v) => v.name === name);
  }

  /**
   * check the documentation on GameObject for all fade features
   * @protected
   * @memberOf GameObject
   */
  fade(
    from: number = 1,
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.components.push(this.fadeComp);
    }
    this.fadeComp.fade(from, to, duration, force, callback);
  }

  fadeTo(
    to: number = 0,
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.components.push(this.fadeComp);
    }
    this.fadeComp.fadeTo(to, duration, force, callback);
  }

  fadeOut(
    duration: number = 500,
    force: boolean = true,
    callback?: () => void,
  ) {
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.components.push(this.fadeComp);
    }
    this.fadeComp.fadeOut(duration, force, callback);
  }

  fadeIn(duration: number = 500, force: boolean = true, callback?: () => void) {
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.components.push(this.fadeComp);
    }
    this.fadeComp.fadeIn(duration, force, callback);
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
    if (!this.shakeComp) {
      this.shakeComp = new ShakeComponent(this);
      this.components.push(this.shakeComp);
    }
    this.shakeComp.shake(xRange, yRange, duration);
  }
}
