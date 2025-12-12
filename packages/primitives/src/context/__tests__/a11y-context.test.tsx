import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { A11yProvider, useA11y, useReducedMotionContext } from '../a11y-context'

// Test component that uses the context
function TestConsumer() {
  const { prefersReducedMotion, announce, announcementQueue } = useA11y()

  return (
    <div>
      <span data-testid="reduced-motion">
        {prefersReducedMotion ? 'reduced' : 'normal'}
      </span>
      <span data-testid="queue">{announcementQueue.join(',')}</span>
      <button onClick={() => announce('Test message')}>Announce</button>
      <button onClick={() => announce('Urgent!', { assertive: true })}>
        Announce Assertive
      </button>
    </div>
  )
}

// Test component for reduced motion hook
function ReducedMotionConsumer() {
  const prefersReducedMotion = useReducedMotionContext()
  return (
    <span data-testid="hook-result">
      {prefersReducedMotion ? 'reduced' : 'normal'}
    </span>
  )
}

describe('A11yProvider', () => {
  beforeEach(() => {
    // Clean up any existing announcer elements
    const root = document.getElementById('a11y-announcer-root')
    if (root) root.remove()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic rendering', () => {
    it('renders children', () => {
      render(
        <A11yProvider>
          <div data-testid="child">Hello</div>
        </A11yProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('uses shared announcer from aria.ts on mount', async () => {
      render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      // Trigger an announcement to create the shared announcer
      const button = screen.getByText('Announce')
      await act(async () => {
        button.click()
        await new Promise((r) => setTimeout(r, 50))
      })

      // Uses shared aria.ts announcer (id: clarity-aria-announcer)
      expect(
        document.getElementById('clarity-aria-announcer')
      ).toBeInTheDocument()
    })

    it('shared announcer has correct ARIA attributes', async () => {
      render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      // Trigger an announcement to create the shared announcer
      const button = screen.getByText('Announce')
      await act(async () => {
        button.click()
        await new Promise((r) => setTimeout(r, 50))
      })

      // The shared aria.ts announcer uses a single element that changes aria-live
      const announcer = document.getElementById('clarity-aria-announcer')
      expect(announcer).toHaveAttribute('role', 'status')
      expect(announcer).toHaveAttribute('aria-live', 'polite')
      expect(announcer).toHaveAttribute('aria-atomic', 'true')
    })
  })

  describe('reduced motion', () => {
    it('defaults to normal motion', () => {
      render(
        <A11yProvider>
          <TestConsumer />
        </A11yProvider>
      )

      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('normal')
    })

    it('respects forceReducedMotion prop', () => {
      render(
        <A11yProvider forceReducedMotion={true}>
          <TestConsumer />
        </A11yProvider>
      )

      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('reduced')
    })

    it('responds to media query changes', async () => {
      // Mock matchMedia
      const listeners: Array<(e: MediaQueryListEvent) => void> = []
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: (
          _: string,
          listener: (e: MediaQueryListEvent) => void
        ) => {
          listeners.push(listener)
        },
        removeEventListener: (
          _: string,
          listener: (e: MediaQueryListEvent) => void
        ) => {
          const idx = listeners.indexOf(listener)
          if (idx >= 0) listeners.splice(idx, 1)
        },
      }))
      window.matchMedia = mockMatchMedia

      render(
        <A11yProvider>
          <TestConsumer />
        </A11yProvider>
      )

      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('normal')

      // Simulate media query change
      act(() => {
        listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent))
      })

      await waitFor(() => {
        expect(screen.getByTestId('reduced-motion')).toHaveTextContent(
          'reduced'
        )
      })
    })
  })

  describe('announcements', () => {
    it('announces polite messages', async () => {
      render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      const button = screen.getByText('Announce')
      await act(async () => {
        button.click()
        // Wait for debounce and RAF
        await new Promise((r) => setTimeout(r, 50))
      })

      // Check if shared announcer element exists (uses aria.ts announcer)
      const announcer = document.getElementById('clarity-aria-announcer')
      // Verify the announcer element is created
      expect(announcer).toBeInTheDocument()
    })

    it('announces assertive messages', async () => {
      render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      const button = screen.getByText('Announce Assertive')
      await act(async () => {
        button.click()
        await new Promise((r) => setTimeout(r, 50))
      })

      // Uses shared aria.ts announcer (same element, changes aria-live attribute)
      const announcer = document.getElementById('clarity-aria-announcer')
      expect(announcer).toBeInTheDocument()
    })

    it('tracks announcement queue', async () => {
      render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      const button = screen.getByText('Announce')
      await act(async () => {
        button.click()
        await new Promise((r) => setTimeout(r, 100))
      })

      // The queue should be updated after announcement
      await waitFor(
        () => {
          expect(screen.getByTestId('queue').textContent).toBeTruthy()
        },
        { timeout: 1000 }
      )
    })

    it('debounces rapid announcements', async () => {
      render(
        <A11yProvider announceDebounce={50}>
          <TestConsumer />
        </A11yProvider>
      )

      const button = screen.getByText('Announce')

      // Rapid clicks
      await act(async () => {
        button.click()
        button.click()
        button.click()
        await new Promise((r) => setTimeout(r, 200))
      })

      // Should only have one announcement (the last debounced one)
      const queue = screen.getByTestId('queue').textContent || ''
      // Queue entries should be limited
      expect(queue.split(',').filter(Boolean).length).toBeLessThanOrEqual(1)
    })

    it('ignores empty messages', async () => {
      function EmptyAnnouncer() {
        const { announce, announcementQueue } = useA11y()
        return (
          <div>
            <span data-testid="queue">{announcementQueue.length}</span>
            <button onClick={() => announce('')}>Announce Empty</button>
            <button onClick={() => announce('   ')}>Announce Whitespace</button>
          </div>
        )
      }

      render(
        <A11yProvider announceDebounce={0}>
          <EmptyAnnouncer />
        </A11yProvider>
      )

      await act(async () => {
        screen.getByText('Announce Empty').click()
        screen.getByText('Announce Whitespace').click()
        await new Promise((r) => setTimeout(r, 50))
      })

      expect(screen.getByTestId('queue')).toHaveTextContent('0')
    })
  })

  describe('useA11y outside provider', () => {
    it('returns sensible defaults when used outside provider', () => {
      render(<TestConsumer />)

      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('normal')
      expect(screen.getByTestId('queue')).toHaveTextContent('')

      // Should not throw when clicking announce
      expect(() => screen.getByText('Announce').click()).not.toThrow()
    })
  })

  describe('useReducedMotionContext', () => {
    it('uses context value when available', () => {
      render(
        <A11yProvider forceReducedMotion={true}>
          <ReducedMotionConsumer />
        </A11yProvider>
      )

      expect(screen.getByTestId('hook-result')).toHaveTextContent('reduced')
    })

    it('falls back to media query when no provider', () => {
      render(<ReducedMotionConsumer />)

      // Default is normal motion
      expect(screen.getByTestId('hook-result')).toHaveTextContent('normal')
    })
  })

  describe('shared announcer', () => {
    it('uses shared aria.ts announcer that persists across unmounts', async () => {
      const { unmount } = render(
        <A11yProvider announceDebounce={0}>
          <TestConsumer />
        </A11yProvider>
      )

      // Trigger an announcement to ensure announcer is created
      const button = screen.getByText('Announce')
      await act(async () => {
        button.click()
        await new Promise((r) => setTimeout(r, 50))
      })

      // Verify shared announcer exists
      expect(
        document.getElementById('clarity-aria-announcer')
      ).toBeInTheDocument()

      unmount()

      // Shared announcer persists after unmount (intentional - shared resource)
      expect(
        document.getElementById('clarity-aria-announcer')
      ).toBeInTheDocument()
    })
  })
})
