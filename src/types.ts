export type Point = {
  x: number;
  y: number;
};

export type Path = {
  points: Point[];
};

export enum MoverType {
  SLOW,
  MEDIUM,
  FAST,
}

export enum MoverState {
  MOVING,
  GOAL,
  GOAL_ANIMATION_FINISHED,
  OUT_OF_BOUNDS,
  COLLIDED,
}

export type Mover = {
  angle: number;
  path: Path;
  speed: number;
  location: Point;
  state: MoverState;
  type: MoverType;
  size: number;
};

export type Button = {
  location: Point,
  text: string,
  size: [number, number],
  handler: () => void
}

export enum InputType {
  // Includes clicks.
  Drag,
  DragStop,
}

export type Input = {
  type: InputType;
  location?: Point;
};

export enum GameState {
  RUNNING,
  GAME_OVER,
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
export const DEBUG_MODE = urlParams.has('debug');