import * as PIXI from 'pixi.js';
import about from '../about';
import config from '../config';
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
    Event.emit( "loadFilesEnd" );
  } );
  
  PIXI.Loader.shared.on( 'start', function()
  {
    States.up( 'isLoadingImages' );
    Event.emit( "loadFilesStart" );
  } );
  */

export type InitFunctionParam = {
  [poolName: string]: InitImageData[]; // indique que chaque paramètre doit correspondre à un nombre
  default: InitImageData[]; // définit un paramètre par défaut obligatoire
};

/* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
const PIXI_LOADER = PIXI.Loader.shared as PIXI.Loader;
/* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
PIXI_LOADER.pre((resource: any, next: () => void) => {
  if (resource.url.split('://').length > 1) {
    resource.crossOrigin = true;
    // resource.loadType = PIXI.loaders.Resource.LOAD_TYPE.XHR;
  }
  next();
});

export class ImageManager {
  public readonly DEName = 'ImageManager';
  pathPrefix: string;
  imageNotRatio: boolean;
  ratioToConception: number;
  baseUrl: string;

  pools: PoolType = { default: [] };
  loadedPools: string[] = [];
  spritesData: Record<string, EnforcedSpriteData>;

  /** DO NOT USE */
  _waitingPools: { name: string; customEventName?: string }[];

  /** DO NOT USE */
  _waitingSolo: InitImageData[];

  constructor() {
    // quality var define what we need and how to use it
    this.pathPrefix = '';
    this.imageNotRatio = false;
    this.ratioToConception = 1;

    this.baseUrl = 'img/';

    this.spritesData = {}; // store data for SpriteRenderer
    this._waitingPools = []; // cannot load multiple resources / pools // have to queue
    this._waitingSolo = []; // cannot load multiple resources / pools // have to queue
  }

  /**
   * main init function, create pool and set baseUrl in an object, used to load things later
   * call ImageManager.loadPool( poolName ) to start loading things
   * @protected
   * @memberOf ImageManager
   */
  init(baseUrl: string, pools: InitFunctionParam) {
    this.baseUrl = baseUrl;
    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    PIXI_LOADER.baseUrl = baseUrl;

    this.pools = {};

    const version = '?v' + about.gameVersion;
    for (const i in pools) {
      const p = pools[i];
      this.pools[i] = [];
      for (let n = 0; n < Object.keys(p).length; ++n) {
        const data = p[n];
        // if we are loading a tilesheet like an export from TexturePacker
        if (typeof data === 'string') {
          this.pools[i].push({ url: data });
        } else if (typeof data[0] === typeof data[1]) {
          if (!data[2]) {
            data[2] = {};
          }
          this.spritesData[data[0]] = generateSpriteData(data[2]);
          this.pools[i].push({ name: data[0], url: data[1] + version });
        } else {
          console.error(
            'File format not recognized, make sure you follow the guidelines',
            data,
          );
        }
      }
    }
  }

  /**
   * load a complete pool in memory
   * @public
   * @memberOf ImageManager
   */
  loadPool(poolName: string, customEventName?: string, resetLoader = false) {
    const self = this;

    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    if (PIXI_LOADER.loading) {
      // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
      this._waitingPools.push({
        name: poolName,
        customEventName: customEventName,
      });
      return;
    }

    if (poolName !== 'default') {
      if (this.loadedPools.includes(poolName)) {
        console.warn('Pool', poolName, 'is already loaded');
        setTimeout(() => {
          self._onComplete(poolName, customEventName);
        }, 16);
        return;
      }
      this.loadedPools.push(poolName);
    }
    if (this.pools[poolName].length == 0) {
      setTimeout(() => {
        self._onComplete(poolName, customEventName);
      }, 16);
      return;
    }

    if (resetLoader) {
      PIXI_LOADER.reset();
    }

    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    PIXI_LOADER.onProgress.add((loader: PIXI.Loader) => {
      self._onProgress(poolName, loader, customEventName);
    });
    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    PIXI_LOADER.add(this.pools[poolName]).load(() => {
      self._onComplete(poolName, customEventName);
    });
  }

  /**
   * onProgress event
   * @private
   * @memberOf ImageManager
   */
  _onProgress(poolName: string, loader: PIXI.Loader, customEventName?: string) {
    Events.emit(
      'ImageManager-pool-progress',
      poolName,
      /* @ts-ignore TODO progress is not accessible in PIXI V6, but it's to much work as PIXI V8 is completely different */
      loader.progress.toString().slice(0, 5),
    );
    Events.emit(
      'ImageManager-pool-' + poolName + '-progress',
      poolName,
      /* @ts-ignore TODO progress is not accessible in PIXI V6, but it's to much work as PIXI V8 is completely different */
      loader.progress.toString().slice(0, 5),
    );
    if (customEventName)
      Events.emit(
        'ImageManager-' + customEventName + '-progress',
        poolName,
        /* @ts-ignore TODO progress is not accessible in PIXI V6, but it's to much work as PIXI V8 is completely different */
        loader.progress.toString().slice(0, 5),
      );
  }

  /**
   * when a load is completed
   * @private
   * @memberOf ImageManager
   */
  _onComplete(poolName: string, customEventName?: string) {
    console.log('ImageManager load complete: ', poolName);
    Events.emit('ImageManager-pool-complete', poolName);
    Events.emit('ImageManager-pool-' + poolName + '-loaded');
    if (customEventName)
      Events.emit('ImageManager-' + customEventName + '-loaded');

    // dequeue waiting pools here
    if (this._waitingPools.length != 0) {
      const pool = this._waitingPools.shift()!;
      this.loadPool(pool.name, pool.customEventName);
    } else if (this._waitingSolo.length != 0) {
      const solo = this._waitingSolo.shift()!;
      this.load(solo);
    }
  }

  /**
   * load one resource
   * @public
   * @memberOf ImageManager
   */
  load(data: InitImageData) {
    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    if (PIXI_LOADER.resources[data[0]]) {
      /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
      PIXI.utils.TextureCache[PIXI_LOADER.resources[data[0]].url].destroy();
      /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
      delete PIXI_LOADER.resources[data[0]];
    }

    let dataLoad: PoolContent | InitImageData = data;

    if (typeof data !== 'string' && typeof data[0] === typeof data[1]) {
      if (!data[2]) {
        data[2] = {};
      }

      this.spritesData[data[0]] = generateSpriteData(data[2]);
      let url = data[1];
      // external images don't receive the version as they could already have custom params
      if (url.split('://').length === 1) {
        url += '?v' + config.VERSION;
      }
      dataLoad = { name: data[0], url };
    }

    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    if (PIXI_LOADER.loading) {
      // console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
      this._waitingSolo.push(data);
      return;
    }

    const self = this;
    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    PIXI_LOADER.add(dataLoad as PoolContent).load(() => {
      // PIXI_LOADER.reset();
      // TODO find a way to prevent "success" trigger if the image failed to load
      /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
      PIXI_LOADER.onProgress.detachAll();
      if (typeof dataLoad === 'string') self._onComplete('', dataLoad);
      else self._onComplete('', (dataLoad as PoolContent).name);
    });
  }

  /**
   * unload a complete pool (clean memory)
   * @public
   * @memberOf ImageManager
   */
  unloadPool(poolName: string) {
    console.warn('Unload pool name', poolName);
    const poolIndex = this.loadedPools.indexOf(poolName);
    if (poolIndex === -1) return;
    this.loadedPools.splice(poolIndex, 1);
    const pool = this.pools[poolName];
    for (let i = 0, res, t = pool.length; i < t; ++i) {
      res = pool[i];

      this.unloadAsset(res.name || res.url, res);
    }
  }

  /**
   * unload a specific asset (clean memory)
   * @public
   * @memberOf ImageManager
   */
  unloadAsset(assetName: string, originalResource: any) {
    /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
    const pack = PIXI_LOADER.resources[assetName];

    if (pack) {
      console.warn('Unload asset: ', originalResource);

      if (pack.data?.meta?.related_multi_packs?.length) {
        pack.data.meta.related_multi_packs.forEach((subPack: string) => {
          this.unloadAsset(
            subPack.replace('.json', ''),
            subPack.replace('.json', ''),
          );
        });
      }
      let textures = pack.textures;

      for (const tx in textures) {
        textures[tx].destroy();
        delete textures[tx];
      }

      textures = undefined;

      pack.spritesheet?.destroy(true);
      delete pack.spritesheet;

      if (pack.extension === 'json') {
        /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
        delete PIXI_LOADER.resources[assetName + '_image'];
      }
      /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
      delete PIXI_LOADER.resources[assetName];
    } else {
      const txCache =
        /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
        PIXI.utils.TextureCache[PIXI_LOADER.resources[assetName].url];

      if (txCache) {
        txCache.destroy(true);
        /* @ts-ignore type fail but doc says it's ok: https://pixijs.download/v6.5.1/docs/PIXI.Loader.html */
        delete PIXI_LOADER.resources[assetName];
      } else {
        console.warn(
          'Impossible to unload the asset from the pool, maybe the code does not support this kind of stuff',
          originalResource,
        );
      }
    }
  }
}

const imgManag = new ImageManager();
export default imgManag;

function generateSpriteData(spriteData: SpriteData): EnforcedSpriteData {
  return {
    totalLine: spriteData.totalLine ?? 1,
    totalFrame: spriteData.totalFrame ?? 1,
    startFrame: spriteData.startFrame ?? 0,
    endFrame: spriteData.endFrame ?? (spriteData.totalFrame ?? 1) - 1 ?? 0,
    interval: spriteData.interval ?? 16,
    reversed: spriteData.reversed ?? false,
    loop: spriteData.loop !== undefined ? spriteData.loop : true,
    animated: spriteData.animated !== undefined ? spriteData.animated : true,
    pingPongMode:
      spriteData.pingPongMode !== undefined ? spriteData.pingPongMode : false,
  };
}
