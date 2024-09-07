import {Path, Point} from './types';

export const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const context = canvas.getContext('2d')!;

export function target(): Point {
    return { x: canvas.width / 2, y: canvas.height / 2 };
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
    context.fillStyle = 'black';
    context.beginPath();
    context.moveTo(x - r * 0.2, y - r * 0.2);
    context.arc(x - r * 0.3, y - r * 0.2, r * 0.1, 0.0, Math.PI * 2);

    // right eye
    context.moveTo(x + r * 0.4, y - r * 0.2);
    context.arc(x + r * 0.3, y - r * 0.2, r * 0.1, 0, Math.PI * 2);
    context.fill();

}