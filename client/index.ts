

console.log('hi');

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');

type Point = {
    x: number;
    y: number;
}

type Path = {
    points: Point[];
}

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let r = 50;
let rSq = 1;

const path: Path = { points: [] };
window.addEventListener('mousemove', ev => {
    if (ev.buttons) {
        path.points.push({ x: ev.clientX, y: ev.clientY });
    }
});

setInterval(loop, 50);
function loop() {
    move();
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    // if (r === 50) {
    //     rSq = -1;
    // }
    // if (r === 10) {
    //     rSq = 1;
    // }
    // r += rSq;
}

function move() {
    if (path.points.length == 0) return;

    if (Math.abs(x - path.points[0].x) < 10
     && Math.abs(y - path.points[0].y) < 10) {
        path.points.shift();
    }

    if (path.points.length == 0) return;

    const dX = path.points[0].x - x;
    const dY = path.points[0].y - y;

    x += Math.sign(dX) * Math.min(5, Math.abs(dX));
    y += Math.sign(dY) * Math.min(5, Math.abs(dY));
}

function draw() {
    drawFace(x, y, r);
    drawPath();
}

function drawPath() {
    context.beginPath();

    let pathX: number;
    let pathY: number;
    for ({ x: pathX, y: pathY } of path.points) {
        context.arc(pathX, pathY, 2, 0, Math.PI * 2);
    }

    context.stroke();
}

function drawFace(x: number, y: number, r: number) {
    context.beginPath();
    // r = 50;
    // outside circle head
    // 75, 75, 50
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
