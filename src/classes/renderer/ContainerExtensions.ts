import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import Time from '../../utils/Time';
import GameObject from '../GameObject';

export {};

type fadeData = {
  fadeScale?: number;
  dir?: number;
  stepVal?: number;
  from: number;
  to: number;
  duration: number;
  done: boolean;
};

type scaleData = {
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

const defaultFadeData: fadeData = {
  from: 1,
  to: 0,
  duration: 1000,
  done: true,
};

const defaultScaleData: scaleData = {
  duration: 1000,
  done: true,
  valX: 0,
  valY: 0,
  dirX: 0,
  dirY: 0,
  oDuration: 0,
  stepValX: 0,
  stepValY: 0,
  destX: 0,
  destY: 0,
  scaleX: 1,
  scaleY: 1,
  callback: () => {},
  leftX: 0,
  leftY: 0,
  fromx: 1,
  fromy: 1,
  tox: 0,
  toy: 0,
};

declare module 'pixi.js' {
  interface Container {
    gameObject: GameObject;
    fadeData?: fadeData;
    scaleData?: scaleData;
    hueFilter: ColorMatrixFilter;
    blackAndWhiteFilter: ColorMatrixFilter;
    saturationFilter: ColorMatrixFilter;
    brightnessFilter: ColorMatrixFilter;
    contrastFilter: ColorMatrixFilter;
    grayscaleFilter: ColorMatrixFilter;
    sleep: boolean;
    anchor?: PIXI.ObservablePoint;
    preventCenter?: boolean;
    tint?: number;
    _originalTexture: PIXI.Texture<PIXI.Resource>;
    setScale(x: number | { x: number; y: number }, y?: number): void;
    setTint(value: number): void;
    setHue(rotation: number, multiply: boolean): void;
    setBlackAndWhite(multiply: boolean): void;
    setSaturation(amount: number, multiply: boolean): void;
    setBrightness(b: number, multiply: boolean): void;
    setContrast(amount: number, multiply: boolean): void;
    setGreyscale(scale: number, multiply: boolean): void;
    applyFade(data: fadeData): void;
    fade(from: number, to: number, duration: number): void;
    fadeTo(to: number, duration: number): void;
    fadeOut(duration: number, force: boolean): void;
    fadeIn(duration: number, force: boolean): void;
    scaleTo(
      scale: { x: number; y: number } | number,
      duration: number,
      callback: () => void,
    ): void;
    applyScale(): void;
    setSize(width: number, height: number, preventCenter: boolean): void;
    center(): void;
    instantiate(target: any, params: any): void;
  }
}

PIXI.Container.prototype.instantiate = function (target, params) {
  if (params) {
    target.alpha = params.alpha || params.opacity || 1;
    params.scale = {
      x: params.scaleX || (params.scale ? params.scale.x || params.scale : 1),
      y: params.scaleY || (params.scale ? params.scale.y || params.scale : 1),
    };
    if (params.size) {
      params.width = params.size;
      params.height = params.size;
    }
    delete params.scaleY;
    delete params.scaleX;
    delete params.opacity;
    delete params.size;

    for (var i in params) {
      if (target[i] && target[i].set) {
        if (params[i].x !== undefined || params[i].y !== undefined) {
          target[i].set(params[i].x || 0, params[i].y || 0);
        } else {
          target[i].set(params[i]);
        }
      } else {
        target[i] = params[i];
      }
    }
  }

  // for (var i = 0; i < _attributes.length; ++i) {
  //   this[_attributes[i]] = this[_attributes[i]];
  // }
};

PIXI.Container.prototype.setScale = function (
  x: number | { x: number; y: number },
  y?: number,
) {
  if (y) {
    if (x instanceof Object) {
      this.scale.set(x.x, x.y);
    } else {
      this.scale.set(x, x);
    }
  } else {
    if (!(x instanceof Object) && y) {
      this.scale.set(x, y);
    }
  }
};

PIXI.Container.prototype.setTint = function (value: PIXI.COLOR_MASK_BITS) {
  this.tint = value || 0xffffff;
  if (this._originalTexture) {
    this._originalTexture.tint = this.tint;
  }
  return;
};

PIXI.Container.prototype.setHue = function (
  rotation: number,
  multiply: boolean,
) {
  if (!this.hueFilter) {
    this.hueFilter = new ColorMatrixFilter();
  } else {
    this.hueFilter.hue(0, false);
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
};

PIXI.Container.prototype.setBlackAndWhite = function (multiply: boolean) {
  if (!this.blackAndWhiteFilter) {
    this.blackAndWhiteFilter = new ColorMatrixFilter();
  } else {
    this.blackAndWhiteFilter.blackAndWhite(false);
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
};

PIXI.Container.prototype.setSaturation = function (
  amount: number,
  multiply: boolean,
) {
  if (!this.saturationFilter) {
    this.saturationFilter = new ColorMatrixFilter();
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
};

PIXI.Container.prototype.setBrightness = function (
  b: number,
  multiply: boolean,
) {
  if (!this.brightnessFilter) {
    this.brightnessFilter = new ColorMatrixFilter();
  } else {
    this.brightnessFilter.brightness(0, false);
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
};

PIXI.Container.prototype.setContrast = function (
  amount: number,
  multiply: boolean,
) {
  if (!this.contrastFilter) {
    this.contrastFilter = new ColorMatrixFilter();
  } else {
    this.contrastFilter.contrast(0, false);
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
};

PIXI.Container.prototype.setGreyscale = function (
  scale: number,
  multiply: boolean,
) {
  if (!this.grayscaleFilter) {
    this.grayscaleFilter = new ColorMatrixFilter();
  } else {
    this.grayscaleFilter.greyscale(0, false);
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
};

PIXI.Container.prototype.applyFade = function () {
  if (!this.fadeData) {
    this.fadeData = defaultFadeData;
  }
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
};

PIXI.Container.prototype.fade = function (
  from: number,
  to: number,
  duration: number,
) {
  this.sleep = false;
  let data = {
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
};

PIXI.Container.prototype.fadeTo = function (to: number, duration: number) {
  this.sleep = false;
  this.fade(this.alpha, to, duration);
};

PIXI.Container.prototype.fadeOut = function (duration: number, force: boolean) {
  this.sleep = false;
  if (force) {
    this.alpha = this.alpha > 0 ? this.alpha : 1; // make sure to prevent any blink side effect
  }
  this.fade(this.alpha, 0, duration);
};

PIXI.Container.prototype.fadeIn = function (duration: number, force: boolean) {
  this.sleep = false;
  if (force) {
    this.alpha = this.alpha < 1 ? this.alpha : 0; // make sure to prevent any blink side effect
  }
  this.fade(this.alpha, 1, duration);
};

PIXI.Container.prototype.scaleTo = function (
  scale: { x: number; y: number } | number,
  duration: number,
  callback: () => void,
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
    valX: -(this.scale.x - (dscale.x !== undefined ? dscale.x : this.scale.x)),
    valY: -(this.scale.y - (dscale.y !== undefined ? dscale.y : this.scale.y)),
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
    fromx: this.scaleData ? this.scaleData.fromx : defaultScaleData.fromx,
    fromy: this.scaleData ? this.scaleData.fromy : defaultScaleData.fromy,
    leftX: this.scaleData ? this.scaleData.leftX : defaultScaleData.leftX,
    leftY: this.scaleData ? this.scaleData.leftY : defaultScaleData.leftY,
    tox: this.scaleData ? this.scaleData.tox : defaultScaleData.tox,
    toy: this.scaleData ? this.scaleData.toy : defaultScaleData.toy,
  };
  this.scaleData.leftX = this.scaleData.valX;
  this.scaleData.leftY = this.scaleData.valY;
};

PIXI.Container.prototype.applyScale = function () {
  if (!this.scaleData) {
    this.scaleData = defaultScaleData;
  }
  if (this.scaleData.done) {
    return;
  }

  const scaleD = this.scaleData;

  if (scaleD.valX != 0) {
    scaleD.stepValX = (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valX;
    scaleD.leftX -= scaleD.stepValX;
    scaleD.scaleX += scaleD.stepValX;
  }

  if (scaleD.valY != 0) {
    scaleD.stepValY = (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valY;
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
};

PIXI.Container.prototype.setSize = function (
  width: number,
  height: number,
  preventCenter: boolean,
) {
  this.width = width;
  this.height = height;

  if (preventCenter !== undefined) {
    this.preventCenter = preventCenter;
  }
  if (this.preventCenter !== true && !this.anchor) {
    this.center();
  }
};

PIXI.Container.prototype.center = function () {
  if (this.anchor && this.anchor.set) {
    this.anchor.set(0.5, 0.5);
  } else {
    this.x = -(this.width || 0) / 2;
    this.y = -(this.height || 0) / 2;
  }
};
