import {
  canvas,
  context,
  drawTarget,
  drawStats,
  drawDebug,
  drawMoverFaceAndPath,
  drawButtons,
} from './draw';
import { Point, Mover, MoverState, Button, InputType } from './types';
import { spawn, moveMover, distance } from './mover';
import { inputs } from './input';

const COLLISION_DISTANCE = 30;
const buttons: Button[] = [
  {
    location: { x: 100, y: 100 },
    size: [150, 75],
    text: 'Reset',
    handler: () => resetGame(),
  },
];

let score = 0;
let startTime = new Date();
let lastFrameMs: DOMHighResTimeStamp = 0;
let movers: Mover[] = [];
let requestAnimationFrameId = 0;

export function runGame() {
  score = 0;
  startTime = new Date();
  lastFrameMs = 0;
  movers = [];

  for (let i = 0; i < 3; i++) {
    movers.push(cleanSpawn());
  }

  requestAnimationFrameId = requestAnimationFrame(loop);
}

function resetGame() {
  cancelAnimationFrame(requestAnimationFrameId);
  runGame();
}

function loop(timestampMs: DOMHighResTimeStamp) {
  handleInputs();
  context.clearRect(0, 0, canvas.width, canvas.height);
  move(timestampMs - lastFrameMs);
  if (!handleCollision()) {
    lastFrameMs = timestampMs;
    requestAnimationFrameId = requestAnimationFrame(loop);
  }
  draw();
}

/**
 * Modifies the first pair of colliding movers to reflect a collision.
 * @returns true if there is a collision
 */
function handleCollision(): boolean {
  for (let i = 0; i < movers.length; i++) {
    for (let j = 1; j < movers.length; j++) {
      if (
        i === j ||
        movers[i].state !== MoverState.MOVING ||
        movers[j].state !== MoverState.MOVING
      )
        break;
      if (
        distance(movers[i].location, movers[j].location) < COLLISION_DISTANCE
      ) {
        movers[i].state = MoverState.COLLIDED;
        movers[j].state = MoverState.COLLIDED;
        return true;
      }
    }
  }
  return false;
}

function cleanSpawn(): Mover {
  let candidateMover = spawn();
  while (possibleCollision(candidateMover)) {
    candidateMover = spawn();
  }
  return candidateMover;
}

function possibleCollision(mover: Mover): boolean {
  for (let i = 0; i < movers.length; i++) {
    if (
      distance(movers[i].location, mover.location) <
      // Give some buffer so things don't collide too soon.
      COLLISION_DISTANCE * 5
    ) {
      return true;
    }
  }
  return false;
}

function move(elapsedMs: DOMHighResTimeStamp) {
  for (let i = movers.length - 1; i >= 0; i--) {
    moveMover(movers[i], elapsedMs);

    switch (movers[i].state) {
      case MoverState.GOAL_ANIMATION_FINISHED:
        movers.splice(i, 1);
        movers.push(cleanSpawn());
        score++;
        break;
      case MoverState.OUT_OF_BOUNDS:
        movers.splice(i, 1);
        movers.push(cleanSpawn());
        score--;
        break;
    }
  }
}

function draw() {
  drawTarget();
  movers.map(drawMoverFaceAndPath);
  drawStats(startTime, score);
  drawButtons(buttons);
}

let currentlySelectedMover: Mover | null = null;
function handleInputs() {
  while (inputs.length) {
    const input = inputs.shift();
    switch (input?.type) {
      case InputType.Drag:
        // Check for button click
        const button = getButtonForPoint(input.location!);
        if (button && !currentlySelectedMover) {
          button.handler();
          break;
        }

        handleInteraction(input.location!);
        break;
      case InputType.DragStop:
        currentlySelectedMover = null;
        break;
    }
  }
}

function getButtonForPoint(point: Point): Button | null {
  for (const button of buttons) {
    if (
      point.x >= button.location.x - button.size[0] / 2 &&
      point.y >= button.location.y - button.size[1] / 2 &&
      point.x < button.location.x + button.size[0] / 2 &&
      point.y < button.location.y + button.size[1] / 2
    ) {
      return button;
    }
  }

  return null;
}

function handleInteraction(point: Point) {
  if (!currentlySelectedMover) {
    currentlySelectedMover = findSelectedMover();
    if (!currentlySelectedMover) return;
    currentlySelectedMover.path.points = [];
  }

  if (!currentlySelectedMover.path) {
    currentlySelectedMover.path = { points: [] };
  }

  if (currentlySelectedMover.path.points.length) {
    // Only take point if a certain distance away to avoid dense lines.
    if (
      distance(
        point,
        currentlySelectedMover.path.points[
          currentlySelectedMover.path.points.length - 1
        ]
      ) > 20
    ) {
      currentlySelectedMover.path.points.push(point);
    }
  } else {
    currentlySelectedMover.path.points.push(point);
  }

  function findSelectedMover() {
    let closestTouchedMover: Mover | null = null;
    let closestTouchedDistance = Number.MAX_VALUE;
    for (const mover of movers) {
      const moverDist = distance(point, mover.location);
      if (moverDist < 50 && moverDist < closestTouchedDistance) {
        closestTouchedMover = mover;
        closestTouchedDistance = moverDist;
      }
    }
    return closestTouchedMover;
  }
}
