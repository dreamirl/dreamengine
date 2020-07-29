import EventEmitter from 'eventemitter3';

const Events = new EventEmitter();
Events.Emitter = EventEmitter;
Events.DEName = 'Events';

Events.trigger = Events.emit;

export default Events;
