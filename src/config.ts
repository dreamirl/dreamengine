import Events from './utils/Events';

/**
 * Config contain various stuff for the engine
 * @namespace config
 */
export class EngineConfig {
  public readonly DEName: string = 'config';
  public readonly VERSION: string = '2.0';

  public DEFAULT_POOL_NAME: string = 'default';
  public DEFAULT_TEXT_RESOLUTION: number = 2;
  public ALLOW_ONBEFOREUNLOAD: boolean = true;

  private _DEBUG: number = 0;
  public get DEBUG(): number {
    return this._DEBUG;
  }
  public set DEBUG(value: number) {
    this._DEBUG = value;
    Events.emit('change-debug', value, this._DEBUG_LEVEL);
  }

  private _DEBUG_LEVEL: number = 0;
  public get DEBUG_LEVEL(): number {
    return this._DEBUG_LEVEL;
  }
  public set DEBUG_LEVEL(value: number) {
    this._DEBUG_LEVEL = value;
    Events.emit('change-debug', this._DEBUG, value);
  }

  public notifications: {
    enable: boolean;
    gamepadEnable: boolean;
    gamepadAvalaible: string;
    gamepadChange: boolean;
    achievementUnlockDuration: number;
  } = {
    enable: true,
    gamepadEnable: true,
    gamepadAvalaible: 'Gamepad available !',
    gamepadChange: true,
    achievementUnlockDuration: 8000,
  };
}

const config = new EngineConfig();
export default config;
