import { WaitKeyCallback } from './gamepad';
/**
 * Author
 @Inateno / http://inateno.com / http://dreamirl.com

 * ContributorsList
 @Inateno
 */
declare type InputInfo = {
    inputs: Array<{
        code: string;
        type: string;
    }>;
    interval: number;
    lastCall: number;
    actions: object;
    isDown: boolean;
    isLongPress: boolean;
    stayOn: boolean;
    numberCall: number;
    numberPress: number;
};
declare type Queue = {
    keyDown: {
        [key: string]: Array<any>;
    };
    keyUp: {
        [key: string]: Array<any>;
    };
    btnMoved: {
        [key: string]: Array<any>;
    };
    axeMoved: {
        [key: string]: Array<any>;
    };
    axeStart: {
        [key: string]: Array<any>;
    };
    axeStop: {
        [key: string]: Array<any>;
    };
};
export declare class Inputs {
    DEName: string;
    isListening: boolean;
    isWaitingForAnyKey: boolean;
    waitForAnyKeyType: string;
    waitForAnyKeyCallback: WaitKeyCallback;
    usedInputs: {
        [key: string]: InputInfo;
    };
    isWindowFocused: boolean;
    dontPreventDefault: boolean;
    _keyLocked: boolean;
    _keyLockNamesExceptions: string[];
    dbInputs: {
        KEYBOARD: {
            up: number;
            down: number;
            left: number;
            right: number;
            space: number;
            shift: number;
            caps: number;
            tab: number;
            ctrl: number;
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            '\u00B0': number;
            '=': number;
            '\u00B2': number;
            d: number;
            q: number;
            z: number;
            s: number;
            a: number;
            e: number;
            r: number;
            t: number;
            y: number;
            u: number;
            i: number;
            o: number;
            p: number;
            f: number;
            g: number;
            h: number;
            j: number;
            k: number;
            l: number;
            m: number;
            w: number;
            x: number;
            c: number;
            v: number;
            b: number;
            n: number;
            enter: number;
            return: number;
            'PAD+': number;
            'PAD-': number;
            'PAD*': number;
            'PAD/': number;
            PAD0: number;
            PAD1: number;
            PAD2: number;
            PAD3: number;
            PAD4: number;
            PAD5: number;
            PAD6: number;
            PAD7: number;
            PAD8: number;
            PAD9: number;
            F5: number;
            F11: number;
            F12: number;
            escape: number;
        };
        GAMEPADBUTTONS: {
            A: number;
            B: number;
            Y: number;
            X: number;
            'D-Up': number;
            'D-Right': number;
            'D-Left': number;
            'D-Bot': number;
            select: number;
            start: number;
            RTS: number;
            RBS: number;
            LTS: number;
            LBS: number;
            power: number;
        };
        GAMEPADAXES: {
            LHorizontal: number;
            LVertical: number;
            RHorizontal: number;
            RVertical: number;
        };
        MOUSE: {};
    };
    debugKeys: number[];
    ignoreKeys: number[];
    isShiftDown: boolean;
    queue: Queue;
    constructor();
    /**
     * initialize Inputs listeners with your custom Inputs list
     * called by the main engine file
     * @private
     * @memberOf Inputs
     */
    init(customInputs: Record<string, {
        keycodes: string[];
        interval?: number;
        isLongPress?: boolean;
        stayOn?: boolean;
    }>): void;
    /**
     * return the input data
     * @public
     * @memberOf Inputs
     */
    get(name: string): false | InputInfo;
    /**
     * bind a callback on an event
     * @public
     * @memberOf Inputs
     */
    on(type: keyof Queue, input: string, callback: (value: number) => void): number | undefined;
    /**
     * stop listening an event
     * @public
     * @memberOf Inputs
     */
    stopListening(type: keyof Queue, input: string, index: number): this | undefined;
    /**
     * Trigger manually an event
     * @public
     * @memberOf Inputs
     */
    emit(eventType: keyof Queue, keyName: string, val?: any): void;
    /**
     * Return the key state
     * @public
     * @memberOf Inputs
     */
    key(name: string): boolean;
    /**
     * Toggle keyboard listeners
     * @public
     * @memberOf Inputs
     */
    toggleListeners(canvas?: HTMLCanvasElement, bind?: boolean): void;
    /**
     * Search all inputName using the given code/type and return all values in an array
     * @public
     * @memberOf Inputs
     * @param {String} code - key name: up, shift, space, A, etc...
     * @param {String} type - KEYBOARD / GAMEPADBUTTONS / GAMEPADAXES
     */
    findInputs(code: string, type: 'KEYBOARD' | 'GAMEPADBUTTONS' | 'GAMEPADAXES'): false | string[];
    /**
     * When a keyDown event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyDown(event: KeyboardEvent): boolean;
    /**
     * When a keyUp event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyUp(event: KeyboardEvent): boolean;
    /**
     * When a keyPress event occurs, it parse it and trigger every match with our custom inputs
     * !! Because I never needed this, it's empty. I found this useless for games, but in case the method is here and ready to be used
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    keyPress(event: KeyboardEvent): void;
    /**
     * Register a callback to be called when a key of specified type is pressed
     * @public
     * @memberOf Inputs
     * @param {function} callback
     * @param {string} type - gamepad or keyboard
     */
    waitForAnyKey(callback: WaitKeyCallback, type?: string): void;
    /**
     * Lock keys with exceptions
     * @public
     * @memberOf Inputs
     * @param {string[]} exceptions
     */
    lockKeys(exceptions: string[]): void;
    /**
     * Unlock keys
     * @public
     * @memberOf Inputs
     */
    unlockKeys(): void;
    get keyLocked(): boolean;
    set keyLocked(value: boolean);
}
declare const _default: Inputs;
export default _default;
