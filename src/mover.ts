import { MoverState, Mover, Point, MoverType } from "./types";
import { canvas, target } from "./draw";
import { TARGET_RADIUS } from "./target";

const MOVER_TYPE_TO_SPEED = new Map<MoverType, number>([
  [MoverType.SLOW, 0.06],
  [MoverType.MEDIUM, 0.12],
  [MoverType.FAST, 0.17],
]);

export function spawn(): Mover {
  const isHorizontalSpawn = Math.round(Math.random());
  const isFarSpawn = Math.round(Math.random());
  const location = {
    x: isHorizontalSpawn
      ? Math.random() * canvas.width
      : isFarSpawn
      ? canvas.width
      : 0,
    y: isHorizontalSpawn
      ? isFarSpawn
        ? canvas.height
        : 0
      : Math.random() * canvas.height,
  };

  // Allow a possible spread of 0.7 PI.
  const angleJitter = Math.random() * Math.PI * 0.7 - Math.PI * 0.35;
  const startAngle = angle(location, target()) + angleJitter;

  // Enums are weird, it has both the number to string mapping and the string to
  // number mapping, so divide the length by two.
  const typeIndex = Math.floor(
    Math.random() * (Object.keys(MoverType).length / 2)
  );
  const type = typeIndex as MoverType;

  return {
    angle: startAngle,
    speed: MOVER_TYPE_TO_SPEED.get(type) || 0,
    location,
    path: { points: [] },
    state: MoverState.MOVING,
    type,
  };
}

export function distance(a: Point, b: Point) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * Calculates the angle, in radians, from |a| pointing to |b|, with positive X vector as 0.
 * @param a Starting point.
 * @param b Point to face towards.
 * @returns Angle from a to b, in radians. (A full circle is Math.PI * 2.)
 */
function angle(a: Point, b: Point) {
  const dX = b.x - a.x;
  const dY = b.y - a.y;

  return Math.atan2(dX, dY);
}

export function moveMover(mover: Mover, elapsedMs: DOMHighResTimeStamp) {
  if (distance(target(), mover.location) < TARGET_RADIUS) {
    mover.state = MoverState.GOAL;
    return;
  }

  if (
    mover.location.x < 0 ||
    mover.location.x > canvas.width ||
    mover.location.y < 0 ||
    mover.location.y > canvas.height
  ) {
    mover.state = MoverState.OUT_OF_BOUNDS;
    return;
  }

  const path = mover.path;
  let distanceToTravel = mover.speed * elapsedMs;

  if (path && path.points.length) {
    // Travel along path.
    while (path.points.length) {
      const distanceToNextPoint = distance(mover.location, path.points[0]);
      mover.angle = angle(mover.location, path.points[0]);

      if (
        isNaN(mover.location.x) ||
        isNaN(mover.location.y) ||
        isNaN(mover.angle)
      ) {
        debugger;
      }

      // If next point is far away, travel part way to it.
      if (distanceToNextPoint > distanceToTravel) {
        const dX = Math.sin(mover.angle) * distanceToTravel;
        const dY = Math.cos(mover.angle) * distanceToTravel;
        mover.location.x += dX;
        mover.location.y += dY;

        if (
          isNaN(mover.location.x) ||
          isNaN(mover.location.y) ||
          isNaN(mover.angle)
        ) {
          debugger;
        }

        return;
      }

      // Next point is within distance; move to it, remove distance, & loop.
      mover.location = path.points.shift()!;
      distanceToTravel -= distanceToNextPoint;

      if (
        isNaN(mover.location.x) ||
        isNaN(mover.location.y) ||
        isNaN(mover.angle)
      ) {
        debugger;
      }
    }
  }

  // No path; keep moving in current direction.
  const dX = Math.sin(mover.angle) * distanceToTravel;
  const dY = Math.cos(mover.angle) * distanceToTravel;
  mover.location.x += dX;
  mover.location.y += dY;

  if (
    isNaN(mover.location.x) ||
    isNaN(mover.location.y) ||
    isNaN(mover.angle)
  ) {
    debugger;
  }
}
