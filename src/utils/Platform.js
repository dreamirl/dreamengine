/**
 * Author
 @Inateno / http://inateno.com / http://dreamirl.com 
 */

import Events from 'DE.Events';
import Localization from 'DE.Localization';
import Audio from 'DE.Audio';
import Save from 'DE.Save';

/**
 * @namespace Platform
 * Platform is used to handle every kind of integrations with third-party APIs
 * You can ignore completely using Platform if you just target a specific platform
 * or if you just release the game as it is.
 * 
 * By default, the Platform is designed to work with Nebula
 * triggers are called, so if Nebula isn't loaded, it wont do anything
 * this can be a problem for some Promise function
 * But should be most likely fine
 */
var Platform = new function() {

  /**
   * init
   * @memberOf Platform
   * Call this before everything, but just after upgrading the Platform
   * to the current platform targeted
   */
  this.init = function() {
    return Promise.resolve();
  };

  /**
   * beforeStartingEngine
   * @memberOf Platform 
   * Must be called after the "Platform" loading is complete
   * And before the DE.init
   */
  this.beforeStartingEngine = function() {
    return Promise.resolve();
  };

  /**
   * onEngineStart
   * @memberOf Platform
   * must be called just before DE.start
   */
  this.onEngineStart = function() {
    // force nebula loading by default
    Events.trigger( "force-nebula-load", false );
  }

  // prevent the engine to start with default loader
  this.preventEngineLoader = false;
  /**
   * startLoading
   * @memberof Platform
   * 
   * this function is useless by default, but it is required for some
   * platform such as facebook that use a intern loader
   * so this will be overriden and the first loader will happens
   * before engine start
   */
  this.startLoading = function() {
    return Promise.resolve();
  }

  /**
   *  !!!         USER STUFF        !!!
   */
  /**
   * onUserLogged
   * @memberOf Platform
   * can be called anywhere, but after the Platform as been overriden
   * by defaults it works with Nebula and returns nebulaData
   * but if it's with facebook for example, then it return user fb data
   * (fb_id, name, photo, etc)
   * the fb data don't have the token required by nebula, or suns/dp
   * the currencies have to be stored on the game's server (or on fb)
   * and the token needs to be required for each risky action
   */
  this.user = {};
  this.user.onLogged = function() {
    return new Promise((res, rej) => {
      Events.on( "nebula-logged-success", function( nebulaData )
      {
        Localization.getLang( nebulaData.lang || Localization.currentLang );
        nebulaData.type = 'nebula';
        return res(nebulaData);
      });
    })
  }

  /**
   * onGameData
   * @memberOf Platform
   * can be called anywhere, but after the Platform as been overriden
   * By defaults it works with Nebula and returns nebula's save
   * but if it's with facebook for example, then it return user fb save
   * 
   * By default (with Nebula), it handles Save update and Audio settings
   * (any others settings implementation can be done through res)
   */
  this.user.onGameData = function() {
    return new Promise((res, rej) => {
      Events.on( "nebula-game-connected-success", function( gameData )
      {
        var settings = Save.get( "settings" );
        Audio.music.mute( settings.musicMuted );
        Audio.fx.mute( settings.fxMuted );
        Audio.music.setVolume( settings.musicVolume );
        Audio.fx.setVolume( settings.fxVolume );
        
        return res(gameData);
      });
    });
  }

  /**
   *                ADS STUFF
   */
  this.ads = {};
  // TODO there is two ads type, interstice truc, and rewarded
  this.displayIAP = function() {
    // TODO trigger to nebula by default
  }
  this.preloadAds = function() {

  }


  /**
   *               SHOP STUFF
   */
  this.shop = {};
  this.getProducts = function() {
    // Show the products, custom methods for each games ?
  }

  /**
   *               OTHER STUFF
   */

  /**
   * canCreateShortcut
   * @memberOf Platform
   * return true if there is the possibility to create a shortcut icon (on desk for example)
   * by default use is playing in the browser (or nebula client) so it's
   * maybe not useful or usable
   * 
   * If this change, just fill out this function
   */
  this.canCreateShortcut = function() {
    return false;
  };

  /**
   * createShortcut
   * @memberOf Platform
   * for now it reject all the time by default (not included in web/client)
   * but if this change, make sure to prompt then do
   */
  this.createShortcut = function() {
    return Promise.reject();
  };

  /**
   * pushAnalytic
   * @memberOf Platform
   * send an event to gtag if it exist
   */
  this.pushAnalytic = function(eventName, data) {
    if (gtag) {
      gtag('event', eventName, data);
    }
  }
};

export default Platform;
