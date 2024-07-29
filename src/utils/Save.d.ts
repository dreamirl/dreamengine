import { UserAchievement } from './Achievements';
/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

*/
export type SaveModel = {
    [key: string]: any;
};
/**
 * singleton to make save easy, you can override save method to make yours
   by default save method take your params and set them in the saveTypeDefault object (passed when init)
   then save this object in the localStorage
   the Save save under the GameName and GameVersion
   pass your saveModel when prepare the engine (through the main Engine Initialisation)

   if you want to ignore backup olds version when saving, add saveIgnoreVersion = true on Engine Initialisation
 * @namespace Save
 */
export declare class Save {
    DEName: string;
    saveModel: SaveModel;
    namespace: string;
    version: string;
    useLocalStorage: boolean;
    /**
     * init the save (called by the engine: DE.init), you can ignoreVersion to get the previous one and update it
      but be sure it's compatible
      * @memberOf Save
      * @protected
      * @param {Object} saveModel - the scheme of your game save object
      * @param {Boolean} ignoreVersion - will read old save if true
      */
    init(saveModel?: SaveModel, ignoreVersion?: boolean): void;
    removeSave(key: string): void;
    updateSave(): void;
    /**
     * load the save from the localStorage, automatically called from Save.init
     * @memberOf Save
     * @protected
     * @param {Object} attrs - your data scheme, to check if there is a difference with previous save
     * @param {Boolean} useLocalStorage - if false, every call to localStorage will be prevented
     */
    loadSave(attrs: SaveModel, useLocalStorage: boolean): void;
    /**
     * get the value of the key (not reading the localStorage directly)
     * @memberOf Save
     * @protected
     * @param {String} key - the key of the data you want from your scheme "saveModel"
     */
    get(key: string): any;
    /**
     * checks the existance of a key
     * returns true if the key exists, false if it doesn't
     * @param {String} key - the key of the data you want from your scheme "saveModel"
     */
    exists(key: string): boolean;
    /**
     * save the value with the given key
     * @memberOf Save
     * @protected
     * @param {String} key - the key used to save the data
     * @param {Any} value - the data to save
     */
    save(key: string, value: any): void;
    /**
     * automatically called when the page is closed, but you can manually call it whenever you want.
     * This put the current save in the window.localStorage.
     * @memberOf Save
     * @protected
     */
    saveAll(): void;
    /**
     * Save the achievements progression in the localStorage (it's called by @Achievements directly)
     * @memberOf Save
     * @protected
     * @param {String} userAchievement - data object of user achievements progression
     */
    saveAchievements(userAchievements: Record<string, UserAchievement>): void;
    loadAchievements(): any;
}
declare const save: Save;
export default save;
