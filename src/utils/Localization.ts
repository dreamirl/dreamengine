import Events from './Events';

const LANGUAGES_CODES_TABLES: {
  [key: string]: string[] | undefined;
} = Object.freeze({
  fr: [
    'fr_FR',
    'fr_BE',
    'fr_CA',
    'fr_CH',
    'fr_LU',
    'fr_MC'
  ],
  en: [
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
    'en_ZW'
  ],
  es: [
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
    'es_VE'
  ],
  pt: [
    'pt_BR',
    'pt_PT'
  ],
  de: [
    'de_AT',
    'de_CH',
    'de_DE',
    'de_LI',
    'de_LU'
  ],
  it: [
    'it_CH',
    'it_IT'
  ],
  ja: [
    'ja_JP'
  ],
  ru: [
    'ru_RU'
  ],
  zh: [
    "zh_CN",
    "zh_SG",
    "zh_HK",
    "zh_MO",
    "zh_TW"
  ],
  id: [
    "id_ID"
  ],
  ko: [
    "ko_KR"
  ],
  ab: [
    "ab_GE"
  ],
  aa: [
    "aa_ER",
    "aa_ET"
  ],
  af: [
    "af_ZA"
  ],
  ak: [
    "ak_GH"
  ],
  sq: [
    "sq_AL"
  ],
  am: [
    "am_ET"
  ],
  ar: [
    "ar_DZ",
    "ar_BH",
    "ar_EG",
    "ar_IQ",
    "ar_JO",
    "ar_KW",
    "ar_LB",
    "ar_LY",
    "ar_MA",
    "ar_OM",
    "ar_QA",
    "ar_SA",
    "ar_SD",
    "ar_SY",
    "ar_TN",
    "ar_AE",
    "ar_YE"
  ],
  an: [
    "an_ES"
  ],
  hy: [
    "hy_AM"
  ],
  as: [
    "as_IN"
  ],
  av: [
    "av_RU"
  ],
  ae: [
    "ae_RU"
  ],
  ay: [
    "ay_BO",
    "ay_PE"
  ],
  az: [
    "az_AZ"
  ],
  bm: [
    "bm_ML"
  ],
  ba: [
    "ba_RU"
  ],
  eu: [
    "eu_ES"
  ],
  be: [
    "be_BY"
  ],
  bn: [
    "bn_BD",
    "bn_IN"
  ],
  bh: [
    "bh_IN"
  ],
  bi: [
    "bi_VU"
  ],
  bs: [
    "bs_BA"
  ],
  br: [
    "br_FR"
  ],
  bg: [
    "bg_BG"
  ],
  my: [
    "my_MM"
  ],
  ca: [
    "ca_ES"
  ]
});

const REVERSE_LANGUAGES_CODES_TABLES = Object.freeze(
  Object.keys(LANGUAGES_CODES_TABLES)
    .reduce((acc, key) => {
      const value = LANGUAGES_CODES_TABLES[key] as string[];

      value.forEach((lang) => {
        acc[lang] = key;
      });

      return acc;
    }, {} as Record<string, string>)
);

export interface LocalizationObject {
  [key: string]: string | LocalizationObject;
}

export type LocalizationInitializationOptions = {
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
export class Localization {
  /**
   * Return the current language
   * @deprecated Use `currentLanguage` instead
   * @memberOf Localization
   * @type {String}
   */
  public get currentLang(): string {
    return this._currentLanguage;
  }

  /**
   * Set the current language, if the language is not available, the first available language will be used
   * @deprecated Use `currentLanguage` instead
   * @memberOf Localization
   * @type {String}
   */
  public set currentLang(value: string) {
    this.currentLanguage = value;
  }

  /**
   * Return the current language
   * @memberOf Localization
   * @type {String}
   */
  public get currentLanguage(): string {
    return this._currentLanguage;
  }

  /**
   * Set the current language using the 'setLanguage' method but if the language is not available nothing will happen.
   * @memberOf Localization
   * @type {String}
   */
  public set currentLanguage(lang: string) {
    if (!this._availableLanguages.includes(lang)) {
      return;
    }

    this.setLanguage(lang);
  }

  private _currentLanguage: string = 'en';

  /**
   * Return available languages (Protected by copying the array)
   * (Yes there is a typo in the name, it's here for compatibility reasons)
   * @deprecated Use `availableLanguages` instead
   * @memberOf Localization
   * @type {String[]}
   */
  public get avalaibleLang(): string[] {
    return this.availableLanguages;
  }

  /**
   * Return available languages (Protected by copying the array)
   * @memberOf Localization
   * @type {String[]}
   */
  public get availableLanguages(): string[] {
    return [...this._availableLanguages];
  }

  private _availableLanguages: string[] = [];

  private _dictionaries: Record<string, LocalizationObject> = { en: {} };

  private _options: LocalizationInitializationOptions = Object.freeze({
    useShortLanguageCodeAsFallback: false,
    useShortLanguageCodeValueInGetAllOnMissingKey: true,
  });

  public readonly DEName = 'Localization';

  /**
   * Initialize the Localization module
   * @memberOf Localization
   * @param {Object} dictionaries - Every localization structured in a named tree
   * @param {Object} [options] - Options for the initialization
   */
  public init(dictionaries: Record<string, LocalizationObject>, options?: Partial<LocalizationInitializationOptions>) {
    this._dictionaries = {};
    this._availableLanguages = [];

    for (const lang in dictionaries) {
      this._dictionaries[lang] = dictionaries[lang];

      if (!this._availableLanguages.includes(lang)) {
        this._availableLanguages.push(lang);
      }
    }

    if (options) {
      this._options = Object.freeze({
        ...this._options,
        ...options,
      });
    }
  }

  /**
   * Add dictionaries to the Localization module, can complete or override existing data
   * @memberOf Localization
   * @param {Object} dictionaries - Every localization structured you want to add in a named tree
   * @param {Boolean} merge - If true, the given dictionary will be merged with the existing one (if any)
   */
  public addDictionary(dictionaries: Record<string, LocalizationObject>, merge: boolean = false) {
    for (const lang in dictionaries) {
      if (merge && this._dictionaries[lang]) {
        this._dictionaries[lang] = this.merge(this._dictionaries[lang], dictionaries[lang]);
      } else {
        this._dictionaries[lang] = dictionaries[lang];
      }

      if (!this._availableLanguages.includes(lang)) {
        this._availableLanguages.push(lang);
      }
    }
  }

  /**
   * Add a dictionary to the Localization module, can complete or override existing data
   * @memberOf Localization
   * @param {String} lang - The language of the dictionary
   * @param {Object} dictionary - The localization dictionary structured in a named tree
   * @param {Boolean} merge - If true, the given dictionary will be merged with the existing one (if any)
   */
  public addOneDictionary(lang: string, dictionary: LocalizationObject, merge: boolean = false) {
    this.addDictionary({ [lang]: dictionary }, merge);
  }

  /**
   * Return the value for the key in the current language.
   * This method return the key if the value is not found and the key in english if the given or the current language is not available.
   * @memberOf Localization
   * @param {String} [fullKey] - The key you want
   * @param {String} [language] - The language you want
   * @return {String} The value for the key in the current language
   */
  public get(fullKey?: string, language?: string): string {
    if (!fullKey) {
      return '';
    }

    let l = language || this.currentLanguage;
    const shortL = REVERSE_LANGUAGES_CODES_TABLES[l] as string | undefined;

    const langToTest: string[] = this._options.useShortLanguageCodeAsFallback && shortL
        ? [l, shortL, 'en']
        : [l, 'en'];

    const availableLanguagesFromTest = langToTest.filter(l => this._availableLanguages.includes(l)) as string[];

    if (availableLanguagesFromTest.length === 0) {
      console.warn(`No language dictionaries for the languages (\'${langToTest.join('\', \'')}\')`);
      return fullKey;
    }

    const keys = fullKey.split('.');

    for (const lang of availableLanguagesFromTest) {
      const currentLocalization: LocalizationObject = this._dictionaries[lang];
      const value = this._get(currentLocalization, [...keys]);

      if (value.result !== null) {
        return value.result;
      }
    }

    return fullKey;
  }

  /**
   * Private method used by the get method.
   * @memberOf Localization
   * @param localizationObject
   * @param keys
   * @return {Object}
   * @private
   */
  private _get(localizationObject: LocalizationObject, keys: string[]): {
    result: Nullable<string>,
    oldKeys: string[],
  } {
    let currentLocalizationObject = localizationObject;
    let result: Nullable<string> = null;
    const oldKeys: string[] = [];

    do {
      const key = keys.shift()!;

      const value: LocalizationObject | string | undefined = currentLocalizationObject[key];

      oldKeys.push(key);

      if (typeof value === 'string') {
        if (keys.length === 0) {
          result = value;
          break;
        }

        break;
      } else if (typeof value === 'object') {
        currentLocalizationObject = value;
      } else if (value === undefined) {
        break;
      }
    } while (keys.length > 0);

    return {
      result,
      oldKeys,
    };
  }

  /**
   * Return the value for the key in every available languages.
   * @memberOf Localization
   * @param {String} fullKey - the key you want
   * @return {Object} The value for the key in every available languages
   */
  public getAll(fullKey: string): Record<string, string> {
    const results: Record<string, string> = {};

    for (const lang of this._availableLanguages) {
      results[lang] = this.get(fullKey, lang);
    }

    // Add "full codes" if devs are using "shorter codes"
    // Example, if you use 'en', you will get 'en', 'en_US', 'en_GB' etc...

    for (const lang in Object.keys(LANGUAGES_CODES_TABLES)) {
      if (results[lang] === undefined) continue;

      for (const fullLang of LANGUAGES_CODES_TABLES[lang]!) {
        if (
          !results[fullLang] ||
          (
            this._options.useShortLanguageCodeValueInGetAllOnMissingKey &&
            results[fullLang] === fullKey
          )
        ) {
          results[fullLang] = results[lang];
        }
      }
    }

    return results;
  }

  /**
   * Private method to merge two localization objects
   * @memberOf Localization
   * @param old
   * @param toMerge
   * @return {Object}
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
  public forceGet(lang: string, key: string): Nullable<string> {
    const isLongLanguageCode = REVERSE_LANGUAGES_CODES_TABLES[lang] !== undefined;

    if (!this._availableLanguages.includes(lang) && !isLongLanguageCode) {
      return null;
    }

    if (isLongLanguageCode) {
      const shortLang = REVERSE_LANGUAGES_CODES_TABLES[lang]!;

      if (!this._availableLanguages.includes(shortLang)) {
        return null;
      }

      return this.get(key, shortLang);
    }

    return this.get(key, lang);
  }

  /**
   * Set the current language
   * If no language is given, set the browser language or english as default in this order if those are available.
   * @deprecated Just use the 'setLanguage' method or the getter of 'currentLanguage' now depending on your needs
   * @memberOf Localization
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
   * @memberOf Localization
   * @param {String} [language]
   */
  public setLanguage(language?: string) {
    const oldLanguage = this._currentLanguage;

    if (!language) {
      language = navigator.language || 'en';
    }

    for (const lang of this._availableLanguages) {
      if (lang.match(language)) {
        this._currentLanguage = lang;
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