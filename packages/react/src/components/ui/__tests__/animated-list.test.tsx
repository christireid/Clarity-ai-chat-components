/**
 * Animated List Tests
 *
 * Tests for reduced-motion accessibility compliance (WCAG 2.3.3)
 * and proper component behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'
import {
  AnimatedList,
  AnimatedListItem,
  FadePresence,
  SlidePresence,
  ScalePresence,
  ConditionalPresence,
  StaggerContainer,
  AnimatedGrid,
} from '../animated-list'

// Mock framer-motion to avoid animation complexity in tests
// Note: Using function components with ref prop (React 19 pattern)
vi.mock('framer-motion', () => ({
  motion: {
    div: function MockMotionDiv({
      children,
      className,
      variants,
      ref,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      variants?: object
      ref?: React.Ref<HTMLDivElement>
    }) {
      return (
        <div
          ref={ref}
          className={className}
          data-motion="true"
          data-variants={JSON.stringify(variants)}
          {...props}
        >
          {children}
        </div>
      )
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Helper to get the first motion div (outer container)
const getMotionContainer = (container: HTMLElement) => {
  const motionDivs = container.querySelectorAll('[data-motion="true"]')
  return motionDivs[0] as HTMLElement
}

// Helper to check if any motion div exists
const hasMotionDiv = (container: HTMLElement) => {
  return container.querySelectorAll('[data-motion="true"]').length > 0
}

// Track the mock value for useReducedMotion
let mockReducedMotion = false

// Mock useReducedMotion hook
vi.mock('@clarity-chat/primitives', async () => {
  const actual = await vi.importActual('@clarity-chat/primitives')
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
    cn: (...args: (string | undefined | null | false)[]) =>
      args.filter(Boolean).join(' '),
  }
})

describe('AnimatedList', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <AnimatedList>
        <div data-testid="child">Item 1</div>
      </AnimatedList>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedList className="custom-list">
        <div>Item</div>
      </AnimatedList>
    )
    expect(getMotionContainer(container)).toHaveClass('custom-list')
  })

  describe('reduced motion accessibility', () => {
    it('renders static div when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <AnimatedList className="list-class">
          <div data-testid="child">Item</div>
        </AnimatedList>
      )

      // Should render a plain div, not a motion.div
      expect(hasMotionDiv(container)).toBe(false)

      // Should still render children with className
      const div = container.querySelector('.list-class')
      expect(div).toBeInTheDocument()
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders motion.div when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <AnimatedList>
          <div>Item</div>
        </AnimatedList>
      )

      expect(hasMotionDiv(container)).toBe(true)
    })
  })
})

describe('AnimatedListItem', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <AnimatedListItem>
        <span data-testid="child">Content</span>
      </AnimatedListItem>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedListItem className="item-class">
        <span>Content</span>
      </AnimatedListItem>
    )
    expect(getMotionContainer(container)).toHaveClass('item-class')
  })

  describe('reduced motion accessibility', () => {
    it('renders static div when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <AnimatedListItem className="item-class">
          <span data-testid="child">Content</span>
        </AnimatedListItem>
      )

      expect(hasMotionDiv(container)).toBe(false)

      const div = container.querySelector('.item-class')
      expect(div).toBeInTheDocument()
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders motion.div when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <AnimatedListItem>
          <span>Content</span>
        </AnimatedListItem>
      )

      expect(hasMotionDiv(container)).toBe(true)
    })
  })
})

describe('FadePresence', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <FadePresence>
        <span data-testid="child">Content</span>
      </FadePresence>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('renders static div when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <FadePresence className="fade-class">
          <span data-testid="child">Content</span>
        </FadePresence>
      )

      expect(hasMotionDiv(container)).toBe(false)

      const div = container.querySelector('.fade-class')
      expect(div).toBeInTheDocument()
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders motion.div when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <FadePresence>
          <span>Content</span>
        </FadePresence>
      )

      expect(hasMotionDiv(container)).toBe(true)
    })
  })
})

describe('SlidePresence', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <SlidePresence>
        <span data-testid="child">Content</span>
      </SlidePresence>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('uses fade-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <SlidePresence direction="up" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      // Still renders motion.div but with fade variants instead of slide
      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Fade variants should only have opacity, no x/y transforms
      expect(variants.initial).toHaveProperty('opacity')
      expect(variants.initial).not.toHaveProperty('x')
      expect(variants.initial).not.toHaveProperty('y')
    })

    it('uses slide animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <SlidePresence direction="up" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Slide variants should include y transform
      expect(variants.initial).toHaveProperty('y')
    })
  })

  describe('direction variants', () => {
    beforeEach(() => {
      mockReducedMotion = false
    })

    // Note: The direction describes where the element slides FROM
    // 'up' means it starts above (negative y) and slides down to position
    // 'down' means it starts below (positive y) and slides up to position
    // 'left' means it starts to the left (negative x) and slides right
    // 'right' means it starts to the right (positive x) and slides left

    it('slides from above when direction is "up"', () => {
      const { container } = render(
        <SlidePresence direction="up" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial.y).toBe(-20)
    })

    it('slides from below when direction is "down"', () => {
      const { container } = render(
        <SlidePresence direction="down" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial.y).toBe(20)
    })

    it('slides from the left when direction is "left"', () => {
      const { container } = render(
        <SlidePresence direction="left" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial.x).toBe(-20)
    })

    it('slides from the right when direction is "right"', () => {
      const { container } = render(
        <SlidePresence direction="right" distance={20}>
          <span>Content</span>
        </SlidePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial.x).toBe(20)
    })
  })
})

describe('ScalePresence', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <ScalePresence>
        <span data-testid="child">Content</span>
      </ScalePresence>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('uses fade-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <ScalePresence initialScale={0.9}>
          <span>Content</span>
        </ScalePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Should only have opacity, no scale
      expect(variants.initial).toHaveProperty('opacity')
      expect(variants.initial).not.toHaveProperty('scale')
    })

    it('uses scale animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <ScalePresence initialScale={0.9}>
          <span>Content</span>
        </ScalePresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Should include scale
      expect(variants.initial).toHaveProperty('scale', 0.9)
    })
  })
})

describe('ConditionalPresence', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children when show is true', () => {
    render(
      <ConditionalPresence show={true}>
        <span data-testid="child">Content</span>
      </ConditionalPresence>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('does not render children when show is false', () => {
    render(
      <ConditionalPresence show={false}>
        <span data-testid="child">Content</span>
      </ConditionalPresence>
    )
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('converts slide variant to fade when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <ConditionalPresence show={true} variant="slide" direction="up">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Should be fade-only, no y transform
      expect(variants.initial).toHaveProperty('opacity')
      expect(variants.initial).not.toHaveProperty('y')
    })

    it('converts scale variant to fade when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <ConditionalPresence show={true} variant="scale">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Should be fade-only, no scale
      expect(variants.initial).toHaveProperty('opacity')
      expect(variants.initial).not.toHaveProperty('scale')
    })

    it('keeps fade variant as-is when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <ConditionalPresence show={true} variant="fade">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      // Should have fade properties
      expect(variants.initial).toHaveProperty('opacity')
    })
  })

  describe('variants', () => {
    beforeEach(() => {
      mockReducedMotion = false
    })

    it('applies fade variant', () => {
      const { container } = render(
        <ConditionalPresence show={true} variant="fade">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial).toHaveProperty('opacity', 0)
      expect(variants.animate).toHaveProperty('opacity', 1)
    })

    it('applies slide variant', () => {
      const { container } = render(
        <ConditionalPresence show={true} variant="slide" direction="up">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial).toHaveProperty('y')
    })

    it('applies scale variant', () => {
      const { container } = render(
        <ConditionalPresence show={true} variant="scale">
          <span>Content</span>
        </ConditionalPresence>
      )

      const motionDiv = getMotionContainer(container)
      const variants = JSON.parse(
        motionDiv.getAttribute('data-variants') || '{}'
      )

      expect(variants.initial).toHaveProperty('scale')
    })
  })
})

describe('StaggerContainer', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <StaggerContainer>
        <div data-testid="child">Item</div>
      </StaggerContainer>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <StaggerContainer className="stagger-class">
        <div>Item</div>
      </StaggerContainer>
    )
    expect(getMotionContainer(container)).toHaveClass('stagger-class')
  })

  describe('reduced motion accessibility', () => {
    it('renders static div when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <StaggerContainer className="stagger-class">
          <div data-testid="child">Item</div>
        </StaggerContainer>
      )

      expect(hasMotionDiv(container)).toBe(false)

      const div = container.querySelector('.stagger-class')
      expect(div).toBeInTheDocument()
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders motion.div when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <StaggerContainer>
          <div>Item</div>
        </StaggerContainer>
      )

      expect(hasMotionDiv(container)).toBe(true)
    })
  })
})

describe('AnimatedGrid', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <AnimatedGrid>
        <div data-testid="child">Item</div>
      </AnimatedGrid>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies grid styles', () => {
    const { container } = render(
      <AnimatedGrid columns={3} gap={4}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </AnimatedGrid>
    )

    const grid = getMotionContainer(container)
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    })
  })

  describe('reduced motion accessibility', () => {
    it('renders static div when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <AnimatedGrid columns={2} gap={2} className="grid-class">
          <div data-testid="child1">Item 1</div>
          <div data-testid="child2">Item 2</div>
        </AnimatedGrid>
      )

      expect(hasMotionDiv(container)).toBe(false)

      // Should still render children
      expect(screen.getByTestId('child1')).toBeInTheDocument()
      expect(screen.getByTestId('child2')).toBeInTheDocument()

      // Should apply grid styles to static div
      const grid = container.querySelector('.grid-class')
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      })
    })

    it('renders motion.div when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <AnimatedGrid>
          <div>Item</div>
        </AnimatedGrid>
      )

      expect(hasMotionDiv(container)).toBe(true)
    })
  })

  describe('grid configuration', () => {
    beforeEach(() => {
      mockReducedMotion = false
    })

    it('supports custom column count', () => {
      const { container } = render(
        <AnimatedGrid columns={4}>
          <div>Item</div>
        </AnimatedGrid>
      )

      const grid = getMotionContainer(container)
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      })
    })

    it('supports custom gap', () => {
      const { container } = render(
        <AnimatedGrid gap={8}>
          <div>Item</div>
        </AnimatedGrid>
      )

      const grid = getMotionContainer(container)
      expect(grid).toHaveClass('gap-8')
    })
  })
})

describe('WCAG 2.3.3 Compliance', () => {
  it('all animation components respect reduced motion preference', () => {
    mockReducedMotion = true

    // AnimatedList should render static
    const { unmount: unmount1, container: container1 } = render(
      <AnimatedList>
        <div data-testid="animated-list-child">Item</div>
      </AnimatedList>
    )
    expect(hasMotionDiv(container1)).toBe(false)
    expect(screen.getByTestId('animated-list-child')).toBeInTheDocument()
    unmount1()

    // AnimatedListItem should render static
    const { unmount: unmount2, container: container2 } = render(
      <AnimatedListItem>
        <div data-testid="animated-item-child">Item</div>
      </AnimatedListItem>
    )
    expect(hasMotionDiv(container2)).toBe(false)
    expect(screen.getByTestId('animated-item-child')).toBeInTheDocument()
    unmount2()

    // FadePresence should render static
    const { unmount: unmount3, container: container3 } = render(
      <FadePresence>
        <div data-testid="fade-child">Content</div>
      </FadePresence>
    )
    expect(hasMotionDiv(container3)).toBe(false)
    expect(screen.getByTestId('fade-child')).toBeInTheDocument()
    unmount3()

    // StaggerContainer should render static
    const { unmount: unmount4, container: container4 } = render(
      <StaggerContainer>
        <div data-testid="stagger-child">Item</div>
      </StaggerContainer>
    )
    expect(hasMotionDiv(container4)).toBe(false)
    expect(screen.getByTestId('stagger-child')).toBeInTheDocument()
    unmount4()

    // AnimatedGrid should render static
    const { unmount: unmount5, container: container5 } = render(
      <AnimatedGrid>
        <div data-testid="grid-child">Item</div>
      </AnimatedGrid>
    )
    expect(hasMotionDiv(container5)).toBe(false)
    expect(screen.getByTestId('grid-child')).toBeInTheDocument()
    unmount5()
  })

  it('content remains accessible when animations are disabled', () => {
    mockReducedMotion = true

    // Verify all content is still visible and accessible
    render(
      <div>
        <AnimatedList>
          <div role="listitem">List item</div>
        </AnimatedList>
        <ConditionalPresence show={true}>
          <button>Click me</button>
        </ConditionalPresence>
        <AnimatedGrid columns={2}>
          <div role="gridcell">Cell 1</div>
          <div role="gridcell">Cell 2</div>
        </AnimatedGrid>
      </div>
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(2)
  })
})
