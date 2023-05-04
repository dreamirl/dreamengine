/*
	@param {Object} object: Any object you want to tween. For example: PIXI.Sprite
	@param {String} property: the property which needs to be changed. Use "property.property.property..." if the property is little deeper. Pass "" to create a Wait-Tween
	@param {float} value: targetValue of tweening
	@param {int} frames: duration of the tween in frames.
	@param {boolean} autostart: starting when created? Set to false if you use it with ChainedTween
	@param {function = noEase} easing: easing function to use, default is noEase, examples are https://easings.net/fr (all are implemented)
	
	use examples:
	new Tween(sprite, "position.x", 100, 60, true);
	new Tween(sprite.position, "x", 100, 60, true);
	
*/

export const tweens: Tween[] = [];

export class Tween {
  targetValue: number;
  startValue: number;
  active: boolean;
  currentFrame: number;
  tweenDuration: number;
  object: any;
  property: string;
  onUpdate?: (params: any) => void;
  onUpdateParams?: any;
  onComplete?: (params?: any) => void;
  onCompleteParams?: any;
  easing: (x: number) => number;

  constructor(
    object: any,
    property: string,
    targetValue: number,
    tweenDuration: number,
    autostart = true,
    easing: (x: number) => number = noEase,
  ) {
    this.object = object;
    const properties = property.split('.');
    this.property = properties[properties.length - 1];
    for (let i = 0; i < properties.length - 1; i++) {
      if (properties[i] as keyof typeof object) {
        const temp = properties[i] as keyof typeof object;
        this.object = this.object[temp];
      }
    }

    this.targetValue = targetValue;
    this.startValue = 0;
    this.active = autostart;
    this.currentFrame = 0;
    this.tweenDuration = tweenDuration;
    this.easing = easing;

    tweens.push(this);
  }

  setOnUpdate(callback: (arg?: any) => void, parameters?: any) {
    this.onUpdate = callback;
    this.onUpdateParams = parameters;
  }

  setOnComplete(callback: (arg?: any) => void, parameters?: any) {
    this.onComplete = callback;
    this.onCompleteParams = parameters;
  }

  start() {
    this.active = true;
  }

  initIterations() {
    if (this.property != '') {
      this.startValue = this.object[this.property];
      this.targetValue = this.targetValue - this.object[this.property];
    }
  }

  update(deltaTime: number) {
    if (!this.active) {
      return false;
    }
    if (this.currentFrame == 0) {
      this.initIterations();
    }
    this.currentFrame += deltaTime;
    if (this.currentFrame <= this.tweenDuration) {
      if (this.property != '') {
        const newValue =
          this.startValue +
          this.targetValue *
            this.easing(this.currentFrame / this.tweenDuration);
        this.object[this.property] = newValue;
        if (this.onUpdate != null) {
          this.onUpdate(this.onUpdateParams);
        }
      }
      return false;
    } else {
      this.object[this.property] = this.startValue + this.targetValue;
      this.active = false;
      if (this.onComplete != null) {
        this.onComplete(this.onCompleteParams);
      }
      return true;
    }
  }
}

function noEase(x: number) {
  return x;
}

function inSine(x: number) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

function outSine(x: number) {
  return Math.sin((x * Math.PI) / 2);
}

function inOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function inCirc(x: number) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function outCirc(x: number) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function inOutCirc(x: number) {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function inQuad(x: number) {
  return x * x;
}

function outQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

function inOutQuad(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function inCubic(x: number) {
  return x * x * x;
}

function outCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function inOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function inQuart(x: number) {
  return x * x * x * x;
}

function outQuart(x: number) {
  return 1 - Math.pow(1 - x, 4);
}

function inOutQuart(x: number) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function inQuintic(x: number) {
  return x * x * x * x * x;
}

function outQuintic(x: number) {
  return 1 - Math.pow(1 - x, 5);
}

function inOutQuintic(x: number) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function inExpo(x: number) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function outExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function inOutExpo(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function inBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

function outBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function inOutBack(x: number) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function inElastic(x: number) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}

function outElastic(x: number) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function inOutElastic(x: number) {
  const c5 = (2 * Math.PI) / 4.5;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function inBounce(x: number) {
  return 1 - outBounce(1 - x);
}

function outBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

function inOutBounce(x: number) {
  return x < 0.5
    ? (1 - outBounce(1 - 2 * x)) / 2
    : (1 + outBounce(2 * x - 1)) / 2;
}

// Call this every Frame of your Game/Application to keep the tweens running.
function update(deltaTime: number) {
  for (let i = 0; i < tweens.length; ++i) {
    const tween = tweens[i];
    if (tween.update(deltaTime)) {
      const index = tweens.indexOf(tween);
      if (index != -1) {
        tweens.splice(index, 1);
      }
      i--;
    }
  }
}
// EASING
// use example:
// var tween = new Tween(sprite, "alpha", 0, 60, true);
// tween.easing = outElastic;

// CHAINED TWEEN

/*
	@param {Array} tweens: Array of Tweens.
	
	example:
	var tween1 = new Tween(sprite, "position.x", 100, 60, false);
	var tween2 = new Tween(sprite, "position.x", 0, 60, false);
	new ChainedTween([tween1, tween2]);
*/

export class ChainedTween extends Tween {
  tweensChained: Tween[] = [];
  complete = false;

  constructor(
    tweensToAdd: Tween[],
    onCompleteCb?: (params?: any) => void,
    onCompleteParameters?: any,
  ) {
    super(undefined, '', 0, 0);
    this.onComplete = onCompleteCb;
    this.onCompleteParams = onCompleteParameters;
    this.tweensChained = tweensToAdd;
    for (let i = 1; i < tweensToAdd.length; i++) {
      this.tweensChained[i].update = (deltaTime: number) => {
        const res = this.tweensChained[i].update(deltaTime);
        if (res) {
          this.tweenFinished();
        }
        return res;
      };
      this.tweensChained[i].active = false;
    }
    this.tweensChained[0].start();
    tweens.push(...tweensToAdd);
  }

  tweenFinished() {
    this.tweensChained.splice(0, 1);
    if (this.tweensChained.length != 0) this.tweensChained[0].start();
    else {
      if (this.onComplete) {
        this.onComplete(this.onCompleteParams);
      }
      this.complete = true;
    }
  }

  override update() {
    if (this.complete) {
      return true;
    }
    return false;
  }

  cancel() {
    this.tweensChained = [];
  }
}

export default {
  Tween,
  ChainedTween,
  update,
  Easing: {
    noEase,
    inSine,
    outSine,
    inOutSine,
    inCirc,
    outCirc,
    inOutCirc,
    inQuad,
    outQuad,
    inOutQuad,
    inQuart,
    outQuart,
    inOutQuart,
    inCubic,
    outCubic,
    inOutCubic,
    inQuintic,
    outQuintic,
    inOutQuintic,
    inExpo,
    outExpo,
    inOutExpo,
    inBack,
    outBack,
    inOutBack,
    inElastic,
    outElastic,
    inOutElastic,
    inBounce,
    outBounce,
    inOutBounce,
  },
};

//export default Tween;
