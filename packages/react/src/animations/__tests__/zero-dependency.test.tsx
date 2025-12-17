/**
 * Comprehensive Test Suite for Zero-Dependency Animation System
 *
 * Tests all CSS animations, easing functions, durations, accessibility features,
 * React hooks, and utility functions for the zero-dependency animation library.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  cssKeyframes,
  easings,
  durations,
  animationClasses,
  prefersReducedMotion,
  getAccessibleAnimation,
  createAnimation,
  createTransition,
  injectKeyframes,
  buttonAnimation,
  cardAnimation,
  iconAnimation,
  useReducedMotion,
  useAnimations,
} from '../zero-dependency'

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

// Mock document
const mockCreateElement = jest.fn()
const mockAppendChild = jest.fn()
const mockGetElementById = jest.fn()

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
})

Object.defineProperty(document, 'head', {
  value: { appendChild: mockAppendChild },
  writable: true,
})

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
})

describe('Zero-Dependency Animation System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateElement.mockReturnValue({ id: '', textContent: '' })
    mockGetElementById.mockReturnValue(null)
  })

  describe('CSS Keyframes', () => {
    it('contains all expected keyframes', () => {
      const expectedKeyframes = [
        '@keyframes fadeIn',
        '@keyframes fadeOut',
        '@keyframes fadeInUp',
        '@keyframes fadeInDown',
        '@keyframes fadeInScale',
        '@keyframes slideInLeft',
        '@keyframes slideInRight',
        '@keyframes scaleIn',
        '@keyframes scaleOut',
        '@keyframes buttonTap',
        '@keyframes cardHover',
        '@keyframes iconHover',
        '@keyframes pulse',
        '@keyframes shake',
        '@keyframes bounce',
        '@keyframes spin',
        '@keyframes glow',
        '@keyframes shimmer',
        '@keyframes typingDot',
      ]

      expectedKeyframes.forEach(keyframe => {
        expect(cssKeyframes).toContain(keyframe)
      })
    })

    it('has valid CSS syntax', () => {
      // Basic CSS validation - check for balanced braces
      const openBraces = (cssKeyframes.match(/\{/g) || []).length
      const closeBraces = (cssKeyframes.match(/\}/g) || []).length
      expect(openBraces).toBe(closeBraces)

      // Check for balanced parentheses in keyframes
      const openParens = (cssKeyframes.match(/\(/g) || []).length
      const closeParens = (cssKeyframes.match(/\)/g) || []).length
      expect(openParens).toBe(closeParens)
    })

    it('contains animation properties', () => {
      expect(cssKeyframes).toContain('opacity')
      expect(cssKeyframes).toContain('transform')
      expect(cssKeyframes).toContain('translateX')
      expect(cssKeyframes).toContain('translateY')
      expect(cssKeyframes).toContain('scale')
      expect(cssKeyframes).toContain('rotate')
    })
  })

  describe('Easing Functions', () => {
    it('contains all expected easings', () => {
      const expectedEasings = [
        'easeOut',
        'easeOutQuick',
        'easeInOut',
        'anticipate',
        'linear',
        'ease',
        'easeIn',
        'easeInOutQuad',
        'spring',
        'springBouncy',
      ]

      expectedEasings.forEach(easing => {
        expect(easings[easing as keyof typeof easings]).toBeDefined()
      })
    })

    it('has valid cubic-bezier values', () => {
      Object.values(easings).forEach(easing => {
        if (easing !== 'linear' && easing !== 'ease') {
          expect(easing).toMatch(/cubic-bezier\([\d.-]+,\s*[\d.-]+,\s*[\d.-]+,\s*[\d.-]+\)/)
        }
      })
    })

    it('has unique easing values', () => {
      const easingValues = Object.values(easings)
      const uniqueValues = new Set(easingValues)
      expect(uniqueValues.size).toBe(easingValues.length)
    })
  })

  describe('Duration Standards', () => {
    it('contains all expected durations', () => {
      const expectedDurations = [
        'instant',
        'fast',
        'normal',
        'moderate',
        'slow',
        'slower',
      ]

      expectedDurations.forEach(duration => {
        expect(durations[duration as keyof typeof durations]).toBeDefined()
      })
    })

    it('has valid CSS time values', () => {
      Object.values(durations).forEach(duration => {
        expect(duration).toMatch(/\d+(\.\d+)?s/)
      })
    })

    it('has increasing duration values', () => {
      const durationValues = [
        durations.instant,
        durations.fast,
        durations.normal,
        durations.moderate,
        durations.slow,
        durations.slower,
      ]

      for (let i = 1; i < durationValues.length; i++) {
        const prev = parseFloat(durationValues[i - 1])
        const curr = parseFloat(durationValues[i])
        expect(curr).toBeGreaterThan(prev)
      }
    })
  })

  describe('Animation Classes', () => {
    it('contains all expected animation classes', () => {
      const expectedClasses = [
        'fadeIn',
        'fadeOut',
        'fadeInUp',
        'fadeInDown',
        'fadeInScale',
        'slideInLeft',
        'slideInRight',
        'buttonTap',
        'cardHover',
        'iconHover',
        'pulse',
        'shake',
        'bounce',
        'spin',
        'glow',
        'shimmer',
        'typingDot',
      ]

      expectedClasses.forEach(className => {
        expect(animationClasses[className as keyof typeof animationClasses]).toBeDefined()
      })
    })

    it('has valid animation properties', () => {
      Object.values(animationClasses).forEach(animationClass => {
        expect(animationClass).toHaveProperty('animation')
      })
    })

    it('has shimmer background properties', () => {
      const shimmer = animationClasses.shimmer as any
      expect(shimmer).toHaveProperty('background')
      expect(shimmer).toHaveProperty('backgroundSize')
    })

    it('combines animation properties correctly', () => {
      const fadeIn = animationClasses.fadeIn.animation
      expect(fadeIn).toContain('fadeIn')
      expect(fadeIn).toContain(durations.normal)
      expect(fadeIn).toContain(easings.easeOut)
      expect(fadeIn).toContain('both')
    })
  })

  describe('Utility Functions', () => {
    describe('prefersReducedMotion', () => {
      it('returns false when reduced motion is not preferred', () => {
        expect(prefersReducedMotion()).toBe(false)
      })

      it('returns true when reduced motion is preferred', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))

        expect(prefersReducedMotion()).toBe(true)
      })

      it('returns false on server side', () => {
        const originalWindow = global.window
        // @ts-ignore
        delete global.window

        expect(prefersReducedMotion()).toBe(false)

        global.window = originalWindow
      })
    })

    describe('getAccessibleAnimation', () => {
      it('returns animation class when reduced motion is not preferred', () => {
        expect(getAccessibleAnimation('fade-in')).toBe('fade-in')
      })

      it('returns reduced motion class when reduced motion is preferred', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))

        expect(getAccessibleAnimation('fade-in', 'opacity-100')).toBe('opacity-100')
      })

      it('uses default reduced motion class', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))

        expect(getAccessibleAnimation('fade-in')).toBe('opacity-100')
      })
    })

    describe('createAnimation', () => {
      it('creates animation style with default parameters', () => {
        const style = createAnimation('fadeIn')
        expect(style).toHaveProperty('animation')
        expect(style.animation).toContain('fadeIn')
        expect(style.animation).toContain(durations.normal)
        expect(style.animation).toContain(easings.easeOut)
      })

      it('creates animation style with custom parameters', () => {
        const style = createAnimation(
          'slideIn',
          '0.5s',
          easings.spring,
          '0.1s',
          'infinite',
          'alternate',
          'forwards'
        )

        expect(style.animation).toContain('slideIn')
        expect(style.animation).toContain('0.5s')
        expect(style.animation).toContain(easings.spring)
        expect(style.animation).toContain('0.1s')
        expect(style.animation).toContain('infinite')
        expect(style.animation).toContain('alternate')
        expect(style.animation).toContain('forwards')
      })
    })

    describe('createTransition', () => {
      it('creates transition style with default parameters', () => {
        const style = createTransition()
        expect(style).toHaveProperty('transition')
        expect(style.transition).toContain('all')
        expect(style.transition).toContain(durations.normal)
        expect(style.transition).toContain(easings.easeOut)
      })

      it('creates transition style with custom parameters', () => {
        const style = createTransition('transform, opacity', '0.3s', easings.spring, '0.1s')
        expect(style.transition).toContain('transform, opacity')
        expect(style.transition).toContain('0.3s')
        expect(style.transition).toContain(easings.spring)
        expect(style.transition).toContain('0.1s')
      })
    })

    describe('injectKeyframes', () => {
      it('injects keyframes into document', () => {
        const mockStyle = { id: '', textContent: '' }
        mockCreateElement.mockReturnValue(mockStyle)

        injectKeyframes()

        expect(mockCreateElement).toHaveBeenCalledWith('style')
        expect(mockStyle.id).toBe('clarity-chat-animations')
        expect(mockStyle.textContent).toBe(cssKeyframes)
        expect(mockAppendChild).toHaveBeenCalledWith(mockStyle)
      })

      it('does not inject if already exists', () => {
        mockGetElementById.mockReturnValue({ id: 'clarity-chat-animations' })

        injectKeyframes()

        expect(mockCreateElement).not.toHaveBeenCalled()
        expect(mockAppendChild).not.toHaveBeenCalled()
      })

      it('does not inject on server side', () => {
        const originalDocument = global.document
        // @ts-ignore
        delete global.document

        injectKeyframes()

        expect(mockCreateElement).not.toHaveBeenCalled()

        global.document = originalDocument
      })
    })
  })

  describe('Animation Presets', () => {
    it('has button animation preset', () => {
      expect(buttonAnimation).toHaveProperty('animation')
      expect(buttonAnimation).toHaveProperty('transition')
      expect(buttonAnimation.animation).toContain('buttonTap')
      expect(buttonAnimation.transition).toHaveProperty('transition')
    })

    it('has card animation preset', () => {
      expect(cardAnimation).toHaveProperty('animation')
      expect(cardAnimation).toHaveProperty('transition')
      expect(cardAnimation.animation).toContain('cardHover')
      expect(cardAnimation.transition).toHaveProperty('transition')
    })

    it('has icon animation preset', () => {
      expect(iconAnimation).toHaveProperty('animation')
      expect(iconAnimation).toHaveProperty('transition')
      expect(iconAnimation.animation).toContain('iconHover')
      expect(iconAnimation.transition).toHaveProperty('transition')
    })
  })

  describe('React Hooks', () => {
    describe('useReducedMotion', () => {
      it('returns reduced motion state', () => {
        const TestComponent = () => {
          const reducedMotion = useReducedMotion()
          return <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false')
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
          const reducedMotion = useReducedMotion()
          return <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
        }

        const { unmount } = render(<TestComponent />)
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

        unmount()
        expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })

      it('returns false on server side', () => {
        const originalWindow = global.window
        // @ts-ignore
        delete global.window

        const TestComponent = () => {
          const reducedMotion = useReducedMotion()
          return <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
        }

        render(<TestComponent />)
        expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false')

        global.window = originalWindow
      })
    })

    describe('useAnimations', () => {
      it('injects keyframes on mount', () => {
        const TestComponent = () => {
          useAnimations()
          return <div>Test</div>
        }

        render(<TestComponent />)
        expect(mockCreateElement).toHaveBeenCalledWith('style')
      })

      it('injects keyframes only once', () => {
        const TestComponent = () => {
          useAnimations()
          return <div>Test</div>
        }

        const { rerender } = render(<TestComponent />)
        rerender(<TestComponent />)
        
        // Should only be called once for the style element
        expect(mockCreateElement).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles server-side rendering', () => {
      const originalWindow = global.window
      const originalDocument = global.document
      // @ts-ignore
      delete global.window
      // @ts-ignore
      delete global.document

      expect(prefersReducedMotion()).toBe(false)
      injectKeyframes()

      global.window = originalWindow
      global.document = originalDocument
    })

    it('handles invalid animation parameters', () => {
      const style = createAnimation('', '', '', '', '', '', '')
      expect(style.animation).toBeDefined()
    })

    it('handles invalid transition parameters', () => {
      const style = createTransition('', '', '', '')
      expect(style.transition).toBeDefined()
    })

    it('handles null/undefined parameters gracefully', () => {
      const style1 = createAnimation(null as any, null as any, null as any)
      const style2 = createTransition(null as any, null as any, null as any)
      
      expect(style1.animation).toBeDefined()
      expect(style2.transition).toBeDefined()
    })
  })

  describe('Integration Tests', () => {
    it('integrates all components correctly', () => {
      const TestComponent = () => {
        useAnimations()
        const reducedMotion = useReducedMotion()
        
        const accessibleClass = getAccessibleAnimation('fade-in', 'opacity-100')
        const customAnimation = createAnimation('custom', '0.5s', easings.spring)
        const customTransition = createTransition('transform', '0.3s', easings.easeOut)
        
        return (
          <div>
            <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
            <div data-testid="accessible-class">{accessibleClass}</div>
            <div data-testid="custom-animation">{customAnimation.animation}</div>
            <div data-testid="custom-transition">{customTransition.transition}</div>
          </div>
        )
      }

      render(<TestComponent />)
      
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false')
      expect(screen.getByTestId('accessible-class')).toHaveTextContent('fade-in')
      expect(screen.getByTestId('custom-animation')).toHaveTextContent('custom')
      expect(screen.getByTestId('custom-transition')).toHaveTextContent('transform')
    })

    it('handles reduced motion integration', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      const TestComponent = () => {
        const reducedMotion = useReducedMotion()
        const accessibleClass = getAccessibleAnimation('fade-in', 'opacity-100')
        
        return (
          <div>
            <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
            <div data-testid="accessible-class">{accessibleClass}</div>
          </div>
        )
      }

      render(<TestComponent />)
      
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true')
      expect(screen.getByTestId('accessible-class')).toHaveTextContent('opacity-100')
    })
  })

  describe('Default Export', () => {
    it('exports all expected properties', () => {
      const zeroDepModule = require('../zero-dependency').default
      
      expect(zeroDepModule).toHaveProperty('cssKeyframes')
      expect(zeroDepModule).toHaveProperty('easings')
      expect(zeroDepModule).toHaveProperty('durations')
      expect(zeroDepModule).toHaveProperty('animationClasses')
      expect(zeroDepModule).toHaveProperty('prefersReducedMotion')
      expect(zeroDepModule).toHaveProperty('getAccessibleAnimation')
      expect(zeroDepModule).toHaveProperty('createAnimation')
      expect(zeroDepModule).toHaveProperty('createTransition')
      expect(zeroDepModule).toHaveProperty('injectKeyframes')
      expect(zeroDepModule).toHaveProperty('buttonAnimation')
      expect(zeroDepModule).toHaveProperty('cardAnimation')
      expect(zeroDepModule).toHaveProperty('iconAnimation')
      expect(zeroDepModule).toHaveProperty('useReducedMotion')
      expect(zeroDepModule).toHaveProperty('useAnimations')
    })
  })
})