import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import '@testing-library/jest-dom/vitest'
import { AnimatedBackground } from '../AnimatedBackground'

// Mock custom hooks
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}))

vi.mock('../hooks/useThemeMode', () => ({
  useThemeMode: vi.fn(() => false),
}))

vi.mock('../hooks/useParticlesEngine', () => ({
  useParticlesEngine: vi.fn(() => ({
    isInitialized: true,
    error: null,
    isLoading: false,
  })),
}))

vi.mock('../hooks/usePageVisibility', () => ({
  usePageVisibility: vi.fn(),
}))

// Mock tsparticles
vi.mock('@tsparticles/react', () => ({
  default: vi.fn(({ id, options, particlesLoaded, className }) => {
    // Simulate particles loaded callback after mount
    if (particlesLoaded) {
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
}))

// Import mocked hooks to control their behavior in tests
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useThemeMode } from '../hooks/useThemeMode'
import { useParticlesEngine } from '../hooks/useParticlesEngine'

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockUseThemeMode = vi.mocked(useThemeMode)
const mockUseParticlesEngine = vi.mocked(useParticlesEngine)

beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks()
  
  // Set default hook return values
  mockUseReducedMotion.mockReturnValue(false)
  mockUseThemeMode.mockReturnValue(false)
  mockUseParticlesEngine.mockReturnValue({
    isInitialized: true,
    error: null,
    isLoading: false,
  })
})

const TestWrapper = ({ children, theme = 'system' }: { children: React.ReactNode; theme?: string }) => (
  <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
    {children}
  </ThemeProvider>
)

describe('AnimatedBackground', () => {
  describe('Rendering', () => {
    it('should not render when not initialized', () => {
      mockUseParticlesEngine.mockReturnValue({
        isInitialized: false,
        error: null,
        isLoading: true,
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )
      
      expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
    })

    it('should render particles after initialization', async () => {
      mockUseParticlesEngine.mockReturnValue({
        isInitialized: true,
        error: null,
        isLoading: false,
      })

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
  })

  describe('Theme Support', () => {
    it('should use dark config when theme is dark', async () => {
      mockUseThemeMode.mockReturnValue(true)

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
      mockUseThemeMode.mockReturnValue(false)

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
    it('should not render when prefers-reduced-motion is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      // Should not render particles when reduced motion is preferred
      expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
    })

    it('should render when prefers-reduced-motion is disabled', async () => {
      mockUseReducedMotion.mockReturnValue(false)

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Error Handling', () => {
    it('should gracefully handle initialization errors', () => {
      const initError = new Error('Initialization failed')
      mockUseParticlesEngine.mockReturnValue({
        isInitialized: false,
        error: initError,
        isLoading: false,
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      // Component should not render on error
      expect(screen.queryByTestId('particles')).not.toBeInTheDocument()
    })

    it('should render when initialization succeeds after error', async () => {
      // Simulate recovery from error
      mockUseParticlesEngine.mockReturnValue({
        isInitialized: true,
        error: null,
        isLoading: false,
      })

      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Accessibility Attributes', () => {
    it('should have correct accessibility attributes', async () => {
      render(
        <TestWrapper>
          <AnimatedBackground />
        </TestWrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('particles').parentElement
        expect(container).toHaveAttribute('aria-hidden', 'true')
        expect(container).toHaveAttribute('role', 'presentation')
        expect(container).toHaveStyle({ pointerEvents: 'none' })
      }, { timeout: 2000 })
    })
  })

  describe('Props', () => {
    it('should apply custom className', async () => {
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
  })
})
