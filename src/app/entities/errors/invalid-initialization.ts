class InvalidInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInitializationError";
  }
}

export { InvalidInitializationError };