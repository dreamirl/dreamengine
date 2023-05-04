import * as PIXI from 'pixi.js';
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
declare type InitImageData = {
    0: string;
    1: string;
    2?: any;
} | string;
declare type PoolContent = {
    name?: string;
    url: string;
    parameters?: any;
};
declare type PoolType = Record<string, PoolContent[]>;
declare type SpriteData = {
    totalLine: number;
    totalFrame: number;
    startFrame: number;
    endFrame: number;
    interval: number;
    reversed: boolean;
    loop: boolean;
    animated: boolean;
    pingPongMode: boolean;
};
export interface InitFunctionParam {
    [parametre: string]: InitImageData[];
    default: InitImageData[];
}
export declare class ImageManager {
    readonly DEName = "ImageManager";
    pathPrefix: string;
    imageNotRatio: boolean;
    ratioToConception: number;
    baseUrl: string;
    pools: PoolType;
    spritesData: Record<string, SpriteData>;
    /** DO NOT USE */
    _waitingPools: {
        name: string;
        customEventName?: string;
    }[];
    /** DO NOT USE */
    _waitingSolo: InitImageData[];
    constructor();
    /**
     * main init function, create pool and set baseUrl in an object, used to load things later
     * call ImageManager.loadPool( poolName ) to start loading things
     * @protected
     * @memberOf ImageManager
     */
    init(baseUrl: string, pools: InitFunctionParam): void;
    /**
     * load a complete pool in memory
     * @public
     * @memberOf ImageManager
     */
    loadPool(poolName: string, customEventName?: string, resetLoader?: boolean): void;
    /**
     * onProgress event
     * @private
     * @memberOf ImageManager
     */
    _onProgress(poolName: string, loader: PIXI.Loader, customEventName?: string): void;
    /**
     * when a load is completed
     * @private
     * @memberOf ImageManager
     */
    _onComplete(poolName: string, customEventName?: string): void;
    /**
     * load one resource
     * @public
     * @memberOf ImageManager
     */
    load(data: InitImageData): void;
    /**
     * unload a complete pool (clean memory)
     * @public
     * @memberOf ImageManager
     */
    unloadPool(poolName: string): void;
}
declare const imgManag: ImageManager;
export default imgManag;
