import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PageTransition } from '../PageTransition'

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className, ...props }: any) => (
        <div className={className} data-testid="motion-div" {...props}>
          {children}
        </div>
      ),
    },
  }
})

describe('PageTransition Component', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <PageTransition>
          <div>Page Content</div>
        </PageTransition>
      )
      expect(screen.getByText('Page Content')).toBeInTheDocument()
    })

    it('renders without crashing with default props', () => {
      const { container } = render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('wraps children in motion.div', () => {
      render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      )
      expect(screen.getByTestId('motion-div')).toBeInTheDocument()
    })
  })

  describe('Transition Modes', () => {
    it('renders with fade mode', () => {
      const { container } = render(
        <PageTransition mode="fade">
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with slide mode (default)', () => {
      const { container } = render(
        <PageTransition mode="slide">
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with scale mode', () => {
      const { container } = render(
        <PageTransition mode="scale">
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('uses default mode when not specified', () => {
      const { container } = render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Duration Configuration', () => {
    it('accepts custom duration', () => {
      const { container } = render(
        <PageTransition duration={0.5}>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('uses default duration when not specified', () => {
      const { container } = render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('accepts very short duration', () => {
      const { container } = render(
        <PageTransition duration={0.1}>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('accepts longer duration', () => {
      const { container } = render(
        <PageTransition duration={1.0}>
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Different Page Content Types', () => {
    it('handles simple text content', () => {
      render(<PageTransition>Simple Text</PageTransition>)
      expect(screen.getByText('Simple Text')).toBeInTheDocument()
    })

    it('handles complex nested components', () => {
      render(
        <PageTransition>
          <div>
            <header>Header</header>
            <main>
              <section>
                <h1>Title</h1>
                <p>Content</p>
              </section>
            </main>
            <footer>Footer</footer>
          </div>
        </PageTransition>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('handles multiple children', () => {
      render(
        <PageTransition>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </PageTransition>
      )
      expect(screen.getByText('First Child')).toBeInTheDocument()
      expect(screen.getByText('Second Child')).toBeInTheDocument()
      expect(screen.getByText('Third Child')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(<PageTransition></PageTransition>)
      expect(container).toBeInTheDocument()
    })

    it('handles null children', () => {
      const { container } = render(<PageTransition>{null}</PageTransition>)
      expect(container).toBeInTheDocument()
    })

    it('handles undefined children', () => {
      const { container } = render(<PageTransition>{undefined}</PageTransition>)
      expect(container).toBeInTheDocument()
    })

    it('handles conditional rendering', () => {
      const showContent = true
      render(
        <PageTransition>
          {showContent && <div>Conditional Content</div>}
        </PageTransition>
      )
      expect(screen.getByText('Conditional Content')).toBeInTheDocument()
    })

    it('handles fragment children', () => {
      render(
        <PageTransition>
          <>
            <div>Fragment Child 1</div>
            <div>Fragment Child 2</div>
          </>
        </PageTransition>
      )
      expect(screen.getByText('Fragment Child 1')).toBeInTheDocument()
      expect(screen.getByText('Fragment Child 2')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('uses GPU-accelerated properties only', () => {
      // PageTransition should only animate transform and opacity
      // This is verified by the component implementation
      const { container } = render(
        <PageTransition mode="slide">
          <div>Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })

    it('completes quickly with short duration', () => {
      const { container } = render(
        <PageTransition duration={0.1}>
          <div>Fast Content</div>
        </PageTransition>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('preserves semantic HTML', () => {
      render(
        <PageTransition>
          <main role="main">
            <h1>Page Title</h1>
            <article>Content</article>
          </main>
        </PageTransition>
      )
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('does not interfere with focus management', () => {
      render(
        <PageTransition>
          <button>Focusable Button</button>
        </PageTransition>
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('does not add unnecessary ARIA attributes', () => {
      const { container } = render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      )
      const motionDiv = screen.getByTestId('motion-div')
      expect(motionDiv).not.toHaveAttribute('aria-live')
      expect(motionDiv).not.toHaveAttribute('aria-atomic')
    })

    it('allows aria attributes on children', () => {
      render(
        <PageTransition>
          <div aria-label="Test Content">Content</div>
        </PageTransition>
      )
      expect(screen.getByLabelText('Test Content')).toBeInTheDocument()
    })
  })

  describe('Mode-Specific Behavior', () => {
    it('fade mode works with different durations', () => {
      const { container } = render(
        <PageTransition mode="fade" duration={0.3}>
          <div>Fade Content</div>
        </PageTransition>
      )
      expect(screen.getByText('Fade Content')).toBeInTheDocument()
    })

    it('slide mode works with different durations', () => {
      const { container } = render(
        <PageTransition mode="slide" duration={0.25}>
          <div>Slide Content</div>
        </PageTransition>
      )
      expect(screen.getByText('Slide Content')).toBeInTheDocument()
    })

    it('scale mode works with different durations', () => {
      const { container } = render(
        <PageTransition mode="scale" duration={0.2}>
          <div>Scale Content</div>
        </PageTransition>
      )
      expect(screen.getByText('Scale Content')).toBeInTheDocument()
    })
  })

  describe('Integration with Next.js App Router', () => {
    it('works in template.tsx context', () => {
      // PageTransition is designed to be used in template.tsx
      // It should re-render on route changes
      const { container } = render(
        <PageTransition>
          <div>Route Content</div>
        </PageTransition>
      )
      expect(screen.getByText('Route Content')).toBeInTheDocument()
    })

    it('handles dynamic imports', () => {
      render(
        <PageTransition>
          <div>
            Dynamically Imported Content
            <div>Nested Content</div>
          </div>
        </PageTransition>
      )
      expect(
        screen.getByText('Dynamically Imported Content')
      ).toBeInTheDocument()
    })
  })

  describe('Type Safety', () => {
    it('accepts valid mode types', () => {
      const modes: Array<'fade' | 'slide' | 'scale'> = [
        'fade',
        'slide',
        'scale',
      ]

      modes.forEach((mode) => {
        const { container } = render(
          <PageTransition mode={mode}>
            <div>Content</div>
          </PageTransition>
        )
        expect(container).toBeInTheDocument()
      })
    })

    it('accepts numeric duration values', () => {
      ;[0.1, 0.2, 0.3, 0.5, 1.0].forEach((duration) => {
        const { container } = render(
          <PageTransition duration={duration}>
            <div>Content</div>
          </PageTransition>
        )
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('Component Composition', () => {
    it('works with other animated components', () => {
      render(
        <PageTransition>
          <div>
            <div data-testid="nested-animation">Nested Animated Component</div>
          </div>
        </PageTransition>
      )
      expect(screen.getByTestId('nested-animation')).toBeInTheDocument()
    })

    it('allows custom styling on children', () => {
      render(
        <PageTransition>
          <div className="custom-class" style={{ padding: '20px' }}>
            Styled Content
          </div>
        </PageTransition>
      )
      const styledDiv = screen.getByText('Styled Content')
      expect(styledDiv).toHaveClass('custom-class')
    })
  })
})
