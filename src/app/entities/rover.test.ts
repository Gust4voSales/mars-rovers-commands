import { describe, it, expect, beforeEach } from 'vitest'
import { Rover, Direction } from './rover'

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

  describe('movement', () => {
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

  describe('output', () => {
    it('should return correct string representation', () => {
      expect(rover.toString()).toBe('0 0 N')

      rover.move()
      rover.rotate('R')
      expect(rover.toString()).toBe('0 1 E')
    })
  })

  describe('complete command sequences', () => {
    it('should execute LMLMLMLMM sequence correctly', () => {
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

    it('should execute MMRMMRMRRM sequence correctly', () => {
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
  })
})
