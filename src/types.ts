export type Point = {
    x: number;
    y: number;
}

export type Path = {
    points: Point[];
}

export enum MoverState {
    MOVING,
    GOAL,
    OUT_OF_BOUNDS,
}


export type Mover = {
    startAngle: number;
    path: Path;
    speed: number;
    location: Point;
    state: MoverState;
}
