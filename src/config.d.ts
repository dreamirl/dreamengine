/**
 * config contain various stuff for the engine
 * @namespace config
 */
declare const config: {
    DEName: string;
    VERSION: string;
    _DEBUG: boolean;
    _DEBUG_LEVEL: number;
    ALLOW_ONBEFOREUNLOAD: boolean;
    DEFAULT_TEXT_RESOLUTION: number;
    DEFAULT_SORTABLE_CHILDREN: boolean;
    DEFAULT_POOL_NAME: string;
    notifications: {
        enable: boolean;
        gamepadEnable: boolean;
        gamepadAvalaible: string;
        gamepadChange: boolean;
        achievementUnlockDuration: number;
    };
    DEBUG: boolean;
    DEBUG_LEVEL: number;
};
export default config;
