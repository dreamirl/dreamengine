﻿import * as PIXI from 'pixi.js';
import about from './../about';
import config from './../config';
import Events from './Events';

/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * An advanced resource loader. Can load pool of resources, or unload it.
 * Handle images, ready to use spritesImages, json sheets, json particles files or custom files
 * @namespace ImageManagser
 */

/* TODO redefine if used or not 
  PIXI.Loader.shared.on( 'complete', function()
  {
    States.down( 'isLoadingImages' );
    Event.trigger( "loadFilesEnd" );
  } );
  
  PIXI.Loader.shared.on( 'start', function()
  {
    States.up( 'isLoadingImages' );
    Event.trigger( "loadFilesStart" );
  } );
  */

const PIXI_LOADER = PIXI.Loader.shared;
PIXI_LOADER.pre((resource, next) => {
  if (resource.url.split('://').length > 1) {
    resource.crossOrigin = true;
    // resource.loadType = PIXI.loaders.Resource.LOAD_TYPE.XHR;
  }
  next();
});

var _loadingImages = null;
var _indexLoading = 0;
var ImageManager = new (function () {
  this.DEName = 'ImageManager';

  // quality var define what we need and how to use it
  this.pathPrefix = '';
  this.imageNotRatio = false;
  this.ratioToConception = 1;

  this.baseUrl = 'img/';

  this.spritesData = {}; // store data for SpriteRenderer
  this._waitingPools = []; // cannot load multiple resources / pools // have to queue
  this._waitingSolo = []; // cannot load multiple resources / pools // have to queue

  /**
   * main init function, create pool and set baseUrl in an object, used to load things later
   * call ImageManager.loadPool( poolName ) to start loading things
   * @protected
   * @memberOf ImageManager
   */
  this.init = function (baseUrl, pools) {
    this.baseUrl = baseUrl;
    PIXI_LOADER.baseUrl = baseUrl;

    this.pools = pools;

    var version = config.USE_APPCACHE ? '' : '?v' + about.gameVersion;
    var p, data;
    for (var i in pools) {
      p = pools[i];
      this.pools[i] = [];
      for (var n = 0; n < p.length; ++n) {
        data = p[n];
        if (typeof data === 'string') {
          this.pools[i].push(data);
        } else if (data.length && data.push) {
          if (!data[2]) {
            data[2] = {};
          }
          this.spritesData[data[0]] = {
            totalLine: data[2].totalLine || 1,
            totalFrame: data[2].totalFrame || 1,
            startFrame: data[2].startFrame || 0,
            endFrame: data[2].endFrame || data[2].totalFrame - 1 || 0,
            interval: data[2].interval || 16,
            reversed: data[2].reversed || false,
            loop: data[2].loop !== undefined ? data[2].loop : true,
            animated: data[2].animated !== undefined ? data[2].animated : true,
            pingPongMode:
              data[2].pingPongMode !== undefined ? data[2].pingPongMode : false,
          };
          this.pools[i].push({ name: data[0], url: data[1] + version });
        } else {
          console.error(
            'File format not recognized, make sure you follow the guidelines',
            data,
          );
        }
      }
    }
  };

  /**
   * load a complete pool in memory
   * @public
   * @memberOf ImageManager
   */
  this.loadPool = function (poolName, customEventName, resetLoader) {
    var self = this;

    if (this.pools[poolName].length == 0) {
      setTimeout(function () {
        self._onComplete(poolName, customEventName);
      }, 500);
      return;
    }

    if (PIXI_LOADER.loading) {
      // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
      this._waitingPools.push({
        name: poolName,
        customEventName: customEventName,
      });
      return;
    }

    if (resetLoader) {
      PIXI_LOADER.reset();
      this._nLoads = 0;
    }

    PIXI_LOADER.onProgress.add((loader, resource) => {
      self._onProgress(poolName, loader, customEventName);
    });
    PIXI_LOADER.add(this.pools[poolName]).load(function () {
      self._onComplete(poolName, customEventName);
    });
  };

  /**
   * onProgress event
   * @private
   * @memberOf ImageManager
   */
  this._onProgress = function (poolName, loader, customEventName) {
    Events.trigger(
      'ImageManager-pool-progress',
      poolName,
      loader.progress.toString().slice(0, 5),
    );
    Events.trigger(
      'ImageManager-pool-' + poolName + '-progress',
      poolName,
      loader.progress.toString().slice(0, 5),
    );
    Events.trigger(
      'ImageManager-' + customEventName + '-progress',
      poolName,
      loader.progress.toString().slice(0, 5),
    );
  };

  /**
   * when a load is completed
   * @private
   * @memberOf ImageManager
   */
  this._onComplete = function (poolName, customEventName) {
    console.log('ImageManager load complete: ', poolName);
    Events.trigger('ImageManager-pool-complete', poolName);
    Events.trigger('ImageManager-pool-' + poolName + '-loaded');
    Events.trigger('ImageManager-' + customEventName + '-loaded');

    // dequeue waiting pools here
    if (this._waitingPools.length) {
      var pool = this._waitingPools.shift();
      this.loadPool(pool.name, pool.customEventName);
    } else if (this._waitingSolo.length) {
      var solo = this._waitingSolo.shift();
      this.load(solo);
    }
  };

  /**
   * load one resource
   * @public
   * @memberOf ImageManager
   */
  this.load = function (data) {
    if (PIXI_LOADER.resources[data[0]]) {
      PIXI.utils.TextureCache[PIXI_LOADER.resources[data[0]].url].destroy();
      delete PIXI_LOADER.resources[data[0]];
    }

    var dataLoad = data;

    if (typeof data === 'string') {
    } else if (data.length && data.push) {
      if (!data[2]) {
        data[2] = {};
      }

      this.spritesData[data[0]] = {
        totalLine: data[2].totalLine || 1,
        totalFrame: data[2].totalFrame || 1,
        startFrame: data[2].startFrame || 0,
        endFrame: data[2].endFrame || data[2].totalFrame - 1 || 0,
        interval: data[2].interval || 16,
        reversed: data[2].reversed || false,
        loop: data[2].loop !== undefined ? data[2].loop : true,
        animated: data[2].animated !== undefined ? data[2].animated : true,
        pingPongMode:
          data[2].pingPongMode !== undefined ? data[2].pingPongMode : false,
      };
      var url = data[1];
      // external images don't receive the version as they could already have custom params
      if (url.split('://') === 1) {
        url += '?v' + config.VERSION;
      }
      dataLoad = { name: data[0], url };
    }

    if (PIXI_LOADER.loading) {
      // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
      this._waitingSolo.push(dataLoad);
      return;
    }

    var self = this;
    PIXI_LOADER.add(dataLoad).load(function () {
      // PIXI_LOADER.reset();
      // TODO find a way to prevent "success" trigger if the image failed to load
      PIXI_LOADER.onProgress.detachAll();
      self._onComplete(null, dataLoad.name ? dataLoad.name : dataLoad);
    });
  };

  /**
   * unload a complete pool (clean memory)
   * @public
   * @memberOf ImageManager
   */
  this.unloadPool = function (poolName) {
    var pool = this.pools[poolName];
    for (var i = 0, res, t = pool.length; i < t; ++i) {
      res = pool[i];

      PIXI.utils.TextureCache[
        PIXI_LOADER.resources[res.name || res].url
      ].destroy(true);

      // needed ?
      // PIXI doesn't remove it from resources after the texture has been destroyed
      // what is the best practice for this ?
      delete PIXI_LOADER.resources[pool[i].name || pool[i]];
    }
  };
})();

export default ImageManager;
