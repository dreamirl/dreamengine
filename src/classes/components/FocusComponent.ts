import AdvancedContainer from '../AdvancedContainer';
import Component from '../Component';
import GameObject from '../GameObject';

export default class FocusComponent extends Component {
  target: GameObject;
  private _focusOptions: any;
  private _focusOffsets: any;
  protected override _name = 'FocusComponent';

  constructor(parent: AdvancedContainer, target?: GameObject) {
    super(parent);

    this.target = target!;
  }

  override update(time: number) {
    if (!this.target) {
      return;
    }

    let pos = this.target as Point2D;
    if (this.target.getWorldPos) {
      pos = this.target.getWorldPos();
    }

    let parentPos = this.parent;
    // TODO: to fix (to finish)
    // if (this.parent.getWorldPos) {
    //   parentPos = this.parent.getWorldPos();
    // } else {
    //   parentPos = this.parent;
    // }

    if (this._focusOptions.x) {
      this.parent.x = pos.x + (this._focusOffsets.x || 0) - parentPos.x;
    }
    if (this._focusOptions.y) {
      this.parent.y = pos.y + (this._focusOffsets.y || 0) - parentPos.y;
    }
    if (this._focusOptions.rotation) {
      this.parent.rotation = this.target.rotation;
    }
  }

  /**
   * give a target to this gameObject, then it will focus it until you changed or removed it
   * you can lock independent axes, and set offsets
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject is the target to focus on
   * @param {Object} [params] optional parameters, set offsets or lock
   * @example // create a fx for your ship, decal a little on left, and lock y
   * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
   */
  focus(target: GameObject, params: any = {}) {
    this.target = target;
    this._focusOptions = Object.assign(
      {
        x: true,
        y: true,
        rotation: false,
      },
      params.options,
    );

    // focus default x/y
    this._focusOptions.x = this._focusOptions.x !== false ? true : false;
    this._focusOptions.y = this._focusOptions.y !== false ? true : false;

    this._focusOffsets = Object.assign(
      { x: 0, y: 0 },
      params.offsets || params.offset,
    );

    return this;
  }
}
