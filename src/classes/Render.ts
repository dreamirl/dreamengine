import EventEmitter from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { DisplayObject } from 'pixi.js';
import config from '../config';
import MainLoop from '../MainLoop';
import Events from '../utils/Events';
import Time from '../utils/Time';
import Camera from './Camera';
import Gui from './Gui';

type UpdatableClasses = Camera | Gui;
class UpdatableContainer extends PIXI.Container {
  constructor() {
    super();
  }

  updatables: UpdatableClasses[] = [];
  add(...updatables: UpdatableClasses[]) {
    this.updatables.push(...updatables);
    this.addChild(...updatables);
  }
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
class Render extends EventEmitter {
  /**
   * save the previous real size (not the canvas size but the visible size without any resize)
   * this is used to calculate correctly the resize
   * @protected
   * @memberOf Render
   */
  private _savedSizes = new PIXI.Point(100, 100);

  /**
   * can be used to convert every draw to initial size when the Render has a resizeMode (compared to the first declaration)
   * @protected
   * @memberOf Render
   */
  private _drawRatio = 1;

  /**
   * This is the ratio to the get initial conception sizes when the user change quality setting, if provided
   * TODO: calculate if when quality change, must do the quality settings issue #20
   * @todo
   * @private
   * @memberOf Render
   */
  private _qualityRatio = 1;

  /**
   * the PIXI Renderer
   * @public
   * @memberOf Render
   * @type {PIXI.AbstractRenderer}
   */
  public pixiRenderer: PIXI.AbstractRenderer;

  /**
   * For convenience we use a PIXI.Container to add each scenes to, this way we just need to render this container
   * @public
   * @memberOf Render
   * @type {PIXI.Container}
   */
  public mainContainer = new UpdatableContainer();

  // TODO NEED camera distinction ? this.cameras = [];
  // TODO NEED ?? this.scenes = []; // waiting to be decided on camera or not, I push scenes here and render it

  public debugRender = new PIXI.Text(
    'DEBUG Enable \nDeltaTime: 1\nFPS: 60',
    new PIXI.TextStyle({
      fill: 'white',
      fontSize: 14,
      fontFamily: '"Lucida Console", Monaco, monospace',
      strokeThickness: 2,
    }),
  );

  public id = '';
  public divId = this.id;
  public div: HTMLElement = window.document.body;

  public enable = true; // set to false to prevent render and update
  public frozen = false; // set to true to prevent update but keep render

  /**
   * Store the resize mode in a string, call changeResizeMode if you want to dynamically change this
   * @private
   * @memberOf Render
   * @type {String}
   */
  private _resizeMode: ResizeMode = '';

  /**
   * The resize method called on event resize
   * @private
   * @memberOf Render
   * @type {Function}
   */
  private _resizeMethod = function (w: number, h: number) {};
  /**
   * Flag to prevent potential double event binding
   * @private
   * @memberOf Render
   * @type {Bool}
   */
  private _listeningResize = false;

  /**
   * flag if you use HTML5 Fullscreen API
   * @protected
   * @memberOf Render
   * @type {Boolean}
   */
  public isFullscreen = false;

  private __inited = false;

  public view: HTMLCanvasElement;

  constructor(
    id: string = 'render-' +
      Date.now() +
      '-' +
      ((Math.random() * Date.now()) >> 0),
    params: any = {},
  ) {
    super();

    if (params.width !== undefined) this._savedSizes.x = params.width;
    if (params.height !== undefined) this._savedSizes.y = params.height;

    this.pixiRenderer = PIXI.autoDetectRenderer({
      width: params.width,
      height: params.height,
      useContextAlpha: params['useContextAlpha'] || true,
      autoDensity: params['autoDensity'] || true,
      antialias: params['antialias'] || false,
      preserveDrawingBuffer: params['preserveDrawingBuffer'] || false,
      backgroundColor: params['backgroundColor'] || 0x000000,
      backgroundAlpha: params['backgroundAlpha'] || 1,
      clearBeforeRender: params['clearBeforeRender'] || true,
      resolution: params['resolution'] || 1,
      forceCanvas: params['forceCanvas'] || false,
      powerPreference: params['powerPreference'],
    });
    this.view = this.pixiRenderer.view;

    PIXI.settings.SCALE_MODE =
      params['scaleMode'] !== undefined
        ? params['scaleMode']
        : PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.ROUND_PIXELS = params['roundPixels'] || false;
    // this.pixiRenderer.plugins.interaction.mousedown

    this.debugRender.y = 10;
    this.debugRender.x = 10;

    Events.on('change-debug', (debug, level) => {
      if (level > 0) {
        this.mainContainer.addChild(this.debugRender);
      } else {
        this.mainContainer.removeChild(this.debugRender);
      }
    });

    this._resizeMode = params.resizeMode || null;

    if (id) {
      this.id = id;
      this.divId = id;
    }
  }

  /**
   * create the parent div, add it to the dom, add this render to the MainLoop
   * bind Inputs, then call updateSizes
   * @public
   * @memberOf Render
   */
  init() {
    if (this.__inited) {
      return;
    }

    this.__inited = true;

    this.div = document.getElementById(this.divId) || window.document.body;
    if (!this.div) {
      throw new Error("Can't found the div by the given id");
      return;
    }

    this.div.appendChild(this.pixiRenderer.view);

    MainLoop.addRender(this);

    this.pixiRenderer.view.setAttribute('id', this.id);

    // update resize if needed
    if (this._resizeMode) {
      this.changeResizeMode(this._resizeMode);
      this._onResize();
      this._bindResizeEvent();
    }

    // TODO - this was used only to bind touch/mouse events, if we use the PIXI interactions, it's not required anymore
    // Inputs.addRender( this );

    // TODO - update the quality rendering mode (change resolutions and physicRatio)
    // this.updateSizes();

    this.div.addEventListener(
      'fullscreenchange',
      (e) => {
        this.isFullscreen = !!document.fullscreenElement;
      },
      false,
    );
  }

  /**
   * change real size when change quality (all images are also reloaded in an other resolution to keep the drawRatio ok)
   * this will update the "physical ratio" which you should use when you are doing calculation based on objects positions (if using qualities)
   * @protected
   * @memberOf Render
   */
  /*updateQualitySizes function()
{
};*/

  /**
   * resize with ratio, stretched or not
   * @public
   * @memberOf Render
   */
  resizeRatio(w: number, h: number, stretch: boolean = false) {
    let baseW = this._savedSizes.x;
    let baseH = this._savedSizes.y;
    let calcRatio = w / baseW;

    if (calcRatio * baseH > h) {
      calcRatio = h / baseH;
    }

    let newW = (calcRatio * baseW) >> 0;
    let newH = (calcRatio * baseH) >> 0;

    // if we want to stretch the canvas to keep the same viewport size
    if (stretch) {
      this.pixiRenderer.resize(baseW, baseH);
    } else {
      // resize the PIXI Renderer keeping the good aspect ratio
      this.pixiRenderer.resize(newW, newH);
    }

    if (this.div != window.document.body) {
      this.div.style.width = newW + 'px';
      this.div.style.height = newH + 'px';
      this.pixiRenderer.view.style.width = newW + 'px';
      this.pixiRenderer.view.style.height = newH + 'px';
    }

    this.div.style.marginLeft = (w - newW) / 2 + 'px';
    this.div.style.marginTop = (h - newH) / 2 + 'px';

    this._drawRatio = newW / this._savedSizes.x;
    this.emit('resize', this._drawRatio);
  }

  /**
   * change current resize mode
   * @public
   * @memberOf Render
   */
  changeResizeMode(mode: ResizeMode) {
    this._resizeMode = mode;
    switch (mode) {
      case 'stretch-ratio':
      case 'ratio-stretch':
        this._resizeMethod = function (screenW, screenH) {
          this.resizeRatio(screenW, screenH, true);
        };
        break;
      case 'stretch':
        // resize stretch = take immediately all the space available with a stretch
        this._resizeMethod = function (screenW, screenH) {
          // this.pixiRenderer.autoDensity = true; // TODO fix this or remove it ?
          this.pixiRenderer.resize(screenW, screenH);
          // this.pixiRenderer.autoDensity = false; // TODO fix this or remove it ?
          this.pixiRenderer.resize(this._savedSizes.x, this._savedSizes.y);
        };
        break;
      case 'full':
        // resize full = take immediately all the space available in pure pixel
        this._resizeMethod = function (screenW, screenH) {
          // this.pixiRenderer.autoDensity = true; // TODO fix this or remove it ?
          this.pixiRenderer.resize(screenW, screenH);
        };
        break;
      // resize and respect the original ratio, but not stretching
      case 'ratio':
        this._resizeMethod = function (screenW, screenH) {
          this.resizeRatio(screenW, screenH, false);
        };
        break;
      default:
        this._resizeMethod = function () {};
        break;
    }
  }

  /****
   * method called when event resize occurs
   * @private
   * @memberOf Render
   */
  _onResize() {
    let screenW = window.innerWidth || document.documentElement.clientWidth;
    let screenH = window.innerHeight || document.documentElement.clientHeight;

    if (this.div.parentElement) {
      let divParentH = window
        .getComputedStyle(this.div.parentElement, null)
        .getPropertyValue('height');
      if (divParentH && screenH < document.body.clientHeight) {
        let divW = this.div.parentElement.clientWidth;
        let divH = this.div.parentElement.clientHeight;

        if (divH < screenH) {
          screenH = divH;
        }
        if (divW < screenW) {
          screenW = divW;
        }
      }
    }

    if (!this._resizeMethod) {
      throw 'Render.js : _onResize need a _resizeMethod, maybe changeResizeMode has never been called';
    }

    this._resizeMethod(screenW, screenH);
  }

  /**
   * bind window resize event if wanted
   * @private
   * @memberOf Render
   */
  _bindResizeEvent() {
    if (!this._resizeMode || this._listeningResize) {
      return;
    }

    this._listeningResize = true;

    let lastResize: number;
    if (window.addEventListener) {
      window.addEventListener(
        'resize',
        () => {
          console.log('resize event appears');
          if (lastResize) window.clearTimeout(lastResize);
          lastResize = window.setTimeout(() => this._onResize(), 50);
        },
        false,
      );
    } else {
      throw 'This browser does not support addEventListener';
    }
  }

  /**
   * render all cameras binded on this Render (called by MainLoop)
   * @private
   * @memberOf Render
   */
  render() {
    if (config.DEBUG_LEVEL) {
      if (config.DEBUG_LEVEL == 'FPS_ONLY') {
        this.debugRender.text = 'FPS: ' + Time.fps;
      } else {
        this.debugRender.text =
          'DeltaTime: ' +
          Time.deltaTime +
          '\nscaleDelta: ' +
          Time.scaleDelta +
          ' - FPS: ' +
          Time.fps;
      }
    }

    this.pixiRenderer.render(this.mainContainer);
  }

  update(time: number) {
    for (let i = 0, c = this.mainContainer.updatables.length; i < c; ++i) {
      this.mainContainer.updatables[i].update(time);
    }
  }

  /**
   * render the given content in this render
   * it's called by the MainLoop when displayLoader is true
   * it can be used in other situation ?
   * @private
   * @memberOf Render
   */
  directRender(container: DisplayObject) {
    this.pixiRenderer.render(container);
  }

  /**
   * add a container to this render
   * You can add a Scene (if you don't need z perspective) or a Camera or a native PIXI.Container
   * @public
   * @memberOf Render
   */
  add(container: UpdatableClasses) {
    this.mainContainer.add(container);
    // TODO need ? this.scenes.push( scene );

    return this;
  }

  public static DEName = 'Render';
}

export default Render;
