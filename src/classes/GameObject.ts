import * as PIXI from 'pixi.js';
import config from '../config';
import Time from '../utils/Time';
import AdvancedContainer from './AdvancedContainer';
import Vector2 from './Vector2';
import AnimatedTextureRenderer from './renderer/AnimatedTextureRenderer';
import GraphicRenderer from './renderer/GraphicRenderer';
import RendererInterface from './renderer/RendererInterface';
import SpriteRenderer from './renderer/SpriteRenderer';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor GameObject
 * @class The core of the engine, all is based on GameObjects
 * They can get renderers, collider (can add more than one but not in an array)
 * You can make groups by adding a GameObject to an other (no recursive limit but be prudent with that,
 * I tried a 5 levels hierarchy and this work perfectly, but you shouldn't have to make a lot)
 * @param {object} params - All parameters are optional
 * @author Inateno
 * @example // the most simple example
 * var ship = new DE.GameObject();
 * @example // with positions
 * var ship = new DE.GameObject( { "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player" } );
 * @example // a complete GameObject with a sprite and a CircleCollider
 * var ship = new DE.GameObject( {
 *   "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player"
 *   ,"renderers": [ new DE.SpriteRenderer( { "spriteName": "ship", "offsetY": 100 } ) ]
 *   ,"collider": new DE.CircleCollider( 60, { "offsetY": 50 } )
 * } );
 */

class GameObject extends AdvancedContainer {
  public static DEName = 'GameObject';
  // @ts-ignore
  override parent: GameObject;
  vector2: Vector2;
  renderers: (PIXI.Container & RendererInterface)[] = [];
  renderer: PIXI.Container & RendererInterface;
  _debugRenderer: PIXI.Container | undefined;
  _lastLocalID = '';

  /**
   * If false, the object wont be updated anymore (but still renderer).
   * check visible attribute (from PIXI) to prevent rendering without killing update
   * @public
   * @memberOf GameObject
   * @type {Boolean}
   */
  updatable = true;

  /**
   * Set to true when the (PIXI) position.scope._localID change, that mean the position (x/y) has changed or if z change.
   * If true, the camera will recalculate perspective. It can also be used by Collisions algorithms
   * @private
   * @memberOf GameObject
   */
  _hasMoved = true;

  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  readonly id: string;

  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  override readonly name: string = '';

  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  tag = '';

  /**
   * Flag used in intern logic (for delete) but can be used outside when it's not conflicting with the engine's logic
   *
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  flag = '';

  /**
   * @readOnly
   * @memberOf GameObject
   * @type {Array-GameObject}
   */
  gameObjects: GameObject[] = [];

  /**
   * @private
   * @memberOf GameObject
   * @type {Object}
   */
  _automatisms: Record<string, Automatism> = {};

  /**
   * used to make distinction between gameObject and pure PIXI DisplayObject
   * @private
   * @memberOf GameObject
   * @type {Boolean}
   */
  _isGameObject = true;

  /**
   * store real scale (taking all parent in consideration)
   * worldScale is update directly when calling the constructor
   * this way you can know the real rendering scale (to the screen) with all modifiers
   * @public
   * @memberOf GameObject
   * @type {PIXI.Point}
   */
  worldScale = new PIXI.Point(1, 1);

  /**
   * can prevent event propagation
   * @private
   * @memberOf GameObject
   */
  _killArgs = {
    preventEvents: false,
    preventKillEvent: false,
    preventKilledEvent: false,
  };

  extra: Record<string, any> = {};

  constructor(
    params: Partial<Omit<GameObject, 'scale'>> & {
      automatisms?: Record<string, Automatism>;
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
    } = {},
  ) {
    super();
    this.sortableChildren =
      params.sortableChildren ?? config.DEFAULT_SORTABLE_CHILDREN;

    this.id = params.id !== undefined ? params.id : ((Math.random() * 999999999) >> 0).toString();
    this.name = params.name || '';
    this.tag = params.tag || '';

    this.position.set(params.x || 0, params.y || 0);
    delete params.x;
    delete params.y;

    this.vector2 = new Vector2(this.x, this.y, this);

    if (params.scale) {
      if ((params.scale as Point2D).x)
        this.scale.set(
          (params.scale as Point2D).x,
          (params.scale as Point2D).y,
        );
      else this.scale.set(params.scale as number);
      delete params.scale;
    }
    if (params.scaleX) this.scale.set(params.scaleX, this.scale.y);
    if (params.scaleY) this.scale.set(this.scale.x, params.scaleY);

    // call correctly the scale modifier to update zscale and worldScale

    if (params.renderer) {
      this.addRenderer(params.renderer);
      delete params.renderer;
    }

    if (params.renderers) {
      for (let i = 0; i < params.renderers.length; ++i) {
        this.addRenderer(params.renderers[i]);
      }
      delete params.renderers;
    }

    this.renderer = this.renderers[0];

    if (config._DEBUG) {
      this._createDebugRenderer();
    }

    if (params.gameObjects) {
      this.add(...params.gameObjects);
      delete params.gameObjects;
    }

    // easy way to add custom function/attributes to a GameObject in a one-block declaration
    // for (const [key, value] of Object.entries(params)) {
    //   if (value === 'automatisms') {
    //     continue;
    //   }
    //   this[key] = value;
    // }

    const { automatisms, ...restOfParams } = params;
    Object.assign(this, restOfParams);

    //console.log('Automatisms:', automatisms, 'params:', params);
    // this have to be at the end because we can define function just before
    if (automatisms instanceof Array) {
      console.warn(
        'DreamEngine Deprecation warning, due to types enforcement, the automatisms declaration has changed to "Record<string, Automatism>". Example: automatisms: { identifier: params }',
      );
      automatisms.forEach((auto) => {
        this.addAutomatism(auto[0], {
          methodName: auto[1],
          ...(auto[2] ?? {}),
        });
      });
    } else {
      for (const i in automatisms) {
        this.addAutomatism(i, automatisms[i]);
      }
    }
  }

  public OnDebugChange(debug: boolean, _level: number) {
    if (debug) {
      this._createDebugRenderer();
    } else {
      this._destroyDebugRenderer();
    }

    for (let i = 0, c = this.gameObjects.length; i < c; ++i) {
      this.gameObjects[i].OnDebugChange(debug, _level);
    }
  }

  public get automatisms() {
    return this._automatisms;
  }

  /**
   * if false, object will stop being rendered and stop being updated
   * @public
   * @memberOf GameObject
   * @type {Boolean}
   */
  get enable() {
    return this.updatable || this.visible;
  }
  set enable(value) {
    // this is useful when you want to listen for enable changes externally
    if (this.enable !== value)
      this.emit(value ? 'enable-true' : 'enable-false');

    this.updatable = value;
    this.visible = value;
  }

  override get rotation() {
    return this.transform.rotation;
  }
  override set rotation(value) {
    this.vector2._updateRotation(value);
    this.transform.rotation = value;
  }

  _createDebugRenderer() {
    if (this._debugRenderer) {
      return;
    }

    this._debugRenderer = new GraphicRenderer([
      { beginFill: '0x00FF00' },
      { drawRect: [0, 0, 20, 2] },
      { beginFill: '0xFF0000' },
      { drawRect: [0, 0, 2, 20] },
    ]);
    this.addChild(this._debugRenderer!);
  }

  _destroyDebugRenderer() {
    if (!this._debugRenderer) {
      return;
    }

    this.removeChild(this._debugRenderer);
    this._debugRenderer.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
    this._debugRenderer = undefined;
  }

  /**
   * move gameObject with a vector 2
   * @memberOf GameObject
   * @public
   * @param {Vector2} vector2
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   * @example myObject.translate( { "x": 10, "y": 5 }, false );
   */
  translate(pos: any, absolute: boolean, ignoreDeltaTime = true) {
    this.vector2.translate(pos, absolute, ignoreDeltaTime);
    return this;
  }
  /**
   * move gameObject along x axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  translateX(distance: number, absolute: boolean, ignoreDelta = true) {
    this.translate({ x: distance, y: 0 }, absolute, ignoreDelta);
    return this;
  }
  /**
   * move gameObject along y axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  translateY(distance: number, absolute: boolean, ignoreDelta = true) {
    this.translate({ x: 0, y: distance }, absolute, ignoreDelta);
    return this;
  }

  /**
   * quick access to position.rotate
   * @public
   * @memberOf GameObject
   * @param {Float} angle
   */
  rotate(angle: number, ignoreDelta = true) {
    this.vector2.rotate(angle, ignoreDelta);
    return this;
  }

  /**
   * rotate the GameObject to look at the given 2D position
   * @public
   * @memberOf GameObject
   * @param {Vector2/GameObject} vector2
   * @param {angleOffset}
   * can be a simple position x-y
   */
  lookAt(vector2: any, angleOffset: number) {
    const origin = { x: 0, y: 0 };
    const otherPos = vector2.toGlobal ? vector2.toGlobal(origin) : vector2;
    this.rotation = this.vector2.getAngle(otherPos) + (angleOffset || 0);

    return this;
  }

  /**
   * add a renderer to the gameObject
   * this push the renderer in a distinct array AND set anchor to 50% (if available) + push the render in PIXI child.
   * @public
   * memberOf GameObject
   * param {PIXI.DisplayObject} rd - the renderer to add
   */
  addOneRenderer(rd: PIXI.Container & RendererInterface) {
    if (
      rd.anchor &&
      !rd.preventCenter &&
      rd.anchor.x === 0 &&
      rd.anchor.y === 0
    ) {
      (rd.anchor as PIXI.ObservablePoint).set(0.5, 0.5);
    }

    if (this.renderer == undefined) {
      this.renderer = rd;
    }

    this.renderers.push(rd);
    this.addChild(rd);

    return this;
  }

  /**
   * remove a renderer from the gameObject
   * this remove the renderer in the distinct array AND remove the render from PIXI child.
   * @public
   * memberOf GameObject
   * param {PIXI.DisplayObject} rd - the renderer to remove
   */
  removeOneRenderer(rd: PIXI.Container & RendererInterface) {
    this.renderers.splice(this.renderers.indexOf(rd), 1);
    this.removeChild(rd);

    if (this.renderers.length === 0) {
      //@ts-ignore force memory clear
      this.renderer = undefined;
    }

    return this;
  }

  getRendererWidth() {
    return this.renderer?.texture.width;
  }

  getRendererHeight() {
    return this.renderer?.texture.height;
  }

  addRenderer(...rds: (PIXI.Container & RendererInterface)[]) {
    rds.forEach((r) => this.addOneRenderer(r));
    return this;
  }

  removeRenderer(...rds: (PIXI.Container & RendererInterface)[]) {
    rds.forEach((r) => this.removeOneRenderer(r));
    return this;
  }

  /**
   * add all given gameObjects as children's, if you add only one gameObject, call addOne
   * you can call this method with array, single object, or multi arguments objects, look at examples.
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.add( car ); // just one object, you should call addOne instead
   * @example myObject.add( car, car2, car3, banana, turtle ); // using multi arguments
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * myObject.add( myArray ); // then call add with array directly
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * var myArray2 = [ object4, object5, object6 ]; // declare a second array with object inside as you wish
   * myObject.add( myArray, myArray2 ); // then call add with array and multi arguments
   */
  add(...gameObjects: Array<GameObject>) {
    gameObjects.forEach((go) => this.addOne(go));

    // TODO used to sort z-index
    // this.sortChildren();

    return this;
  }

  /**
   * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.addOne( car );
   */
  addOne(object: GameObject) {
    if (!(object instanceof GameObject)) {
      throw new Error(
        'DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please',
      );
    }

    if (object.parent && object.parent instanceof GameObject) {
      object.parent.remove(object); //TODO: ZARNA | A review Antoine (j'ai remplacé remove par removeChild vu que y'a pas remove sur PIXI.Container)
    }

    this.gameObjects.push(object);
    object._updateWorldScale();

    this.addChild(object);

    if (config._DEBUG && !object._debugRenderer) {
      object._createDebugRenderer();
    }

    return this;
  }

  /**
   * remove a the given child in this GameObject gameObjects
   * also call PIXI.removeChild
   * @public
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference
   */
  remove(object: GameObject) {
    const index = this.gameObjects.indexOf(object);

    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      this.removeChild(object);
    }
    return object;
  }

  /**
   * delete the object
   * @protected
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference or object index in the gameObjects array
   */
  delete(object: GameObject) {
    const target = this.remove(object);

    target.killMePlease();
    return this;
  }

  /**
   * delete all children objects
   * @protected
   * @memberOf GameObject
   */
  deleteAll() {
    while (this.gameObjects.length) {
      const target = this.remove(this.gameObjects[0]);
      target.killMePlease();
    }
    return this;
  }

  /**
   * delete the object<br>
   * this is the good way to destroy an object in the scene<br>
   * the object is disable and the mainloop will destroy it at the next frame<br>
   * emit a kill event with current instance, and call onKill method if provided
   * @public
   * @memberOf GameObject
   * @param {Object} [params]
   * @property {Boolean} [preventEvents] will prevent all kill events
   * @property {Boolean} [preventKillEvent] will prevent the kill event
   * @property {Boolean} [preventKilledEvent] will prevent the killed event
   * if you provide preventEvents, all kill events will be prevented
   * @example myObject.askToKill();
   * @example myObject.askToKill( { preventEvents: true } );
   */
  askToKill(params: any = {}) {
    this._killArgs = params;

    if (!this._killArgs.preventEvents && !this._killArgs.preventKillEvent) {
      if (this.onKill) {
        this.onKill();
      }
      this.emit('kill', this);
    }

    this.enable = false;
    this.flag = 'delete';

    if (
      !this.parent ||
      (this.parent instanceof GameObject && !this.parent.enable)
    ) {
      this.killMePlease();
    }

    return this;
  }

  /**
   * If you want to get an intern method when your object is killed<br>
   * usefull when you make your own GameObjects classes, and don't want to inherit all the "on("kill")" events registered<br>
   * here the list of killed events:<br>
   * - onKill: when you called askToKill<br>
   * - onKilled: when your object is deleted (just before we remove collider and childs, so you can still do actions on)
   * @public
   * @override
   * @memberOf GameObject
   * @function
   * @example myObject.onKill = function(){ console.log( "I'm dead in 16 milliseconds !" ); };
   * @example myObject.onKilled = function(){ console.log( "Ok, now I'm dead" ); };
   * @example myObject.on( "kill", function( currentObject ){ console.log( "I'm dead in 16 milliseconds !" ); } );
   * @example myObject.on( "killed", function( currentObject ){ console.log( "Ok, now I'm dead" ); } );
   */
  onKill() {
    return;
  } // TODO: ZARNA | Antoine ok ?
  onKilled() {
    return;
  } // TODO: ZARNA | Antoine ok ?

  /**
   * this function is called when the update loop remove this GameObject (after an askToKill call)<br>
   * you shouldn't call it directly, if you do it, maybe other GameObjects in the current
   * frame are dealing with this one and should produce errors<br>
   * <b>if you provided to askToKill a preventEvents or a preventKilledEvent this will
   * not emit killed event and will not call onKilled method if provided</b>
   * @protected
   * @memberOf GameObject
   */
  killMePlease() {
    if (this.flag === 'deleted') {
      return;
    }

    this.enable = false;
    this.flag = 'deleted';

    //TODO: ZARNA | A review Antoine : certain que c'est toujours utile/le cas ?
    // check if object isn't already destroyed and there is children inside 'cause PIXI don't do it
    // and prevent crash (if user ask multiple destroy)
    // if (!this.children) {
    //   this.children = [];
    // }

    while (this.gameObjects.length > 0) {
      const obj = this.remove(this.gameObjects[0]);
      obj.killMePlease();
    }

    if (!this._killArgs.preventEvents && !this._killArgs.preventKilledEvent) {
      if (this.onKilled) this.onKilled();

      this.emit('killed', this);
    }

    if (this.vector2) {
      this.vector2.gameObject = undefined;
    }
    //@ts-ignore force memory clear
    this.vector2 = undefined;
    //@ts-ignore force memory clear
    delete this.extra;
    this._debugRenderer = undefined;
    this.removeAutomatisms();
    this.removeAllListeners();
    //@ts-ignore force memory clear
    this.worldScale = undefined;
    //@ts-ignore force memory clear
    delete this._killArgs;

    this.destroy({
      children: true,
      // baseTexture: this.destroyTextureOnKill, //TODO: ZARNA | A review Antoine : this.destroyTextureOnKill n'existe pas ?
      // texture: this.destroyTextureOnKill, //TODO: ZARNA | A review Antoine : this.destroyTextureOnKill n'existe pas ?
    });

    this.removeRenderer(...this.renderers);
    //@ts-ignore force memory clear
    this.parent = undefined;
  }

  /**
   * this function return the "world" rotation of the object.
   * It doesn't include render/scene/camera rotation
   * @memberOf GameObject
   * @public
   */
  getGlobalRotation(): number {
    if (this.parent instanceof GameObject && this.parent.getGlobalRotation) {
      return this.rotation + this.parent.getGlobalRotation();
    } else {
      return this.rotation;
    }
  }

  /**
   * DEPRECATED you should use emit
   * support for old version using trigger and not emit (I personally prefer emit when it's a client/server communication, and trigger when it's not services communication related )
   * but the engine will always support trigger AND emit
   * @deprecated
   * @public
   * @memberOf GameObject
   */
  trigger(event: string, ...args: Array<any>) {
    this.emit(event, ...args);
  }

  /**
   * DEPRECATED you should use getGlobalPosition (from PIXI)
   * support for old version of the engine, return world Position
   * @deprecated
   * @public
   * @memberOf GameObject
   */
  getPos() {
    return this.getGlobalPosition();
  }

  // a tester
  getWorldPos(): Point2D {
    if (
      this.parent &&
      this.parent instanceof GameObject &&
      this.parent.getWorldPos
    ) {
      const pos = this.parent.getWorldPos();
      const harmonics = this.parent.vector2.getHarmonics();

      return {
        x:
          -(
            -this.position.x * harmonics.cos +
            this.position.y * harmonics.sin
          ) + pos.x,
        y:
          -(
            -this.position.x * harmonics.sin +
            this.position.y * -harmonics.cos
          ) + pos.y,
      };
    }

    return { x: this.x, y: this.y };
  }

  /**
   * This provide you a way to make your custom update / logic<br>
   * You have to set a name on your automatism (to be able to remove it/change it later)
   * if you provide a name already used you automatism will be overred<br>
   * - if you set an interval, this automatism will be called each MS given<br>
   * - if you set persistent to false, it will be removed after the first call<br>
   *<b>This method call only a protected/public method member of your GameObject</b>
   * @public
   * @memberOf GameObject
   * @param {String} id unique id to be able to remove it later
   * @param {String} methodName the method to call each time
   * @param {Object} [params] parameters see below
   * @property {Int} [interval] delay between 2 calls
   * @property {Boolean} [persistent] if false, your automatism will be called only once
   * @property {Undefined} [value1] you can provide a first value
   * @property {undefined} [value2] you can provide a second value
   * @example
   * // this will call myObject.gameLogic() each updates
   * myObject.addAutomatism( "logic", "gameLogic" );
   * @example
   * // this will call myObject.checkInputs() each 500ms
   * myObject.addAutomatism( "inputs", "checkInputs", { "interval": 500 } );
   * @example
   * // this will call myObject.translate() once in 2.5 seconds
   * myObject.addAutomatism( "killMeLater", "askToKill", {
   *   "interval": 2500
   *   , "args": [ { x: 10, y: 10 } ] // we want prevent the kills events fired when die
   *   , "persistent": false
   * } );
   */
  addAutomatism(id: string, params: Partial<Automatism> = {}) {
    if (!params.methodName) {
      params.methodName = id;
    }
    if (!this[params.methodName as keyof typeof this]) {
      console.warn(
        "%cCouldn't found the method " +
          params.methodName +
          ' in your GameObject prototype',
        1,
        'color:red',
      );
      return;
    }

    const automatism: Automatism = {
      interval: params.interval ?? 0,
      timeSinceLastCall: 0,
      methodName: params.methodName,
      value1: params.value1 || undefined,
      value2: params.value2 || undefined,
      args: params.args || undefined,
      persistent: params.persistent != false ? true : false,
    };

    this._automatisms[id] = automatism;
  }

  /**
   * remove the automatism by id (the one you provided on creation)
   * @public
   * @memberOf GameObject
   * @param {String} id automatism id to remove
   * @example
   * myObject.removeAutomatism( "logic" );
   */
  removeAutomatism(id: string) {
    if (!this._automatisms[id]) {
      // console.warn( "%c[RemoveAutomatism] Automatism " + id + " not found", 1, "color:orange" );
      return;
    }
    delete this._automatisms[id];
  }

  /**
   * remove all automatisms
   * @public
   * @memberOf GameObject
   */
  removeAutomatisms() {
    for (const i in this._automatisms) {
      delete this._automatisms[i];
    }
  }

  /**
   * inverse values of an automatism
   * useful for "ping-pong" moves, fades, snaking, and patrols logics
   * this works with args OR value1 and value2
   * @public
   * @memberOf GameObject
   * @example
   * myObject.inverseAutomatism( "translateY" ); // this will inverse the value applied on the automatized translateY action
   */
  inverseAutomatism(autoName: string) {
    const at = this._automatisms[autoName];

    if (at.args) {
      for (let i = 0; i < at.args.length; ++i) {
        at.args[i] = -at.args[i];
      }
    } else {
      at.value1 = -at.value1;
      at.value2 = -at.value2;
    }
  }

  /**
   * _updateWorldScale is the same as _updateScale but it take every parent scale in consideration.
   * use worldScale when you want to know what is the "real" scale of the current object
   * for example, with Ship contain Reactor.
   * if Ship.scale = 0.5 then Reactor.wordScale = 0.5
   * if Ship.scale = 0.5 and Reactor.scale = 0.5 then Reactor.worldScale = 0.25
   * @private
   * @memberOf GameObject
   */
  _updateWorldScale() {
    this.worldScale.set(this.scale.x, this.scale.y);

    if (
      !this.parent ||
      (this.parent instanceof GameObject && !this.parent._isGameObject)
    ) {
      return;
    }

    if (this.parent instanceof GameObject) {
      this.worldScale.x = this.worldScale.x * this.parent.worldScale.x;
      this.worldScale.y = this.worldScale.y * this.parent.worldScale.y;
    }

    return this;
  }

  override update(time: number) {
    if (!this.updatable) {
      return;
    }

    // execute registered automatisms
    for (const a in this._automatisms) {
      const auto = this._automatisms[a];
      auto.timeSinceLastCall += Time.frameDelayScaled;
      if (auto.timeSinceLastCall > auto.interval) {
        auto.timeSinceLastCall -= auto.interval;
        // i think calling apply each update is slower than calling v1/v2. Should benchmark this

        const localMethod = this[auto.methodName as keyof typeof this];
        if (typeof localMethod === 'function') {
          if (auto.args) {
            localMethod.call(this, ...auto.args);
          } else {
            localMethod.call(this, auto.value1, auto.value2);
          }
        } else {
          console.warn('Automatism call is not a function', auto.methodName);
        }

        // if this one isn't persistent delete it
        if (!auto.persistent) {
          delete this._automatisms[a];
        }
      }
    }

    // childs update
    for (let c = 0, g; (g = this.gameObjects[c]); c++) {
      if (g.flag !== null) {
        switch (g.flag) {
          case 'delete':
            this.delete(g);
            --c;
            continue;
        }
      }
      g.update(time);
    }

    // this apply update on each renderer
    if (this.visible) {
      for (let i = 0, r; (r = this.renderers[i]); ++i) {
        if ((r as AnimatedTextureRenderer | SpriteRenderer).update) {
          (r as AnimatedTextureRenderer | SpriteRenderer).update();
        }
      }
    }

    super.update(time); // Update des components

    // update the hasMoved
    if (this._lastLocalID != this.position.scope._localID) {
      this._hasMoved = true;
    } else {
      this._hasMoved = false;
    }

    this._lastLocalID = this.position.scope._localID;
  }
}

export default GameObject;
