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
import EventEmitter from 'eventemitter3';
declare type EngineEventsTypes = {
    debugModeChanged: number;
};
export default class Event<TGameEventsTypes extends Record<string, any>, TEventsTypes = TGameEventsTypes & EngineEventsTypes> {
    private readonly emitter;
    Emitter: typeof EventEmitter;
    on<T extends string & keyof TEventsTypes>(event: T, listener: (...args: TEventsTypes[T][]) => void): void;
    once<T extends string & keyof TEventsTypes>(event: T, listener: (...args: TEventsTypes[T][]) => void): void;
    emit<T extends string & keyof TEventsTypes>(event: T, ...args: TEventsTypes[T][]): void;
    removeListener<T extends string & keyof TEventsTypes>(event: T, listener: (...args: TEventsTypes[T][]) => void): void;
}
export {};
