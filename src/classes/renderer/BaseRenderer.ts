import * as PIXI from 'pixi.js';
import Time from '../../utils/Time';
import GameObject from '../GameObject';

export type BaseRendererParams = {
  height?: number;
  width?: number;
  size?: number;
  alpha?: number;
  opacity?: number;
  scale?: { x: number; y: number };
  scaleX?: number;
  scaleY?: number;
};

var _inherits = [
  'setScale',
  'applyFade',
  'fade',
  'fadeIn',
  'fateTo',
  'fadeOut',
  'scaleTo',
  'applyScale',
  'setSize',
  'center',
  'setTint',
  'setHue',
  'setSaturation',
  'setBrightness',
  'setContrast',
  'setGreyscale',
  'setBlackAndWhite',
];
var _attributes = ['fadeData', 'scaleData'];

export default class BaseRenderer extends PIXI.Sprite {
  public fadeData: {
    fadeScale?: number;
    dir?: number;
    stepVal?: number;
    from: number;
    to: number;
    duration: number;
    done: boolean;
  };
  public scaleData: {
    callback?: () => void;
    destY: number;
    destX: number;
    dirY: number;
    scaleY: number;
    leftY: number;
    scaleX: number;
    leftX: number;
    oDuration: number;
    dirX: number;
    fromx: number;
    tox: number;
    fromy: number;
    toy: number;
    duration: number;
    done: boolean;
    valX: number;
    valY: number;
    stepValX: number;
    stepValY: number;
  };

  sleep = false;

  blackAndWhiteFilter: any;
  grayscaleFilter: any;
  contrastFilter: any;
  brightnessFilter: any;
  saturationFilter: any;
  hueFilter: any;

  _originalTexture?: PIXI.Texture<PIXI.Resource>;
  preventCenter?: boolean;
  gameObject?: GameObject;

  constructor() {
    super();
    /**
     * object used to apply fade on final BaseRenderer rendering
     * @protected
     * @memberOf BaseRenderer
     * @type {Object}
     */
    this.fadeData = {
      from: 1,
      to: 0,
      duration: 1000,
      done: true,
    };

    /**
     * object used to apply scale on final Renderer rendering
     * @protected
     * @memberOf Renderer
     * @type {Object}
     */
    this.scaleData = {
      fromx: 1,
      tox: 0,
      fromy: 1,
      toy: 0,
      duration: 1000,
      done: true,
      callback: undefined,
      destX: 0,
      destY: 0,
      dirX: 0,
      dirY: 0,
      leftX: 0,
      leftY: 0,
      oDuration: 0,
      scaleX: 1,
      scaleY: 1,
      stepValX: 0,
      stepValY: 0,
      valX: 0,
      valY: 0,
    };

    //const _ignore = ['scale', 'scaleX', 'scaleY', 'opacity'];
  }

  static instantiate(target: any, params: BaseRendererParams) {
    if (params) {
      target.alpha = params.alpha || params.opacity || 1;
      if (params.scale) {
        params.scale = {
          x: params.scale.x,
          y: params.scale.y,
        };
      } else {
        params.scale = {
          x: params.scaleX ? params.scaleX : 1,
          y: params.scaleY ? params.scaleY : 1,
        };
      }

      if (params.size) {
        params.width = params.size;
        params.height = params.size;
      }
      delete params.scaleY;
      delete params.scaleX;
      delete params.opacity;
      delete params.size;

      for (var [i, value] of Object.entries(params)) {
        if (target[i] && target[i].set) {
          if (
            value instanceof Object &&
            (value.x !== undefined || value.y !== undefined)
          ) {
            target[i].set(value.x || 0, value.y || 0);
          } else {
            target[i].set(value);
          }
        } else {
          target[i] = value;
        }
      }
    }

    for (let i = 0; i < _attributes.length; ++i) {
      target[_attributes[i]] = [_attributes[i]];
    }
  }

  static inherits = function (target: any) {
    for (var i = 0; i < _inherits.length; ++i) {
      target.prototype[_inherits[i]] = [_inherits[i]];
    }
  };

  setScale(x: number | { x: number; y: number }, y?: number) {
    if (y) {
      if (x instanceof Object) {
        this.scale.set(x.x, x.y);
      } else {
        this.scale.set(x, x);
      }
    } else {
      if (!(x instanceof Object)) {
        this.scale.set(x, y);
      }
    }
  }

  /**
   * apply the current fade
   * @protected
   * @memberOf BaseRenderer
   */
  applyFade() {
    if (this.fadeData.done) {
      return;
    }

    if (
      this.fadeData.dir === undefined ||
      this.fadeData.fadeScale === undefined ||
      this.fadeData.stepVal
    ) {
      return;
    }

    this.fadeData.stepVal =
      (Time.frameDelay / this.fadeData.duration) *
      this.fadeData.dir *
      this.fadeData.fadeScale;

    this.alpha += this.fadeData.stepVal * Time.scaleDelta;
    this.fadeData.duration -= Time.frameDelayScaled;

    if (
      (this.fadeData.dir < 0 && this.alpha <= this.fadeData.to) ||
      (this.fadeData.dir > 0 && this.alpha >= this.fadeData.to) ||
      this.alpha < 0 ||
      this.alpha > 1
    ) {
      this.alpha = this.fadeData.to;
    }

    if (this.fadeData.duration <= 0) {
      this.fadeData.done = true;

      if (this.alpha == 1 || this.alpha == 0) {
        if (this.alpha == 0) {
          this.sleep = true;
        }
      }

      if (this.gameObject) {
        this.gameObject.emit('fadeEnd', this);
      }
    }
  }

  /**
   * create a fade from val, to val, with given duration time
   * @public
   * @memberOf BaseRenderer
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fade( 0.5, 1, 850 );
   */
  fade(from: number, to: number, duration: number) {
    this.sleep = false;
    var data = {
      from: from || 1,
      to: to != undefined ? to : 0,
      duration: duration || 500,
      oDuration: duration || 500,
      fadeScale: Math.abs(from - to),
      done: false,
      dir: -1,
    };
    data.dir = data.from > to ? -1 : 1;
    this.alpha = from;
    this.fadeData = data;
  }

  /**
   * create a fade to val, from current alpha value with given duration time
   * @public
   * @memberOf BaseRenderer
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  fadeTo(to: number, duration: number) {
    this.sleep = false;
    this.fade(this.alpha, to, duration);
  }

  /**
   * fade the BaseRenderer to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf BaseRenderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.renderers[ 0 ].fadeOut( 850 );
   */
  fadeOut(duration: number, force: boolean) {
    this.sleep = false;
    if (force) {
      this.alpha = this.alpha > 0 ? this.alpha : 1; // make sure to prevent any blink side effect
    }
    this.fade(this.alpha, 0, duration);
  }

  /**
   * fade the BaseRenderer to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf BaseRenderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0 before fade
   * @example // alpha = 1 in 850ms
   * myObject.renderers[ 0 ].fadeIn( 850 );
   */
  fadeIn(duration: number, force: boolean) {
    this.sleep = false;
    if (force) {
      this.alpha = this.alpha < 1 ? this.alpha : 0; // make sure to prevent any blink side effect
    }
    this.fade(this.alpha, 1, duration);
  }

  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf BaseRenderer
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myRenderer.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  scaleTo(
    duration: number,
    callback: () => void,
    scale: { x: number; y: number } | number,
  ) {
    if (scale instanceof Object) {
      var dscale = {
        x: scale.x,
        y: scale.y,
      };
    } else if (scale !== undefined) {
      var dscale = {
        x: scale,
        y: scale,
      };
    } else {
      var dscale = {
        x: 1,
        y: 1,
      };
    }
    this.scaleData = {
      valX: -(
        this.scale.x - (dscale.x !== undefined ? dscale.x : this.scale.x)
      ),
      valY: -(
        this.scale.y - (dscale.y !== undefined ? dscale.y : this.scale.y)
      ),
      dirX: this.scale.x > dscale.x ? 1 : -1,
      dirY: this.scale.y > dscale.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: dscale.x,
      destY: dscale.y,
      scaleX: this.scale.x,
      scaleY: this.scale.y,
      callback: callback,
      fromx: this.scaleData.fromx,
      fromy: this.scaleData.fromy,
      leftX: this.scaleData.leftX,
      leftY: this.scaleData.leftY,
      tox: this.scaleData.tox,
      toy: this.scaleData.toy,
    };
    this.scaleData.leftX = this.scaleData.valX;
    this.scaleData.leftY = this.scaleData.valY;
  }

  /**
   * apply the current scale
   * @protected
   * @memberOf BaseRenderer
   */
  applyScale() {
    if (this.scaleData.done) {
      return;
    }

    var scaleD = this.scaleData;

    if (scaleD.valX != 0) {
      scaleD.stepValX =
        (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valX;
      scaleD.leftX -= scaleD.stepValX;
      scaleD.scaleX += scaleD.stepValX;
    }

    if (scaleD.valY != 0) {
      scaleD.stepValY =
        (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valY;
      scaleD.leftY -= scaleD.stepValY;
      scaleD.scaleY += scaleD.stepValY;
    }

    scaleD.duration -= Time.frameDelayScaled;

    // check scale
    if (scaleD.dirX < 0 && scaleD.leftX < 0) {
      scaleD.scaleX += scaleD.leftX;
    } else if (scaleD.dirX > 0 && scaleD.leftX > 0) {
      scaleD.scaleX -= scaleD.leftX;
    }

    if (scaleD.dirY < 0 && scaleD.leftY < 0) {
      scaleD.scaleY += scaleD.leftY;
    } else if (scaleD.dirY > 0 && scaleD.leftY > 0) {
      scaleD.scaleY -= scaleD.leftY;
    }

    this.setScale(scaleD.scaleX, scaleD.scaleY);

    if (scaleD.duration <= 0) {
      this.scaleData.done = true;
      this.setScale(scaleD.destX, scaleD.destY);

      if (this.gameObject) {
        this.gameObject.emit('scale-end', this);
      }

      if (this.scaleData.callback) {
        this.scaleData.callback.call(this);
      }
    }
  }
  DEName = 'BaseRenderer';

  /**
   * allow a quick way to change the sizes of a renderer and center it automatically
   * IF this renderer does not have an anchor.
   * those methods will work only if the renderer has a modifiable width/height
   * @public
   * @memberOf BaseRenderer
   * @param {number} width - in pixels
   * @param {number} height - in pixels
   * @param {boolean} preventCenter - if true, the texture wont be centered
   */
  setSize(width: number, height: number, preventCenter: boolean) {
    this.width = width;
    this.height = height;

    if (preventCenter !== undefined) {
      this.preventCenter = preventCenter;
    }
    if (this.preventCenter !== true && !this.anchor) {
      this.center();
    }
  }

  /**
   * center the renderer
   * @public
   * @memberOf BaseRenderer
   */
  center() {
    if (this.anchor && this.anchor.set) {
      this.anchor.set(0.5, 0.5);
    } else {
      this.x = -(this.width || 0) / 2;
      this.y = -(this.height || 0) / 2;
    }
  }

  /**
   * change the tint of the Sprite, this is chain-able
   * @public
   * @memberOf BaseRenderer
   */
  setTint(value: number) {
    this.tint = value || 0xffffff;

    if (this._originalTexture) {
      this._originalTexture.tint = this.tint;
    }

    return this;
  }

  /**
   * change the hue of the Sprite, this is chain-able
   * this is an easy setup filter for BaseRenderer and it use PIXI filters, check PIXI filters doc if you need more deeper informations
   * @public
   * @memberOf BaseRenderer
   * @param {number} rotation - in degrees
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setHue(rotation: number, multiply: boolean) {
    if (!this.hueFilter) {
      this.hueFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.hueFilter.hue(0, 0);
    }

    this.hueFilter.hue(rotation, multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.hueFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.hueFilter) == -1
    ) {
      this.filters = this.filters.concat([this.hueFilter]);
    }

    return this;
  }

  /**
   * change the saturation of the Sprite, this is chain-able
   * this is an easy setup filter for BaseRenderer and it use PIXI filters, check PIXI filters doc if you need more deeper informations
   * @public
   * @memberOf BaseRenderer
   * @param {number} amount - The saturation amount (0-1)
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setSaturation(amount: number, multiply: boolean) {
    if (!this.saturationFilter) {
      this.saturationFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.saturationFilter.desaturate();
    }

    this.saturationFilter.saturate(amount, multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.saturationFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.saturationFilter) == -1
    ) {
      this.filters = this.filters.concat([this.saturationFilter]);
    }

    return this;
  }

  /**
   * change the brightness of the Sprite, this is chain-able
   * this is an easy setup filter for BaseRenderer and it use PIXI filters, check PIXI filters doc if you need more deeper informations
   * @public
   * @memberOf BaseRenderer
   * @param {number} b - value of the brigthness (0-1, where 0 is black)
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setBrightness(b: number, multiply: boolean) {
    if (!this.brightnessFilter) {
      this.brightnessFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.brightnessFilter.brightness(0, 0);
    }

    this.brightnessFilter.brightness(b, multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.brightnessFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.brightnessFilter) == -1
    ) {
      this.filters = this.filters.concat([this.brightnessFilter]);
    }

    return this;
  }

  /**
   * change the contrast of the Sprite, this is chain-able
   * this is an easy setup filter for BaseRenderer and it use PIXI filters, check PIXI filters doc if you need more deeper informations
   * @public
   * @memberOf BaseRenderer
   * @param {number} amount - value of the contrast (0-1)
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setContrast(amount: number, multiply: boolean) {
    if (!this.contrastFilter) {
      this.contrastFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.contrastFilter.contrast(0, 0);
    }

    this.contrastFilter.contrast(amount, multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.contrastFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.contrastFilter) == -1
    ) {
      this.filters = this.filters.concat([this.contrastFilter]);
    }

    return this;
  }

  /**
   * apply a grascale on the Sprite, this is chain-able
   * this is an easy setup filter for BaseRenderer and it use PIXI filters, check PIXI filters doc if you need more deeper informations
   * @public
   * @memberOf BaseRenderer
   * @param {number} scale - value of the grey (0-1, where 0 is black)
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setGreyscale(scale: number, multiply: boolean) {
    if (!this.grayscaleFilter) {
      this.grayscaleFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.grayscaleFilter.greyscale(0, 0);
    }

    this.grayscaleFilter.greyscale(scale, multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.grayscaleFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.grayscaleFilter) == -1
    ) {
      this.filters = this.filters.concat([this.grayscaleFilter]);
    }

    return this;
  }

  /**
   * Set the black and white matrice.
   * @public
   * @memberOf BaseRenderer
   *
   * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  setBlackAndWhite(multiply: boolean) {
    if (!this.blackAndWhiteFilter) {
      this.blackAndWhiteFilter = new PIXI.filters.ColorMatrixFilter();
    } else {
      this.blackAndWhiteFilter.blackAndWhite(0);
    }

    this.blackAndWhiteFilter.blackAndWhite(multiply);

    if (!this.filters || !this.filters.length) {
      this.filters = [this.blackAndWhiteFilter];
    } else if (
      this.filters.length >= 1 &&
      this.filters.indexOf(this.blackAndWhiteFilter) == -1
    ) {
      this.filters = this.filters.concat([this.blackAndWhiteFilter]);
    }

    return this;
  }
}
