/**
 * Author
 @Inateno / http://inateno.com / http://dreamirl.com
 */
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
export declare type product = {
    realCurrency: boolean;
    user_id: string;
    date: {
        type: Date;
        default?: number;
    };
    available: {
        type: boolean;
        required: true;
        default: false;
    };
    lang: string;
    name: string;
    description: string;
    specs: string;
    path: string;
    namespace: string;
    price: {
        type: number;
        required: true;
        default: 1;
    };
    discount: {
        type: number;
        required: true;
        default: 1;
    };
    currency: {
        type: string;
        required: true;
        default: 'euro';
    };
    countries_available: Array<string>;
    is_physical: boolean;
    weight: number;
    can_be_letter: boolean;
    stock: {
        type: number;
        default: 0;
    };
    use_quantity: {
        type: boolean;
        default: false;
    };
    virtual_goods: object;
    physical_goods: Array<object>;
    is_unique: boolean;
    priority_order: {
        type: number;
        default: 0;
    };
    is_game: {
        type: boolean;
        default: false;
    };
};
export declare class Platform {
    name: string;
    touchPlatform: boolean;
    preventEngineLoader: boolean;
    entryData: any;
    user: user;
    social: social;
    ads: ads;
    shop: shop;
    /**
     * init
     * @memberOf Platform
     * Call this before everything, but just after upgrading the Platform
     * to the current platform targeted
     */
    init(_params: any, callback: () => void): Promise<void>;
    /**
     * beforeStartingEngine
     * @memberOf Platform
     * is automatically called in the DE.start function
     * trigger Nebula load by default, wont do anything it you don't use Nebula
     */
    beforeStartingEngine(): Promise<void>;
    /**
     * entry data is filled on "start" when the user launch the game with a payload in the url
     * useful for refering links or things like that
     */
    getEntryData(): void;
    getToken(): string;
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
    canCreateShortcut(): boolean;
    /**
     * createShortcut
     * @memberOf Platform
     * for now it reject all the time by default (not included in web/client)
     * but if this change, make sure to prompt then do
     */
    createShortcut(): Promise<never>;
    /**
     * pushAnalytic
     * @memberOf Platform
     * send an event to gtag if it exist
     */
    pushAnalytic(eventName: string, data: any): void;
}
declare class user {
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
    onLogged(): Promise<unknown>;
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
    onGameData(): Promise<unknown>;
}
declare class social {
    inviteFriends(): Promise<never>;
    sendUpdate(): Promise<never>;
    joinFriend(_friendId: string): Promise<void>;
}
declare class ads {
    _preloadedRewardedAds: {};
    preloadStandardAd(): Promise<void>;
    preloadRewardedAd(): Promise<void>;
    preloadRewardedAdByValue(): Promise<void>;
    watchRewardedAd(): Promise<void>;
}
declare class shop {
    /**
     *               SHOP STUFF
     *
     * todo, Nebula implementation by default
     * the shop define the standard items that can be purchased on the platform shop, usually, the shop is only about "real money products"
     * everything that is traded with virtual currency is handled in a custom way, and later Nebula will offer a default implementation for multiverse games.
     */
    isActive: boolean;
    _products: product[];
    _purchases: never[];
    _productsById: any;
    isReady: boolean;
    init(): Promise<unknown>;
    getProducts(): Promise<unknown>;
    getPurchases(): Promise<unknown>;
    /**
     * useful to handle if an item must be purchased or traded against in-game currency
     * usually the method called between game and server isn't the same
     * if the item "isPlatformPurchase" it should be bought with the shop.purchase method
     */
    isPlatformPurchase(product: product): boolean;
    /**
     * todo - actually doesn't exist on nebula so it can't be finished for now
     * trigger the nebula payment shop tab by default
     * on others platforms it open the associated payment defined by the plugin
     */
    purchase(): void;
    onStorePurchase(purchase: any, productID: string): void;
    consumeExistingPurchases(): void;
    onStorePurchaseFail(error: any, productID: string): void;
    consumePurchase(): void;
}
declare const p: Platform;
export default p;
