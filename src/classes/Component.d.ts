import AdvancedContainer from './AdvancedContainer';
import * as PIXI from 'pixi.js';
export default class Component {
    readonly parent: AdvancedContainer;
    private _enable;
    protected _name: string;
    constructor(parent: AdvancedContainer);
    _update(time: number): void;
    protected update(_time: number): void;
    get name(): string;
    get enable(): boolean;
    set enable(bool: boolean);
    destroy(): void;
    protected _onEnable: () => void;
    get onEnable(): () => void;
    set onEnable(callback: () => void);
    protected _onDisable: () => void;
    get onDisable(): () => void;
    set onDisable(callback: () => void);
    protected _onDestroy: () => void;
    get onDestroy(): () => void;
    set onDestroy(callback: () => void);
    private _emitter;
    get emitter(): PIXI.utils.EventEmitter<string | symbol>;
}
