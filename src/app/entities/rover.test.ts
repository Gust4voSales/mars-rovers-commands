import { describe, it, expect, beforeEach } from 'vitest'
import { Rover, Direction } from './rover'
import { Plateau } from './plateau'
import { InvalidCommandError } from './errors/invalid-command'
import { InvalidInitializationError } from './errors/invalid-initialization'

describe('Rover', () => {
  let rover: Rover

  // reset rover before each test case
  beforeEach(() => {
    rover = new Rover('test-rover', {
      position: { x: 0, y: 0 },
      direction: Direction.NORTH
    })
  })

  describe('initialization', () => {
    it('should create a rover with correct initial properties', () => {
      expect(rover.id).toBe('test-rover')
      expect(rover.position).toEqual({ x: 0, y: 0 })
      expect(rover.direction).toBe(Direction.NORTH)
    })

    it('should throw error for non-integer X position', () => {
      expect(() => new Rover('invalid', {
        position: { x: 1.5, y: 0 },
        direction: Direction.NORTH
      })).toThrow(InvalidInitializationError)
      expect(() => new Rover('invalid', {
        position: { x: 1.5, y: 0 },
        direction: Direction.NORTH
      })).toThrow('Rover initial position must be integers')
    })

    it('should throw error for non-integer Y position', () => {
      expect(() => new Rover('invalid', {
        position: { x: 0, y: 2.7 },
        direction: Direction.NORTH
      })).toThrow(InvalidInitializationError)
      expect(() => new Rover('invalid', {
        position: { x: 0, y: 2.7 },
        direction: Direction.NORTH
      })).toThrow('Rover initial position must be integers')
    })

    it('should throw error for negative X position', () => {
      expect(() => new Rover('invalid', {
        position: { x: -1, y: 0 },
        direction: Direction.NORTH
      })).toThrow(InvalidInitializationError)
      expect(() => new Rover('invalid', {
        position: { x: -1, y: 0 },
        direction: Direction.NORTH
      })).toThrow('Rover initial position must be non-negative')
    })

    it('should throw error for negative Y position', () => {
      expect(() => new Rover('invalid', {
        position: { x: 0, y: -1 },
        direction: Direction.NORTH
      })).toThrow(InvalidInitializationError)
      expect(() => new Rover('invalid', {
        position: { x: 0, y: -1 },
        direction: Direction.NORTH
      })).toThrow('Rover initial position must be non-negative')
    })

    it('should allow rover at boundary positions', () => {
      expect(() => new Rover('valid', {
        position: { x: 0, y: 0 },
        direction: Direction.NORTH
      })).not.toThrow()
    })
  })

  describe('rotation', () => {
    it('should rotate left correctly from all directions', () => {
      rover.rotate('L')
      expect(rover.direction).toBe(Direction.WEST)

      rover.rotate('L')
      expect(rover.direction).toBe(Direction.SOUTH)

      rover.rotate('L')
      expect(rover.direction).toBe(Direction.EAST)

      rover.rotate('L')
      expect(rover.direction).toBe(Direction.NORTH)
    })

    it('should rotate right correctly from all directions', () => {
      rover.rotate('R')
      expect(rover.direction).toBe(Direction.EAST)

      rover.rotate('R')
      expect(rover.direction).toBe(Direction.SOUTH)

      rover.rotate('R')
      expect(rover.direction).toBe(Direction.WEST)

      rover.rotate('R')
      expect(rover.direction).toBe(Direction.NORTH)
    })
  })

  describe('position simulation', () => {
    it('should simulate next position north correctly', () => {
      const nextPosition = rover.getNextPositionSimulation()
      expect(nextPosition).toEqual({ x: 0, y: 1 })
      // Original position should remain unchanged
      expect(rover.position).toEqual({ x: 0, y: 0 })
    })

    it('should simulate next position east correctly', () => {
      rover.rotate('R') // Face East
      const nextPosition = rover.getNextPositionSimulation()
      expect(nextPosition).toEqual({ x: 1, y: 0 })
      // Original position should remain unchanged
      expect(rover.position).toEqual({ x: 0, y: 0 })
    })

    it('should simulate next position south correctly', () => {
      rover.rotate('R') // Face East
      rover.rotate('R') // Face South
      const nextPosition = rover.getNextPositionSimulation()
      expect(nextPosition).toEqual({ x: 0, y: -1 })
      // Original position should remain unchanged
      expect(rover.position).toEqual({ x: 0, y: 0 })
    })

    it('should simulate next position west correctly', () => {
      rover.rotate('L') // Face West
      const nextPosition = rover.getNextPositionSimulation()
      expect(nextPosition).toEqual({ x: -1, y: 0 })
      // Original position should remain unchanged
      expect(rover.position).toEqual({ x: 0, y: 0 })
    })

    it('should not modify rover position during simulation', () => {
      const originalPosition = { ...rover.position }
      rover.getNextPositionSimulation()
      expect(rover.position).toEqual(originalPosition)
    })
  })

  describe('movement without plateau', () => {
    it('should move north correctly', () => {
      rover.move()
      expect(rover.position).toEqual({ x: 0, y: 1 })
    })

    it('should move east correctly', () => {
      rover.rotate('R') // Face East
      rover.move()
      expect(rover.position).toEqual({ x: 1, y: 0 })
    })

    it('should move south correctly', () => {
      rover.rotate('R') // Face East
      rover.rotate('R') // Face South
      rover.move()
      expect(rover.position).toEqual({ x: 0, y: -1 })
    })

    it('should move west correctly', () => {
      rover.rotate('L') // Face West
      rover.move()
      expect(rover.position).toEqual({ x: -1, y: 0 })
    })
  })

  describe('movement with plateau constraints', () => {
    let plateau: Plateau

    beforeEach(() => {
      plateau = new Plateau('test-plateau', 5, 5)
    })

    it('should move successfully within plateau boundaries', () => {
      const testRover = new Rover('test', {
        position: { x: 2, y: 2 },
        direction: Direction.NORTH
      })
      plateau.addRover(testRover)

      testRover.move(plateau)
      expect(testRover.position).toEqual({ x: 2, y: 3 })
    })

    it('should throw error when moving outside plateau boundaries - north', () => {
      const testRover = new Rover('test', {
        position: { x: 2, y: 5 }, // At top boundary
        direction: Direction.NORTH
      })
      plateau.addRover(testRover)

      expect(() => testRover.move(plateau)).toThrow(InvalidCommandError)
      expect(() => testRover.move(plateau)).toThrow(
        'Rover test cannot move to position (2, 6) - out of plateau bounds (0, 0) to (5, 5)'
      )
      // Position should remain unchanged
      expect(testRover.position).toEqual({ x: 2, y: 5 })
    })

    it('should throw error when moving outside plateau boundaries - east', () => {
      const testRover = new Rover('test', {
        position: { x: 5, y: 2 }, // At right boundary
        direction: Direction.EAST
      })
      plateau.addRover(testRover)

      expect(() => testRover.move(plateau)).toThrow(InvalidCommandError)
      expect(() => testRover.move(plateau)).toThrow(
        'Rover test cannot move to position (6, 2) - out of plateau bounds (0, 0) to (5, 5)'
      )
      expect(testRover.position).toEqual({ x: 5, y: 2 })
    })

    it('should throw error when moving outside plateau boundaries - south', () => {
      const testRover = new Rover('test', {
        position: { x: 2, y: 0 }, // At bottom boundary
        direction: Direction.SOUTH
      })
      plateau.addRover(testRover)

      expect(() => testRover.move(plateau)).toThrow(InvalidCommandError)
      expect(() => testRover.move(plateau)).toThrow(
        'Rover test cannot move to position (2, -1) - out of plateau bounds (0, 0) to (5, 5)'
      )
      expect(testRover.position).toEqual({ x: 2, y: 0 })
    })

    it('should throw error when moving outside plateau boundaries - west', () => {
      const testRover = new Rover('test', {
        position: { x: 0, y: 2 }, // At left boundary
        direction: Direction.WEST
      })
      plateau.addRover(testRover)

      expect(() => testRover.move(plateau)).toThrow(InvalidCommandError)
      expect(() => testRover.move(plateau)).toThrow(
        'Rover test cannot move to position (-1, 2) - out of plateau bounds (0, 0) to (5, 5)'
      )
      expect(testRover.position).toEqual({ x: 0, y: 2 })
    })

    it('should throw error when moving to position occupied by another rover', () => {
      const rover1 = new Rover('rover1', {
        position: { x: 1, y: 1 },
        direction: Direction.NORTH
      })
      const rover2 = new Rover('rover2', {
        position: { x: 1, y: 2 }, // One position north of rover1
        direction: Direction.SOUTH
      })

      plateau.addRover(rover1)
      plateau.addRover(rover2)

      expect(() => rover1.move(plateau)).toThrow(InvalidCommandError)
      expect(() => rover1.move(plateau)).toThrow(
        'Rover rover1 cannot move to position (1, 2) - position is occupied by another rover'
      )
      expect(rover1.position).toEqual({ x: 1, y: 1 })
    })
  })

  describe('output', () => {
    it('should return correct string representation', () => {
      expect(rover.toString()).toBe('0 0 N')

      rover.move()
      rover.rotate('R')
      expect(rover.toString()).toBe('0 1 E')
    })
  })

  describe('complete command sequences', () => {
    it('should execute LMLMLMLMM sequence correctly without plateau', () => {
      const testRover = new Rover('1', {
        position: { x: 1, y: 2 },
        direction: Direction.NORTH
      })

      // Execute LMLMLMLMM
      testRover.rotate("L");             // L
      testRover.move();                  // M
      testRover.rotate("L");             // L
      testRover.move();                  // M
      testRover.rotate("L");             // L
      testRover.move();                  // M
      testRover.rotate("L");             // L
      testRover.move();                  // M
      testRover.move();                  // M

      expect(testRover.position).toEqual({ x: 1, y: 3 })
      expect(testRover.direction).toBe(Direction.NORTH)
      expect(testRover.toString()).toBe('1 3 N')
    })

    it('should execute MMRMMRMRRM sequence correctly without plateau', () => {
      const testRover = new Rover('2', {
        position: { x: 3, y: 3 },
        direction: Direction.EAST
      })

      // Execute MMRMMRMRRM
      testRover.move();                  // M
      testRover.move();                  // M
      testRover.rotate("R");             // R
      testRover.move();                  // M
      testRover.move();                  // M
      testRover.rotate("R");             // R
      testRover.move();                  // M
      testRover.rotate("R");             // R
      testRover.rotate("R");             // R
      testRover.move();                  // M

      expect(testRover.position).toEqual({ x: 5, y: 1 })
      expect(testRover.direction).toBe(Direction.EAST)
      expect(testRover.toString()).toBe('5 1 E')
    })

    it('should execute LMLMLMLMM sequence correctly with plateau constraints', () => {
      const plateau = new Plateau('test', 5, 5)
      const testRover = new Rover('1', {
        position: { x: 1, y: 2 },
        direction: Direction.NORTH
      })
      plateau.addRover(testRover)

      // Execute LMLMLMLMM with plateau validation
      testRover.rotate("L");             // L
      testRover.move(plateau);           // M
      testRover.rotate("L");             // L
      testRover.move(plateau);           // M
      testRover.rotate("L");             // L
      testRover.move(plateau);           // M
      testRover.rotate("L");             // L
      testRover.move(plateau);           // M
      testRover.move(plateau);           // M

      expect(testRover.position).toEqual({ x: 1, y: 3 })
      expect(testRover.direction).toBe(Direction.NORTH)
      expect(testRover.toString()).toBe('1 3 N')
    })

    it('should execute MMRMMRMRRM sequence correctly with plateau constraints', () => {
      const plateau = new Plateau('test', 5, 5)
      const testRover = new Rover('2', {
        position: { x: 3, y: 3 },
        direction: Direction.EAST
      })
      plateau.addRover(testRover)

      // Execute MMRMMRMRRM with plateau validation
      testRover.move(plateau);           // M
      testRover.move(plateau);           // M
      testRover.rotate("R");             // R
      testRover.move(plateau);           // M
      testRover.move(plateau);           // M
      testRover.rotate("R");             // R
      testRover.move(plateau);           // M
      testRover.rotate("R");             // R
      testRover.rotate("R");             // R
      testRover.move(plateau);           // M

      expect(testRover.position).toEqual({ x: 5, y: 1 })
      expect(testRover.direction).toBe(Direction.EAST)
      expect(testRover.toString()).toBe('5 1 E')
    })

  })
})
