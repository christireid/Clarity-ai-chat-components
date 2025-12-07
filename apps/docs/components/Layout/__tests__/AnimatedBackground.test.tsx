import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedBackground } from '../AnimatedBackground'
import Particles from '@tsparticles/react'

// Mock custom hooks
const mockUseMediaQuery = vi.fn()
const mockUseThemeDetection = vi.fn()

vi.mock('../hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}))

vi.mock('../hooks/useThemeDetection', () => ({
  useThemeDetection: () => mockUseThemeDetection(),
}))

vi.mock('../hooks/useDebouncedCallback', () => ({
  useDebouncedCallback: (callback: () => void) => callback,
}))

// Mock @tsparticles/react
vi.mock('@tsparticles/react', () => {
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
  
  return {
    default: mockParticles,
  }
})


// Mock @tsparticles/slim
vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn().mockResolvedValue(undefined),
}))

describe('AnimatedBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mocks
    mockUseMediaQuery.mockReturnValue(false) // No reduced motion
    mockUseThemeDetection.mockReturnValue(false) // Light mode
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render particles when motion is not reduced', async () => {
      mockUseMediaQuery.mockReturnValue(false)
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles-animated-background')).toBeInTheDocument()
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
    it('should not render when prefers-reduced-motion is enabled', () => {
      mockUseMediaQuery.mockReturnValue(true) // Reduced motion enabled
      const { container } = render(<AnimatedBackground />)
      
      // Should return null when reduced motion is enabled
      expect(container.firstChild).toBeNull()
    })

    it('should render when prefers-reduced-motion is disabled', async () => {
      mockUseMediaQuery.mockReturnValue(false) // Reduced motion disabled
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(screen.getByTestId('particles-animated-background')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Support', () => {
    it('should use dark mode config when theme is dark', async () => {
      mockUseThemeDetection.mockReturnValue(true) // Dark mode
      mockUseMediaQuery.mockReturnValue(false) // No reduced motion
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(Particles).toHaveBeenCalled()
        const mockParticles = Particles as unknown as ReturnType<typeof vi.fn>
        const lastCall = mockParticles.mock.calls[mockParticles.mock.calls.length - 1]
        const config = lastCall[0].options
        
        // Dark mode has more particles (50 vs 40)
        expect(config.particles.number.value).toBe(50)
        expect(config.particles.opacity.value.min).toBe(0.1)
        expect(config.particles.opacity.value.max).toBe(0.4)
      })
    })

    it('should use light mode config when theme is light', async () => {
      mockUseThemeDetection.mockReturnValue(false) // Light mode
      mockUseMediaQuery.mockReturnValue(false) // No reduced motion
      
      render(<AnimatedBackground />)
      
      await waitFor(() => {
        expect(Particles).toHaveBeenCalled()
        const mockParticles = Particles as unknown as ReturnType<typeof vi.fn>
        const lastCall = mockParticles.mock.calls[mockParticles.mock.calls.length - 1]
        const config = lastCall[0].options
        
        // Light mode has fewer particles (40 vs 50)
        expect(config.particles.number.value).toBe(40)
        expect(config.particles.opacity.value.min).toBe(0.05)
        expect(config.particles.opacity.value.max).toBe(0.25)
      })
    })
  })

  describe('Page Visibility', () => {
    it('should pause animation when page becomes hidden', async () => {
      const mockPause = vi.fn()
      const mockPlay = vi.fn()
      
      // Override the mock to capture engine methods
      const mockParticles = Particles as unknown as ReturnType<typeof vi.fn>
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
      
      const mockParticles = Particles as unknown as ReturnType<typeof vi.fn>
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
