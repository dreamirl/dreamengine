"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamepads = void 0;
const config_1 = __importDefault(require("../config"));
const Events_1 = __importDefault(require("./Events"));
const Inputs_1 = __importDefault(require("./Inputs"));
const Localization_1 = __importDefault(require("./Localization"));
const Notifications_1 = __importDefault(require("./Notifications"));
/**
 * Author
 @Shocoben / https://github.com/schobbent

 * ContributorsList
 @Shocoben
 @Inateno
 */
/**
 * bring Gamepad API with Chrome and Windows8
 * TODO - comment and document it (big work here)
 * @namespace Inputs
 */
// let addEvent = Event.addEventCapabilities;
function detectBrowser(browser) {
    if (browser == 'firefox') {
        if (/Firefox[/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            const ffversion = new Number(RegExp.$1); // capture x.x portion and store as a number
            return ffversion;
        }
        return false;
    }
    if (browser == 'chrome') {
        const nav = navigator.userAgent.toLowerCase();
        // doesn't want mobile browser
        return (nav.indexOf('chrome') > -1 &&
            nav.indexOf('android') == -1 &&
            nav.indexOf('iphone') == -1 &&
            nav.indexOf('ipad') == -1 &&
            nav.indexOf('ipod') == -1);
    }
    return false;
}
const gamepadAvalaible = [];
class gamepads {
    constructor() {
        this.DEName = 'gamepad';
        this.isGamepadConnected = false;
        this._btnsListeners = {};
        this._axesListeners = {};
        this._gamepads = [];
        this.gamepadsInfos = {};
        this.lastTimeStamps = {};
        this.enable = true;
        this.handleDown = () => { };
        this.isWaitingForAnyKey = false;
        this.waitForAnyKeyType = 'keyboard';
        this.waitForAnyKeyCallback = () => { };
        this._updateChange = (_t) => { };
        this._updateRate = (_t) => { };
        this.update = () => { };
        this._sensibility = 0.5;
        this._firstRate = 500;
        this._rate = 150;
    }
    init(inputs) {
        this.inputs = inputs;
        // Update chrome
        if (config_1.default.notifications.gamepadEnable) {
            Notifications_1.default.create(Localization_1.default.get('gamepadAvalaible') ||
                config_1.default.notifications.gamepadAvalaible);
        }
        this._updateChange = (cTime) => {
            // [] fallback if there is not gamepads API
            const gamepads = this.filterGamepads(navigator.getGamepads ? navigator.getGamepads() : []);
            for (let i = 0; i < gamepads.length; ++i) {
                if (gamepads[i]) {
                    if (!this.lastTimeStamps[i] ||
                        this.lastTimeStamps[i] != gamepads[i].timestamp) {
                        this.lastTimeStamps[i] = gamepads[i].timestamp;
                        if (gamepads[i] !== null)
                            this.handleGamepad(gamepads[i], cTime, this._gamepads[i]);
                    }
                }
                else {
                    this.disconnectGamepad(i);
                }
            }
        };
        this._updateRate = (cTime) => {
            const gamepads = this.filterGamepads(navigator.getGamepads ? navigator.getGamepads() : []);
            for (let i = 0; i < gamepads.length; ++i) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    this.handleGamepad(gamepad, cTime, this._gamepads[i]);
                    continue;
                }
                else {
                    this.disconnectGamepad(i);
                }
            }
        };
        this.updateByChange();
        window.addEventListener('MozGamepadConnected', (e) => this.gamepadConnected(e), false);
        window.addEventListener('gamepadconnected', (e) => this.gamepadConnected(e), false);
        // window.addEventListener( "gamepaddisconnected", gamepadDisconnected, false ); // TODO
    }
    filterGamepads(gamepads) {
        let gps = [];
        for (let i = 0; i < gamepads.length; ++i) {
            gps.push(gamepads[i]);
        }
        gps = gps.filter((g) => {
            if (!g) {
                return false;
            }
            const idlower = g.id.toLowerCase();
            return !(idlower.match('unknown') ||
                idlower.match('shift') ||
                idlower.match('gear') ||
                idlower.match('b669'));
        });
        return gps;
    }
    /*bindWindowController(gamepadState: GamepadState) {
      //create array with the good index from https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
      let axes = ['leftThumbX', 'leftThumbY', 'rightThumbX', 'rightThumbY'];
      let buttons = [
        'a',
        'b',
        'y',
        'x',
        'left_shoulder',
        'right_shoulder',
        'LeftTrigger',
        'RightTrigger',
        'back',
        'start',
        'left_thumb',
        'right_thumb',
        'dpad_up',
        'dpad_down',
        'dpad_left',
        'dpad_right',
      ];
  
      //bind now
      let nGamepad = {
        index: gamepadState.controllerId,
        timestamp: gamepadState.packetNumber,
        buttons: [] as number[],
        axes: [] as number[],
      };
  
      //buttons
      for (let i = 0; i < buttons.length; ++i) {
        let name = buttons[i];
        // Window8 Gamepad rightTrigger values are between 0 and 255. Chrome and firexox sticks are between 0 and 1
        if (name == 'LeftTrigger' || name == 'RightTrigger') {
          nGamepad.buttons[i] = gamepadState[name] / 255;
          continue;
        }
  
        //gamepadState buttons are booleans. Chrome and firefox are float beetwen 0 and 1
        if (gamepadState[name]) {
          nGamepad.buttons[i] = 1;
          continue;
        }
        nGamepad.buttons[i] = 0;
      }
  
      for (let i = 0; i < axes.length; ++i) {
        let name = axes[i];
        // Window8lib Gamepad thumbstick values are between -32768 and 32767.
        nGamepad.axes[i] = gamepadState[name] / 32767;
        if (name == 'leftThumbY' || name == 'rightThumbY') {
          nGamepad.axes[i] *= -1;
        }
      }
      return nGamepad;
    }*/
    //Firefox handler
    gamepadConnected(e) {
        var _a;
        Notifications_1.default.create(Localization_1.default.get('onGamepadConnect') ||
            'Gamepad ' + (e.gamepad.index + 1) + ' connected');
        let gamepadType = 'xbox';
        if (e.gamepad.id.includes('DualSense')) {
            gamepadType = 'sony';
        }
        else if (e.gamepad.id.includes('NSW')) {
            gamepadType = 'nintendo';
        }
        this._gamepads[e.gamepad.index] = gamepadType;
        if (!this._gamepads.length) {
            this._gamepads.length = 0;
        }
        this._gamepads.length++;
        (_a = this.inputs) === null || _a === void 0 ? void 0 : _a.setLastEventType(gamepadType);
    }
    handleGamepad(gamepad, cTime, gamepadType) {
        const index = gamepad.index;
        this.gamepadsInfos[index] = gamepad;
        if (this._btnsListeners[index]) {
            this.handleListeners(index, gamepad.buttons, this._btnsListeners, cTime, 'buttons', gamepadType);
        }
        if (this._axesListeners[index]) {
            this.handleListeners(index, gamepad.axes, this._axesListeners, cTime, 'axes', gamepadType);
        }
        if (!gamepadAvalaible[index]) {
            console.log('Gamepad connected ' + index, 2);
            if (config_1.default.notifications.gamepadChange) {
                this.isGamepadConnected = true;
                Notifications_1.default.create(Localization_1.default.get('onGamepadConnect') ||
                    'Gamepad ' + (index + 1) + ' connected');
            }
            Events_1.default.emit('connectGamepad', index);
            gamepadAvalaible[index] = true;
        }
    }
    disconnectGamepad(index) {
        this.lastTimeStamps[index] = null;
        this._gamepads.splice(index, 1);
        this.gamepadsInfos[index] = null;
        if (gamepadAvalaible[index]) {
            console.log('Disconnect gamepad ' + index, 2);
            if (config_1.default.notifications.gamepadChange) {
                this.isGamepadConnected = false;
                for (const i in gamepadAvalaible) {
                    if (i != index.toString() && gamepadAvalaible[i]) {
                        this.isGamepadConnected = true;
                        break;
                    }
                }
                Notifications_1.default.create(Localization_1.default.get('onGamepadDisconnect') ||
                    'Gamepad ' + (index + 1) + ' disconnected');
            }
            Events_1.default.emit('disconnectGamepad', index);
            gamepadAvalaible[index] = false;
        }
    }
    getGamepadsLength() {
        let n = 0;
        for (const i in gamepadAvalaible) {
            if (gamepadAvalaible[i]) {
                ++n;
            }
        }
        return n;
    }
    overSensibility(force) {
        if ((force < -this._sensibility && force < 0) ||
            (force > this._sensibility && force > 0)) {
            return true;
        }
        return false;
    }
    handleDownChange(i, eventBus, listener, elemForce, _cTime, gamepadType) {
        var _a;
        if (this.overSensibility(elemForce) && !listener.active) {
            (_a = this.inputs) === null || _a === void 0 ? void 0 : _a.setLastEventType(gamepadType);
            i = gamepadType === 'nintendo' && i < 3 ? (i + 2) % 3 : i;
            eventBus.emit('down' + i, elemForce, i);
            listener.active = true;
        }
    }
    handleDownRate(i, eventBus, listener, elemForce, cTime, gamepadType) {
        var _a, _b;
        if (this.overSensibility(elemForce)) {
            if (!listener.active) {
                (_a = this.inputs) === null || _a === void 0 ? void 0 : _a.setLastEventType(gamepadType);
                i = gamepadType === 'nintendo' && i < 3 ? (i + 2) % 3 : i;
                eventBus.emit('down' + i, elemForce, i);
                listener.active = true;
                listener.timesTamp = cTime;
                listener.diffTime = this._firstRate;
                return true;
            }
            if (listener.noRate) {
                return true;
            }
            if (listener.timesTamp + listener.diffTime < cTime) {
                (_b = this.inputs) === null || _b === void 0 ? void 0 : _b.setLastEventType(gamepadType);
                i = gamepadType === 'nintendo' && i < 3 ? (i + 2) % 3 : i;
                eventBus.emit('down' + i, elemForce, i);
                listener.timesTamp = cTime;
                listener.diffTime = this._rate;
                return true;
            }
        }
        return false;
    }
    handleListeners(index, gamepadInterface, arrayListeners, cTime, type, gamepadType) {
        var _a, _b;
        if (!this.enable)
            return;
        for (const [ind, lst] of Object.entries(arrayListeners[index].listeners)) {
            const listener = lst;
            const i = parseInt(ind);
            if (!gamepadInterface[i]) {
                return;
            }
            let elemForce = 0;
            if (typeof gamepadInterface[i] === 'number') {
                elemForce = gamepadInterface[i];
            }
            else {
                elemForce = gamepadInterface[i].value;
            }
            const eventBus = arrayListeners[index];
            if (Math.abs(elemForce) < 0.3) {
                elemForce = 0;
            }
            if (elemForce != listener.force) {
                if (this.isWaitingForAnyKey && type !== undefined) {
                    if (this.waitForAnyKeyType === 'keyboard') {
                        continue;
                    }
                    if (type === 'axes') {
                        if (Math.abs(elemForce) < 0.8) {
                            continue;
                        }
                        let key;
                        let keyName = undefined;
                        for (key in Inputs_1.default.dbInputs.GAMEPADBUTTONS) {
                            if (Inputs_1.default.dbInputs.GAMEPADBUTTONS[key] == i) {
                                keyName = key;
                                break;
                            }
                        }
                        this.waitForAnyKeyCallback({
                            success: true,
                            type: 'gamepad',
                            gamepadType: 'axes',
                            keyName,
                            compositeKeyName: `G${index}.A.${keyName}`,
                            compositeKeyNameWithoutGamepadIndex: `G.A.${keyName}`,
                            sign: elemForce > 0 ? '+' : '-',
                        });
                        this.isWaitingForAnyKey = false;
                    }
                }
                else {
                    (_a = this.inputs) === null || _a === void 0 ? void 0 : _a.setLastEventType(gamepadType);
                    eventBus.emit('move' + i, elemForce, i);
                }
            }
            listener.force = elemForce;
            if (this.handleDown(i, eventBus, listener, elemForce, cTime, gamepadType)) {
                continue;
            }
            if (!this.overSensibility(elemForce) && listener.active) {
                if (this.isWaitingForAnyKey && type !== undefined) {
                    if (this.waitForAnyKeyType === 'keyboard') {
                        continue;
                    }
                    if (type === 'buttons') {
                        let key;
                        let keyName = undefined;
                        for (key in Inputs_1.default.dbInputs.GAMEPADBUTTONS) {
                            if (Inputs_1.default.dbInputs.GAMEPADBUTTONS[key] == i) {
                                keyName = key;
                                break;
                            }
                        }
                        this.waitForAnyKeyCallback({
                            success: true,
                            type: 'gamepad',
                            gamepadType: 'buttons',
                            keyName,
                            compositeKeyName: `G${index}.B.${keyName}`,
                            compositeKeyNameWithoutGamepadIndex: `G.B.${keyName}`,
                        });
                        this.isWaitingForAnyKey = false;
                    }
                }
                else {
                    (_b = this.inputs) === null || _b === void 0 ? void 0 : _b.setLastEventType(gamepadType);
                    let index = gamepadType === 'nintendo' && i < 3 ? (i + 2) % 3 : i;
                    eventBus.emit('up' + index, elemForce, index);
                }
                listener.active = false;
                listener.count = 0;
            }
        }
    }
    handleGamepadAxes(gamepad) {
        for (const ind in this._axesListeners[gamepad.index].listeners) {
            const i = parseInt(ind);
            if (gamepad.axes[i] > 0 &&
                // @ts-ignore
                !this._axesListeners[gamepad.index].listeners[i]) {
                this._btnsListeners[gamepad.index].emit('down' + i);
                // @ts-ignore
                if (this._btnsListeners[gamepad.index].listeners[i]) {
                    // @ts-ignore
                    this._btnsListeners[gamepad.index].listeners[i] = true;
                }
                continue;
            }
        }
    }
    _checkListeners(o, padIndex, num) {
        if (!o[padIndex]) {
            o[padIndex] = new Events_1.default.Emitter();
            o[padIndex].listeners = () => [];
            // addEvent( o[ padIndex ] );
        }
        // @ts-ignore
        if (typeof o[padIndex].listeners[num] == 'undefined') {
            // @ts-ignore
            o[padIndex].listeners[num] = { active: false, force: 0 };
        }
    }
    addListener(o, padIndex, num, action, callBack, noRate) {
        this._checkListeners(o, padIndex, num);
        o[padIndex].on(action + num, callBack);
        // @ts-ignore
        if (o[padIndex].listeners[num])
            o[padIndex].listeners[num].noRate = noRate;
    }
    delListener(o, padIndex, num, action) {
        if (o[padIndex]) {
            o[padIndex].removeListener(action + num);
        }
    }
    delAllOfnum(o, padIndex, num) {
        if (!o[padIndex]) {
            return;
        }
        this.delListener(o, padIndex, num, 'down');
        this.delListener(o, padIndex, num, 'up');
        this.delListener(o, padIndex, num, 'move');
        // @ts-ignore
        delete o[padIndex].listeners[num];
    }
    delAllListenersOfIndex(o, padIndex) {
        if (!o[padIndex]) {
            return;
        }
        for (const i in o[padIndex].listeners) {
            this.delAllOfnum(o, padIndex, parseFloat(i));
        }
    }
    delAllListeners(o) {
        if (!o) {
            return;
        }
        for (const i in o) {
            this.delAllListenersOfIndex(o, parseInt(i));
        }
    }
    //On Btns
    onBtnDown(padIndex, num, callBack, noRate) {
        this.addListener(this._btnsListeners, padIndex, num, 'down', callBack, noRate);
    }
    onBtnMove(padIndex, num, callBack, noRate) {
        this.addListener(this._btnsListeners, padIndex, num, 'move', callBack, noRate);
    }
    onBtnUp(padIndex, num, callBack, noRate) {
        this.addListener(this._btnsListeners, padIndex, num, 'up', callBack, noRate);
    }
    //del Btns
    delBtnDown(padIndex, num) {
        this.delListener(this._btnsListeners, padIndex, num, 'down');
    }
    delBtnMove(padIndex, num) {
        this.delListener(this._btnsListeners, padIndex, num, 'move');
    }
    delBtnUp(padIndex, num) {
        this.delListener(this._btnsListeners, padIndex, num, 'up');
    }
    delBtn(padIndex, num) {
        this.delAllOfnum(this._btnsListeners, padIndex, num);
    }
    delBtnsPad(padIndex) {
        this.delAllListenersOfIndex(this._btnsListeners, padIndex);
    }
    delBtnsListeners() {
        this.delAllListeners(this._btnsListeners);
    }
    //On Axes
    onAxeStart(padIndex, num, callBack, noRate) {
        this.addListener(this._axesListeners, padIndex, num, 'down', callBack, noRate);
    }
    onAxeMove(padIndex, num, callBack, noRate) {
        this.addListener(this._axesListeners, padIndex, num, 'move', callBack, noRate);
    }
    onAxeStop(padIndex, num, callBack, noRate) {
        this.addListener(this._axesListeners, padIndex, num, 'up', callBack, noRate);
    }
    //del Btns
    delAxeStart(padIndex, num) {
        this.delListener(this._axesListeners, padIndex, num, 'down');
    }
    delAxeMove(padIndex, num) {
        this.delListener(this._axesListeners, padIndex, num, 'move');
    }
    delAxeStop(padIndex, num) {
        this.delListener(this._axesListeners, padIndex, num, 'up');
    }
    delAxe(padIndex, num) {
        this.delAllOfnum(this._axesListeners, padIndex, num);
    }
    delAxesPad(padIndex) {
        this.delAllListenersOfIndex(this._axesListeners, padIndex);
    }
    delAxesListeners() {
        this.delAllListeners(this._axesListeners);
    }
    delListeners() {
        this.delAllListeners(this._axesListeners);
        this.delAllListeners(this._btnsListeners);
    }
    plugBtnToInput(inputs, inputName, padIndex, num) {
        this.onBtnDown(padIndex, num, (force) => {
            inputs.usedInputs[inputName].isDown = true;
            inputs.emit('keyDown', inputName, force);
        }, false);
        this.onBtnUp(padIndex, num, (force) => {
            inputs.usedInputs[inputName].isDown = false;
            inputs.emit('keyUp', inputName, force);
        }, false);
        this.onBtnMove(padIndex, num, (force) => {
            inputs.emit('btnMoved', inputName, force);
        }, false);
    }
    plugAxeToInput(Inputs, inputName, padIndex, num) {
        this.onAxeStart(padIndex, num, (force) => {
            Inputs.emit('axeStart', inputName, force);
        }, false);
        this.onAxeStop(padIndex, num, (force) => {
            Inputs.emit('axeStop', inputName, force);
        }, false);
        this.onAxeMove(padIndex, num, (force) => {
            Inputs.emit('axeMoved', inputName, force);
        }, false);
    }
    waitForAnyKey(callback, type) {
        if (type !== 'keyboard' && type !== 'gamepad' && type !== 'all') {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }
        this.isWaitingForAnyKey = true;
        this.waitForAnyKeyType = type;
        this.waitForAnyKeyCallback = callback;
    }
    //Updates changes
    updateByRate() {
        //Update every rate, which allow you to use on...Down to move something
        this.update = this._updateRate;
        this.handleDown = this.handleDownRate;
    }
    updateByChange() {
        //Update at every change
        this.update = this._updateChange;
        this.handleDown = this.handleDownChange;
    }
}
exports.gamepads = gamepads;
const gp = new gamepads();
exports.default = gp;
