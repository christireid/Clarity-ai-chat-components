/**
 * Comprehensive Test Suite for Enhanced Skeleton Components
 *
 * Tests all new features including transitions, animations, accessibility,
 * performance monitoring, and smart loading predictions.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {
  EnhancedSkeleton,
  SkeletonTransition,
  EnhancedSkeletonText,
  EnhancedSkeletonAvatar,
  SkeletonComposer,
  SkeletonThemeProvider,
  AccessibleSkeleton,
  PerformanceSkeleton,
  SmartSkeleton,
  MicroInteractionSkeleton,
  AdvancedSkeleton,
  useOptimalAnimation,
  useResponsiveSize,
  useContainerSize,
} from '../skeleton-enhanced'

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

// Mock AudioContext
class MockAudioContext {
  createOscillator() {
    return {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: { setValueAtTime: jest.fn() },
      type: '',
    }
  }
  createGain() {
    return {
      connect: jest.fn(),
      gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
    }
  }
  get currentTime() {
    return 0
  }
}

Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
})

Object.defineProperty(window, 'webkitAudioContext', {
  value: MockAudioContext,
  writable: true,
})

// Mock vibrate API
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
})

describe('Enhanced Skeleton Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('EnhancedSkeleton', () => {
    it('renders with default props', () => {
      render(<EnhancedSkeleton />)
      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveAttribute('aria-busy', 'true')
      expect(skeleton).toHaveAttribute('aria-live', 'polite')
    })

    it('renders with custom props', () => {
      render(
        <EnhancedSkeleton
          variant="wave"
          width={200}
          height={50}
          rounded="lg"
          ariaLabel="Custom loading"
          performanceId="test-skeleton"
        />
      )
      
      const skeleton = screen.getByLabelText('Custom loading')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveStyle({ width: '200px', height: '50px' })
    })

    it('applies correct animation classes', () => {
      const { container } = render(<EnhancedSkeleton variant="pulse" />)
      const skeleton = container.querySelector('.skeleton-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('respects prefers-reduced-motion', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<EnhancedSkeleton variant="shimmer" />)
      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toHaveClass('skeleton-accessible')
    })
  })

  describe('SkeletonTransition', () => {
    it('transitions from skeleton to content', async () => {
      const { rerender } = render(
        <SkeletonTransition
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          direction="fade"
          duration={300}
        >
          <div data-testid="content">Content loaded!</div>
        </SkeletonTransition>
      )

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()

      // Transition to loaded state
      rerender(
        <SkeletonTransition
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          direction="fade"
          duration={300}
        >
          <div data-testid="content">Content loaded!</div>
        </SkeletonTransition>
      )

      // Wait for transition to complete
      act(() => {
        jest.advanceTimersByTime(350)
      })

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })

    it('supports different transition directions', () => {
      const directions = ['fade', 'slide-up', 'slide-down', 'scale', 'morph'] as const
      
      directions.forEach(direction => {
        const { container } = render(
          <SkeletonTransition
            isLoading={false}
            skeleton={<div>Skeleton</div>}
            direction={direction}
          >
            <div>Content</div>
          </SkeletonTransition>
        )
        
        expect(container.querySelector('.content-fade-in, .content-slide-up-in, .content-slide-down-in, .content-scale-in, .content-morph-in')).toBeInTheDocument()
      })
    })

    it('provides accessibility announcements', () => {
      render(
        <SkeletonTransition
          isLoading={true}
          skeleton={<div>Skeleton</div>}
          accessibilityMode="assertive"
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      const liveRegion = document.querySelector('[aria-live="assertive"]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('enables performance monitoring', () => {
      const { rerender } = render(
        <SkeletonTransition
          isLoading={true}
          skeleton={<div>Skeleton</div>}
          monitorPerformance={true}
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      expect(mockPerformance.mark).toHaveBeenCalledWith('skeleton-transition-start')

      rerender(
        <SkeletonTransition
          isLoading={false}
          skeleton={<div>Skeleton</div>}
          monitorPerformance={true}
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      expect(mockPerformance.mark).toHaveBeenCalledWith('skeleton-transition-end')
      expect(mockPerformance.measure).toHaveBeenCalledWith('skeleton-transition', 'skeleton-transition-start', 'skeleton-transition-end')
    })
  })

  describe('EnhancedSkeletonText', () => {
    it('renders text skeleton with custom props', () => {
      render(
        <EnhancedSkeletonText
          lines={5}
          lineHeight={20}
          gap={10}
          lastLineWidth={80}
          variant="wave"
          responsive={true}
        />
      )

      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons).toHaveLength(5)
    })

    it('optimizes for mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
      
      render(<EnhancedSkeletonText lines={5} responsive={true} />)
      
      // Should reduce lines on mobile
      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons.length).toBeLessThanOrEqual(2)
    })
  })

  describe('EnhancedSkeletonAvatar', () => {
    it('renders avatar skeleton with responsive sizing', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
      
      render(
        <EnhancedSkeletonAvatar
          size={50}
          variant="gradient"
          responsive={true}
        />
      )

      const avatar = screen.getByLabelText('Loading...')
      expect(avatar).toHaveStyle({ width: '32px', height: '32px' }) // Reduced for mobile
    })

    it('maintains original size on desktop', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      
      render(
        <EnhancedSkeletonAvatar
          size={50}
          variant="gradient"
          responsive={true}
        />
      )

      const avatar = screen.getByLabelText('Loading...')
      expect(avatar).toHaveStyle({ width: '50px', height: '50px' })
    })
  })

  describe('SkeletonComposer', () => {
    it('renders composed skeleton layouts', () => {
      const composition = {
        layout: 'card' as const,
        components: [
          { type: 'skeleton' as const, props: { height: 200 } },
          { type: 'text' as const, props: { lines: 3 } },
          { type: 'button' as const, props: {} },
        ],
      }

      render(
        <SkeletonComposer
          composition={composition}
          variant="gradient"
        />
      )

      expect(screen.getAllByLabelText('Loading...')).toHaveLength(4) // 1 skeleton + 3 text lines
    })

    it('supports different layout types', () => {
      const layouts = ['card', 'list', 'grid', 'message', 'form'] as const
      
      layouts.forEach(layout => {
        const composition = {
          layout,
          components: [{ type: 'skeleton' as const }],
        }

        const { container } = render(
          <SkeletonComposer
            composition={composition}
            variant="shimmer"
          />
        )

        expect(container.firstChild).toHaveClass(`grid`, `grid-cols-1`, `gap-4`)
      })
    })
  })

  describe('SkeletonThemeProvider', () => {
    it('provides theme context to children', () => {
      const TestComponent = () => {
        const theme = React.useContext(React.createContext({}))
        return <div data-testid="theme-consumer">{JSON.stringify(theme)}</div>
      }

      render(
        <SkeletonThemeProvider
          theme={{
            primaryColor: '#ff0000',
            secondaryColor: '#00ff00',
            animationSpeed: 1000,
          }}
        >
          <TestComponent />
        </SkeletonThemeProvider>
      )

      const consumer = screen.getByTestId('theme-consumer')
      expect(consumer.textContent).toContain('#ff0000')
      expect(consumer.textContent).toContain('#00ff00')
      expect(consumer.textContent).toContain('1000')
    })
  })

  describe('AccessibleSkeleton', () => {
    it('provides accessible loading states', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          loadingMessage="Custom loading message"
          loadedMessage="Custom loaded message"
          progressIndicator="linear"
          estimatedTime={2000}
          showProgress={true}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      expect(screen.getByText('Custom loading message')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows progress indicator', () => {
      const { rerender } = render(
        <AccessibleSkeleton
          isLoading={true}
          progressIndicator="circular"
          estimatedTime={2000}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      // Test different progress indicators
      rerender(
        <AccessibleSkeleton
          isLoading={true}
          progressIndicator="dots"
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const dots = screen.getAllByRole('presentation')
      expect(dots).toHaveLength(3)
    })

    it('transitions from loading to loaded state', async () => {
      const { rerender } = render(
        <AccessibleSkeleton
          isLoading={true}
          loadedMessage="Loaded successfully"
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      expect(screen.getByText('Loading content, please wait...')).toBeInTheDocument()

      rerender(
        <AccessibleSkeleton
          isLoading={false}
          loadedMessage="Loaded successfully"
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      await waitFor(() => {
        expect(screen.getByText('Loaded successfully')).toBeInTheDocument()
      })
    })
  })

  describe('PerformanceSkeleton', () => {
    it('monitors performance metrics', () => {
      const mockOnReport = jest.fn()
      
      const { unmount } = render(
        <PerformanceSkeleton
          performanceId="test-performance"
          onPerformanceReport={mockOnReport}
          enableDetailedMetrics={true}
        >
          <div>Content</div>
        </PerformanceSkeleton>
      )

      expect(mockPerformance.mark).toHaveBeenCalledWith('test-performance-start')

      unmount()

      expect(mockPerformance.mark).toHaveBeenCalledWith('test-performance-end')
      expect(mockPerformance.measure).toHaveBeenCalled()
      expect(mockOnReport).toHaveBeenCalled()
    })
  })

  describe('SmartSkeleton', () => {
    it('predicts loading duration', () => {
      const mockOnUpdate = jest.fn()
      
      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="conservative"
          onPredictionUpdate={mockOnUpdate}
          enableLearning={true}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(mockOnUpdate).toHaveBeenCalled()
      const predictedDuration = mockOnUpdate.mock.calls[0][0]
      expect(predictedDuration).toBeGreaterThan(0)
    })

    it('adapts prediction mode', () => {
      const modes = ['conservative', 'aggressive', 'adaptive'] as const
      
      modes.forEach(mode => {
        const mockOnUpdate = jest.fn()
        
        render(
          <SmartSkeleton
            isLoading={true}
            predictionMode={mode}
            onPredictionUpdate={mockOnUpdate}
          >
            <div>Content</div>
          </SmartSkeleton>
        )

        expect(mockOnUpdate).toHaveBeenCalled()
      })
    })
  })

  describe('MicroInteractionSkeleton', () => {
    it('adds micro-interactions', () => {
      const interactions = [
        { type: 'hover' as const, effect: 'pulse' as const, duration: 200 },
        { type: 'focus' as const, effect: 'glow' as const, duration: 300 },
      ]

      render(
        <MicroInteractionSkeleton
          interactions={interactions}
          enableSound={true}
          enableHaptics={true}
        >
          <div>Interactive content</div>
        </MicroInteractionSkeleton>
      )

      const content = screen.getByText('Interactive content')
      expect(content.parentElement).toHaveClass('skeleton-micro-interactions')
    })

    it('plays sound effects', () => {
      const mockAudioContext = new (window as any).AudioContext()
      
      render(
        <MicroInteractionSkeleton
          interactions={[{ type: 'hover' as const, effect: 'pulse' as const }]}
          enableSound={true}
        >
          <div>Interactive content</div>
        </MicroInteractionSkeleton>
      )

      // Simulate hover event
      const container = screen.getByText('Interactive content').parentElement!
      const event = new MouseEvent('mouseenter', { bubbles: true })
      container.dispatchEvent(event)

      expect(mockAudioContext.createOscillator).toHaveBeenCalled()
    })

    it('provides haptic feedback', () => {
      const mockVibrate = jest.fn()
      Object.defineProperty(navigator, 'vibrate', { value: mockVibrate, writable: true })
      
      render(
        <MicroInteractionSkeleton
          interactions={[{ type: 'hover' as const, effect: 'pulse' as const, duration: 200 }]}
          enableHaptics={true}
        >
          <div>Interactive content</div>
        </MicroInteractionSkeleton>
      )

      const container = screen.getByText('Interactive content').parentElement!
      const event = new MouseEvent('mouseenter', { bubbles: true })
      container.dispatchEvent(event)

      expect(mockVibrate).toHaveBeenCalledWith(200)
    })
  })

  describe('AdvancedSkeleton', () => {
    it('renders with optimal animation based on device capabilities', () => {
      // Mock low-end device
      Object.defineProperty(navigator, 'deviceMemory', { value: 2, writable: true })
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, writable: true })
      
      render(
        <AdvancedSkeleton
          variant="shimmerAdvanced"
          size={50}
          responsive={{ sm: 40, lg: 60 }}
          containerQueries={true}
          fluid={false}
          enableMicroInteractions={true}
          enablePerformanceMonitoring={true}
        />
      )

      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('advanced-skeleton')
    })

    it('adapts to different viewport sizes', () => {
      Object.defineProperty(window, 'innerWidth', { value: 640, writable: true })
      
      render(
        <AdvancedSkeleton
          variant="shimmerAdvanced"
          size={50}
          responsive={{ sm: 40, lg: 60 }}
        />
      )

      // Size should be adapted for small viewport
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  describe('Custom Hooks', () => {
    describe('useOptimalAnimation', () => {
      it('returns reduced animation for low-end devices', () => {
        Object.defineProperty(navigator, 'deviceMemory', { value: 2, writable: true })
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, writable: true })
        
        const TestComponent = () => {
          const variant = useOptimalAnimation('shimmerAdvanced')
          return <div data-testid="optimal-variant">{variant}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('optimal-variant')).toHaveTextContent('none')
      })

      it('returns original variant for high-end devices', () => {
        Object.defineProperty(navigator, 'deviceMemory', { value: 8, writable: true })
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, writable: true })
        
        const TestComponent = () => {
          const variant = useOptimalAnimation('shimmerAdvanced')
          return <div data-testid="optimal-variant">{variant}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('optimal-variant')).toHaveTextContent('shimmerAdvanced')
      })
    })

    describe('useResponsiveSize', () => {
      it('returns appropriate size for viewport width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 640, writable: true })
        
        const TestComponent = () => {
          const size = useResponsiveSize(50, { sm: 40, lg: 60 })
          return <div data-testid="responsive-size">{size}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('responsive-size')).toHaveTextContent('40')
      })
    })

    describe('useContainerSize', () => {
      it('monitors container size changes', () => {
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

  describe('Performance Monitoring', () => {
    it('logs performance warnings for slow renders', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      // Mock slow render
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1032) // 32ms
      
      render(
        <AdvancedSkeleton
          variant="shimmerAdvanced"
          enablePerformanceMonitoring={true}
        />
      )

      expect(consoleSpy).toHaveBeenCalledWith('AdvancedSkeleton render took 32ms (variant: shimmerAdvanced)')
      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('handles missing animation variants gracefully', () => {
      render(
        <AdvancedSkeleton
          variant="nonexistent-variant" as any
        />
      )
      
      // Should fall back to shimmerAdvanced
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })

    it('handles missing composition components', () => {
      const composition = {
        layout: 'card' as const,
        components: [
          { type: 'unknown-type' as any },
        ],
      }

      render(
        <SkeletonComposer
          composition={composition}
        />
      )

      // Should not throw error
      expect(screen.queryByLabelText('Loading...')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero duration gracefully', () => {
      render(
        <SkeletonTransition
          isLoading={false}
          skeleton={<div>Skeleton</div>}
          direction="fade"
          duration={0}
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles negative values gracefully', () => {
      render(
        <EnhancedSkeletonText
          lines={-1}
          lineHeight={-16}
          gap={-8}
        />
      )

      // Should handle negative values without crashing
      expect(screen.queryAllByLabelText('Loading...')).toHaveLength(0)
    })

    it('handles very large numbers', () => {
      render(
        <EnhancedSkeleton
          width={999999}
          height={999999}
          transitionDuration={999999}
        />
      )

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toHaveStyle({ width: '999999px', height: '999999px' })
    })

    it('handles null and undefined props', () => {
      render(
        <EnhancedSkeleton
          width={null as any}
          height={undefined as any}
          variant={null as any}
          rounded={null as any}
        />
      )

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('integrates multiple enhanced features', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <SkeletonThemeProvider
            theme={{
              primaryColor: '#f0f0f0',
              secondaryColor: '#e0e0e0',
              animationSpeed: 1500,
            }}
          >
            <SmartSkeleton
              isLoading={isLoading}
              predictionMode="adaptive"
              enableLearning={true}
            >
              <PerformanceSkeleton
                performanceId="integrated-test"
                enableDetailedMetrics={true}
              >
                <AccessibleSkeleton
                  isLoading={isLoading}
                  progressIndicator="linear"
                  estimatedTime={2000}
                  showProgress={true}
                >
                  <SkeletonTransition
                    isLoading={isLoading}
                    skeleton={
                      <div className="space-y-4">
                        <EnhancedSkeletonAvatar size={60} variant="gradient" />
                        <EnhancedSkeletonText lines={3} variant="wave" />
                      </div>
                    }
                    direction="morph"
                    duration={500}
                    monitorPerformance={true}
                    enablePrediction={true}
                    accessibilityMode="polite"
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full" />
                      <div className="space-y-2">
                        <h3>Loaded Content</h3>
                        <p>This content has been loaded successfully!</p>
                      </div>
                    </div>
                  </SkeletonTransition>
                </AccessibleSkeleton>
              </PerformanceSkeleton>
            </SmartSkeleton>
          </SkeletonThemeProvider>
        )
      }

      render(<TestApp />)

      // Initially shows loading state
      expect(screen.getByText('Loading content, please wait...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      // Wait for content to load
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByText('Loaded Content')).toBeInTheDocument()
        expect(screen.getByText('This content has been loaded successfully!')).toBeInTheDocument()
      })
    })
  })
})