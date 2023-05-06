/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it<br>
 * Don't use margins on "notification" element directly, that's why I use a div inside<br>
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */
export declare type NotificationOptions = {
    /**
     * The duration of the notification in milliseconds.
     * (default: 3500)
     * @type {number}
     */
    defaultExpirationTime: number;
    /**
     * The duration of the close animation in milliseconds.
     * (default: 400)
     * @type {number}
     */
    closeAnimationDuration: number;
    /**
     * The class name of the DIV element that contains the notification.
     * @type {string}
     */
    notificationClassName: string;
    /**
     * The HTML element to use as container for notifications HTML elements.
     * @type {HTMLElement}
     */
    container: HTMLElement;
    /**
     * The id of the HTML to use as container for notifications HTML elements.
     * @type {string}
     */
    selector: string;
    /**
     * The HTML template for notifications as string.
     * @type {string}
     */
    template: string;
    /**
     * The id of the HTML that contains the HTML template for notifications.
     * @type {string}
     */
    templateName: string;
};
export declare type NotificationCreateResult = {
    id: string;
    notificationElement: HTMLDivElement;
};
/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it
 * Do not use margins on notification element directly, that's why I use a div inside
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */
export declare class Notifications {
    static readonly DEName: string;
    private _notificationHeight;
    /**
     * The duration of the notification in milliseconds.
     * (default: 3500)
     * @type {number}
     */
    defaultExpirationTime: number;
    /**
     * The duration of the close animation in milliseconds.
     * (default: 400)
     * @type {number}
     */
    closeAnimationDuration: number;
    private _notificationClassName;
    private _notificationContainerId;
    private _notificationContainer;
    private _template;
    private _templateSelectionId;
    private _notifications;
    /**
     * Return true if notifications module are initialized
     * @memberOf Notifications
     * @type {boolean}
     */
    get initialized(): boolean;
    /**
     * Return true if notifications module are initialized
     * @memberOf Notifications
     * @deprecated Use 'initialized' instead
     * @type {boolean}
     */
    get inited(): boolean;
    private _initialized;
    init(options?: Partial<NotificationOptions>): void;
    /**
     * Create a notification.
     * @memberOf Notifications
     * @param {string} text - The text to display.
     * @param {int} [expirationTime] - The time notification will stay on screen from now on until the disappear animation start.
     * @example DE.Notifications.create( "hello world", 1500 );
     */
    create(text: string, expirationTime?: number): Nullable<NotificationCreateResult>;
    /**
     * Bind the remove function
     * @memberOf Notifications
     * @param {string} id - The notification id.
     * @param {int} [time] - The time notification will stay on screen from now on until the disappear animation start.
     */
    bindRemove(id: string, time?: number): void;
    /**
     * Launch animation to remove a notification.
     * @memberOf Notifications
     * @param {string} id - Is the notification to animate
     * @returns {boolean} - True if the notification was found, false if not found.
     */
    triggerRemove(id: string): boolean;
    /**
     * Remove a notification.
     * @memberOf Notifications
     * @param {string} id - The notification id
     * @returns {boolean} - True if the notification was removed, false if not found.
     */
    remove(id: string): boolean;
}
declare const notifications: Notifications;
export default notifications;
