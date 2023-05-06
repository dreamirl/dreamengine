"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
const howler_1 = __importDefault(require("howler"));
const about_1 = __importDefault(require("../about"));
class Audio {
    constructor() {
        /** DO NOT USE */
        this._howler = howler_1.default;
        /** DO NOT USE */
        this._volume = 1;
        this.channels = {
            musics: [],
            sfx: [],
        };
        this.mix = {
            musics: 1,
            sfx: 0.9,
        };
        this.sounds = {};
        this._muted = false;
    }
    get howler() {
        return this._howler;
    }
    get volume() {
        return this._volume;
    }
    set volume(value) {
        this._volume = value;
        for (const name in this.channels) {
            this.setChannelVolume(name, this.mix[name]);
        }
    }
    get muted() {
        return this._muted;
    }
    set muted(value) {
        this._muted = value;
        this.howler.Howler.mute(value);
    }
    toggleMute() {
        this.muted = !this.muted;
        return this;
    }
    initialize(audioParams) {
        if (audioParams === undefined) {
            this.volume = 1;
            return;
        }
        this.volume = audioParams.masterVolume;
        for (const key in audioParams.channels) {
            this.addChannel(key, audioParams.channels[key]);
        }
        this.loadAudios(audioParams.sounds);
    }
    loadAudios(audioList) {
        audioList.forEach((audioParam) => {
            /* Howler format */
            const urls = [];
            for (let i = 0; i < audioParam.formats.length; ++i) {
                urls.push(audioParam.path +
                    '.' +
                    audioParam.formats[i] +
                    '?v=' +
                    about_1.default.gameVersion);
            }
            const audio = new howler_1.default.Howl({
                src: urls,
                autoplay: audioParam.autoplay || false,
                loop: audioParam.loop || false,
                sprite: audioParam.sprite,
                html5: audioParam.html5 !== undefined ? audioParam.html5 : false,
                preload: audioParam.preload !== undefined ? audioParam.preload : true,
                mute: audioParam.mute || false,
                rate: audioParam.rate || 1,
                pool: audioParam.pool || 1,
            });
            /**/
            this.addSound(audioParam, audio);
        });
    }
    addChannel(channelName, volume) {
        this.channels[channelName] = [];
        this.mix[channelName] = volume;
    }
    addSound(audioParam, sound) {
        var _a, _b;
        const localSound = {
            name: audioParam.name,
            channel: (_a = audioParam.channel) !== null && _a !== void 0 ? _a : 'master',
            volume: (_b = audioParam.volume) !== null && _b !== void 0 ? _b : 1,
            howl: sound,
        };
        if (!this.channels[localSound.channel]) {
            this.addChannel(localSound.channel, 1);
        }
        this.sounds[localSound.name] = localSound;
        this.channels[localSound.channel].push(localSound.name);
        sound.volume(this.getSoundVolume(audioParam.name));
    }
    get(name) {
        if (!this.sounds[name]) {
            console.warn('DE.Audio.get sound does not exists or yet declared/added => ' + name);
            return undefined;
        }
        return this.sounds[name];
    }
    getSoundVolume(name) {
        const sound = this.get(name);
        if (sound)
            return this.volume * this.mix[sound.channel] * sound.volume;
        return 0;
    }
    setSoundVolume(name, volume, id) {
        const sound = this.sounds[name];
        const finalVolume = this.volume * this.mix[sound.channel] * volume;
        if (id) {
            return sound.howl.volume(finalVolume, id);
        }
        sound.volume = volume;
        return sound.howl.volume(finalVolume);
    }
    /** DO NOT USE */
    refreshSoundVolume(name) {
        const sound = this.sounds[name];
        this.setSoundVolume(name, sound.volume);
    }
    getChannelVolume(channelName) {
        return this.mix[channelName];
    }
    setChannelVolume(channelName, channelVolume) {
        this.mix[channelName] = channelVolume;
        this.channels[channelName].forEach((soundName) => {
            this.refreshSoundVolume(soundName);
        });
        return this.channels[channelName];
    }
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        return this;
    }
    play(name, spriteName, soundID) {
        const locSound = this.get(name);
        if (!locSound)
            return '';
        const sound = locSound.howl;
        // if the sound was preload = false, it must be loaded now !
        if (sound.state() === 'unloaded') {
            sound.load();
        }
        const newSoundID = sound.play(spriteName !== null && spriteName !== void 0 ? spriteName : soundID);
        return newSoundID;
    }
    pause(name, soundID) {
        const locSound = this.get(name);
        if (!locSound)
            return this;
        const sound = locSound.howl;
        sound.pause(soundID);
        return this;
    }
    stop(name, soundID) {
        const locSound = this.get(name);
        if (!locSound)
            return this;
        const sound = locSound.howl;
        sound.stop(soundID);
        return this;
    }
    mute(name, mute, soundID) {
        const locSound = this.get(name);
        if (!locSound)
            return this;
        const sound = locSound.howl;
        sound.mute(mute, soundID);
        return this;
    }
    stopAll(channelName = 'musics', preserve) {
        if (!this.channels[channelName]) {
            throw 'DE.Audio.stopAll channel does not exists ' + channelName;
        }
        this.channels[channelName].forEach((soundName) => {
            if (!preserve.includes(soundName)) {
                this.stop(soundName);
            }
        });
        return this;
    }
    stopAllAndPlay(name, sprite, channelName, preserve = []) {
        this.stopAll(channelName, preserve);
        this.play(name, sprite);
        return this;
    }
    pauseAll(channelName = 'musics', preserve) {
        if (!this.channels[channelName]) {
            throw 'DE.Audio.pauseAll channel does not exists ' + channelName;
        }
        this.channels[channelName].forEach((soundName) => {
            if (!preserve.includes(soundName)) {
                this.pause(soundName);
            }
        });
        return this;
    }
    pauseAllAndPlay(channelName, name, sprite, preserve) {
        this.pauseAll(channelName, preserve);
        this.play(name, sprite);
        return this;
    }
    /**
     * Play a sound randomly with the given array.
     * If using sprites, will use the first value of names.
     * @param names must be an array of names, or one name if passing a sprite
     * @param sprites if using sprite, only the first value of names will be used
     * @returns
     */
    playRandom(names, sprites) {
        if (sprites) {
            const id = sprites[(Math.random() * sprites.length) >> 0];
            return this.play(names[0], id);
        }
        const id = names[(Math.random() * names.length) >> 0];
        return this.play(id);
    }
    setMuteAll(channelName, value) {
        if (!this.channels[channelName]) {
            throw 'DE.Audio.muteAll channel does not exists ' + channelName;
        }
        this.channels[channelName].forEach((soundName) => {
            this.mute(soundName, value);
        });
        return this;
    }
}
exports.Audio = Audio;
Audio.DEName = 'Audio';
const audioInstance = new Audio();
exports.default = audioInstance;
