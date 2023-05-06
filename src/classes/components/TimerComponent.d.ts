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
    invoke(callback: () => void, interval?: number, persistent?: boolean, id?: string): string;
    clear(id: string): void;
    /**
     * apply the shake each update
     * You shouldn't call or change this method
     * @protected
     * @memberOf GameObject
     */
    update(time: number): void;
}
