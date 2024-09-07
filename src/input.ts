import { Point } from './types';

export enum InputType {
  Drag,
  DragStop,
}

export type Input = {
  type: InputType;
  location?: Point;
};

export const inputs: Input[] = [];

window.addEventListener('mousemove', handleMouseEvent);
window.addEventListener('mousedown', handleMouseEvent);
  
function handleMouseEvent(event: MouseEvent) {
  event.stopPropagation();
  if (event.buttons) {
    inputs.push({
      type: InputType.Drag,
      location: { x: event.clientX, y: event.clientY },
    });
  } else {
    inputs.push({ type: InputType.DragStop });
  }
};

window.addEventListener('touchend', (event: TouchEvent) => {
  inputs.push({ type: InputType.DragStop });
  event.stopPropagation();
});

window.addEventListener('touchmove', (event: TouchEvent) => {
  inputs.push({
    type: InputType.Drag,
    location: { x: event.touches[0].clientX, y: event.touches[0].clientY },
  });
  event.stopPropagation();
});
