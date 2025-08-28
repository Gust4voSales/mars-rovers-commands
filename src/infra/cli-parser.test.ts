import { describe, it, expect } from 'vitest'
import { CliParser, CliOptions } from './cli-parser'

describe('CliParser', () => {
  describe('parse', () => {
    it('should parse file path correctly', () => {
      const args = ['input/example.txt']
      const result = CliParser.parse(args)

      expect(result.filePath).toBe('input/example.txt')
      expect(result.help).toBe(false)
      expect(result.verbose).toBe(false)
    })

    it('should parse verbose flag correctly', () => {
      const args = ['input/example.txt', '--verbose']
      const result = CliParser.parse(args)

      expect(result.filePath).toBe('input/example.txt')
      expect(result.help).toBe(false)
      expect(result.verbose).toBe(true)
    })

    it('should parse help flag correctly and ignore other arguments', () => {
      const args = ['--help', 'input/example.txt', '--verbose']
      const result = CliParser.parse(args)

      expect(result.help).toBe(true)
      expect(result.filePath).toBe('')
      expect(result.verbose).toBe(false)
    })

    it('should parse file path with verbose flag in different order', () => {
      const args = ['--verbose', 'input/test.txt']
      const result = CliParser.parse(args)

      expect(result.filePath).toBe('input/test.txt')
      expect(result.help).toBe(false)
      expect(result.verbose).toBe(true)
    })

    it('should throw error when no file path is provided', () => {
      const args: string[] = []

      expect(() => CliParser.parse(args)).toThrow('File path is required. Use --help for usage information.')
    })

    it('should throw error when only flags are provided without file path', () => {
      const args = ['--verbose']

      expect(() => CliParser.parse(args)).toThrow('File path is required. Use --help for usage information.')
    })

    it('should take first non-flag argument as file path', () => {
      const args = ['--verbose', 'first-file.txt', 'second-file.txt']
      const result = CliParser.parse(args)

      expect(result.filePath).toBe('first-file.txt')
      expect(result.verbose).toBe(true)
    })
  })

})
