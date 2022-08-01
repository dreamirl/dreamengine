class Time {
  private constructor() {}

  public static DEName = 'Time';
  public static deltaTime = 1;
  public static missedFrame = 0;
  public static lastCalcul = Date.now();
  public static scaleDelta = 1;
  public static currentTime = Date.now();
  public static fps = 0;
  public static frameDelay = 16;
  public static stopped = false;
  public static fpsRecord: number[] = [];

  public static timeSinceLastFrame = 0;
  public static timeSinceLastFrameScaled = 0;
  public static frameDelayScaled = 0;

  public static onTimeStop = () => {};
  public static onTimeResume = () => {};

  /****
   * update@Bool
    update frames
    TODO - add a paused state (to pause the engine, when changed tab by example)
    */
  public static update() {
    if (this.stopped) {
      return false;
    }

    this.currentTime = Date.now();
    this.timeSinceLastFrame += this.currentTime - this.lastCalcul;
    this.timeSinceLastFrame = Math.min(
      this.timeSinceLastFrame,
      this.frameDelay * 6,
    );

    this.fpsRecord.unshift(
      Math.floor(1000 / (this.currentTime - this.lastCalcul)),
    );
    this.fpsRecord = this.fpsRecord.splice(
      0,
      Math.min(this.fpsRecord.length, 60),
    );
    this.fps = Math.round(
      this.fpsRecord.reduce((a: number, b: number) => a + b) /
        this.fpsRecord.length,
    );

    this.deltaTime = this.scaleDelta;
    this.frameDelayScaled = this.frameDelay * this.scaleDelta;
    this.lastCalcul = this.currentTime;

    return true;
  }

  /****
   * getDelta@Float
    previously it was private
    */
  public static getDelta = function () {
    return this.deltaTime;
  };
}

// TODO
// Event.on( "isInited", function()
// {
//   Time.deltaTime = 0;
//   Time.lastCalcul = Date.now();
// } );

// lock Time if page is hidden (no loop then)
function handleVisibilityChange() {
  if (document.hidden) {
    Time.stopped = true;
    Time.onTimeStop();
  } else {
    Time.lastCalcul = Date.now();
    Time.stopped = false;
    Time.onTimeResume();
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange, false);

export default Time;
