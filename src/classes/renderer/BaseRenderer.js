import Time from 'DE.Time';

var _inherits = [
  'setScale',
  'applyFade',
  'fade',
  'fadeIn',
  'fateTo',
  'fadeOut',
  'scaleTo',
  'applyScale',
  'setSize',
  'center',
];
var _attributes = ['fadeData', 'scaleData'];
const BaseRenderer = new (function() {
  /**
   * object used to apply fade on final BaseRenderer rendering
   * @protected
   * @memberOf BaseRenderer
   * @type {Object}
   */
  this.fadeData = {
    from: 1,
    to: 0,
    duration: 1000,
    done: true,
  };

  /**
   * object used to apply scale on final Renderer rendering
   * @protected
   * @memberOf Renderer
   * @type {Object}
   */
  this.scaleData = {
    fromx: 1,
    tox: 0,
    fromy: 1,
    toy: 0,
    duration: 1000,
    done: true,
  };

  this.inherits = function(target) {
    for (var i = 0; i < _inherits.length; ++i) {
      target.prototype[_inherits[i]] = this[_inherits[i]];
    }
  };

  var _ignore = ['scale', 'scaleX', 'scaleY', 'opacity'];
  this.instantiate = function(target, params) {
    if (params) {
      target.alpha = params.alpha || params.opacity || 1;
      params.scale = {
        x: params.scaleX || (params.scale ? params.scale.x || params.scale : 1),
        y: params.scaleY || (params.scale ? params.scale.y || params.scale : 1),
      };
      if (params.size) {
        params.width = params.size;
        params.height = params.size;
      }
      delete params.scaleY;
      delete params.scaleX;
      delete params.opacity;
      delete params.size;

      for (var i in params) {
        if (target[i] && target[i].set) {
          if (params[i].x !== undefined) {
            target[i].set(params[i].x, params[i].y);
          } else {
            target[i].set(params[i]);
          }
        } else {
          target[i] = params[i];
        }
      }
    }

    for (var i = 0; i < _attributes.length; ++i) {
      target[_attributes[i]] = this[_attributes[i]];
    }
  };
})();

BaseRenderer.setScale = function(x, y) {
  if (y === undefined) {
    if (x.x) {
      this.scale.set(x.x, x.y);
    } else {
      this.scale.set(x, x);
    }
  } else {
    this.scale.set(x, y);
  }
};

/**
 * apply the current fade
 * @protected
 * @memberOf BaseRenderer
 */
BaseRenderer.applyFade = function() {
  if (this.fadeData.done) {
    return;
  }

  this.fadeData.stepVal =
    (Time.frameDelay / this.fadeData.oDuration) *
    this.fadeData.dir *
    this.fadeData.fadeScale;

  this.alpha += this.fadeData.stepVal * Time.scaleDelta;
  this.fadeData.duration -= Time.frameDelayScaled;

  if (
    (this.fadeData.dir < 0 && this.alpha <= this.fadeData.to) ||
    (this.fadeData.dir > 0 && this.alpha >= this.fadeData.to) ||
    this.alpha < 0 ||
    this.alpha > 1
  ) {
    this.alpha = this.fadeData.to;
  }

  if (this.fadeData.duration <= 0) {
    this.fadeData.done = true;

    if (this.alpha == 1 || this.alpha == 0) {
      if (this.alpha == 0) {
        this.sleep = true;
      }
    }

    if (this.gameObject) {
      this.gameObject.trigger('fadeEnd', this);
    }
  }
};

/**
 * create a fade from val, to val, with given duration time
 * @public
 * @memberOf BaseRenderer
 * @param {Float} from start value
 * @param {Float} [to=0] end value
 * @param {Int} [duration=500] fade duration in ms
 * @example myObject.renderers[ 0 ].fade( 0.5, 1, 850 );
 */
BaseRenderer.fade = function(from, to, duration) {
  this.sleep = false;
  var data = {
    from: from || 1,
    to: to != undefined ? to : 0,
    duration: duration || 500,
    oDuration: duration || 500,
    fadeScale: Math.abs(from - to),
    done: false,
  };
  data.dir = data.from > to ? -1 : 1;
  this.alpha = from;
  this.fadeData = data;
};

/**
 * create a fade to val, from current alpha value with given duration time
 * @public
 * @memberOf BaseRenderer
 * @param {Float} [to=0] end value
 * @param {Int} [duration=500] fade duration in ms
 * @example myObject.renderers[ 0 ].fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
 */
BaseRenderer.fadeTo = function(to, duration) {
  this.sleep = false;
  this.fade(this.alpha, to, duration);
};

/**
 * fade the BaseRenderer to alpha 0 with given duration time
 * fade start to the current alpha or 1 if force is true
 * @public
 * @memberOf BaseRenderer
 * @param {Int} [duration=500] fade duration in ms
 * @param {Boolean} [force=false] if true will set alpha at 1 before fade
 * @example // alpha = 0 in 850ms
 * myObject.renderers[ 0 ].fadeOut( 850 );
 */
BaseRenderer.fadeOut = function(duration, force) {
  this.sleep = false;
  if (force) {
    this.alpha = this.alpha > 0 ? this.alpha : 1; // make sure to prevent any blink side effect
  }
  this.fade(this.alpha, 0, duration);
};

/**
 * fade the BaseRenderer to alpha 1 with given duration time
 * fade start to the current alpha, or 0 if force is true
 * @public
 * @memberOf BaseRenderer
 * @param {Int} [duration=500] fade duration in ms
 * @param {Boolean} [force=false] if true will set alpha at 0 before fade
 * @example // alpha = 1 in 850ms
 * myObject.renderers[ 0 ].fadeIn( 850 );
 */
BaseRenderer.fadeIn = function(duration, force) {
  this.sleep = false;
  if (force) {
    this.alpha = this.alpha < 1 ? this.alpha : 0; // make sure to prevent any blink side effect
  }
  this.fade(this.alpha, 1, duration);
};

/**
 * create a fluid scale
 * you can only have one at a time
 * @public
 * @memberOf BaseRenderer
 * @param {Object} scale give final x, and final y
 * @param {Int} [duration=500] time duration
 * @example // scale to 2,3 in 1 second
 * myRenderer.scaleTo( { x: 2, y: 3 }, 1000 );
 */
BaseRenderer.scaleTo = function(scale, duration, callback) {
  var dscale = {
    x: !isNaN(scale) ? scale : scale.x,
    y: !isNaN(scale) ? scale : scale.y,
  };
  this.scaleData = {
    valX: -(this.scale.x - (dscale.x !== undefined ? dscale.x : this.scale.x)),
    valY: -(this.scale.y - (dscale.y !== undefined ? dscale.y : this.scale.y)),
    dirX: this.scale.x > dscale.x ? 1 : -1,
    dirY: this.scale.y > dscale.y ? 1 : -1,
    duration: duration || 500,
    oDuration: duration || 500,
    done: false,
    stepValX: 0,
    stepValY: 0,
    destX: dscale.x,
    destY: dscale.y,
    scaleX: this.scale.x,
    scaleY: this.scale.y,
    callback: callback,
  };
  this.scaleData.leftX = this.scaleData.valX;
  this.scaleData.leftY = this.scaleData.valY;
};

/**
 * apply the current scale
 * @protected
 * @memberOf BaseRenderer
 */
BaseRenderer.applyScale = function() {
  if (this.scaleData.done) {
    return;
  }

  var scaleD = this.scaleData;

  if (scaleD.valX != 0) {
    scaleD.stepValX = (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valX;
    scaleD.leftX -= scaleD.stepValX;
    scaleD.scaleX += scaleD.stepValX;
  }

  if (scaleD.valY != 0) {
    scaleD.stepValY = (Time.frameDelayScaled / scaleD.oDuration) * scaleD.valY;
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

  this.setScale(scaleD.scaleX, scaleD.scaleY);

  if (scaleD.duration <= 0) {
    this.scaleData.done = true;
    this.setScale(scaleD.destX, scaleD.destY);

    if (this.gameObject) {
      this.gameObject.trigger('scale-end', this);
    }

    if (this.scaleData.callback) {
      this.scaleData.callback.call(this);
    }
  }
};
BaseRenderer.DEName = 'BaseRenderer';

// allow a quick way to change the sizes of a renderer and center it automatically
// IF this renderer does not have an anchor.
// those methods will work only if the renderer has a modifiable width/height
BaseRenderer.setSize = function(width, height, preventCenter) {
  this.width = width;
  this.height = height;

  if (preventCenter !== undefined) {
    this.preventCenter = preventCenter;
  }
  if (!this.preventCenter && !this.anchor) {
    this.center();
  }
};

// center the renderer
BaseRenderer.center = function() {
  if (this.anchor && this.anchor.set) {
    this.anchor.set(0.5, 0.5);
  } else {
    this.x = -(this.width || 0) / 2;
    this.y = -(this.height || 0) / 2;
  }
};

export default BaseRenderer;
