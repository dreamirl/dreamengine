import GameObject from '../GameObject';
import SimpleMoveComponent from './SimpleMoveComponent';

export default class MoveComponent extends SimpleMoveComponent {
  constructor(
    public override readonly parent: GameObject,
    origin?: Point2D,
    pos?: Point2D,
    duration?: number,
    callback?: () => void,
    selfDestruct = true,
  ) {
    super(parent, origin, pos, duration, callback, selfDestruct);
  }

  override moveToObject(
    gameObject: GameObject,
    duration: number = 500,
    callback?: () => void,
    curveName?: string,
    forceLocalPos?: boolean, // TODO add curveName (not coded)
  ) {
    let dest = gameObject.getWorldPos();

    let myPos = this.parent as Point2D;
    // TODO check it stills works as it changed a lot
    if (!forceLocalPos) {
      myPos = this.parent.getWorldPos();

      if (this.parent.parent && this.parent.parent.getWorldPos) {
        let parentPos = this.parent.parent.getWorldPos();
        dest.x = dest.x - parentPos.x;
        dest.y = dest.y - parentPos.y;
      }
    }

    this.moveTo(myPos, dest, duration, callback, curveName);
  }
}
