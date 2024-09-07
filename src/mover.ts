import { MoverState, Mover, Point, MoverType} from "./types";
import { canvas, target } from "./draw";

export function spawn(): Mover {
  const positionFromCenterAngle = Math.random() * Math.PI * 2;
  const location = {
    x:
      (Math.sin(positionFromCenterAngle) * canvas.width) / 2 + canvas.width / 2,
    y:
      (Math.cos(positionFromCenterAngle) * canvas.width) / 2 +
      canvas.height / 2,
  };

  const typeIndex = Math.floor(Math.random() * Object.values(MoverType).length);

  return {
    startAngle:
      positionFromCenterAngle + Math.PI + (Math.random() * Math.PI) / 20,
    speed: Math.random(),
    location,
    path: { points: [] },
    state: MoverState.MOVING,
    type: Object.values(MoverType)[typeIndex] as MoverType,
  };
}

export function distance(a: Point, b: Point) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

const speedMultiplier = 0.2;
export function moveMover(mover: Mover, elapsedMs: DOMHighResTimeStamp) {
  if (distance(target(), mover.location) < 20) {
    mover.state = MoverState.GOAL;
    return;
  }

  if (distance(target(), mover.location) > canvas.width / 2) {
    mover.state = MoverState.OUT_OF_BOUNDS;
    return;
  }

  const path = mover.path;
  const speed = mover.speed * speedMultiplier * elapsedMs;
  if (!path || path.points.length == 0) {
    const dX = Math.sin(mover.startAngle) * speed;
    const dY = Math.cos(mover.startAngle) * speed;
    mover.location.x += dX;
    mover.location.y += dY;
    return;
  }

  if (distance(mover.location, path.points[0]) < 10) {
    path.points.shift();
  }

  if (path.points.length == 0) return;

  const dX = path.points[0].x - mover.location.x;
  const dY = path.points[0].y - mover.location.y;

  mover.location.x += Math.sign(dX) * Math.min(speed, Math.abs(dX));
  mover.location.y += Math.sign(dY) * Math.min(speed, Math.abs(dY));
}
