"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
class TimerComponent extends Component_1.default {
    constructor() {
        super(...arguments);
        /**
         * object used to apply shake
         * @protected
         * @memberOf GameObject
         * @type {Object}
         */
        this._timers = {};
        this._name = 'TimerComponent';
        this.counter = 0;
    }
    invoke(callback, interval = 0, persistent = false, id = ++this.counter) {
        this._timers[id] = {
            callback,
            interval,
            persistent,
            id: id,
            timeSinceLastCall: 0,
        };
        return id;
    }
    clear(id) {
        delete this._timers[id];
    }
    /**
     * apply the shake each update
     * You shouldn't call or change this method
     * @protected
     * @memberOf GameObject
     */
    update(time) {
        for (const key in this._timers) {
            const timer = this._timers[key];
            timer.timeSinceLastCall += time;
            if (timer.timeSinceLastCall > timer.interval) {
                timer.timeSinceLastCall -= timer.interval;
                timer.callback();
                if (!timer.persistent) {
                    delete this._timers[key];
                }
            }
        }
    }
}
exports.default = TimerComponent;
