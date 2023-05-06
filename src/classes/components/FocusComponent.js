"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
class FocusComponent extends Component_1.default {
    constructor(parent, target) {
        super(parent);
        this._focusOptions = {};
        this._focusOffsets = { x: 0, y: 0 };
        this._name = 'FocusComponent';
        this.isMyTargetAChild = false;
        this.target = target;
    }
    update(_time) {
        if (!this.target) {
            return;
        }
        let pos = this.target;
        if (this.target.getWorldPos) {
            pos = this.target.getWorldPos();
        }
        // TODO: to fix (to finish)
        // let parentPos = this.parent.getGlobalPosition();
        // if (this.parent.getWorldPos) {
        //   parentPos = this.parent.getWorldPos();
        // } else {
        //   parentPos = this.parent;
        // }
        if (this._focusOptions.x) {
            if (this.isMyTargetAChild) {
                this.parent.x =
                    2 * this.parent.pivot.x - (pos.x + this._focusOffsets.x);
            }
            else
                this.parent.x = pos.x + this._focusOffsets.x;
        }
        if (this._focusOptions.y) {
            if (this.isMyTargetAChild) {
                this.parent.y =
                    2 * this.parent.pivot.y - (pos.y + this._focusOffsets.y);
            }
            else
                this.parent.y = pos.y + this._focusOffsets.y;
        }
        if (this._focusOptions.rotation) {
            this.parent.rotation = this.target.rotation;
        }
    }
    /**
     * give a target to this gameObject, then it will focus it until you changed or removed it
     * you can lock independent axes, and set offsets
     * @public
     * @memberOf GameObject
     * @param {GameObject} gameObject is the target to focus on
     * @param {Object} [params] optional parameters, set offsets or lock
     * @example // create a fx for your ship, decal a little on left, and lock y
     * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
     */
    focus(target, params = {}) {
        this.target = target;
        this._focusOptions = params;
        this.isMyTargetAChild = false;
        let parentChecker = target.parent;
        while (parentChecker != undefined) {
            console.log('nb Check');
            if (parentChecker === this.parent) {
                this.isMyTargetAChild = true;
                parentChecker = undefined;
            }
            else {
                parentChecker = parentChecker.parent;
            }
        }
        // focus default x/y
        this._focusOptions.x = this._focusOptions.x !== false ? true : false;
        this._focusOptions.y = this._focusOptions.y !== false ? true : false;
        this._focusOptions.rotation =
            this._focusOptions.rotation !== false ? true : false;
        this._focusOffsets = Object.assign({ x: 0, y: 0 }, params.offset);
        return this;
    }
    stopFocus() {
        this.target = undefined;
        return this;
    }
}
exports.default = FocusComponent;
