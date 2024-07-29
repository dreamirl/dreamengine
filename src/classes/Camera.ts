import * as PIXI from 'pixi.js';
import Scene from './Scene';
import RectRenderer from './renderer/RectRenderer';
import TilingRenderer from './renderer/TilingRenderer';

// update is the one requiring all the features, so prototype is complete
import AdvancedContainer from './AdvancedContainer';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

type CameraParams = {
  interactive?: boolean;
  name?: string;
  backgroundImage?: string;
  backgroundColor?: number;
  scale?: Point2D | number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  scene: Scene;
};

/**
 * @constructor Camera
 * @class a Camera will render a Scene<br>
 * This class is optional but provide some cool stuff.<br>
 * With a Camera you can easily make translation in your Scene or GameObjects focuses, without changing every GameObjects positions (which is painful for logic)<br>
 * You have to append the Camera to a Render and have to give it a scene to look at<br>
 * You can move your camera inside a render as you want<br>
 * Also you can make more than one camera in a Render or looking in a scene, this can be used to create split-screen games<br>
 * For this last features you have to use a mask filter, remember this is a heavy operation and can drop your performances<br>
 * <br><br>
 * example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2)
 * and maybe override the render method to call custom rendering for mini-map<br>
 * then you got two camera, these two are looking at the same scene, and are in the same Render
 * your "mini-map" camera is over the first camera
 * <br><br>
 * example2: on a split-screen local multi-player game, you can make one camera by player, with input for each cameras
 * @example Game.camera = new DE.Camera( 1920, 1080, 0, 0, { "name": "mainGame", "backgroundColor": "green" } );
 * @param {Int} width initial width inside the render
 * @param {Int} height initial height inside the render
 * @param {Int} x position in the Render
 * @param {Int} y position in the Render
 * @param {Object} [params] optional parameters
 * @property {String} [name="noname"] name your camera
 * @property {String} [tag="none"] assign tags if it's can be useful for you
 * @property {Scene} [scene=null] you can give a scene on creation, or later
 **/
export default class Camera extends AdvancedContainer {
  public id: string;
  private _scene?: Scene;
  public background;
  public renderSizes: PIXI.Point;
  public limits;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    params: CameraParams,
  ) {
    super();

    this.renderSizes = new PIXI.Point(width, height);
    this.pivot.set((x + width / 2) >> 0, (y + height / 2) >> 0);

    this.x = (this.renderSizes.x / 2) >> 0;
    this.y = (this.renderSizes.y / 2) >> 0;

    const _params = params || {};

    this.interactive =
      params.interactive !== undefined ? params.interactive : true;

    this.name = _params.name || '';
    this.id = 'camera_' + Date.now() + '-' + Math.random() * Date.now();
    this._scene = undefined;
    // this._gui   = _params.gui || undefined;

    if (_params.backgroundImage) {
      this.background = new TilingRenderer({
        backgroundImage: _params.backgroundImage,
        width: width,
        height: height,
      });
      this.background.interactive = false;
      this.background.anchor.set(-0.5);
      this.addChild(this.background);
    } else if (_params.backgroundColor) {
      this.background = new RectRenderer(
        width,
        height,
        _params.backgroundColor,
      );
      this.addChild(this.background);
    }

    if (_params.scale == undefined) this.scale.set(1);
    else if (typeof _params.scale == 'number') this.scale.set(_params.scale);
    else this.scale.set(_params.scale.x, _params.scale.y);

    /**
     * allow to set limits on the Camera, useful to block the camera when it reach the end of level scroll
     * @public
     * @memberOf Camera
     */
    this.limits = {
      minX: _params.minX != undefined ? _params.minX : undefined,
      maxX: _params.maxX != undefined ? _params.maxX : undefined,
      minY: _params.minY != undefined ? _params.minY : undefined,
      maxY: _params.maxY != undefined ? _params.maxY : undefined,
    };

    if (_params.scene) {
      this.scene = _params.scene;
    }
  }

  /**
   * easy way to shutdown a camera rendering
   * NB: shutdown a camera wont prevent scene to update, set your scene to enable = false if you want to kill it too
   * @public
   * @memberOf Camera
   * @type {Boolean}
   */
  public get enable() {
    return this.renderable && this.visible;
  }
  public set enable(bool: boolean) {
    this.visible = bool;
    this.renderable = bool;
  }

  /**
   * Camera is rendering this scene
   * @public
   * @memberOf Camera
   */
  public get scene() {
    return this._scene;
  }
  public set scene(scene) {
    if (this._scene) {
      this.removeChild(this._scene);
    }

    this._scene = scene;
    this.addChild(scene!);
  }

  /**
   * override the PIXI pointer event to add the "local" camera position in 2nd argument
   * you get/set this method as usual, nothing change
   * WARN: the engine give pos in first argument, and original event in second (not like PIXI)
   * @override
   * @public
   * @memberOf Camera
   */
  public get pointermove() {
    return this._pointermove;
  }
  public set pointermove(fn) {
    this._customPointerMove = fn;
  }
  public get pointerdown() {
    return this._pointerdown;
  }
  public set pointerdown(fn) {
    this._customPointerDown = fn;
  }

  public get pointerup() {
    return this._pointerup;
  }
  public set pointerup(fn) {
    this._customPointerUp = fn;
  }

  public get pointerover() {
    return this._pointerover;
  }
  public set pointerover(fn) {
    this._customPointerOver = fn;
  }

  public get pointerout() {
    return this._pointerout;
  }
  public set pointerout(fn) {
    this._customPointerOut = fn;
  }

  public get pointertap() {
    return this._pointertap;
  }
  public set pointertap(fn) {
    this._customPointerTap = fn;
  }

  public get pointerupoutside() {
    return this._pointerupoutside;
  }
  public set pointerupoutside(fn) {
    this._customPointerUpOutside = fn;
  }

  // support trigger not anymore
  // trigger = Camera.prototype.emit;

  /**
   * handle pointerevents before calling your custom function
   * this method add an argument "pos" which is the pointer event position + local camera position (to retrieve the true position of the event)
   * @private
   * @memberOf Camera
   */
  _pointerHandler(
    type:
      | '_customPointerMove'
      | '_customPointerDown'
      | '_customPointerUp'
      | '_customPointerOver'
      | '_customPointerOut'
      | '_customPointerTap'
      | '_customPointerUpOutside',
    event: PIXI.InteractionEvent,
  ) {
    const pos = {
      x: event.data.global.x + (this.pivot.x - this.x),
      y: event.data.global.y + (this.pivot.y - this.y),
    };

    this[type](pos, event);
  }

  _pointermove(e: any) {
    this._pointerHandler('_customPointerMove', e);
  }
  _pointerdown(e: any) {
    this._pointerHandler('_customPointerDown', e);
  }
  _pointerup(e: any) {
    this._pointerHandler('_customPointerUp', e);
  }
  _pointerover(e: any) {
    this._pointerHandler('_customPointerOver', e);
  }
  _pointerout(e: any) {
    this._pointerHandler('_customPointerOut', e);
  }
  _pointertap(e: any) {
    this._pointerHandler('_customPointerTap', e);
  }
  _pointerupoutside(e: any) {
    this._pointerHandler('_customPointerUpOutside', e);
  }

  /**
   * your custom method for handling pointer events is _customPointerEventType (where EventType is the Move/Down etc.)
   * you can directly override these functions or just set via "pointerevent" (the setter will do it correctly for you).
   * @private
   * @memberOf Camera
   */
  private _customPointerMove = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerDown = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerUp = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerOver = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerOut = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerTap = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerUpOutside = function (
    _pos: Point2D,
    _event: PIXI.InteractionEvent,
  ) {};

  /**
   * this update the lifecycle of the camera, binded on rendering because if a Camera is "off" it doesn't need to be updated
   * @memberOf Camera
   * @protected
   */
  override update(time: number) {
    super.update(time);

    // TODO: It works as it is but it was used with the quality ratio (not reimplemented atm)
    this.checkLimits(1);

    if (this.background) {
      this.background.x = -this.x;
      this.background.y = -this.y;
    }
  }

  /**
   * Check camera limits fixed by limits object you set in camera previously.
   * It's useful to setup a world limits, or in a plate-former limit the Y axis (then your camera will stop at the floor, for example)
   * @protected
   * @memberOf Camera
   */
  checkLimits(qualityRatio = 1) {
    const limits = this.limits;
    if (limits.minX != undefined && this.x < limits.minX * qualityRatio) {
      this.x = limits.minX * qualityRatio;
    } else if (
      limits.maxX != undefined &&
      this.x + this.renderSizes.x > limits.maxX * qualityRatio * this.scale.x
    ) {
      this.x = limits.maxX * qualityRatio * this.scale.x - this.renderSizes.x;
    }

    if (limits.minY != undefined && this.y < limits.minY * qualityRatio) {
      this.y = limits.minY * qualityRatio;
    } else if (
      limits.maxY != undefined &&
      this.y + this.renderSizes.y > limits.maxY * qualityRatio * this.scale.y
    ) {
      this.y = limits.maxY * qualityRatio * this.scale.y - this.renderSizes.y;
    }
  }

  // name registered in engine declaration
  static DEName = 'Camera';
}
