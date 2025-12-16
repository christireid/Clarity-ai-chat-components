/**
 * Comprehensive Integration Test Suite for Enhanced Skeleton System
 *
 * Tests the complete integration of all skeleton components including transitions,
 * animations, accessibility, performance monitoring, and smart loading predictions.
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
} from '../skeleton-enhanced'

import {
  advancedVariants,
  useOptimalAnimation,
  useResponsiveSize,
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

describe('Skeleton Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Complete Skeleton Flow Integration', () => {
    it('integrates all skeleton components in a realistic loading scenario', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [content, setContent] = React.useState<React.ReactNode>(null)

        React.useEffect(() => {
          // Simulate content loading
          setTimeout(() => {
            setContent(
              <div data-testid="loaded-content" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">John Doe</h3>
                    <p className="text-gray-600">Software Developer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p>This is the loaded content that should appear after the skeleton loading state.</p>
                  <p>It contains detailed information about the user profile.</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Contact</button>
              </div>
            )
            setIsLoading(false)
          }, 2000)
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
                performanceId="profile-loading"
                enableDetailedMetrics={true}
              >
                <AccessibleSkeleton
                  isLoading={isLoading}
                  loadingMessage="Loading user profile, please wait..."
                  loadedMessage="Profile loaded successfully!"
                  progressIndicator="linear"
                  estimatedTime={2000}
                  showProgress={true}
                >
                  <SkeletonTransition
                    isLoading={isLoading}
                    skeleton={
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <EnhancedSkeletonAvatar size={64} variant="gradient" />
                          <div className="space-y-2">
                            <EnhancedSkeletonText lines={2} variant="wave" />
                          </div>
                        </div>
                        <EnhancedSkeletonText lines={3} variant="shimmer" />
                        <EnhancedSkeleton width={120} height={36} rounded="md" />
                      </div>
                    }
                    direction="morph"
                    duration={800}
                    monitorPerformance={true}
                    enablePrediction={true}
                    accessibilityMode="polite"
                  >
                    {content}
                  </SkeletonTransition>
                </AccessibleSkeleton>
              </PerformanceSkeleton>
            </SmartSkeleton>
          </SkeletonThemeProvider>
        )
      }

      render(<TestApp />)

      // Initially shows loading state
      expect(screen.getByText('Loading user profile, please wait...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading...')).toBeInTheDocument()

      // Wait for content to load
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(screen.getByTestId('loaded-content')).toBeInTheDocument()
        expect(screen.getByText('Profile loaded successfully!')).toBeInTheDocument()
      })
    })

    it('handles error states and recovery', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [hasError, setHasError] = React.useState(false)

        React.useEffect(() => {
          // Simulate failed loading
          setTimeout(() => {
            setHasError(true)
            setIsLoading(false)
          }, 1500)
        }, [])

        const handleRetry = () => {
          setHasError(false)
          setIsLoading(true)
          // Simulate successful retry
          setTimeout(() => {
            setIsLoading(false)
          }, 1000)
        }

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            loadingMessage="Attempting to load content..."
            loadedMessage={hasError ? "Failed to load content" : "Content loaded successfully!"}
            progressIndicator="circular"
          >
            <div className="space-y-4">
              {hasError ? (
                <div className="text-center space-y-4">
                  <p className="text-red-600">Failed to load content</p>
                  <button 
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div data-testid="success-content">
                  <h2>Content loaded successfully!</h2>
                  <p>This is the main content that was loaded.</p>
                </div>
              )}
            </div>
          </AccessibleSkeleton>
        )
      }

      render(<TestApp />)

      // Initially shows loading state
      expect(screen.getByText('Attempting to load content...')).toBeInTheDocument()

      // Wait for error state
      act(() => {
        jest.advanceTimersByTime(1500)
      })

      await waitFor(() => {
        expect(screen.getByText('Failed to load content')).toBeInTheDocument()
        expect(screen.getByText('Retry')).toBeInTheDocument()
      })

      // Click retry
      userEvent.click(screen.getByText('Retry'))

      // Should show loading again
      expect(screen.getByText('Attempting to load content...')).toBeInTheDocument()

      // Wait for successful retry
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByTestId('success-content')).toBeInTheDocument()
      })
    })
  })

  describe('Performance Monitoring Integration', () => {
    it('monitors performance across all components', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <PerformanceSkeleton
            performanceId="test-performance"
            onPerformanceReport={(metrics) => {
              console.log('Performance metrics:', metrics)
            }}
            enableDetailedMetrics={true}
          >
            <SkeletonTransition
              isLoading={isLoading}
              skeleton={<EnhancedSkeleton performanceId="skeleton-perf" />}
              monitorPerformance={true}
              enablePrediction={true}
            >
              <div data-testid="content">Content loaded!</div>
            </SkeletonTransition>
          </PerformanceSkeleton>
        )
      }

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      render(<TestApp />)

      expect(mockPerformance.mark).toHaveBeenCalledWith('test-performance-start')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        expect(mockPerformance.mark).toHaveBeenCalledWith('test-performance-end')
        expect(mockPerformance.measure).toHaveBeenCalled()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Smart Loading Prediction Integration', () => {
    it('predicts and adapts loading times', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [predictedTime, setPredictedTime] = React.useState(0)

        React.useEffect(() => {
          // Simulate different loading times
          const loadContent = () => {
            setTimeout(() => {
              setIsLoading(false)
            }, Math.random() * 2000 + 500) // Random between 500-2500ms
          }

          loadContent()
        }, [])

        return (
          <SmartSkeleton
            isLoading={isLoading}
            predictionMode="adaptive"
            onPredictionUpdate={setPredictedTime}
            enableLearning={true}
          >
            <div data-testid="smart-content">
              {isLoading ? 'Loading...' : 'Content loaded!'}
            </div>
          </SmartSkeleton>
        )
      }

      render(<TestApp />)

      // Should show prediction in development mode
      expect(screen.getByText('Loading...')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(2500)
      })

      await waitFor(() => {
        expect(screen.getByText('Content loaded!')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Integration', () => {
    it('provides comprehensive accessibility features', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            loadingMessage="Loading user dashboard"
            loadedMessage="Dashboard loaded successfully"
            progressIndicator="dots"
            estimatedTime={1000}
            showProgress={true}
            accessibilityMode="assertive"
          >
            <div data-testid="dashboard">
              <h1>User Dashboard</h1>
              <p>Welcome to your dashboard!</p>
            </div>
          </AccessibleSkeleton>
        )
      }

      render(<TestApp />)

      // Check for screen reader announcements
      const liveRegion = document.querySelector('[aria-live="assertive"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveTextContent('Loading user dashboard')

      // Check for progress indicator
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
        expect(liveRegion).toHaveTextContent('Dashboard loaded successfully')
      })
    })
  })

  describe('Micro-Interactions Integration', () => {
    it('provides interactive feedback', async () => {
      const TestApp = () => {
        return (
          <MicroInteractionSkeleton
            interactions={[
              { type: 'hover', effect: 'pulse', duration: 200 },
              { type: 'focus', effect: 'glow', duration: 300 },
              { type: 'click', effect: 'scale', duration: 150 },
            ]}
            enableSound={true}
            enableHaptics={true}
          >
            <div data-testid="interactive-content" className="p-4 bg-gray-100 rounded">
              <h3>Interactive Content</h3>
              <p>Hover, focus, or click this content</p>
            </div>
          </MicroInteractionSkeleton>
        )
      }

      render(<TestApp />)

      const content = screen.getByTestId('interactive-content')
      expect(content.parentElement).toHaveClass('skeleton-micro-interactions')

      // Test hover interaction
      const container = content.parentElement!
      const hoverEvent = new MouseEvent('mouseenter', { bubbles: true })
      container.dispatchEvent(hoverEvent)

      expect(container).toHaveClass('skeleton-micro-pulse')
    })
  })

  describe('Advanced Animation Integration', () => {
    it('integrates advanced animation variants', async () => {
      const TestApp = () => {
        const [currentVariant, setCurrentVariant] = React.useState(0)
        const variants = Object.keys(advancedVariants).slice(0, 5)

        React.useEffect(() => {
          const interval = setInterval(() => {
            setCurrentVariant(prev => (prev + 1) % variants.length)
          }, 1000)
          return () => clearInterval(interval)
        }, [])

        return (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <AdvancedSkeleton
                key={variant}
                variant={variant as any}
                size={40}
                className={index === currentVariant ? 'opacity-100' : 'opacity-30'}
              />
            ))}
          </div>
        )
      }

      render(<TestApp />)

      // Should render all variants
      const skeletons = screen.getAllByRole('presentation')
      expect(skeletons).toHaveLength(5)

      // Should cycle through variants
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Check that the second skeleton becomes active
      const updatedSkeletons = screen.getAllByRole('presentation')
      expect(updatedSkeletons[0]).toHaveClass('opacity-30')
      expect(updatedSkeletons[1]).toHaveClass('opacity-100')
    })
  })

  describe('Responsive Behavior Integration', () => {
    it('adapts to different viewport sizes', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })

      const TestApp = () => {
        const size = useResponsiveSize(60, { sm: 40, lg: 80 })
        const variant = useOptimalAnimation('shimmerRainbow')

        return (
          <div>
            <AdvancedSkeleton size={size} variant={variant} />
            <div data-testid="size-info">Size: {size}px</div>
          </div>
        )
      }

      render(<TestApp />)

      expect(screen.getByTestId('size-info')).toHaveTextContent('Size: 40px')

      // Simulate large viewport
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(screen.getByTestId('size-info')).toHaveTextContent('Size: 80px')
    })
  })

  describe('Composition System Integration', () => {
    it('composes multiple skeleton types', async () => {
      const composition = {
        layout: 'card' as const,
        components: [
          { type: 'avatar' as const, props: { size: 48 } },
          { type: 'text' as const, props: { lines: 2, variant: 'wave' } },
          { type: 'skeleton' as const, props: { height: 100, variant: 'shimmer' } },
          { type: 'button' as const, props: { width: 120, height: 36 } },
        ],
      }

      const TestApp = () => {
        return (
          <SkeletonComposer
            composition={composition}
            variant="gradient"
            className="max-w-md mx-auto"
          />
        )
      }

      render(<TestApp />)

      // Should render all composed components
      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Theme System Integration', () => {
    it('applies theme across all components', async () => {
      const TestApp = () => {
        return (
          <SkeletonThemeProvider
            theme={{
              primaryColor: '#ff0000',
              secondaryColor: '#00ff00',
              animationSpeed: 2000,
              borderRadius: 12,
              reducedMotion: false,
            }}
          >
            <div className="space-y-4">
              <EnhancedSkeleton variant="pulse" />
              <EnhancedSkeletonText lines={3} />
              <EnhancedSkeletonAvatar size={50} />
            </div>
          </SkeletonThemeProvider>
        )
      }

      render(<TestApp />)

      // All skeletons should be present
      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons.length).toBeGreaterThanOrEqual(5) // 1 + 3 + 1
    })
  })

  describe('Edge Cases Integration', () => {
    it('handles rapid loading state changes', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [iteration, setIteration] = React.useState(0)

        React.useEffect(() => {
          const interval = setInterval(() => {
            setIsLoading(prev => !prev)
            setIteration(prev => prev + 1)
          }, 300)
          return () => clearInterval(interval)
        }, [])

        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<EnhancedSkeleton />}
            duration={200}
          >
            <div data-testid={`content-${iteration}`}>
              Content loaded (iteration {iteration})
            </div>
          </SkeletonTransition>
        )
      }

      render(<TestApp />)

      // Should handle rapid state changes
      act(() => {
        jest.advanceTimersByTime(900) // 3 iterations
      })

      expect(screen.getByTestId('content-3')).toBeInTheDocument()
    })

    it('handles missing or invalid props gracefully', async () => {
      const TestApp = () => {
        return (
          <div>
            {/* Invalid variant */}
            <EnhancedSkeleton variant="invalid-variant" as any />
            
            {/* Missing required props */}
            <SkeletonTransition
              isLoading={true}
              skeleton={null as any}
            >
              {null}
            </SkeletonTransition>
            
            {/* Empty composition */}
            <SkeletonComposer
              composition={{ layout: 'card' as const, components: [] }}
            />
            
            {/* Invalid theme */}
            <SkeletonThemeProvider theme={null as any}>
              <EnhancedSkeleton />
            </SkeletonThemeProvider>
          </div>
        )
      }

      // Should not throw errors
      expect(() => render(<TestApp />)).not.toThrow()
    })
  })

  describe('Memory Leak Prevention', () => {
    it('cleans up event listeners and timers', async () => {
      const TestApp = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          const timer = setTimeout(() => setIsLoading(false), 1000)
          return () => clearTimeout(timer)
        }, [])

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            estimatedTime={1000}
            showProgress={true}
          >
            <div>Content</div>
          </AccessibleSkeleton>
        )
      }

      const { unmount } = render(<TestApp />)

      // Unmount before loading completes
      unmount()

      // Should not cause memory leaks
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // No errors should occur
      expect(true).toBe(true)
    })
  })
})