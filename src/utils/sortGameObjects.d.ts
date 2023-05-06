/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
import GameObject from '../classes/GameObject';
import Scene from '../classes/Scene';
/**
 * Middleware used to sort children gameObjects (used in Scene and GameObject declarations)
 * @function
 */
declare function sortGameObjects(container: GameObject | Scene): void;
export default sortGameObjects;
