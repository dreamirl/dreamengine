import * as PIXI from 'pixi.js';
import AdvancedContainer from './AdvancedContainer';
import Vector2 from './Vector2';
import RendererInterface from './renderer/RendererInterface';
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
declare class GameObject extends AdvancedContainer {
  static DEName: string;
  parent: GameObject;
  vector2: Vector2;
  renderers: (PIXI.Container & RendererInterface)[];
  renderer: PIXI.Container & RendererInterface;
  _debugRenderer: PIXI.Container | undefined;
  _lastLocalID: string;
  /**
   * If false, the object wont be updated anymore (but still renderer).
   * check visible attribute (from PIXI) to prevent rendering without killing update
   * @public
   * @memberOf GameObject
   * @type {Boolean}
   */
  updatable: boolean;
  /**
   * Set to true when the (PIXI) position.scope._localID change, that mean the position (x/y) has changed or if z change.
   * If true, the camera will recalculate perspective. It can also be used by Collisions algorithms
   * @private
   * @memberOf GameObject
   */
  _hasMoved: boolean;
  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  readonly id: number;
  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  readonly name: string;
  /**
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  tag: string;
  /**
   * Flag used in intern logic (for delete) but can be used outside when it's not conflicting with the engine's logic
   *
   * @public
   * @memberOf GameObject
   * @type {String}
   */
  flag: string;
  /**
   * @readOnly
   * @memberOf GameObject
   * @type {Array-GameObject}
   */
  gameObjects: GameObject[];
  /**
   * @private
   * @memberOf GameObject
   * @type {Object}
   */
  _automatisms: Record<
    string,
    {
      0: string;
      1: Automatism;
    }
  >;
  /**
   * used to make distinction between gameObject and pure PIXI DisplayObject
   * @private
   * @memberOf GameObject
   * @type {Boolean}
   */
  _isGameObject: boolean;
  /**
   * store real scale (taking all parent in consideration)
   * worldScale is update directly when calling the constructor
   * this way you can know the real rendering scale (to the screen) with all modifiers
   * @public
   * @memberOf GameObject
   * @type {PIXI.Point}
   */
  worldScale: PIXI.Point;
  /**
   * can prevent event propagation
   * @private
   * @memberOf GameObject
   */
  _killArgs: {
    preventEvents: boolean;
    preventKillEvent: boolean;
    preventKilledEvent: boolean;
  };
  extra: Record<string, any>;
  constructor(
    params?: Partial<Omit<GameObject, 'scale'>> & {
      automatisms?: Array<Array<any>>;
      scale?: number | Point2D;
      scaleX?: number;
      scaleY?: number;
    },
  );
  get automatisms(): Record<
    string,
    {
      0: string;
      1: Automatism;
    }
  >;
  /**
   * if false, object will stop being rendered and stop being updated
   * @public
   * @memberOf GameObject
   * @type {Boolean}
   */
  get enable(): boolean;
  set enable(value: boolean);
  get rotation(): number;
  set rotation(value: number);
  _createDebugRenderer(): void;
  _destroyDebugRenderer(): void;
  /**
   * move gameObject with a vector 2
   * @memberOf GameObject
   * @public
   * @param {Vector2} vector2
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   * @example myObject.translate( { "x": 10, "y": 5 }, false );
   */
  translate(pos: any, absolute: boolean, ignoreDeltaTime?: boolean): this;
  /**
   * move gameObject along x axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  translateX(distance: number, absolute: boolean, ignoreDelta?: boolean): this;
  /**
   * move gameObject along y axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  translateY(distance: number, absolute: boolean, ignoreDelta?: boolean): this;
  /**
   * quick access to position.rotate
   * @public
   * @memberOf GameObject
   * @param {Float} angle
   */
  rotate(angle: number, ignoreDelta?: boolean): this;
  /**
   * rotate the GameObject to look at the given 2D position
   * @public
   * @memberOf GameObject
   * @param {Vector2/GameObject} vector2
   * @param {angleOffset}
   * can be a simple position x-y
   */
  lookAt(vector2: any, angleOffset: number): this;
  /**
   * add a renderer to the gameObject
   * this push the renderer in a distinct array AND set anchor to 50% (if available) + push the render in PIXI child.
   * @public
   * memberOf GameObject
   * param {PIXI.DisplayObject} rd - the renderer to add
   */
  addOneRenderer(rd: PIXI.Container & RendererInterface): this;
  addRenderer(...rds: (PIXI.Container & RendererInterface)[]): this;
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
  add(...gameObjects: Array<GameObject>): this;
  /**
   * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.addOne( car );
   */
  addOne(object: GameObject): this;
  /**
   * remove a the given child in this GameObject gameObjects
   * also call PIXI.removeChild
   * @public
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference
   */
  remove(object: GameObject): GameObject;
  /**
   * delete the object
   * @protected
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference or object index in the gameObjects array
   */
  delete(object: GameObject): this;
  /**
   * delete all children objects
   * @protected
   * @memberOf GameObject
   */
  deleteAll(): this;
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
  askToKill(params: any): this;
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
  onKill(): void;
  onKilled(): void;
  /**
   * this function is called when the update loop remove this GameObject (after an askToKill call)<br>
   * you shouldn't call it directly, if you do it, maybe other GameObjects in the current
   * frame are dealing with this one and should produce errors<br>
   * <b>if you provided to askToKill a preventEvents or a preventKilledEvent this will
   * not emit killed event and will not call onKilled method if provided</b>
   * @protected
   * @memberOf GameObject
   */
  killMePlease(): void;
  /**
   * this function return the "world" rotation of the object.
   * It doesn't include render/scene/camera rotation
   * @memberOf GameObject
   * @public
   */
  getGlobalRotation(): number;
  /**
   * DEPRECATED you should use emit
   * support for old version using trigger and not emit (I personally prefer emit when it's a client/server communication, and trigger when it's not services communication related )
   * but the engine will always support trigger AND emit
   * @deprecated
   * @public
   * @memberOf GameObject
   */
  trigger(event: string, ...args: Array<any>): void;
  /**
   * DEPRECATED you should use getGlobalPosition (from PIXI)
   * support for old version of the engine, return world Position
   * @deprecated
   * @public
   * @memberOf GameObject
   */
  getPos(): PIXI.Point;
  getWorldPos(): Point2D;
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
   * myObject.addAutomatism( "gameLogic" );
   * @example
   * // this will call myObject.checkInputs() each 500ms
   * myObject.addAutomatism( "inputs", { "methodName": "checkInputs", "interval": 500 } );
   * @example
   * // this will call myObject.translate() once in 2.5 seconds
   * myObject.addAutomatism( "killMeLater", {
   *   "methodName": "askToKill",
   *   "interval": 2500,
   *   "args": [ { x: 10, y: 10 } ],
   *   "persistent": false
   * } );
   */
  addAutomatism(id: string, params?: Partial<Automatism>): void;
  /**
   * remove the automatism by id (the one you provided on creation)
   * @public
   * @memberOf GameObject
   * @param {String} id automatism id to remove
   * @example
   * myObject.removeAutomatism( "logic" );
   */
  removeAutomatism(id: string): void;
  /**
   * remove all automatisms
   * @public
   * @memberOf GameObject
   */
  removeAutomatisms(): void;
  /**
   * inverse values of an automatism
   * useful for "ping-pong" moves, fades, snaking, and patrols logics
   * this works with args OR value1 and value2
   * @public
   * @memberOf GameObject
   * @example
   * myObject.inverseAutomatism( "translateY" ); // this will inverse the value applied on the automatized translateY action
   */
  inverseAutomatism(autoName: string): void;
  /**
   * _updateWorldScale is the same as _updateScale but it take every parent scale in consideration.
   * use worldScale when you want to know what is the "real" scale of the current object
   * for example, with Ship contain Reactor.
   * if Ship.scale = 0.5 then Reactor.wordScale = 0.5
   * if Ship.scale = 0.5 and Reactor.scale = 0.5 then Reactor.worldScale = 0.25
   * @private
   * @memberOf GameObject
   */
  _updateWorldScale(): this | undefined;
  update(time: number): void;
}
export default GameObject;
