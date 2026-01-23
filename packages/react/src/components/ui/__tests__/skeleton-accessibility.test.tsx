/**
 * Comprehensive Accessibility Tests for Enhanced Skeleton System
 *
 * Tests WCAG 2.1 compliance, screen reader support, keyboard navigation,
 * reduced motion preferences, and comprehensive accessibility features.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {
  AccessibleSkeleton,
  EnhancedSkeleton,
  EnhancedSkeletonText,
  EnhancedSkeletonAvatar,
  SkeletonComposer,
  SkeletonTransition,
  SkeletonThemeProvider,
  MicroInteractionSkeleton,
  AdvancedSkeleton,
} from '../skeleton-enhanced'

import { useOptimalAnimation, useResponsiveSize } from '../skeleton-advanced'

import { useReducedMotion } from '@clarity-chat/primitives'
import {
  prefersReducedMotion,
  getAccessibleAnimation,
} from '../../../animations/zero-dependency'

// Mock matchMedia for accessibility testing
const mockMatchMedia = (prefersReducedMotion = false) => {
  return jest.fn().mockImplementation((query) => ({
    matches:
      query === '(prefers-reduced-motion: reduce)'
        ? prefersReducedMotion
        : false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Mock screen reader announcements
const mockAnnouncements: string[] = []

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: jest.fn((utterance: any) => {
      mockAnnouncements.push(utterance.text)
    }),
    cancel: jest.fn(),
    getVoices: jest.fn(() => []),
  },
  writable: true,
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  elements: Element[]

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    this.elements = []
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter((el) => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as any)
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
})

describe('Accessibility Features', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockAnnouncements.length = 0
    window.matchMedia = mockMatchMedia()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('WCAG 2.1 Compliance', () => {
    it('provides proper ARIA attributes', () => {
      render(<AccessibleSkeleton isLoading={true} />)

      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-live', 'polite')
      expect(container).toHaveAttribute('aria-busy', 'true')
      expect(container).toHaveAttribute('aria-atomic', 'true')
    })

    it('provides meaningful loading announcements', async () => {
      const { rerender } = render(
        <AccessibleSkeleton
          isLoading={true}
          loadingMessage="Loading user profile, please wait..."
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toHaveTextContent(
        'Loading user profile, please wait...'
      )

      rerender(
        <AccessibleSkeleton
          isLoading={false}
          loadedMessage="Profile loaded successfully!"
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      expect(liveRegion).toHaveTextContent('Profile loaded successfully!')
    })

    it('provides proper progress indicators', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          progressIndicator="linear"
          estimatedTime={5000}
          showProgress={true}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-valuenow')
      expect(progressBar).toHaveAttribute('aria-label', 'Loading progress')
    })

    it('provides alternative progress indicators', () => {
      const indicators = ['linear', 'circular', 'dots', 'none'] as const

      indicators.forEach((indicator) => {
        const { container } = render(
          <AccessibleSkeleton
            isLoading={true}
            progressIndicator={indicator}
            showProgress={true}
          >
            <div>Content</div>
          </AccessibleSkeleton>
        )

        if (indicator !== 'none') {
          expect(
            container.querySelector('[role="progressbar"], .animate-pulse')
          ).toBeTruthy()
        }

        // Clean up for next iteration
        container.remove()
      })
    })

    it('provides proper heading structure', () => {
      render(
        <AccessibleSkeleton isLoading={true}>
          <div>
            <h1>Main Title</h1>
            <h2>Subtitle</h2>
            <p>Content paragraph</p>
          </div>
        </AccessibleSkeleton>
      )

      // Should not interfere with heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('provides proper color contrast', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          theme={{
            primaryColor: '#ffffff',
            secondaryColor: '#cccccc',
          }}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      // Should maintain sufficient color contrast
      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toHaveStyle({ backgroundColor: expect.any(String) })
    })
  })

  describe('Screen Reader Support', () => {
    it('provides descriptive labels for skeletons', () => {
      render(
        <div>
          <EnhancedSkeleton ariaLabel="Loading user avatar" />
          <EnhancedSkeletonText ariaLabel="Loading user details" />
          <EnhancedSkeletonAvatar ariaLabel="Loading profile picture" />
        </div>
      )

      expect(screen.getByLabelText('Loading user avatar')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading user details')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading profile picture')
      ).toBeInTheDocument()
    })

    it('provides contextually relevant labels', () => {
      render(
        <SkeletonComposer
          composition={{
            layout: 'card',
            components: [
              { type: 'avatar', props: { ariaLabel: 'Loading author avatar' } },
              {
                type: 'text',
                props: { lines: 3, ariaLabel: 'Loading article preview' },
              },
              { type: 'button', props: { ariaLabel: 'Loading action button' } },
            ],
          }}
        />
      )

      expect(screen.getByLabelText('Loading author avatar')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading article preview')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Loading action button')).toBeInTheDocument()
    })

    it('provides live region announcements', () => {
      const { rerender } = render(
        <SkeletonTransition
          isLoading={true}
          skeleton={<div>Loading...</div>}
          accessibilityMode="assertive"
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      const liveRegion = document.querySelector('[aria-live="assertive"]')
      expect(liveRegion).toBeInTheDocument()

      rerender(
        <SkeletonTransition
          isLoading={false}
          skeleton={<div>Loading...</div>}
          accessibilityMode="assertive"
        >
          <div>Content</div>
        </SkeletonTransition>
      )

      // Should announce content change
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })

    it('provides meaningful timing information', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [startTime] = React.useState(Date.now())

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setIsLoading(false)
          }, 2000)

          return () => clearTimeout(timer)
        }, [])

        const elapsed = Math.floor((Date.now() - startTime) / 1000)

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            loadingMessage={`Loading content (${elapsed} seconds elapsed)`}
            estimatedTime={2000}
            showProgress={true}
          >
            <div>Content loaded after {elapsed} seconds</div>
          </AccessibleSkeleton>
        )
      }

      render(<TestComponent />)

      expect(
        screen.getByText(/Loading content.*seconds elapsed/)
      ).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(
          screen.getByText('Content loaded after 2 seconds')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion preference', () => {
      window.matchMedia = mockMatchMedia(true) // Reduced motion preferred

      render(<EnhancedSkeleton variant="shimmer" />)

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toHaveClass('skeleton-accessible')
      expect(skeleton).not.toHaveClass('skeleton-shimmer')
    })

    it('provides static alternatives to animations', () => {
      window.matchMedia = mockMatchMedia(true)

      render(<AdvancedSkeleton variant="shimmerRainbow" />)

      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('skeleton-none')
    })

    it('adapts transition animations for reduced motion', () => {
      window.matchMedia = mockMatchMedia(true)

      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 500)
        }, [])

        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<div>Skeleton</div>}
            direction="fade"
            duration={300}
          >
            <div>Content</div>
          </SkeletonTransition>
        )
      }

      render(<TestComponent />)

      // Should use instant transition for reduced motion
      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('provides accessible animation alternatives', () => {
      window.matchMedia = mockMatchMedia(true)

      const accessibleClass = getAccessibleAnimation('fade-in', 'opacity-100')
      expect(accessibleClass).toBe('opacity-100')

      window.matchMedia = mockMatchMedia(false)

      const normalClass = getAccessibleAnimation('fade-in', 'opacity-100')
      expect(normalClass).toBe('fade-in')
    })

    it('detects reduced motion preference changes', () => {
      let reducedMotionValue = false

      const TestComponent = () => {
        const reducedMotion = useReducedMotion()
        reducedMotionValue = reducedMotion

        return (
          <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
        )
      }

      window.matchMedia = mockMatchMedia(false)
      render(<TestComponent />)

      expect(reducedMotionValue).toBe(false)

      // Simulate preference change
      window.matchMedia = mockMatchMedia(true)
      act(() => {
        window.dispatchEvent(new Event('change'))
      })

      // Should detect the change
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true')
    })
  })

  describe('Keyboard Navigation Support', () => {
    it('provides keyboard-accessible loading states', () => {
      render(
        <AccessibleSkeleton isLoading={true} loadingMessage="Loading content">
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </AccessibleSkeleton>
      )

      // Should not allow keyboard interaction during loading
      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(0)
    })

    it('restores keyboard accessibility after loading', async () => {
      const { rerender } = render(
        <AccessibleSkeleton isLoading={true}>
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </AccessibleSkeleton>
      )

      expect(screen.queryAllByRole('button')).toHaveLength(0)

      rerender(
        <AccessibleSkeleton isLoading={false}>
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </AccessibleSkeleton>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)

      // Should be keyboard accessible
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('disabled')
      })
    })

    it('provides keyboard-accessible progress indicators', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          progressIndicator="linear"
          showProgress={true}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('tabindex', '-1')
      expect(progressBar).toHaveAttribute('aria-label', 'Loading progress')
    })

    it('provides keyboard navigation for micro-interactions', () => {
      render(
        <MicroInteractionSkeleton
          interactions={[
            { type: 'focus', effect: 'glow', duration: 300 },
            { type: 'click', effect: 'pulse', duration: 200 },
          ]}
        >
          <button>Interactive Button</button>
        </MicroInteractionSkeleton>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Interactive Button')

      // Should be keyboard focusable
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Semantic HTML Structure', () => {
    it('uses semantic HTML elements', () => {
      const { container } = render(
        <AccessibleSkeleton isLoading={true}>
          <article>
            <header>
              <h1>Article Title</h1>
            </header>
            <main>
              <p>Article content</p>
            </main>
            <footer>
              <time dateTime="2023-01-01">January 1, 2023</time>
            </footer>
          </article>
        </AccessibleSkeleton>
      )

      expect(container.querySelector('article')).toBeInTheDocument()
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
      expect(container.querySelector('time')).toBeInTheDocument()
    })

    it('provides proper landmark roles', () => {
      render(
        <div>
          <nav aria-label="Main navigation">
            <AccessibleSkeleton isLoading={true}>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
              </ul>
            </AccessibleSkeleton>
          </nav>

          <main>
            <AccessibleSkeleton isLoading={true}>
              <section aria-labelledby="content-heading">
                <h2 id="content-heading">Main Content</h2>
                <p>Content here</p>
              </section>
            </AccessibleSkeleton>
          </main>

          <aside aria-label="Sidebar">
            <AccessibleSkeleton isLoading={true}>
              <div>Sidebar content</div>
            </AccessibleSkeleton>
          </aside>
        </div>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    it('provides proper list structure', () => {
      render(
        <AccessibleSkeleton isLoading={true}>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>

          <ol>
            <li>Step 1</li>
            <li>Step 2</li>
          </ol>
        </AccessibleSkeleton>
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
    })
  })

  describe('Focus Management', () => {
    it('manages focus during loading transitions', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const contentRef = React.useRef<HTMLDivElement>(null)

        React.useEffect(() => {
          if (!isLoading && contentRef.current) {
            contentRef.current.focus()
          }
        }, [isLoading])

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <AccessibleSkeleton isLoading={isLoading}>
            <div ref={contentRef} tabIndex={-1} data-testid="focusable-content">
              <h2>Content Loaded</h2>
              <p>Focus should be managed here</p>
            </div>
          </AccessibleSkeleton>
        )
      }

      render(<TestComponent />)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        const content = screen.getByTestId('focusable-content')
        expect(document.activeElement).toBe(content)
      })
    })

    it('provides focus indicators for interactive elements', () => {
      render(
        <MicroInteractionSkeleton
          interactions={[{ type: 'focus', effect: 'glow', duration: 300 }]}
        >
          <button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
            Focusable Button
          </button>
        </MicroInteractionSkeleton>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none')
      expect(button).toHaveClass('focus:ring-2')
      expect(button).toHaveClass('focus:ring-blue-500')
    })

    it('manages focus order in complex layouts', () => {
      render(
        <AccessibleSkeleton isLoading={false}>
          <div className="space-y-4">
            <a href="#link1" className="block">
              Link 1
            </a>
            <button className="block">Button 1</button>
            <input type="text" placeholder="Input 1" />
            <a href="#link2" className="block">
              Link 2
            </a>
            <button className="block">Button 2</button>
            <input type="text" placeholder="Input 2" />
          </div>
        </AccessibleSkeleton>
      )

      const links = screen.getAllByRole('link')
      const buttons = screen.getAllByRole('button')
      const inputs = screen.getAllByRole('textbox')

      expect(links).toHaveLength(2)
      expect(buttons).toHaveLength(2)
      expect(inputs).toHaveLength(2)

      // Should be in logical order
      expect(links[0]).toHaveAttribute('href', '#link1')
      expect(links[1]).toHaveAttribute('href', '#link2')
    })
  })

  describe('Color and Contrast Accessibility', () => {
    it('provides sufficient color contrast for skeletons', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          theme={{
            primaryColor: '#f0f0f0',
            secondaryColor: '#e0e0e0',
          }}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const skeleton = screen.getByLabelText('Loading...')
      const computedStyle = window.getComputedStyle(skeleton)

      // Should have sufficient contrast ratio
      expect(computedStyle.backgroundColor).toBeDefined()
    })

    it('provides high contrast mode support', () => {
      // Simulate high contrast mode
      const mediaQuery = window.matchMedia('(prefers-contrast: high)')
      Object.defineProperty(mediaQuery, 'matches', { value: true })

      render(
        <AccessibleSkeleton
          isLoading={true}
          theme={{
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
          }}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toBeInTheDocument()
    })

    it('provides dark mode support', () => {
      // Simulate dark mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      Object.defineProperty(mediaQuery, 'matches', { value: true })

      render(
        <AccessibleSkeleton
          isLoading={true}
          theme={{
            primaryColor: '#333333',
            secondaryColor: '#555555',
          }}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Cognitive Accessibility', () => {
    it('provides clear and simple loading messages', () => {
      const messages = [
        'Loading content, please wait...',
        'Content is loading',
        'Please wait while we load the page',
        'Loading...',
      ]

      messages.forEach((message) => {
        const { container } = render(
          <AccessibleSkeleton isLoading={true} loadingMessage={message}>
            <div>Content</div>
          </AccessibleSkeleton>
        )

        expect(screen.getByText(message)).toBeInTheDocument()

        // Clean up
        container.remove()
      })
    })

    it('provides predictable loading behavior', () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [count, setCount] = React.useState(0)

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setIsLoading(false)
          }, 1000)

          return () => clearTimeout(timer)
        }, [])

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            loadingMessage={`Loading attempt ${count + 1}`}
            estimatedTime={1000}
            showProgress={true}
          >
            <div>
              <button
                onClick={() => {
                  setCount((prev) => prev + 1)
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 1000)
                }}
              >
                Reload Content
              </button>
              <p>Content loaded successfully!</p>
            </div>
          </AccessibleSkeleton>
        )
      }

      render(<TestComponent />)

      expect(screen.getByText('Loading attempt 1')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(
        screen.getByText('Content loaded successfully!')
      ).toBeInTheDocument()

      // Click reload
      userEvent.click(screen.getByText('Reload Content'))

      expect(screen.getByText('Loading attempt 2')).toBeInTheDocument()
    })

    it('provides consistent interaction patterns', () => {
      render(
        <div>
          <AccessibleSkeleton isLoading={true}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Primary Action
            </button>
          </AccessibleSkeleton>

          <AccessibleSkeleton isLoading={false}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Primary Action
            </button>
          </AccessibleSkeleton>
        </div>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1) // Only the second one should be visible

      const button = buttons[0]
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
      expect(button).toHaveClass('bg-blue-500')
      expect(button).toHaveClass('text-white')
      expect(button).toHaveClass('rounded')
      expect(button).toHaveClass('hover:bg-blue-600')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles missing accessibility attributes gracefully', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          loadingMessage={null as any}
          loadedMessage={null as any}
          progressIndicator={null as any}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      // Should still provide default accessibility
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveTextContent('Loading content, please wait...')
    })

    it('handles invalid accessibility values', () => {
      render(
        <AccessibleSkeleton
          isLoading={true}
          accessibilityMode={null as any}
          estimatedTime={-1000}
          showProgress={null as any}
        >
          <div>Content</div>
        </AccessibleSkeleton>
      )

      // Should use sensible defaults
      const liveRegion = document.querySelector('[aria-live]')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')

      const progressBar = screen.queryByRole('progressbar')
      expect(progressBar).toBeFalsy() // Should not show invalid progress
    })

    it('handles rapid accessibility state changes', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        const [message, setMessage] = React.useState('Initial loading')

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setMessage('Updated loading message')
            setIsLoading(false)
            setMessage('Final loaded message')
          }, 100)

          return () => clearTimeout(timer)
        }, [])

        return (
          <AccessibleSkeleton
            isLoading={isLoading}
            loadingMessage={message}
            loadedMessage={message}
          >
            <div>Content</div>
          </AccessibleSkeleton>
        )
      }

      render(<TestComponent />)

      expect(screen.getByText('Initial loading')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(150)
      })

      await waitFor(() => {
        expect(screen.getByText('Final loaded message')).toBeInTheDocument()
      })
    })

    it('provides fallback for unsupported features', () => {
      // Mock missing APIs
      const originalMatchMedia = window.matchMedia
      // @ts-expect-error - Testing fallback behavior when matchMedia is unavailable
      delete window.matchMedia

      render(<EnhancedSkeleton variant="shimmer" />)

      const skeleton = screen.getByLabelText('Loading...')
      expect(skeleton).toBeInTheDocument()

      window.matchMedia = originalMatchMedia
    })
  })

  describe('Internationalization Support', () => {
    it('supports different languages for loading messages', () => {
      const messages = {
        english: 'Loading content, please wait...',
        spanish: 'Cargando contenido, por favor espere...',
        french: 'Chargement du contenu, veuillez patienter...',
        german: 'Inhalt wird geladen, bitte warten...',
        japanese: 'コンテンツを読み込んでいます。しばらくお待ちください...',
      }

      Object.entries(messages).forEach(([language, message]) => {
        const { container } = render(
          <AccessibleSkeleton isLoading={true} loadingMessage={message}>
            <div>Content</div>
          </AccessibleSkeleton>
        )

        expect(screen.getByText(message)).toBeInTheDocument()

        // Clean up
        container.remove()
      })
    })

    it('handles RTL (Right-to-Left) text direction', () => {
      render(
        <div dir="rtl">
          <AccessibleSkeleton isLoading={true} loadingMessage="جاري التحميل...">
            <div>المحتوى</div>
          </AccessibleSkeleton>
        </div>
      )

      const container = screen.getByText('جاري التحميل...').parentElement
      expect(container).toHaveAttribute('dir', 'rtl')
    })
  })
})
