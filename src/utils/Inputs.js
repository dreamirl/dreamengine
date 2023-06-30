"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inputs = void 0;
const config_1 = __importDefault(require("../config"));
const Events_1 = __importDefault(require("./Events"));
const gamepad_1 = __importDefault(require("./gamepad"));
const Localization_1 = __importDefault(require("./Localization"));
const Time_1 = __importDefault(require("./Time"));
/**
 * An Inputs lib to detect keyboard and gamepad events, easily bindable and multiple bind
 * !! there is no all KEYBOARD keys, but you can easily add some, and share it if you want, I will add them !!
 * @namespace Inputs
 */
const _langs = {
    en: {
        'leave-page': "By leaving the page you'll lost any progression unsaved.",
    },
    fr: {
        'leave-page': 'En quittant la page vous allez perdre toute progression non sauvegardé.',
    },
};
class Inputs {
    constructor() {
        this.DEName = 'Inputs';
        this._enable = true;
        this.isListening = false;
        this.isWaitingForAnyKey = false;
        this.waitForAnyKeyType = 'keyboard';
        this.waitForAnyKeyCallback = () => { };
        this.usedInputs = {};
        this.isWindowFocused = true;
        this.dontPreventDefault = false;
        this._keyLocked = false;
        this._keyLockNamesExceptions = [];
        this._lastEventType = 'keyboard';
        this.dbInputs = {
            KEYBOARD: {
                up: 38,
                down: 40,
                left: 37,
                right: 39,
                space: 32,
                shift: 16,
                caps: 20,
                tab: 9,
                ctrl: 17,
                0: 48,
                1: 49,
                2: 50,
                3: 51,
                4: 52,
                5: 53,
                6: 54,
                7: 55,
                8: 56,
                9: 57,
                '°': 219,
                '=': 187,
                '²': 222,
                d: 68,
                q: 81,
                z: 90,
                s: 83,
                a: 65,
                e: 69,
                r: 82,
                t: 84,
                y: 89,
                u: 85,
                i: 73,
                o: 79,
                p: 80,
                f: 70,
                g: 71,
                h: 72,
                j: 74,
                k: 75,
                l: 76,
                m: 77,
                w: 87,
                x: 88,
                c: 67,
                v: 86,
                b: 66,
                n: 78,
                enter: 13,
                return: 8,
                'PAD+': 107,
                'PAD-': 109,
                'PAD*': 106,
                'PAD/': 111,
                PAD0: 96,
                PAD1: 97,
                PAD2: 98,
                PAD3: 99,
                PAD4: 100,
                PAD5: 101,
                PAD6: 102,
                PAD7: 103,
                PAD8: 104,
                PAD9: 105,
                F5: 116,
                F11: 122,
                F12: 123,
                escape: 27,
            },
            GAMEPADBUTTONS: {
                A: 0,
                B: 1,
                Y: 3,
                X: 2,
                'D-Up': 12,
                'D-Right': 15,
                'D-Left': 14,
                'D-Bot': 13,
                select: 8,
                start: 9,
                RTS: 7,
                RBS: 5,
                LTS: 6,
                LBS: 4,
                power: 16,
            },
            GAMEPADAXES: {
                LHorizontal: 0,
                LVertical: 1,
                RHorizontal: 2,
                RVertical: 3,
            },
            MOUSE: {},
        };
        this.debugKeys = [123];
        this.ignoreKeys = [116, 122, 123];
        this.isShiftDown = false;
        this.queue = {
            keyDown: {},
            keyUp: {},
            btnMoved: {},
            axeMoved: {},
            axeStart: {},
            axeStop: {},
        };
        window.addEventListener('focus', () => {
            this.isWindowFocused = true;
        });
        window.addEventListener('blur', () => {
            this.isWindowFocused = false;
        });
    }
    get enable() { return this._enable; }
    set enable(v) {
        this._enable = v;
        gamepad_1.default.enable = v;
    }
    get usedControllerType() {
        return this._lastEventType;
    }
    /**
     * initialize Inputs listeners with your custom Inputs list
     * called by the main engine file
     * @private
     * @memberOf Inputs
     */
    init(customInputs) {
        let newInputs = {};
        for (let i in customInputs) {
            newInputs[i] = {
                inputs: new Array(),
                interval: customInputs[i].interval || 0,
                lastCall: Date.now(),
                actions: {},
                isDown: false,
                isLongPress: customInputs[i].isLongPress || false,
                stayOn: customInputs[i].stayOn || false,
                numberCall: 0,
                numberPress: 0,
            };
            for (let n = 0, I; (I = customInputs[i].keycodes[n]); ++n) {
                let type = I[0] == 'K' || I[0] == 'k' ? 'KEYBOARD' : 'MOUSE';
                let data = I.split('.');
                let gamepadID = 0;
                let name;
                if (data[0][0] == 'G') {
                    if (data[0][1]) {
                        gamepadID = parseInt(data[0][1]);
                    }
                    if (data[1] == 'A') {
                        type = 'GAMEPADAXES';
                    }
                    else {
                        type = 'GAMEPADBUTTONS';
                    }
                    name = data[2];
                }
                else {
                    name = I.slice(2, I.length);
                }
                if (!typeof this.dbInputs[type].hasOwnProperty(name)) {
                    console.log("%cWARN: Inputs: An input couldn't be found in the database, did you respect the caseSensitive ?:" +
                        type +
                        '.' +
                        name +
                        '\n Ignoring it and continue...', 'color:red');
                    continue;
                }
                if (type == 'GAMEPADBUTTONS') {
                    gamepad_1.default.plugBtnToInput(this, i, gamepadID, this.dbInputs[type][name]);
                }
                else if (type == 'GAMEPADAXES') {
                    gamepad_1.default.plugAxeToInput(this, i, gamepadID, this.dbInputs[type][name]);
                }
                newInputs[i].inputs.push({
                    code: this.dbInputs[type][name],
                    type: type,
                });
            }
            newInputs[i].interval = customInputs[i].interval || 0;
            newInputs[i].lastCall = Date.now();
            newInputs[i].actions = {};
            newInputs[i].isDown = false;
            newInputs[i].isLongPress = customInputs[i].isLongPress || false;
            newInputs[i].stayOn = customInputs[i].stayOn || false;
            newInputs[i].numberCall = 0;
            newInputs[i].numberPress = 0;
            if (newInputs[i].stayOn) {
                newInputs[i].lastCall = Date.now() + newInputs[i].interval;
            }
            this.queue['keyDown'][i] = new Array();
            this.queue['keyUp'][i] = new Array();
            // this.queue[ 'mouseDown' ][ i ] = new Array();
            // this.queue[ 'mouseUp' ][ i ]   = new Array();
            this.queue['btnMoved'][i] = new Array();
            this.queue['axeMoved'][i] = new Array();
            this.queue['axeStart'][i] = new Array();
            this.queue['axeStop'][i] = new Array();
        }
        this.queue['axeMoved']['wheelTop'] = new Array();
        this.queue['axeMoved']['wheelDown'] = new Array();
        this.usedInputs = newInputs;
        this.toggleListeners();
        if (config_1.default.ALLOW_ONBEFOREUNLOAD) {
            window.onbeforeunload = (_e) => {
                if (!window.leavePage)
                    return _langs[Localization_1.default.currentLanguage]['leave-page'];
                return '';
            };
            window.onunload = (_e) => {
                Events_1.default.emit('unload-game');
            };
        }
        Events_1.default.on('window-lost-focus', () => {
            for (const i in this.usedInputs) {
                this.usedInputs[i].isDown = false;
            }
        });
    }
    /**
     * return the input data
     * @public
     * @memberOf Inputs
     */
    get(name) {
        if (this.usedInputs[name]) {
            return this.usedInputs[name];
        }
        return false;
    }
    /**
     * bind a callback on an event
     * @public
     * @memberOf Inputs
     */
    on(type, input, callback) {
        if (!this.queue[type][input]) {
            console.log('%cWARN: Inputs: Try to bind on a non existent input ::: ' +
                type +
                ' - ' +
                input, 'color:red');
            return;
        }
        if (this.queue[type][input][this.queue[type][input].length - 1] === null)
            this.queue[type][input][this.queue[type][input].length - 1] = callback;
        else
            this.queue[type][input].push(callback);
        return this.queue[type][input].length - 1;
    }
    /**
     * stop listening an event
     * @public
     * @memberOf Inputs
     */
    stopListening(type, input, index) {
        if (index !== undefined) {
            this.queue[type][input][index] = null;
            return;
        }
        for (let i = 0; i < this.queue[type][input].length; ++i) {
            delete this.queue[type][input][i];
        }
        this.queue[type][input] = [];
        return this;
    }
    /**
     * Trigger manually an event
     * @public
     * @memberOf Inputs
     */
    emit(eventType, keyName, val) {
        if (!this._enable)
            return;
        if (((this._keyLocked && !this._keyLockNamesExceptions.includes(keyName)) ||
            !this.isWindowFocused) &&
            eventType.search('mouse') == -1) {
            return;
        }
        for (let ev = 0; ev < this.queue[eventType][keyName].length; ++ev) {
            if (this.queue[eventType][keyName][ev]) {
                this.queue[eventType][keyName][ev](val);
            }
        }
        Events_1.default.emit(eventType, keyName);
    }
    /**
     * Return the key state
     * @public
     * @memberOf Inputs
     */
    key(name) {
        if ((this.keyLocked && !this._keyLockNamesExceptions.includes(name)) ||
            !this.isWindowFocused)
            return false;
        if (this.usedInputs[name] &&
            this.usedInputs[name].isDown &&
            (!this.usedInputs[name].interval ||
                Date.now() - this.usedInputs[name].lastCall >=
                    this.usedInputs[name].interval / Time_1.default.scaleDelta)) {
            if (!this.usedInputs[name].stayOn) {
                this.usedInputs[name].lastCall = Date.now();
            }
            ++this.usedInputs[name].numberCall;
            return true;
        }
        return false;
    }
    /**
     * Toggle keyboard listeners
     * @public
     * @memberOf Inputs
     */
    toggleListeners(canvas, bind) {
        let target = canvas || window;
        if (this.isListening && !bind) {
            target.removeEventListener('keydown', (e) => this.keyDown(e), false);
            target.removeEventListener('keyup', (e) => this.keyUp(e), false);
            target.removeEventListener('keypress', (e) => this.keyPress(e), false);
        }
        else {
            target.addEventListener('keydown', (e) => this.keyDown(e), false);
            target.addEventListener('keyup', (e) => this.keyUp(e), false);
            target.addEventListener('keypress', (e) => this.keyPress(e), false);
        }
    }
    /**
     * Search all inputName using the given code/type and return all values in an array
     * @public
     * @memberOf Inputs
     * @param {String} code - key name: up, shift, space, A, etc...
     * @param {String} type - KEYBOARD / GAMEPADBUTTONS / GAMEPADAXES
     */
    findInputs(code, type) {
        let inputs = [];
        // parse all gamesInputs
        for (let i in this.usedInputs) {
            // parse each inputs
            for (let t in this.usedInputs[i].inputs) {
                let input = this.usedInputs[i].inputs[t].code, tp = this.usedInputs[i].inputs[t].type;
                if (input == code && tp == type) {
                    inputs.push(i);
                }
            }
        }
        return inputs.length > 0 ? inputs : false;
    }
    setLastEventType(type) {
        if (type === this._lastEventType)
            return;
        this._lastEventType = type;
        Events_1.default.emit('Input-Type-Changed', type);
    }
    /**
     * When a keyDown event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyDown(event) {
        this.setLastEventType('keyboard');
        const e = event || window.event;
        const code = e.which || e.keyCode;
        // we can ignore a list a specified keys (if you are using these for your top-application for example, like F1, F2)
        if (this.ignoreKeys.indexOf(code) != -1) {
            if (this.debugKeys.indexOf(code) != -1) {
                if (config_1.default.DEBUG) {
                    return false;
                }
                e.preventDefault();
            }
            return false;
        }
        // intern Nebula overlay logic, not blocking anything
        if (code == this.dbInputs.KEYBOARD.shift) {
            this.isShiftDown = true;
        }
        else if (this.isShiftDown && code == this.dbInputs.KEYBOARD.tab) {
            Events_1.default.emit('toggle-nebula');
        }
        // PS: you need this to be able to fill a form or whatever because it does a preventDefault which break standard DOM interaction
        if (!this.isWindowFocused) {
            // intern Nebula overlay logic, not blocking anything
            if (code == this.dbInputs.KEYBOARD.escape) {
                // TODO remove this from Inputs and move it to a plugin
                Events_1.default.emit('close-nebula');
            }
            return false;
        }
        if (this.isWaitingForAnyKey) {
            return false;
        }
        const inputsDown = this.findInputs(code.toString(), 'KEYBOARD');
        let shouldPreventDefault = true;
        if (inputsDown !== false) {
            for (let i = 0, input; (input = inputsDown[i]); ++i) {
                if (!this.usedInputs[input].isDown &&
                    Date.now() - this.usedInputs[input].lastCall >=
                        this.usedInputs[input].interval) {
                    /* specific on keydown event handler here */
                    if (!this.usedInputs[input].isDown) {
                        if (this._keyLocked &&
                            !this._keyLockNamesExceptions.includes(input)) {
                            shouldPreventDefault = false;
                            continue;
                        }
                        // 1 because it's a keyDown event
                        this.emit('keyDown', input, 1);
                    }
                    if (this.usedInputs[input].isLongPress &&
                        !this.usedInputs[input].stayOn) {
                        this.usedInputs[input].lastCall = Date.now();
                    }
                    this.usedInputs[input].isDown = true;
                }
                // just data, can be useful for stats / achievements / whatever
                ++this.usedInputs[input].numberPress;
            }
        }
        else if (this._keyLocked) {
            return false;
        }
        if (!shouldPreventDefault || this.dontPreventDefault)
            return false;
        e.preventDefault();
        return true;
    }
    /**
     * When a keyUp event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyUp(event) {
        this.setLastEventType('keyboard');
        const e = event || window.event;
        const code = e.which || e.keyCode;
        if (code == this.dbInputs.KEYBOARD.shift) {
            this.isShiftDown = false;
        }
        if (!this.isWindowFocused) {
            return false;
        }
        if (this.isWaitingForAnyKey) {
            let key;
            let keyName = undefined;
            for (key in this.dbInputs.KEYBOARD) {
                if (this.dbInputs.KEYBOARD[key] === code) {
                    keyName = key;
                    break;
                }
            }
            if (this.waitForAnyKeyType !== 'keyboard' &&
                this.waitForAnyKeyType !== 'all') {
                if (keyName === 'escape') {
                    this.isWaitingForAnyKey = false;
                    gamepad_1.default.isWaitingForAnyKey = false;
                    this.waitForAnyKeyCallback({
                        success: false,
                        type: 'gamepad',
                    });
                }
                return false;
            }
            if (keyName !== undefined) {
                this.isWaitingForAnyKey = false;
                gamepad_1.default.isWaitingForAnyKey = false;
                this.waitForAnyKeyCallback({
                    success: true,
                    type: 'keyboard',
                    keyName,
                    compositeKeyName: `K.${keyName}`,
                });
                return false;
            }
        }
        const inputsUp = this.findInputs(code.toString(), 'KEYBOARD');
        if (inputsUp !== false) {
            for (let i = 0, input; (input = inputsUp[i]); ++i) {
                if (this.usedInputs[input].isDown) {
                    if (this._keyLocked) {
                        if (this._keyLockNamesExceptions.includes(input)) {
                            this.emit('keyUp', input);
                        }
                    }
                    else {
                        this.emit('keyUp', input);
                    }
                }
                if (this.usedInputs[input].stayOn) {
                    this.usedInputs[input].lastCall = Date.now();
                }
                this.usedInputs[input].isDown = false;
            }
        }
        return true;
    }
    /**
     * When a keyPress event occurs, it parse it and trigger every match with our custom inputs
     * !! Because I never needed this, it's empty. I found this useless for games, but in case the method is here and ready to be used
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyPress(event) {
        const e = event || window.event;
        const code = e.key;
        const inputsPress = this.findInputs(code, 'KEYBOARD');
        if (inputsPress !== false) {
            // for ( let i = 0, input; input = inputsPress[ i ]; ++i )
            // {
            // if ( Inputs.usedInputs[ input ].isDown )
            // {
            // }
            // Inputs.usedInputs[ isUp ].isDown = false;
            // }
        }
        // needed ?
        // e.preventDefault();
        // return false;
    }
    /**
     * Register a callback to be called when a key of specified type is pressed
     * @public
     * @memberOf Inputs
     * @param {function} callback
     * @param {string} type - gamepad or keyboard
     */
    waitForAnyKey(callback, type = 'all') {
        if (type !== 'keyboard' && type !== 'gamepad' && type !== 'all') {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }
        gamepad_1.default.waitForAnyKey((keyInfo) => {
            this.isWaitingForAnyKey = false;
            this.waitForAnyKeyCallback(keyInfo);
        }, type);
        this.isWaitingForAnyKey = true;
        this.waitForAnyKeyType = type;
        this.waitForAnyKeyCallback = callback;
    }
    /**
     * Lock keys with exceptions
     * @public
     * @memberOf Inputs
     * @param {string[]} exceptions
     */
    lockKeys(exceptions) {
        this._keyLocked = true;
        this._keyLockNamesExceptions = exceptions;
    }
    /**
     * Unlock keys
     * @public
     * @memberOf Inputs
     */
    unlockKeys() {
        this._keyLocked = false;
    }
    get keyLocked() {
        return this._keyLocked;
    }
    set keyLocked(value) {
        this._keyLocked = value;
        this._keyLockNamesExceptions = [];
    }
}
exports.Inputs = Inputs;
exports.default = new Inputs();
