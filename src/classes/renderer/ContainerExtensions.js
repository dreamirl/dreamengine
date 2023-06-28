"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.center = exports.setSize = exports.setGreyscale = exports.setContrast = exports.setBrightness = exports.setSaturation = exports.setBlackAndWhite = exports.setHue = exports.setTint = exports.setScale = exports.instantiate = void 0;
const PIXI = __importStar(require("pixi.js"));
const instantiate = function (target, params) {
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
                if (params[i].x !== undefined || params[i].y !== undefined) {
                    target[i].set(params[i].x || 0, params[i].y || 0);
                }
                else {
                    target[i].set(params[i]);
                }
            }
            else {
                target[i] = params[i];
            }
        }
    }
    // for (var i = 0; i < _attributes.length; ++i) {
    //   this[_attributes[i]] = this[_attributes[i]];
    // }
};
exports.instantiate = instantiate;
const setScale = function (target, x, y) {
    if (y == undefined) {
        if (x instanceof Object) {
            target.scale = { x: x.x, y: x.y };
        }
        else {
            target.scale = { x: x, y: x };
        }
    }
    else {
        if (!(x instanceof Object) && y) {
            target.scale = { x: x, y: y };
        }
    }
};
exports.setScale = setScale;
const setTint = function (target, value) {
    target.tint = value || 0xffffff;
    // if (target._originalTexture) {
    //   target._originalTexture.tint = target.tint;
    // }
};
exports.setTint = setTint;
const setHue = function (target, rotation, multiply) {
    if (!target.hueFilter) {
        target.hueFilter = new PIXI.filters.ColorMatrixFilter();
    }
    else {
        target.hueFilter.hue(0, false);
    }
    target.hueFilter.hue(rotation, multiply);
    if (!target.filters || !target.filters.length) {
        target.filters = [target.hueFilter];
    }
    else if (target.filters.length >= 1 &&
        target.filters.indexOf(target.hueFilter) == -1) {
        target.filters = target.filters.concat([target.hueFilter]);
    }
    return target;
};
exports.setHue = setHue;
const setBlackAndWhite = function (target, enable) {
    if (!target.blackAndWhiteFilter) {
        target.blackAndWhiteFilter = new PIXI.filters.ColorMatrixFilter();
    }
    target.blackAndWhiteFilter.blackAndWhite(true);
    if (enable) {
        if (!target.filters || !target.filters.length) {
            target.filters = [target.blackAndWhiteFilter];
        }
        else if (target.filters.length >= 1 &&
            target.filters.indexOf(target.blackAndWhiteFilter) == -1) {
            target.filters = target.filters.concat([target.blackAndWhiteFilter]);
        }
    }
    else if (target.filters) {
        const index = target.filters.indexOf(target.blackAndWhiteFilter);
        if (index !== -1)
            target.filters.splice(index, 1);
    }
    return target;
};
exports.setBlackAndWhite = setBlackAndWhite;
const setSaturation = function (target, amount, multiply) {
    if (!target.saturationFilter) {
        target.saturationFilter = new PIXI.filters.ColorMatrixFilter();
    }
    else {
        target.saturationFilter.desaturate();
    }
    target.saturationFilter.saturate(amount, multiply);
    if (!target.filters || !target.filters.length) {
        target.filters = [target.saturationFilter];
    }
    else if (target.filters.length >= 1 &&
        target.filters.indexOf(target.saturationFilter) == -1) {
        target.filters = target.filters.concat([target.saturationFilter]);
    }
    return target;
};
exports.setSaturation = setSaturation;
const setBrightness = function (target, b, multiply) {
    if (!target.brightnessFilter) {
        target.brightnessFilter = new PIXI.filters.ColorMatrixFilter();
    }
    else {
        target.brightnessFilter.brightness(0, false);
    }
    target.brightnessFilter.brightness(b, multiply);
    if (!target.filters || !target.filters.length) {
        target.filters = [target.brightnessFilter];
    }
    else if (target.filters.length >= 1 &&
        target.filters.indexOf(target.brightnessFilter) == -1) {
        target.filters = target.filters.concat([target.brightnessFilter]);
    }
    return target;
};
exports.setBrightness = setBrightness;
const setContrast = function (target, amount, multiply) {
    if (!target.contrastFilter) {
        target.contrastFilter = new PIXI.filters.ColorMatrixFilter();
    }
    else {
        target.contrastFilter.contrast(0, false);
    }
    target.contrastFilter.contrast(amount, multiply);
    if (!target.filters || !target.filters.length) {
        target.filters = [target.contrastFilter];
    }
    else if (target.filters.length >= 1 &&
        target.filters.indexOf(target.contrastFilter) == -1) {
        target.filters = target.filters.concat([target.contrastFilter]);
    }
    return target;
};
exports.setContrast = setContrast;
const setGreyscale = function (target, scale, multiply) {
    if (!target.grayscaleFilter) {
        target.grayscaleFilter = new PIXI.filters.ColorMatrixFilter();
    }
    else {
        target.grayscaleFilter.greyscale(0, false);
    }
    target.grayscaleFilter.greyscale(scale, multiply);
    if (!target.filters || !target.filters.length) {
        target.filters = [target.grayscaleFilter];
    }
    else if (target.filters.length >= 1 &&
        target.filters.indexOf(target.grayscaleFilter) == -1) {
        target.filters = target.filters.concat([target.grayscaleFilter]);
    }
    return target;
};
exports.setGreyscale = setGreyscale;
const setSize = function (target, width, height, preventCenter) {
    target.width = width;
    target.height = height;
    if (preventCenter !== undefined) {
        target.preventCenter = preventCenter;
    }
    if (target.preventCenter !== true && !target.anchor) {
        target.center();
    }
};
exports.setSize = setSize;
const center = function (target) {
    if (target.anchor && target.anchor.set) {
        target.anchor.set(0.5, 0.5);
    }
    else {
        target.x = -(target.width || 0) / 2;
        target.y = -(target.height || 0) / 2;
    }
};
exports.center = center;
