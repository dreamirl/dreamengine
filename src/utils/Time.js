const Time = new (function() {
  this.DEName = 'Time';
  this.deltaTime = 1;
  this.missedFrame = 0;
  this.lastCalcul = Date.now();
  this.scaleDelta = 1;
  this.currentTime = Date.now();
  this.fps = 0;
  this.frameDelay = 16;
  this.stopped = false;

  this.timeSinceLastFrame = 0;
  this.timeSinceLastFrameScaled = 0;

  this.onTimeStop = () => {};
  this.onTimeResume = () => {};

  /****
   * update@Bool
    update frames
    TODO - add a paused state (to pause the engine, when changed tab by example)
    */
  this.update = function() {
    if (this.stopped) {
      return false;
    }

    this.currentTime = Date.now();
    this.timeSinceLastFrame += this.currentTime - this.lastCalcul;
    this.timeSinceLastFrame = Math.min(
      this.timeSinceLastFrame,
      this.frameDelay * 6,
    );

    this.fps = Math.floor(1000 / this.timeSinceLastFrame);

    this.deltaTime = this.scaleDelta;
    this.frameDelayScaled = this.frameDelay * this.scaleDelta;
    this.lastCalcul = this.currentTime;

    return true;
  };

  /****
   * getDelta@Float
    previously it was private
    */
  this.getDelta = function() {
    return this.deltaTime;
  };
})();

// TODO
// Event.on( "isInited", function()
// {
//   Time.deltaTime = 0;
//   Time.lastCalcul = Date.now();
// } );

// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.mozHidden !== 'undefined') {
  hidden = 'mozHidden';
  visibilityChange = 'mozvisibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

// lock Time if page is hidden (no loop then)
function handleVisibilityChange() {
  if (document[hidden]) {
    Time.stopped = true;
    Time.onTimeStop();
  } else {
    Time.lastCalcul = Date.now();
    Time.stopped = false;
    Time.onTimeResume();
  }
}

if (
  typeof document.addEventListener === 'undefined' ||
  typeof hidden === 'undefined'
) {
  // no possibility to handle hidden page
} else {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

export default Time;
