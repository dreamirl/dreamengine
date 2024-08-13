import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';

export {};

export interface ContainerExtensions {
  hueFilter?: ColorMatrixFilter;
  blackAndWhiteFilter?: ColorMatrixFilter;
  saturationFilter?: ColorMatrixFilter;
  brightnessFilter?: ColorMatrixFilter;
  contrastFilter?: ColorMatrixFilter;
  grayscaleFilter?: ColorMatrixFilter;
  sleep: boolean;
  anchor?: PIXI.ObservablePoint;
  preventCenter?: boolean;
  tint?: PIXI.ColorSource;
  _originalTexture?: PIXI.Texture<PIXI.Resource>;
  setTint(value: PIXI.ColorSource): void;
  setHue(rotation: number, multiply: boolean): void;
  setBlackAndWhite(multiply: boolean): void;
  setSaturation(amount: number, multiply: boolean): void;
  setBrightness(b: number, multiply: boolean): void;
  setContrast(amount: number, multiply: boolean): void;
  setGreyscale(scale: number, multiply: boolean): void;
  setSize(width: number, height: number, preventCenter: boolean): void;
  setScale(x: number | { x: number; y: number }, y?: number): void;
  center(): void;
  instantiate(params: any): void;
}

export const instantiate = function (target: any, params: any) {
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

    if (params.anchor && target.anchor) {
      target.anchor.x = params.anchor.x;
      target.anchor.y = params.anchor.y;
    }

    for (const i in params) {
      if (target[i] && target[i].set) {
        if (
          params[i] &&
          (params[i].x !== undefined || params[i].y !== undefined)
        ) {
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

export const setScale = function (
  target: PIXI.Container & ContainerExtensions,
  x: number | { x: number; y: number },
  y?: number,
) {
  if (y == undefined) {
    if (x instanceof Object) {
      target.scale = { x: x.x, y: x.y };
    } else {
      target.scale = { x: x, y: x };
    }
  } else {
    if (!(x instanceof Object) && y) {
      target.scale = { x: x, y: y };
    }
  }
};

export const setTint = function (
  target: PIXI.Container & ContainerExtensions,
  value: PIXI.ColorSource,
) {
  target.tint = value || 0xffffff;
  // if (target._originalTexture) {
  //   target._originalTexture.tint = target.tint;
  // }
};

export const setHue = function (
  target: PIXI.Container & ContainerExtensions,
  rotation: number,
  multiply: boolean,
) {
  if (!target.hueFilter) {
    target.hueFilter = new PIXI.filters.ColorMatrixFilter();
  } else {
    target.hueFilter.hue(0, false);
  }

  target.hueFilter.hue(rotation, multiply);

  if (!target.filters || !target.filters.length) {
    target.filters = [target.hueFilter];
  } else if (
    target.filters.length >= 1 &&
    target.filters.indexOf(target.hueFilter) == -1
  ) {
    target.filters = target.filters.concat([target.hueFilter]);
  }

  return target;
};

export const setBlackAndWhite = function (
  target: PIXI.Container & ContainerExtensions,
  enable: boolean,
) {
  if (!target.blackAndWhiteFilter) {
    target.blackAndWhiteFilter = new PIXI.filters.ColorMatrixFilter();
  }
  target.blackAndWhiteFilter.blackAndWhite(true);

  if (enable) {
    if (!target.filters || !target.filters.length) {
      target.filters = [target.blackAndWhiteFilter];
    } else if (
      target.filters.length >= 1 &&
      target.filters.indexOf(target.blackAndWhiteFilter) == -1
    ) {
      target.filters = target.filters.concat([target.blackAndWhiteFilter]);
    }
  } else if (target.filters) {
    const index = target.filters.indexOf(target.blackAndWhiteFilter);
    if (index !== -1) target.filters.splice(index, 1);
  }

  return target;
};

export const setSaturation = function (
  target: PIXI.Container & ContainerExtensions,
  amount: number,
  multiply: boolean,
) {
  if (!target.saturationFilter) {
    target.saturationFilter = new PIXI.filters.ColorMatrixFilter();
  } else {
    target.saturationFilter.desaturate();
  }

  target.saturationFilter.saturate(amount, multiply);

  if (!target.filters || !target.filters.length) {
    target.filters = [target.saturationFilter];
  } else if (
    target.filters.length >= 1 &&
    target.filters.indexOf(target.saturationFilter) == -1
  ) {
    target.filters = target.filters.concat([target.saturationFilter]);
  }

  return target;
};

export const setBrightness = function (
  target: PIXI.Container & ContainerExtensions,
  b: number,
  multiply: boolean,
) {
  if (!target.brightnessFilter) {
    target.brightnessFilter = new PIXI.filters.ColorMatrixFilter();
  } else {
    target.brightnessFilter.brightness(0, false);
  }

  target.brightnessFilter.brightness(b, multiply);

  if (!target.filters || !target.filters.length) {
    target.filters = [target.brightnessFilter];
  } else if (
    target.filters.length >= 1 &&
    target.filters.indexOf(target.brightnessFilter) == -1
  ) {
    target.filters = target.filters.concat([target.brightnessFilter]);
  }

  return target;
};

export const setContrast = function (
  target: PIXI.Container & ContainerExtensions,
  amount: number,
  multiply: boolean,
) {
  if (!target.contrastFilter) {
    target.contrastFilter = new PIXI.filters.ColorMatrixFilter();
  } else {
    target.contrastFilter.contrast(0, false);
  }

  target.contrastFilter.contrast(amount, multiply);

  if (!target.filters || !target.filters.length) {
    target.filters = [target.contrastFilter];
  } else if (
    target.filters.length >= 1 &&
    target.filters.indexOf(target.contrastFilter) == -1
  ) {
    target.filters = target.filters.concat([target.contrastFilter]);
  }

  return target;
};

export const setGreyscale = function (
  target: PIXI.Container & ContainerExtensions,
  scale: number,
  multiply: boolean,
) {
  if (!target.grayscaleFilter) {
    target.grayscaleFilter = new PIXI.filters.ColorMatrixFilter();
  } else {
    target.grayscaleFilter.greyscale(0, false);
  }

  target.grayscaleFilter.greyscale(scale, multiply);

  if (!target.filters || !target.filters.length) {
    target.filters = [target.grayscaleFilter];
  } else if (
    target.filters.length >= 1 &&
    target.filters.indexOf(target.grayscaleFilter) == -1
  ) {
    target.filters = target.filters.concat([target.grayscaleFilter]);
  }

  return target;
};

export const setSize = function (
  target: PIXI.Container & ContainerExtensions,
  width: number,
  height: number,
  preventCenter: boolean,
) {
  target.width = width;
  target.height = height;

  if (preventCenter !== undefined) {
    target.preventCenter = preventCenter;
  }
  if (target.preventCenter !== true && !target.anchor) {
    target.center();
  }
};

export const center = function (target: PIXI.Container & ContainerExtensions) {
  if (target.anchor && target.anchor.set) {
    target.anchor.set(0.5, 0.5);
  } else {
    target.x = -(target.width || 0) / 2;
    target.y = -(target.height || 0) / 2;
  }
};
