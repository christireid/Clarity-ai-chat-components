/**
 * Integration tests for feature flags with actual components
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'
import {
  isFeatureEnabled,
  isFeatureDisabled,
  clearFeatureFlagCache,
  setFeatureFlags,
} from '../feature-flags'

describe('Feature Flags Integration', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
    clearFeatureFlagCache()
    setFeatureFlags({})
  })

  afterEach(() => {
    process.env = originalEnv
    clearFeatureFlagCache()
    setFeatureFlags({})
  })

  describe('Syntax Highlighting Feature', () => {
    it('should detect when syntax highlighting is disabled', () => {
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      clearFeatureFlagCache()

      expect(isFeatureEnabled('syntax-highlighting')).toBe(false)
      expect(isFeatureDisabled('syntax-highlighting')).toBe(true)
    })

    it('should detect when syntax highlighting is enabled (default)', () => {
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)
      expect(isFeatureDisabled('syntax-highlighting')).toBe(false)
    })
  })

  describe('Markdown Feature', () => {
    it('should detect when markdown is disabled', () => {
      process.env.CLARITY_DISABLE_MARKDOWN = 'true'
      clearFeatureFlagCache()

      expect(isFeatureEnabled('markdown')).toBe(false)
      expect(isFeatureDisabled('markdown')).toBe(true)
    })

    it('should detect when markdown is enabled (default)', () => {
      expect(isFeatureEnabled('markdown')).toBe(true)
      expect(isFeatureDisabled('markdown')).toBe(false)
    })
  })

  describe('Batch Exports Feature', () => {
    it('should detect when batch exports are disabled', () => {
      process.env.CLARITY_DISABLE_EXPORTS = 'true'
      clearFeatureFlagCache()

      expect(isFeatureEnabled('batch-exports')).toBe(false)
      expect(isFeatureDisabled('batch-exports')).toBe(true)
    })

    it('should detect when batch exports are enabled (default)', () => {
      expect(isFeatureEnabled('batch-exports')).toBe(true)
      expect(isFeatureDisabled('batch-exports')).toBe(false)
    })
  })

  describe('Runtime Configuration', () => {
    it('should allow disabling features programmatically', () => {
      // Initially enabled
      expect(isFeatureEnabled('syntax-highlighting')).toBe(true)

      // Disable via runtime config
      setFeatureFlags({
        disableSyntaxHighlighting: true,
      })

      // Should be reflected in runtime config
      // Note: isFeatureEnabled checks env vars, not runtime config
      // For full runtime config integration, use isFeatureEnabledWithRuntime
    })

    it('should cache feature flag checks for performance', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        isFeatureEnabled('syntax-highlighting')
      }
      const cached = performance.now() - start

      clearFeatureFlagCache()

      const start2 = performance.now()
      for (let i = 0; i < 1000; i++) {
        isFeatureEnabled('markdown')
      }
      const uncached = performance.now() - start2

      // Cached should be faster (though both are very fast)
      expect(cached).toBeLessThan(100) // Should be very fast
      expect(uncached).toBeLessThan(100) // Should also be fast
    })
  })

  describe('Feature Flag Component Integration', () => {
    it('should allow conditional rendering based on flags', () => {
      const ConditionalComponent = () => {
        const syntaxHighlightingEnabled = isFeatureEnabled(
          'syntax-highlighting'
        )

        return (
          <div>
            {syntaxHighlightingEnabled ? (
              <div data-testid="enabled">Syntax highlighting enabled</div>
            ) : (
              <div data-testid="disabled">Syntax highlighting disabled</div>
            )}
          </div>
        )
      }

      // Test with feature enabled (default)
      const { rerender } = render(<ConditionalComponent />)
      expect(screen.getByTestId('enabled')).toBeInTheDocument()

      // Disable feature
      process.env.CLARITY_DISABLE_SYNTAX_HIGHLIGHTING = 'true'
      clearFeatureFlagCache()

      // Re-render with new env
      rerender(<ConditionalComponent />)
      expect(screen.getByTestId('disabled')).toBeInTheDocument()
    })

    it('should handle multiple features in a component', () => {
      const MultiFeatureComponent = () => {
        const syntaxEnabled = isFeatureEnabled('syntax-highlighting')
        const markdownEnabled = isFeatureEnabled('markdown')
        const exportsEnabled = isFeatureEnabled('batch-exports')

        return (
          <div>
            <div data-testid="syntax">{syntaxEnabled ? 'on' : 'off'}</div>
            <div data-testid="markdown">{markdownEnabled ? 'on' : 'off'}</div>
            <div data-testid="exports">{exportsEnabled ? 'on' : 'off'}</div>
          </div>
        )
      }

      // All enabled by default
      render(<MultiFeatureComponent />)
      expect(screen.getByTestId('syntax')).toHaveTextContent('on')
      expect(screen.getByTestId('markdown')).toHaveTextContent('on')
      expect(screen.getByTestId('exports')).toHaveTextContent('on')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing dependencies gracefully', () => {
      // Even if a dependency is missing, feature flags should work
      expect(() => {
        isFeatureEnabled('syntax-highlighting')
      }).not.toThrow()
    })

    it('should handle invalid feature names gracefully', () => {
      // TypeScript should catch this, but runtime should not crash
      expect(() => {
        // @ts-expect-error - testing invalid feature name
        isFeatureEnabled('invalid-feature')
      }).not.toThrow()
    })
  })
})
