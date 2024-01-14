"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
class FadeComponent extends Component_1.default {
    constructor(parent, duration = 0, to = 0, from = parent.alpha, force = true, callback = () => { }, selfDestruct = true) {
        super(parent);
        this._name = 'FadeComponent';
        if (duration != 0) {
            this.fade(from, to, duration, force, callback);
            this.selfDestruct = selfDestruct;
        }
    }
    fade(from, to, duration, force, callback = () => { }) {
        if (force) {
            this.enable = true;
        }
        let dir = (from != undefined ? from : 1) > to ? -1 : 1;
        var data = {
            from: from != undefined ? from : 1,
            to: to != undefined ? to : 0,
            duration: duration || 500,
            oDuration: duration || 500,
            fadeScale: Math.abs(from - to),
            done: false,
            callback: callback,
            dir: dir,
        };
        this._fadeData = data;
    }
    fadeTo(to, duration, force, callback = () => { }) {
        this.fade(this.parent.alpha, to, duration, force, callback);
    }
    fadeOut(duration, force, callback = () => { }) {
        if (force) {
            this.enable = true;
            this.parent.alpha = this.parent.alpha > 0 ? this.parent.alpha : 1; // make sure to prevent any blink side effect
        }
        this.fade(this.parent.alpha, 0, duration, force, callback);
    }
    fadeIn(duration, force, callback = () => { }) {
        if (force) {
            this.enable = true;
            this.parent.alpha = this.parent.alpha < 1 ? this.parent.alpha : 0; // make sure to prevent any blink side effect
        }
        this.fade(this.parent.alpha, 1, duration, force, callback);
    }
    update(time) {
        if (!this._fadeData.done) {
            this._fadeData.stepVal =
                (time / this._fadeData.oDuration) *
                    this._fadeData.dir *
                    this._fadeData.fadeScale;
            this.parent.alpha += this._fadeData.stepVal;
            this._fadeData.duration -= time;
            if ((this._fadeData.dir < 0 && this.parent.alpha <= this._fadeData.to) ||
                (this._fadeData.dir > 0 && this.parent.alpha >= this._fadeData.to) ||
                this.parent.alpha < 0 ||
                this.parent.alpha > 1) {
                this.parent.alpha = this._fadeData.to;
            }
            if (this._fadeData.duration <= 0) {
                this._fadeData.done = true;
                this.parent.emit('fadeEnd', this);
                this._fadeData.callback();
                if (this.selfDestruct)
                    this.destroy();
            }
        }
    }
}
exports.default = FadeComponent;
