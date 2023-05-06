import Event from './Event';
declare const ev: Event<Record<string, any>, Record<string, any> & {
    debugModeChanged: number;
}>;
export default ev;
