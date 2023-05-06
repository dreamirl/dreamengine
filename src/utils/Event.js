"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Event
 you can add some Events on what you want, by default there are on engine "states".
 When you want create an event callback, create it like that: on( 'something', function(){ myfunction(); } )
 because callbacks are deleted if you dont set persistent true.
 
 Also, this provide an modular Event binder, so just call Event.addEventCapabilities, but if you want to add events
 on a prototype, you'll have to call addEventComponents inside the constructor
 Nb: GameObjects - Camera have already Events
**/
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class Event {
    constructor() {
        this.emitter = new eventemitter3_1.default();
        this.Emitter = eventemitter3_1.default;
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    once(event, listener) {
        this.emitter.once(event, listener);
    }
    emit(event, ...args) {
        this.emitter.emit(event, ...args);
    }
    removeListener(event, listener) {
        this.emitter.removeListener(event, listener);
    }
}
exports.default = Event;
