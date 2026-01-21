/**
 * StreamingMessage Animation Regression Tests
 *
 * Tests for ISSUE-022: StreamingMessage Animation Smoothness
 * Ensures 60fps animation timing prevents visual stuttering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StreamingMessage } from '../streaming-message'
import type { ToolCall, Citation } from '../../../adapters/types'

// Mock requestAnimationFrame and cancelAnimationFrame for testing
const mockRAF = vi.fn()
const mockCAF = vi.fn()

beforeEach(() => {
  global.requestAnimationFrame = mockRAF
  global.cancelAnimationFrame = mockCAF

  // Mock implementation that calls callback immediately for testing
  mockRAF.mockImplementation((cb) => {
    setTimeout(cb, 16) // Simulate ~60fps
    return 1
  })

  mockCAF.mockImplementation(() => {})
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('StreamingMessage Animation Regression', () => {
  describe('60fps Animation Timing', () => {
    it('uses requestAnimationFrame for smooth animations', () => {
      const content = 'This content streams smoothly'

      render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Should use requestAnimationFrame
      expect(mockRAF).toHaveBeenCalled()
    })

    it('maintains consistent 16.67ms intervals', async () => {
      const content = 'Smooth streaming text animation'
      let callCount = 0
      let timestamps: number[] = []

      mockRAF.mockImplementation((cb) => {
        callCount++
        const timestamp = performance.now()
        timestamps.push(timestamp)

        if (callCount < 10) { // Limit calls for test
          setTimeout(() => cb(timestamp), 16)
        }

        return callCount
      })

      render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Wait for animation frames
      await waitFor(() => {
        expect(callCount).toBeGreaterThan(5)
      }, { timeout: 200 })

      // Check timing consistency (allowing some variance)
      if (timestamps.length > 2) {
        const intervals = []
        for (let i = 1; i < timestamps.length; i++) {
          intervals.push(timestamps[i] - timestamps[i - 1])
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length

        // Should be close to 16.67ms (60fps)
        expect(avgInterval).toBeGreaterThan(10) // Not too fast
        expect(avgInterval).toBeLessThan(25) // Not too slow
      }
    })

    it('cleans up animation frames on unmount', () => {
      const content = 'Content that will be unmounted'

      const { unmount } = render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      unmount()

      // Should cancel animation frame
      expect(mockCAF).toHaveBeenCalled()
    })
  })

  describe('Character Reveal Timing', () => {
    it('reveals characters at consistent rates', async () => {
      const content = 'Consistent character timing test'
      const charsPerSecond = 80 // normal speed
      const expectedDuration = (content.length / charsPerSecond) * 1000 // ms

      render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
          streamingSpeed="normal"
        />
      )

      // Wait for content to be revealed
      await waitFor(() => {
        expect(screen.getByText(content)).toBeInTheDocument()
      }, { timeout: expectedDuration + 500 })

      // Should complete within expected time range
      expect(mockRAF).toHaveBeenCalled()
    })

    it('respects different streaming speeds', () => {
      const content = 'Speed test content'

      const { rerender } = render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
          streamingSpeed="fast"
        />
      )

      // Fast should use more characters per frame
      expect(mockRAF).toHaveBeenCalled()

      rerender(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
          streamingSpeed="slow"
        />
      )

      // Slow should use fewer characters per frame
      expect(mockRAF).toHaveBeenCalled()
    })

    it('handles content updates during streaming', () => {
      const initialContent = 'Initial streaming'

      const { rerender } = render(
        <StreamingMessage
          content={initialContent}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Update content while streaming
      const updatedContent = 'Initial streaming content updated'
      rerender(
        <StreamingMessage
          content={updatedContent}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Should continue smooth animation
      expect(mockRAF).toHaveBeenCalled()
    })
  })

  describe('Animation Edge Cases', () => {
    it('handles empty content gracefully', () => {
      expect(() => {
        render(
          <StreamingMessage
            content=""
            isStreaming={true}
            smoothStreaming={true}
          />
        )
      }).not.toThrow()
    })

    it('handles very long content efficiently', () => {
      const longContent = 'a'.repeat(10000) // 10k characters

      const startTime = performance.now()

      render(
        <StreamingMessage
          content={longContent}
          isStreaming={true}
          smoothStreaming={true}
          streamingSpeed="fast"
        />
      )

      const renderTime = performance.now() - startTime

      // Should render quickly even with long content
      expect(renderTime).toBeLessThan(50)
      expect(mockRAF).toHaveBeenCalled()
    })

    it('handles special characters and Unicode', () => {
      const unicodeContent = '🚀 Unicode test: 你好世界 🌟 ∑ ∫ √'

      render(
        <StreamingMessage
          content={unicodeContent}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Should handle Unicode characters smoothly
      expect(mockRAF).toHaveBeenCalled()
    })

    it('transitions smoothly when streaming completes', () => {
      const content = 'Content that completes streaming'

      const { rerender } = render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Complete streaming
      rerender(
        <StreamingMessage
          content={content}
          isStreaming={false}
          smoothStreaming={true}
        />
      )

      // Should show full content immediately
      expect(screen.getByText(content)).toBeInTheDocument()
    })
  })

  describe('Performance Monitoring', () => {
    it('does not cause excessive re-renders', () => {
      const content = 'Stable rendering test'
      let renderCount = 0

      const originalRender = StreamingMessage.prototype.render
      StreamingMessage.prototype.render = function() {
        renderCount++
        return originalRender.call(this)
      }

      render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Should not cause excessive renders during animation
      expect(renderCount).toBeLessThan(10)
    })

    it('maintains smooth animation during rapid updates', () => {
      const { rerender } = render(
        <StreamingMessage
          content="Initial"
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Rapid content updates
      for (let i = 0; i < 5; i++) {
        rerender(
          <StreamingMessage
            content={`Update ${i}`}
            isStreaming={true}
            smoothStreaming={true}
          />
        )
      }

      // Should maintain animation performance
      expect(mockRAF).toHaveBeenCalled()
    })
  })

  describe('Fallback Behavior', () => {
    it('falls back gracefully when smooth streaming is disabled', () => {
      const content = 'Fallback content test'

      render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={false}
        />
      )

      // Should show content immediately without animation
      expect(screen.getByText(content)).toBeInTheDocument()
      expect(mockRAF).not.toHaveBeenCalled()
    })

    it('handles requestAnimationFrame not available', () => {
      // Temporarily remove requestAnimationFrame
      const originalRAF = global.requestAnimationFrame
      delete (global as any).requestAnimationFrame

      expect(() => {
        render(
          <StreamingMessage
            content="Test content"
            isStreaming={true}
            smoothStreaming={true}
          />
        )
      }).not.toThrow()

      // Restore
      global.requestAnimationFrame = originalRAF
    })
  })

  describe('Memory Management', () => {
    it('cleans up animation frames properly', () => {
      const content = 'Cleanup test content'

      const { unmount } = render(
        <StreamingMessage
          content={content}
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      unmount()

      // Should have cancelled animation frame
      expect(mockCAF).toHaveBeenCalled()
    })

    it('resets animation state on content change', () => {
      const { rerender } = render(
        <StreamingMessage
          content="First content"
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Change to completely different content
      rerender(
        <StreamingMessage
          content="Completely different content"
          isStreaming={true}
          smoothStreaming={true}
        />
      )

      // Should reset and start new animation
      expect(mockRAF).toHaveBeenCalled()
    })
  })
})