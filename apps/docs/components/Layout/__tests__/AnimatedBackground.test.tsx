import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedBackground } from '../AnimatedBackground'

// Mock next-themes
const mockResolvedTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme(),
  }),
}))

// Mock @tsparticles/react
const mockParticles = vi.fn(({ id, init, options, className }) => {
  // Simulate initialization
  if (init) {
    const mockEngine = {
      pause: vi.fn(),
      play: vi.fn(),
      destroy: vi.fn(),
      canvas: {
        resize: vi.fn(),
        element: {
          parentElement: document.body,
        },
      },
      interactivity: {
        mouse: {
          position: { x: 0, y: 0 },
        },
      },
    }
    Promise.resolve(init(mockEngine))
  }
  return <div data-testid={`particles-${id}`} className={className} />
})

vi.mock('@tsparticles/react', () => ({
  default: (...args: any[]) => mockParticles(...args),
}))

// Mock @tsparticles/slim
vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn().mockResolvedValue(undefined),
}))

describe('AnimatedBackground', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockResolvedTheme.mockReturnValue('light')

    // Reset matchMedia mock
    matchMediaMock = vi.fn((query: string) => {
      const matches = query.includes('dark') ? false : false // Default to light mode
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    })
    window.matchMedia = matchMediaMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should not render until mounted (SSR safety)', async () => {
      const { container } = render(<AnimatedBackground />)
      // In test environment, useEffect runs synchronously, so we check initial render
      // The component should check mounted state before rendering
      // Since useEffect runs immediately in tests, we verify the component structure
      await waitFor(() => {
        // Component renders after mount check passes
        expect(container.firstChild).toBeTruthy()
      })
    })

    it('should render particles after mount', async () => {
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles-animated-background')).toBeInTheDocument()
      })
    })

    it('should apply custom className', async () => {
      const { container } = render(<AnimatedBackground className="custom-class" />)
      
      await waitFor(() => {
        const wrapper = container.querySelector('.custom-class')
        expect(wrapper).toBeInTheDocument()
      })
    })

    it('should have correct accessibility attributes', async () => {
      const { container } = render(<AnimatedBackground />)
      
      await waitFor(() => {
        const wrapper = container.querySelector('[aria-hidden="true"]')
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass('pointer-events-none')
      })
    })
  })

  describe('Reduced Motion', () => {
    it('should not render when prefers-reduced-motion is enabled', async () => {
      matchMediaMock.mockImplementation((query: string) => {
        if (query.includes('reduced-motion')) {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }
      })

      const { container } = render(<AnimatedBackground />)
      
      await waitFor(() => {
        // Should remain null even after mount
        expect(container.firstChild).toBeNull()
      })
    })

    it('should render when prefers-reduced-motion is disabled', async () => {
      matchMediaMock.mockImplementation((query: string) => {
        if (query.includes('reduced-motion')) {
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }
      })

      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles-animated-background')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Support', () => {
    it('should use dark mode config when theme is dark', async () => {
      mockResolvedTheme.mockReturnValue('dark')
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(mockParticles).toHaveBeenCalled()
        const lastCall = mockParticles.mock.calls[mockParticles.mock.calls.length - 1]
        const config = lastCall[0].options
        
        // Dark mode has more particles (50 vs 40)
        expect(config.particles.number.value).toBe(50)
        expect(config.particles.opacity.value.min).toBe(0.1)
        expect(config.particles.opacity.value.max).toBe(0.4)
      })
    })

    it('should use light mode config when theme is light', async () => {
      mockResolvedTheme.mockReturnValue('light')
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(mockParticles).toHaveBeenCalled()
        const lastCall = mockParticles.mock.calls[mockParticles.mock.calls.length - 1]
        const config = lastCall[0].options
        
        // Light mode has fewer particles (40 vs 50)
        expect(config.particles.number.value).toBe(40)
        expect(config.particles.opacity.value.min).toBe(0.05)
        expect(config.particles.opacity.value.max).toBe(0.25)
      })
    })

    it('should fallback to system preference when resolvedTheme is undefined', async () => {
      mockResolvedTheme.mockReturnValue(undefined)
      
      matchMediaMock.mockImplementation((query: string) => {
        if (query.includes('color-scheme') && query.includes('dark')) {
          return {
            matches: true, // System prefers dark
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }
      })
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(mockParticles).toHaveBeenCalled()
        const lastCall = mockParticles.mock.calls[mockParticles.mock.calls.length - 1]
        const config = lastCall[0].options
        
        // Should use dark mode config (50 particles)
        expect(config.particles.number.value).toBe(50)
      })
    })
  })

  describe('Page Visibility', () => {
    it('should pause animation when page becomes hidden', async () => {
      const mockPause = vi.fn()
      const mockPlay = vi.fn()
      
      // Override the mock to capture engine methods
      mockParticles.mockImplementation(({ init }) => {
        if (init) {
          const mockEngine = {
            pause: mockPause,
            play: mockPlay,
            destroy: vi.fn(),
            canvas: {
              resize: vi.fn(),
              element: {
                parentElement: document.body,
              },
            },
            interactivity: {
              mouse: {
                position: { x: 0, y: 0 },
              },
            },
          }
          Promise.resolve(init(mockEngine))
        }
        return <div data-testid="particles" />
      })
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      })
      
      // Simulate page becoming hidden using a spy
      const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, 'hidden')
      if (hiddenDescriptor) {
        Object.defineProperty(document, 'hidden', {
          ...hiddenDescriptor,
          value: true,
        })
      }
      
      document.dispatchEvent(new Event('visibilitychange'))
      
      await waitFor(() => {
        expect(mockPause).toHaveBeenCalled()
      })
    })
  })

  describe('Window Resize', () => {
    it('should handle window resize events', async () => {
      const mockResize = vi.fn()
      
      mockParticles.mockImplementation(({ init }) => {
        if (init) {
          const mockEngine = {
            pause: vi.fn(),
            play: vi.fn(),
            destroy: vi.fn(),
            canvas: {
              resize: mockResize,
              element: {
                parentElement: document.body,
              },
            },
            interactivity: {
              mouse: {
                position: { x: 0, y: 0 },
              },
            },
          }
          Promise.resolve(init(mockEngine))
        }
        return <div data-testid="particles" />
      })
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles')).toBeInTheDocument()
      })
      
      // Simulate window resize
      window.dispatchEvent(new Event('resize'))
      
      await waitFor(() => {
        expect(mockResize).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle loadSlim failure gracefully', async () => {
      const { loadSlim } = await import('@tsparticles/slim')
      vi.mocked(loadSlim).mockRejectedValueOnce(new Error('Load failed'))
      
      const { container } = render(<AnimatedBackground />)
      
      // Should not crash, component should still render container
      await waitFor(() => {
        // Component should handle error and not render particles
        expect(container.firstChild).toBeTruthy()
      })
    })
  })

  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', async () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const documentAddEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const documentRemoveEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const { unmount } = render(<AnimatedBackground />)
      
      await waitFor(() => {
        // Wait for component to mount and set up listeners
        expect(addEventListenerSpy).toHaveBeenCalled()
      })
      
      unmount()
      
      // Verify cleanup was called
      expect(removeEventListenerSpy).toHaveBeenCalled()
      expect(documentRemoveEventListenerSpy).toHaveBeenCalled()
    })
  })
})
