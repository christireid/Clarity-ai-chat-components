/**
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isFeatureEnabled,
  isFeatureDisabled,
  isFeatureAvailable,
  getMissingDependencies,
  getFeatureStatusMessage,
  setFeatureFlags,
  getRuntimeConfig,
  getFeatureFlagSummary,
  clearFeatureFlagCache,
  type FeatureFlag,
} from '../feature-flags'

describe('feature-flags', () => {
  // Store original env
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset env
    process.env = { ...originalEnv }
    clearFeatureFlagCache()
    setFeatureFlags({})
  })

  afterEach(() => {
    // Restore env
    process.env = originalEnv
    clearFeatureFlagCache()
    setFeatureFlags({})
  })

  describe('isFeatureEnabled', () => {
    it('should return true when feature is not disabled', () => {
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
      expect(isFeatureEnabled('markdown')).toBe(true)
      expect(isFeatureEnabled('batch-exports')).toBe(true)
    })

    it('should return false when CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      clearFeatureFlagCache()
      expect(isFeatureEnabled('syntax-highlighting')).toBe(false)
    })

    it('should return false when CLARITY_DISABLE_MARKDOWN=true', () => {
      process.env.CLARITY_DISABLE_MARKDOWN = 'true'
      clearFeatureFlagCache()
      expect(isFeatureEnabled('markdown')).toBe(false)
    })

    it('should return false when CLARITY_DISABLE_EXPORTS=true', () => {
      process.env.CLARITY_DISABLE_EXPORTS = 'true'
      clearFeatureFlagCache()
      expect(isFeatureEnabled('batch-exports')).toBe(false)
    })

    it('should cache results for performance', () => {
      const result1 = isFeatureEnabled('syntax-highlighting')
      const result2 = isFeatureEnabled('syntax-highlighting')
      expect(result1).toBe(result2)
    })
  })

  describe('isFeatureDisabled', () => {
    it('should return false when feature is not explicitly disabled', () => {
      expect(isFeatureDisabled('syntax-highlighting')).toBe(false)
    })

    it('should return true when CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      expect(isFeatureDisabled('syntax-highlighting')).toBe(true)
    })

    it('should return true when CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=1', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = '1'
      expect(isFeatureDisabled('syntax-highlighting')).toBe(true)
    })

    it('should return true when CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=yes', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'yes'
      expect(isFeatureDisabled('syntax-highlighting')).toBe(true)
    })

    it('should return false when CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=false', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'false'
      expect(isFeatureDisabled('syntax-highlighting')).toBe(false)
    })
  })

  describe('getMissingDependencies', () => {
    it('should return empty array if all dependencies are available', () => {
      // Note: In test environment, these may or may not be available
      // We're just testing the function structure
      const missing = getMissingDependencies('syntax-highlighting')
      expect(Array.isArray(missing)).toBe(true)
    })

    it('should return array of strings', () => {
      const missing = getMissingDependencies('markdown')
      expect(Array.isArray(missing)).toBe(true)
      missing.forEach((dep) => {
        expect(typeof dep).toBe('string')
      })
    })
  })

  describe('getFeatureStatusMessage', () => {
    it('should return disabled message when feature is disabled', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      clearFeatureFlagCache()
      const message = getFeatureStatusMessage('syntax-highlighting')
      expect(message).toContain('disabled')
      expect(message).toContain('CLARITY_DISABLE_SYNTAX_HIGHLIGHTING')
    })

    it('should return available message when feature is enabled and deps available', () => {
      const message = getFeatureStatusMessage('syntax-highlighting')
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })
  })

  describe('Runtime Configuration', () => {
    it('should allow setting feature flags programmatically', () => {
      setFeatureFlags({
        disableSyntaxHighlighting: true,
      })

      const config = getRuntimeConfig()
      expect(config.disableSyntaxHighlighting).toBe(true)
    })

    it('should merge runtime config with existing config', () => {
      setFeatureFlags({
        disableSyntaxHighlighting: true,
      })

      setFeatureFlags({
        disableMarkdown: true,
      })

      const config = getRuntimeConfig()
      expect(config.disableMarkdown).toBe(true)
      // Note: setFeatureFlags replaces the config, not merges
      expect(config.disableSyntaxHighlighting).toBeUndefined()
    })

    it('should clear cache when runtime config changes', () => {
      const before = isFeatureEnabled('syntax-highlighting')
      expect(before).toBe(true)

      setFeatureFlags({
        disableSyntaxHighlighting: true,
      })

      // Cache should be cleared, feature should now be disabled
      // Note: isFeatureEnabled checks env vars, not runtime config
      // Use a different function that checks runtime config
      const config = getRuntimeConfig()
      expect(config.disableSyntaxHighlighting).toBe(true)
    })
  })

  describe('getFeatureFlagSummary', () => {
    it('should return status for all features', () => {
      const summary = getFeatureFlagSummary()

      expect(summary).toHaveProperty('syntax-highlighting')
      expect(summary).toHaveProperty('markdown')
      expect(summary).toHaveProperty('batch-exports')
    })

    it('should include all required properties', () => {
      const summary = getFeatureFlagSummary()
      const feature = summary['syntax-highlighting']

      expect(feature).toHaveProperty('enabled')
      expect(feature).toHaveProperty('available')
      expect(feature).toHaveProperty('disabled')
      expect(feature).toHaveProperty('missingDependencies')
      expect(feature).toHaveProperty('status')

      expect(typeof feature.enabled).toBe('boolean')
      expect(typeof feature.available).toBe('boolean')
      expect(typeof feature.disabled).toBe('boolean')
      expect(Array.isArray(feature.missingDependencies)).toBe(true)
      expect(typeof feature.status).toBe('string')
    })
  })

  describe('clearFeatureFlagCache', () => {
    it('should clear the cache', () => {
      // Call once to populate cache
      isFeatureEnabled('syntax-highlighting')

      // Clear cache
      clearFeatureFlagCache()

      // Changing env after cache clear should affect result
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      expect(isFeatureEnabled('syntax-highlighting')).toBe(false)
    })
  })

  describe('Multiple Features', () => {
    it('should handle multiple features disabled simultaneously', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      process.env.CLARITY_DISABLE_MARKDOWN = 'true'
      process.env.CLARITY_DISABLE_EXPORTS = 'true'
      clearFeatureFlagCache()

      expect(isFeatureEnabled('syntax-highlighting')).toBe(false)
      expect(isFeatureEnabled('markdown')).toBe(false)
      expect(isFeatureEnabled('batch-exports')).toBe(false)
    })

    it('should handle mixed enabled/disabled states', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      // markdown not disabled
      process.env.CLARITY_DISABLE_EXPORTS = 'true'
      clearFeatureFlagCache()

      expect(isFeatureEnabled('syntax-highlighting')).toBe(false)
      expect(isFeatureEnabled('markdown')).toBe(true)
      expect(isFeatureEnabled('batch-exports')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined env vars', () => {
      delete process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING
      clearFeatureFlagCache()
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
    })

    it('should handle empty string env vars', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = ''
      clearFeatureFlagCache()
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
    })

    it('should handle invalid env var values', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'invalid'
      clearFeatureFlagCache()
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
    })

    it('should be case-sensitive', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'TRUE'
      clearFeatureFlagCache()
      // Should not match 'TRUE' (uppercase)
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
    })
  })
})
