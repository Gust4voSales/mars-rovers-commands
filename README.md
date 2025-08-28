# Mars Rovers Commands

## Description

The application simulates rovers moving on a rectangular plateau on Mars, processing movement commands and ensuring rovers don't collide or move outside the plateau boundaries.

### How it works:
- **Plateau**: A rectangular grid defined by maximum X and Y coordinates (e.g., "5 5" creates a grid from (0,0) to (5,5))
- **Rovers**: Each rover has a position (x, y) and faces a direction (N, S, E, W)
- **Commands**: 
  - `L` - Turn left 90 degrees
  - `R` - Turn right 90 degrees  
  - `M` - Move one grid point forward in the current direction

The application reads input from a text file where:
- First line defines the plateau size
- Each rover requires two lines: initial position/direction and movement commands

### Design decisions
- As required by the challenge, no external libraries were used, except for development dependencies related to TypeScript bundling and automated testing.
- As an extra improvement, I added validations for the rovers’ initial positions and movements.
  -  **Validation** (extra): Rovers cannot move outside plateau boundaries or occupy the same position

**Example input:**
```
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```

**Example output:**
```
1 3 N
5 1 E
```

## Project Structure

```
mars-rovers-commands/
├── src/                    # Source code
│   ├── app/               # Application layer (business logic)
│   │   ├── entities/      # Domain entities (Rover, Plateau)
│   │   └── use-cases/     # Application use cases
│   ├── infra/             # Infrastructure layer (CLI, file operations)
│   └── index.ts           # Application entry point
├── input/                 # Sample input files
├── dist/                  # Compiled JavaScript output
└── package.json           # Dependencies and scripts
```

## Installation & Setup

### Prerequisites

- **Node.js** (version 22 or higher)
- **npm** 

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

#### Development Mode (with TypeScript)
```bash
# Run with sample input
npm run dev ./input/example.txt

# Run with verbose output 
npm run dev:verbose ./input/example.txt

# Show help
npm run dev:help
```

#### Production Mode (compiled JavaScript)
```bash
# Build the project first
npm run build

# Run compiled version
node dist/index.js ./input/example.txt

# Run with verbose output
node dist/index.js ./input/example.txt --verbose

# Show help
node dist/index.js --help
```

### Command Line Options

- `--help` - Show usage information
- `--verbose` - Enable detailed output with plateau information and rover IDs

## Testing
```bash
# Run all tests
npm run test
```
