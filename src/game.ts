import {canvas, context, drawTarget, drawStats, drawMoverFaceAndPath} from './draw';
import {Point, Mover, MoverState} from './types';
import {spawn, moveMover, distance} from './mover';

let score = 0;

const startTime = new Date();

const movers: Mover[] = [];
for (let i = 0; i < 3; i++) {
    movers.push(spawn());
}

let lastFrameMs: DOMHighResTimeStamp = 0;
export function runGame() {
    requestAnimationFrame(loop);
}

function loop(timestampMs: DOMHighResTimeStamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    move(timestampMs - lastFrameMs);

    lastFrameMs = timestampMs;
    requestAnimationFrame(loop);
}

function move(elapsedMs: DOMHighResTimeStamp) {
    for (let i = movers.length - 1; i >= 0; i--) {
        moveMover(movers[i], elapsedMs);

        switch (movers[i].state) {
            case MoverState.GOAL:
                movers.splice(i, 1);
                movers.push(spawn());
                score++;
                break;
            case MoverState.OUT_OF_BOUNDS:
                movers.splice(i, 1);
                movers.push(spawn());
                score--;
                break;
        }
    }
}


function draw() {
    drawTarget();
    movers.map(drawMoverFaceAndPath);
    drawStats(startTime, score);
}


let currentlySelectedMover: Mover | null = null;

window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', event => {
    currentlySelectedMover = null;
    event.stopPropagation();
    return;
});

function handleTouchMove(event: TouchEvent) {
    handleInteraction({ x: event.touches[0].clientX, y: event.touches[0].clientY });
    event.stopPropagation();
}

function handleMouseMove(event: MouseEvent) {
    event.stopPropagation();
    if (!event.buttons) {
        currentlySelectedMover = null;
        return;
    }

    handleInteraction({ x: event.clientX, y: event.clientY });
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

    currentlySelectedMover.path.points.push(point);

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

    // path.points.push({ x: ev.clientX, y: ev.clientY });
}
