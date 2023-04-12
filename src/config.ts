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
  DEFAULT_POOL_NAME: 'default',
  notifications: {
    enable: true, // notifications enable by default
    gamepadEnable: true,
    gamepadAvalaible: 'Gamepad avalaible !',
    gamepadChange: true,
    achievementUnlockDuration: 8000,
  },
};

Object.defineProperties(config, {
  /**
   * getter/setter for DEBUG_LEVEL, emit an event "change-debug"
   * @memberOf config
   * @public
   */
  DEBUG: {
    get: function () {
      return config._DEBUG;
    },
    set: function (bool) {
      Events.emit('change-debug', bool, config._DEBUG_LEVEL);
      config._DEBUG = bool;
    },
  },

  /**
   * getter/setter for DEBUG_LEVEL, emit an event "change-debug"
   * @memberOf config
   * @public
   */
  DEBUG_LEVEL: {
    get: function () {
      return config._DEBUG_LEVEL;
    },
    set: function (bool) {
      Events.emit('change-debug', config._DEBUG, bool);
      config._DEBUG_LEVEL = bool;
    },
  },
});

export default config;
