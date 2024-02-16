import * as PIXI from 'pixi.js';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import '../renderer/ContainerExtensions';
import { ContainerExtensions, center, instantiate, setBlackAndWhite, setBrightness, setContrast, setGreyscale, setHue, setSaturation, setScale, setSize, setTint } from '../renderer/ContainerExtensions';
import RendererInterface from './RendererInterface';
import Audio from '../../utils/Audio';


export default class VideoRenderer extends PIXI.Sprite implements ContainerExtensions, RendererInterface{
    video: PIXI.Sprite;
    videoResource: PIXI.VideoResource;

    constructor(params = {}, videoPath: string, width = 1920, height = 1080, loop = false){
        super();
        this.instantiate(params);
        const introVideo = PIXI.Texture.from(videoPath);
        this.videoResource = introVideo.baseTexture.resource as PIXI.VideoResource;
        this.videoResource.source.loop = loop;

        this.video = new PIXI.Sprite(introVideo);
        this.video.width = width;
        this.video.height = height;
        this.videoResource.source.currentTime = 0;
        this.videoResource.source.play();
    }

    setVolume(volume: number){
        this.videoResource.source.volume = volume * Audio.volume;
    }

    getVolume(){
        return  this.videoResource.source.volume;
    }

    isDestroyed(){
        return this.videoResource.destroyed;
    }

    

    hueFilter?: ColorMatrixFilter | undefined;
    blackAndWhiteFilter?: ColorMatrixFilter | undefined;
    saturationFilter?: ColorMatrixFilter | undefined;
    brightnessFilter?: ColorMatrixFilter | undefined;
    contrastFilter?: ColorMatrixFilter | undefined;
    grayscaleFilter?: ColorMatrixFilter | undefined;
    sleep: boolean = false;
    preventCenter?: boolean | undefined;
    _originalTexture?: PIXI.Texture<PIXI.Resource> | undefined;
    setTint(value: number): void{setTint(this, value);}
    setHue(rotation: number, multiply: boolean): void{setHue(this, rotation, multiply);}
    setBlackAndWhite(multiply: boolean): void{setBlackAndWhite(this, multiply);}
    setSaturation(amount: number, multiply: boolean): void{setSaturation(this, amount, multiply);}
    setBrightness(b: number, multiply: boolean): void{setBrightness(this, b, multiply);}
    setContrast(amount: number, multiply: boolean): void{setContrast(this, amount, multiply);}
    setGreyscale(scale: number, multiply: boolean): void{setGreyscale(this, scale, multiply);}
    setSize(width: number, height: number, preventCenter: boolean): void{setSize(this, width, height, preventCenter);}
    setScale(x: number | { x: number; y: number }, y?: number): void{setScale(this, x, y);}
    center(): void{center(this);}
    instantiate(params: any): void{instantiate(this, params);}
}