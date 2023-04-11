import howler from 'howler';
import about from '../about';

type AudioParam = {
  name: string;
  path: string;
  formats: string[]; // = ['ogg'];
  preload?: boolean; // = true;
  loop?: boolean; // = false;
  isMusic?: boolean; // = true;
  channel?: string; // = 'default';
  volume?: number; // = 1;
  pool?: number; // = 1;
  rate?: number; // = 1;
  mute?: boolean; // = false;
  html5?: boolean; // = false;
  autoplay?: boolean; // = false;
  sprite?: howler.SoundSpriteDefinitions; // = {}
};

type LocalSound = {
  name: string;
  channel: string;
  volume: number;
  howl: howler.Howl;
};

type ChannelData = {
  name: string;
  volume: number;
};

class Audio {
  static DEName = 'Audio';
  private _howler = howler;
  public get howler() {
    return this._howler;
  }

  private _volume = 1;
  public get volume() {
    return this._volume;
  }
  public set volume(value: number) {
    this._volume = value;

    for (let name in this.channels) {
      this.setChannelVolume(name, this.mix[name]);
    }
  }

  channels: Record<string, string[]> = {
    musics: [],
    sfx: [],
  };
  mix: Record<string, number> = {
    musics: 1,
    sfx: 0.9,
  };
  sounds: Record<string, LocalSound> = {};

  _muted = false;
  public get muted() {
    return this._muted;
  }
  public set muted(value) {
    this._muted = value;
    this.howler.Howler.mute(value);
  }
  toggleMute() {
    this.muted = !this.muted;
    return this;
  }

  initialize(audioParams: {
    masterVolume: number;
    channels: Record<string, number>;
    sounds: AudioParam[];
  }) {
    this.volume = audioParams.masterVolume;

    for (let key in audioParams.channels) {
      this.addChannel(key, audioParams.channels[key]);
    }

    this.loadAudios(audioParams.sounds);
  }

  loadAudios(audioList: AudioParam[]) {
    audioList.forEach((audioParam) => {
      /* Howler format */
      let urls = [];
      for (var i = 0; i < audioParam.formats.length; ++i) {
        urls.push(
          audioParam.path +
            '.' +
            audioParam.formats[i] +
            '?v=' +
            about.gameVersion,
        );
      }

      const audio = new howler.Howl({
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

  addChannel(channelName: string, volume: number) {
    this.channels[channelName] = [];
    this.mix[channelName] = volume;
  }

  addSound(audioParam: AudioParam, sound: howler.Howl) {
    const localSound = {
      name: audioParam.name,
      channel: audioParam.channel ?? 'master',
      volume: audioParam.volume ?? 1,
      howl: sound,
    };

    if (!this.channels[localSound.channel]) {
      this.addChannel(localSound.channel, 1);
    }

    this.sounds[localSound.name] = localSound;
    this.channels[localSound.channel].push(localSound.name);

    sound.volume(this.getSoundVolume(audioParam.name));
  }
  get(name: string, getHowl: boolean = false) {
    if (!this.sounds[name]) {
      throw (
        'DE.Audio.get sound does not exists or yet declared/added => ' + name
      );
    }
    if (getHowl) {
      return this.sounds[name].howl;
    }
    return this.sounds[name];
  }
  getSoundVolume(name: string): number {
    const sound = this.get(name);
    return this.volume * this.mix[sound.channel] * sound.volume;
  }
  setSoundVolume(name: string, volume: number, id?: number) {
    const sound = this.sounds[name];
    const finalVolume = this.volume * this.mix[sound.channel] * volume;
    if (id) {
      return sound.howl.volume(finalVolume, id);
    }
    sound.volume = volume;
    return sound.howl.volume(finalVolume);
  }
  private refreshSoundVolume(name: string) {
    const sound = this.sounds[name];
    this.setSoundVolume(name, sound.volume);
  }

  getChannelVolume(channelName: string): number {
    return this.mix[channelName];
  }
  setChannelVolume(channelName: string, channelVolume: number): string[] {
    this.mix[channelName] = channelVolume;

    this.channels[channelName].forEach((soundName) => {
      this.refreshSoundVolume(soundName);
    });
    return this.channels[channelName];
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    return this;
  }

  play(name: string, spriteName?: string | undefined, soundID?: number) {
    const sound = this.get(name, true);
    // if the sound was preload = false, it must be loaded now !
    if (sound.state() === 'unloaded') {
      sound.load();
    }

    const newSoundID = sound.play(spriteName ?? soundID);
    return newSoundID;
  }

  pause(name: string, soundID?: number) {
    const sound = this.get(name, true);
    sound.pause(soundID);
    return this;
  }

  stop(name: string, soundID?: number) {
    const sound = this.get(name, true);
    sound.stop(soundID);
    return this;
  }
  mute(name: string, mute: boolean, soundID?: number) {
    const sound = this.get(name, true);
    sound.mute(mute, soundID);
    return this;
  }
  stopAll(channelName: string = 'musics', preserve: string[]) {
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
  stopAllAndPlay(
    channelName: string,
    name: string,
    sprite: string,
    preserve: string[],
  ) {
    this.stopAll(channelName, preserve);
    this.play(name, sprite);
    return this;
  }
  pauseAll(channelName: string = 'musics', preserve: string[]) {
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
  pauseAllAndPlay(
    channelName: string,
    name: string,
    sprite: string,
    preserve: string[],
  ) {
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
  playRandom(names: string[], sprites?: string[]) {
    if (sprites) {
      const id = sprites[(Math.random() * sprites.length) >> 0];
      return this.play(names[0], id);
    }

    const id = names[(Math.random() * names.length) >> 0];
    return this.play(id);
  }
}

const audioInstance = new Audio();

export default audioInstance;