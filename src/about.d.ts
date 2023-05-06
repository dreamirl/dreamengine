export declare type GameAboutInfo = {
    engineVersion: string;
    gameName: string;
    gameVersion: string;
    gameAuthor: string;
    namespace: string;
    gamePrice: string | number;
    packPrice: string | number;
};
export declare class About {
    static readonly DEName: string;
    static readonly engineVersion: string;
    private _gameName;
    private _gameVersion;
    private _gameAuthor;
    private _namespace;
    private _gamePrice;
    private _packPrice;
    get gameName(): string;
    get gameVersion(): string;
    get gameAuthor(): string;
    get namespace(): Nullable<string>;
    get gamePrice(): Nullable<string | number>;
    get packPrice(): Nullable<string | number>;
    set(values: Partial<GameAboutInfo>): void;
}
declare const about: About;
export default about;
