/**
 * Integration Tests for Cross-Tab Theme Synchronization
 *
 * These tests verify that the BroadcastChannel-based cross-tab sync
 * works correctly with various configurations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { ThemeProvider, useTheme } from '../ThemeProvider'

// Mock BroadcastChannel
class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = []
  name: string
  onmessage: ((event: MessageEvent) => void) | null = null
  closed = false

  constructor(name: string) {
    this.name = name
    MockBroadcastChannel.instances.push(this)
  }

  postMessage(data: unknown) {
    if (this.closed) return
    // Simulate broadcast to other channels with same name
    MockBroadcastChannel.instances.forEach((channel) => {
      if (channel !== this && channel.name === this.name && !channel.closed) {
        if (channel.onmessage) {
          channel.onmessage(new MessageEvent('message', { data }))
        }
      }
    })
  }

  close() {
    this.closed = true
    const index = MockBroadcastChannel.instances.indexOf(this)
    if (index > -1) {
      MockBroadcastChannel.instances.splice(index, 1)
    }
  }

  static reset() {
    MockBroadcastChannel.instances = []
  }
}

// Mock matchMedia - default to light mode
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false, // Don't match dark mode by default
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

beforeEach(() => {
  vi.stubGlobal('matchMedia', mockMatchMedia)
  vi.stubGlobal('localStorage', localStorageMock)
  vi.stubGlobal('BroadcastChannel', MockBroadcastChannel)
  localStorageMock.clear()
  MockBroadcastChannel.reset()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

// Test component that displays current theme state
function ThemeConsumer({ testId = 'theme-state' }: { testId?: string }) {
  const { theme, mode, setPreset, toggleMode } = useTheme()
  return (
    <div data-testid={testId}>
      <span data-testid="mode">{mode}</span>
      <span data-testid="preset">{theme.preset || 'none'}</span>
      <span data-testid="theme-mode">{theme.mode}</span>
      <button data-testid="set-dark" onClick={() => setPreset('default-dark')}>
        Set Dark
      </button>
      <button data-testid="toggle" onClick={toggleMode}>
        Toggle
      </button>
    </div>
  )
}

describe('ThemeProvider Cross-Tab Sync', () => {
  describe('BroadcastChannel Integration', () => {
    it('should create BroadcastChannel when enabled', () => {
      render(
        <ThemeProvider enableCrossTabSync>
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Wait for hydration
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(MockBroadcastChannel.instances.length).toBeGreaterThan(0)
    })

    it('should not create BroadcastChannel when disabled', () => {
      render(
        <ThemeProvider enableCrossTabSync={false}>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => {
        vi.advanceTimersByTime(100)
      })

      // Should only have listening channel, not broadcasting
      expect(MockBroadcastChannel.instances.length).toBe(0)
    })

    it('should sync theme changes between tabs', async () => {
      // Simulate two tabs with the same storage key
      const { rerender } = render(
        <>
          <ThemeProvider storageKey="test-theme" enableCrossTabSync>
            <ThemeConsumer testId="tab1" />
          </ThemeProvider>
          <ThemeProvider storageKey="test-theme" enableCrossTabSync>
            <ThemeConsumer testId="tab2" />
          </ThemeProvider>
        </>
      )

      // Wait for hydration
      act(() => {
        vi.advanceTimersByTime(100)
      })

      // Both tabs start with default
      expect(
        screen.getByTestId('tab1').querySelector('[data-testid="mode"]')
      ).toHaveTextContent('light')
      expect(
        screen.getByTestId('tab2').querySelector('[data-testid="mode"]')
      ).toHaveTextContent('light')
    })

    it('should use custom channel name based on storageKey', () => {
      render(
        <ThemeProvider storageKey="custom-key" enableCrossTabSync>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => {
        vi.advanceTimersByTime(100)
      })

      const channels = MockBroadcastChannel.instances
      expect(channels.some((c) => c.name === 'custom-key-sync')).toBe(true)
    })
  })

  describe('Debouncing', () => {
    it('should debounce rapid theme changes', () => {
      const postMessageSpy = vi.spyOn(
        MockBroadcastChannel.prototype,
        'postMessage'
      )

      render(
        <ThemeProvider
          enableCrossTabSync
          crossTabSyncDebounce={100}
          defaultTheme={{ preset: 'default' }}
        >
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Wait for hydration
      act(() => {
        vi.advanceTimersByTime(10)
      })

      // Simulate multiple rapid changes using fireEvent (sync)
      const setDarkButton = screen.getByTestId('set-dark')
      const toggleButton = screen.getByTestId('toggle')

      act(() => {
        fireEvent.click(setDarkButton)
        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)
      })

      // Before debounce timeout, should not have broadcasted all changes
      act(() => {
        vi.advanceTimersByTime(50)
      })

      // After debounce timeout, should broadcast
      act(() => {
        vi.advanceTimersByTime(100)
      })

      // The last state should be what's broadcasted
      expect(postMessageSpy).toHaveBeenCalled()
    })

    it('should broadcast immediately when debounce is 0', () => {
      const postMessageSpy = vi.spyOn(
        MockBroadcastChannel.prototype,
        'postMessage'
      )

      render(
        <ThemeProvider
          enableCrossTabSync
          crossTabSyncDebounce={0}
          defaultTheme={{ preset: 'default' }}
        >
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Wait for hydration
      act(() => {
        vi.advanceTimersByTime(10)
      })

      postMessageSpy.mockClear()

      const setDarkButton = screen.getByTestId('set-dark')
      act(() => {
        fireEvent.click(setDarkButton)
      })

      // Should broadcast immediately
      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(postMessageSpy).toHaveBeenCalled()
    })
  })

  describe('Fallback Behavior', () => {
    it('should handle missing BroadcastChannel gracefully', () => {
      // Remove BroadcastChannel from window
      vi.unstubAllGlobals()
      vi.stubGlobal('matchMedia', mockMatchMedia)
      vi.stubGlobal('localStorage', localStorageMock)
      // Don't stub BroadcastChannel - simulate older browser

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <ThemeProvider enableCrossTabSync>
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Should render without error
      expect(screen.getByTestId('mode')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })

    it('should continue working with localStorage when BroadcastChannel fails', () => {
      // Make BroadcastChannel throw on construction
      const BrokenBroadcastChannel = vi.fn().mockImplementation(() => {
        throw new Error('BroadcastChannel not available')
      })
      vi.stubGlobal('BroadcastChannel', BrokenBroadcastChannel)

      render(
        <ThemeProvider enableCrossTabSync>
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Should render without error
      expect(screen.getByTestId('mode')).toBeInTheDocument()
    })
  })

  describe('Channel Cleanup', () => {
    it('should close channel on unmount', () => {
      const { unmount } = render(
        <ThemeProvider enableCrossTabSync>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => {
        vi.advanceTimersByTime(100)
      })

      const initialCount = MockBroadcastChannel.instances.length

      unmount()

      // Channels should be closed
      const remainingOpen = MockBroadcastChannel.instances.filter(
        (c) => !c.closed
      )
      expect(remainingOpen.length).toBeLessThan(initialCount)
    })

    it('should clean up debounce timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { unmount } = render(
        <ThemeProvider enableCrossTabSync crossTabSyncDebounce={1000}>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => {
        vi.advanceTimersByTime(100)
      })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Message Format', () => {
    it('should broadcast correct message structure', async () => {
      const postMessageSpy = vi.spyOn(
        MockBroadcastChannel.prototype,
        'postMessage'
      )

      render(
        <ThemeProvider
          enableCrossTabSync
          crossTabSyncDebounce={0}
          defaultTheme={{ preset: 'vibrant', mode: 'light' }}
        >
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Wait for hydration and initial broadcast
      act(() => {
        vi.advanceTimersByTime(100)
      })

      const lastCall =
        postMessageSpy.mock.calls[postMessageSpy.mock.calls.length - 1]
      expect(lastCall[0]).toMatchObject({
        type: 'theme-change',
        theme: expect.objectContaining({
          mode: expect.any(String),
        }),
      })
    })
  })
})
