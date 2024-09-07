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
