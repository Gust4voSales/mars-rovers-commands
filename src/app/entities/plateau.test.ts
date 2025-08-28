import { describe, it, expect, beforeEach } from 'vitest'
import { Plateau } from './plateau'
import { Rover, Direction } from './rover'
import { InvalidInitializationError } from './errors/invalid-initialization'

describe('Plateau', () => {
  let plateau: Plateau

  beforeEach(() => {
    plateau = new Plateau('test-plateau', 5, 5)
  })

  describe('initialization', () => {
    it('should create a plateau with correct initial properties', () => {
      expect(plateau.id).toBe('test-plateau')
      expect(plateau.maxX).toBe(5)
      expect(plateau.maxY).toBe(5)
      expect(plateau.rovers).toEqual([])
    })

    it('should throw error for negative X boundary', () => {
      expect(() => new Plateau('invalid', -1, 5)).toThrow(InvalidInitializationError)
      expect(() => new Plateau('invalid', -1, 5)).toThrow('Plateau boundaries must be non-negative')
    })

    it('should throw error for negative Y boundary', () => {
      expect(() => new Plateau('invalid', 5, -1)).toThrow(InvalidInitializationError)
      expect(() => new Plateau('invalid', 5, -1)).toThrow('Plateau boundaries must be non-negative')
    })

    it('should throw error for non-integer X boundary', () => {
      expect(() => new Plateau('invalid', 5.5, 5)).toThrow(InvalidInitializationError)
      expect(() => new Plateau('invalid', 5.5, 5)).toThrow('Plateau boundaries must be integers')
    })

    it('should throw error for non-integer Y boundary', () => {
      expect(() => new Plateau('invalid', 5, 5.5)).toThrow(InvalidInitializationError)
      expect(() => new Plateau('invalid', 5, 5.5)).toThrow('Plateau boundaries must be integers')
    })
  })

  describe('position validation', () => {
    it('should correctly identify positions inside plateau boundaries', () => {
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 0, y: 0 })).toBe(true)
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 5, y: 5 })).toBe(true)
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 2, y: 3 })).toBe(true)
    })

    it('should correctly identify positions outside plateau boundaries', () => {
      expect(plateau.isPositionInsidePlateauBoundaries({ x: -1, y: 0 })).toBe(false)
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 0, y: -1 })).toBe(false)
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 6, y: 3 })).toBe(false)
      expect(plateau.isPositionInsidePlateauBoundaries({ x: 3, y: 6 })).toBe(false)
    })

    it('should correctly identify occupied positions', () => {
      const rover = new Rover('test-rover', {
        position: { x: 2, y: 3 },
        direction: Direction.NORTH
      })
      plateau.addRover(rover)

      expect(plateau.isPositionOccupiedByRover({ x: 2, y: 3 })).toBe(true)
      expect(plateau.isPositionOccupiedByRover({ x: 2, y: 4 })).toBe(false)
      expect(plateau.isPositionOccupiedByRover({ x: 1, y: 3 })).toBe(false)
    })

    it('should exclude specific rover when checking position occupation', () => {
      const rover = new Rover('test-rover', {
        position: { x: 2, y: 3 },
        direction: Direction.NORTH
      })
      plateau.addRover(rover)

      // Position should not be considered occupied when excluding the rover that's actually there
      expect(plateau.isPositionOccupiedByRover({ x: 2, y: 3 }, 'test-rover')).toBe(false)
      // Position should still be considered occupied when excluding a different rover
      expect(plateau.isPositionOccupiedByRover({ x: 2, y: 3 }, 'other-rover')).toBe(true)
    })
  })

  describe('rover management', () => {
    let rover1: Rover
    let rover2: Rover

    beforeEach(() => {
      rover1 = new Rover('rover1', {
        position: { x: 1, y: 2 },
        direction: Direction.NORTH
      })
      rover2 = new Rover('rover2', {
        position: { x: 3, y: 3 },
        direction: Direction.EAST
      })
    })

    it('should add multiple rovers successfully', () => {
      plateau.addRover(rover1)
      plateau.addRover(rover2)
      expect(plateau.rovers).toHaveLength(2)
      expect(plateau.rovers).toContain(rover1)
      expect(plateau.rovers).toContain(rover2)
    })

    it('should throw error when adding rover outside plateau boundaries', () => {
      const outOfBoundsRover = new Rover('out-of-bounds', {
        position: { x: 6, y: 3 },
        direction: Direction.NORTH
      })

      expect(() => plateau.addRover(outOfBoundsRover)).toThrow(InvalidInitializationError)
      expect(() => plateau.addRover(outOfBoundsRover)).toThrow(
        'Rover out-of-bounds cannot be added - position (6, 3) is out of plateau bounds (0, 0) to (5, 5)'
      )
    })

    it('should throw error when adding rover to occupied position', () => {
      plateau.addRover(rover1)

      const duplicatePositionRover = new Rover('duplicate', {
        position: { x: 1, y: 2 }, // Same position as rover1
        direction: Direction.SOUTH
      })

      expect(() => plateau.addRover(duplicatePositionRover)).toThrow(InvalidInitializationError)
      expect(() => plateau.addRover(duplicatePositionRover)).toThrow(
        'Rover duplicate cannot be added - position (1, 2) is already occupied'
      )
    })
  })
})
