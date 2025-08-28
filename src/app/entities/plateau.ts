import { BaseEntity } from "./base-entity";
import { InvalidInitializationError } from "./errors/invalid-initialization";
import { Rover } from "./rover";
import { Position } from "./types";

interface PlateauProps {
  maxX: number;
  maxY: number;
  rovers: Record<string, Rover>;
}

class Plateau extends BaseEntity<PlateauProps> {
  constructor(id: string, maxX: number, maxY: number) {
    super({ maxX, maxY, rovers: {} }, id);
    this.validatePlateauBoundaries();
  }

  public get maxX(): number {
    return this.props.maxX;
  }

  public get maxY(): number {
    return this.props.maxY;
  }

  public get rovers(): Rover[] {
    return Object.values(this.props.rovers);
  }

  // Add rover to plateau if is a valid position
  public addRover(rover: Rover): void {
    if (!this.isPositionInsidePlateauBoundaries(rover.position)) {
      throw new InvalidInitializationError(
        `Rover ${rover.id} cannot be added - position (${rover.position.x}, ${rover.position.y}) is out of plateau bounds (0, 0) to (${this.maxX}, ${this.maxY})`
      );
    }

    if (this.isPositionOccupiedByRover(rover.position)) {
      throw new InvalidInitializationError(
        `Rover ${rover.id} cannot be added - position (${rover.position.x}, ${rover.position.y}) is already occupied`
      );
    }

    this.props.rovers[rover.id] = rover;
  }

  // Check if the position is occupied by another rover
  public isPositionOccupiedByRover(position: Position, excludeRoverId?: string): boolean {
    return Object.values(this.props.rovers).some(rover =>
      rover.id !== excludeRoverId &&
      rover.position.x === position.x &&
      rover.position.y === position.y
    );
  }

  // Check if the position is inside the plateau boundaries
  public isPositionInsidePlateauBoundaries(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x <= this.maxX &&
      position.y >= 0 &&
      position.y <= this.maxY
    );
  }

  private validatePlateauBoundaries(): void {
    if (!Number.isInteger(this.maxX) || !Number.isInteger(this.maxY)) {
      throw new InvalidInitializationError("Plateau boundaries must be integers");
    }

    if (this.maxX < 0 || this.maxY < 0) {
      throw new InvalidInitializationError("Plateau boundaries must be non-negative");
    }
  }

  public toString(): string {
    return `Plateau ${this.id}: (${this.maxX}, ${this.maxY}) with ${Object.keys(this.props.rovers).length} rovers`;
  }
}

export { Plateau, PlateauProps };
