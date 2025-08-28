import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApplicationRunner } from './application-runner';
import { FileReader } from './helpers/file-reader';
import { CliParser } from './cli-parser';

// Mock dependencies
vi.mock('./helpers/file-reader');
vi.mock('./cli-parser');

describe('ApplicationRunner E2E Tests', () => {
  let applicationRunner: ApplicationRunner;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let processExitSpy: any;

  beforeEach(() => {
    applicationRunner = new ApplicationRunner();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Normal Operation', () => {
    it('should process valid input file and display rover positions', () => {
      // Arrange
      const args = ['input/example.txt'];
      const fileContent = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM';

      vi.mocked(CliParser.parse).mockReturnValue({
        filePath: 'input/example.txt',
        help: false,
        verbose: false
      });

      vi.mocked(FileReader.readFile).mockReturnValue(fileContent);

      // Act
      applicationRunner.run(args);

      // Assert
      expect(CliParser.parse).toHaveBeenCalledWith(args);
      expect(FileReader.readFile).toHaveBeenCalledWith('input/example.txt');
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith('1 3 N');
      expect(consoleLogSpy).toHaveBeenCalledWith('5 1 E');
    });
  });

  describe('Verbose Mode', () => {
    it('should display detailed information in verbose mode', () => {
      // Arrange
      const args = ['input/example.txt', '--verbose'];
      const fileContent = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM';

      vi.mocked(CliParser.parse).mockReturnValue({
        filePath: 'input/example.txt',
        help: false,
        verbose: true
      });

      vi.mocked(FileReader.readFile).mockReturnValue(fileContent);

      // Act
      applicationRunner.run(args);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Plateau: 5 5');
      expect(consoleLogSpy).toHaveBeenCalledWith('Rover 1 position: 1 3 N');
      expect(consoleLogSpy).toHaveBeenCalledWith('Rover 2 position: 5 1 E');
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Help Display', () => {
    it('should display help and exit when help flag is provided', () => {
      // Arrange
      const args = ['--help'];

      vi.mocked(CliParser.parse).mockReturnValue({
        filePath: '',
        help: true,
        verbose: false
      });

      // Act & Assert
      expect(() => applicationRunner.run(args)).toThrow('process.exit called');
      expect(CliParser.showHelp).toHaveBeenCalled();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle file not found error', () => {
      // Arrange
      const args = ['nonexistent.txt'];

      vi.mocked(CliParser.parse).mockReturnValue({
        filePath: 'nonexistent.txt',
        help: false,
        verbose: false
      });

      vi.mocked(FileReader.readFile).mockImplementation(() => {
        throw new Error('File not found: nonexistent.txt');
      });

      // Act & Assert
      expect(() => applicationRunner.run(args)).toThrow('process.exit called');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: File not found: nonexistent.txt');
    });

    it('should handle CLI parsing error', () => {
      // Arrange
      const args = [];

      vi.mocked(CliParser.parse).mockImplementation(() => {
        throw new Error('File path is required. Use --help for usage information.');
      });

      // Act & Assert
      expect(() => applicationRunner.run(args)).toThrow('process.exit called');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: File path is required. Use --help for usage information.');
    });

    it('should handle parser use case error', () => {
      // Arrange
      const args = ['input/invalid.txt'];
      const fileContent = 'invalid content';

      vi.mocked(CliParser.parse).mockReturnValue({
        filePath: 'input/invalid.txt',
        help: false,
        verbose: false
      });

      vi.mocked(FileReader.readFile).mockReturnValue(fileContent);

      // Act & Assert
      expect(() => applicationRunner.run(args)).toThrow('process.exit called');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    });
  });
});
