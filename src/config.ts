import Events from './utils/Events';

/**
 * config contain various stuff for the engine
 * @namespace config
 */
const config = {
  DEName: 'config',
  VERSION: '2.0',
  _DEBUG: false,
  _DEBUG_LEVEL: 0,
  ALLOW_ONBEFOREUNLOAD: true,
  DEFAULT_TEXT_RESOLUTION: 2,
  DEFAULT_SORTABLE_CHILDREN: true,
  DEFAULT_POOL_NAME: 'default',
  notifications: {
    enable: true, // notifications enable by default
    gamepadEnable: true,
    gamepadAvalaible: 'Gamepad avalaible !',
    gamepadChange: true,
    achievementUnlockDuration: 8000,
  },

  get DEBUG(){
    return this._DEBUG;
  },

  set DEBUG(bool: boolean){
    Events.emit('change-debug', bool, this._DEBUG_LEVEL);
    config._DEBUG = bool;
  },

  get DEBUG_LEVEL(){
    return this._DEBUG_LEVEL;
  },

  set DEBUG_LEVEL(num: number){
    Events.emit('change-debug', this._DEBUG, num);
    this._DEBUG_LEVEL = num;
  },
};

export default config;
