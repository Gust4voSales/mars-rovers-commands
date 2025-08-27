import { Direction, Rover } from "./app/entities/rover";

const rover = new Rover("1", {
  position: { x: 1, y: 2 },
  direction: Direction.NORTH,
});

// LMLMLMLMM - Execute the command sequence
rover.rotate("L");             // L
rover.move();                  // M
rover.rotate("L");             // L
rover.move();                  // M
rover.rotate("L");             // L
rover.move();                  // M
rover.rotate("L");             // L
rover.move();                  // M
rover.move();                  // M

const rover2 = new Rover("2", {
  position: { x: 3, y: 3 },
  direction: Direction.EAST,
});

// MMRMMRMRRM - Execute the command sequence
rover2.move();                  // M
rover2.move();                  // M
rover2.rotate("R");             // R
rover2.move();                  // M
rover2.move();                  // M
rover2.rotate("R");             // R
rover2.move();                  // M
rover2.rotate("R");             // R
rover2.rotate("R");             // R
rover2.move();                  // M

console.log(`Rover ${rover.id} position: ${rover.toString()}`);
console.log(`Rover ${rover2.id} position: ${rover2.toString()}`);