import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';
export default class ShakeComponent extends Component {
    /**
     * object used to apply shake
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    private _shakeData;
    private _selfDestruct;
    protected _name: string;
    constructor(parent: AdvancedContainer, xRange?: number, yRange?: number, duration?: number, callback?: () => void, selfDestruct?: boolean);
    /**
     * create a shake with given range
     * you can only have one at a time
     * @public
     * @memberOf GameObject
     * @param {Int} xRange max X gameObject will move to shake
     * @param {Int} yRange max Y gameObject will move to shake
     * @param {Int} [duration=500] time duration
     * @example // shake with 10-10 force during 1sec
     * player.shake( 10, 10, 1000 );
     */
    shake(xRange: number, yRange: number, duration?: number, callback?: () => void): this;
    /**
     * apply the shake each update
     * You shouldn't call or change this method
     * @protected
     * @memberOf GameObject
     */
    update(time: number): void;
}
