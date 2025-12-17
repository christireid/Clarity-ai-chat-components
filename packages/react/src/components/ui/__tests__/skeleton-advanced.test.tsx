/**
 * Comprehensive Test Suite for Advanced Skeleton Components
 *
 * Tests all advanced animation variants, responsive behaviors,
 * performance monitoring, and edge cases for the zero-dependency system.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {
  AdvancedSkeleton,
  advancedVariants,
  advancedKeyframes,
  useOptimalAnimation,
  useResponsiveSize,
  useContainerSize,
  createResponsiveSkeleton,
  createParticleSystem,
  createGlitchEffect,
  createMorphingSystem,
  createOrganicAnimation,
  createNeonEffect,
  createWaveSystem,
  createRippleSystem,
} from '../skeleton-advanced'

// Mock performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => 1000),
  getEntries: jest.fn(() => []),
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? false : true,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock navigator
Object.defineProperty(navigator, 'deviceMemory', {
  value: 8,
  writable: true,
})

Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 8,
  writable: true,
})

describe('Advanced Skeleton Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('AdvancedSkeleton', () => {
    it('renders with default props', () => {
      render(<AdvancedSkeleton />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('advanced-skeleton')
    })

    it('applies custom variant', () => {
      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('skeleton-shimmer-rainbow')
    })

    it('respects reduced motion preference', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('skeleton-none')
    })

    it('adapts to low-end devices', () => {
      Object.defineProperty(navigator, 'deviceMemory', { value: 2, writable: true })
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, writable: true })

      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('skeleton-none')
    })

    it('applies responsive sizing', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })

      render(<AdvancedSkeleton size={50} responsive={{ sm: 32, lg: 60 }} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveStyle({ width: '32px', height: '32px' })
    })

    it('enables container queries', () => {
      render(<AdvancedSkeleton containerQueries={true} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('container-queries')
    })

    it('applies fluid sizing', () => {
      render(<AdvancedSkeleton fluid={true} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveStyle({ width: expect.stringContaining('clamp') })
    })

    it('applies aspect ratio', () => {
      render(<AdvancedSkeleton aspectRatio="16/9" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveStyle({ aspectRatio: '16/9' })
    })

    it('enables micro interactions', () => {
      render(<AdvancedSkeleton enableMicroInteractions={true} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('micro-interactions')
    })

    it('monitors performance', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1032) // 32ms

      render(<AdvancedSkeleton enablePerformanceMonitoring={true} />)
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('AdvancedSkeleton render took'))
      consoleSpy.mockRestore()
    })

    it('handles unknown variants gracefully', () => {
      render(<AdvancedSkeleton variant="unknown-variant" as any />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Animation Variants', () => {
    it('contains all expected variants', () => {
      const expectedVariants = [
        'shimmerAdvanced',
        'shimmerRainbow',
        'shimmerCircular',
        'physicsBounce',
        'physicsSpring',
        'physicsWobble',
        'morphCircleToSquare',
        'morphExpandContract',
        'morphSquashStretch',
        'particleFloat',
        'particleSpiral',
        'particleExplode',
        'waveSine',
        'waveCosine',
        'waveComplex',
        'rippleOut',
        'pulseRadial',
        'pulseHeartbeat',
        'glitchHorizontal',
        'glitchVertical',
        'glitchSkew',
        'organicBreath',
        'organicSway',
        'organicGrow',
        'neonFlicker',
        'glowPulse',
        'glowRadiate',
      ]

      expectedVariants.forEach(variant => {
        expect(advancedVariants[variant]).toBeDefined()
      })
    })

    it('has correct variant properties', () => {
      const variant = advancedVariants.shimmerAdvanced
      expect(variant).toMatchObject({
        name: 'shimmer-advanced',
        keyframes: 'shimmer-advanced',
        duration: '2s',
        easing: 'linear',
      })
    })

    it('includes CSS keyframes', () => {
      expect(advancedKeyframes).toContain('@keyframes shimmer-advanced')
      expect(advancedKeyframes).toContain('@keyframes physics-bounce')
      expect(advancedKeyframes).toContain('@keyframes morph-circle-to-square')
    })
  })

  describe('Custom Hooks', () => {
    describe('useOptimalAnimation', () => {
      it('returns none for reduced motion', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))

        const TestComponent = () => {
          const variant = useOptimalAnimation('shimmerRainbow')
          return <div data-testid="optimal-variant">{variant}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('optimal-variant')).toHaveTextContent('none')
      })

      it('returns original variant for high-end devices', () => {
        const TestComponent = () => {
          const variant = useOptimalAnimation('shimmerRainbow')
          return <div data-testid="optimal-variant">{variant}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('optimal-variant')).toHaveTextContent('shimmerRainbow')
      })

      it('listens to reduced motion changes', () => {
        const mockAddEventListener = jest.fn()
        const mockRemoveEventListener = jest.fn()

        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
          dispatchEvent: jest.fn(),
        }))

        const TestComponent = () => {
          const variant = useOptimalAnimation('shimmerRainbow')
          return <div data-testid="optimal-variant">{variant}</div>
        }

        const { unmount } = render(<TestComponent />)
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

        unmount()
        expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })
    })

    describe('useResponsiveSize', () => {
      it('returns correct size for viewport width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 640, writable: true })

        const TestComponent = () => {
          const size = useResponsiveSize(50, { sm: 40, lg: 60 })
          return <div data-testid="responsive-size">{size}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('responsive-size')).toHaveTextContent('40')
      })

      it('returns base size when no responsive config', () => {
        const TestComponent = () => {
          const size = useResponsiveSize(50)
          return <div data-testid="responsive-size">{size}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('responsive-size')).toHaveTextContent('50')
      })

      it('updates on window resize', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })

        const TestComponent = () => {
          const size = useResponsiveSize(50, { lg: 60 })
          return <div data-testid="responsive-size">{size}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('responsive-size')).toHaveTextContent('60')

        // Simulate resize
        Object.defineProperty(window, 'innerWidth', { value: 640, writable: true })
        act(() => {
          window.dispatchEvent(new Event('resize'))
        })

        expect(screen.getByTestId('responsive-size')).toHaveTextContent('50') // Base size
      })
    })

    describe('useContainerSize', () => {
      it('monitors container size', () => {
        const TestComponent = () => {
          const ref = React.useRef<HTMLDivElement>(null)
          const size = useContainerSize(ref)
          return (
            <div ref={ref} data-testid="container">
              {size.width}x{size.height}
            </div>
          )
        }

        render(<TestComponent />)
        expect(screen.getByTestId('container')).toHaveTextContent('0x0')
      })
    })
  })

  describe('Animation System Functions', () => {
    describe('createResponsiveSkeleton', () => {
      it('creates responsive styles', () => {
        const styles = createResponsiveSkeleton({
          baseSize: 50,
          responsive: { sm: 40, lg: 60 },
          containerQueries: true,
          fluid: true,
          aspectRatio: '16/9',
        })

        expect(styles).toContain('@media (max-width: 320px)')
        expect(styles).toContain('clamp(30px, 10vw, 78px)')
        expect(styles).toContain('aspect-ratio: 16/9')
      })

      it('handles missing responsive config', () => {
        const styles = createResponsiveSkeleton({
          baseSize: 50,
        })

        expect(styles).toContain('width: 50px')
        expect(styles).toContain('height: 50px')
      })
    })

    describe('createParticleSystem', () => {
      it('creates particle animation styles', () => {
        const styles = createParticleSystem('float', 5)
        expect(styles).toContain('@keyframes particle-float')
        expect(styles).toContain('particle-element')
      })

      it('handles different particle types', () => {
        const spiralStyles = createParticleSystem('spiral', 3)
        const explodeStyles = createParticleSystem('explode', 7)

        expect(spiralStyles).toContain('@keyframes particle-spiral')
        expect(explodeStyles).toContain('@keyframes particle-explode')
      })
    })

    describe('createGlitchEffect', () => {
      it('creates glitch animation styles', () => {
        const styles = createGlitchEffect('horizontal', 3)
        expect(styles).toContain('@keyframes glitch-horizontal')
        expect(styles).toContain('glitch-element')
      })

      it('handles different glitch types', () => {
        const verticalStyles = createGlitchEffect('vertical', 5)
        const skewStyles = createGlitchEffect('skew', 2)

        expect(verticalStyles).toContain('@keyframes glitch-vertical')
        expect(skewStyles).toContain('@keyframes glitch-skew')
      })
    })

    describe('createMorphingSystem', () => {
      it('creates morphing animation styles', () => {
        const styles = createMorphingSystem('circle-to-square', 2)
        expect(styles).toContain('@keyframes morph-circle-to-square')
        expect(styles).toContain('morph-element')
      })
    })

    describe('createOrganicAnimation', () => {
      it('creates organic animation styles', () => {
        const styles = createOrganicAnimation('breath', 3)
        expect(styles).toContain('@keyframes organic-breath')
        expect(styles).toContain('organic-element')
      })
    })

    describe('createNeonEffect', () => {
      it('creates neon animation styles', () => {
        const styles = createNeonEffect('flicker', '#00ff00')
        expect(styles).toContain('@keyframes neon-flicker')
        expect(styles).toContain('text-shadow')
      })
    })

    describe('createWaveSystem', () => {
      it('creates wave animation styles', () => {
        const styles = createWaveSystem('sine', 4)
        expect(styles).toContain('@keyframes wave-sine')
        expect(styles).toContain('wave-element')
      })
    })

    describe('createRippleSystem', () => {
      it('creates ripple animation styles', () => {
        const styles = createRippleSystem('out', 6)
        expect(styles).toContain('@keyframes ripple-out')
        expect(styles).toContain('ripple-element')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles missing navigator properties', () => {
      Object.defineProperty(navigator, 'deviceMemory', { value: undefined, writable: true })
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: undefined, writable: true })

      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })

    it('handles invalid variant names', () => {
      render(<AdvancedSkeleton variant="invalid-variant" as any />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })

    it('handles negative sizes', () => {
      render(<AdvancedSkeleton size={-50} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })

    it('handles zero sizes', () => {
      render(<AdvancedSkeleton size={0} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })

    it('handles very large sizes', () => {
      render(<AdvancedSkeleton size={9999} />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })

    it('handles null/undefined props', () => {
      render(
        <AdvancedSkeleton
          variant={null as any}
          size={null as any}
          responsive={null as any}
          containerQueries={null as any}
          fluid={null as any}
          aspectRatio={null as any}
          enableMicroInteractions={null as any}
          enablePerformanceMonitoring={null as any}
        />
      )
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Performance Monitoring', () => {
    it('monitors render performance', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1017) // 17ms

      render(<AdvancedSkeleton enablePerformanceMonitoring={true} />)
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('AdvancedSkeleton render took'))
      consoleSpy.mockRestore()
    })

    it('does not warn for fast renders', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1005) // 5ms

      render(<AdvancedSkeleton enablePerformanceMonitoring={true} />)
      
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    })

    it('respects reduced motion preference', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<AdvancedSkeleton variant="shimmerRainbow" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('skeleton-none')
    })
  })
})