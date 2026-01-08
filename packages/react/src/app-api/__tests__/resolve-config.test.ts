import { describe, it, expect, vi } from 'vitest'
import {
  resolveConfig,
  isFeatureEnabled,
  describeActiveFeatures,
  createPresetConfig,
  mergeConfigs,
  ConfigValidationError,
} from '../resolve-config'
import { DEFAULT_FEATURE_FLAGS, PRESET_DEFINITIONS } from '../defaults'
import type { ClarityResolvedConfig } from '../types'

describe('resolveConfig', () => {
  describe('default behavior', () => {
    it('returns default config when no options provided', () => {
      const config = resolveConfig({})

      expect(config.features.streaming).toBe(true)
      expect(config.features.errorRecovery).toBe(true)
      expect(config.features.memory).toBe(false)
      expect(config.features.tokenOptimization).toBe(false)
      expect(config.features.tools).toBe(false)
      expect(config.features.rag).toBe(false)
      expect(config.features.safety).toBe(false)
    })

    it('has sensible default values for all config blocks', () => {
      const config = resolveConfig({})

      expect(config.memory.strategy).toBe('sliding-window')
      expect(config.memory.maxTokens).toBe(4096)
      expect(config.tokenOptimization.budget).toBe(8192)
      expect(config.tools.defaultRenderer).toBe('card')
      expect(config.rag.topK).toBe(5)
      expect(config.safety.level).toBe('standard')
      expect(config.ui.theme).toBe('system')
    })
  })

  describe('preset resolution', () => {
    it('resolves simple preset correctly', () => {
      const config = resolveConfig({ preset: 'simple' })

      expect(config.features.streaming).toBe(true)
      expect(config.features.errorRecovery).toBe(true)
      expect(config.features.memory).toBe(false)
      expect(config.features.tokenOptimization).toBe(false)
    })

    it('resolves pro preset correctly', () => {
      const config = resolveConfig({ preset: 'pro' })

      expect(config.features.tokenOptimization).toBe(true)
      expect(config.features.safety).toBe(true)
      expect(config.features.observability).toBe(true)
      expect(config.features.memory).toBe(false)
    })

    it('resolves memory preset correctly', () => {
      const config = resolveConfig({ preset: 'memory' })

      expect(config.features.memory).toBe(true)
      expect(config.memory.strategy).toBe('sliding-window')
      expect(config.memory.maxTokens).toBe(4096)
    })

    it('resolves rag preset correctly', () => {
      const config = resolveConfig({ preset: 'rag' })

      expect(config.features.rag).toBe(true)
      expect(config.rag.chunking.strategy).toBe('balanced')
      expect(config.rag.topK).toBe(5)
      expect(config.rag.showCitations).toBe(true)
    })

    it('resolves tools preset correctly', () => {
      const config = resolveConfig({ preset: 'tools' })

      expect(config.features.tools).toBe(true)
      expect(config.tools.defaultRenderer).toBe('card')
      expect(config.tools.autoApprove).toBe(false)
    })

    it('resolves enterprise preset correctly', () => {
      const config = resolveConfig({ preset: 'enterprise' })

      expect(config.features.memory).toBe(true)
      expect(config.features.tokenOptimization).toBe(true)
      expect(config.features.tools).toBe(true)
      expect(config.features.rag).toBe(true)
      expect(config.features.safety).toBe(true)
      expect(config.features.observability).toBe(true)
      expect(config.memory.strategy).toBe('hybrid')
      expect(config.safety.level).toBe('strict')
    })
  })

  describe('flag overrides', () => {
    it('explicit flags override preset flags', () => {
      const config = resolveConfig({
        preset: 'simple',
        features: { memory: true },
      })

      expect(config.features.memory).toBe(true)
      expect(config.features.streaming).toBe(true)
    })

    it('can disable preset features with explicit flags', () => {
      const config = resolveConfig({
        preset: 'enterprise',
        features: { safety: false, tools: false },
      })

      expect(config.features.memory).toBe(true)
      expect(config.features.safety).toBe(false)
      expect(config.features.tools).toBe(false)
    })

    it('ignores undefined flag values', () => {
      const config = resolveConfig({
        preset: 'simple',
        features: { memory: undefined },
      })

      expect(config.features.memory).toBe(false)
    })
  })

  describe('config overrides', () => {
    it('explicit config overrides preset config', () => {
      const config = resolveConfig({
        preset: 'memory',
        config: {
          memory: { maxTokens: 8192 },
        },
      })

      expect(config.memory.maxTokens).toBe(8192)
      expect(config.memory.strategy).toBe('sliding-window') // Unchanged
    })

    it('deep merges nested config objects', () => {
      const config = resolveConfig({
        preset: 'rag',
        config: {
          rag: {
            chunking: { maxTokens: 1024 },
          },
        },
      })

      expect(config.rag.chunking.maxTokens).toBe(1024)
      expect(config.rag.chunking.strategy).toBe('balanced') // Unchanged
      expect(config.rag.chunking.overlap).toBe(50) // Unchanged
    })

    it('replaces arrays instead of merging', () => {
      const config = resolveConfig({
        config: {
          tools: {
            registry: [
              {
                name: 'test',
                description: 'Test tool',
                parameters: {},
                execute: async () => ({}),
              },
            ],
          },
        },
      })

      expect(config.tools.registry).toHaveLength(1)
      expect(config.tools.registry[0].name).toBe('test')
    })
  })

  describe('special cases', () => {
    it('auto-enables RAG when sources provided', () => {
      const config = resolveConfig({
        sources: [{ type: 'text', content: 'Hello world' }],
      })

      expect(config.features.rag).toBe(true)
      expect(config.rag.sources).toHaveLength(1)
    })

    it('auto-enables tools when registry provided', () => {
      const config = resolveConfig({
        config: {
          tools: {
            registry: [
              {
                name: 'test',
                description: 'Test',
                parameters: {},
                execute: async () => ({}),
              },
            ],
          },
        },
      })

      expect(config.features.tools).toBe(true)
    })

    it('derives token budget from model', () => {
      const config = resolveConfig({
        model: 'gpt-4-turbo',
      })

      expect(config.tokenOptimization.budget).toBe(128000)
    })

    it('uses default budget for unknown models with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const config = resolveConfig({
        model: 'unknown-model',
      })

      expect(config.tokenOptimization.budget).toBe(8192)
      expect(warnSpy).toHaveBeenCalled()

      warnSpy.mockRestore()
    })

    it('explicit budget overrides model-derived budget', () => {
      const config = resolveConfig({
        model: 'gpt-4-turbo',
        config: {
          tokenOptimization: { budget: 4000 },
        },
      })

      expect(config.tokenOptimization.budget).toBe(4000)
    })
  })

  describe('validation', () => {
    it('throws on invalid memory maxTokens', () => {
      expect(() =>
        resolveConfig({
          features: { memory: true },
          config: { memory: { maxTokens: -1 } },
        })
      ).toThrow(ConfigValidationError)
    })

    it('throws on invalid tokenOptimization budget', () => {
      expect(() =>
        resolveConfig({
          features: { tokenOptimization: true },
          config: { tokenOptimization: { budget: 0 } },
        })
      ).toThrow(ConfigValidationError)
    })

    it('throws on invalid quality threshold', () => {
      expect(() =>
        resolveConfig({
          features: { tokenOptimization: true },
          config: { tokenOptimization: { qualityThreshold: 1.5 } },
        })
      ).toThrow(ConfigValidationError)
    })

    it('throws on invalid rag topK', () => {
      expect(() =>
        resolveConfig({
          features: { rag: true },
          config: { rag: { topK: -1 } },
        })
      ).toThrow(ConfigValidationError)
    })

    it('throws on invalid tool definition', () => {
      expect(() =>
        resolveConfig({
          features: { tools: true },
          config: {
            tools: {
              registry: [
                {
                  name: '',
                  description: 'Invalid',
                  parameters: {},
                  execute: async () => ({}),
                },
              ],
            },
          },
        })
      ).toThrow(ConfigValidationError)
    })
  })
})

describe('isFeatureEnabled', () => {
  it('returns true for enabled features', () => {
    const config = resolveConfig({ preset: 'enterprise' })

    expect(isFeatureEnabled(config, 'memory')).toBe(true)
    expect(isFeatureEnabled(config, 'safety')).toBe(true)
  })

  it('returns false for disabled features', () => {
    const config = resolveConfig({ preset: 'simple' })

    expect(isFeatureEnabled(config, 'memory')).toBe(false)
    expect(isFeatureEnabled(config, 'tools')).toBe(false)
  })
})

describe('describeActiveFeatures', () => {
  it('lists all active features', () => {
    const config = resolveConfig({ preset: 'enterprise' })
    const features = describeActiveFeatures(config)

    expect(features).toContain('Streaming')
    expect(features).toContain('Error Recovery')
    expect(features.some((f) => f.includes('Memory'))).toBe(true)
    expect(features.some((f) => f.includes('Token Optimization'))).toBe(true)
    expect(features.some((f) => f.includes('Safety'))).toBe(true)
  })

  it('returns minimal list for simple preset', () => {
    const config = resolveConfig({ preset: 'simple' })
    const features = describeActiveFeatures(config)

    expect(features).toContain('Streaming')
    expect(features).toContain('Error Recovery')
    expect(features.some((f) => f.includes('Memory'))).toBe(false)
  })
})

describe('createPresetConfig', () => {
  it('creates config for each preset', () => {
    const presets = [
      'simple',
      'pro',
      'memory',
      'rag',
      'tools',
      'enterprise',
    ] as const

    for (const preset of presets) {
      const config = createPresetConfig(preset)
      expect(config).toBeDefined()
      expect(config.features).toBeDefined()
    }
  })
})

describe('mergeConfigs', () => {
  it('merges two configs with override taking precedence', () => {
    const base = resolveConfig({ preset: 'simple' })
    const merged = mergeConfigs(base, {
      memory: { maxTokens: 16384 },
    })

    expect(merged.memory.maxTokens).toBe(16384)
  })
})
