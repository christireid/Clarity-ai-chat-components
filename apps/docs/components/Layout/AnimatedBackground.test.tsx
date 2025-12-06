/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AnimatedBackground } from './AnimatedBackground'

// Mock tsparticles
vi.mock('@tsparticles/react', () => ({
  default: ({ 
    id, 
    options, 
    particlesLoaded 
  }: { 
    id?: string
    options?: unknown
    particlesLoaded?: (container: unknown) => void 
  }) => {
    // Simulate particles loaded callback
    if (particlesLoaded) {
      setTimeout(() => {
        particlesLoaded({
          refresh: vi.fn(),
          pause: vi.fn(),
          play: vi.fn(),
          destroy: vi.fn(),
        })
      }, 0)
    }
    return <div data-testid="particles" data-id={id} />
  },
  initParticlesEngine: vi.fn(() => Promise.resolve()),
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

  it('renders nothing when reduced motion is enabled', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(true)),
    })

    const { container } = renderWithTheme(<AnimatedBackground />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing initially before mount', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    // Component should return null initially
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className when provided', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mockMatchMedia(false)),
    })

    const { container } = renderWithTheme(
      <AnimatedBackground className="custom-class" />
    )

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

  it('handles matchMedia errors gracefully', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => {
        throw new Error('matchMedia not supported')
      }),
    })

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = renderWithTheme(<AnimatedBackground />)

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

    await waitFor(() => {
      expect(removeEventListenerSpy).toHaveBeenCalled()
    })

    unmount()

    // Verify cleanup was called
    expect(removeEventListenerSpy).toHaveBeenCalled()
    expect(removeDocumentListenerSpy).toHaveBeenCalled()
  })
})
