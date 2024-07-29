import EventEmitter from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { DisplayObject } from 'pixi.js';
import Camera from './Camera';
import Gui from './Gui';
type UpdatableClasses = Camera | Gui;
declare class UpdatableContainer extends PIXI.Container {
    constructor();
    updatables: UpdatableClasses[];
    add(...updatables: UpdatableClasses[]): void;
}
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor Render
 * @class a Render is globally the canvas in your DOM
 * A Render will render every scene you add to it and is rendered by the MainLoop
 * @example Game.render = new DE.Render( "Test", { size, options } );
 */
declare class Render extends EventEmitter {
    /**
     * save the previous real size (not the canvas size but the visible size without any resize)
     * this is used to calculate correctly the resize
     * @protected
     * @memberOf Render
     */
    private _savedSizes;
    /**
     * can be used to convert every draw to initial size when the Render has a resizeMode (compared to the first declaration)
     * @protected
     * @memberOf Render
     */
    private _drawRatio;
    /**
     * This is the ratio to the get initial conception sizes when the user change quality setting, if provided
     * TODO: calculate if when quality change, must do the quality settings issue #20
     * @todo
     * @private
     * @memberOf Render
     */
    /**
     * the PIXI Renderer
     * @public
     * @memberOf Render
     * @type {PIXI.AbstractRenderer}
     */
    pixiRenderer: PIXI.AbstractRenderer;
    /**
     * For convenience we use a PIXI.Container to add each scenes to, this way we just need to render this container
     * @public
     * @memberOf Render
     * @type {PIXI.Container}
     */
    mainContainer: UpdatableContainer;
    debugRender: PIXI.Text;
    id: string;
    divId: string;
    div: HTMLElement;
    enable: boolean;
    frozen: boolean;
    /**
     * Store the resize mode in a string, call changeResizeMode if you want to dynamically change this
     * @private
     * @memberOf Render
     * @type {String}
     */
    private _resizeMode;
    /**
     * The resize method called on event resize
     * @private
     * @memberOf Render
     * @type {Function}
     */
    private _resizeMethod;
    /**
     * Flag to prevent potential double event binding
     * @private
     * @memberOf Render
     * @type {Bool}
     */
    private _listeningResize;
    /**
     * flag if you use HTML5 Fullscreen API
     * @protected
     * @memberOf Render
     * @type {Boolean}
     */
    isFullscreen: boolean;
    private __inited;
    view: HTMLCanvasElement;
    constructor(id?: string, params?: any);
    /**
     * create the parent div, add it to the dom, add this render to the MainLoop
     * bind Inputs, then call updateSizes
     * @public
     * @memberOf Render
     */
    init(): void;
    /**
     * change real size when change quality (all images are also reloaded in an other resolution to keep the drawRatio ok)
     * this will update the "physical ratio" which you should use when you are doing calculation based on objects positions (if using qualities)
     * @protected
     * @memberOf Render
     */
    /**
     * resize with ratio, stretched or not
     * @public
     * @memberOf Render
     */
    resizeRatio(w: number, h: number, stretch?: boolean): void;
    /**
     * change current resize mode
     * @public
     * @memberOf Render
     */
    changeResizeMode(mode: ResizeMode): void;
    /****
     * method called when event resize occurs
     * @private
     * @memberOf Render
     */
    _onResize(): void;
    /**
     * bind window resize event if wanted
     * @private
     * @memberOf Render
     */
    _bindResizeEvent(): void;
    /**
     * render all cameras binded on this Render (called by MainLoop)
     * @private
     * @memberOf Render
     */
    render(): void;
    update(time: number): void;
    /**
     * render the given content in this render
     * it's called by the MainLoop when displayLoader is true
     * it can be used in other situation ?
     * @private
     * @memberOf Render
     */
    directRender(container: DisplayObject): void;
    /**
     * add a container to this render
     * You can add a Scene (if you don't need z perspective) or a Camera or a native PIXI.Container
     * @public
     * @memberOf Render
     */
    add(container: UpdatableClasses): this;
    static DEName: string;
}
export default Render;
