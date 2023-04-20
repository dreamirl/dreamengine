import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';

export {};

declare module 'pixi.js' {
  interface Container {
    gameObject: GameObject;
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
    setTint(value: number): void;
    setHue(rotation: number, multiply: boolean): void;
    setBlackAndWhite(multiply: boolean): void;
    setSaturation(amount: number, multiply: boolean): void;
    setBrightness(b: number, multiply: boolean): void;
    setContrast(amount: number, multiply: boolean): void;
    setGreyscale(scale: number, multiply: boolean): void;
    applyScale(): void;
    setSize(width: number, height: number, preventCenter: boolean): void;
    setScale(x: number | {x: number, y: number}, y?: number): void;
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

    for (let i in params) {
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

PIXI.Container.prototype.setScale = function (x: number | {x: number, y: number}, y?: number){
  if (y == undefined) {
    if (x instanceof Object) {
      this.scale = { x: x.x, y: x.y };
    } else {
      this.scale = { x: x, y: x };
    }
  } else {
    if (!(x instanceof Object) && y) {
      this.scale = { x: x, y: y };
    }
  }
}

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
