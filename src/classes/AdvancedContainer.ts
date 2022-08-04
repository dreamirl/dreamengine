import { Container } from 'pixi.js';
import Component from './Component';
import FadeComponent from './components/FadeComponent';
import ScaleComponent from './components/ScaleComponent';
import ShakeComponent from './components/ShakeComponent';
import TimerComponent from './components/TimerComponent';

export default class AdvancedContainer extends Container {
  private components: Component[] = [];
  private shakeComp?: ShakeComponent = undefined;
  private fadeComp?: FadeComponent = undefined;
  private scaleComp?: ScaleComponent = undefined;
  private timerComp?: TimerComponent = undefined;

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
    return this.components.find((v) => v.name === name);
  }

  timeout(
    callback: () => void,
    interval?: number,
    persistent?: boolean,
    id?: string,
  ) {
    if (!this.timerComp) {
      this.timerComp = new TimerComponent(this);
      this.addComponent(this.timerComp);
    }
    this.timerComp.invoke(callback, interval, persistent, id);
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
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.addComponent(this.fadeComp);
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
      this.addComponent(this.fadeComp);
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
      this.addComponent(this.fadeComp);
    }
    this.fadeComp.fadeOut(duration, force, callback);
  }

  fadeIn(duration: number = 500, force: boolean = true, callback?: () => void) {
    if (!this.fadeComp) {
      this.fadeComp = new FadeComponent(this);
      this.addComponent(this.fadeComp);
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
      this.addComponent(this.shakeComp);
    }
    this.shakeComp.shake(xRange, yRange, duration, callback);
  }

  scaleTo(targetScale: Point2D, duration: number = 500, callback = () => {}) {
    if (!this.scaleComp) {
      this.scaleComp = new ScaleComponent(this);
      this.addComponent(this.scaleComp);
    }
    this.scaleComp.scaleTo(targetScale, duration, callback);
  }
}
