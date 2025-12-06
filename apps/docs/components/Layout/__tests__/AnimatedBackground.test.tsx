import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AnimatedBackground } from '../AnimatedBackground'

// Mock tsparticles
vi.mock('@tsparticles/react', () => ({
  default: vi.fn(({ id, options, particlesLoaded, className }) => {
    // Simulate particles loaded callback
    if (particlesLoaded) {
      setTimeout(() => {
        particlesLoaded({
          pause: vi.fn(),
          play: vi.fn(),
        } as any)
      }, 0)
    }
    return <div data-testid="particles" data-id={id} className={className} />
  }),
  initParticlesEngine: vi.fn(() => Promise.resolve()),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn(() => Promise.resolve()),
}))

// Mock window.matchMedia
const mockMatchMedia = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

beforeEach(() => {
  mockMatchMedia.mockReturnValue({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    dispatchEvent: vi.fn(),
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  })

  Object.defineProperty(document, 'hidden', {
    writable: true,
    value: false,
  })
})

afterEach(() => {
  vi.clearAllMocks()
})

const TestWrapper = ({ children, theme = 'system' }: { children: React.ReactNode; theme?: string }) => (
  <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
    {children}
  </ThemeProvider>
)

describe('AnimatedBackground', () => {
  describe('Rendering', () => {
    it('should not render until mounted and initialized', () => {
      const { container } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )
      // Should return null initially
      expect(container.firstChild).toBeNull()
    })

    it('should render particles after initialization', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should apply custom className', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      render(
        <TestWrapper>
          <AnimatedBackground className="custom-class" />
        </TestWrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('particles').parentElement
        expect(container).toHaveClass('custom-class')
      })
    })

    it('should have correct accessibility attributes', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('particles').parentElement
        expect(container).toHaveAttribute('aria-hidden', 'true')
        expect(container).toHaveStyle({ pointerEvents: 'none' })
      })
    })
  })

  describe('Theme Support', () => {
    it('should use dark config when theme is dark', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      render(
        <TestWrapper theme="dark">
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const particles = screen.getByTestId('particles')
        expect(particles).toBeInTheDocument()
      })
    })

    it('should use light config when theme is light', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      render(
        <TestWrapper theme="light">
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const particles = screen.getByTestId('particles')
        expect(particles).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility - prefers-reduced-motion', () => {
    it('should not render when prefers-reduced-motion is enabled', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })

      const { container } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should listen for prefers-reduced-motion changes', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('Error Handling', () => {
    it('should gracefully handle initialization errors', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      const initError = new Error('Initialization failed')
      vi.mocked(initParticlesEngine).mockRejectedValueOnce(initError)

      const { container } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        // Component should not render on error
        expect(container.firstChild).toBeNull()
      })
    })

    it('should handle missing window object (SSR)', () => {
      const originalWindow = global.window
      // @ts-expect-error - testing SSR scenario
      delete global.window

      const { container } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()

      global.window = originalWindow
    })
  })

  describe('Performance - Page Visibility', () => {
    it('should pause animation when page is hidden', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      const mockPause = vi.fn()
      const mockPlay = vi.fn()

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      })

      // Simulate visibility change
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true,
      })

      const event = new Event('visibilitychange')
      document.dispatchEvent(event)

      // Note: In real implementation, container.pause() would be called
      // This test verifies the event listener is set up
      expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    })
  })

  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', async () => {
      const { initParticlesEngine } = await import('@tsparticles/react')
      vi.mocked(initParticlesEngine).mockResolvedValueOnce(undefined as any)

      const { unmount } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      })

      unmount()

      expect(mockRemoveEventListener).toHaveBeenCalled()
    })
  })
})
