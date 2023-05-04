"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_1 = __importDefault(require("./GameObject"));
/**
 * @author Grimka / http://dreamirl.com
 */
/**
 * @constructor Gui
 * @class DEPRECATED: a Gui used to be a Scene, but now it's just a GameObject.
 * You may put it over a world, and push GameObjects inside it.
 * A Gui can be added to a Render and should be on top of everything.
 * @example Game.gui = new DE.Gui( "Test" );
 * @deprecated
 */
class Gui extends GameObject_1.default {
    // support trigger  -nop
    // Gui.prototype.trigger = Gui.prototype.emit;
    /**
     * easy way to shutdown gui rendering/updating
     * @public
     * @memberOf Gui
     * @type {Boolean}
     */
    get enable() {
        return this.renderable && this.visible;
    }
    set enable(bool) {
        this.visible = bool;
        this.renderable = bool;
    }
}
exports.default = Gui;
