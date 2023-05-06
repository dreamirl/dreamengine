"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
class About {
    constructor() {
        this._gameName = 'My-Dreamengine-Game';
        this._gameVersion = '0.1.0';
        this._gameAuthor = 'Dreamirl';
        this._namespace = null;
        this._gamePrice = null;
        this._packPrice = null;
    }
    get gameName() {
        return this._gameName;
    }
    get gameVersion() {
        return this._gameVersion;
    }
    get gameAuthor() {
        return this._gameAuthor;
    }
    get namespace() {
        return this._namespace;
    }
    get gamePrice() {
        return this._gamePrice;
    }
    get packPrice() {
        return this._packPrice;
    }
    set(values) {
        this._gameName = values.gameName || this._gameName;
        this._gameVersion = values.gameVersion || this._gameVersion;
        this._gameAuthor = values.gameAuthor || this._gameAuthor;
        this._namespace = values.namespace || null;
        this._gamePrice = values.gamePrice || null;
        this._packPrice = values.packPrice || null;
    }
}
exports.About = About;
About.DEName = 'About';
About.engineVersion = '2.0';
const about = new About();
exports.default = about;
