import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AnimatedBackground } from '../AnimatedBackground'

// Mock tsparticles
const mockParticlesLoaded = vi.fn()
const mockInitParticlesEngine = vi.fn(() => Promise.resolve())

vi.mock('@tsparticles/react', () => ({
  default: vi.fn(({ id, options, particlesLoaded, className }) => {
    // Simulate particles loaded callback after mount
    if (particlesLoaded) {
      // Use setTimeout to simulate async behavior
      setTimeout(() => {
        act(() => {
          particlesLoaded({
            pause: vi.fn(),
            play: vi.fn(),
          } as any)
        })
      }, 10)
    }
    return <div data-testid="particles" data-id={id} className={className} />
  }),
  initParticlesEngine: (...args: any[]) => mockInitParticlesEngine(...args),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn(() => Promise.resolve()),
}))

// Mock window.matchMedia
const mockMatchMedia = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()
const mockAddListener = vi.fn()
const mockRemoveListener = vi.fn()

beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks()
  mockInitParticlesEngine.mockResolvedValue(undefined)

  mockMatchMedia.mockReturnValue({
    matches: false,
    media: '',
    onchange: null,
    addListener: mockAddListener,
    removeListener: mockRemoveListener,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    dispatchEvent: vi.fn(),
  })

  // Ensure window exists before defining properties
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    })
  }

  // Only define document.hidden if it doesn't exist or is configurable
  try {
    const descriptor = Object.getOwnPropertyDescriptor(document, 'hidden')
    if (!descriptor || descriptor.configurable) {
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: false,
      })
    } else {
      // If not configurable, try to set the value directly
      // @ts-expect-error - test environment
      document.hidden = false
    }
  } catch {
    // Ignore if we can't set it
  }
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
    it('should not render until mounted and initialized', async () => {
      // Delay the mock resolution to test the initial null state
      mockInitParticlesEngine.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )
      
      // Immediately after render, particles should not be visible
      expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
      
      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Reset mock for other tests
      mockInitParticlesEngine.mockResolvedValue(undefined)
    })

    it('should render particles after initialization', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should apply custom className', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      render(
        <TestWrapper>
          <AnimatedBackground className="custom-class" />
        </TestWrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('particles').parentElement
        expect(container).toHaveClass('custom-class')
      }, { timeout: 2000 })
    })

    it('should have correct accessibility attributes', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('particles').parentElement
        expect(container).toHaveAttribute('aria-hidden', 'true')
        expect(container).toHaveStyle({ pointerEvents: 'none' })
      }, { timeout: 2000 })
    })
  })

  describe('Theme Support', () => {
    it('should use dark config when theme is dark', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      render(
        <TestWrapper theme="dark">
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const particles = screen.getByTestId('particles')
        expect(particles).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should use light config when theme is light', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      render(
        <TestWrapper theme="light">
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const particles = screen.getByTestId('particles')
        expect(particles).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Accessibility - prefers-reduced-motion', () => {
    it('should not render when prefers-reduced-motion is enabled', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Should not render particles when reduced motion is preferred
      expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
    })

    it('should listen for prefers-reduced-motion changes', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      // Should set up event listener (either addEventListener or addListener)
      expect(mockAddEventListener).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should gracefully handle initialization errors', async () => {
      const initError = new Error('Initialization failed')
      mockInitParticlesEngine.mockRejectedValueOnce(initError)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        // Component should not render on error
        expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle missing window.matchMedia gracefully', async () => {
      // This test verifies that the component's error handling works
      // The component has try-catch around matchMedia, so errors are caught
      // We test this by verifying the component still initializes successfully
      // even when matchMedia might fail (the error is caught in useEffect)
      
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      // Temporarily make matchMedia throw, but the component's try-catch will handle it
      const originalMatchMedia = window.matchMedia
      let matchMediaCallCount = 0
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => {
          matchMediaCallCount++
          if (matchMediaCallCount === 1) {
            // First call throws (simulating error)
            throw new Error('matchMedia not supported')
          }
          // Subsequent calls work (fallback behavior)
          return {
            matches: false,
            media: query,
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
            addListener: mockAddListener,
            removeListener: mockRemoveListener,
          }
        }),
      })

      // Component should render and initialize despite the error
      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      // Component should still initialize particles (error is caught and handled)
      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Restore
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      })
    })
  })

  describe('Performance - Page Visibility', () => {
    it('should set up visibility change listener after initialization', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      const originalAddEventListener = document.addEventListener
      const mockDocAddEventListener = vi.fn()
      document.addEventListener = mockDocAddEventListener

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Verify visibility change listener is set up
      expect(mockDocAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
      
      // Restore
      document.addEventListener = originalAddEventListener
    })
  })

  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', async () => {
      mockInitParticlesEngine.mockResolvedValueOnce(undefined)

      const originalRemoveEventListener = document.removeEventListener
      const mockDocRemoveEventListener = vi.fn()
      document.removeEventListener = mockDocRemoveEventListener

      const { unmount } = render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })

      unmount()

      // Should cleanup visibility change listener
      expect(mockDocRemoveEventListener).toHaveBeenCalled()
      // Should cleanup media query listener
      expect(mockRemoveEventListener).toHaveBeenCalled()
      
      // Restore
      document.removeEventListener = originalRemoveEventListener
    })
  })
})
