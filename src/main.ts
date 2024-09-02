import './style.css'

const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d')!;

type Point = {
    x: number;
    y: number;
}

type Path = {
    points: Point[];
}

enum MoverState {
    MOVING,
    GOAL,
    OUT_OF_BOUNDS,
}

type Mover = {
    startAngle: number;
    path: Path;
    speed: number;
    location: Point;
    state: MoverState;
}

const movers: Mover[] = [];
for (let i = 0; i < 3; i++) {
    spawn();
}

function spawn() {
    const positionFromCenterAngle = Math.random() * Math.PI * 2;
    const location = {
        x: Math.sin(positionFromCenterAngle) * canvas.width / 2 + canvas.width / 2,
        y: Math.cos(positionFromCenterAngle) * canvas.width / 2 + canvas.height / 2,
    };

    movers.push({
        startAngle: positionFromCenterAngle + Math.PI + Math.random() * Math.PI/20,
        speed: Math.random() * 10,
        location,
        path: { points: [] },
        state: MoverState.MOVING,
    });
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

function distance(a: Point, b: Point) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

setInterval(loop, 50);
function loop() {
    move();
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function move() {
    for (let i = movers.length - 1; i >= 0; i--) {
        moveMover(movers[i]);

        switch (movers[i].state) {
            case MoverState.GOAL:
                movers.splice(i, 1);
                spawn();
                score++;
                break;
            case MoverState.OUT_OF_BOUNDS:
                movers.splice(i, 1);
                spawn();
                score--;
                break;
        }
    }
}

let score = 0;
function moveMover(mover: Mover) {
    if (distance(target(), mover.location) < 20) {
        mover.state = MoverState.GOAL;
        return;
    }

    if (distance(target(), mover.location) > canvas.width / 2) {
        mover.state = MoverState.OUT_OF_BOUNDS;
        return;
    }

    const path = mover.path;
    if (!path || path.points.length == 0) {
        const dX = Math.sin(mover.startAngle) * mover.speed;
        const dY = Math.cos(mover.startAngle) * mover.speed;
        mover.location.x += dX;
        mover.location.y += dY;
        return;
    };

    if (distance(mover.location, path.points[0]) < 10) {
        path.points.shift();
    }

    if (path.points.length == 0) return;

    const dX = path.points[0].x - mover.location.x;
    const dY = path.points[0].y - mover.location.y;

    mover.location.x += Math.sign(dX) * Math.min(5, Math.abs(dX));
    mover.location.y += Math.sign(dY) * Math.min(5, Math.abs(dY));
}

function target(): Point {
    return { x: canvas.width / 2, y: canvas.height / 2 };
}

const startTime = new Date();
function draw() {

    context.beginPath();
    context.fillStyle = "lightblue";
    const { x, y } = target();
    context.arc(x, y, 50, 0, Math.PI * 2);
    context.fill();

    for (const mover of movers) {
        drawFace(mover.location.x, mover.location.y);
        if (mover.path) {
            drawPath(mover.path);
        }
    }

    context.font = 'bold 48px serif';
    context.fillText(`Time: ${Math.floor((Date.now() - startTime.getTime()) / 1000)}`, canvas.width - 400, 100);
    context.fillText(`Score: ${score}`, canvas.width - 400, 150);
}

function drawPath(path: Path) {
    context.beginPath();

    let pathX: number;
    let pathY: number;
    for ({ x: pathX, y: pathY } of path.points) {
        context.arc(pathX, pathY, 2, 0, Math.PI * 2);
    }

    context.stroke();
}

function drawFace(x: number, y: number, r: number = 50) {
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