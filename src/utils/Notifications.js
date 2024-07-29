"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = void 0;
const config_1 = __importDefault(require("../config"));
/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it
 * Do not use margins on notification element directly, that's why I use a div inside
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */
class Notifications {
    constructor() {
        this._notificationHeight = 0;
        /**
         * The duration of the notification in milliseconds.
         * (default: 3500)
         * @type {number}
         */
        this.defaultExpirationTime = 3500;
        /**
         * The duration of the close animation in milliseconds.
         * (default: 400)
         * @type {number}
         */
        this.closeAnimationDuration = 400;
        this._notificationClassName = 'notification';
        this._notificationContainerId = 'notifsContainer';
        this._notificationContainer = null;
        this._template = '';
        this._templateSelectionId = 'notificationTemplate';
        this._notifications = {};
        this._initialized = false;
    }
    /**
     * Return true if notifications module are initialized
     * @memberOf Notifications
     * @type {boolean}
     */
    get initialized() {
        return this._initialized;
    }
    /**
     * Return true if notifications module are initialized
     * @memberOf Notifications
     * @deprecated Use 'initialized' instead
     * @type {boolean}
     */
    get inited() {
        return this._initialized;
    }
    init(options = {}) {
        this._notificationContainerId =
            options.selector || this._notificationContainerId;
        this._templateSelectionId =
            options.templateName || this._templateSelectionId;
        this.closeAnimationDuration =
            options.closeAnimationDuration || this.closeAnimationDuration;
        this.defaultExpirationTime =
            options.defaultExpirationTime || this.defaultExpirationTime;
        this._notificationClassName =
            options.notificationClassName || this._notificationClassName;
        const notificationContainer = document.getElementById(this._notificationContainerId);
        this._notificationContainer =
            options.container || notificationContainer || this._notificationContainer;
        const templateContainer = document.getElementById(this._templateSelectionId);
        this._template =
            options.template || (templateContainer === null || templateContainer === void 0 ? void 0 : templateContainer.innerHTML) || this._template;
        if (!this._notificationContainer || !this._template) {
            throw new Error('Cannot initialize Notifications module without a container element AND a template -- ' +
                'container selector:: ' +
                this._notificationContainerId +
                ' -- templateName:: ' +
                this._templateSelectionId);
        }
        this._initialized = true;
        this._notificationHeight = this._notificationContainer.clientHeight || 0;
        if (templateContainer) {
            templateContainer.remove();
        }
    }
    /**
     * Create a notification.
     * @memberOf Notifications
     * @param {string} text - The text to display.
     * @param {int} [expirationTime] - The time notification will stay on screen from now on until the disappear animation start.
     * @example DE.Notifications.create( "hello world", 1500 );
     */
    create(text, expirationTime = this.defaultExpirationTime) {
        if (!config_1.default.notifications.enable) {
            return null;
        }
        if (!this._initialized) {
            throw new Error('Notifications not initialized');
        }
        if (this._notificationContainer === null) {
            throw new Error('Notifications container not found');
        }
        this._notificationHeight = Math.max(0, this._notificationHeight);
        const id = Date.now() + '-' + ((Math.random() * 100) >> 0);
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = this._notificationClassName;
        notification.innerHTML = this._template;
        notification.getElementsByClassName('content')[0].innerHTML = text;
        notification
            .getElementsByClassName('notifClose')[0]
            .addEventListener('click', () => {
            this.remove(id);
        });
        this._notificationContainer.appendChild(notification);
        this._notifications[id] = notification;
        this._notificationHeight += notification.clientHeight;
        this._notificationContainer.style.height = this._notificationHeight + 'px';
        this.bindRemove(id, expirationTime);
        return {
            id,
            notificationElement: notification,
        };
    }
    /**
     * Bind the remove function
     * @memberOf Notifications
     * @param {string} id - The notification id.
     * @param {int} [time] - The time notification will stay on screen from now on until the disappear animation start.
     */
    bindRemove(id, time) {
        setTimeout(() => {
            this.triggerRemove(id);
        }, time || this.defaultExpirationTime);
    }
    /**
     * Launch animation to remove a notification.
     * @memberOf Notifications
     * @param {string} id - Is the notification to animate
     * @returns {boolean} - True if the notification was found, false if not found.
     */
    triggerRemove(id) {
        if (!this._notifications[id]) {
            return false;
        }
        const notificationElement = this._notifications[id];
        const notificationElementClasses = notificationElement.className.split(' ');
        if (!notificationElementClasses.includes('disappear')) {
            notificationElement.className =
                this._notificationClassName + ' disappear';
        }
        setTimeout(() => {
            this.remove(id);
        }, this.closeAnimationDuration);
        return true;
    }
    /**
     * Remove a notification.
     * @memberOf Notifications
     * @param {string} id - The notification id
     * @returns {boolean} - True if the notification was removed, false if not found.
     */
    remove(id) {
        const notification = this._notifications[id];
        if (!notification) {
            return false;
        }
        const height = notification.offsetHeight;
        this._notificationHeight -= height;
        if (this._notificationContainer !== null) {
            this._notificationContainer.style.height =
                this._notificationHeight + 'px';
            this._notificationContainer.removeChild(notification);
        }
        delete this._notifications[id];
        return true;
    }
}
exports.Notifications = Notifications;
Notifications.DEName = 'Notifications';
const notifications = new Notifications();
exports.default = notifications;
