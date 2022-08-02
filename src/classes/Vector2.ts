import * as PIXI from 'pixi.js';
import Time from '../utils/Time';

const _PI = Math.PI;
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Scene
 */
class Vector2 extends PIXI.Container {
  public static DEName = 'Vector2';

  private _x = 0;
  private _y = 0;
  private _rotation = 0;
  private _cosAngle = 1;
  private _sinAngle = 0;
  public gameObject;

  constructor(x, y, gameObject?) {
    super();

    this._x = x;
    this._y = y;
    this.gameObject = gameObject;
  }

  /**
   * @public
   * @memberOf Vector2
   * @type {Float}
   */
  public get x() {
    return this.gameObject ? this.gameObject.x : this._x;
  }
  public set x(value) {
    this._x = value;
    if (this.gameObject) {
      this.gameObject.x = value;
    }
  }
  public get y() {
    return this.gameObject ? this.gameObject.y : this._y;
  }
  public set y(value) {
    this._y = value;
    if (this.gameObject) {
      this.gameObject.y = value;
    }
  }

  public get rotation() {
    return this.gameObject ? this.gameObject.rotation : this._rotation;
  }
  public set rotation(value) {
    this._updateRotation(value);
    if (this.gameObject) {
      this.gameObject.rotation = value;
    }
  }

  _updateRotation(value) {
    this._rotation = value;
    if (this._rotation == 0) {
      this._sinAngle = 0;
      this._cosAngle = 1;
    } else {
      this._sinAngle = Math.sin(this._rotation);
      this._cosAngle = Math.cos(this._rotation);
    }
  }
  /**
   * move position along the given Vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} vector2 vector to translate along
   * @param {Boolean} absolute if absolute, translation will ignore current rotation
   * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
   * @returns {Vector2} this current instance
   */
  translate(vector2, absolute, ignoreDelta) {
    if ((!vector2.x && vector2.x != 0) || (!vector2.y && vector2.y != 0)) {
      throw new Error(vector2 + ' is not a Vector2');
    }

    if (!ignoreDelta) {
      vector2 = {
        x: vector2.x * Time.deltaTime,
        y: vector2.y * Time.deltaTime,
      };
    }

    if (!absolute) {
      if (this.rotation == 0) {
        this.x += vector2.x;
        this.y += vector2.y;
      } else {
        this.x -= -vector2.x * this._cosAngle + vector2.y * this._sinAngle;
        this.y -= -vector2.x * this._sinAngle + vector2.y * -this._cosAngle;
      }
    } else {
      this.x += vector2.x;
      this.y += vector2.y;
    }
    return this;
  }

  /**
   * set precise rotation
   * @public
   * @memberOf Vector2
   * @param {Float} newAngle
   * @returns {Float} this.rotation current rotation
   */
  setRotation(newAngle) {
    this.rotation = newAngle % (_PI * 2);
    return this.rotation;
  }

  /**
   * apply the given angle to rotation
   * @public
   * @memberOf Vector2
   * @param {Float} angle rotation value
   * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
   * @returns {Float} this.rotation current rotation
   */
  rotate(angle, ignoreDelta) {
    if (ignoreDelta) return this.setRotation(this.rotation + angle);
    return this.setRotation(this.rotation + angle * Time.deltaTime);
  }

  /**
   * multiply this vector with coef
   * @public
   * @memberOf Vector2
   * @param {Float} coef
   * @returns {Vector2} this current instance
   */
  multiply(coef) {
    this.x *= coef;
    this.y *= coef;
    return this;
  }

  /**
   * change the vector length to 1 (check wikipedia normalize if you want know more about)
   * @public
   * @memberOf Vector2
   * @returns {Vector2} this current instance
   */
  normalize() {
    if (this.x == 0 && this.y == 0) {
      this.x = 0;
      this.y = 0;
      return this;
    }
    var len = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = this.x / len;
    this.y = this.y / len;
    return this;
  }

  /**
   * return the Vector between two Vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Vector2} this current instance
   */
  getVector(a, b) {
    if (
      (!a.x && a.x != 0) ||
      (!a.y && a.y != 0) ||
      (!b.x && b.x != 0) ||
      (!b.y && b.y != 0)
    ) {
      throw new Error('Vector2 need two Vector2 to return getVector');
    }

    this.x = b.x - a.x;
    this.y = b.y - a.y;
    return this;
  }

  /**
   * return the angle from a vector usefull for moves / translations without rotation
   * @public
   * @memberOf Vector2
   * @param {Vector2} vector2
   * @returns {Float} radians value
   */
  getVectorAngle(vector2) {
    return (Math.atan2(vector2.y, vector2.x) + _PI * 0.5) % (_PI * 2);
  }

  /**
   * return the dotProduct between two Vector<br>
   * See wikipedia dot product for more informations
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Float} dotProduct result
   */
  dotProduct(a, b?) {
    if (!a.x || !a.y) {
      throw new Error('Vector2 need two Vector2 to return dotProduct');
    }
    if (b && b.x) {
      return a.x * b.x + a.y * b.y;
    }
    return this.x * a.x + this.y * a.y;
  }

  /**
   * return the angle (radians) between two vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Float} angle result
   */
  getAngle(otherA, otherB?) {
    if (!otherB) {
      otherB = this;

      if (this.gameObject) {
        otherB = this.gameObject.toGlobal({ x: 0, y: 0 });
      }
    }
    return Math.atan2(otherA.y - otherB.y, otherA.x - otherB.x);
  }

  /**
   * I keep this function because I accidentally coded something fun with, so... :D
   */
  wtfAngle(a, b?) {
    let tmp_vectorB: Vector2;
    if (b && b.x) {
      tmp_vectorB = new Vector2(b.x, b.y).normalize();
    } else {
      tmp_vectorB = new Vector2(this.x, this.y).normalize();
    }
    var tmp_vectorA = new Vector2(a.x, a.y).normalize();
    return Math.acos(tmp_vectorA.dotProduct(tmp_vectorB));
  }

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
  getDistance(other) {
    var x = this.x - other.x;
    x *= x;
    var y = this.y - other.y;
    y *= y;
    return Math.sqrt(x + y);
  }

  /**
   * trigger a circle collision with an other Vector and a range
   * @public
   * @memberOf Vector2
   * @param {Vector2} other
   * @param {Float} range
   * @returns {Boolean} isInRange result
   */
  isInRangeFrom(other, range) {
    range *= range;
    var x = this.x - other.x;
    x *= x;
    var y = this.y - other.y;
    y *= y;
    var dist = x + y;
    if (dist <= range) {
      return true;
    }
    return false;
  }

  /**
   * return the harmonics value<br>
   * can pass a rotation to get harmonics with this rotation
   * @public
   * @memberOf Vector2
   * @param {Float} [rotation] used by gameObjects in getPos and other
   * @returns {Harmonics} harmonics (cosinus and sinus)
   */
  getHarmonics(rotation?) {
    if (rotation) {
      return {
        cos: Math.cos(rotation + this.rotation),
        sin: Math.sin(rotation + this.rotation),
      };
    }
    return { cos: this._cosAngle, sin: this._sinAngle };
  }

  /**
   * set precise position - fall-back for older dreamengine version - DEPRECATED - use PIXI.DisplayObject.position.set
   * @public
   * @memberOf Vector2
   * @param {Vector2|Float} Vector2 or x / y
   * @returns {Vector2} this current instance
   */
  setPosition(first, y?) {
    if (first.x !== undefined || first.y !== undefined) {
      this.x = first.x != undefined ? first.x : this.x;
      this.y = first.y != undefined ? first.y : this.y;
      return this;
    }
    this.x = first != undefined ? first : this.x;
    this.y = y != undefined ? y : this.y;
    return this;
  }

  set(first, y?) {
    this.setPosition(first, y);
  }

  /**
   * simple clone method
   * @public
   * @memberOf Vector2
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
 * return a positive angle difference between 2 angles.
  Example, if A = 0 and B = PI*2, then difference is 0.
  (or A = 0.1 B = 6, difference is 0.383185307179586)
  */
  getAnglesDifference(angleA, angleB?) {
    if (angleB === undefined) {
      angleB = this.rotation;
    }

    var difference = angleA - angleB;
    if (difference < -_PI) {
      difference += _PI * 2;
    } else if (difference > _PI) {
      difference -= _PI * 2;
    }
    return Math.abs(difference);
  }

  /**
   * this turn your vector with the angle you provide, or by default using it's own rotation
   * @public
   * @memberOf Vector2
   */
  turnVector(angle) {
    var cos = this._cosAngle;
    var sin = this._sinAngle;
    if (angle !== undefined) {
      cos = Math.cos(angle);
      sin = Math.sin(angle);
    }

    // why calling this function otherwise?
    if (cos !== 0 || sin !== 0) {
      var x = this.x;
      var y = this.y;
      this.x = x * cos + y * -sin;
      this.y = x * sin + y * cos;
    }

    return this;
  }

  /**
   * return a turned vector with the angle you provide, or by default using it's own rotation
   * same as turnVector, but not modifying the instance
   * @public
   * @memberOf Vector2
   */
  getTurnedVector(angle) {
    var cos = this._cosAngle;
    var sin = this._sinAngle;
    if (angle !== undefined) {
      cos = Math.cos(angle);
      sin = Math.sin(angle);
    }

    var x = this.x;
    var y = this.y;

    // why calling this function otherwise?
    if (cos !== 0 || sin !== 0) {
      x = this.x * cos + this.y * -sin;
      y = this.x * sin + this.y * cos;
    }

    return { x, y };
  }
}

export default Vector2;
