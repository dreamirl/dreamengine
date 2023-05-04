import { Container } from 'pixi.js';
import GameObject from './GameObject';
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
declare class Scene extends Container {
    /**
     * it's a copy of PIXI.children
     * @readonly
     * @memberOf Scene
     */
    gameObjects: GameObject[];
    /**
     * @public
     * @memberOf Scene
     * @type {String}
     */
    name: string;
    /**
     * contain all gameObjects but in a map by id
     * @readonly
     * @memberOf Scene
     */
    gameObjectsById: {
        [k: string]: GameObject;
    };
    /**
     * contain all gameObjects sorted by tags
     * if the tag pool doesn't exist when adding a gameObject, it is automatically created
     * @readonly
     * @memberOf Scene
     */
    gameObjectsByTag: {
        [k: string]: GameObject[];
    };
    constructor(name: string, addToTheMainLoop?: boolean);
    /**
     * if this world is sleeping, update will be ignored
     * @public
     * @memberOf Scene
     * @type {Boolean}
     */
    private _enable;
    get enable(): boolean;
    set enable(bool: boolean);
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
    add(...gameObjects: Array<GameObject>): void;
    /**
     * add one gameObject inside the scene, call this one if you have only 1 gameObject to add, it's faster
     * @public
     * @memberOf Scene
     * @param {GameObject} gameObject gameObject to add
     * @example myScene.addOne( car );
     */
    addOne(gameObject: GameObject): void;
    /**
     * scene update
     * @protected
     * @memberOf Scene
     */
    update(time: number): void;
    static DEName: string;
    /**
     * Delete and remove all objects in the scene.
     * @public
     * @memberOf Scene
     */
    deleteAll(): this;
    /**
     * Delete and remove an object in the scene.
     * You should prefer askToKill GameObject's method because it's safer (if you know what you do go crazy).
     * @public
     * @memberOf Scene
     * @param {GameObject} object can be the index of the GameObject in the gameObjects array
     */
    delete(object: GameObject): this;
    /**
     * Remove an object on this scene (it is not deleted !).
     * @public
     * @memberOf Scene
     * @param {GameObject} object can be the index of the GameObject in the gameObjects array
     */
    remove(object: GameObject): GameObject;
}
export default Scene;
