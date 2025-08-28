import { PlateauRoversParserUseCase } from "./app/use-cases/plateau-rovers-parser-use-case";

const input = `
5 5
1 2 N
LMLMLMLMM 
3 3 E
MMRMMRMRRM
`

function main() {
  try {
    const parser = new PlateauRoversParserUseCase();
    const { plateau } = parser.parse(input);

    console.log(`Plateau: ${plateau.maxX} ${plateau.maxY}`);
    for (const rover of plateau.rovers) {
      console.log(`Rover ${rover.id} position: ${rover.position.x} ${rover.position.y} ${rover.direction}`);
    }
  } catch (error: any) {
    console.log(`${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`)
  }
}

main()