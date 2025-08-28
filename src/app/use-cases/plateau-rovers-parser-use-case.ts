import { Rover, Direction } from "../entities/rover";
import { Plateau } from "../entities/plateau";
import { ParserError } from "./errors/parser-error";

interface Output {
  plateau: Plateau;
}

const VALID_COMMANDS = ["L", "R", "M"] as const;
type Command = typeof VALID_COMMANDS[number];

class PlateauRoversParserUseCase {
  private plateau: Plateau | null = null;
  private currentLine: number = 0;

  public parse(input: string): Output {
    const lines = input.trim().split("\n").map(l => l.trim());
    this.currentLine = 0;

    // Parse plateau (first line)
    this.plateau = this.parsePlateau(lines[this.currentLine++]);

    // Every rover has 2 lines: position + commands (loop through every 2 lines)
    for (let i = 1; i < lines.length; i += 2) {
      this.currentLine++;
      const rover = this.parseRover(lines[i], this.plateau.rovers.length + 1);
      this.currentLine++;
      const commands = this.parseRoverCommands(lines[i + 1], this.plateau.rovers.length + 1);

      this.plateau.addRover(rover);

      const commandsMap: Record<Command, () => void> = {
        "L": () => rover.rotate("L"),
        "R": () => rover.rotate("R"),
        "M": () => rover.move(this.plateau!)
      }

      // Execute commands
      for (const command of commands) {
        commandsMap[command]();
      }
    }

    return { plateau: this.plateau };
  }

  // --------------------------------
  // PARSERS METHODS
  // Parses a line into a known entity
  // --------------------------------

  private validateEmptyLine(line: string, prefix: string): void {
    if (!line || line.trim() === "") {
      throw new ParserError(`${prefix} line is mandatory and cannot be empty`, this.currentLine)
    }
  }

  private parsePlateau(plateauLine: string): Plateau {
    this.validateEmptyLine(plateauLine, "Plateau");

    const parts = plateauLine.trim().split(/\s+/);

    if (parts.length !== 2) {
      throw new ParserError("Plateau boundary must contain exactly two numbers", this.currentLine)
    }

    const maxX = Number(parts[0]);
    const maxY = Number(parts[1]);

    if (isNaN(maxX) || isNaN(maxY)) {
      throw new ParserError("Plateau boundary must contain valid numbers", this.currentLine)
    }

    return new Plateau("1", maxX, maxY);
  }

  private parseRover(roverLine: string, index: number): Rover {
    this.validateEmptyLine(roverLine, `Rover ${index} position`);

    const parts = roverLine.trim().split(/\s+/);

    if (parts.length !== 3) {
      throw new ParserError(`Rover ${index} position must contain exactly three values (x y direction)`, this.currentLine)
    }

    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    const direction = parts[2].toUpperCase() as Direction;

    if (isNaN(x) || isNaN(y)) {
      throw new ParserError(`Rover ${index} coordinates must be valid numbers`, this.currentLine)
    }

    const validDirections = Object.values(Direction);
    if (!validDirections.includes(direction)) {
      throw new ParserError(`Rover ${index} direction must be one of: ${validDirections.join(', ')}`, this.currentLine)
    }

    const id = (index).toString();
    const rover = new Rover(id, { position: { x, y }, direction });

    return rover;
  }

  private parseRoverCommands(commandsLine: string, roverIndex: number): Command[] {
    this.validateEmptyLine(commandsLine, `Rover ${roverIndex} commands`);

    const commands: Command[] = commandsLine.trim().split("").map(c => c.toUpperCase() as Command);

    for (let i = 0; i < commands.length; i++) {
      if (!VALID_COMMANDS.includes(commands[i])) {
        throw new ParserError(`Rover ${roverIndex} has invalid command '${commands[i]}'. Valid commands are: ${VALID_COMMANDS.join(', ')}`, this.currentLine)
      }
    }

    return commands;
  }
}

export { PlateauRoversParserUseCase }