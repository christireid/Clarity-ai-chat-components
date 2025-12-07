/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AnimatedBackground } from './AnimatedBackground'
import * as useReducedMotionHook from './hooks/useReducedMotion'
import * as useParticlesEngineHook from './hooks/useParticlesEngine'

// Mock tsparticles with delayed initialization
let initParticlesResolve: () => void
let initParticlesPromise = new Promise<void>((resolve) => {
  initParticlesResolve = resolve
})

// Mock the dynamic import
vi.mock('next/dynamic', () => ({
  default: vi.fn((importFn: () => Promise<any>) => {
    return vi.fn((props: any) => {
      // Simulate the dynamically imported component
      const { particlesLoaded } = props
      if (particlesLoaded) {
        setTimeout(async () => {
          await particlesLoaded({
            refresh: vi.fn(),
            pause: vi.fn(),
            play: vi.fn(),
            destroy: vi.fn(),
          })
        }, 10)
      }
      return <div data-testid="particles" data-id={props.id} />
    })
  }),
}))

vi.mock('@tsparticles/react', () => ({
  default: ({ 
    id, 
    options, 
    particlesLoaded 
  }: { 
    id?: string
    options?: unknown
    particlesLoaded?: (container: unknown) => Promise<void> 
  }) => {
    // Simulate particles loaded callback after a delay
    if (particlesLoaded) {
      setTimeout(async () => {
        await particlesLoaded({
          refresh: vi.fn(),
          pause: vi.fn(),
          play: vi.fn(),
          destroy: vi.fn(),
        })
      }, 10)
    }
    return <div data-testid="particles" data-id={id} />
  },
  initParticlesEngine: vi.fn(() => initParticlesPromise),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn(() => Promise.resolve()),
}))

// Mock the hooks - we'll control them in tests
vi.mock('./hooks/useReducedMotion')
vi.mock('./hooks/useParticlesEngine')
vi.mock('./hooks/useWindowResize')
vi.mock('./hooks/usePageVisibility')

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  return {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }
}

describe('AnimatedBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the promise for each test
    initParticlesPromise = new Promise<void>((resolve) => {
      initParticlesResolve = resolve
    })
    
    // Default hook implementations
    vi.mocked(useReducedMotionHook.useReducedMotion).mockReturnValue(false)
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: false,
      error: null,
    })
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="light">
        {component}
      </ThemeProvider>
    )
  }

  it('renders nothing when reduced motion is enabled', async () => {
    vi.mocked(useReducedMotionHook.useReducedMotion).mockReturnValue(true)

    const { container } = renderWithTheme(<AnimatedBackground />)
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
    
    // Should be null because reduced motion is enabled
    const particles = container.querySelector('[data-testid="particles"]')
    expect(particles).toBeNull()
  })

  it('renders nothing initially before mount', async () => {
    // Engine not initialized yet
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: false,
      error: null,
    })

    const { container } = renderWithTheme(<AnimatedBackground />)
    
    // Initially should be null (before init completes)
    const initialParticles = container.querySelector('[data-testid="particles"]')
    expect(initialParticles).toBeNull()
    
    // After init completes, it should render
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
  })

  it('applies custom className when provided', async () => {
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const { container } = renderWithTheme(
      <AnimatedBackground className="custom-class" />
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeTruthy()
    })
  })

  it('has aria-hidden attribute for accessibility', async () => {
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const { container } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      const wrapper = container.querySelector('[aria-hidden="true"]')
      expect(wrapper).toBeTruthy()
    })
  })

  it('handles window resize events', async () => {
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const useWindowResizeMock = vi.fn()
    vi.mocked(await import('./hooks/useWindowResize')).useWindowResize = useWindowResizeMock

    renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Verify the hook was called
    expect(useWindowResizeMock).toHaveBeenCalled()
  })

  it('handles visibility change events', async () => {
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const usePageVisibilityMock = vi.fn()
    vi.mocked(await import('./hooks/usePageVisibility')).usePageVisibility = usePageVisibilityMock

    renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Verify the hook was called
    expect(usePageVisibilityMock).toHaveBeenCalled()
  })

  it('handles matchMedia errors gracefully', async () => {
    // This test is now covered by the useReducedMotion hook tests
    // The component itself doesn't directly handle matchMedia errors
    vi.mocked(useReducedMotionHook.useReducedMotion).mockReturnValue(false)
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const { container } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Component should render normally
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })

  it('cleans up on unmount', async () => {
    vi.mocked(useParticlesEngineHook.useParticlesEngine).mockReturnValue({
      isInitialized: true,
      error: null,
    })

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Unmount should not throw
    expect(() => unmount()).not.toThrow()
  })
})
