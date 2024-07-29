"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Achievements = void 0;
const config_1 = __importDefault(require("../config"));
const Audio_1 = __importDefault(require("./Audio"));
const Events_1 = __importDefault(require("./Events"));
const Localization_1 = __importDefault(require("./Localization"));
const Notifications_1 = __importDefault(require("./Notifications"));
const Save_1 = __importDefault(require("./Save"));
// Achievement-unlock values added in dictionary
const langs = {
    en: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% unlocked</div>",
    fr: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% débloqué</div>",
    es: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>",
    pt: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>",
    de: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% entriegelt</div>",
    it: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% sbloccato</div>",
    ru: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% разблокирован</div>",
};
function isObjectiveComplete(achievement, objectiveName) {
    if (achievement.complete) {
        return true;
    }
    const objective = achievement.objectives[objectiveName];
    if (!objective) {
        return false;
    }
    return !!objective.complete;
}
/**
 * Provide a system to create achievements.
 * Use events module to detect an unlocked achievement.
 * @namespace Achievements
 */
class Achievements {
    constructor() {
        /**
         * List of all achievements
         * @type {Achievement[]}
         */
        this.achievements = [];
        /**
         * Object containing all unlocked achievements
         * @type {Record<string, Achievement>}
         */
        this.userAchievements = {};
        /**
         * Url to the folder containing the achievement images.
         * @type {string}
         */
        this.achievementImagesUrl = 'img/achievements/';
        /**
         * Extension of the achievement images.
         * @type {string}
         * @default '.png'
         */
        this.achievementImageExtension = '.png';
    }
    /**
     * Url to the folder containing the achievement images.
     * @deprecated Use 'achievementImagesUrl' instead
     * @type {string}
     */
    get achievementsUrl() {
        return this.achievementImagesUrl;
    }
    set achievementsUrl(url) {
        this.achievementImagesUrl = url;
    }
    /**
     * Initialize the 'achievements' module.
     * @param {Achievement[]} list - List of achievements
     * @param {Record<string, Achievement>} userAchievements - List of unlocked achievements
     */
    init(list, userAchievements) {
        const availableLanguagesFromLocalization = Localization_1.default.avalaibleLang;
        for (const lang in langs) {
            if (!availableLanguagesFromLocalization.includes(lang)) {
                continue;
            }
            Localization_1.default.addDictionary({
                [lang]: { 'achievement-unlock': langs[lang] },
            }, true);
        }
        this.achievements = [];
        for (let i = 0, a; (a = list[i]); ++i) {
            this.achievements.push(a);
        }
        this.userAchievements = userAchievements || Save_1.default.loadAchievements();
        Events_1.default.on('games-datas', (objectiveName, value) => this.checkEvent(objectiveName, value));
    }
    /**
     * When engine trigger an event "games-datas", checkEvent handle the name and value to find a corresponding achievement and check objectives' completion.
     * You shouldn't use this method directly and use the Events.
     * @memberOf Achievements
     * @param eventName - The name of the objective.
     * @param value - The value of the objective or the value to increment by (if the objective is an increment).
     * @example DE.emit( "games-datas", "objective-name", myValue );
     */
    checkEvent(eventName, value) {
        for (let i = 0, achievement, userAchievement; (achievement = this.achievements[i]); ++i) {
            userAchievement = this.userAchievements[achievement.namespace];
            for (const objectiveName in achievement.objectives) {
                if (objectiveName != eventName) {
                    continue;
                }
                if (isObjectiveComplete(userAchievement, objectiveName)) {
                    continue;
                }
                this.updateValue(achievement, objectiveName, value);
            }
        }
        Save_1.default.saveAchievements(this.userAchievements);
    }
    /**
     * Check if an achievement is unlocked.
     * @memberOf Achievements
     * @param namespace - Achievement namespace
     * @example if ( DE.Achievements.isUnlock( "commander" ) )
     */
    isUnlock(namespace) {
        var _a;
        for (const achievement of this.achievements) {
            if (achievement.namespace == namespace)
                return ((_a = this.userAchievements[namespace]) === null || _a === void 0 ? void 0 : _a.complete) || false;
        }
        console.warn(`Achievement '${namespace}' not found`);
        return false;
    }
    /**
     * Update the value of an objective.
     * @param achievement - The achievement the objective belongs to
     * @param targetKey - The name of the objective
     * @param value - The updated value or the amount to increment by (if the objective is an increment)
     */
    updateValue(achievement, targetKey, value) {
        const objective = achievement.objectives[targetKey];
        if (!objective) {
            console.warn(`Objective '${targetKey}' not found in achievement '${achievement.namespace}'`);
            return;
        }
        if (!this.userAchievements[achievement.namespace] ||
            !this.userAchievements[achievement.namespace].objectives) {
            this.userAchievements[achievement.namespace] = { objectives: {} };
        }
        const userAchievement = this.userAchievements[achievement.namespace];
        switch (objective.type) {
            case 'increment':
            case '+':
            case '++':
                if (!userAchievement.objectives[targetKey]) {
                    userAchievement.objectives[targetKey] = { value: 0 };
                }
                const userObjectiveValue = userAchievement.objectives[targetKey].value;
                if (typeof value === 'number' &&
                    typeof userObjectiveValue === 'number') {
                    userAchievement.objectives[targetKey].value += value || 1;
                }
                break;
            default:
                // 'equal', '>=', '<', other
                userAchievement.objectives[targetKey] = { value: value };
                break;
        }
        this.checkUnlock(achievement);
    }
    checkUnlock(achievement) {
        const userAchievementObjectives = this.userAchievements[achievement.namespace].objectives;
        const objectives = achievement.objectives;
        let achievementComplete = true;
        for (const objectiveName in objectives) {
            if (!userAchievementObjectives[objectiveName]) {
                achievementComplete = false;
                continue;
            }
            if (userAchievementObjectives[objectiveName].complete) {
                continue;
            }
            const objective = objectives[objectiveName];
            let objectiveComplete = true;
            switch (objective.type) {
                case '=':
                case '==':
                case 'equal':
                    if (objective.target != userAchievementObjectives[objectiveName].value) {
                        objectiveComplete = false;
                    }
                    break;
                case 'increment':
                case '+':
                case '++':
                case '>=':
                    if (userAchievementObjectives[objectiveName].value !== undefined &&
                        userAchievementObjectives[objectiveName].value <=
                            objective.target) {
                        objectiveComplete = false;
                    }
                    break;
                case '<':
                    if (userAchievementObjectives[objectiveName].value !== undefined &&
                        userAchievementObjectives[objectiveName].value >
                            objective.target) {
                        objectiveComplete = false;
                    }
                    break;
                default:
            }
            if (objectiveComplete) {
                userAchievementObjectives[objectiveName].complete = true;
            }
            else {
                achievementComplete = false;
            }
        }
        if (achievementComplete) {
            this.unlocked(achievement);
        }
    }
    /**
     * Unlock an achievement.
     * @param {Achievement} achievement
     */
    unlocked(achievement) {
        this.userAchievements[achievement.namespace].complete = true;
        const name = achievement.names[Localization_1.default.currentLanguage] ||
            achievement.names.en ||
            'null';
        const url = this.achievementImagesUrl +
            achievement.namespace +
            this.achievementImageExtension;
        const txt = (Localization_1.default.get('achievement-unlock') || '%name% unlocked')
            .replace(/%name%/gi, name)
            .replace(/%path%/gi, url);
        Notifications_1.default.create(txt, config_1.default.notifications.achievementUnlockDuration);
        Audio_1.default.play('achievement-unlocked');
        Events_1.default.emit('achievement-unlocked', achievement.namespace);
    }
}
exports.Achievements = Achievements;
Achievements.DEName = 'Achievements';
const achievements = new Achievements();
exports.default = achievements;
