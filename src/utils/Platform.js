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
  this.init = function(params, callback) {
    return new Promise((res) => {
      setTimeout(() => callback());
      return res();
    });
  };

  /**
   * beforeStartingEngine
   * @memberOf Platform 
   * is automatically called in the DE.start function
   * trigger Nebula load by default, wont do anything it you don't use Nebula
   */
  this.beforeStartingEngine = function() {
    Events.trigger( "force-nebula-load", false );
    return Promise.resolve();
  };

  // prevent the engine to start with default loader (not useful by default, only if the targeted platform use a custom loader, as facebook do)
  this.preventEngineLoader = false;

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
   * 
   * todo, Nebula implementation by default
   * the shop define the standard items that can be purchased on the platform shop, usually, the shop is only about "real money products"
   * everything that is traded with virtual currency is handled in a custom way, and later Nebula will offer a default implementation for multiverse games.
   */
  this.shop = {};
  this.shop.isActive = false;
  this.shop._products = [];
  this.shop._productsById = {};
  this.shop.isReady = false;

  // todo
  this.shop.init = function() {
    return new Promise((res, rej) => {
      console.warn('Platform.shop isn\'t implemented for Nebula yet, returning empty values');
      rej('no-shop-implementation');
    });
  };
  this.shop.getProducts = function() {
    return new Promise((res, rej) => {
      console.warn('Platform.shop isn\'t implemented for Nebula yet, returning empty values');
      res([]);
    });
  };
  this.shop.getPurchases = function() {
    return new Promise((res, rej) => {
      console.warn('Platform.shop isn\'t implemented for Nebula yet, returning empty values');
      res([]);
    });
  };

  /**
   * useful to handle if an item must be purchased or traded against in-game currency
   * usually the method called between game and server isn't the same
   * if the item "isPlatformPurchase" it should be bought with the shop.purchase method
   */
  this.shop.isPlatformPurchase = function(product) {
    return product.realCurrency === true; // subject to change
  };

  /**
   * todo - actually doesn't exist on nebula so it can't be finished for now
   * trigger the nebula payment shop tab by default
   * on others platforms it open the associated payment defined by the plugin
   */
  this.shop.purchase = function() {};
  this.shop.consumePurchase = function() {};


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
