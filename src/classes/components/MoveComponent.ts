import GameObject from '../GameObject';
import SimpleMoveComponent from './SimpleMoveComponent';

export default class MoveComponent extends SimpleMoveComponent {
  constructor(
    public override readonly parent: GameObject,
    pos?: Point2D,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent, pos, duration, callback, selfDestruct);
  }

  override moveTo(
    dest: Point2D,
    duration: number = 500,
    callback = () => {},
    curveName?: string,
    forceLocalPos: boolean = false, // TODO add curveName (not coded)
  ) {
    let pos = this.parent as Point2D;

    if (this.parent.parent != undefined && !forceLocalPos) {
      let parentPos = this.parent.parent.getGlobalPosition();
      dest = { x: dest.x - parentPos.x, y: dest.y - parentPos.y };
    }
    this._moveData = {
      distX: -(pos.x - dest.x),
      distY: -(pos.y - dest.y),
      dirX: pos.x > dest.x ? 1 : -1,
      dirY: pos.y > dest.y ? 1 : -1,
      duration: duration || 500,
      oDuration: duration || 500,
      curveName: curveName || 'linear',
      done: false,
      stepValX: 0,
      stepValY: 0,
      destX: dest.x,
      destY: dest.y,
      callback: callback,
      leftX: 0,
      leftY: 0,
    };

    this._moveData.leftX = this._moveData.distX;
    this._moveData.leftY = this._moveData.distY;

    return this;
  }

  override moveToObject(
    gameObject: GameObject,
    duration: number = 500,
    callback?: () => void,
    curveName?: string,
    forceLocalPos?: boolean, // TODO add curveName (not coded)
  ) {
    let dest = gameObject.getWorldPos();
    // TODO check it stills works as it changed a lot
    if (!forceLocalPos) {
      if (this.parent.parent && this.parent.parent.getWorldPos) {
        let parentPos = this.parent.parent.getWorldPos();
        dest.x = dest.x - parentPos.x;
        dest.y = dest.y - parentPos.y;
      }
    }

    this.moveTo(dest, duration, callback, curveName);
  }
}
