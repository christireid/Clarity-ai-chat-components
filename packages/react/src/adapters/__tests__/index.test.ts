import { describe, it, expect } from 'vitest'
import { 
  getAdapter, 
  allModels, 
  openAIModels, 
  anthropicModels, 
  googleModels 
} from '../index'
import { openAIAdapter } from '../openai'
import { anthropicAdapter } from '../anthropic'
import { googleAdapter } from '../google'

describe('Adapter Index', () => {
  describe('getAdapter', () => {
    it('should return OpenAI adapter for "openai" provider', () => {
      const adapter = getAdapter('openai')
      expect(adapter).toBe(openAIAdapter)
    })

    it('should return Anthropic adapter for "anthropic" provider', () => {
      const adapter = getAdapter('anthropic')
      expect(adapter).toBe(anthropicAdapter)
    })

    it('should return Google adapter for "google" provider', () => {
      const adapter = getAdapter('google')
      expect(adapter).toBe(googleAdapter)
    })

    it('should throw error for unknown provider', () => {
      expect(() => getAdapter('unknown')).toThrow('Unknown provider: unknown')
    })
  })

  describe('allModels', () => {
    it('should combine all provider models', () => {
      expect(allModels).toBeDefined()
      expect(Array.isArray(allModels)).toBe(true)
      
      const totalModels = openAIModels.length + anthropicModels.length + googleModels.length
      expect(allModels.length).toBe(totalModels)
    })

    it('should contain OpenAI models', () => {
      const openAIIds = openAIModels.map(m => m.id)
      openAIIds.forEach(id => {
        expect(allModels.some(m => m.id === id)).toBe(true)
      })
    })

    it('should contain Anthropic models', () => {
      const anthropicIds = anthropicModels.map(m => m.id)
      anthropicIds.forEach(id => {
        expect(allModels.some(m => m.id === id)).toBe(true)
      })
    })

    it('should contain Google models', () => {
      const googleIds = googleModels.map(m => m.id)
      googleIds.forEach(id => {
        expect(allModels.some(m => m.id === id)).toBe(true)
      })
    })

    it('should have unique model IDs', () => {
      const ids = allModels.map(m => m.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('should have valid provider values', () => {
      const validProviders = ['openai', 'anthropic', 'google']
      allModels.forEach(model => {
        expect(validProviders).toContain(model.provider)
      })
    })

    it('should have valid speed ratings', () => {
      const validSpeeds = ['fastest', 'fast', 'medium', 'slow']
      allModels.forEach(model => {
        expect(validSpeeds).toContain(model.speed)
      })
    })

    it('should have valid cost ratings', () => {
      const validCosts = ['low', 'medium', 'high']
      allModels.forEach(model => {
        expect(validCosts).toContain(model.cost)
      })
    })

    it('should have valid quality ratings', () => {
      const validQualities = ['good', 'better', 'best']
      allModels.forEach(model => {
        expect(validQualities).toContain(model.quality)
      })
    })

    it('should have positive context window sizes', () => {
      allModels.forEach(model => {
        expect(model.contextWindow).toBeGreaterThan(0)
      })
    })
  })

  describe('model filtering', () => {
    it('should filter by provider', () => {
      const openAIOnly = allModels.filter(m => m.provider === 'openai')
      expect(openAIOnly.length).toBe(openAIModels.length)
    })

    it('should filter by speed', () => {
      const fastestModels = allModels.filter(m => m.speed === 'fastest')
      expect(fastestModels.length).toBeGreaterThan(0)
      fastestModels.forEach(m => {
        expect(m.speed).toBe('fastest')
      })
    })

    it('should filter by cost', () => {
      const lowCostModels = allModels.filter(m => m.cost === 'low')
      expect(lowCostModels.length).toBeGreaterThan(0)
      lowCostModels.forEach(m => {
        expect(m.cost).toBe('low')
      })
    })

    it('should filter by quality', () => {
      const bestQualityModels = allModels.filter(m => m.quality === 'best')
      expect(bestQualityModels.length).toBeGreaterThan(0)
      bestQualityModels.forEach(m => {
        expect(m.quality).toBe('best')
      })
    })

    it('should support complex filtering', () => {
      const fastAndCheap = allModels.filter(
        m => m.speed === 'fastest' && m.cost === 'low'
      )
      expect(fastAndCheap.length).toBeGreaterThan(0)
    })
  })

  describe('model metadata structure', () => {
    it('should have all required fields', () => {
      allModels.forEach(model => {
        expect(model).toHaveProperty('id')
        expect(model).toHaveProperty('name')
        expect(model).toHaveProperty('provider')
        expect(model).toHaveProperty('speed')
        expect(model).toHaveProperty('cost')
        expect(model).toHaveProperty('quality')
        expect(model).toHaveProperty('contextWindow')
      })
    })

    it('should have non-empty strings for text fields', () => {
      allModels.forEach(model => {
        expect(model.id.length).toBeGreaterThan(0)
        expect(model.name.length).toBeGreaterThan(0)
      })
    })
  })
})
