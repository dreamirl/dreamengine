import config from '../config';
import Audio from './Audio';
import Events from './Events';
import Localization from './Localization';
import Notifications from './Notifications';
import Save from './Save';

// Achievement-unlock values added in dictionary
const langs: Record<string, string> = {
  en: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% unlocked</div>",
  fr: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% débloqué</div>",
  es: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>",
  pt: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>",
  de: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% entriegelt</div>",
  it: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% sbloccato</div>",
  ru: "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% разблокирован</div>",
};

type ObjectiveEqualType = 'equal' | '=' | '==';
type ObjectiveOtherType = 'increment' | '+' | '++' | '>=' | '<';

type EqualObjective = {
  type: ObjectiveEqualType;
  target: string | number;
};
type OtherObjective = {
  type: ObjectiveOtherType;
  target: number;
};

export type Objective = EqualObjective | OtherObjective;

export type UserObjective = {
  value: number | string;
  complete?: boolean;
};

export type Achievement = {
  namespace: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  objectives: Record<string, Objective>;
  reward: any[];
  order: number;
};

export type UserAchievement = {
  objectives: Record<string, UserObjective>;
  complete?: boolean;
};

function isObjectiveComplete(
  achievement: UserAchievement,
  objectiveName: string,
): boolean {
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
export class Achievements<T extends Achievement> {
  public static readonly DEName = 'Achievements';

  /**
   * List of all achievements
   * @type {Achievement[]}
   */
  public achievements: T[] = [];

  /**
   * Object containing all unlocked achievements
   * @type {Record<string, Achievement>}
   */
  public userAchievements: Record<string, UserAchievement> = {};

  /**
   * Url to the folder containing the achievement images.
   * @type {string}
   */
  public achievementImagesUrl = 'img/achievements/';
  /**
   * Url to the folder containing the achievement images.
   * @deprecated Use 'achievementImagesUrl' instead
   * @type {string}
   */
  public get achievementsUrl() {
    return this.achievementImagesUrl;
  }
  public set achievementsUrl(url: string) {
    this.achievementImagesUrl = url;
  }

  /**
   * Extension of the achievement images.
   * @type {string}
   * @default '.png'
   */
  public achievementImageExtension = '.png';

  /**
   * Initialize the 'achievements' module.
   * @param {Achievement[]} list - List of achievements
   * @param {Record<string, Achievement>} userAchievements - List of unlocked achievements
   */
  public init(list: T[], userAchievements?: Record<string, UserAchievement>) {
    const availableLanguagesFromLocalization = Localization.avalaibleLang;

    for (const lang in langs) {
      if (!availableLanguagesFromLocalization.includes(lang)) {
        continue;
      }

      Localization.addDictionary(
        {
          [lang]: { 'achievement-unlock': langs[lang] },
        },
        true,
      );
    }

    this.userAchievements = userAchievements || Save.loadAchievements();

    this.achievements = [];
    for (let i = 0, a; (a = list[i]); ++i) {
      this.achievements.push(a);

      if (a.namespace === '__ts') {
        console.warn(
          'YOU HAVE A CONFLICT IN THE ACHIEVEMENTS, The Namespace __ts is reserved for harddisk save only',
        );
      }

      if (!this.userAchievements[a.namespace]) {
        this.userAchievements[a.namespace] = { objectives: {} };
      }
    }

    Events.on('games-datas', (objectiveName: string, value: string | number) =>
      this.checkEvent(objectiveName, value),
    );
  }

  /**
   * When engine trigger an event "games-datas", checkEvent handle the name and value to find a corresponding achievement and check objectives' completion.
   * You shouldn't use this method directly and use the Events.
   * @memberOf Achievements
   * @param eventName - The name of the objective.
   * @param value - The value of the objective or the value to increment by (if the objective is an increment).
   * @example DE.emit( "games-datas", "objective-name", myValue );
   */
  public checkEvent(eventName: string, value: string | number) {
    for (
      let i = 0, achievement, userAchievement: UserAchievement;
      (achievement = this.achievements[i]);
      ++i
    ) {
      userAchievement = this.userAchievements[achievement.namespace];

      for (const objectiveName in achievement.objectives) {
        if (objectiveName != eventName) {
          continue;
        }

        // this is specifically to be able to retrieve the information
        // without considering the local save
        // because usually external APIs are not easily syncable with the local save
        // better to listen this event rather than "set-achievement-progress" for Steam for example
        Events.emit(
          'external-check-achievement-progress',
          objectiveName,
          achievement.objectives[objectiveName].type,
          userAchievement.objectives[objectiveName]?.value,
          value,
        );

        if (isObjectiveComplete(userAchievement, objectiveName)) {
          continue;
        }

        this.updateValue(achievement, objectiveName, value);
      }
    }

    Save.saveAchievements(this.userAchievements);
  }

  /**
   * Check if an achievement is unlocked.
   * @memberOf Achievements
   * @param namespace - Achievement namespace
   * @example if ( DE.Achievements.isUnlock( "commander" ) )
   */
  public isUnlock(namespace: string): boolean {
    for (const achievement of this.achievements) {
      if (achievement.namespace == namespace)
        return this.userAchievements[namespace]?.complete || false;
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
  public updateValue(
    achievement: Achievement,
    targetKey: string,
    value: string | number,
  ) {
    const objective = achievement.objectives[targetKey];

    if (!objective) {
      console.warn(
        `Objective '${targetKey}' not found in achievement '${achievement.namespace}'`,
      );
      return;
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

        if (
          typeof value === 'number' &&
          typeof userObjectiveValue === 'number'
        ) {
          (userAchievement.objectives[targetKey].value as number) += value || 1;
        }

        break;
      default:
        // 'equal', '>=', '<', other
        userAchievement.objectives[targetKey] = { value: value };
        break;
    }

    Events.emit(
      'set-achievement-progress',
      targetKey,
      userAchievement.objectives[targetKey].value,
      value,
    );
    this.checkUnlock(achievement);
  }

  private checkUnlock(achievement: Achievement) {
    const userAchievementObjectives =
      this.userAchievements[achievement.namespace].objectives;
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
          if (
            objective.target != userAchievementObjectives[objectiveName].value
          ) {
            objectiveComplete = false;
          }
          break;
        case 'increment':
        case '+':
        case '++':
        case '>=':
          if (
            userAchievementObjectives[objectiveName].value !== undefined &&
            (userAchievementObjectives[objectiveName].value as number) <=
              objective.target
          ) {
            objectiveComplete = false;
          }
          break;
        case '<':
          if (
            userAchievementObjectives[objectiveName].value !== undefined &&
            (userAchievementObjectives[objectiveName].value as number) >
              objective.target
          ) {
            objectiveComplete = false;
          }
          break;
        default:
      }

      if (objectiveComplete) {
        userAchievementObjectives[objectiveName].complete = true;
      } else {
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
  public unlocked(achievement: Achievement) {
    const wasAlreadyComplete = this.userAchievements[achievement.namespace].complete;
    this.userAchievements[achievement.namespace].complete = true;

    if (!wasAlreadyComplete) {
      const name =
        achievement.names[Localization.currentLanguage] ||
        achievement.names.en ||
        'null';
      const url =
        this.achievementImagesUrl +
        achievement.namespace +
        this.achievementImageExtension;
      const txt = (Localization.get('achievement-unlock') || '%name% unlocked')
        .replace(/%name%/gi, name)
        .replace(/%path%/gi, url);

      Notifications.create(txt, config.notifications.achievementUnlockDuration);
      Audio.play('achievement-unlocked');
    }
    // re-trigger the event even if it's already completed because it can relly on external API/SDK
    Events.emit('achievement-unlocked', achievement.namespace);
  }
}

const achievements = new Achievements();
export default achievements;
