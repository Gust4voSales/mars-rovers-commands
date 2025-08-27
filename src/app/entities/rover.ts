import { Position } from "./types";
import { BaseEntity } from "./base-entity";

enum Direction {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W",
}

interface RoverProps {
  position: Position;
  direction: Direction;
}

// Map of rotation of the rover 90 degrees to the left based on the current direction
const ROTATION_LEFT_MAP: Record<Direction, Direction> = {
  [Direction.NORTH]: Direction.WEST,
  [Direction.WEST]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.EAST,
  [Direction.EAST]: Direction.NORTH,
}

// Map of rotation of the rover 90 degrees to the right based on the current direction
const ROTATION_RIGHT_MAP: Record<Direction, Direction> = {
  [Direction.NORTH]: Direction.EAST,
  [Direction.EAST]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.WEST,
  [Direction.WEST]: Direction.NORTH,
}

class Rover extends BaseEntity<RoverProps> {
  constructor(id: string, props: RoverProps) {
    super(props, id);
  }

  public get position(): Position {
    return this.props.position;
  }

  public get direction(): Direction {
    return this.props.direction;
  }

  public rotate(rotation: "L" | "R"): void {
    if (rotation === "L") {
      this.props.direction = ROTATION_LEFT_MAP[this.direction];
    } else if (rotation === "R") {
      this.props.direction = ROTATION_RIGHT_MAP[this.direction];
    }
  }

  public move(): void {
    switch (this.direction) {
      case Direction.NORTH:
        this.position.y += 1;
        break;
      case Direction.EAST:
        this.position.x += 1;
        break;
      case Direction.SOUTH:
        this.position.y -= 1;
        break;
      case Direction.WEST:
        this.position.x -= 1;
        break;
    }
  }

  public toString(): string {
    return `${this.position.x} ${this.position.y} ${this.direction}`;
  }
}

export { Rover, Direction }