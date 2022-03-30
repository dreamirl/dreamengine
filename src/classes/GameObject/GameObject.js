import * as PIXI from 'PIXI';
import Vector2 from 'DE.Vector2';
import config from 'DE.config';
import GraphicRenderer from 'DE.GraphicRenderer';
import sortGameObjects from 'DE.sortGameObjects';
import Events from 'DE.Events';

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

function GameObject(params) {
  var _params = params || {};

  PIXI.Container.call(this);

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
  this.worldScale = new PIXI.Point(1, 1);

  /**
   * save the scale before z applies (this way you can know the true scale of the object without any modifier)
   * @public
   * @memberOf GameObject
   * @type {PIXI.Point}
   */
  this.savedScale = new PIXI.Point(
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
  for (var i in _params) {
    if (i === 'automatisms') {
      continue;
    }

    // if ( this[ i ] ) {
    //   console.log( "WARN GameObject: you are overriding " + i + " method/attribute" );
    // }
    this[i] = _params[i];
  }

  // this have to be at the end because we can define function just before
  if (_params.automatisms) {
    for (var i = 0; i < _params.automatisms.length; ++i) {
      this.addAutomatism.apply(this, _params.automatisms[i]);
    }
    delete _params.automatisms;
  }

  Events.on(
    'change-debug',
    function (debug, level) {
      if (debug) {
        this._createDebugRenderer();
      } else {
        this._destroyDebugRenderer();
      }
    },
    this,
  );
}

GameObject.prototype = Object.create(PIXI.Container.prototype);
GameObject.prototype.constructor = GameObject;

Object.defineProperties(GameObject.prototype, {
  /**
   * if false, object will stop being rendered and stop being updated
   * @public
   * @memberOf GameObject
   * @type {Boolean}
   */
  enable: {
    get: function () {
      return this.updatable || this.visible;
    },
    set: function (value) {
      // this is useful when you want to listen for enable changes externally
      if (this.enable !== value)
        this.emit(value ? 'enable-true' : 'enable-false');

      this.updatable = value;
      this.visible = value;
    },
  },

  /**
   * override from PIXI because we want to update the _vector2 rotation on set
   * @public
   * @memberOf GameObject
   */
  rotation: {
    get: function () {
      return this.transform.rotation;
    },
    set: function set(
      value, // eslint-disable-line require-jsdoc
    ) {
      this.vector2._updateRotation(value);
      this.transform.rotation = value;
    },
  },

  /**
   * allow sorting gameObjects in the parent rendering order
   * @public
   * @memberOf GameObject
   */
  zindex: {
    get: function () {
      return this._zindex;
    },
    set: function (zindex) {
      if (typeof zindex == 'number') {
        this._zindex = zindex;

        if (this.parent) {
          this.parent._shouldSortChildren = true;
        }
      }
    },
  },

  /**
   * this is used for creating perspective rendering. It is also used by the sorting algorithm
   * note: the perspective applies only if there is a camera to render the scene content, and sub-children are not eligible to this features (only top-gameobject are)
   * @public
   * @memberOf GameObject
   */
  z: {
    get: function () {
      return this._z;
    },
    set: function (z) {
      this._z = z;
      this._hasMoved = true;
      this._updateZScale();

      if (this.parent) {
        this.parent._shouldSortChildren = true;
      }
    },
  },
});

GameObject.prototype._createDebugRenderer = function () {
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
};

GameObject.prototype._destroyDebugRenderer = function () {
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
};

/**
 * move gameObject with a vector 2
 * @memberOf GameObject
 * @public
 * @param {Vector2} vector2
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 * @example myObject.translate( { "x": 10, "y": 5 }, false );
 */
GameObject.prototype.translate = function (pos, absolute, ignoreDeltaTime) {
  this.vector2.translate(pos, absolute, ignoreDeltaTime);
  return this;
};
/**
 * move gameObject along x axe
 * @public
 * @memberOf GameObject
 * @param {Float} distance
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 */
GameObject.prototype.translateX = function (distance, absolute, ignoreDelta) {
  this.translate({ x: distance, y: 0 }, absolute, ignoreDelta);
  return this;
};
/**
 * move gameObject along y axe
 * @public
 * @memberOf GameObject
 * @param {Float} distance
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 */
GameObject.prototype.translateY = function (distance, absolute, ignoreDelta) {
  this.translate({ x: 0, y: distance }, absolute, ignoreDelta);
  return this;
};

/**
 * quick access to position.rotate
 * @public
 * @memberOf GameObject
 * @param {Float} angle
 */
GameObject.prototype.rotate = function (angle, ignoreDelta) {
  this.vector2.rotate(angle, ignoreDelta);
  return this;
};

/**
 * rotate the GameObject to look at the given 2D position
 * @public
 * @memberOf GameObject
 * @param {Vector2/GameObject} vector2
 * @param {angleOffset}
 * can be a simple position x-y
 */
GameObject.prototype.lookAt = function (vector2, angleOffset) {
  var origin = { x: 0, y: 0 };
  var otherPos = vector2.toGlobal ? vector2.toGlobal(origin) : vector2;
  this.rotation = this.vector2.getAngle(otherPos) + (angleOffset || 0);

  return this;
};

/**
 * add a renderer to the gameObject
 * this push the renderer in a distinct array AND set anchor to 50% (if available) + push the render in PIXI child.
 * @public
 * memberOf GameObject
 * param {PIXI.DisplayObject} rd - the renderer to add
 */
GameObject.prototype.addOneRenderer = function (rd) {
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
};

GameObject.prototype.addRenderer = function (rd) {
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
};

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
GameObject.prototype.add = function () {
  var args = Array.prototype.slice.call(arguments);
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
};

/**
 * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
 * @public
 * @memberOf GameObject
 * @param {GameObject} gameObject gameObject to add
 * @example myObject.addOne( car );
 */
GameObject.prototype.addOne = function (object) {
  if (!(object instanceof GameObject)) {
    throw new Error(
      'DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please',
    );
    return;
  }

  if (object.parent) {
    object.parent.remove(object);
  }

  this.gameObjects.push(object);
  object._updateWorldScale();

  this.addChild(object);

  if (config.DEBUG && !object._debugRenderer) {
    object._createDebugRenderer();
  }

  this._shouldSortChildren = true;

  return this;
};

/**
 * remove a the given child in this GameObject gameObjects
 * also call PIXI.removeChild
 * @public
 * @memberOf GameObject
 * @param {GameObject} object
 * object reference
 */
GameObject.prototype.remove = function (object) {
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
};

/**
 * delete the object
 * @protected
 * @memberOf GameObject
 * @param {GameObject} object
 * object reference or object index in the gameObjects array
 */
GameObject.prototype.delete = function (object) {
  var target = this.remove(object);

  target.killMePlease();
  return this;
};

/**
 * delete all children objects
 * @protected
 * @memberOf GameObject
 */
GameObject.prototype.deleteAll = function () {
  while (this.gameObjects.length) {
    var target = this.remove(0);
    target.killMePlease();
  }
  return this;
};

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
GameObject.prototype.askToKill = function (params) {
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
};

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
GameObject.prototype.onKill = undefined;
GameObject.prototype.onKilled = undefined;

/**
 * this function is called when the update loop remove this GameObject (after an askToKill call)<br>
 * you shouldn't call it directly, if you do it, maybe other GameObjects in the current
 * frame are dealing with this one and should produce errors<br>
 * <b>if you provided to askToKill a preventEvents or a preventKilledEvent this will
 * not emit killed event and will not call onKilled method if provided</b>
 * @protected
 * @memberOf GameObject
 */
GameObject.prototype.killMePlease = function () {
  if (!this._killArgs.preventEvents && !this._killArgs.preventKilledEvent) {
    if (this.onKilled) this.onKilled();
    this.emit('killed', this);
  }

  this.target = undefined;
  this.enable = false;
  this.flag = undefined;

  // check if object isn't already destroyed and there is children inside 'cause PIXI don't do it
  // and prevent crash (if user ask multiple destroy)
  if (!this.children) {
    this.children = [];
  }

  for (var i = 0, obj; i < this.gameObjects.length; ++i) {
    obj = this.remove(i);
    obj.killMePlease();
  }

  this.destroy({
    children: true,
    baseTexture: this.destroyTextureOnKill,
    texture: this.destroyTextureOnKill,
  });
};

/**
 * this function return the "world" rotation of the object.
 * It doesn't include render/scene/camera rotation
 * @memberOf GameObject
 * @public
 */
GameObject.prototype.getGlobalRotation = function () {
  if (this.parent.getGlobalRotation) {
    return this.rotation + this.parent.getGlobalRotation();
  } else {
    return this.rotation;
  }
};

/**
 * Sort gameObjects in the scene along z axis or using z-index for objects on the same same plan.
 * The priority is the following, z, z-index, y, x
 * You shouldn't call this method directly because engine do it for you, but in some case it can be useful to do it yourself
 * @protected
 * @memberOf GameObject
 */
GameObject.prototype.sortGameObjects = sortGameObjects;

/**
 * DEPRECATED you should use getGlobalPosition (from PIXI)
 * support for old version using trigger and not emit (I personally prefer emit when it's a client/server communication, and trigger when it's not services communication related )
 * but the engine will always support trigger AND emit
 * @deprecated
 * @public
 * @memberOf GameObject
 */
GameObject.prototype.trigger = GameObject.prototype.emit;

/**
 * DEPRECATED you should use getGlobalPosition (from PIXI)
 * support for old version of the engine, return world Position
 * @deprecated
 * @public
 * @memberOf GameObject
 */
GameObject.prototype.getPos = GameObject.prototype.getGlobalPosition;

// a tester
GameObject.prototype.getWorldPos = function () {
  if (this.parent && this.parent.getWorldPos) {
    var pos = this.parent.getWorldPos();
    var harmonics = this.parent.vector2.getHarmonics();

    return {
      x:
        -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) +
        pos.x,
      y:
        -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) +
        pos.y,
      z: this.z + pos.z,
    };
  }

  return { x: this.x, y: this.y, z: this.z };
};

GameObject.prototype.DEName = 'GameObject';

export default GameObject;
