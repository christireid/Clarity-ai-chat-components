import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useDebouncedStreamingAnnouncements,
  useStreamingFocusPreservation,
} from '../accessibility-helpers'

describe('Streaming Accessibility Features', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Clean up any remaining aria-live elements from announcements
    document.querySelectorAll('[aria-live]').forEach((el) => el.remove())
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('useDebouncedStreamingAnnouncements', () => {
    it('should debounce rapid announcements', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      // Simulate rapid streaming updates
      act(() => {
        result.current.announce('Hello', 'polite')
        result.current.announce('Hello world', 'polite')
        result.current.announce('Hello world!', 'polite')
      })

      // Should not have announced yet (debouncing)
      expect(document.querySelector('[aria-live="polite"]')).toBeNull()

      // Fast-forward past debounce delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      // Should have announced only the last message
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).not.toBeNull()
      expect(liveRegion?.textContent).toBe('Hello world!')
    })

    it('should not announce if content change is insignificant', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      // First announcement
      act(() => {
        result.current.announce('Hello world!', 'polite')
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      const firstAnnouncement = document.querySelector('[aria-live="polite"]')
      expect(firstAnnouncement?.textContent).toBe('Hello world!')

      // Remove first announcement
      firstAnnouncement?.remove()

      // Second announcement with minor change (<10%)
      act(() => {
        result.current.announce('Hello world!!', 'polite') // Only 1 char difference
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      // Should not have created a new announcement (change too small)
      expect(document.querySelector('[aria-live="polite"]')).toBeNull()
    })

    it('should announce if content change is significant', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      // First announcement
      act(() => {
        result.current.announce('Hi', 'polite')
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      const firstAnnouncement = document.querySelector('[aria-live="polite"]')
      expect(firstAnnouncement?.textContent).toBe('Hi')
      firstAnnouncement?.remove()

      // Second announcement with significant change (>10%)
      act(() => {
        result.current.announce('Hi there friend!', 'polite') // Much longer
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      // Should have announced the new message
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).not.toBeNull()
      expect(liveRegion?.textContent).toBe('Hi there friend!')
    })

    it('should clear pending announcements', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      act(() => {
        result.current.announce('Hello', 'polite')
      })

      // Clear before debounce completes
      act(() => {
        result.current.clear()
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      // Should not have announced
      expect(document.querySelector('[aria-live="polite"]')).toBeNull()
    })

    it('should cleanup on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      act(() => {
        result.current.announce('Hello', 'polite')
      })

      // Unmount before debounce completes
      unmount()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      // Should not have announced after unmount
      expect(document.querySelector('[aria-live="polite"]')).toBeNull()
    })

    it('should use custom debounce delay', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(1000)
      )

      act(() => {
        result.current.announce('Hello', 'polite')
      })

      // Should not announce before custom delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500)
      })
      expect(document.querySelector('[aria-live="polite"]')).toBeNull()

      // Should announce after custom delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      expect(document.querySelector('[aria-live="polite"]')).not.toBeNull()
    })

    it('should support assertive priority', async () => {
      const { result } = renderHook(() =>
        useDebouncedStreamingAnnouncements(500)
      )

      act(() => {
        result.current.announce('Urgent!', 'assertive')
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })

      const liveRegion = document.querySelector('[aria-live="assertive"]')
      expect(liveRegion).not.toBeNull()
      expect(liveRegion?.textContent).toBe('Urgent!')
    })
  })

  describe('useStreamingFocusPreservation', () => {
    beforeEach(() => {
      // Setup DOM
      document.body.innerHTML = `
        <div data-streaming-container>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
        </div>
      `
    })

    it('should preserve focus when streaming starts', () => {
      const button1 = document.getElementById('btn1') as HTMLElement
      button1.focus()
      expect(document.activeElement).toBe(button1)

      const { result } = renderHook(() => useStreamingFocusPreservation(true))

      // Should mark focus as needing preservation
      expect(result.current.shouldPreserveFocus).toBe(true)
      expect(result.current.focusedElementRef.current).toBe(button1)
    })

    it('should not preserve focus if element is outside container', () => {
      const externalButton = document.createElement('button')
      externalButton.id = 'external'
      document.body.appendChild(externalButton)
      externalButton.focus()

      const { result } = renderHook(() => useStreamingFocusPreservation(true))

      // Should not preserve focus for external element
      expect(result.current.shouldPreserveFocus).toBe(false)
      expect(result.current.focusedElementRef.current).toBeNull()

      document.body.removeChild(externalButton)
    })

    it('should restore focus when streaming ends', () => {
      const button1 = document.getElementById('btn1') as HTMLElement
      button1.focus()

      const { result, rerender } = renderHook(
        ({ isStreaming }) => useStreamingFocusPreservation(isStreaming),
        { initialProps: { isStreaming: true } }
      )

      // Focus should be preserved
      expect(result.current.shouldPreserveFocus).toBe(true)

      // Move focus to body (simulate focus loss during streaming)
      document.body.focus()

      // Stop streaming
      rerender({ isStreaming: false })

      // Focus should be restored to button1
      expect(document.activeElement).toBe(button1)
      expect(result.current.shouldPreserveFocus).toBe(false)
    })

    it('should not restore focus if user moved focus elsewhere', () => {
      const button1 = document.getElementById('btn1') as HTMLElement
      const button2 = document.getElementById('btn2') as HTMLElement
      button1.focus()

      const { result, rerender } = renderHook(
        ({ isStreaming }) => useStreamingFocusPreservation(isStreaming),
        { initialProps: { isStreaming: true } }
      )

      // User moves focus during streaming
      button2.focus()

      // Stop streaming
      rerender({ isStreaming: false })

      // Focus should remain on button2 (respect user's choice)
      expect(document.activeElement).toBe(button2)
    })

    it('should cleanup state when streaming ends', () => {
      const button1 = document.getElementById('btn1') as HTMLElement
      button1.focus()

      const { result, rerender } = renderHook(
        ({ isStreaming }) => useStreamingFocusPreservation(isStreaming),
        { initialProps: { isStreaming: true } }
      )

      expect(result.current.focusedElementRef.current).toBe(button1)

      // Stop streaming
      rerender({ isStreaming: false })

      // State should be cleared
      expect(result.current.focusedElementRef.current).toBeNull()
      expect(result.current.shouldPreserveFocus).toBe(false)
    })
  })
})
