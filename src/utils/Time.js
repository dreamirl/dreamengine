"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    /****
     * update@Bool
      update frames
      TODO - add a paused state (to pause the engine, when changed tab by example)
      */
    static update() {
        if (this.stopped) {
            return false;
        }
        this.currentTime = Date.now();
        this.timeSinceLastFrame += this.currentTime - this.lastCalcul;
        this.timeSinceLastFrame = Math.min(this.timeSinceLastFrame, this.frameDelay * 6);
        this.fpsRecord.unshift(Math.floor(1000 / (this.currentTime - this.lastCalcul)));
        this.fpsRecord = this.fpsRecord.splice(0, Math.min(this.fpsRecord.length, 60));
        this.fps = Math.round(this.fpsRecord.reduce((a, b) => a + b) /
            this.fpsRecord.length);
        this.deltaTime = this.scaleDelta;
        this.frameDelayScaled = this.frameDelay * this.scaleDelta;
        this.lastCalcul = this.currentTime;
        return true;
    }
    /****
     * getDelta@Float
      previously it was private
      */
    static getDelta() {
        return Time.deltaTime;
    }
}
Time.DEName = 'Time';
Time.deltaTime = 1;
Time.missedFrame = 0;
Time.lastCalcul = Date.now();
Time.scaleDelta = 1;
Time.currentTime = Date.now();
Time.fps = 0;
Time.frameDelay = 16;
Time.stopped = false;
Time.fpsRecord = [];
Time.timeSinceLastFrame = 0;
Time.timeSinceLastFrameScaled = 0;
Time.frameDelayScaled = 0;
Time.onTimeStop = () => { };
Time.onTimeResume = () => { };
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
    }
    else {
        Time.lastCalcul = Date.now();
        Time.stopped = false;
        Time.onTimeResume();
    }
}
document.addEventListener('visibilitychange', handleVisibilityChange, false);
exports.default = Time;
