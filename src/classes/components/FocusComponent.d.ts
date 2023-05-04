import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';
import GameObject from '../GameObject';
export declare type FocusOption = {
    offset?: Point2D;
    x?: boolean;
    y?: boolean;
    rotation?: boolean;
};
export default class FocusComponent extends Component {
    target?: GameObject;
    private _focusOptions;
    private _focusOffsets;
    protected _name: string;
    private isMyTargetAChild;
    constructor(parent: AdvancedContainer, target?: GameObject);
    update(_time: number): void;
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
    focus(target: GameObject, params?: FocusOption): this;
    stopFocus(): this;
}
