/**
 * Motion & Animation Testing Utilities
 *
 * Helper functions for testing animation components with reduced motion support.
 * These utilities help verify WCAG 2.3.3 compliance (Motion from Animation).
 *
 * @example
 * ```tsx
 * import { createReducedMotionMock, mockFramerMotion } from '@clarity-chat/testing-utils'
 *
 * // Setup mock before tests
 * const { setReducedMotion, reset } = createReducedMotionMock()
 *
 * describe('MyAnimatedComponent', () => {
 *   afterEach(() => reset())
 *
 *   it('respects reduced motion preference', () => {
 *     setReducedMotion(true)
 *     // ... test reduced motion behavior
 *   })
 * })
 * ```
 */

import * as React from 'react'

/**
 * Creates a mock for useReducedMotion hook that can be controlled in tests
 *
 * @returns Object with setReducedMotion function and reset function
 *
 * @example
 * ```tsx
 * const { setReducedMotion, reset, getMock } = createReducedMotionMock()
 *
 * // In your vi.mock setup:
 * vi.mock('@clarity-chat/primitives', async () => ({
 *   ...await vi.importActual('@clarity-chat/primitives'),
 *   useReducedMotion: getMock(),
 * }))
 *
 * // In tests:
 * setReducedMotion(true)
 * ```
 */
export function createReducedMotionMock() {
  let prefersReducedMotion = false

  return {
    /**
     * Set the reduced motion preference
     */
    setReducedMotion: (value: boolean) => {
      prefersReducedMotion = value
    },

    /**
     * Reset to default (no reduced motion preference)
     */
    reset: () => {
      prefersReducedMotion = false
    },

    /**
     * Get the mock function to use in vi.mock
     */
    getMock: () => () => prefersReducedMotion,

    /**
     * Get the current value (for assertions)
     */
    getValue: () => prefersReducedMotion,
  }
}

/**
 * Mock for framer-motion that captures animation props for assertions
 *
 * Use this with vi.mock to replace framer-motion in tests.
 *
 * @example
 * ```tsx
 * vi.mock('framer-motion', () => mockFramerMotion())
 *
 * // In your test:
 * const { container } = render(<AnimatedComponent />)
 * const motionDiv = container.querySelector('[data-motion="true"]')
 * const initial = JSON.parse(motionDiv.getAttribute('data-initial'))
 * expect(initial).toEqual({ opacity: 0 })
 * ```
 */
export function mockFramerMotion() {
  return {
    motion: {
      div: function MockMotionDiv({
        children,
        className,
        animate,
        initial,
        exit,
        variants,
        transition,
        ref,
        // Filter out framer-motion specific props
        layout: _layout,
        layoutId: _layoutId,
        whileHover: _whileHover,
        whileTap: _whileTap,
        whileFocus: _whileFocus,
        whileDrag: _whileDrag,
        drag: _drag,
        dragConstraints: _dragConstraints,
        onAnimationComplete: _onAnimationComplete,
        ...props
      }: React.HTMLAttributes<HTMLDivElement> & {
        animate?: object | string
        initial?: object | string
        exit?: object | string
        variants?: object
        transition?: object
        ref?: React.Ref<HTMLDivElement>
        layout?: boolean
        layoutId?: string
        whileHover?: object
        whileTap?: object
        whileFocus?: object
        whileDrag?: object
        drag?: boolean | 'x' | 'y'
        dragConstraints?: object
        onAnimationComplete?: () => void
      }) {
        return React.createElement(
          'div',
          {
            ref,
            className,
            'data-motion': 'true',
            'data-animate': JSON.stringify(animate),
            'data-initial': JSON.stringify(initial),
            'data-exit': JSON.stringify(exit),
            'data-variants': JSON.stringify(variants),
            'data-transition': JSON.stringify(transition),
            ...props,
          },
          children
        )
      },
      span: function MockMotionSpan({
        children,
        className,
        ref,
        ...props
      }: React.HTMLAttributes<HTMLSpanElement> & {
        ref?: React.Ref<HTMLSpanElement>
      }) {
        return React.createElement(
          'span',
          { ref, className, 'data-motion': 'true', ...props },
          children
        )
      },
      p: function MockMotionP({
        children,
        className,
        ref,
        ...props
      }: React.HTMLAttributes<HTMLParagraphElement> & {
        ref?: React.Ref<HTMLParagraphElement>
      }) {
        return React.createElement(
          'p',
          { ref, className, 'data-motion': 'true', ...props },
          children
        )
      },
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({
      start: () => Promise.resolve(),
      stop: () => {},
      set: () => {},
    }),
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: () => {},
      onChange: () => () => {},
    }),
    useTransform: () => ({
      get: () => 0,
      set: () => {},
    }),
    useSpring: (value: number) => ({
      get: () => value,
      set: () => {},
    }),
  }
}

/**
 * Helper to check if an element has motion attributes
 */
export function hasMotionAttributes(element: Element): boolean {
  return element.hasAttribute('data-motion')
}

/**
 * Helper to get motion container from rendered output
 */
export function getMotionContainer(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[data-motion="true"]')
}

/**
 * Helper to get all motion elements
 */
export function getAllMotionElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[data-motion="true"]'))
}

/**
 * Helper to check if container has any motion elements
 */
export function hasMotionElements(container: HTMLElement): boolean {
  return container.querySelectorAll('[data-motion="true"]').length > 0
}

/**
 * Helper to parse animation props from a motion element
 */
export function parseAnimationProps(element: Element) {
  return {
    initial: JSON.parse(element.getAttribute('data-initial') || 'null'),
    animate: JSON.parse(element.getAttribute('data-animate') || 'null'),
    exit: JSON.parse(element.getAttribute('data-exit') || 'null'),
    variants: JSON.parse(element.getAttribute('data-variants') || 'null'),
    transition: JSON.parse(element.getAttribute('data-transition') || 'null'),
  }
}

/**
 * Assert that an element uses opacity-only animation (reduced motion pattern)
 */
export function expectOpacityOnlyAnimation(element: Element): void {
  const props = parseAnimationProps(element)

  if (props.initial) {
    const hasOnlyOpacity = Object.keys(props.initial).every(
      (key) => key === 'opacity'
    )
    expect(hasOnlyOpacity).toBe(true)
  }

  if (props.animate) {
    const hasOnlyOpacity = Object.keys(props.animate).every(
      (key) => key === 'opacity'
    )
    expect(hasOnlyOpacity).toBe(true)
  }
}

/**
 * Assert that an element has no transform animations (reduced motion pattern)
 */
export function expectNoTransformAnimation(element: Element): void {
  const props = parseAnimationProps(element)

  const transformKeys = [
    'x',
    'y',
    'z',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skew',
    'skewX',
    'skewY',
  ]

  if (props.initial) {
    const hasTransform = transformKeys.some((key) => key in props.initial)
    expect(hasTransform).toBe(false)
  }

  if (props.animate) {
    const hasTransform = transformKeys.some((key) => key in props.animate)
    expect(hasTransform).toBe(false)
  }
}

/**
 * Mocks window.matchMedia for testing reduced motion in jsdom
 *
 * @example
 * ```tsx
 * const cleanup = mockMatchMedia(true) // Simulate reduced motion
 *
 * // Run tests...
 *
 * cleanup() // Restore original matchMedia
 * ```
 */
export function mockMatchMedia(prefersReducedMotion: boolean): () => void {
  const originalMatchMedia = window.matchMedia

  window.matchMedia = (query: string): MediaQueryList => {
    if (query === '(prefers-reduced-motion: reduce)') {
      const listeners: Array<(e: MediaQueryListEvent) => void> = []
      return {
        matches: prefersReducedMotion,
        media: query,
        onchange: null,
        addListener: (cb: (e: MediaQueryListEvent) => void) =>
          listeners.push(cb),
        removeListener: (cb: (e: MediaQueryListEvent) => void) => {
          const idx = listeners.indexOf(cb)
          if (idx > -1) listeners.splice(idx, 1)
        },
        addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
          listeners.push(cb),
        removeEventListener: (
          _: string,
          cb: (e: MediaQueryListEvent) => void
        ) => {
          const idx = listeners.indexOf(cb)
          if (idx > -1) listeners.splice(idx, 1)
        },
        dispatchEvent: () => true,
      } as MediaQueryList
    }
    return originalMatchMedia(query)
  }

  return () => {
    window.matchMedia = originalMatchMedia
  }
}

/**
 * Render helper that wraps component with motion preference context
 *
 * This is a higher-order function that creates a render function
 * with the reduced motion preference set.
 */
export function withReducedMotion<T extends (...args: unknown[]) => unknown>(
  renderFn: T,
  prefersReducedMotion: boolean
): T {
  return ((...args: Parameters<T>) => {
    const cleanup = mockMatchMedia(prefersReducedMotion)
    try {
      return renderFn(...args)
    } finally {
      // Note: cleanup happens after render, state is captured
      cleanup()
    }
  }) as T
}
