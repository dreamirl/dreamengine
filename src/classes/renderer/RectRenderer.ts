import * as PIXI from 'pixi.js';
import BaseRenderer from './BaseRenderer';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor RectRenderer
 * @augments PIXI.Graphics
 * @class draw a simple rectangle
 * checkout Renderer for standard parameters
 * @example var rectangle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.RectRenderer( 50, 70, "red", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false } )
 * } );
 */

export default class RectRenderer extends PIXI.Graphics {
  private _initial: {
    width: number;
    height: number;
    fill: any;
    color: string;
    lineStyle: any;
  };

  constructor(
    width: number,
    height: number,
    color: string,
    params: {
      width?: number;
      height?: number;
      color?: string;
      fill?: any;
      lineStyle?: string;
    },
  ) {
    super();
    PIXI.Graphics.call(this);
    var _params = params;

    _params.width = width;
    _params.height = height;
    _params.color = color;

    /**
     * save last parameters
     * @memberOf RectRenderer
     * @private
     */
    this._initial = {
      width: _params.width,
      height: _params.height,
      fill: _params.fill,
      color: _params.color,
      lineStyle: _params.lineStyle,
    };

    this.updateRender(_params);
    delete _params.lineStyle;
    delete _params.fill;

    BaseRenderer.instantiate(this, _params);
  }

  updateRender(params: {
    width?: number;
    height?: number;
    color?: any;
    fill?: any;
    lineStyle?: string;
  }) {
    this.clear();

    if (params && (params.lineStyle || this._initial.lineStyle)) {
      this.lineStyle.apply(this, params.lineStyle || this._initial.lineStyle); // 4, 0xFF3300, 1);
    }

    if (
      !params ||
      params.fill !== false ||
      (params.fill === undefined && this._initial.fill !== false)
    ) {
      this.beginFill(params.color || this._initial.color || '0xFF3300');
    }

    this.drawRect(
      0,
      0,
      params.width || this._initial.width,
      params.height || this._initial.height,
    );

    this.endFill();

    this._initial = {
      width: params.width || this._initial.width,
      height: params.height || this._initial.height,
      fill: params.fill || this._initial.fill,
      color: params.color || this._initial.color,
      lineStyle: params.lineStyle || this._initial.lineStyle,
    };

    return this;
  }
  static DEName = 'RectRenderer';
}

//RectRenderer.prototype = Object.create(PIXI.Graphics.prototype);
RectRenderer.prototype.constructor = RectRenderer;

BaseRenderer.inherits(RectRenderer);
