import about from '../about';
import { UserAchievement } from './Achievements';
import Events from './Events';

/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

*/

export type SaveModel = {
  [x: string]: string | number | Object | Array<any> | SaveModel,
}

/**
 * singleton to make save easy, you can override save method to make yours
   by default save method take your params and set them in the saveTypeDefault object (passed when init)
   then save this object in the localStorage
   the Save save under the GameName and GameVersion
   pass your saveModel when prepare the engine (through the main Engine Initialisation)

   if you want to ignore backup olds version when saving, add saveIgnoreVersion = true on Engine Initialisation
 * @namespace Save
 */
export class Save {
  DEName = 'Save';

  saveModel: SaveModel = {};
  namespace = 'My-Dreamengine-Game';
  version: string | null = null;

  useLocalStorage = true;

  /**
   * init the save (called by the engine: DE.init), you can ignoreVersion to get the previous one and update it
    but be sure it's compatible
    * @memberOf Save
    * @protected
    * @param {Object} saveModel - the scheme of your game save object
    * @param {Boolean} ignoreVersion - will read old save if true
    */
  init(saveModel?: SaveModel, ignoreVersion: boolean = false) {
    saveModel = saveModel || {};
    if (!saveModel.settings) saveModel.settings = {};

    if(about.namespace)
      this.namespace = about.namespace;

    this.version = about.gameVersion;
    if (ignoreVersion) {
      this.version = window.localStorage.getItem(this.namespace);
    }

    this.saveModel = saveModel;

    // load save from storage
    for (let i in this.saveModel) {
      this.saveModel[i] =
        window.localStorage.getItem(this.namespace + this.version + i) ||
        this.saveModel[i];
    }
    
    Events.on('unload-game', () => this.saveAll());

    this.loadSave(this.saveModel, true);
  }

  updateSave() {
    if (!this.useLocalStorage) {
      return;
    }
    // clean the localStorage to prevent zombie storage because upgraded version
    for (let i in this.saveModel) {
      window.localStorage.removeItem(this.namespace + this.version + i);
    }

    // setup the last version of the game, and rewrite datas
    this.version = about.gameVersion;
    window.localStorage.setItem(this.namespace, this.version);
    for (let i in this.saveModel) {
      if(typeof this.saveModel[i] === 'string')
        window.localStorage.setItem(
          this.namespace + this.version + i,
          this.saveModel[i] as string,
        );
      else{
        window.localStorage.setItem(
          this.namespace + this.version + i,
          JSON.stringify(this.saveModel[i]),
        );
      }
    }
  }

  /**
   * load the save from the localStorage, automatically called from Save.init
   * @memberOf Save
   * @protected
   * @param {Object} attrs - your data scheme, to check if there is a difference with previous save
   * @param {Boolean} useLocalStorage - if false, every call to localStorage will be prevented
   */
  loadSave(attrs: SaveModel, useLocalStorage: boolean) {
    this.useLocalStorage = useLocalStorage;

    for (let i in attrs) {
      if (
        !this.saveModel[i] &&
        this.saveModel[i] !== false &&
        this.saveModel[i] !== 0
      ) {
        Events.emit('Save-attr-not-found', i);
        console.log(
          'Seems your game version is to old, a new one will be created',
          i,
        );
      }
      this.saveModel[i] = attrs[i];
    }
    this.updateSave();
    Events.emit('Save-loaded', this.saveModel);
  }

  /**
   * get the value of the key (not reading the localStorage directly)
   * @memberOf Save
   * @protected
   * @param {String} key - the key of the data you want from your scheme "saveModel"
   */
  get(key: string) {
    if (!(key in this.saveModel)) {
      const load = window.localStorage.getItem(this.namespace + this.version + key);
      if(load != undefined)
        this.saveModel[key] = JSON.parse(load);
    }
    return this.saveModel[key];
  }

  /**
   * checks the existance of a key
   * returns true if the key exists, false if it doesn't
   * @param {String} key - the key of the data you want from your scheme "saveModel"
   */
  exists(key: string) {
    const value = this.get(key);
    return !(value === 'undefined' || value === undefined);
  }

  /**
   * save the value with the given key
   * @memberOf Save
   * @protected
   * @param {String} key - the key used to save the data
   * @param {Any} value - the data to save
   */
  save(key: string, value: any) {
    let path = key.split('.');
    let nkey = path[0];

    if (!(nkey in this.saveModel)) {
      console.log(
        '%c[WARN] You save a key ' +
          nkey +
          " that doesn't exist in your saveModel ! It's saved but the engine wont be able to get it later",
        0,
        'color:orange',
      );
    }
    if (path.length == 2) {
      (this.saveModel[nkey] as SaveModel)[path[1]] = value;

      if (this.useLocalStorage) {
        window.localStorage.setItem(
          this.namespace + this.version + nkey,
          JSON.stringify(this.saveModel[nkey]),
        );
      }
    } else if (path.length == 1) {
      if (value === undefined) {
        value = this.get(nkey);
      }
      this.saveModel[nkey] = value;

      if (this.useLocalStorage) {
        window.localStorage.setItem(
          this.namespace + this.version + nkey,
          JSON.stringify(value),
        );
      }
    }
    Events.emit('Save-save', this.saveModel);
  }

  /**
   * automatically called when the page is closed, but you can manually call it whenever you want.
   * This put the current save in the window.localStorage.
   * @memberOf Save
   * @protected
   */
  saveAll() {
    // if engine is configured to prevent use of localStorage, nothing is saved
    if (!this.useLocalStorage) {
      return;
    }
    for (let i in this.saveModel) {
      window.localStorage.setItem(
        this.namespace + this.version + i,
        JSON.stringify(this.saveModel[i]),
      );
    }
  }

  /**
   * Save the achievements progression in the localStorage (it's called by @Achievements directly)
   * @memberOf Save
   * @protected
   * @param {String} userAchievement - data object of user achievements progression
   */
  saveAchievements(userAchievements: Record<string, UserAchievement>) {
    // if engine is configured to prevent use of localStorage, nothing is saved
    if (!this.useLocalStorage) {
      return;
    }
    window.localStorage.setItem(
      this.namespace + 'achievements',
      JSON.stringify(userAchievements),
    );
  }

  loadAchievements() {
    const load = window.localStorage.getItem(this.namespace + 'achievements');
    if(load != undefined)
      return JSON.parse(load);
    return {};
  }
}

const save = new Save();
export default save;
