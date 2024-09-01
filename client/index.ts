

console.log('hi');

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');
context.beginPath();

context.arc(75.0, 75.0, 50.0, 0.0, Math.PI * 2);
context.moveTo(110.0, 75.0);
context.arc(75.0, 75.0, 35.0, 0.0, Math.PI);
context.moveTo(65.0, 65.0);
context.arc(60.0, 65.0, 5.0, 0.0, Math.PI * 2);
context.moveTo(95.0, 65.0);
context.arc(90.0, 65.0, 5.0, 0.0, Math.PI * 2);
context.stroke();
