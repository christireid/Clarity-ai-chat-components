import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VectorStoreUtils } from '../index'
import type { Vector, VectorQuery, VectorMatch } from '../types'

describe('VectorStoreUtils', () => {
  describe('batchVectors', () => {
    it('should split vectors into batches', () => {
      const vectors = Array.from({ length: 10 }, (_, i) => ({ id: `${i}` }))
      const batches = VectorStoreUtils.batchVectors(vectors, 3)
      
      expect(batches).toHaveLength(4)
      expect(batches[0]).toHaveLength(3)
      expect(batches[1]).toHaveLength(3)
      expect(batches[2]).toHaveLength(3)
      expect(batches[3]).toHaveLength(1)
    })
    
    it('should handle empty array', () => {
      const batches = VectorStoreUtils.batchVectors([], 10)
      expect(batches).toHaveLength(0)
    })
  })
  
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = VectorStoreUtils.generateId()
      const id2 = VectorStoreUtils.generateId()
      
      expect(id1).toMatch(/^vec-\d+-[a-z0-9]+$/)
      expect(id2).toMatch(/^vec-\d+-[a-z0-9]+$/)
      expect(id1).not.toBe(id2)
    })
  })
  
  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const a = [1, 0, 0]
      const b = [1, 0, 0]
      expect(VectorStoreUtils.cosineSimilarity(a, b)).toBe(1)
    })
    
    it('should return 0 for orthogonal vectors', () => {
      const a = [1, 0]
      const b = [0, 1]
      expect(VectorStoreUtils.cosineSimilarity(a, b)).toBe(0)
    })
    
    it('should throw error for different dimensions', () => {
      const a = [1, 0]
      const b = [1, 0, 0]
      expect(() => VectorStoreUtils.cosineSimilarity(a, b)).toThrow()
    })
  })
  
  describe('euclideanDistance', () => {
    it('should calculate euclidean distance correctly', () => {
      const a = [0, 0]
      const b = [3, 4]
      expect(VectorStoreUtils.euclideanDistance(a, b)).toBe(5)
    })
    
    it('should return 0 for same vectors', () => {
      const a = [1, 2, 3]
      const b = [1, 2, 3]
      expect(VectorStoreUtils.euclideanDistance(a, b)).toBe(0)
    })
  })
  
  describe('normalizeVector', () => {
    it('should normalize vector to unit length', () => {
      const v = [3, 4]
      const normalized = VectorStoreUtils.normalizeVector(v)
      expect(normalized[0]).toBeCloseTo(0.6)
      expect(normalized[1]).toBeCloseTo(0.8)
      
      const magnitude = Math.sqrt(normalized[0] ** 2 + normalized[1] ** 2)
      expect(magnitude).toBeCloseTo(1)
    })
    
    it('should handle zero vector', () => {
      const v = [0, 0]
      const normalized = VectorStoreUtils.normalizeVector(v)
      expect(normalized).toEqual([0, 0])
    })
  })
})

