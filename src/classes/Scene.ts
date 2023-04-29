import { Container } from 'pixi.js';
import MainLoop from '../MainLoop';
import GameObject from './GameObject';
import config from '../config';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Scene
 * @class a Scene is a world. You push GameObjects inside this world.
 * There is no world Size, just objects inside
 * For rendering convenience it use a PIXI.Container
 * a Scene can be added to a Render or a Camera can look at this Scene
 * @example Game.scene = new DE.Scene( "Test" );
 */
class Scene extends Container {
  /**
   * it's a copy of PIXI.children
   * @readonly
   * @memberOf Scene
   */
  public gameObjects: GameObject[] = [];

  /**
   * @public
   * @memberOf Scene
   * @type {String}
   */
  public override name = 'scene';

  /**
   * contain all gameObjects but in a map by id
   * @readonly
   * @memberOf Scene
   */
  public gameObjectsById: { [k: string]: GameObject } = {};

  /**
   * contain all gameObjects sorted by tags
   * if the tag pool doesn't exist when adding a gameObject, it is automatically created
   * @readonly
   * @memberOf Scene
   */
  public gameObjectsByTag: { [k: string]: GameObject[] } = {};

  // TODO when required this.objectsByTag = {};
  // TODO when required this.objectsByName = {};

  constructor(name: string, addToTheMainLoop = true) {
    super();
    this.sortableChildren = config.DEFAULT_SORTABLE_CHILDREN;
    this.name = name;

    if (addToTheMainLoop) {
      MainLoop.addScene(this);
    }
  }

  /**
   * if this world is sleeping, update will be ignored
   * @public
   * @memberOf Scene
   * @type {Boolean}
   */
  private _enable = true;
  public get enable() {
    return this._enable;
  }
  public set enable(bool: boolean) {
    this._enable = bool;
  }

  /**
   * add all given gameObjects inside the scene, if you add only one gameObject, call addOne
   * you can call this method with array, single object, or multi arguments objects, look at examples.
   * @public
   * @memberOf Scene
   * @param {GameObject} gameObject gameObject to add
   * @example myScene.add( car ); // just one object, you should call addOne instead
   * @example myScene.add( car, car2, car3, banana, turtle ); // using multi arguments
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * myScene.add( myArray ); // then call add with array directly
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * var myArray2 = [ object4, object5, object6 ]; // declare a second array with object inside as you wish
   * myScene.add( myArray, myArray2 ); // then call add with array and multi arguments
   */
  add(...gameObjects: Array<GameObject>) {
    gameObjects.forEach((go) => this.addOne(go));
  }

  /**
   * add one gameObject inside the scene, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf Scene
   * @param {GameObject} gameObject gameObject to add
   * @example myScene.addOne( car );
   */
  addOne(gameObject: GameObject) {
    // accept only gameObject to avoid errors
    // TS powa ? TODO a virer
    // if (!(gameObject instanceof GameObject)) {
    //   console.error(
    //     'Tried to add something in a scene that is not a GameObject. Please inherit from GameObject',
    //   );
    //   return;
    // }

    // TODO add in byTags, byNames, pools objects

    // add in PIXI Container
    this.addChild(gameObject);
    this.gameObjectsById[gameObject.id] = gameObject;
    this.gameObjects.push(gameObject);

    if (gameObject.tag) {
      if (!this.gameObjectsByTag[gameObject.tag]) {
        this.gameObjectsByTag[gameObject.tag] = new Array();
      }
      this.gameObjectsByTag[gameObject.tag].push(gameObject);
    }

    this.emit('update-children');
  }

  /**
   * scene update
   * @protected
   * @memberOf Scene
   */
  update(time: number) {
    if (!this.enable) {
      return;
    }

    for (let i = 0, t = this.gameObjects.length, g; i < t; ++i) {
      g = this.gameObjects[i];

      if (!g) {
        continue;
      }

      if (g.flag !== null) {
        switch (g.flag) {
          case 'delete':
            this.delete(g);
            --t;
            continue;
            break;
        }
      }

      // need an octree here for physic ?
      // passing other gameObjects for physic ? (still looking how to do it)
      g.update(time /*, this.gameObjects*/);
    }

    // TODO ? // It seems that PIXI Ticker is calling his own requestAnimationFrame, not needed here ?
    // but it could be cool to have Ticker associated to a scene lifetime (PIXI.Ticker can be dis-activated and manually called ?)
    // for ( var i = 0, t = this.timers.length; i < t; ++tk )
    // {
    //   this.timers[ i ].update();
    // }
  }

  // name registered in engine declaration
  static DEName = 'Scene';

  /**
   * Delete and remove all objects in the scene.
   * @public
   * @memberOf Scene
   */
  deleteAll() {
    while (this.gameObjects.length > 0) {
      this.delete(this.gameObjects[0]);
    }

    return this;
  }

  /**
   * Delete and remove an object in the scene.
   * You should prefer askToKill GameObject's method because it's safer (if you know what you do go crazy).
   * @public
   * @memberOf Scene
   * @param {GameObject} object can be the index of the GameObject in the gameObjects array
   */
  delete(object: GameObject) {
    let target = this.remove(object);
    target.killMePlease();

    return this;
  }

  /**
   * Remove an object on this scene (it is not deleted !).
   * @public
   * @memberOf Scene
   * @param {GameObject} object can be the index of the GameObject in the gameObjects array
   */
  remove(object: GameObject) {
    delete this.gameObjectsById[object.id];
    if (object.tag) {
      this.gameObjectsByTag[object.tag].splice(
        this.gameObjectsByTag[object.tag].indexOf(object),
        1,
      );
    }

    // if it's an index, it's dangerous D: (excepted when it came from update, which is faster than idnexindexOf)
    const index = this.gameObjects.indexOf(object);

    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      this.removeChild(object);
    }

    this.emit('update-children');
    return object;
  }
}

export default Scene;
