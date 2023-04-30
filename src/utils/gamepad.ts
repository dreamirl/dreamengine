import config from '../config';
import Events from './Events';
import Localization from './Localization';
import Notifications from './Notifications';
import InputsManager, { Inputs } from './Inputs';
import EventEmitter from 'eventemitter3';

/**
 * Author
 @Shocoben / https://github.com/schobbent

 * ContributorsList
 @Shocoben
 @Inateno
 */

/**
 * bring Gamepad API with Chrome and Windows8
 * TODO - comment and document it (big work here)
 * @namespace Inputs
 */
// let addEvent = Event.addEventCapabilities;

function detectBrowser(browser: string) {
  if (browser == 'firefox') {
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      let ffversion = new Number(RegExp.$1); // capture x.x portion and store as a number
      return ffversion;
    }
    return false;
  }

  if (browser == 'chrome') {
    let nav = navigator.userAgent.toLowerCase();
    // doesn't want mobile browser
    return (
      nav.indexOf('chrome') > -1 &&
      nav.indexOf('android') == -1 &&
      nav.indexOf('iphone') == -1 &&
      nav.indexOf('ipad') == -1 &&
      nav.indexOf('ipod') == -1
    );
  }

  return false;
}

type Listener = {
  active: boolean;
  force: number;
  noRate: boolean;
  timesTamp?: number;
  diffTime?: number;
  count?: number;
};

export type WaitKeyCallback = (x: {
  success: boolean;
  type: string;
  gamepadType?: string;
  keyName?: string | number;
  compositeKeyName?: string;
  compositeKeyNameWithoutGamepadIndex?: string;
  sign?: string;
}) => void;

let gamepadAvalaible: boolean[] = [];

class gamepads {
  DEName = 'gamepad';
  isGamepadConnected = false;

  _btnsListeners: { [key: number]: EventEmitter } = {};
  _axesListeners: { [key: number]: EventEmitter } = {};
  _gamepads: (Gamepad | null)[] = [];
  gamepadsInfos: { [x: number]: Gamepad | null } = {};
  lastTimeStamps: { [x: number]: number | null } = {};

  handleDown: (
    i: string,
    eventBus: EventEmitter,
    listener: Listener,
    elemForce: number,
    cTime: number,
  ) => boolean | void = () => {};

  isWaitingForAnyKey = false;
  waitForAnyKeyType = 'keyboard';
  waitForAnyKeyCallback: WaitKeyCallback = () => {};

  _updateChange = (_t: number) => {};
  _updateRate = (_t: number) => {};

  update: (_t: number) => void = () => {};

  init() {
    // Update chrome
    if (detectBrowser('chrome') || navigator.getGamepads) {
      if (config.notifications.gamepadEnable) {
        Notifications.create(
          Localization.get('gamepadAvalaible') ||
            config.notifications.gamepadAvalaible,
        );
      }

      this._updateChange = (cTime) => {
        // [] fallback if there is not gamepads API
        let gamepads = this.filterGamepads(
          navigator.getGamepads ? navigator.getGamepads() : [],
        );

        for (let i = 0; i < gamepads.length; ++i) {
          if (gamepads[i]) {
            if (
              !this.lastTimeStamps[i] ||
              this.lastTimeStamps[i] != gamepads[i]!.timestamp
            ) {
              this.lastTimeStamps[i] = gamepads[i]!.timestamp;
              if (gamepads[i] !== null) this.handleGamepad(gamepads[i]!, cTime);
            }
          } else {
            this.disconnectGamepad(i);
          }
        }
      };

      this._updateRate = (cTime) => {
        let gamepads = this.filterGamepads(
          navigator.getGamepads ? navigator.getGamepads() : [],
        );

        for (let i = 0; i < gamepads.length; ++i) {
          let gamepad = gamepads[i];
          if (gamepad) {
            this.handleGamepad(gamepad, cTime);
            continue;
          } else {
            this.disconnectGamepad(i);
          }
        }
      };

      this.updateByChange();
    }

    // Update firefox - seems not working (tried Nightly)
    else if (detectBrowser('firefox')) {
      // if ( config.notifications.gamepadEnable )
      // Notifications.create( Localization.get( "gamepadAvalaible" ) || config.notifications.gamepadAvalaible );
      /* no gamepad api working right now on Firefox
      _updateChange = function()
      {
        for ( let i =0; i < _gamepads.length; ++i )
        {
          if ( _gamepads[ i ] )
          {
            
          }
        }
      }*/
    }

    window.addEventListener(
      'MozGamepadConnected',
      (e) => this.gamepadConnected(e as GamepadEvent),
      false,
    );
    window.addEventListener(
      'gamepadconnected',
      (e) => this.gamepadConnected(e),
      false,
    );
    // window.addEventListener( "gamepaddisconnected", gamepadDisconnected, false ); // TODO
  }

  filterGamepads(gamepads: (Gamepad | null)[]) {
    let gps = [];
    for (let i = 0; i < gamepads.length; ++i) {
      gps.push(gamepads[i]);
    }

    gps = gps.filter((g) => {
      if (!g) {
        return false;
      }

      let idlower = g.id.toLowerCase();

      return !(
        idlower.match('unknown') ||
        idlower.match('shift') ||
        idlower.match('gear') ||
        idlower.match('b669')
      );
    });
    return gps;
  }

  /*bindWindowController(gamepadState: GamepadState) {
    //create array with the good index from https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
    let axes = ['leftThumbX', 'leftThumbY', 'rightThumbX', 'rightThumbY'];
    let buttons = [
      'a',
      'b',
      'y',
      'x',
      'left_shoulder',
      'right_shoulder',
      'LeftTrigger',
      'RightTrigger',
      'back',
      'start',
      'left_thumb',
      'right_thumb',
      'dpad_up',
      'dpad_down',
      'dpad_left',
      'dpad_right',
    ];

    //bind now
    let nGamepad = {
      index: gamepadState.controllerId,
      timestamp: gamepadState.packetNumber,
      buttons: [] as number[],
      axes: [] as number[],
    };

    //buttons
    for (let i = 0; i < buttons.length; ++i) {
      let name = buttons[i];
      // Window8 Gamepad rightTrigger values are between 0 and 255. Chrome and firexox sticks are between 0 and 1
      if (name == 'LeftTrigger' || name == 'RightTrigger') {
        nGamepad.buttons[i] = gamepadState[name] / 255;
        continue;
      }

      //gamepadState buttons are booleans. Chrome and firefox are float beetwen 0 and 1
      if (gamepadState[name]) {
        nGamepad.buttons[i] = 1;
        continue;
      }
      nGamepad.buttons[i] = 0;
    }

    for (let i = 0; i < axes.length; ++i) {
      let name = axes[i];
      // Window8lib Gamepad thumbstick values are between -32768 and 32767.
      nGamepad.axes[i] = gamepadState[name] / 32767;
      if (name == 'leftThumbY' || name == 'rightThumbY') {
        nGamepad.axes[i] *= -1;
      }
    }
    return nGamepad;
  }*/

  //Firefox handler
  gamepadConnected(e: GamepadEvent) {
    Notifications.create(
      Localization.get('onGamepadConnect') ||
        'Gamepad ' + (e.gamepad.index + 1) + ' connected',
    );
    this._gamepads[e.gamepad.index] = e.gamepad;
    if (!this._gamepads.length) {
      this._gamepads.length = 0;
    }
    this._gamepads.length++;
  }

  handleGamepad(gamepad: Gamepad, cTime: number) {
    let index = gamepad.index;
    this.gamepadsInfos[index] = gamepad;
    if (this._btnsListeners[index]) {
      this.handleListeners(
        index,
        gamepad.buttons,
        this._btnsListeners,
        cTime,
        'buttons',
      );
    }

    if (this._axesListeners[index]) {
      this.handleListeners(
        index,
        gamepad.axes,
        this._axesListeners,
        cTime,
        'axes',
      );
    }
    if (!gamepadAvalaible[index]) {
      console.log('Gamepad connected ' + index, 2);
      if (config.notifications.gamepadChange) {
        this.isGamepadConnected = true;
        Notifications.create(
          Localization.get('onGamepadConnect') ||
            'Gamepad ' + (index + 1) + ' connected',
        );
      }
      Events.emit('connectGamepad', index);
      gamepadAvalaible[index] = true;
    }
  }

  disconnectGamepad(index: number) {
    this.lastTimeStamps[index] = null;
    this._gamepads[index] = null;
    this.gamepadsInfos[index] = null;
    if (gamepadAvalaible[index]) {
      console.log('Disconnect gamepad ' + index, 2);
      if (config.notifications.gamepadChange) {
        this.isGamepadConnected = false;
        for (let i in gamepadAvalaible) {
          if (i != index.toString() && gamepadAvalaible[i]) {
            this.isGamepadConnected = true;
            break;
          }
        }
        Notifications.create(
          Localization.get('onGamepadDisconnect') ||
            'Gamepad ' + (index + 1) + ' disconnected',
        );
      }
      Events.emit('disconnectGamepad', index);
      gamepadAvalaible[index] = false;
      --this._gamepads.length;
    }
  }

  getGamepadsLength() {
    let n = 0;
    for (let i in gamepadAvalaible) {
      if (gamepadAvalaible[i]) {
        ++n;
      }
    }
    return n;
  }

  _sensibility = 0.5;
  overSensibility(force: number) {
    if (
      (force < -this._sensibility && force < 0) ||
      (force > this._sensibility && force > 0)
    ) {
      return true;
    }
    return false;
  }

  handleDownChange(
    i: string,
    eventBus: EventEmitter,
    listener: Listener,
    elemForce: number,
  ) {
    if (this.overSensibility(elemForce) && !listener.active) {
      eventBus.emit('down' + i, elemForce, i);
      listener.active = true;
    }
  }

  _firstRate = 500;
  _rate = 150;

  handleDownRate(
    i: string,
    eventBus: EventEmitter,
    listener: Listener,
    elemForce: number,
    cTime: number,
  ) {
    if (this.overSensibility(elemForce)) {
      if (!listener.active) {
        eventBus.emit('down' + i, elemForce, i);
        listener.active = true;
        listener.timesTamp = cTime;
        listener.diffTime = this._firstRate;
        return true;
      }

      if (listener.noRate) {
        return true;
      }

      if (listener.timesTamp! + listener.diffTime! < cTime) {
        eventBus.emit('down' + i, elemForce, i);
        listener.timesTamp = cTime;
        listener.diffTime = this._rate;
        return true;
      }
    }
    return false;
  }

  handleListeners(
    index: number,
    gamepadInterface: readonly (number | GamepadButton)[],
    arrayListeners: { [key: number]: EventEmitter },
    cTime: number,
    type: string,
  ) {
    for (let [ind, lst] of Object.entries(arrayListeners[index].listeners)) {
      const listener = lst as Listener;

      const i = parseInt(ind);
      if (!gamepadInterface[i]) {
        return;
      }

      let elemForce = 0;
      if (typeof gamepadInterface[i] === 'number') {
        elemForce = gamepadInterface[i] as number;
      } else {
        elemForce = (gamepadInterface[i] as GamepadButton).value;
      }
      let eventBus = arrayListeners[index];

      if (Math.abs(elemForce) < 0.3) {
        elemForce = 0;
      }

      if (elemForce != listener.force) {
        if (this.isWaitingForAnyKey && type !== undefined) {
          if (this.waitForAnyKeyType === 'keyboard') {
            continue;
          }

          if (type === 'axes') {
            if (Math.abs(elemForce) < 0.8) {
              continue;
            }

            let key: keyof typeof InputsManager.dbInputs.GAMEPADBUTTONS;
            let keyName: string | undefined = undefined;
            for (key in InputsManager.dbInputs.GAMEPADBUTTONS) {
              if (InputsManager.dbInputs.GAMEPADBUTTONS[key] == i) {
                keyName = key;
                break;
              }
            }

            this.waitForAnyKeyCallback({
              success: true,
              type: 'gamepad',
              gamepadType: 'axes',
              keyName,
              compositeKeyName: `G${index}.A.${keyName}`,
              compositeKeyNameWithoutGamepadIndex: `G.A.${keyName}`,
              sign: elemForce > 0 ? '+' : '-',
            });
            this.isWaitingForAnyKey = false;
          }
        } else {
          eventBus.emit('move' + i, elemForce, i);
        }
      }
      listener.force = elemForce;

      if (this.handleDown(ind, eventBus, listener, elemForce, cTime)) {
        continue;
      }

      if (!this.overSensibility(elemForce) && listener.active) {
        if (this.isWaitingForAnyKey && type !== undefined) {
          if (this.waitForAnyKeyType === 'keyboard') {
            continue;
          }

          if (type === 'buttons') {
            let key: keyof typeof InputsManager.dbInputs.GAMEPADBUTTONS;
            let keyName:
              | keyof typeof InputsManager.dbInputs.GAMEPADBUTTONS
              | undefined = undefined;
            for (key in InputsManager.dbInputs.GAMEPADBUTTONS) {
              if (InputsManager.dbInputs.GAMEPADBUTTONS[key] == i) {
                keyName = key;
                break;
              }
            }

            this.waitForAnyKeyCallback({
              success: true,
              type: 'gamepad',
              gamepadType: 'buttons',
              keyName,
              compositeKeyName: `G${index}.B.${keyName}`,
              compositeKeyNameWithoutGamepadIndex: `G.B.${keyName}`,
            });
            this.isWaitingForAnyKey = false;
          }
        } else {
          eventBus.emit('up' + i, elemForce, i);
        }

        listener.active = false;
        listener.count = 0;
      }
    }
  }

  handleGamepadAxes(gamepad: Gamepad) {
    for (let ind in this._axesListeners[gamepad.index].listeners) {
      const i = parseInt(ind);
      if (
        gamepad.axes[i] > 0 &&
        // @ts-ignore
        !this._axesListeners[gamepad.index].listeners[i]
      ) {
        this._btnsListeners[gamepad.index].emit('down' + i);

        // @ts-ignore
        if (this._btnsListeners[gamepad.index].listeners[i]) {
          // @ts-ignore
          this._btnsListeners[gamepad.index].listeners[i] = true;
        }
        continue;
      }
    }
  }

  _checkListeners(
    o: { [key: number]: EventEmitter },
    padIndex: number,
    num: number,
  ) {
    if (!o[padIndex]) {
      o[padIndex] = new Events.Emitter();
      o[padIndex].listeners = () => [];
      // addEvent( o[ padIndex ] );
    }

    // @ts-ignore
    if (typeof o[padIndex].listeners[num] == 'undefined') {
      // @ts-ignore
      o[padIndex].listeners[num] = { active: false, force: 0 };
    }
  }

  addListener(
    o: { [key: number]: EventEmitter },
    padIndex: number,
    num: number,
    action: string,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this._checkListeners(o, padIndex, num);
    o[padIndex].on(action + num, callBack);

    // @ts-ignore
    if (o[padIndex].listeners[num]) o[padIndex].listeners[num].noRate = noRate;
  }

  delListener(
    o: { [key: number]: EventEmitter },
    padIndex: number,
    num: number,
    action: string,
  ) {
    if (o[padIndex]) {
      o[padIndex].removeListener(action + num);
    }
  }

  delAllOfnum(
    o: { [key: number]: EventEmitter },
    padIndex: number,
    num: number,
  ) {
    if (!o[padIndex]) {
      return;
    }

    this.delListener(o, padIndex, num, 'down');
    this.delListener(o, padIndex, num, 'up');
    this.delListener(o, padIndex, num, 'move');

    // @ts-ignore
    delete o[padIndex].listeners[num];
  }

  delAllListenersOfIndex(o: { [key: number]: EventEmitter }, padIndex: number) {
    if (!o[padIndex]) {
      return;
    }

    for (let i in o[padIndex].listeners) {
      this.delAllOfnum(o, padIndex, parseFloat(i));
    }
  }

  delAllListeners(o: { [key: number]: EventEmitter }) {
    if (!o) {
      return;
    }

    for (let i in o) {
      this.delAllListenersOfIndex(o, parseInt(i));
    }
  }

  //On Btns
  onBtnDown(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._btnsListeners,
      padIndex,
      num,
      'down',
      callBack,
      noRate,
    );
  }

  onBtnMove(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._btnsListeners,
      padIndex,
      num,
      'move',
      callBack,
      noRate,
    );
  }

  onBtnUp(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._btnsListeners,
      padIndex,
      num,
      'up',
      callBack,
      noRate,
    );
  }

  //del Btns
  delBtnDown(padIndex: number, num: number) {
    this.delListener(this._btnsListeners, padIndex, num, 'down');
  }

  delBtnMove(padIndex: number, num: number) {
    this.delListener(this._btnsListeners, padIndex, num, 'move');
  }

  delBtnUp(padIndex: number, num: number) {
    this.delListener(this._btnsListeners, padIndex, num, 'up');
  }

  delBtn(padIndex: number, num: number) {
    this.delAllOfnum(this._btnsListeners, padIndex, num);
  }

  delBtnsPad(padIndex: number) {
    this.delAllListenersOfIndex(this._btnsListeners, padIndex);
  }

  delBtnsListeners() {
    this.delAllListeners(this._btnsListeners);
  }

  //On Axes
  onAxeStart(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._axesListeners,
      padIndex,
      num,
      'down',
      callBack,
      noRate,
    );
  }

  onAxeMove(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._axesListeners,
      padIndex,
      num,
      'move',
      callBack,
      noRate,
    );
  }

  onAxeStop(
    padIndex: number,
    num: number,
    callBack: (x: number) => void,
    noRate: boolean,
  ) {
    this.addListener(
      this._axesListeners,
      padIndex,
      num,
      'up',
      callBack,
      noRate,
    );
  }

  //del Btns
  delAxeStart(padIndex: number, num: number) {
    this.delListener(this._axesListeners, padIndex, num, 'down');
  }

  delAxeMove(padIndex: number, num: number) {
    this.delListener(this._axesListeners, padIndex, num, 'move');
  }

  delAxeStop(padIndex: number, num: number) {
    this.delListener(this._axesListeners, padIndex, num, 'up');
  }

  delAxe(padIndex: number, num: number) {
    this.delAllOfnum(this._axesListeners, padIndex, num);
  }

  delAxesPad(padIndex: number) {
    this.delAllListenersOfIndex(this._axesListeners, padIndex);
  }

  delAxesListeners() {
    this.delAllListeners(this._axesListeners);
  }

  delListeners() {
    this.delAllListeners(this._axesListeners);
    this.delAllListeners(this._btnsListeners);
  }

  plugBtnToInput(
    inputs: Inputs,
    inputName: string,
    padIndex: number,
    num: number,
  ) {
    this.onBtnDown(
      padIndex,
      num,
      (force: number) => {
        inputs.usedInputs[inputName].isDown = true;
        inputs.emit('keyDown', inputName, force);
      },
      false,
    );

    this.onBtnUp(
      padIndex,
      num,
      (force: number) => {
        inputs.usedInputs[inputName].isDown = false;
        inputs.emit('keyUp', inputName, force);
      },
      false,
    );

    this.onBtnMove(
      padIndex,
      num,
      (force: number) => {
        inputs.emit('btnMoved', inputName, force);
      },
      false,
    );
  }

  plugAxeToInput(
    Inputs: Inputs,
    inputName: string,
    padIndex: number,
    num: number,
  ) {
    this.onAxeStart(
      padIndex,
      num,
      (force: number) => {
        Inputs.emit('axeStart', inputName, force);
      },
      false,
    );

    this.onAxeStop(
      padIndex,
      num,
      (force: number) => {
        Inputs.emit('axeStop', inputName, force);
      },
      false,
    );

    this.onAxeMove(
      padIndex,
      num,
      (force: number) => {
        Inputs.emit('axeMoved', inputName, force);
      },
      false,
    );
  }

  waitForAnyKey(callback: WaitKeyCallback, type: string) {
    if (type !== 'keyboard' && type !== 'gamepad' && type !== 'all') {
      return;
    }
    if (typeof callback !== 'function') {
      return;
    }

    this.isWaitingForAnyKey = true;

    this.waitForAnyKeyType = type;
    this.waitForAnyKeyCallback = callback;
  }

  //Updates changes
  updateByRate() {
    //Update every rate, which allow you to use on...Down to move something
    this.update = this._updateRate;
    this.handleDown = this.handleDownRate;
  }

  updateByChange() {
    //Update at every change
    this.update = this._updateChange;
    this.handleDown = this.handleDownChange;
  }
}

const gp = new gamepads();
export default gp;
