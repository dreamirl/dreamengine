import * as PIXI from 'pixi.js';
import Time from '../../utils/Time';
import '../renderer/ContainerExtensions';

export default class AnimatedTextureRenderer extends PIXI.Sprite {
  private _imageNames: string[];
  private _textures: PIXI.Texture<PIXI.Resource>[];
  private _currentFrame: number;
  public lastAnim: number;
  public animated: boolean;
  private _isPaused: boolean;
  public loop: boolean;
  public reversed: boolean;
  public interval: number;
  public pingPongMode: boolean;
  private _startFrame: number;
  private _endFrame: number;
  public isOver: boolean;
  private _nextAnim: number;
  public sheetName?: string;
  public animationName?: string;

  constructor(
    imageNames: string[],
    params: {
      animated?: boolean;
      loop?: boolean;
      reversed?: boolean;
      interval?: number;
      pingPongMode?: boolean;
      sheetName?: string;
      animationName?: string;
      endFrame?: number;
      startFrame?: number;
      pause?: boolean;
      currentFrame?: number;
      tint?: number;
      randomFrame?: number;
    },
  ) {
    super();
    this.instantiate(this, params);
    params = params || {};

    this._imageNames = [];
    this._textures = [];
    this._currentFrame = 0;

    this.lastAnim = Date.now();
    this.animated = params.animated !== undefined ? !!params.animated : true;
    this._isPaused = false;
    this.loop = params.loop !== undefined ? !!params.loop : true;
    this.reversed = params.reversed || false;
    this.interval = params.interval || 16;
    this.pingPongMode = params.pingPongMode || false;
    this._startFrame = 0;
    this._endFrame = 0;
    this.isOver = false;

    if (imageNames) {
      this.imageNames = imageNames;
    } else {
      if (params.sheetName && params.animationName)
        this.changeSheet(params.sheetName, params.animationName);
    }

    if (params.endFrame) {
      this.endFrame = params.endFrame;
    }
    if (params.startFrame) {
      this.startFrame = params.startFrame;
    }
    this.pause = !!params.pause;
    this._currentFrame = params.currentFrame ? params.currentFrame : 0;

    this._nextAnim = this.interval;

    this.setTint(params.tint || 0xffffff);

    delete params.tint;
    delete params.currentFrame;
    delete params.endFrame;
    delete params.startFrame;

    if (params.randomFrame) {
      this.currentFrame = (Math.random() * this.textures.length) >> 0;
    }
  }

  changeSheet(sheetName: string, animationName: string) {
    this.sheetName = sheetName;
    this.animationName = animationName;

    this.imageNames =
      PIXI.Loader.shared.resources[sheetName].data.animations[animationName];
    this.restart();
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
    const textures: PIXI.Texture<PIXI.Resource>[] = [];
    names.forEach((imgName) => textures.push(PIXI.utils.TextureCache[imgName]));
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
          this.currentFrame = this.endFrame;
        } else {
          this.currentFrame = this.startFrame;
        }
      } else {
        this.isOver = true;
        this.onAnimEnd();
      }
    } else if (tempCurrentFrame < this.startFrame) {
      if (this.loop) {
        if (this.pingPongMode) {
          this.reversed = false;
          this.currentFrame = this.startFrame;
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

  gotoAndPause(frame: number) {
    this.isOver = false;
    this.currentFrame = frame;
    this.pause = true;
  }
  stop() {
    this.gotoAndPause(this.reversed ? this.endFrame : this.startFrame);
  }
  restart() {
    this.pause = false;
    this.isOver = false;
    this.currentFrame = this.reversed ? this.endFrame : this.startFrame;
  }

  onAnimEnd() {}

  static DEName = 'AnimatedTextureRenderer';
}
