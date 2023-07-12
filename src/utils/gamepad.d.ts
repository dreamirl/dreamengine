import EventEmitter from 'eventemitter3';
import { InputType, Inputs } from './Inputs';
declare type Listener = {
    active: boolean;
    force: number;
    noRate: boolean;
    timesTamp?: number;
    diffTime?: number;
    count?: number;
};
export declare type WaitKeyCallback = (x: {
    success: boolean;
    type: string;
    gamepadType?: string;
    keyName?: string | number;
    compositeKeyName?: string;
    compositeKeyNameWithoutGamepadIndex?: string;
    sign?: string;
}) => void;
export declare class gamepads {
    DEName: string;
    isGamepadConnected: boolean;
    _btnsListeners: {
        [key: number]: EventEmitter;
    };
    _axesListeners: {
        [key: number]: EventEmitter;
    };
    _gamepads: InputType[];
    gamepadsInfos: {
        [x: number]: Gamepad | null;
    };
    lastTimeStamps: {
        [x: number]: number | null;
    };
    inputs?: Inputs;
    enable: boolean;
    handleDown: (i: number, eventBus: EventEmitter, listener: Listener, elemForce: number, cTime: number, gamepadType: InputType) => boolean | void;
    isWaitingForAnyKey: boolean;
    waitForAnyKeyType: string;
    waitForAnyKeyCallback: WaitKeyCallback;
    _updateChange: (_t: number) => void;
    _updateRate: (_t: number) => void;
    update: (_t: number) => void;
    init(inputs: Inputs): void;
    filterGamepads(gamepads: (Gamepad | null)[]): (Gamepad | null)[];
    gamepadConnected(e: GamepadEvent): void;
    handleGamepad(gamepad: Gamepad, cTime: number, gamepadType: InputType): void;
    disconnectGamepad(index: number): void;
    getGamepadsLength(): number;
    _sensibility: number;
    overSensibility(force: number): boolean;
    handleDownChange(i: number, eventBus: EventEmitter, listener: Listener, elemForce: number, _cTime: number, gamepadType: InputType): void;
    _firstRate: number;
    _rate: number;
    handleDownRate(i: number, eventBus: EventEmitter, listener: Listener, elemForce: number, cTime: number, gamepadType: InputType): boolean;
    handleListeners(index: number, gamepadInterface: readonly (number | GamepadButton)[], arrayListeners: {
        [key: number]: EventEmitter;
    }, cTime: number, type: string, gamepadType: InputType): void;
    handleGamepadAxes(gamepad: Gamepad): void;
    _checkListeners(o: {
        [key: number]: EventEmitter;
    }, padIndex: number, num: number): void;
    addListener(o: {
        [key: number]: EventEmitter;
    }, padIndex: number, num: number, action: string, callBack: (x: number) => void, noRate: boolean): void;
    delListener(o: {
        [key: number]: EventEmitter;
    }, padIndex: number, num: number, action: string): void;
    delAllOfnum(o: {
        [key: number]: EventEmitter;
    }, padIndex: number, num: number): void;
    delAllListenersOfIndex(o: {
        [key: number]: EventEmitter;
    }, padIndex: number): void;
    delAllListeners(o: {
        [key: number]: EventEmitter;
    }): void;
    onBtnDown(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    onBtnMove(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    onBtnUp(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    delBtnDown(padIndex: number, num: number): void;
    delBtnMove(padIndex: number, num: number): void;
    delBtnUp(padIndex: number, num: number): void;
    delBtn(padIndex: number, num: number): void;
    delBtnsPad(padIndex: number): void;
    delBtnsListeners(): void;
    onAxeStart(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    onAxeMove(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    onAxeStop(padIndex: number, num: number, callBack: (x: number) => void, noRate: boolean): void;
    delAxeStart(padIndex: number, num: number): void;
    delAxeMove(padIndex: number, num: number): void;
    delAxeStop(padIndex: number, num: number): void;
    delAxe(padIndex: number, num: number): void;
    delAxesPad(padIndex: number): void;
    delAxesListeners(): void;
    delListeners(): void;
    plugBtnToInput(inputs: Inputs, inputName: string, padIndex: number, num: number): void;
    plugAxeToInput(Inputs: Inputs, inputName: string, padIndex: number, num: number): void;
    waitForAnyKey(callback: WaitKeyCallback, type: string): void;
    updateByRate(): void;
    updateByChange(): void;
}
declare const gp: gamepads;
export default gp;
