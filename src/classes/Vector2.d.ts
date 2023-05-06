import * as PIXI from 'pixi.js';
import GameObject from './GameObject';
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * @constructor Scene
 */
declare class Vector2 extends PIXI.Container {
    static DEName: string;
    private _x;
    private _y;
    private _rotation;
    private _cosAngle;
    private _sinAngle;
    gameObject?: GameObject;
    constructor(x: number, y: number, gameObject?: GameObject);
    /**
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get rotation(): number;
    set rotation(value: number);
    _updateRotation(value: number): void;
    /**
     * move position along the given Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} vector2 vector to translate along
     * @param {Boolean} absolute if absolute, translation will ignore current rotation
     * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
     * @returns {Vector2} this current instance
     */
    translate(vector2: Vector2, absolute?: boolean, ignoreDelta?: boolean): this;
    /**
     * set precise rotation
     * @public
     * @memberOf Vector2
     * @param {Float} newAngle
     * @returns {Float} this.rotation current rotation
     */
    setRotation(newAngle: number): number;
    /**
     * apply the given angle to rotation
     * @public
     * @memberOf Vector2
     * @param {Float} angle rotation value
     * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
     * @returns {Float} this.rotation current rotation
     */
    rotate(angle: number, ignoreDelta?: boolean): number;
    /**
     * multiply this vector with coef
     * @public
     * @memberOf Vector2
     * @param {Float} coef
     * @returns {Vector2} this current instance
     */
    multiply(coef: number): this;
    /**
     * change the vector length to 1 (check wikipedia normalize if you want know more about)
     * @public
     * @memberOf Vector2
     * @returns {Vector2} this current instance
     */
    normalize(): this;
    /**
     * return the Vector between two Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Vector2} this current instance
     */
    getVector(a: Vector2, b: Vector2): this;
    /**
     * return the angle from a vector usefull for moves / translations without rotation
     * @public
     * @memberOf Vector2
     * @param {Vector2} vector2
     * @returns {Float} radians value
     */
    getVectorAngle(vector2: Vector2): number;
    /**
     * return the dotProduct between two Vector<br>
     * See wikipedia dot product for more informations
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Float} dotProduct result
     */
    dotProduct(a: Vector2, b?: Vector2): number;
    /**
     * return the angle (radians) between two vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Float} angle result
     */
    getAngle(otherA: Vector2, otherB?: Vector2): number;
    /**
     * I keep this function because I accidentally coded something fun with, so... :D
     */
    wtfAngle(a: Vector2, b?: Vector2): number;
    /**
     * return real pixel distance with an other Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} other
     * @returns {Int} distance result
     */
    /****
     * getDistance@Int( other@Vector2 )
     */
    getDistance(other: Vector2): number;
    /**
     * trigger a circle collision with an other Vector and a range
     * @public
     * @memberOf Vector2
     * @param {Vector2} other
     * @param {Float} range
     * @returns {Boolean} isInRange result
     */
    isInRangeFrom(other: Vector2, range: number): boolean;
    /**
     * return the harmonics value<br>
     * can pass a rotation to get harmonics with this rotation
     * @public
     * @memberOf Vector2
     * @param {Float} [rotation] used by gameObjects in getPos and other
     * @returns {Harmonics} harmonics (cosinus and sinus)
     */
    getHarmonics(rotation?: number): {
        cos: number;
        sin: number;
    };
    /**
     * set precise position - fall-back for older dreamengine version - DEPRECATED - use PIXI.DisplayObject.position.set
     * @public
     * @memberOf Vector2
     * @param {Vector2|Float} Vector2 or x / y
     * @returns {Vector2} this current instance
     */
    setPosition(first: Vector2 | number, y?: number): this;
    set(first: Vector2 | number, y?: number): void;
    /**
     * simple clone method
     * @public
     * @memberOf Vector2
     */
    clone(): Vector2;
    /**
   * return a positive angle difference between 2 angles.
    Example, if A = 0 and B = PI*2, then difference is 0.
    (or A = 0.1 B = 6, difference is 0.383185307179586)
    */
    getAnglesDifference(angleA: number, angleB?: number): number;
    /**
     * this turn your vector with the angle you provide, or by default using it's own rotation
     * @public
     * @memberOf Vector2
     */
    turnVector(angle: number): this;
    /**
     * return a turned vector with the angle you provide, or by default using it's own rotation
     * same as turnVector, but not modifying the instance
     * @public
     * @memberOf Vector2
     */
    getTurnedVector(angle: number): {
        x: number;
        y: number;
    };
}
export default Vector2;
