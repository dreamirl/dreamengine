import howler from 'howler';
export declare type AudioParam = {
    name: string;
    path: string;
    formats: string[];
    preload?: boolean;
    loop?: boolean;
    isMusic?: boolean;
    channel?: string;
    volume?: number;
    pool?: number;
    rate?: number;
    mute?: boolean;
    html5?: boolean;
    autoplay?: boolean;
    sprite?: howler.SoundSpriteDefinitions;
};
declare type LocalSound = {
    name: string;
    channel: string;
    volume: number;
    howl: howler.Howl;
};
export declare class Audio {
    static readonly DEName = "Audio";
    /** DO NOT USE */
    _howler: typeof howler;
    get howler(): typeof howler;
    /** DO NOT USE */
    _volume: number;
    get volume(): number;
    set volume(value: number);
    channels: Record<string, string[]>;
    mix: Record<string, number>;
    sounds: Record<string, LocalSound>;
    _muted: boolean;
    get muted(): boolean;
    set muted(value: boolean);
    toggleMute(): this;
    initialize(audioParams?: {
        masterVolume: number;
        channels: Record<string, number>;
        sounds: AudioParam[];
    }): void;
    loadAudios(audioList: AudioParam[]): void;
    addChannel(channelName: string, volume: number): void;
    addSound(audioParam: AudioParam, sound: howler.Howl): void;
    get(name: string): LocalSound | undefined;
    getSoundVolume(name: string): number;
    setSoundVolume(name: string, volume: number, id?: number): number | howler.Howl;
    /** DO NOT USE */
    refreshSoundVolume(name: string): void;
    getChannelVolume(channelName: string): number;
    setChannelVolume(channelName: string, channelVolume: number): string[];
    setVolume(volume: number): this;
    play(name: string, spriteName?: string | undefined, soundID?: number): number | "";
    pause(name: string, soundID?: number): this;
    stop(name: string, soundID?: number): this;
    mute(name: string, mute: boolean, soundID?: number): this;
    stopAll(channelName: string | undefined, preserve: string[]): this;
    stopAllAndPlay(name: string, sprite?: string, channelName?: string, preserve?: string[]): this;
    pauseAll(channelName: string | undefined, preserve: string[]): this;
    pauseAllAndPlay(channelName: string, name: string, sprite: string, preserve: string[]): this;
    /**
     * Play a sound randomly with the given array.
     * If using sprites, will use the first value of names.
     * @param names must be an array of names, or one name if passing a sprite
     * @param sprites if using sprite, only the first value of names will be used
     * @returns
     */
    playRandom(names: string[], sprites?: string[]): number | "";
    setMuteAll(channelName: string, value: boolean): this;
}
declare const audioInstance: Audio;
export default audioInstance;
