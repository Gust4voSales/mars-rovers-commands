import { Position } from "./types";
import { BaseEntity } from "./base-entity";
import { Plateau } from "./plateau";
import { InvalidCommandError } from "./errors/invalid-command";
import { InvalidInitializationError } from "./errors/invalid-initialization";

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
    this.validateRoverInitialPosition();
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

  // Get the next position (simulation) of the rover based on the current direction
  public getNextPositionSimulation(): Position {
    const nextPosition = { ...this.position };

    switch (this.direction) {
      case Direction.NORTH:
        nextPosition.y += 1;
        break;
      case Direction.EAST:
        nextPosition.x += 1;
        break;
      case Direction.SOUTH:
        nextPosition.y -= 1;
        break;
      case Direction.WEST:
        nextPosition.x -= 1;
        break;
    }

    return nextPosition;
  }

  public move(plateau?: Plateau): void {
    const nextPosition = this.getNextPositionSimulation();

    // If plateau is provided, validate the next position
    if (plateau) {
      if (!plateau.isPositionInsidePlateauBoundaries(nextPosition)) {
        throw new InvalidCommandError(
          `Rover ${this.id} cannot move to position (${nextPosition.x}, ${nextPosition.y}) - out of plateau bounds (0, 0) to (${plateau.maxX}, ${plateau.maxY})`
        );
      }

      if (plateau.isPositionOccupiedByRover(nextPosition, this.id)) {
        throw new InvalidCommandError(
          `Rover ${this.id} cannot move to position (${nextPosition.x}, ${nextPosition.y}) - position is occupied by another rover`
        );
      }
    }

    this.props.position = nextPosition;
  }

  private validateRoverInitialPosition(): void {
    if (!Number.isInteger(this.position.x) || !Number.isInteger(this.position.y)) {
      throw new InvalidInitializationError("Rover initial position must be integers");
    }

    if (this.position.x < 0 || this.position.y < 0) {
      throw new InvalidInitializationError("Rover initial position must be non-negative");
    }
  }

  public toString(): string {
    return `${this.position.x} ${this.position.y} ${this.direction}`;
  }
}

export { Rover, Direction }