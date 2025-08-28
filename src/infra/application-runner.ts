import { PlateauRoversParserUseCase } from "../app/use-cases/plateau-rovers-parser-use-case";
import { FileReader } from "./helpers/file-reader";
import { CliParser, CliOptions } from "./cli-parser";

export class ApplicationRunner {
  private parser: PlateauRoversParserUseCase;

  constructor() {
    this.parser = new PlateauRoversParserUseCase();
  }

  public run(args: string[]): void {
    try {
      const options = CliParser.parse(args);

      // Show help if requested
      if (options.help) {
        CliParser.showHelp();
        process.exit(0);
      }

      const input = FileReader.readFile(options.filePath);

      const { plateau } = this.parser.parse(input);

      this.displayResults(plateau, options);
    } catch (error: any) {
      console.error(`${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`);
      process.exit(1);
    }
  }

  private displayResults(plateau: any, options: CliOptions): void {
    if (options.verbose) {
      console.log(`Plateau: ${plateau.maxX} ${plateau.maxY}`);
      for (const rover of plateau.rovers) {
        console.log(`Rover ${rover.id} position: ${rover.position.x} ${rover.position.y} ${rover.direction}`);
      }
    } else {
      for (const rover of plateau.rovers) {
        console.log(rover.toString());
      }
    }
  }
}
