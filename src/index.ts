import { PlateauRoversParserUseCase } from "./app/use-cases/plateau-rovers-parser-use-case";
import { FileReader } from "./infra/file-reader";

function main() {
  try {
    const input = FileReader.readFile('input/example.txt');

    const parser = new PlateauRoversParserUseCase();
    const { plateau } = parser.parse(input);

    // Display results
    console.log(`Plateau: ${plateau.maxX} ${plateau.maxY}`);
    for (const rover of plateau.rovers) {
      console.log(`Rover ${rover.id} position: ${rover.position.x} ${rover.position.y} ${rover.direction}`);
    }
  } catch (error: any) {
    console.error(`${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`);
    process.exit(1);
  }
}

main()