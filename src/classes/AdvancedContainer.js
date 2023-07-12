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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = __importStar(require("pixi.js"));
const Tween_1 = __importDefault(require("./Tween"));
const FocusComponent_1 = __importDefault(require("./components/FocusComponent"));
const ShakeComponent_1 = __importDefault(require("./components/ShakeComponent"));
const TimerComponent_1 = __importDefault(require("./components/TimerComponent"));
const ContainerExtensions_1 = require("./renderer/ContainerExtensions");
class AdvancedContainer extends PIXI.Container {
    constructor() {
        super(...arguments);
        this.sleep = false;
        this._components = [];
        this._shakeComp = undefined;
        this._timerComp = undefined;
        this._focusComp = undefined;
    }
    get shakeComp() {
        if (!this._shakeComp) {
            this._shakeComp = new ShakeComponent_1.default(this);
            this.addComponent(this._shakeComp);
        }
        return this._shakeComp;
    }
    get timerComp() {
        if (!this._timerComp) {
            this._timerComp = new TimerComponent_1.default(this);
            this.addComponent(this._timerComp);
        }
        return this._timerComp;
    }
    get focusComp() {
        if (!this._focusComp) {
            this._focusComp = new FocusComponent_1.default(this);
            this.addComponent(this._focusComp);
        }
        return this._focusComp;
    }
    update(time) {
        this._components.forEach((c) => {
            c._update(time);
        });
    }
    addComponent(...components) {
        components.forEach((c) => this.addOneComponent(c));
        return this;
    }
    addOneComponent(component) {
        this._components.push(component);
        return this;
    }
    removeComponent(componentReference) {
        this._components.splice(this._components.indexOf(componentReference), 1);
        return this;
    }
    getComponent(name) {
        return this._components.find((v) => v.name === name);
    }
    timeout(callback, interval = 0, persistent = false) {
        return this.timerComp.invoke(callback, interval, persistent);
    }
    clearTimeout(id) {
        this.timerComp.clear(id);
        return this;
    }
    fadeTo(value, duration, onComplete, onCompleteParams, autostart = true, easing = Tween_1.default.Easing.noEase) {
        new Tween_1.default.Tween(this, 'alpha', value, duration, autostart, easing).setOnComplete(onComplete, onCompleteParams || {});
    }
    fadeOut(duration, onComplete, onCompleteParams, autostart = true, easing = Tween_1.default.Easing.noEase) {
        new Tween_1.default.Tween(this, 'alpha', 0, duration, autostart, easing).setOnComplete(onComplete, onCompleteParams || {});
    }
    fadeIn(duration, onComplete, onCompleteParams, autostart = true, easing = Tween_1.default.Easing.noEase) {
        new Tween_1.default.Tween(this, 'alpha', 1, duration, autostart, easing).setOnComplete(onComplete, onCompleteParams || {});
    }
    /**
     * check the documentation on GameObject for all shake features
     * @protected
     * @memberOf GameObject
     */
    shake(xRange, yRange, duration = 500, callback = () => {
        return;
    }) {
        this.shakeComp.shake(xRange, yRange, duration, callback);
        return this;
    }
    scaleTo(targetScale, duration, onComplete, onCompleteParams, autostart = true, easing = Tween_1.default.Easing.noEase) {
        new Tween_1.default.Tween(this, 'scale.x', targetScale.x, duration, autostart, easing);
        new Tween_1.default.Tween(this, 'scale.y', targetScale.y, duration, autostart, easing).setOnComplete(onComplete, onCompleteParams || {});
    }
    moveTo(dest, duration, onComplete, onCompleteParams, autostart = true, forceLocalPos = false, easing = Tween_1.default.Easing.noEase) {
        if (this.parent && !forceLocalPos) {
            const parentPos = this.parent.getGlobalPosition();
            dest = { x: dest.x - parentPos.x, y: dest.y - parentPos.y };
        }
        new Tween_1.default.Tween(this, 'x', dest.x, duration, autostart, easing);
        new Tween_1.default.Tween(this, 'y', dest.y, duration, autostart, easing).setOnComplete(onComplete, onCompleteParams || {});
        return this;
    }
    focus(gameObject, params) {
        this.focusComp.focus(gameObject, params);
        return this;
    }
    stopFocus() {
        this.focusComp.stopFocus();
        return this;
    }
    setTint(value) { (0, ContainerExtensions_1.setTint)(this, value); }
    setHue(rotation, multiply) { (0, ContainerExtensions_1.setHue)(this, rotation, multiply); }
    setBlackAndWhite(multiply) { (0, ContainerExtensions_1.setBlackAndWhite)(this, multiply); }
    setSaturation(amount, multiply) { (0, ContainerExtensions_1.setSaturation)(this, amount, multiply); }
    setBrightness(b, multiply) { (0, ContainerExtensions_1.setBrightness)(this, b, multiply); }
    setContrast(amount, multiply) { (0, ContainerExtensions_1.setContrast)(this, amount, multiply); }
    setGreyscale(scale, multiply) { (0, ContainerExtensions_1.setGreyscale)(this, scale, multiply); }
    setSize(width, height, preventCenter) { (0, ContainerExtensions_1.setSize)(this, width, height, preventCenter); }
    setScale(x, y) { (0, ContainerExtensions_1.setScale)(this, x, y); }
    center() { (0, ContainerExtensions_1.center)(this); }
    instantiate(_params) { }
}
exports.default = AdvancedContainer;
