import {Path, Point, Mover, MoverState, MoverType} from './types';
import sharkSrc from './shark.png';

export const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
            color = 'purple';
            break;
        case MoverType.MEDIUM:
            color = 'yellow';
            break;
        case MoverType.FAST:
            color = 'grey';
            break;
      }

    }
    context.fillStyle = color;
    context.strokeStyle = color;

    drawShark(mover);
    if (mover.path) {
        drawPath(mover.path);
    }

}

function drawShark(mover: Mover) {
    context.save();
    context.translate(mover.location.x, mover.location.y);
    context.rotate(-mover.angle + Math.PI / 2);
    context.translate(
        -sharkImg.width / 2, 
        -sharkImg.height / 2);
    context.drawImage(sharkImg, 0, 0);
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
    context.fillStyle = "lightblue";
    const { x, y } = target();
    context.arc(x, y, 50, 0, Math.PI * 2);
    context.fill();
}

export function drawStats(startTime: Date, score: number) {
    context.fillStyle = 'blue';
    context.font = 'bold 48px serif';
    context.fillText(`Time: ${Math.floor((Date.now() - startTime.getTime()) / 1000)}`, canvas.width - 400, 100);
    context.fillText(`Score: ${score}`, canvas.width - 400, 150);
}

export function drawDebug(movers: Mover[]) {
    context.font = 'bold 12px serif';
    let y = 50;
    for (const mover of movers) {
        const text =
`x: ${mover.location.x.toFixed()}
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
