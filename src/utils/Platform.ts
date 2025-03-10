/**
 * Author
 @Inateno / http://inateno.com / http://dreamirl.com 
 */

import Audio from './Audio';
import Events from './Events';
import Localization from './Localization';
import Save from './Save';

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

export type product = {
  realCurrency: boolean;
  /* user who created this entitie */
  user_id: string;
  date: { type: Date; default?: number };
  available: { type: boolean; required: true; default: false };
  lang: string;
  name: string;
  description: string;
  specs: string;
  path: string;
  namespace: string;
  price: { type: number; required: true; default: 1 };
  discount: { type: number; required: true; default: 1 };
  currency: { type: string; required: true; default: 'euro' };
  countries_available: Array<string>;
  is_physical: boolean;
  weight: number;
  can_be_letter: boolean;
  stock: { type: number; default: 0 };
  use_quantity: { type: boolean; default: false };
  virtual_goods: object;
  physical_goods: Array<object>;
  // does we can buy twice a product with the namespace
  is_unique: boolean;
  priority_order: { type: number; default: 0 };
  is_game: { type: boolean; default: false };
};

export class Platform {
  name = 'nebula';
  touchPlatform = false;
  // prevent the engine to start with default loader (not useful by default, only if the targeted platform use a custom loader, as facebook do)
  preventEngineLoader = false;
  entryData: any = {};
  user: user = new user();
  social: social = new social();
  ads: ads = new ads();
  shop: shop = new shop();
  /**
   * init
   * @memberOf Platform
   * Call this before everything, but just after upgrading the Platform
   * to the current platform targeted
   */
  init(_params: any, callback: () => void) {
    const ua = navigator.userAgent;
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        ua,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        ua.substr(0, 4),
      )
    ) {
      this.touchPlatform = true;
    }

    return new Promise<void>((res) => {
      setTimeout(() => callback());
      this.getEntryData();
      return res();
    });
  }

  /**
   * beforeStartingEngine
   * @memberOf Platform
   * is automatically called in the DE.start function
   * trigger Nebula load by default, wont do anything it you don't use Nebula
   */
  beforeStartingEngine() {
    Events.emit('force-nebula-load', false);
    return Promise.resolve();
  }

  /**
   * entry data is filled on "start" when the user launch the game with a payload in the url
   * useful for refering links or things like that
   */
  getEntryData() {
    const urlParams = window.location.search.split('?')[1];
    const launchParams: any = {};
    let temp: string[];
    if (urlParams) {
      urlParams.split('&').forEach((val) => {
        temp = val.split('=');
        const key = temp[0] as keyof any;
        launchParams[key] = temp[1];
      });
    }
    this.entryData = launchParams;
  }

  getToken() {
    return '';
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
  canCreateShortcut() {
    return false;
  }

  /**
   * createShortcut
   * @memberOf Platform
   * for now it reject all the time by default (not included in web/client)
   * but if this change, make sure to prompt then do
   */
  createShortcut() {
    return Promise.reject();
  }

  /**
   * isDebugMode
   * @memberOf Platform
   */
  isDebugMode() {
    return false;
  }

  /**
   * isTranslatorMode
   * @memberOf Platform
   */
  isTranslatorMode() {
    return false;
  }

  /**
   * pushAnalytic
   * @memberOf Platform
   * send an event to gtag if it exist
   */

  pushAnalytic(eventName: string, data: any) {
    gtag('event', eventName, data);
  }

  setFullScreen(fullScreen?: boolean) {
    if (fullScreen === undefined) {
      // Means we want to toggle fullScreen
      fullScreen = document.fullscreenElement === null;
    }
    if (fullScreen) document.body.requestFullscreen();
    else document.exitFullscreen();
  }

  isFullScreen() {
    return document.fullscreenElement !== null;
  }

  // dummy loadSave function
  async loadSave() {
    return Promise.resolve();
  }

  // dummy writeSave function
  async writeSave(): Promise<string | void> {
    return Promise.resolve();
  }
}

function gtag(..._args: any) {}

class user {
  _data: any;
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

  onLogged() {
    return new Promise((res, _rej) => {
      Events.on('nebula-logged-success', (nebulaData) => {
        Localization.getLang(nebulaData.lang || Localization.currentLang);
        nebulaData.type = 'nebula';
        this._data = nebulaData;
        return res(nebulaData);
      });
    });
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
  onGameData() {
    return new Promise((res, _rej) => {
      Events.on('nebula-game-connected-success', function (gameData) {
        const settings = Save.get('settings') as {
          fxVolume: number;
          musicVolume: number;
          fxMuted: boolean;
          musicMuted: boolean;
        };

        Audio.setChannelVolume('fx', settings.fxVolume);
        Audio.setChannelVolume('music', settings.musicVolume);
        Audio.setMuteAll('sfx', settings.fxMuted);
        Audio.setMuteAll('music', settings.musicMuted);

        return res(gameData);
      });
    });
  }
}

class social {
  // invite one or more friends to join
  inviteFriends() {
    return Promise.reject();
  }

  // send a social update (as a chat message)
  sendUpdate() {
    return Promise.reject();
  }

  // not used by nebula but social networks do use this
  joinFriend(_friendId: string) {
    return Promise.resolve();
  }
}

class ads {
  _preloadedRewardedAds = {};

  preloadStandardAd() {
    return Promise.resolve();
  }
  preloadRewardedAd() {
    return Promise.resolve();
  }
  preloadRewardedAdByValue() {
    return Promise.resolve();
  }
  watchRewardedAd() {
    return Promise.resolve();
  }
}

class shop {
  /**
   *               SHOP STUFF
   *
   * todo, Nebula implementation by default
   * the shop define the standard items that can be purchased on the platform shop, usually, the shop is only about "real money products"
   * everything that is traded with virtual currency is handled in a custom way, and later Nebula will offer a default implementation for multiverse games.
   */
  isActive = false;
  _products: product[] = [];
  _purchases = []; // store user purchases
  _productsById: any = {};
  isReady = false;

  // todo
  init() {
    return new Promise((_res, rej) => {
      console.warn(
        "Platform.shop isn't implemented for Nebula yet, returning empty values",
      );
      rej('no-shop-implementation');
    });
  }
  getProducts() {
    return new Promise((res, _rej) => {
      console.warn(
        "Platform.shop isn't implemented for Nebula yet, returning empty values",
      );
      res([]);
    });
  }
  getPurchases() {
    return new Promise((res, _rej) => {
      console.warn(
        "Platform.shop isn't implemented for Nebula yet, returning empty values",
      );
      res([]);
    });
  }

  /**
   * useful to handle if an item must be purchased or traded against in-game currency
   * usually the method called between game and server isn't the same
   * if the item "isPlatformPurchase" it should be bought with the shop.purchase method
   */
  isPlatformPurchase(product: product) {
    return product.realCurrency === true; // subject to change
  }

  /**
   * todo - actually doesn't exist on nebula so it can't be finished for now
   * trigger the nebula payment shop tab by default
   * on others platforms it open the associated payment defined by the plugin
   */
  purchase() {}
  onStorePurchase(purchase: any, productID: string) {
    console.warn(
      'DE.Platform.shop.onStorePurchase is not implemented. If you are using the @GUI.ShopItem plugin, make sure to implement this function on your own',
    );
    console.log('Store purchase success', purchase, productID);
  }

  // middleware that should be called once the previous orders/purchases made by the user are fetched, the goal is to check if a purchase has been successful but not consumed yet
  // because we don't want a user to pay and do not receive what he paid for :)
  // also when doing "whipes" or "updates" it's easier to mark all order as "not delivered" and this function would do the job for you to refill the accounts with purchases
  consumeExistingPurchases() {
    console.warn(
      'DE.Platform.shop.consumeExistingPurchase is not implemented but has been called, make sure to implement it',
    );
  }
  onStorePurchaseFail(error: any, productID: string) {
    console.warn(
      'DE.Platform.shop.onStorePurchaseFail is not implemented. If you are using the @GUI.ShopItem plugin, make sure to implement this function on your own',
    );
    console.error('Error on purchase:', error, productID);
  }
  consumePurchase() {}
}

const p = new Platform();
export default p;
