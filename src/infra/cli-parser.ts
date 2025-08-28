export interface CliOptions {
  filePath: string;
  help: boolean;
  verbose: boolean;
}

export class CliParser {
  static parse(args: string[]): CliOptions {
    const options: CliOptions = {
      filePath: '',
      help: false,
      verbose: false
    };

    if (args.includes('--help')) {
      options.help = true;
      return options;
    }

    if (args.includes('--verbose')) {
      options.verbose = true;
    }

    // File path is mandatory - take the first non-flag argument
    for (const arg of args) {
      if (!arg.startsWith('-')) {
        options.filePath = arg;
        break;
      }
    }

    if (!options.filePath) {
      throw new Error('File path is required. Use --help for usage information.');
    }

    return options;
  }

  static showHelp(): void {
    console.log(`
Mars Rovers Commands CLI

Usage:
  Build and run:
    npm run build
    node dist/index.js input/example.txt
    node dist/index.js input/example.txt --verbose

Arguments:
  file-path    Relative path to input file (mandatory)

Options:
  --help   Show this help message
  --verbose   Enable verbose output (show plateau info and rover prefixes)
`);
  }
}
