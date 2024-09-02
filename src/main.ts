import './style.css'

console.log('hi');

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

type Mover = {
    startAngle: number;
    path: Path;
    speed: number;
    location: Point;
    finished: boolean;
}

const movers: Mover[] = [];
for (let i = 0; i < 3; i++) {
    movers.push({
        startAngle: i * Math.PI / 4,
        speed: i * 3,
        location: { x: i * 50, y: i * 50 },
        path: { points: [] },
        finished: false,
    });
}

let currentlySelectedMover: Mover | null = null;
window.addEventListener('mousemove', handleMouseMove);
function handleMouseMove(event: MouseEvent) {
    if (!event.buttons) {
        currentlySelectedMover = null;
        return;
    }

    const mousePoint: Point = { x: event.clientX, y: event.clientY };
    if (!currentlySelectedMover) {
        currentlySelectedMover = findSelectedMover();
        if (!currentlySelectedMover) return;
    }

    if (!currentlySelectedMover.path) {
        currentlySelectedMover.path = { points: [] };
    }

    currentlySelectedMover.path.points.push(mousePoint);

    function findSelectedMover() {
        let closestTouchedMover: Mover | null = null;
        let closestTouchedDistance = Number.MAX_VALUE;
        for (const mover of movers) {
            const moverDist = distance(mousePoint, mover.location);
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
    for (const mover of movers) {
        moveMover(mover);
    }
}

function moveMover(mover: Mover) {
    if (mover.finished) return;

    if (distance(target(), mover.location) < 20) {
        mover.finished = true;
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

function draw() {

    context.beginPath();
    context.fillStyle = "lightblue";
    const { x, y } = target();
    context.arc(x, y, 100, 0, Math.PI * 2);
    context.fill();

    for (const mover of movers) {
        drawFace(mover.location.x, mover.location.y);
        if (mover.path) {
            drawPath(mover.path);
        }
    }
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

    // left eye
    context.moveTo(x - r * 0.2, y - r * 0.2);
    context.arc(x - r * 0.3, y - r * 0.2, r * 0.1, 0.0, Math.PI * 2);

    // right eye
    context.moveTo(x + r * 0.4, y - r * 0.2);
    context.arc(x + r * 0.3, y - r * 0.2, r * 0.1, 0, Math.PI * 2);

    context.stroke();
}