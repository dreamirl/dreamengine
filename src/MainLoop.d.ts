import Component from './classes/Component';
import GameObject from './classes/GameObject';
import Render from './classes/Render';
import Scene from './classes/Scene';
/**
 * @namespace MainLoop
 * The MainLoop namespace handle the call of the next frame, updating scene, rendering and so on
 * MainLoop start when calling DE.start();
 */
export declare class MainLoop {
    static readonly DEName = "MainLoop";
    scenes: Scene[];
    renders: Render[];
    additionalModules: {
        [k: string]: Component;
    };
    launched: boolean;
    displayLoader: boolean;
    /** DO NOT USE */
    loader: GameObject;
    constructor();
    createLoader(): void;
    updateLoaderImage(loader: {
        0: string;
        1: string;
        2?: any;
    }): void;
    loop(): void;
    addScene(scene: Scene): void;
    addRender(render: Render): void;
}
declare const mainLoop: MainLoop;
export default mainLoop;
