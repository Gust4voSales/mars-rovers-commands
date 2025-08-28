import { describe, it, expect, beforeEach } from "vitest";
import { PlateauRoversParserUseCase } from "./plateau-rovers-parser-use-case";
import { ParserError } from "./errors/parser-error";
import { Direction } from "../entities/rover";

describe("PlateauRoversParserUseCase", () => {
  let parser: PlateauRoversParserUseCase;

  beforeEach(() => {
    parser = new PlateauRoversParserUseCase();
  });

  describe("successful parsing scenarios", () => {
    it("should parse multiple rovers with valid input", () => {
      const input = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;

      const result = parser.parse(input);

      expect(result.plateau.maxX).toBe(5);
      expect(result.plateau.maxY).toBe(5);
      expect(result.plateau.rovers).toHaveLength(2);

      const rover1 = result.plateau.rovers[0];
      expect(rover1.position.x).toBe(1);
      expect(rover1.position.y).toBe(3);
      expect(rover1.direction).toBe(Direction.NORTH);

      const rover2 = result.plateau.rovers[1];
      expect(rover2.position.x).toBe(5);
      expect(rover2.position.y).toBe(1);
      expect(rover2.direction).toBe(Direction.EAST);
    });

    it("should handle rovers with only rotation commands", () => {
      const input = `2 2
1 1 N
LLLL
1 0 E
RRRR`;

      const result = parser.parse(input);

      expect(result.plateau.rovers).toHaveLength(2);

      expect(result.plateau.rovers[0].position).toEqual({ x: 1, y: 1 });
      expect(result.plateau.rovers[0].direction).toBe(Direction.NORTH);

      expect(result.plateau.rovers[1].position).toEqual({ x: 1, y: 0 });
      expect(result.plateau.rovers[1].direction).toBe(Direction.EAST);
    });
  });

  describe("plateau parsing", () => {
    it("should throw ParserError for empty plateau line", () => {
      const input = `
1 1 N
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Plateau boundary must contain exactly two numbers");
    });

    it("should throw ParserError for plateau line with only whitespace", () => {
      const input = `   
1 1 N
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Plateau boundary must contain exactly two numbers");
    });

    it("should throw ParserError for plateau with non-numeric values", () => {
      const input = `5 A
1 1 N
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Plateau boundary must contain valid numbers");
    });
  });

  describe("rover position parsing", () => {
    it("should throw ParserError for empty rover position line", () => {
      const input = `5 5

M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 position line is mandatory and cannot be empty");
    });

    it("should throw ParserError for rover position with missing values", () => {
      const input = `5 5
1 2
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 position must contain exactly three values (x y direction)");
    });

    it("should throw ParserError for rover position with too many values", () => {
      const input = `5 5
1 2 N E
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 position must contain exactly three values (x y direction)");
    });

    it("should throw ParserError for rover with non-numeric coordinates", () => {
      const input = `5 5
A 2 N
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 coordinates must be valid numbers");
    });

    it("should throw ParserError for rover with invalid direction", () => {
      const input = `5 5
1 2 X
M`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 direction must be one of: N, E, S, W");
    });
  });

  describe("rover command parsing", () => {
    it("should throw ParserError for empty commands line", () => {
      const input = `5 5
1 2 N
`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 commands line is mandatory and cannot be empty");
    });

    it("should throw ParserError for invalid command", () => {
      const input = `5 5
1 2 N
LMXR`;

      expect(() => parser.parse(input)).toThrow(ParserError);
      expect(() => parser.parse(input)).toThrow("Rover 1 has invalid command 'X'. Valid commands are: L, R, M");
    });
  });

  describe("error handling and line numbers", () => {
    it("should report correct line number for plateau parsing error", () => {
      const input = `invalid plateau
1 2 N
M`;

      try {
        parser.parse(input);
        expect.fail("Should have thrown ParserError");
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        expect((error as ParserError).lineNumber).toBe(1);
      }
    });

    it("should report correct line number for rover position error", () => {
      const input = `5 5
1 2 N
M
invalid second rover
M`;

      try {
        parser.parse(input);
        expect.fail("Should have thrown ParserError");
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        expect((error as ParserError).lineNumber).toBe(4);
      }
    });
  });

  describe("complex integration scenarios", () => {
    it("should handle complex multi-rover scenario", () => {
      const input = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;

      const result = parser.parse(input);

      expect(result.plateau.rovers).toHaveLength(2);

      // First rover final position
      expect(result.plateau.rovers[0].position).toEqual({ x: 1, y: 3 });
      expect(result.plateau.rovers[0].direction).toBe(Direction.NORTH);

      // Second rover final position
      expect(result.plateau.rovers[1].position).toEqual({ x: 5, y: 1 });
      expect(result.plateau.rovers[1].direction).toBe(Direction.EAST);
    });
  });
});
