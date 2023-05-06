declare type ObjectiveEqualType = 'equal' | '=' | '==';
declare type ObjectiveOtherType = 'increment' | '+' | '++' | '>=' | '<';
declare type EqualObjective = {
    type: ObjectiveEqualType;
    target: string | number;
};
declare type OtherObjective = {
    type: ObjectiveOtherType;
    target: number;
};
export declare type Objective = EqualObjective | OtherObjective;
export declare type UserObjective = {
    value: number | string;
    complete?: boolean;
};
export declare type Achievement = {
    namespace: string;
    names: Record<string, string>;
    descriptions: Record<string, string>;
    objectives: Record<string, Objective>;
    reward: any[];
    order: number;
};
export declare type UserAchievement = {
    objectives: Record<string, UserObjective>;
    complete?: boolean;
};
/**
 * Provide a system to create achievements.
 * Use events module to detect an unlocked achievement.
 * @namespace Achievements
 */
export declare class Achievements<T extends Achievement> {
    static readonly DEName = "Achievements";
    /**
     * List of all achievements
     * @type {Achievement[]}
     */
    achievements: T[];
    /**
     * Object containing all unlocked achievements
     * @type {Record<string, Achievement>}
     */
    userAchievements: Record<string, UserAchievement>;
    /**
     * Url to the folder containing the achievement images.
     * @type {string}
     */
    achievementImagesUrl: string;
    /**
     * Url to the folder containing the achievement images.
     * @deprecated Use 'achievementImagesUrl' instead
     * @type {string}
     */
    get achievementsUrl(): string;
    set achievementsUrl(url: string);
    /**
     * Extension of the achievement images.
     * @type {string}
     * @default '.png'
     */
    achievementImageExtension: string;
    /**
     * Initialize the 'achievements' module.
     * @param {Achievement[]} list - List of achievements
     * @param {Record<string, Achievement>} userAchievements - List of unlocked achievements
     */
    init(list: T[], userAchievements?: Record<string, UserAchievement>): void;
    /**
     * When engine trigger an event "games-datas", checkEvent handle the name and value to find a corresponding achievement and check objectives' completion.
     * You shouldn't use this method directly and use the Events.
     * @memberOf Achievements
     * @param eventName - The name of the objective.
     * @param value - The value of the objective or the value to increment by (if the objective is an increment).
     * @example DE.emit( "games-datas", "objective-name", myValue );
     */
    checkEvent(eventName: string, value: string | number): void;
    /**
     * Check if an achievement is unlocked.
     * @memberOf Achievements
     * @param namespace - Achievement namespace
     * @example if ( DE.Achievements.isUnlock( "commander" ) )
     */
    isUnlock(namespace: string): boolean;
    /**
     * Update the value of an objective.
     * @param achievement - The achievement the objective belongs to
     * @param targetKey - The name of the objective
     * @param value - The updated value or the amount to increment by (if the objective is an increment)
     */
    updateValue(achievement: Achievement, targetKey: string, value: string | number): void;
    private checkUnlock;
    /**
     * Unlock an achievement.
     * @param {Achievement} achievement
     */
    unlocked(achievement: Achievement): void;
}
declare const achievements: Achievements<Achievement>;
export default achievements;
