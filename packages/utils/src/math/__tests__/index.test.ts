/**
 * Math Utilities Tests
 */

import { describe, it, expect } from 'vitest'
import { clamp } from '../index'

describe('Math Utilities', () => {
  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })

    it('should return min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, -50, 50)).toBe(-50)
    })

    it('should return max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(100, -50, 50)).toBe(50)
    })

    it('should handle equal min and max', () => {
      expect(clamp(5, 10, 10)).toBe(10)
      expect(clamp(15, 10, 10)).toBe(10)
      expect(clamp(0, 10, 10)).toBe(10)
    })

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })

    it('should handle decimal values', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5)
      expect(clamp(10.1, 0, 10)).toBe(10)
      expect(clamp(-0.1, 0, 10)).toBe(0)
    })

    it('should handle NaN by returning min', () => {
      expect(clamp(NaN, 0, 10)).toBe(0)
      expect(clamp(NaN, -5, 5)).toBe(-5)
    })

    it('should handle Infinity by returning min', () => {
      expect(clamp(Infinity, 0, 10)).toBe(0)
      expect(clamp(-Infinity, 0, 10)).toBe(0)
    })

    it('should handle zero as min and max', () => {
      expect(clamp(5, 0, 0)).toBe(0)
      expect(clamp(-5, 0, 0)).toBe(0)
      expect(clamp(0, 0, 0)).toBe(0)
    })
  })
})
