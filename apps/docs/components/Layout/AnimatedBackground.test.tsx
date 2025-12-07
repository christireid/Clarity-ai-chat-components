/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AnimatedBackground } from './AnimatedBackground'

// Mock tsparticles with delayed initialization
let initParticlesResolve: () => void
let initParticlesPromise = new Promise<void>((resolve) => {
  initParticlesResolve = resolve
})

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
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(true)),
    })

    const { container } = renderWithTheme(<AnimatedBackground />)
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
    
    // Should be null because reduced motion is enabled
    const particles = container.querySelector('[data-testid="particles"]')
    expect(particles).toBeNull()
  })

  it('renders nothing initially before mount', async () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    
    // Initially should be null (before init completes)
    const initialParticles = container.querySelector('[data-testid="particles"]')
    expect(initialParticles).toBeNull()
    
    // After init completes, it should render
    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })
  })

  it('applies custom className when provided', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const { container } = renderWithTheme(
      <AnimatedBackground className="custom-class" />
    )

    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeTruthy()
    })
  })

  it('has aria-hidden attribute for accessibility', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const { container } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      const wrapper = container.querySelector('[aria-hidden="true"]')
      expect(wrapper).toBeTruthy()
    })
  })

  it('handles window resize events', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { passive: true }
      )
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )
  })

  it('handles visibility change events', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      )
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    )
  })

  it('handles matchMedia errors gracefully', async () => {
    // Mock matchMedia to throw only for prefers-reduced-motion query
    const originalMatchMedia = window.matchMedia
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => {
        if (query.includes('prefers-reduced-motion')) {
          throw new Error('matchMedia not supported')
        }
        return originalMatchMedia.call(window, query)
      }),
    })

    await act(async () => {
      renderWithTheme(<AnimatedBackground />)
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'prefers-reduced-motion media query not supported:',
      expect.any(Error)
    )

    consoleWarnSpy.mockRestore()
  })

  it('cleans up event listeners on unmount', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const removeDocumentListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    await act(async () => {
      initParticlesResolve()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    unmount()

    // Verify cleanup was called
    expect(removeEventListenerSpy).toHaveBeenCalled()
    expect(removeDocumentListenerSpy).toHaveBeenCalled()
  })
})
