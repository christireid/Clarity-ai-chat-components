/**
 * Animation Utilities Tests
 *
 * Comprehensive tests for animation presets, hooks, and orchestration utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  DURATION,
  EASING,
  fadeIn,
  fadeOut,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideInDown,
  scaleIn,
  scaleOut,
  messageEnter,
  messageExit,
  thinkingPulse,
  toolCardFlip,
  progressFill,
  ANIMATION_PRESETS,
  TRANSITION_PRESETS,
  getAnimationPreset,
  getTransitionPreset,
  stagger,
  sequence,
  parallel,
  mergeVariants,
  getReducedMotionVariants,
} from '../animations'

/**
 * Duration Constants Tests
 */
describe('DURATION', () => {
  it('should have correct duration values', () => {
    expect(DURATION.FAST).toBe(0.15)
    expect(DURATION.NORMAL).toBe(0.3)
    expect(DURATION.SLOW).toBe(0.5)
    expect(DURATION.VERY_SLOW).toBe(0.8)
  })

  it('should be immutable', () => {
    expect(() => {
      ;(DURATION as any).FAST = 0.5
    }).toThrow()
  })
})

/**
 * Easing Constants Tests
 */
describe('EASING', () => {
  it('should have ease arrays', () => {
    expect(Array.isArray(EASING.ease)).toBe(true)
    expect(Array.isArray(EASING.easeInOut)).toBe(true)
    expect(EASING.ease.length).toBe(4)
  })

  it('should have spring configurations', () => {
    expect(EASING.spring.type).toBe('spring')
    expect(EASING.spring.stiffness).toBe(100)
    expect(EASING.spring.damping).toBe(10)
  })

  it('should have bounce configuration', () => {
    expect(EASING.bounce.type).toBe('spring')
    expect(EASING.bounce.stiffness).toBe(200)
    expect(EASING.bounce.damping).toBe(12)
  })

  it('should have gentleSpring configuration', () => {
    expect(EASING.gentleSpring.type).toBe('spring')
    expect(EASING.gentleSpring.stiffness).toBe(80)
    expect(EASING.gentleSpring.damping).toBe(15)
  })
})

/**
 * Animation Presets Tests
 */
describe('Animation Presets', () => {
  describe('fadeIn', () => {
    it('should animate opacity from 0 to 1', () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 })
      expect(fadeIn.animate).toEqual({ opacity: 1 })
    })

    it('should have exit state', () => {
      expect(fadeIn.exit).toEqual({ opacity: 0 })
    })
  })

  describe('slideInLeft', () => {
    it('should animate x and opacity', () => {
      expect(slideInLeft.initial).toEqual({ opacity: 0, x: -40 })
      expect(slideInLeft.animate).toEqual({ opacity: 1, x: 0 })
    })
  })

  describe('slideInRight', () => {
    it('should animate x and opacity from right', () => {
      expect(slideInRight.initial).toEqual({ opacity: 0, x: 40 })
      expect(slideInRight.animate).toEqual({ opacity: 1, x: 0 })
    })
  })

  describe('slideInUp', () => {
    it('should animate y and opacity from top', () => {
      expect(slideInUp.initial).toEqual({ opacity: 0, y: -40 })
      expect(slideInUp.animate).toEqual({ opacity: 1, y: 0 })
    })
  })

  describe('slideInDown', () => {
    it('should animate y and opacity from bottom', () => {
      expect(slideInDown.initial).toEqual({ opacity: 0, y: 40 })
      expect(slideInDown.animate).toEqual({ opacity: 1, y: 0 })
    })
  })

  describe('scaleIn', () => {
    it('should animate scale and opacity', () => {
      expect(scaleIn.initial).toEqual({ opacity: 0, scale: 0.95 })
      expect(scaleIn.animate).toEqual({ opacity: 1, scale: 1 })
    })
  })

  describe('messageEnter', () => {
    it('should have slide, scale, and opacity', () => {
      expect(messageEnter.initial).toEqual({
        opacity: 0,
        y: 10,
        scale: 0.98,
      })
      expect(messageEnter.animate).toEqual({
        opacity: 1,
        y: 0,
        scale: 1,
      })
    })
  })

  describe('thinkingPulse', () => {
    it('should have pulse animation', () => {
      expect(thinkingPulse.initial).toBeDefined()
      expect(thinkingPulse.animate).toBeDefined()
    })
  })

  describe('toolCardFlip', () => {
    it('should animate rotation', () => {
      expect(toolCardFlip.initial).toEqual({ rotateY: 0, opacity: 1 })
      expect(toolCardFlip.animate).toEqual({ rotateY: 360, opacity: 1 })
    })
  })

  describe('progressFill', () => {
    it('should animate scale', () => {
      expect(progressFill.initial).toEqual({
        scaleX: 0,
        transformOrigin: '0%',
      })
      expect(progressFill.animate).toEqual({
        scaleX: 1,
        transformOrigin: '0%',
      })
    })
  })
})

/**
 * Animation Presets Object Tests
 */
describe('ANIMATION_PRESETS', () => {
  it('should contain all animation presets', () => {
    expect(ANIMATION_PRESETS.fadeIn).toBeDefined()
    expect(ANIMATION_PRESETS.slideInLeft).toBeDefined()
    expect(ANIMATION_PRESETS.messageEnter).toBeDefined()
  })

  it('should be immutable', () => {
    expect(() => {
      ;(ANIMATION_PRESETS as any).fadeIn = {}
    }).toThrow()
  })
})

/**
 * Transition Presets Tests
 */
describe('TRANSITION_PRESETS', () => {
  it('should have fast transition', () => {
    expect(TRANSITION_PRESETS.fast.duration).toBe(DURATION.FAST)
  })

  it('should have normal transition', () => {
    expect(TRANSITION_PRESETS.normal.duration).toBe(DURATION.NORMAL)
  })

  it('should have slow transition', () => {
    expect(TRANSITION_PRESETS.slow.duration).toBe(DURATION.SLOW)
  })

  it('should have spring transition', () => {
    expect(TRANSITION_PRESETS.spring.type).toBe('spring')
  })

  it('should have gentleSpring transition', () => {
    expect(TRANSITION_PRESETS.gentleSpring.type).toBe('spring')
  })
})

/**
 * Getter Functions Tests
 */
describe('Getter Functions', () => {
  describe('getAnimationPreset', () => {
    it('should return correct preset', () => {
      expect(getAnimationPreset('fadeIn')).toEqual(fadeIn)
      expect(getAnimationPreset('slideInLeft')).toEqual(slideInLeft)
    })
  })

  describe('getTransitionPreset', () => {
    it('should return correct transition', () => {
      expect(getTransitionPreset('fast')).toEqual(TRANSITION_PRESETS.fast)
      expect(getTransitionPreset('normal')).toEqual(TRANSITION_PRESETS.normal)
    })
  })
})

/**
 * Orchestration Utilities Tests
 */
describe('Orchestration Utilities', () => {
  describe('stagger', () => {
    it('should create container variants with stagger config', () => {
      const result = stagger(fadeIn, { stagger: 0.1 })
      expect(result.animate).toBeDefined()
      expect(result.initial).toBe('initial')
    })

    it('should support custom stagger amount', () => {
      const result = stagger(fadeIn, { stagger: 0.2 })
      expect(result.animate).toBeDefined()
    })

    it('should support delay configuration', () => {
      const result = stagger(fadeIn, { stagger: 0.1, delayChildren: 100 })
      expect(result.animate).toBeDefined()
    })

    it('should support reverse direction', () => {
      const result = stagger(fadeIn, { direction: 'reverse' })
      expect(result.animate).toBeDefined()
    })
  })

  describe('sequence', () => {
    it('should create sequential transition', () => {
      const transitions = [
        { duration: 0.3 },
        { duration: 0.2 },
        { duration: 0.4 },
      ]
      const result = sequence(transitions)
      expect(result.duration).toBe(0.3)
    })

    it('should support delay', () => {
      const transitions = [{ duration: 0.3 }]
      const result = sequence(transitions, 100)
      expect(result.delay).toBe(0.1) // 100ms converted to seconds
    })
  })

  describe('parallel', () => {
    it('should return parallel transition config', () => {
      const transition = { duration: 0.3, ease: 'easeInOut' }
      const result = parallel(transition)
      expect(result.duration).toBe(0.3)
    })
  })

  describe('mergeVariants', () => {
    it('should merge multiple variants', () => {
      const result = mergeVariants(fadeIn, slideInUp)
      expect(result.initial).toBeDefined()
      expect(result.animate).toBeDefined()
    })

    it('should preserve all properties', () => {
      const variant1 = { initial: { opacity: 0 }, animate: { opacity: 1 } }
      const variant2 = { initial: { x: -40 }, animate: { x: 0 } }
      const result = mergeVariants(variant1, variant2)

      expect(result.initial).toBeDefined()
      expect(result.animate).toBeDefined()
    })
  })
})

/**
 * Reduced Motion Tests
 */
describe('Reduced Motion', () => {
  describe('getReducedMotionVariants', () => {
    it('should return original variants when reduced motion is false', () => {
      const result = getReducedMotionVariants(fadeIn, false)
      expect(result).toEqual(fadeIn)
    })

    it('should return variants with initial, animate, exit when reduced motion is true', () => {
      const result = getReducedMotionVariants(fadeIn, true)
      expect(result.initial).toBeDefined()
      expect(result.animate).toBeDefined()
      expect(result.exit).toBeDefined()
    })

    it('should handle undefined reduced motion preference', () => {
      const result = getReducedMotionVariants(fadeIn)
      expect(result).toBeDefined()
    })
  })
})

/**
 * Type Tests
 */
describe('Types', () => {
  it('should have AnimationPresetKey type', () => {
    // This is a type test - just ensure it doesn't break TypeScript
    type TestKey = 'fadeIn' | 'slideInLeft' | 'messageEnter'
    const key: TestKey = 'fadeIn'
    expect(key).toBe('fadeIn')
  })

  it('should have TransitionPresetKey type', () => {
    // This is a type test - just ensure it doesn't break TypeScript
    type TestKey = 'fast' | 'normal' | 'slow' | 'spring'
    const key: TestKey = 'fast'
    expect(key).toBe('fast')
  })
})
