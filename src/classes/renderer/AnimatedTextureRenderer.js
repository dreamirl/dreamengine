import * as PIXI from 'PIXI';
import ImageManager from 'DE.ImageManager';
import config from 'DE.config';
import Time from 'DE.Time';
import Events from 'DE.Events';
import BaseRenderer from 'DE.BaseRenderer';

class AnimatedTextureRenderer extends PIXI.Sprite {
  constructor(imageNames, params) {
    params = params || {};
    super();

    BaseRenderer.instantiate(this, params);

    this._imageNames = [];
    this._textures = [];
    this._currentFrame = 0;

    this.lastAnim = Date.now();
    this.animated = true;
    this._isPaused = false;
    this.loop = params.loop !== undefined ? !!params.loop : true;
    this.reversed = params.reversed || false;
    this.interval = params.interval || 16;
    this.pingPongMode = params.pingPongMode || false;
    this._startFrame = 0;
    this._endFrame = 0;

    this.imageNames =
      imageNames ||
      PIXI.Loader.shared.resources[params.sheetName].data.animations[
        params.animationName
      ];

    if (params.endFrame) {
      this.endFrame = params.endFrame;
    }
    if (params.startFrame) {
      this.startFrame = params.startFrame;
    }
    this.pause = !!params.pause;

    this._nextAnim = this.interval;

    this.setTint(params.tint || 0xffffff);
  }

  get isOver() {
    if (this.reversed) {
      return this._currentFrame < this._startFrame;
    } else {
      return this._currentFrame > this._endFrame;
    }
  }

  get pause() {
    return this._isPaused;
  }
  set pause(bool) {
    this._isPaused = bool;
    if (bool) {
      this._nextAnim = this.interval;
    }
  }

  get textures() {
    return this._textures;
  }
  set textures(textures) {
    this._textures = textures;
    this.endFrame = textures.length - 1;

    // if current frame is greater than the new amount of textures
    // reset to 0
    if (this._currentFrame < textures.length) {
      this.currentFrame = 0;
    }
  }

  get currentFrame() {
    return this._currentFrame;
  }
  set currentFrame(val) {
    this._currentFrame = val;
    this.texture = this._textures[this._currentFrame];
  }

  get endFrame() {
    return this._endFrame;
  }
  set endFrame(frame) {
    this._endFrame = Math.min(Math.max(0, frame), this._textures.length - 1);
    if (this._endFrame < this._startFrame) {
      this.startFrame = this._endFrame;
    }
  }

  get startFrame() {
    return this._startFrame;
  }
  set startFrame(frame) {
    this._startFrame = Math.min(Math.max(0, frame), this._textures.length - 1);
    if (this._startFrame > this._endFrame) {
      this.endFrame = this._startFrame;
    }
  }

  get imageNames() {
    return this._imageNames;
  }
  set imageNames(names) {
    this._imageNames = names;
    const textures = [];
    names.forEach((imgName) =>
      textures.push(PIXI.utils.TextureCache[imgName]),
    );
    this.textures = textures;
  }

  update() {
    if (!this.animated || this.pause || this.isOver) {
      return;
    }

    this._nextAnim -= Time.frameDelayScaled;
    if (this._nextAnim > 0) {
      return;
    }
    this._nextAnim = this.interval + this._nextAnim; // sub rest of previous anim time (if it take 50ms and we goes up to 55, remove 5)
    this.lastAnim = Date.now();

    const tempCurrentFrame = this._currentFrame + (this.reversed ? -1 : 1);
    if (tempCurrentFrame > this.endFrame) {
      if (this.loop) {
        if (this.pingPongMode) {
          this.reversed = true;
          this.currentFrame = this.endFrame - 1;
        } else {
          this.currentFrame = this.startFrame;
        }
      } else {
        this.currentFrame = this.endFrame;
        this.onAnimEnd();
      }
    } else if (tempCurrentFrame < this.startFrame) {
      if (this.loop) {
        if (this.pingPongMode) {
          this.reversed = false;
          this.currentFrame = this.startFrame + 1;
        } else {
          this.currentFrame = this.endFrame;
        }
      } else {
        this.isOver = true;
        this.onAnimEnd();
      }
    } else {
      this.currentFrame = tempCurrentFrame;
    }
  }

  gotoAndPause(frame) {
    this.currentFrame = frame;
    this.pause = true;
  }
}

BaseRenderer.inherits(AnimatedTextureRenderer);

export default AnimatedTextureRenderer;
