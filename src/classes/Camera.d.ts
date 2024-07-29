import * as PIXI from 'pixi.js';
import Scene from './Scene';
import RectRenderer from './renderer/RectRenderer';
import TilingRenderer from './renderer/TilingRenderer';
import AdvancedContainer from './AdvancedContainer';
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
type CameraParams = {
    interactive?: boolean;
    name?: string;
    backgroundImage?: string;
    backgroundColor?: number;
    scale?: Point2D | number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    scene: Scene;
};
/**
 * @constructor Camera
 * @class a Camera will render a Scene<br>
 * This class is optional but provide some cool stuff.<br>
 * With a Camera you can easily make translation in your Scene or GameObjects focuses, without changing every GameObjects positions (which is painful for logic)<br>
 * You have to append the Camera to a Render and have to give it a scene to look at<br>
 * You can move your camera inside a render as you want<br>
 * Also you can make more than one camera in a Render or looking in a scene, this can be used to create split-screen games<br>
 * For this last features you have to use a mask filter, remember this is a heavy operation and can drop your performances<br>
 * <br><br>
 * example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2)
 * and maybe override the render method to call custom rendering for mini-map<br>
 * then you got two camera, these two are looking at the same scene, and are in the same Render
 * your "mini-map" camera is over the first camera
 * <br><br>
 * example2: on a split-screen local multi-player game, you can make one camera by player, with input for each cameras
 * @example Game.camera = new DE.Camera( 1920, 1080, 0, 0, { "name": "mainGame", "backgroundColor": "green" } );
 * @param {Int} width initial width inside the render
 * @param {Int} height initial height inside the render
 * @param {Int} x position in the Render
 * @param {Int} y position in the Render
 * @param {Object} [params] optional parameters
 * @property {String} [name="noname"] name your camera
 * @property {String} [tag="none"] assign tags if it's can be useful for you
 * @property {Scene} [scene=null] you can give a scene on creation, or later
 **/
export default class Camera extends AdvancedContainer {
    id: string;
    private _scene?;
    background: RectRenderer | TilingRenderer | undefined;
    renderSizes: PIXI.Point;
    limits: {
        minX: number | undefined;
        maxX: number | undefined;
        minY: number | undefined;
        maxY: number | undefined;
    };
    constructor(x: number, y: number, width: number, height: number, params: CameraParams);
    /**
     * easy way to shutdown a camera rendering
     * NB: shutdown a camera wont prevent scene to update, set your scene to enable = false if you want to kill it too
     * @public
     * @memberOf Camera
     * @type {Boolean}
     */
    get enable(): boolean;
    set enable(bool: boolean);
    /**
     * Camera is rendering this scene
     * @public
     * @memberOf Camera
     */
    get scene(): Scene | undefined;
    set scene(scene: Scene | undefined);
    /**
     * override the PIXI pointer event to add the "local" camera position in 2nd argument
     * you get/set this method as usual, nothing change
     * WARN: the engine give pos in first argument, and original event in second (not like PIXI)
     * @override
     * @public
     * @memberOf Camera
     */
    get pointermove(): (e: any) => void;
    set pointermove(fn: (e: any) => void);
    get pointerdown(): (e: any) => void;
    set pointerdown(fn: (e: any) => void);
    get pointerup(): (e: any) => void;
    set pointerup(fn: (e: any) => void);
    get pointerover(): (e: any) => void;
    set pointerover(fn: (e: any) => void);
    get pointerout(): (e: any) => void;
    set pointerout(fn: (e: any) => void);
    get pointertap(): (e: any) => void;
    set pointertap(fn: (e: any) => void);
    get pointerupoutside(): (e: any) => void;
    set pointerupoutside(fn: (e: any) => void);
    /**
     * handle pointerevents before calling your custom function
     * this method add an argument "pos" which is the pointer event position + local camera position (to retrieve the true position of the event)
     * @private
     * @memberOf Camera
     */
    _pointerHandler(type: '_customPointerMove' | '_customPointerDown' | '_customPointerUp' | '_customPointerOver' | '_customPointerOut' | '_customPointerTap' | '_customPointerUpOutside', event: PIXI.InteractionEvent): void;
    _pointermove(e: any): void;
    _pointerdown(e: any): void;
    _pointerup(e: any): void;
    _pointerover(e: any): void;
    _pointerout(e: any): void;
    _pointertap(e: any): void;
    _pointerupoutside(e: any): void;
    /**
     * your custom method for handling pointer events is _customPointerEventType (where EventType is the Move/Down etc.)
     * you can directly override these functions or just set via "pointerevent" (the setter will do it correctly for you).
     * @private
     * @memberOf Camera
     */
    private _customPointerMove;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerDown;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerUp;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerOver;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerOut;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerTap;
    /**
     * @private
     * @memberOf Camera
     */
    private _customPointerUpOutside;
    /**
     * this update the lifecycle of the camera, binded on rendering because if a Camera is "off" it doesn't need to be updated
     * @memberOf Camera
     * @protected
     */
    update(time: number): void;
    /**
     * Check camera limits fixed by limits object you set in camera previously.
     * It's useful to setup a world limits, or in a plate-former limit the Y axis (then your camera will stop at the floor, for example)
     * @protected
     * @memberOf Camera
     */
    checkLimits(qualityRatio?: number): void;
    static DEName: string;
}
export {};
