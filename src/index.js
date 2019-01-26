import '../css/default.css';

import * as PIXI  from 'PIXI';
import extendPIXI from 'DE.extendPIXI';
import config     from 'DE.config';
import about      from 'DE.about';
import Events     from 'DE.Events';
import Time       from 'DE.Time';
import MainLoop   from 'DE.MainLoop';

// utils
import Save          from 'DE.Save';
import Inputs        from 'DE.Inputs';
import gamepad       from 'DE.gamepad';
import Audio         from 'DE.Audio';
import Localization  from 'DE.Localization';
import Notifications from 'DE.Notifications';
import Achievements  from 'DE.Achievements';
import ImageManager  from 'DE.ImageManager';
import Render        from 'DE.Render';
import Scene         from 'DE.Scene';
import Camera        from 'DE.Camera';
import Vector2       from 'DE.Vector2';

// engine custom renderer
import BaseRenderer          from 'DE.BaseRenderer';
import TextureRenderer       from 'DE.TextureRenderer';
import SpriteRenderer        from 'DE.SpriteRenderer';
import TilingRenderer        from 'DE.TilingRenderer';
import TextRenderer          from 'DE.TextRenderer';
import RectRenderer          from 'DE.RectRenderer';
import GraphicRenderer       from 'DE.GraphicRenderer';
import GameObject            from 'DE.GameObject';
import GameObject_automatism from 'DE.GameObject.automatisms';
import GameObject_fade       from 'DE.GameObject.fade';
import GameObject_focus      from 'DE.GameObject.focus';
import GameObject_moveTo     from 'DE.GameObject.moveTo';
import GameObject_scale      from 'DE.GameObject.scale';
import GameObject_shake      from 'DE.GameObject.shake';
import GameObject_update     from 'DE.GameObject.update';

var DE = {
  config         : config,
  about          : about,
  Events         : Events,
  Time           : Time,
  MainLoop       : MainLoop,
  Save           : Save,
  Inputs         : Inputs,
  gamepad        : gamepad,
  Audio          : Audio,
  Localization   : Localization,
  Notifications  : Notifications,
  Achievements   : Achievements,
  ImageManager   : ImageManager,
  Render         : Render,
  Scene          : Scene,
  Camera         : Camera,
  Vector2        : Vector2,
  BaseRenderer   : BaseRenderer,
  TextureRenderer: TextureRenderer,
  SpriteRenderer : SpriteRenderer,
  TilingRenderer : TilingRenderer,
  TextRenderer   : TextRenderer,
  RectRenderer   : RectRenderer,
  GraphicRenderer: GraphicRenderer,
  GameObject     : GameObject,
  PIXI           : PIXI
};

DE.VERSION = DE.config.VERSION;
DE.CONFIG = DE.config;

// enhance PIXI
extendPIXI( DE, PIXI );

/*
 * init engine with custom inputs, images data, audio data, locales
 * launch the first loader and some utils then call start on loaded
 * call this method when all your stuff is ready
 */
DE.init = function( params )
{
  if ( !params ) {
    throw "Cannot init DreamEngine without the options, take a sample for easy start";
  }
  // configuration trough a global script tag is possible
  window.ENGINE_SETTING = window.ENGINE_SETTING || {};
  
  // set the about informations
  DE.about.set( params.about );
  
  // init the Save with your custom scheme
  DE.Save.init( params.saveModel, params.saveIgnoreVersion );
  
  // init localization with dictionary
  DE.Localization.init( params.dictionary || {} );
  
  // init SystemDetection (if you develop special features for a special OS release)
  // TODO DE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );
  
  // set achievements with your custom list
  DE.Achievements.init( params.achievements || [] );
  
  if ( !params.ignoreNotifications
    && params.useNotifications !== false
    && !params.ignoreNotification ) {
    DE.Notifications.init( params.notifications || {} );
  }
  else {
    DE.config.notifications.enable = false;
  }
  
  // init input listener with your custom list 
  DE.Inputs.init( params.inputs || {} );
  
  if ( !params.preventGamepad ) {
    DE.gamepad.init();
  }
  
  if ( !params.onLoad ) {
    console.error( "No onLoad given on init, nothing will happen after images load" );
  }
  this.customOnLoad = params.onLoad || function(){ console.log( "You have to give a onLoad callback to the DE.init options" ); };
  
  DE.ImageManager.init( params.images.baseUrl, params.images.pools );
  
  DE.emit( "change-debug", DE.config.DEBUG, DE.config.DEBUG_LEVEL );
  
  // load the loader sprite image
  params.loader = params.loader || {};
  var loader = [
    "loader"
    , params.loader.url || "loader.png"
    , {
      totalFrame : params.loader.totalFrame || 16
      ,interval  : params.loader.interval || 45
      ,animated  : params.loader.animated !== undefined ? params.loader.animated : true
      ,scale     : params.loader.scale || 1
    }
  ];
  DE.Events.once( "ImageManager-loader-loaded", function() { DE.MainLoop.updateLoaderImage( loader ); } );
  
  DE.ImageManager.load( loader );
  DE.___params = params;
  
  params.onReady();
  
  DE.emit( "change-debug", DE.config.DEBUG, DE.config.DEBUG_LEVEL );
};

// this is called when the pool "default" is loaded (the MainLoop will display a loader)
DE.onLoad = function()
{
  setTimeout( function()
  {
    DE.customOnLoad();
    DE.MainLoop.displayLoader = false;
  }, 500 );
};

var _defaultPoolName = "default";
DE.start = function()
{
  // make all audios instance and launch preload if required
  DE.Audio.loadAudios( DE.___params.audios || [] );
  delete DE.___params;
  
  DE.MainLoop.createLoader();
  DE.MainLoop.launched = true;
  DE.MainLoop.loop();
  
  DE.MainLoop.displayLoader = true;
  DE.Events.once( "ImageManager-pool-" + _defaultPoolName + "-loaded", this.onLoad, this );
  DE.ImageManager.loadPool( _defaultPoolName );
  
  DE.emit( "change-debug", DE.config.DEBUG, DE.config.DEBUG_LEVEL );
};

// pause / unpause the game
DE.pause = function()
{
  this.paused = true;
  this.MainLoop.launched = false;
  this.Inputs.listening = false;
};
DE.unPause = function()
{
  this.paused = false;
  this.Inputs.listening  = true;
  this.MainLoop.launched = true;
  this.Time.lastCalcul   = Date.now();
  this.Time.currentTime  = Date.now();
  this.MainLoop.loop();
};

// quick event access
DE.on      = function() { this.Events.on.apply( this.Events, arguments ); };
DE.emit    = function() { this.Events.emit.apply( this.Events, arguments ); };
DE.trigger = function() { this.Events.emit.apply( this.Events, arguments ); };

module.exports = DE;