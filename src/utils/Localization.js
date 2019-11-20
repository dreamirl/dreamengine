import config from 'DE.config';
import Events from 'DE.Events';

/**
* @author Inateno / http://inateno.com / http://dreamirl.com
*/

/**
 * provide a dictionary system and make easy localisation of your game :)
 * is inited by the SystemDetection (because to get the lang should depend of the platform)
 * you can use getForce to get a value in a specific language
 * @namespace Localization
 */

var Localization = new function()
{
  this.DEName        = "Localization";
  this.currentLang   = "en";
  
  this.dictionary   = { "en": {} };
  this.avalaibleLang = new Array();
  
  /**
   * init
   * @memberOf Localization
   * @protected
   * @param {Object} dictionary - every locales put in an object
   */
  this.init = function( dictionary )
  {
    for ( var i in dictionary )
    {
      this.dictionary[ i ] = dictionary[ i ];
      this.avalaibleLang.push( i );
    }
  };
  
  /**
   * Add a dictionary to the Localization module, can complete or override existing data
   * @memberOf Localization
   * @protected
   * @param {Object} dictionary - every locales put in an object
   */
  this.addDictionary = function( dictionary )
  {
    for ( var i in dictionary )
    {
      if ( !this.dictionary[ i ] ) {
        this.dictionary[ i ] = {};
      }
      for ( var n in dictionary[ i ] )
      {
        this.dictionary[ i ][ n ] = dictionary[ i ][ n ];
      }
    }
  };
  
  /**
   * return the value for the key in the current language, defaulted to English if not found
   * @memberOf Localization
   * @protected
   * @param {String} key - the key you want
   */
  this.get = function(key, lang)
  {
    // it is possible sometime to instantiate an empty TextRenderer
    if (!key) {
      return '';
    }

    let keyPath = (key || '').split( "." );
    var locale = this.dictionary[ lang || this.currentLang ][ keyPath[ 0 ] ] ||
      ( this.dictionary[ "en" ] && this.dictionary[ "en" ][ keyPath[ 0 ] ] ) || null;
    keyPath.shift();
    while (locale && keyPath.length > 0) {
      locale = locale[keyPath[0]];
      keyPath.shift();
    }
    // return the full key if it can't be found
    return locale != null ? locale : key;
  };

  /**
   * return the value for the key in every available languages
   * @memberOf Localization
   * @protected
   * @param {String} key - the key you want
   */
  this.getAll = function(key) {
    var pk = {};
    for (var i in this.dictionary) {
      pk[i] = this.get(key, i);
    }

    // add "full code" if devs are using "shorter codes"
    // exemple, if you use 'en', you will get 'en', 'en_US', 'en_GB' etc...
    LANGAUGES_CODES_TABLE.forEach(l => {
      if (!pk[l]) {
        var short = l.split('_')[0];
        if (this.dictionary[short]) {
          pk[l] = this.get(key, short);
        }
      }
    });

    return pk;
  };
  
  /**
   * @deprecated just use get with 2nd parameter now
   * return the value for the key in the given language, or null
   * @memberOf Localization
   * @protected
   * @param {String} lang - target lang
   * @param {String} key - the key you want
   */
  this.forceGet = function(lang, key)
  {
    if ( this.avalaibleLang.indexOf(lang) == -1 ) {
      return null;
    }
    return this.get(key, lang);
  };
  
  /**
   * Get the current lang active (or set the current lang if you pass an argument)
   * @memberOf Localization
   * @protected
   * @param {String} lang - New lang to set as active
   */
  this.getLang = function( lang )
  {
    var old = this.currentLang;
    this.currentLang = this.avalaibleLang[ 0 ];
    if ( !lang ) {
      lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || "en";
    }
    
    for ( var i in this.dictionary )
    {
      if ( lang.match( i ) )
      {
        this.currentLang = i;
        break;
      }
    }
    
    if ( !this.dictionary[ this.currentLang ] ) {
      this.dictionary[ this.currentLang ] = {};
    }
    if ( old !== this.currentLang ) {
      Events.trigger( "lang-changed", this.currentLang );
    }
  };
};

const LANGAUGES_CODES_TABLE = [
  'fr', 'fr_FR', 'fr_BE', 'fr_CA', 'fr_CH', 'fr_LU', 'fr_MC',
  'en', 'en_AU', 'en_BZ', 'en_CA', 'en_CB', 'en_GB', 'en_IE',
  'en_JM', 'en_NZ', 'en_PH', 'en_TT', 'en_US', 'en_ZA', 'en_ZW',
  'es', 'es_AR', 'es_BO', 'es_CL', 'es_CO', 'es_CR', 'es_DO', 'es_EC',
  'es_ES', 'es_GT', 'es_HN', 'es_MX', 'es_NI', 'es_PA', 'es_PE', 'es_PR',
  'es_PY', 'es_SV', 'es_UY', 'es_VE',
  'pt', 'pt_BR', 'pt_PT',
  'de', 'de_AT', 'de_CH', 'de_DE', 'de_LI', 'de_LU', 
  'it', 'it_CH', 'it_IT',
  'ja', 'ja_JP',
  'ru', 'ru_RU',
];

export default Localization;
