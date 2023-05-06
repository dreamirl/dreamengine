"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __importDefault(require("./utils/Events"));
/**
 * config contain various stuff for the engine
 * @namespace config
 */
const config = {
    DEName: 'config',
    VERSION: '2.0',
    _DEBUG: false,
    _DEBUG_LEVEL: 0,
    ALLOW_ONBEFOREUNLOAD: true,
    DEFAULT_TEXT_RESOLUTION: 2,
    DEFAULT_SORTABLE_CHILDREN: true,
    DEFAULT_POOL_NAME: 'default',
    notifications: {
        enable: true,
        gamepadEnable: true,
        gamepadAvalaible: 'Gamepad avalaible !',
        gamepadChange: true,
        achievementUnlockDuration: 8000,
    },
    get DEBUG() {
        return this._DEBUG;
    },
    set DEBUG(bool) {
        Events_1.default.emit('change-debug', bool, this._DEBUG_LEVEL);
        config._DEBUG = bool;
    },
    get DEBUG_LEVEL() {
        return this._DEBUG_LEVEL;
    },
    set DEBUG_LEVEL(num) {
        Events_1.default.emit('change-debug', this._DEBUG, num);
        this._DEBUG_LEVEL = num;
    },
};
exports.default = config;
