import { MoverState, Mover, Point, MoverType } from "./types";
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

    // Enums are weird, it has both the number to string mapping and the string to
    // number mapping, so divide the length by two.
    const typeIndex = Math.floor(Math.random() * (Object.keys(MoverType).length / 2));
    const type = typeIndex as MoverType;

    return {
        startAngle:
            positionFromCenterAngle + Math.PI + (Math.random() * Math.PI) / 20,
        speed: Math.random(),
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
  let distanceToTravel = mover.speed * speedMultiplier * elapsedMs;

  if (path && path.points.length) {
    // Travel along path.
    while (path.points.length) {
      const distanceToNextPoint = distance(mover.location, path.points[0]);
      mover.startAngle = angle(mover.location, path.points[0]);

      if (
        isNaN(mover.location.x) ||
        isNaN(mover.location.y) ||
        isNaN(mover.startAngle)
      ) {
        debugger;
      }

      // If next point is far away, travel part way to it.
      if (distanceToNextPoint > distanceToTravel) {
        const dX = Math.sin(mover.startAngle) * distanceToTravel;
        const dY = Math.cos(mover.startAngle) * distanceToTravel;
        mover.location.x += dX;
        mover.location.y += dY;

        if (
          isNaN(mover.location.x) ||
          isNaN(mover.location.y) ||
          isNaN(mover.startAngle)
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
        isNaN(mover.startAngle)
      ) {
        debugger;
      }
    }
  }

  // No path; keep moving in current direction.
  const dX = Math.sin(mover.startAngle) * distanceToTravel;
  const dY = Math.cos(mover.startAngle) * distanceToTravel;
  mover.location.x += dX;
  mover.location.y += dY;

  if (
    isNaN(mover.location.x) ||
    isNaN(mover.location.y) ||
    isNaN(mover.startAngle)
  ) {
    debugger;
  }
}
