export type GameAboutInfo = {
  engineVersion: string;
  gameName: string;
  gameVersion: string;
  gameAuthor: string;
  namespace: string;
  gamePrice: string | number;
  packPrice: string | number;
};

export class About {
  public static readonly DEName: string = 'About';
  public static readonly engineVersion: string = '2.0';

  private _gameName = 'My-Dreamengine-Game';
  private _gameVersion = '0.1.0';
  private _gameAuthor = 'Dreamirl';

  private _namespace: Nullable<string> = null;
  private _gamePrice: Nullable<string | number> = null;
  private _packPrice: Nullable<string | number> = null;

  public get gameName() {
    return this._gameName;
  }
  public get gameVersion() {
    return this._gameVersion;
  }
  public get gameAuthor() {
    return this._gameAuthor;
  }
  public get namespace() {
    return this._namespace;
  }
  public get gamePrice() {
    return this._gamePrice;
  }
  public get packPrice() {
    return this._packPrice;
  }

  public set(values: Partial<GameAboutInfo>) {
    this._gameName = values.gameName || this._gameName;
    this._gameVersion = values.gameVersion || this._gameVersion;
    this._gameAuthor = values.gameAuthor || this._gameAuthor;
    this._namespace = values.namespace || null;
    this._gamePrice = values.gamePrice || null;
    this._packPrice = values.packPrice || null;
  }
}

const about = new About();
export default about;
