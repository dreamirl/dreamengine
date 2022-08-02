import * as PIXI from 'pixi.js';
import RectRenderer from './renderer/RectRenderer';
import TilingRenderer from './renderer/TilingRenderer';

// update is the one requiring all the features, so prototype is complete
import AdvancedContainer from './AdvancedContainer';
import FocusComponent from './components/FocusComponent';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

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
class Camera extends AdvancedContainer {
  private _hasMoved = false;

  public target;
  private _focusOptions;
  private _focusOffsets = { x: 0, y: 0 };

  public id: string;
  private _scene;
  public background;
  public renderSizes: PIXI.Point;
  public limits;

  /**
   * object used to apply fade transition
   * @protected
   * @memberOf Camera
   * @type {Object}
   */
  private _fadeData = {
    from: 1,
    to: 0,
    duration: 1000,
    done: true,
  };

  /**
   * object used to apply shake
   * @protected
   * @memberOf Camera
   * @type {Object}
   */
  private _shakeData = {
    done: true,
    prevX: 0,
    prevY: 0,
  };

  constructor(x, y, width, height, params) {
    super();

    this.renderSizes = new PIXI.Point(width, height);
    this.pivot.set((x + width / 2) >> 0, (y + height / 2) >> 0);

    this.x = (this.renderSizes.x / 2) >> 0;
    this.y = (this.renderSizes.y / 2) >> 0;

    var _params = params || {};

    this.interactive =
      params.interactive !== undefined ? params.interactive : true;

    this.name = _params.name || '';
    this.id = 'camera_' + Date.now() + '-' + Math.random() * Date.now();
    this._scene = null;
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

    this.scale.set(
      _params.scaleX || _params.scale ? _params.scale.x || _params.scale : 1,
      _params.scaleY || _params.scale ? _params.scale.y || _params.scale : 1,
    );

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

    this._hasMoved = false;

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
    this.addChild(scene);
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
  _pointerHandler(type: string, event) {
    var pos = {
      x: event.data.global.x + (this.pivot.x - this.x),
      y: event.data.global.y + (this.pivot.y - this.y),
    };

    this['_customPointer' + type](pos, event);
  }

  _pointermove(e) {
    this._pointerHandler('Move', e);
  }
  _pointerdown(e) {
    this._pointerHandler('Down', e);
  }
  _pointerup(e) {
    this._pointerHandler('Up', e);
  }
  _pointerover(e) {
    this._pointerHandler('Over', e);
  }
  _pointerout(e) {
    this._pointerHandler('Out', e);
  }
  _pointertap(e) {
    this._pointerHandler('Tap', e);
  }
  _pointerupoutside(e) {
    this._pointerHandler('UpOutside', e);
  }

  /**
   * your custom method for handling pointer events is _customPointerEventType (where EventType is the Move/Down etc.)
   * you can directly override these functions or just set via "pointerevent" (the setter will do it correctly for you).
   * @private
   * @memberOf Camera
   */
  private _customPointerMove = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerDown = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerUp = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerOver = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerOut = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerTap = function (pos, event) {};
  /**
   * @private
   * @memberOf Camera
   */
  private _customPointerUpOutside = function (pos, event) {};

  /**
   * this update the lifecycle of the camera, binded on rendering because if a Camera is "off" it doesn't need to be updated
   * @memberOf Camera
   * @protected
   */
  update(time: number) {
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
  checkLimits(qualityRatio: number = 1) {
    var limits = this.limits;
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

  focus = FocusComponent.prototype.focus;

  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  applyFocus() {
    if (!this.target) {
      return;
    }

    var pos = this.target.getWorldPos();
    if (this._focusOptions.x) {
      const deltaX = this.pivot.x - (pos.x + this._focusOffsets.x);
      this.x = this.pivot.x + deltaX;
    }
    if (this._focusOptions.y) {
      const deltaY = this.pivot.y - (pos.y + this._focusOffsets.y);
      this.y = this.pivot.y + deltaY;
    }
    if (this._focusOptions.rotation) {
      this.rotation = -this.target.rotation;
    }
  }

  // name registered in engine declaration
  static DEName = 'Camera';
}

export default Camera;
