import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ScrollReveal, ScrollRevealItem } from '../ScrollReveal'

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
    },
  }
})

describe('ScrollReveal Component', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <ScrollReveal>
          <div>Test Content</div>
        </ScrollReveal>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <ScrollReveal className="custom-class">
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('renders without crashing with no props', () => {
      const { container } = render(
        <ScrollReveal>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Animation Types', () => {
    it('renders with fadeInUp animation by default', () => {
      const { container } = render(
        <ScrollReveal>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with fadeInLeft animation', () => {
      const { container } = render(
        <ScrollReveal animation="fadeInLeft">
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with fadeInRight animation', () => {
      const { container } = render(
        <ScrollReveal animation="fadeInRight">
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with fadeIn animation', () => {
      const { container } = render(
        <ScrollReveal animation="fadeIn">
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Configuration Props', () => {
    it('accepts delay prop', () => {
      const { container } = render(
        <ScrollReveal delay={0.5}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('accepts threshold prop', () => {
      const { container } = render(
        <ScrollReveal threshold={0.5}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('accepts once prop (default true)', () => {
      const { container } = render(
        <ScrollReveal once={true}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('accepts once={false} for repeating animations', () => {
      const { container } = render(
        <ScrollReveal once={false}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Stagger Mode', () => {
    it('renders in stagger mode', () => {
      const { container } = render(
        <ScrollReveal stagger>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('accepts staggerDelay prop', () => {
      const { container } = render(
        <ScrollReveal stagger staggerDelay={0.2}>
          <div>Item 1</div>
          <div>Item 2</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('works with custom className in stagger mode', () => {
      const { container } = render(
        <ScrollReveal stagger className="stagger-container">
          <div>Item</div>
        </ScrollReveal>
      )
      expect(container.firstChild).toHaveClass('stagger-container')
    })
  })

  describe('ScrollRevealItem Component', () => {
    it('renders children correctly', () => {
      render(
        <ScrollReveal stagger>
          <ScrollRevealItem>
            <div>Item Content</div>
          </ScrollRevealItem>
        </ScrollReveal>
      )
      expect(screen.getByText('Item Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <ScrollReveal stagger>
          <ScrollRevealItem className="item-class">
            <div>Content</div>
          </ScrollRevealItem>
        </ScrollReveal>
      )
      const item = container.querySelector('.item-class')
      expect(item).toBeInTheDocument()
    })

    it('works with multiple items', () => {
      render(
        <ScrollReveal stagger>
          <ScrollRevealItem>
            <div>Item 1</div>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div>Item 2</div>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div>Item 3</div>
          </ScrollRevealItem>
        </ScrollReveal>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(<ScrollReveal><span /></ScrollReveal>)
      expect(container).toBeInTheDocument()
    })

    it('handles single child', () => {
      render(
        <ScrollReveal>
          <div>Single Child</div>
        </ScrollReveal>
      )
      expect(screen.getByText('Single Child')).toBeInTheDocument()
    })

    it('handles many children (50+)', () => {
      const children = Array.from({ length: 50 }, (_, i) => (
        <ScrollRevealItem key={i}>
          <div>Item {i}</div>
        </ScrollRevealItem>
      ))

      render(<ScrollReveal stagger>{children}</ScrollReveal>)
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 49')).toBeInTheDocument()
    })

    it('handles nested ScrollReveal components', () => {
      render(
        <ScrollReveal>
          <div>
            Outer Content
            <ScrollReveal>
              <div>Inner Content</div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      )
      expect(screen.getByText('Outer Content')).toBeInTheDocument()
      expect(screen.getByText('Inner Content')).toBeInTheDocument()
    })
  })

  describe('Type Safety', () => {
    it('accepts valid animation types', () => {
      const animations: Array<
        'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn'
      > = ['fadeInUp', 'fadeInLeft', 'fadeInRight', 'fadeIn']

      animations.forEach((animation) => {
        const { container } = render(
          <ScrollReveal animation={animation}>
            <div>Content</div>
          </ScrollReveal>
        )
        expect(container).toBeInTheDocument()
      })
    })

    it('accepts numeric delay values', () => {
      ;[0, 0.1, 0.5, 1, 2].forEach((delay) => {
        const { container } = render(
          <ScrollReveal delay={delay}>
            <div>Content</div>
          </ScrollReveal>
        )
        expect(container).toBeInTheDocument()
      })
    })

    it('accepts numeric threshold values between 0-1', () => {
      ;[0, 0.1, 0.2, 0.5, 0.8, 1].forEach((threshold) => {
        const { container } = render(
          <ScrollReveal threshold={threshold}>
            <div>Content</div>
          </ScrollReveal>
        )
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('Performance Considerations', () => {
    it('uses viewport.once by default for performance', () => {
      // This would be tested with actual viewport intersection
      // Here we just verify the component renders with the prop
      const { container } = render(
        <ScrollReveal once={true}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('allows disabling once for repeated animations', () => {
      const { container } = render(
        <ScrollReveal once={false}>
          <div>Content</div>
        </ScrollReveal>
      )
      expect(container).toBeInTheDocument()
    })

    it('supports custom threshold for early/late triggering', () => {
      // Low threshold = trigger early
      const { container: containerEarly } = render(
        <ScrollReveal threshold={0.1}>
          <div>Early</div>
        </ScrollReveal>
      )
      expect(containerEarly).toBeInTheDocument()

      // High threshold = trigger late
      const { container: containerLate } = render(
        <ScrollReveal threshold={0.8}>
          <div>Late</div>
        </ScrollReveal>
      )
      expect(containerLate).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('does not interfere with screen readers', () => {
      render(
        <ScrollReveal>
          <div role="article" aria-label="Test Content">
            Accessible Content
          </div>
        </ScrollReveal>
      )
      expect(screen.getByLabelText('Test Content')).toBeInTheDocument()
    })

    it('preserves semantic HTML', () => {
      render(
        <ScrollReveal>
          <main>
            <h1>Heading</h1>
            <p>Paragraph</p>
          </main>
        </ScrollReveal>
      )
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('does not add unnecessary ARIA attributes', () => {
      const { container } = render(
        <ScrollReveal>
          <div>Content</div>
        </ScrollReveal>
      )
      // Should not add aria-live, aria-atomic, etc.
      const wrapper = container.firstChild
      expect(wrapper).not.toHaveAttribute('aria-live')
      expect(wrapper).not.toHaveAttribute('aria-atomic')
    })
  })
})
