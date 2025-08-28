export class ParserError extends Error {
  public lineNumber: number;

  constructor(message: string, lineNumber: number) {
    super(`"${message}" at line number: ${lineNumber}`);
    this.lineNumber = lineNumber;
    this.name = "ParserError";
  }
}
