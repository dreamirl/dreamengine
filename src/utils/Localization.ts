import Events from './Events';

export interface LocalizationObject {
  [key: string]: string | LocalizationObject;
}

const LANGUAGES_CODES_TABLE = [
  'fr',
  'fr_FR',
  'fr_BE',
  'fr_CA',
  'fr_CH',
  'fr_LU',
  'fr_MC',
  'en',
  'en_AU',
  'en_BZ',
  'en_CA',
  'en_CB',
  'en_GB',
  'en_IE',
  'en_JM',
  'en_NZ',
  'en_PH',
  'en_TT',
  'en_US',
  'en_ZA',
  'en_ZW',
  'es',
  'es_AR',
  'es_BO',
  'es_CL',
  'es_CO',
  'es_CR',
  'es_DO',
  'es_EC',
  'es_ES',
  'es_GT',
  'es_HN',
  'es_MX',
  'es_NI',
  'es_PA',
  'es_PE',
  'es_PR',
  'es_PY',
  'es_SV',
  'es_UY',
  'es_VE',
  'pt',
  'pt_BR',
  'pt_PT',
  'de',
  'de_AT',
  'de_CH',
  'de_DE',
  'de_LI',
  'de_LU',
  'it',
  'it_CH',
  'it_IT',
  'ja',
  'ja_JP',
  'ru',
  'ru_RU',
];

/**
 * Provide a dictionary system to easily implement localization in your game :)
 * This system is initiated by another system because the current language is provided by the platform
 * @namespace Localization
 */
class Localization {
  /**
   * Return the current language
   * @type {String}
   */
  public get currentLang(): string {
    return this._currentLanguage;
  }

  /**
   * Set the current language, if the language is not available, the first available language will be used
   * @type {String}
   */
  public set currentLang(value: string) {
    this.currentLanguage = value;
  }

  /**
   * Return the current language
   * @type {String}
   */
  public get currentLanguage(): string {
    return this._currentLanguage;
  }

  /**
   * Set the current language, if the language is not available, the first available language will be used
   * @type {String}
   */
  public set currentLanguage(lang: string) {
    if (this._availableLanguages.includes(lang)) {
      this._currentLanguage = lang;
    }
  }

  private _currentLanguage: string = 'en';

  /**
   * Return available languages (Protected by copying the array)
   * (Yes there is a typo in the name, it's here for compatibility reasons)
   * @deprecated Use `availableLanguages` instead
   * @type {String[]}
   */
  public get avalaibleLang(): string[] {
    return this.availableLanguages;
  }

  /**
   * Return available languages (Protected by copying the array)
   * @type {String[]}
   */
  public get availableLanguages(): string[] {
    return [...this._availableLanguages];
  }

  private _availableLanguages: string[] = [];

  private _dictionaries: Record<string, LocalizationObject> = { en: {} };

  public readonly DEName = 'Localization';

  /**
   * Initialize the Localization module
   * @memberOf Localization
   * @param {Object} dictionaries - Every localization structured in a named tree
   */
  public init(dictionaries: Record<string, LocalizationObject>) {
    for (const lang in dictionaries) {
      this._dictionaries[lang] = dictionaries[lang];

      if (!this._availableLanguages.includes(lang)) {
        this._availableLanguages.push(lang);
      }
    }
  }

  /**
   * Add a dictionary to the Localization module, can complete or override existing data
   * @memberOf Localization
   * @param {Object} dictionaries - Every localization structured you want to add in a named tree
   * @param {Boolean} merge - If true, the given dictionary will be merged with the existing one (if any)
   */
  public addDictionary(dictionaries: Record<string, LocalizationObject>, merge: boolean) {
    for (const lang in dictionaries) {
      if (!this._dictionaries[lang]) {
        this._dictionaries[lang] = {};
      }

      if (merge) {
        this._dictionaries[lang] = this.merge(this._dictionaries[lang], dictionaries[lang]);
      } else {
        this._dictionaries[lang] = dictionaries[lang];
      }
    }
  }

  /**
   * Return the value for the key in the current language.
   * This method return the key if the value is not found and the key in english if the given or the current language is not available.
   * @memberOf Localization
   * @param {String} [fullKey] - The key you want
   * @param {String} [language] - The language you want
   */
  public get(fullKey?: string, language?: string): string {
    if (!fullKey) {
      return '';
    }

    let lang = language || this.currentLanguage;
    if (!this._availableLanguages.includes(lang)) {
      lang = 'en';
    }

    const keys = fullKey.split('.');

    let currentLocalizationObject = this._dictionaries[lang];

    const oldKeys: string[] = []
    do {
      const key = keys.shift()!;
      const value = currentLocalizationObject[key];

      oldKeys.push(key);

      if (typeof value === 'string') {
        if (keys.length === 0) {
          return value;
        }
        break;
      } else if (value === undefined) {
        break;
      } else if (typeof value === 'object') {
        currentLocalizationObject = value;
      }
    } while (keys.length > 0);

    console.warn(`(Localization tree depth exceeded for key: ${oldKeys.join('.')})`)
    console.warn(`Localization key not found: ${fullKey} (${lang})`);

    return fullKey;
  }

  /**
   * Return the value for the key in every available languages.
   * @memberOf Localization
   * @param {String} fullKey - the key you want
   */
  public getAll(fullKey: string): Record<string, string> {
    const results: Record<string, string> = {};

    for (const lang of this._availableLanguages) {
      results[lang] = this.get(fullKey, lang);
    }

    // Add "full codes" if devs are using "shorter codes"
    // Example, if you use 'en', you will get 'en', 'en_US', 'en_GB' etc...
    LANGUAGES_CODES_TABLE.forEach(l => {
      if (!l.includes('_')) return;

      const shortLang = l.split('_')[0];
      if (typeof results[shortLang] === 'string' && results[l] === undefined) {
        results[l] = results[shortLang];
      }
    });

    return results;
  }

  /**
   * Private method to merge two localization objects
   * @param old
   * @param toMerge
   * @private
   */
  private merge(old: LocalizationObject, toMerge: LocalizationObject): LocalizationObject {
    const newValue: LocalizationObject = {};

    const oldKeys = Object.keys(old);
    const toMergeKeys = Object.keys(toMerge);

    const keys = new Set([...oldKeys, ...toMergeKeys]);

    for (const key of keys) {
      const oldValue: LocalizationObject | string | undefined = old[key];
      const toMergeValue: LocalizationObject | string | undefined = toMerge[key];

      if (toMergeValue === undefined) {
        newValue[key] = oldValue;
        continue;
      }

      if (oldValue === undefined) {
        newValue[key] = toMergeValue;
        continue;
      }

      if (typeof oldValue !== 'string' && typeof toMergeValue !== 'string') {
        newValue[key] = this.merge(oldValue, toMergeValue);
        continue;
      }

      newValue[key] = toMergeValue;
    }

    return newValue;
  }

  /**
   * Return the value for the key in the given language or null if the language is not available.
   * @deprecated Just use the 'get' method with 2nd parameter now
   * @memberOf Localization
   * @param {String} lang - Target language
   * @param {String} key - The key you want
   */
  public forceGet(lang: string, key: string) {
    if (!this._availableLanguages.includes(lang)) {
      return null;
    }

    return this.get(key, lang);
  }

  /**
   * Set the current language
   * If no language is given, set the browser language or english as default in this order if those are available.
   * @type {String}
   */
  public setLang(language?: string) {
    this.setLanguage(language);
  }

  /**
   * WARNING THIS IS NOT A GETTER !!!
   *
   * Set the current language.
   * If no language is given, set the browser language or english as default in this order if those are available.
   * @deprecated Just use the 'setLanguage' method or the getter of 'currentLanguage' now depending on your needs
   * @memberOf Localization
   * @param {String} [language] - The language you want
   */
  public getLang(language?: string) {
    this.setLanguage(language);
  }

  /**
   * Set the current language.
   * If no language is given, set the browser language or english as default in this order if those are available.
   * @param language
   */
  public setLanguage(language?: string) {
    const oldLanguage = this._currentLanguage;

    if (!language) {
      language = navigator.language || 'en';
    }

    for (const lang of this._availableLanguages) {
      if (lang.match(language)) {
        this.currentLanguage = lang;
        break;
      }
    }

    if (!this._dictionaries[this._currentLanguage]) {
      this._dictionaries[this._currentLanguage] = {};
    }

    if (oldLanguage !== this._currentLanguage) {
      Events.emit('lang-changed', this._currentLanguage);
    }
  }
}

const localization = new Localization();
export default localization;