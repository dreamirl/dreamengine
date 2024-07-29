import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';
export default class FadeComponent extends Component {
    private _fadeData;
    private selfDestruct;
    protected _name: string;
    constructor(parent: AdvancedContainer, duration?: number, to?: number, from?: number, force?: boolean, callback?: () => void, selfDestruct?: boolean);
    fade(from: number, to: number, duration: number, force: boolean, callback?: () => void): void;
    fadeTo(to: number, duration: number, force: boolean, callback?: () => void): void;
    fadeOut(duration: number, force: boolean, callback?: () => void): void;
    fadeIn(duration: number, force: boolean, callback?: () => void): void;
    update(time: number): void;
}
