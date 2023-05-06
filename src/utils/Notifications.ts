import config from '../config';

/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it<br>
 * Don't use margins on "notification" element directly, that's why I use a div inside<br>
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */

export type NotificationOptions = {
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

export type NotificationCreateResult = {
  id: string;
  notificationElement: HTMLDivElement;
};

/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it
 * Do not use margins on notification element directly, that's why I use a div inside
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */
export class Notifications {
  public static readonly DEName: string = 'Notifications';

  private _notificationHeight = 0;

  /**
   * The duration of the notification in milliseconds.
   * (default: 3500)
   * @type {number}
   */
  public defaultExpirationTime = 3500;

  /**
   * The duration of the close animation in milliseconds.
   * (default: 400)
   * @type {number}
   */
  public closeAnimationDuration = 400;

  private _notificationClassName = 'notification';

  private _notificationContainerId = 'notifsContainer';
  private _notificationContainer: Nullable<HTMLElement> = null;

  private _template = '';
  private _templateSelectionId = 'notificationTemplate';

  private _notifications: { [id: string]: HTMLDivElement } = {};

  /**
   * Return true if notifications module are initialized
   * @memberOf Notifications
   * @type {boolean}
   */
  public get initialized(): boolean {
    return this._initialized;
  }
  /**
   * Return true if notifications module are initialized
   * @memberOf Notifications
   * @deprecated Use 'initialized' instead
   * @type {boolean}
   */
  public get inited(): boolean {
    return this._initialized;
  }
  private _initialized = false;

  public init(options: Partial<NotificationOptions> = {}) {
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

    const notificationContainer = document.getElementById(
      this._notificationContainerId,
    );
    this._notificationContainer =
      options.container || notificationContainer || this._notificationContainer;

    const templateContainer = document.getElementById(
      this._templateSelectionId,
    );
    this._template =
      options.template || templateContainer?.innerHTML || this._template;

    if (!this._notificationContainer || !this._template) {
      throw new Error(
        'Cannot initialize Notifications module without a container element AND a template -- ' +
          'container selector:: ' +
          this._notificationContainerId +
          ' -- templateName:: ' +
          this._templateSelectionId,
      );
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
  public create(
    text: string,
    expirationTime = this.defaultExpirationTime,
  ): Nullable<NotificationCreateResult> {
    if (!config.notifications.enable) {
      return null;
    }

    if (!this._initialized) {
      throw new Error('Notifications not initialized');
    }

    if (this._notificationContainer === null) {
      throw new Error('Notifications container not found');
    }

    this._notificationHeight = Math.max(0, this._notificationHeight);

    const id: string = Date.now() + '-' + ((Math.random() * 100) >> 0);
    const notification: HTMLDivElement = document.createElement('div');

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
  public bindRemove(id: string, time?: number) {
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
  public triggerRemove(id: string): boolean {
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
  public remove(id: string): boolean {
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

const notifications = new Notifications();
export default notifications;
