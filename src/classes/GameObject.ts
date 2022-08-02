import { Container, Point } from 'pixi.js';
import config from '../config';
import Events from '../utils/Events';
import sortGameObjects from '../utils/sortGameObjects';
import Time from '../utils/Time';
import GraphicRenderer from './renderer/GraphicRenderer';
import Vector2 from './Vector2';

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

class GameObject extends Container {
  public static DEName = 'GameObject';
  parent: GameObject; // TODO: ZARNA : ajouter Scene quand Scene sera en classe
  updatable;
  vector2;
  _zindex;
  _shouldSortChildren;
  _hasMoved;
  id;
  tag;
  target;
  flag;
  gameObjects;
  _automatisms;
  _isGameObject;
  _z;
  _zscale;
  worldScale;
  savedScale;
  _killArgs;
  _fadeData;
  _scaleData;
  _shakeData;
  _moveData;
  renderers;
  renderer;
  _debugRenderer;
  _lastLocalID;
  _focusOptions;
  _focusOffsets = { x: 0, y: 0 };

  constructor(params) {
    var _params = params || {};

    super();

    this.position.set(_params.x || 0, _params.y || 0);
    delete _params.x;
    delete _params.y;

    this.vector2 = new Vector2(this.x, this.y, this);

    /**
     * If false, the object wont be updated anymore (but still renderer).
     * check visible attribute (from PIXI) to prevent rendering without killing update
     * @public
     * @memberOf GameObject
     * @type {Boolean}
     */
    this.updatable = true;

    /**
     * Set to true when the (PIXI) position.scope._localID change, that mean the position (x/y) has changed or if z change.
     * If true, the camera will recalculate perspective. It can also be used by Collisions algorithms
     * @private
     * @memberOf GameObject
     */
    this._hasMoved = true;

    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.id =
      _params.id !== undefined ? _params.id : (Math.random() * 999999999) >> 0;

    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.name = _params.name;
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.tag = _params.tag;

    /**
     * Target to focus (position, Vector2, Points or GameObject, whatever with x/y)
     *
     * @public
     * @memberOf GameObject
     * @type {Object}
     */
    this.target = undefined;

    /**
     * Flag used in intern logic (for delete) but can be used outside when it's not conflicting with the engine's logic
     *
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.flag = undefined;

    /**
     * @readOnly
     * @memberOf GameObject
     * @type {Array-GameObject}
     */
    this.gameObjects = [];

    /**
     * @private
     * @memberOf GameObject
     * @type {Object}
     */
    this._automatisms = {};

    /**
     * used to make distinction between gameObject and pure PIXI DisplayObject
     * @private
     * @memberOf GameObject
     * @type {Boolean}
     */
    this._isGameObject = true;

    /**
     * when a children change his z or zindex property this attribute change to true and the gameObject sort his children in the next update call
     * @private
     * @memberOf GameObject
     */
    this._shouldSortChildren = false;

    /**
     * used to clearly sort gameObjects rendering priority (higher is rendered over others)
     * @private
     * @memberOf GameObject
     */
    this._zindex = 0;

    /**
     * used to simulate a perspective when using a Camera, if not using a Camera this is an other way to sort gameObjects (with z-index)
     * @private
     * @memberOf GameObject
     */
    this._z = 0;

    /**
     * create a scale to simulate a z axis (to create perspective) when changing z attribute
     * this modifier is applied to this.scale (and savedScale store the old, not modified scale)
     * @private
     * @memberOf GameObject
     * @type {Int}
     */
    this._zscale = 1;

    /**
     * store real scale (taking all parent in consideration)
     * worldScale is update directly when calling the constructor
     * this way you can know the real rendering scale (to the screen) with all modifiers
     * @public
     * @memberOf GameObject
     * @type {PIXI.Point}
     */
    this.worldScale = new Point(1, 1);

    /**
     * save the scale before z applies (this way you can know the true scale of the object without any modifier)
     * @public
     * @memberOf GameObject
     * @type {PIXI.Point}
     */
    this.savedScale = new Point(
      _params.scale && _params.scale.x
        ? _params.scale.x
        : _params.scale || _params.scaleX || 1,
      _params.scale && _params.scale.y
        ? _params.scale.y
        : _params.scale || _params.scaleY || 1,
    );
    delete _params.scale;
    // call correctly the scale modifier to update zscale and worldScale
    this.setScale(this.savedScale.x, this.savedScale.y);

    /**
     * can prevent event propagation
     * @private
     * @memberOf GameObject
     */
    this._killArgs = {};

    /**
     * object used to apply fade transition
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this._fadeData = {
      from: 1,
      to: 0,
      duration: 1000,
      done: true,
    };

    /**
     * object used to apply scale transition
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this._scaleData = {
      fromx: 1,
      tox: 0,
      fromy: 1,
      toy: 0,
      duration: 1000,
      done: true,
    };

    /**
     * object used to apply shake
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this._shakeData = {
      done: true,
      prevX: 0,
      prevY: 0,
    };

    /**
     * object used to apply move translation
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this._moveData = {
      done: true,
    };

    this.renderers = [];

    if (_params.renderer) {
      this.addRenderer(_params.renderer);
      delete _params.renderer;
    }

    if (_params.renderers) {
      for (var i = 0; i < _params.renderers.length; ++i) {
        this.addRenderer(_params.renderers[i]);
      }
      delete _params.renderers;
    }

    this.renderer = this.renderers[0];

    if (config.DEBUG) {
      this._createDebugRenderer();
    }

    if (_params.gameObjects) {
      this.add(_params.gameObjects);
      delete _params.gameObjects;
    }

    // easy way to add custom function/attributes to a GameObject in a one-block declaration
    for (const [key, value] of Object.entries(_params)) {
      if (value === 'automatisms') {
        continue;
      }
      this[key] = value;
    }

    // this have to be at the end because we can define function just before
    if (_params.automatisms) {
      for (var i = 0; i < _params.automatisms.length; ++i) {
        this.addAutomatism.apply(this, _params.automatisms[i]);
      }
      delete _params.automatisms;
    }

    Events.on('change-debug', (debug, level) => {
      if (debug) {
        this._createDebugRenderer();
      } else {
        this._destroyDebugRenderer();
      }
    });
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

  get rotation() {
    return this.transform.rotation;
  }
  set rotation(value) {
    this.vector2._updateRotation(value);
    this.transform.rotation = value;
  }

  get zIndex() {
    return this._zindex;
  }
  set zIndex(zindex) {
    if (typeof zindex == 'number') {
      this._zindex = zindex;

      if (this.parent) {
        this.parent._shouldSortChildren = true;
      }
    }
  }

  get z() {
    return this._z;
  }

  set z(z) {
    this._z = z;
    this._hasMoved = true;
    this._updateZScale();

    if (this.parent) {
      this.parent._shouldSortChildren = true;
    }
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
    this.addChild(this._debugRenderer);
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
    this._debugRenderer = null;
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
  translate(pos, absolute, ignoreDeltaTime) {
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
  translateX(distance, absolute, ignoreDelta) {
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
  translateY(distance, absolute, ignoreDelta) {
    this.translate({ x: 0, y: distance }, absolute, ignoreDelta);
    return this;
  }

  /**
   * quick access to position.rotate
   * @public
   * @memberOf GameObject
   * @param {Float} angle
   */
  rotate(angle, ignoreDelta) {
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
  lookAt(vector2, angleOffset) {
    var origin = { x: 0, y: 0 };
    var otherPos = vector2.toGlobal ? vector2.toGlobal(origin) : vector2;
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
  addOneRenderer(rd) {
    if (
      rd.anchor &&
      !rd.preventCenter &&
      rd.anchor.x === 0 &&
      rd.anchor.y === 0
    ) {
      rd.anchor.set(0.5, 0.5);
    }

    this.renderers.push(rd);
    this.addChild(rd);

    return this;
  }

  addRenderer(rd) {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; ++i) {
      if (args[i].length !== undefined) {
        for (var o = 0, m = args[i].length || 0; o < m; ++o) {
          this.addOneRenderer(args[i][o]);
        }
      } else {
        this.addOneRenderer(args[i]);
      }
    }

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
  add(...args: Array<any>) {
    for (var i = 0; i < args.length; ++i) {
      if (args[i].length !== undefined) {
        for (var o = 0, m = args[i].length || 0; o < m; ++o) {
          this.addOne(args[i][o]);
        }
      } else {
        this.addOne(args[i]);
      }
    }

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
  addOne(object) {
    if (!(object instanceof GameObject)) {
      throw new Error(
        'DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please',
      );
      return;
    }

    if (object.parent) {
      object.parent.removeChild(object); //TODO: ZARNA | A review Antoine (j'ai remplacé remove par removeChild vu que y'a pas remove sur PIXI.Container)
    }

    this.gameObjects.push(object);
    object._updateWorldScale();

    this.addChild(object);

    if (config.DEBUG && !object._debugRenderer) {
      object._createDebugRenderer();
    }

    this._shouldSortChildren = true;

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
  remove(object) {
    if (isNaN(object)) {
      var index = this.gameObjects.indexOf(object);

      if (index !== -1) {
        this.gameObjects.splice(index, 1);
        this.removeChild(object);
      }
      return object;
    } else {
      var target = this.gameObjects[object];

      this.gameObjects.splice(object, 1);
      // remove from PIXI Container
      this.removeChild(target);

      return target;
    }
  }

  /**
   * delete the object
   * @protected
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference or object index in the gameObjects array
   */
  delete(object) {
    var target = this.remove(object);

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
      var target = this.remove(0);
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
  askToKill(params) {
    this.target = null;
    this._killArgs = params || {};

    if (!this._killArgs.preventEvents && !this._killArgs.preventKillEvent) {
      if (this.onKill) {
        this.onKill();
      }
      this.emit('kill', this);
    }

    this.enable = false;
    this.flag = 'delete';

    if (!this.parent || !this.parent.enable) {
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
  onKill() {} // TODO: ZARNA | Antoine ok ?
  onKilled() {} // TODO: ZARNA | Antoine ok ?

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
    if (!this._killArgs.preventEvents && !this._killArgs.preventKilledEvent) {
      if (this.onKilled) this.onKilled();
      this.emit('killed', this);
    }

    this.target = undefined;
    this.enable = false;
    this.flag = undefined;

    //TODO: ZARNA | A review Antoine : certain que c'est toujours utile/le cas ?
    // check if object isn't already destroyed and there is children inside 'cause PIXI don't do it
    // and prevent crash (if user ask multiple destroy)
    // if (!this.children) {
    //   this.children = [];
    // }

    for (var i = 0, obj; i < this.gameObjects.length; ++i) {
      obj = this.remove(i);
      obj.killMePlease();
    }

    this.destroy({
      children: true,
      // baseTexture: this.destroyTextureOnKill, //TODO: ZARNA | A review Antoine : this.destroyTextureOnKill n'existe pas ?
      // texture: this.destroyTextureOnKill, //TODO: ZARNA | A review Antoine : this.destroyTextureOnKill n'existe pas ?
    });
  }

  /**
   * this function return the "world" rotation of the object.
   * It doesn't include render/scene/camera rotation
   * @memberOf GameObject
   * @public
   */
  getGlobalRotation() {
    if (this.parent.getGlobalRotation) {
      return this.rotation + this.parent.getGlobalRotation();
    } else {
      return this.rotation;
    }
  }

  /**
   * Sort gameObjects in the scene along z axis or using z-index for objects on the same same plan.
   * The priority is the following, z, z-index, y, x
   * You shouldn't call this method directly because engine do it for you, but in some case it can be useful to do it yourself
   * @protected
   * @memberOf GameObject
   */
  sortGameObjects() {
    sortGameObjects(this);
  }

  /**
   * DEPRECATED you should use getGlobalPosition (from PIXI)
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
  getWorldPos() {
    if (this.parent && this.parent.getWorldPos) {
      var pos = this.parent.getWorldPos();
      var harmonics = this.parent.vector2.getHarmonics();

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
        z: this.z + pos.z,
      };
    }

    return { x: this.x, y: this.y, z: this.z };
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
  addAutomatism(id, methodName, params) {
    params = params || {};
    methodName = methodName || id;

    // if using the old way - TODO - remove it on version 0.2.0
    if (methodName.type) {
      console.error(
        'Call arguments Deprecated: You use the old way to call addAutomatism, check the doc please',
      );
      params = methodName;
      methodName = params.type;
    }
    if (!this[methodName]) {
      console.warn(
        "%cCouldn't found the method " +
          methodName +
          ' in your GameObject prototype',
        1,
        'color:red',
      );
      return false;
    }
    params.interval = params.interval || Time.frameDelay;
    params.timeSinceLastCall = 0;

    params.methodName = methodName;
    params.value1 = params.value1 || undefined;
    params.value2 = params.value2 || undefined;
    params.args = params.args || undefined;
    params.persistent = params.persistent != false ? true : false;
    this._automatisms[id] = params;
  }

  /**
   * remove the automatism by id (the one you provided on creation)
   * @public
   * @memberOf GameObject
   * @param {String} id automatism id to remove
   * @example
   * myObject.removeAutomatism( "logic" );
   */
  removeAutomatism(id) {
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
    for (var i in this._automatisms) {
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
  inverseAutomatism(autoName) {
    var at = this._automatisms[autoName];

    if (at.args) {
      for (var i = 0; i < at.args.length; ++i) {
        at.args[i] = -at.args[i];
      }
    } else {
      at.value1 = -at.value1;
      at.value2 = -at.value2;
    }
  }

  /**
   * create a fade from alpha to alpha, with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fade( 0.5, 1, 850 );
   */
  fade(from, to, duration, force, callback) {
    if (force) {
      this.enable = true;
    }

    let dir = (from != undefined ? from : 1) > to ? -1 : 1;

    var data = {
      from: from != undefined ? from : 1,
      to: to != undefined ? to : 0,
      duration: duration || 500,
      oDuration: duration || 500,
      fadeScale: Math.abs(from - to),
      done: false,
      callback: callback,
      dir: dir,
    };

    this._fadeData = data;

    return this;
  }

  /**
   * create a fade from current alpha to given value with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  fadeTo(to, duration, force, callback) {
    this.fade(this.alpha, to, duration, force, callback);

    return this;
  }

  /**
   * fade to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.fadeOut( 850 );
   */
  fadeOut(duration, force, callback) {
    if (force) {
      this.enable = true;
      this.alpha = this.alpha > 0 ? this.alpha : 1; // make sure to prevent any blink side effect
    }

    this.fade(this.alpha, 0, duration, force, callback);
    return this;
  }

  /**
   * fade to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0
   * @example // alpha = 1 in 850ms
   * myObject.fadeIn( 850 );
   */
  fadeIn(duration, force, callback) {
    if (force) {
      this.enable = true;
      this.alpha = this.alpha < 1 ? this.alpha : 0; // make sure to prevent any blink side effect
    }

    this.fade(this.alpha, 1, duration, force, callback);
    return this;
  }

  /**
   * apply the current fade
   * @protected
   * @memberOf GameObject
   */
  applyFade() {
    if (!this._fadeData.done) {
      this._fadeData.stepVal =
        (Time.frameDelayScaled / this._fadeData.oDuration) *
        this._fadeData.dir *
        this._fadeData.fadeScale;
      this.alpha += this._fadeData.stepVal;
      this._fadeData.duration -= Time.frameDelayScaled;

      if (
        (this._fadeData.dir < 0 && this.alpha <= this._fadeData.to) ||
        (this._fadeData.dir > 0 && this.alpha >= this._fadeData.to) ||
        this.alpha < 0 ||
        this.alpha > 1
      ) {
        this.alpha = this._fadeData.to;
      }

      if (this._fadeData.duration <= 0) {
        this._fadeData.done = true;

        this.emit('fadeEnd', this);

        if (this._fadeData.callback) {
          this._fadeData.callback.call(this);
        }
      }
    }
  }

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
  focus(gameObject, params) {
    params = params || {};
    this.target = gameObject;
    this._focusOptions = Object.assign(
      {
        x: true,
        y: true,
        rotation: false,
      },
      params.options,
    );

    // focus default x/y
    this._focusOptions.x = this._focusOptions.x !== false ? true : false;
    this._focusOptions.y = this._focusOptions.y !== false ? true : false;

    this._focusOffsets = Object.assign(
      { x: 0, y: 0 },
      params.offsets || params.offset,
    );

    return this;
  }

  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  applyFocus() {
    if (!this.target) {
      return;
    }

    let pos = this.target;
    if (this.target.getWorldPos) {
      pos = this.target.getWorldPos();
    }

    let parentPos;
    if (this.parent.getWorldPos) {
      parentPos = this.parent.getWorldPos();
    } else {
      parentPos = this.parent;
    }

    if (this._focusOptions.x) {
      this.x = pos.x + (this._focusOffsets.x || 0) - parentPos.x;
    }
    if (this._focusOptions.y) {
      this.y = pos.y + (this._focusOffsets.y || 0) - parentPos.y;
    }
    if (this._focusOptions.rotation) {
      this.rotation = this.target.rotation;
    }
  }

  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object / GameObject / PIXI.DisplayObject} pos give x, y, and z destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current object context
   * @example // move to 100,100 in 1 second
   * player.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * player.moveTo( bonus, 1000, function(){ console.log( this ) } );
   */
  moveTo(
    pos,
    duration,
    callback,
    curveName,
    forceLocalPos, // TODO add curveName (not coded)
  ) {
    if (pos.getWorldPos) {
      pos = pos.getWorldPos();
    }

    var myPos = this;
    var parentPos;

    if (!forceLocalPos) {
      myPos = this.getWorldPos();

      if (this.parent && this.parent.getWorldPos) {
        parentPos = this.parent.getWorldPos();
      }
    }

    this._moveData = {
      distX: -(myPos.x - (pos.x !== undefined ? pos.x : myPos.x)),
      distY: -(myPos.y - (pos.y !== undefined ? pos.y : myPos.y)),
      distZ: -(myPos.z - (pos.z !== undefined ? pos.z : myPos.z)),
      dirX: myPos.x > pos.x ? 1 : -1,
      dirY: myPos.y > pos.y ? 1 : -1,
      dirZ: myPos.z > pos.z ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      curveName: curveName || 'linear',
      done: false,
      stepValX: 0,
      stepValY: 0,
      stepValZ: 0,
      destX: parentPos ? pos.x - parentPos.x : pos.x,
      destY: parentPos ? pos.y - parentPos.y : pos.y,
      destZ: pos.z,
      callback: callback,
    };
    this._moveData.leftX = this._moveData.distX;
    this._moveData.leftY = this._moveData.distY;
    this._moveData.leftZ = this._moveData.distZ;

    return this;
  }

  /**
   * apply the move transition each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  applyMove() {
    if (this._moveData.done) return;

    var move = this._moveData;

    if (move.distX != 0) {
      move.stepValX = (Time.frameDelayScaled / move.oDuration) * move.distX;
      move.leftX -= move.stepValX;
      this.x += move.stepValX;
    }

    if (move.distY != 0) {
      move.stepValY = (Time.frameDelayScaled / move.oDuration) * move.distY;
      move.leftY -= move.stepValY * move.dirY; // * dirY because y is inverted
      this.y += move.stepValY;
    }

    if (move.distZ != 0) {
      move.stepValZ = (Time.frameDelayScaled / move.oDuration) * move.distZ;
      move.leftZ -= move.stepValZ * move.dirZ; // * dirZ because z is inverted
      this.z += move.stepValZ;
    }

    move.duration -= Time.frameDelayScaled;

    // check pos
    if (move.dirX < 0 && move.leftX < 0) {
      this.x += move.leftX;
    } else if (move.dirX > 0 && move.leftX > 0) {
      this.x -= move.leftX;
    }

    if (move.dirY < 0 && move.leftY < 0) {
      this.y += move.leftY;
    } else if (move.dirY > 0 && move.leftY > 0) {
      this.y -= move.leftY;
    }

    if (move.dirZ < 0 && move.leftZ < 0) {
      this.z += move.leftZ;
    } else if (move.dirZ > 0 && move.leftZ > 0) {
      this.z -= move.leftZ;
    }

    if (move.duration <= 0) {
      this._moveData.done = true;
      this.position.set(
        move.destX !== undefined ? move.destX : this.x,
        move.destY !== undefined ? move.destY : this.y,
      );
      this.z = move.destZ !== undefined ? move.destZ : this.z;

      this.emit('moveEnd');

      if (move.callback) {
        move.callback.call(this, move.callback);
      }
    }
  }

  /**
   * Because we use a complex scaling system (with z modifier), we have to use this middle-ware to trigger updateScale
   * if you call directly .scale.set it will work but not if there is a z modifier
   * @public
   * @memberOf GameObject
   */
  setScale(x, y) {
    this.scale.set(x, y !== undefined ? y : x);
    this._updateScale();

    return this;
  }

  /**
   * when z change we restore saved scale, then change it again to final values and update worldScale
   * @private
   * @memberOf GameObject
   */
  _updateZScale() {
    // this come from old Camera render (working fine as excepted...)
    // zMaxDepth is 10 by default so if z is 1 scale modifier will be 0.9 (1 - 0.1)
    var zscale = 1 - this.z / config.zMaxDepth;
    this._zscale = zscale;

    this.scale.x = zscale * this.savedScale.x;
    this.scale.y = zscale * this.savedScale.y;

    // update worldScale
    this._updateWorldScale();
    for (var i = 0; i < this.gameObjects.length; ++i) {
      this.gameObjects[i]._updateWorldScale();
    }
  }

  /**
   * when we change the scale manually, we need to re-apply z deformation
   * directly save the old scale before zscale applies (this way we can recalculate things from the beginning)
   * @private
   * @memberOf GameObject
   */
  _updateScale() {
    this.savedScale.clone(this.scale);
    this.scale.x = this._zscale * this.scale.x;
    this.scale.y = this._zscale * this.scale.y;

    // PIXI update worldScale
    this._updateWorldScale();
    for (var i = 0; i < this.gameObjects.length; ++i) {
      this.gameObjects[i]._updateWorldScale();
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

    if (!this.parent || !this.parent._isGameObject) {
      return;
    }

    this.worldScale.x = this.worldScale.x * this.parent.worldScale.x;
    this.worldScale.y = this.worldScale.y * this.parent.worldScale.y;

    return this;
  }

  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myGameObject.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  scaleTo(scale, duration, callback) {
    var dscale = {
      x: !isNaN(scale) ? scale : scale.x,
      y: !isNaN(scale) ? scale : scale.y,
    };
    this._scaleData = {
      valX: -(
        this.savedScale.x -
        (dscale.x !== undefined ? dscale.x : this.savedScale.x)
      ),
      valY: -(
        this.savedScale.y -
        (dscale.y !== undefined ? dscale.y : this.savedScale.y)
      ),
      dirX: this.savedScale.x > dscale.x ? 1 : -1,
      dirY: this.savedScale.y > dscale.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: dscale.x,
      destY: dscale.y,
      scaleX: this.savedScale.x,
      scaleY: this.savedScale.y,
      callback: callback,
    };
    this._scaleData.leftX = this._scaleData.valX;
    this._scaleData.leftY = this._scaleData.valY;

    return this;
  }

  /**
   * apply the current scale
   * @protected
   * @memberOf GameObject
   */
  applyScale() {
    if (this._scaleData.done) {
      return;
    }

    var scaleD = this._scaleData;

    if (scaleD.valX != 0) {
      scaleD.stepValX =
        (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valX;
      scaleD.leftX -= scaleD.stepValX;
      scaleD.scaleX += scaleD.stepValX;
    }

    if (scaleD.valY != 0) {
      scaleD.stepValY =
        (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valY;
      scaleD.leftY -= scaleD.stepValY;
      scaleD.scaleY += scaleD.stepValY;
    }
    scaleD.duration -= Time.frameDelayScaled;

    // check scale
    if (scaleD.dirX < 0 && scaleD.leftX < 0) {
      scaleD.scaleX += scaleD.leftX;
    } else if (scaleD.dirX > 0 && scaleD.leftX > 0) {
      scaleD.scaleX -= scaleD.leftX;
    }

    if (scaleD.dirY < 0 && scaleD.leftY < 0) {
      scaleD.scaleY += scaleD.leftY;
    } else if (scaleD.dirY > 0 && scaleD.leftY > 0) {
      scaleD.scaleY -= scaleD.leftY;
    }

    this.scale.set(scaleD.scaleX, scaleD.scaleY);

    if (scaleD.duration <= 0) {
      this._scaleData.done = true;
      this.scale.set(scaleD.destX, scaleD.destY);

      this.emit('scale-end', this);

      if (this._scaleData.callback) {
        this._scaleData.callback.call(this);
      }
    }

    this._updateScale();
  }

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
  shake(xRange, yRange, duration, callback) {
    this._shakeData = {
      // "startedAt" : Date.now()
      duration: duration || 500,
      xRange: xRange,
      yRange: yRange,
      prevX: this._shakeData ? this._shakeData.prevX : 0,
      prevY: this._shakeData ? this._shakeData.prevY : 0,
      callback: callback,
    };

    return this;
  }

  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  applyShake() {
    if (this._shakeData.done) {
      return;
    }

    var shake = this._shakeData;
    // restore previous shake
    this.x -= shake.prevX;
    this.y -= shake.prevY;
    shake.duration -= Time.frameDelayScaled;
    // old way - Date.now() - this._shakeData.startedAt > this._shakeData.duration )
    if (shake.duration <= 0) {
      shake.done = true;
      shake.prevX = 0;
      shake.prevY = 0;

      this.emit('shakeEnd');

      if (shake.callback) {
        shake.callback.call(this);
      }
      return;
    }

    shake.prevX =
      (-(Math.random() * shake.xRange) + Math.random() * shake.xRange) >> 0;
    shake.prevY =
      (-(Math.random() * shake.yRange) + Math.random() * shake.yRange) >> 0;

    this.x += shake.prevX;
    this.y += shake.prevY;
  }

  update(time) {
    if (!this.updatable) {
      return;
    }

    // execute registered automatisms
    for (var a in this._automatisms) {
      var auto = this._automatisms[a];
      auto.timeSinceLastCall += Time.frameDelayScaled;

      if (auto.timeSinceLastCall > auto.interval) {
        auto.timeSinceLastCall -= auto.interval;
        // i think calling apply each update is slower than calling v1/v2. Should benchmark this
        if (auto.args) {
          this[auto.methodName].apply(this, auto.args);
        } else {
          this[auto.methodName](auto.value1, auto.value2);
        }

        // if this one isn't persistent delete it
        if (!auto.persistent) {
          delete this._automatisms[a];
        }
      }
    }

    // childs update
    for (var c = 0, g; (g = this.gameObjects[c]); c++) {
      if (g.flag !== null) {
        switch (g.flag) {
          case 'delete':
            this.delete(c);
            --c;
            continue;
            break;
        }
      }
      g.update(time);
    }

    // this apply update on each renderer
    if (this.visible) {
      for (var i = 0, r; (r = this.renderers[i]); ++i) {
        if (r.update) {
          r.update(Time.deltaTime);
        }

        if (r.applyFade) {
          r.applyFade();
          r.applyScale();
        }
      }
    }

    // TODO
    this.applyFocus();
    this.applyShake();
    this.applyMove();
    this.applyFade();
    this.applyScale();

    if (this._shouldSortChildren) {
      this.sortGameObjects();
    }

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
