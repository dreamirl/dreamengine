import * as PIXI from 'pixi.js';

export default interface RendererInterface{
    preventCenter?: boolean;
    anchor?: PIXI.ObservablePoint | Point2D;
    tint: number;
}