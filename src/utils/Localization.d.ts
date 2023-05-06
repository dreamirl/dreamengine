export interface LocalizationObject {
    [key: string]: string | LocalizationObject;
}
export declare type LocalizationInitializationOptions = {
    /**
     * Whether to use the short language code as a fallback when the full language code is not available in the 'get' method.
     * For example, if the language is `fr_FR` and the dictionary does not contain the value for `fr_FR` but contains the value for `fr`, then the value for `fr` will be used.
     * @default false
     * @type {boolean}
     */
    useShortLanguageCodeAsFallback: boolean;
    /**
     * Whether to use the short language code as a fallback when the full language dictionary is available but the key is not.
     * Specific to the 'getAll' method.
     * @default true
     * @type {boolean}
     */
    useShortLanguageCodeValueInGetAllOnMissingKey: boolean;
};
/**
 * Provide a dictionary system to easily implement localization in your game :)
 * This system is initiated by another system because the current language is provided by the platform
 * @namespace Localization
 */
export declare class Localization {
    private getShortLanguage;
    /**
     * Return the current language
     * @deprecated Use `currentLanguage` instead
     * @memberOf Localization
     * @type {String}
     */
    get currentLang(): string;
    /**
     * Set the current language, if the language is not available, the first available language will be used
     * @deprecated Use `currentLanguage` instead
     * @memberOf Localization
     * @type {String}
     */
    set currentLang(value: string);
    /**
     * Return the current language
     * @memberOf Localization
     * @type {String}
     */
    get currentLanguage(): string;
    /**
     * Set the current language using the 'setLanguage' method but if the language is not available nothing will happen.
     * @memberOf Localization
     * @type {String}
     */
    set currentLanguage(lang: string);
    private _currentLanguage;
    /**
     * Return available languages (Protected by copying the array)
     * (Yes there is a typo in the name, it's here for compatibility reasons)
     * @deprecated Use `availableLanguages` instead
     * @memberOf Localization
     * @type {String[]}
     */
    get avalaibleLang(): string[];
    /**
     * Return available languages (Protected by copying the array)
     * @memberOf Localization
     * @type {String[]}
     */
    get availableLanguages(): string[];
    private _availableLanguages;
    private _dictionaries;
    private _options;
    readonly DEName = "Localization";
    /**
     * Initialize the Localization module
     * @memberOf Localization
     * @param {Object} dictionaries - Every localization structured in a named tree
     * @param {Object} [options] - Options for the initialization
     */
    init(dictionaries: Record<string, LocalizationObject>, options?: Partial<LocalizationInitializationOptions>): void;
    /**
     * Add dictionaries to the Localization module, can complete or override existing data
     * @memberOf Localization
     * @param {Object} dictionaries - Every localization structured you want to add in a named tree
     * @param {Boolean} merge - If true, the given dictionary will be merged with the existing one (if any)
     */
    addDictionary(dictionaries: Record<string, LocalizationObject>, merge?: boolean): void;
    /**
     * Add a dictionary to the Localization module, can complete or override existing data
     * @memberOf Localization
     * @param {String} lang - The language of the dictionary
     * @param {Object} dictionary - The localization dictionary structured in a named tree
     * @param {Boolean} merge - If true, the given dictionary will be merged with the existing one (if any)
     */
    addOneDictionary(lang: string, dictionary: LocalizationObject, merge?: boolean): void;
    /**
     * Return the value for the key in the current language.
     * This method return the key if the value is not found and the key in english if the given or the current language is not available.
     * @memberOf Localization
     * @param {String} [fullKey] - The key you want
     * @param {String} [language] - The language you want
     * @return {String} The value for the key in the current language
     */
    get(fullKey?: string, language?: string): string;
    /**
     * Private method used by the get method.
     * @memberOf Localization
     * @param localizationObject
     * @param keys
     * @return {Object}
     * @private
     */
    private _get;
    /**
     * Return the value for the key in every available languages.
     * @memberOf Localization
     * @param {String} fullKey - the key you want
     * @return {Object} The value for the key in every available languages
     */
    getAll(fullKey: string): Record<string, string>;
    /**
     * Private method to merge two localization objects
     * @memberOf Localization
     * @param old
     * @param toMerge
     * @return {Object}
     * @private
     */
    private merge;
    /**
     * Return the value for the key in the given language or null if the language is not available.
     * @deprecated Just use the 'get' method with 2nd parameter now
     * @memberOf Localization
     * @param {String} lang - Target language
     * @param {String} key - The key you want
     */
    forceGet(lang: string, key: string): Nullable<string>;
    /**
     * Set the current language
     * If no language is given, set the browser language or english as default in this order if those are available.
     * @deprecated Just use the 'setLanguage' method or the getter of 'currentLanguage' now depending on your needs
     * @memberOf Localization
     * @type {String}
     */
    setLang(language?: string): void;
    /**
     * WARNING THIS IS NOT A GETTER !!!
     *
     * Set the current language.
     * If no language is given, set the browser language or english as default in this order if those are available.
     * @deprecated Just use the 'setLanguage' method or the getter of 'currentLanguage' now depending on your needs
     * @memberOf Localization
     * @param {String} [language] - The language you want
     */
    getLang(language?: string): void;
    /**
     * Set the current language.
     * If no language is given, set the browser language or english as default in this order if those are available.
     * @memberOf Localization
     * @param {String} [language]
     */
    setLanguage(language?: string): void;
}
declare const localization: Localization;
export default localization;
