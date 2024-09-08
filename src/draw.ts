import {
  Path,
  Point,
  Mover,
  MoverState,
  MoverType,
  Button,
  DEBUG_MODE,
} from './types';
import sharkSrc from './shark.png';
import raySrc from './ray.png';
import turtleSrc from './turtle.png';
import { TARGET_RADIUS } from './target';

export const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (DEBUG_MODE) {
  window.console.log(`canvas width: ${canvas.width}, height: ${canvas.height}`);
}

export const context = canvas.getContext('2d')!;

export function target(): Point {
  return { x: canvas.width / 2, y: canvas.height / 2 };
}

export function drawMoverFaceAndPath(mover: Mover) {
  let color = 'green';
  if (mover.state === MoverState.COLLIDED) {
    color = 'red';
  } else {
    // Color based on type
    switch (mover.type) {
      case MoverType.SLOW:
        color = 'green';
        break;
      case MoverType.MEDIUM:
        color = 'maroon';
        break;
      case MoverType.FAST:
        color = 'grey';
        break;
    }
  }
  context.fillStyle = color;
  context.strokeStyle = color;

  drawImage(mover);
  if (mover.path) {
    drawPath(mover.path);
  }
}

function getImage(type: MoverType) {
  switch (type) {
    case MoverType.SLOW:
      return turtleImg;
    case MoverType.MEDIUM:
      return rayImg;
    case MoverType.FAST:
      return sharkImg;
    default:
      return sharkImg;
  }
}

function drawImage(mover: Mover) {
  context.save();
  context.translate(mover.location.x, mover.location.y);
  context.rotate(-mover.angle + Math.PI / 2);
  const image = getImage(mover.type);
  const xSize = mover.size * image.width;
  const ySize = mover.size * image.height;
  context.translate(-xSize / 2, -ySize / 2);
  context.drawImage(image, 0, 0, xSize, ySize);
  context.restore();
}

export function drawPath(path: Path) {
  context.beginPath();

  let pathX: number;
  let pathY: number;
  for ({ x: pathX, y: pathY } of path.points) {
    context.arc(pathX, pathY, 2, 0, Math.PI * 2);
  }

  context.stroke();
}

export function drawFace(x: number, y: number, r: number = 50) {
  context.beginPath();
  // outside circle head
  context.arc(x, y, r, 0.0, Math.PI * 2);

  // mouth
  context.moveTo(x + 0.7 * r, y);
  context.arc(x, y, r * 0.7, 0.0, Math.PI);
  context.stroke();

  // left eye
  context.beginPath();
  context.moveTo(x - r * 0.2, y - r * 0.2);
  context.arc(x - r * 0.3, y - r * 0.2, r * 0.1, 0.0, Math.PI * 2);

  // right eye
  context.moveTo(x + r * 0.4, y - r * 0.2);
  context.arc(x + r * 0.3, y - r * 0.2, r * 0.1, 0, Math.PI * 2);
  context.fill();
}

export function drawTarget() {
  context.beginPath();
  context.fillStyle = 'lightblue';
  const { x, y } = target();
  context.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
  context.fill();
}

export function drawStats(startTime: Date, score: number) {
  context.fillStyle = 'blue';
  context.font = 'bold 48px serif';
  context.fillText(
    `Time: ${Math.floor((Date.now() - startTime.getTime()) / 1000)}`,
    canvas.width - 400,
    100
  );
  context.fillText(`Score: ${score}`, canvas.width - 400, 150);
}

export function drawDebug(movers: Mover[]) {
  context.font = 'bold 12px serif';
  let y = 50;
  for (const mover of movers) {
    const text = `x: ${mover.location.x.toFixed()}
y: ${mover.location.y.toFixed()}
speed: ${mover.speed}
angle: ${mover.angle}`;
    for (const line of text.split('\n')) {
      context.fillText(line, 50, y);
      y += 25;
    }
    y += 25;
  }
}

const sharkImg = new Image();
sharkImg.src = sharkSrc;

const rayImg = new Image();
rayImg.src = raySrc;

const turtleImg = new Image();
turtleImg.src = turtleSrc;

export function drawButtons(buttons: Button[]) {
  for (const button of buttons) {
    context.fillStyle = 'lightred';
    context.fillRect(
      button.location.x - button.size[0] / 2,
      button.location.y - button.size[1] / 2,
      button.size[0],
      button.size[1]
    );

    context.fillStyle = 'white';
    context.font = 'bold 32px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(button.text, button.location.x, button.location.y);
  }
}
