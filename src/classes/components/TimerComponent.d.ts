import Component from '../Component';
export default class TimerComponent extends Component {
    /**
     * object used to apply shake
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    private _timers;
    protected _name: string;
    counter: number;
    invoke(callback: () => void, interval?: number, persistent?: boolean, id?: number): number;
    clear(id: number): void;
    clearAll(): void;
    /**
     * apply the shake each update
     * You shouldn't call or change this method
     * @protected
     * @memberOf GameObject
     */
    update(time: number): void;
}
