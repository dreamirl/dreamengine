import * as PIXI from 'pixi.js';
import ImageManager from '../../utils/ImageManager';
import Time from '../../utils/Time';
import BaseRenderer from './BaseRenderer';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor SpriteRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite<br>
 * if the given sprite is animated, it'll animate it automatically according to you imagesDatas file<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var ship = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.SpriteRenderer( { "spriteName": "ship", "scale": 0.7, "offsetY": -30 } )
 * } );
 */

function SpriteRenderer(params) {
  this.spriteName = params.spriteName || params.spriteUrl || params.textureName;
  delete params.spriteName;
  if (!this.spriteName) {
    throw new Error(
      'SpriteRenderer :: No spriteName defined -- declaration canceled',
    );
  }

  this.isAtlasTexture = false;

  let texture = _getTexture(this.spriteName);
  // only if no texture can be found either using standard url reading or naming in sheets
  if (!texture) {
    throw new Error(
      "SpriteRenderer :: Can't find image " +
        this.spriteName +
        ' in ImageManager, is the image a sheet ? Or maybe not loaded ?',
    );
  }

  if (!ImageManager.spritesData[this.spriteName]) {
    this.isAtlasTexture = true;
    this.spriteData = params.spriteData;
  }

  PIXI.Sprite.call(this, texture);
  BaseRenderer.instantiate(this, params);

  //Nb: every value here is set to 0/null/undefined, at the end of the declaration changeSprite is called and everything is correctly set here
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.startFrame = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.endFrame = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this._currentFrame = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.startLine = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this._currentLine = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.totalFrame = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.totalLine = 0;

  /**
   * time in ms
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.interval = 0;

  /**
   * @private
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this._nextAnim = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.animated = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.isPaused = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.reversed = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.isOver = 0;

  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  this.loop = 0;

  this._tint = params.tint || undefined;

  /**
   * if true animation will play normal then reversed then normal....
   * @public
   * @memberOf SpriteRenderer
   * @type {Boolean}
   */
  this.pingPongMode = false;

  /**
   * @public
   * This function is called when the animation is over. Overwrite this function
   * @memberOf SpriteRenderer
   */
  this.onAnimEnd = function () {};
  this.changeSprite(this.spriteName, params);

  // was used to handle quality change
  // Events.on( 'quality-changed', function( n, nt, name )
  // {
  //   if ( name != this.spriteName )
  //     return;

  //   this.frameSizes.width  = ImageManager.spritesData[ this.spriteName ].widthFrame;
  //   this.frameSizes.height = ImageManager.spritesData[ this.spriteName ].heightFrame;
  // }, this );
}

function _getTexture(spriteName) {
  if (ImageManager.spritesData[spriteName]) {
    return PIXI.utils.TextureCache[
      PIXI.Loader.shared.resources[spriteName].url
    ];
  } else {
    return PIXI.utils.TextureCache[spriteName];
  }
}

SpriteRenderer.prototype = Object.create(PIXI.Sprite.prototype);
SpriteRenderer.prototype.constructor = SpriteRenderer;
SpriteRenderer.prototype.DEName = 'SpriteRenderer';

BaseRenderer.inherits(SpriteRenderer);
Object.defineProperties(SpriteRenderer.prototype, {
  currentFrame: {
    get: function () {
      return this._currentFrame;
    },
    set: function (frame) {
      if (frame >= this.endFrame) {
        this._currentFrame = this.endFrame;
      } else if (frame < this.startFrame) {
        this._currentFrame = this.startFrame;
      } else {
        this._currentFrame = frame;
      }

      this._originalTexture.frame.x = this._currentFrame * this.fw;
      this._originalTexture.updateUvs();

      if (this.normalTexture) {
        this.normalTexture.frame.x = this._currentFrame * this.fw;
        this.normalTexture.updateUvs();
      }
    },
  },

  currentLine: {
    get: function () {
      return this._currentLine;
    },
    set: function (line) {
      if (line >= this.endLine) {
        this._currentLine = this.endLine;
      } else if (line < this.startLine) {
        this._currentLine = this.startLine;
      } else {
        this._currentLine = line;
      }

      this._originalTexture.frame.y = this._currentLine * this.fh;
      this._originalTexture.updateUvs();

      if (this.normalTexture) {
        this.normalTexture.frame.y = this._currentLine * this.fh;
        this.normalTexture.updateUvs();
      }
    },
  },
});

/**
 * update the animation (called by the GameObject, if you use it an other way you have to call update)
 * @protected
 * @memberOf SpriteRenderer
 */
SpriteRenderer.prototype.update = function () {
  if (!this.animated || this.isPaused || this.isOver) {
    return;
  }

  this._nextAnim -= Time.frameDelayScaled;
  if (this._nextAnim > 0) {
    return;
  }

  this._nextAnim = this.interval + this._nextAnim; // sub rest of previous anim time (if it take 50ms and we goes up to 55, remove 5)
  this.lastAnim = Date.now();

  this._currentFrame += this.reversed ? -1 : 1;
  if (this._currentFrame > this.endFrame) {
    if (this.loop) {
      this._currentFrame = this.startFrame;
      if (this.pingPongMode) {
        this.reversed = true;
        this._currentFrame = this.endFrame - 1;
      }
    } else {
      this._currentFrame = this.endFrame;
      this.isOver = true;
      this.onAnimEnd();
    }
  } else if (this._currentFrame < this.startFrame) {
    if (this.loop) {
      this._currentFrame = this.endFrame;
      if (this.pingPongMode) {
        this.reversed = false;
        this._currentFrame = this.startFrame + 1;
      }
    } else {
      this._currentFrame = this.startFrame;
      this.isOver = true;
      this.onAnimEnd();
    }
  }

  this._originalTexture.frame.x = this._currentFrame * this.fw;
  this._originalTexture.frame.y = this._currentLine * this.fh;
  this._originalTexture.updateUvs();

  if (this.normalTexture) {
    this.normalTexture.frame.x = this._currentFrame * this.fw;
    this.normalTexture.frame.y = this._currentLine * this.fh;
    this.normalTexture.updateUvs();
  }
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.setFrame = function (frame) {
  this.currentFrame = frame;
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.setLine = function (line) {
  this.currentLine = line;
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.restartAnim = function () {
  this.isOver = false;
  if (!this.reversed) {
    this.currentFrame = this.startFrame;
  } else {
    this.currentFrame = this.endFrame - 1;
  }
  this.lastAnim = Time.currentTime;
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.setPause = function (val) {
  this.isPaused = val;
  if (!val && !this.animated) {
    this.animated = true;
    this.lastAnim = Date.now();
  }
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.setEndFrame = function (v) {
  if (this.totalFrame <= v) {
    this.endFrame = this.totalFrame - 1;
  } else {
    this.endFrame = v;
  }
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int} interval in ms
 */
SpriteRenderer.prototype.setInterval = function (interval) {
  this.interval = interval;
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.setLoop = function (bool) {
  this.loop = bool;
  return this;
};

/**
 * @public
 * @memberOf SpriteRenderer
 * @type {Int}
 */
SpriteRenderer.prototype.changeSprite = function (spriteName, params) {
  params = params || {};
  this.spriteName = spriteName;

  if (!this.spriteName) {
    throw new Error(
      'SpriteRenderer :: No spriteName defined -- declaration canceled',
    );
  }

  var d = this.spriteData || ImageManager.spritesData[this.spriteName];

  this.startFrame = params.startFrame || d.startFrame || 0;
  this.endFrame = params.endFrame || d.endFrame || d.totalFrame - 1 || 0;

  this._currentFrame = this.startFrame || params.currentFrame || 0;
  this._currentLine = params.startLine || 0;

  this.startLine = params.startLine || 0;
  this.endLine = params.endLine || d.endLine || d.totalLine - 1 || 0;

  this.totalFrame = d.totalFrame || 1;
  this.totalLine = params.totalLine || d.totalLine || 1;

  this.interval = params.interval || d.interval || 0;
  this.nextAnim = this.interval;

  this.animated =
    params.animated !== undefined
      ? params.animated
      : d.animated || this.animated;
  this.isPaused =
    params.paused !== undefined
      ? params.paused
      : params.isPaused || this.isPaused;
  this.reversed =
    params.reversed != undefined
      ? params.reversed
      : d.reversed || this.reversed;

  this.pingPongMode =
    params.pingPongMode !== undefined
      ? params.pingPongMode
      : d.pingPongMode || this.pingPongMode;

  this.isOver = false;
  this.loop = params.loop != undefined ? params.loop : d.loop || this.loop;

  this.baseTexture = _getTexture(this.spriteName);

  if (params.normal) {
    this.normalName = params.normal;
    this.baseNormalTexture = _getTexture(params.normal);
  }

  this.fw = (this.baseTexture.width / this.totalFrame) >> 0;
  this.fh = (this.baseTexture.height / this.totalLine) >> 0;
  var size = new PIXI.Rectangle(
    this.currentFrame * this.fw,
    this.currentLine * this.fh,
    this.fw,
    this.fh,
  );
  this.texture = new PIXI.Texture(
    this.baseTexture,
    size,
    size.clone(),
    null,
    null,
  );
  this._originalTexture = this.texture;

  if (this.baseNormalTexture) {
    var normsize = new PIXI.Rectangle(
      this.currentFrame * this.fw,
      this.currentLine * this.fh,
      this.fw,
      this.fh,
    );
    this.normalTexture = new PIXI.Texture(
      this.baseNormalTexture,
      normsize,
      normsize.clone(),
      null,
      null,
    );
  }

  this.setTint(params.tint || 0xffffff);

  if (params.filters) {
    this.filters = params.filters;
  }

  if (params.hue) {
    if (params.hue.length) {
      this.setHue(params.hue[0], params.hue[1]);
    } else if (params.hue.value) {
      this.setHue(params.hue.value, params.hue.multiply);
    } else {
      this.setHue(params.hue);
    }
  }

  if (params.saturation) {
    if (params.saturation.length) {
      this.setSaturation(params.saturation[0], params.saturation[1]);
    } else if (params.saturation.value) {
      this.setSaturation(params.saturation.value, params.saturation.multiply);
    } else {
      this.setSaturation(params.saturation);
    }
  }

  if (params.brightness) {
    if (params.brightness.length) {
      this.setBrightness(params.brightness[0], params.brightness[1]);
    } else if (params.brightness.value) {
      this.setBrightness(params.brightness.value, params.brightness.multiply);
    } else {
      this.setBrightness(params.brightness);
    }
  }

  if (params.contrast) {
    if (params.contrast.length) {
      this.setContrast(params.contrast[0], params.contrast[1]);
    } else if (params.contrast.value) {
      this.setContrast(params.contrast.value, params.contrast.multiply);
    } else {
      this.setContrast(params.contrast);
    }
  }

  if (params.blackAndWhite) {
    this.setBlackAndWhite(params.blackAndWhite);
  }

  if (params.greyscale) {
    if (params.greyscale.length) {
      this.setGreyscale(params.greyscale[0], params.greyscale[1]);
    } else if (params.greyscale.value) {
      this.setGreyscale(params.greyscale.value, params.greyscale.multiply);
    } else {
      this.setGreyscale(params.greyscale);
    }
  }
};

export default SpriteRenderer;
