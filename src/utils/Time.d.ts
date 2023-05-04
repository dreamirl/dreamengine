declare class Time {
    static DEName: string;
    static deltaTime: number;
    static missedFrame: number;
    static lastCalcul: number;
    static scaleDelta: number;
    static currentTime: number;
    static fps: number;
    static frameDelay: number;
    static stopped: boolean;
    static fpsRecord: number[];
    static timeSinceLastFrame: number;
    static timeSinceLastFrameScaled: number;
    static frameDelayScaled: number;
    static onTimeStop: () => void;
    static onTimeResume: () => void;
    /****
     * update@Bool
      update frames
      TODO - add a paused state (to pause the engine, when changed tab by example)
      */
    static update(): boolean;
    /****
     * getDelta@Float
      previously it was private
      */
    static getDelta(): number;
}
export default Time;
