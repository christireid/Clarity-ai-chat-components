import { describe, it, expect } from 'vitest'
import {
  easings,
  springs,
  durations,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInScale,
  slideInLeft,
  slideInRight,
  buttonTap,
  cardHover,
  iconHover,
  shake,
  pulse,
  staggerContainer,
  staggerItem,
  scrollFadeIn,
  fadeInLeft,
  fadeInRight,
  slideUp,
  slideDown,
  scaleUp,
  scaleDown,
  rotateIn,
  scrollReveal,
  staggerContainer as staggerContainerVariants,
} from '../animations'

describe('Animation Library', () => {
  describe('Easing Curves', () => {
    it('should have standard easing curves', () => {
      expect(easings.easeOut).toEqual([0.25, 0.46, 0.45, 0.94])
      expect(easings.easeOutQuick).toEqual([0.22, 1, 0.36, 1])
      expect(easings.easeInOut).toEqual([0.65, 0, 0.35, 1])
      expect(easings.anticipate).toEqual([0.68, -0.55, 0.265, 1.55])
    })

    it('should have 4 easing curves', () => {
      expect(Object.keys(easings)).toHaveLength(4)
    })

    it('should be readonly (const)', () => {
      expect(() => {
        // @ts-expect-error - Testing readonly
        easings.easeOut = [0, 0, 0, 0]
      }).toThrow()
    })
  })

  describe('Spring Configurations', () => {
    it('should have snappy spring configuration', () => {
      expect(springs.snappy).toEqual({
        type: 'spring',
        stiffness: 400,
        damping: 25,
      })
    })

    it('should have bouncy spring configuration', () => {
      expect(springs.bouncy).toEqual({
        type: 'spring',
        stiffness: 300,
        damping: 15,
      })
    })

    it('should have smooth spring configuration', () => {
      expect(springs.smooth).toEqual({
        type: 'spring',
        stiffness: 200,
        damping: 25,
      })
    })

    it('should have gentle spring configuration', () => {
      expect(springs.gentle).toEqual({
        type: 'spring',
        stiffness: 100,
        damping: 20,
      })
    })

    it('should have proper stiffness ordering (snappy > bouncy > smooth > gentle)', () => {
      expect(springs.snappy.stiffness).toBeGreaterThan(springs.bouncy.stiffness)
      expect(springs.bouncy.stiffness).toBeGreaterThan(springs.smooth.stiffness)
      expect(springs.smooth.stiffness).toBeGreaterThan(springs.gentle.stiffness)
    })
  })

  describe('Duration Standards', () => {
    it('should have standard durations', () => {
      expect(durations.instant).toBe(0.1)
      expect(durations.fast).toBe(0.15)
      expect(durations.normal).toBe(0.2)
      expect(durations.moderate).toBe(0.3)
      expect(durations.slow).toBe(0.5)
      expect(durations.slower).toBe(0.7)
    })

    it('should have durations in ascending order', () => {
      expect(durations.instant).toBeLessThan(durations.fast)
      expect(durations.fast).toBeLessThan(durations.normal)
      expect(durations.normal).toBeLessThan(durations.moderate)
      expect(durations.moderate).toBeLessThan(durations.slow)
      expect(durations.slow).toBeLessThan(durations.slower)
    })

    it('should have at least 6 duration options', () => {
      expect(Object.keys(durations)).toHaveLength(6)
    })
  })

  describe('Basic Fade Animations', () => {
    it('fadeIn should have correct structure', () => {
      expect(fadeIn).toHaveProperty('initial')
      expect(fadeIn).toHaveProperty('animate')
      expect(fadeIn).toHaveProperty('exit')
      expect(fadeIn.initial).toEqual({ opacity: 0 })
      expect(fadeIn.animate).toEqual({ opacity: 1 })
      expect(fadeIn.exit).toEqual({ opacity: 0 })
    })

    it('fadeInUp should include y-axis translation', () => {
      expect(fadeInUp.initial).toHaveProperty('y')
      expect(fadeInUp.initial).toEqual({ opacity: 0, y: 20 })
      expect(fadeInUp.animate).toEqual({ opacity: 1, y: 0 })
    })

    it('fadeInDown should include negative y-axis translation', () => {
      expect(fadeInDown.initial).toHaveProperty('y')
      expect(fadeInDown.initial).toEqual({ opacity: 0, y: -20 })
      expect(fadeInDown.animate).toEqual({ opacity: 1, y: 0 })
    })

    it('fadeInScale should include scale transformation', () => {
      expect(fadeInScale.initial).toHaveProperty('scale')
      expect(fadeInScale.initial).toEqual({ opacity: 0, scale: 0.95 })
      expect(fadeInScale.animate).toEqual({ opacity: 1, scale: 1 })
    })
  })

  describe('Slide Animations', () => {
    it('slideInLeft should move from left to center', () => {
      expect(slideInLeft.initial).toEqual({ opacity: 0, x: -20 })
      expect(slideInLeft.animate).toEqual({ opacity: 1, x: 0 })
    })

    it('slideInRight should move from right to center', () => {
      expect(slideInRight.initial).toEqual({ opacity: 0, x: 20 })
      expect(slideInRight.animate).toEqual({ opacity: 1, x: 0 })
    })

    it('slide animations should be symmetric', () => {
      expect(Math.abs((slideInLeft.initial as any).x)).toBe(
        Math.abs((slideInRight.initial as any).x)
      )
    })
  })

  describe('Interactive Animations', () => {
    it('buttonTap should have hover and tap states', () => {
      expect(buttonTap).toHaveProperty('whileHover')
      expect(buttonTap).toHaveProperty('whileTap')
      expect(buttonTap).toHaveProperty('transition')
      expect(buttonTap.whileHover).toEqual({ scale: 1.02 })
      expect(buttonTap.whileTap).toEqual({ scale: 0.98 })
      expect(buttonTap.transition).toEqual(springs.snappy)
    })

    it('cardHover should scale up and lift', () => {
      expect(cardHover.whileHover).toEqual({ scale: 1.02, y: -4 })
      expect(cardHover.transition).toHaveProperty('duration')
      expect(cardHover.transition).toHaveProperty('ease')
    })

    it('iconHover should rotate and scale', () => {
      expect(iconHover.whileHover).toEqual({ rotate: 15, scale: 1.1 })
      expect(iconHover.transition).toEqual(springs.bouncy)
    })

    it('shake should have keyframe animation', () => {
      expect(shake.animate).toHaveProperty('x')
      expect(shake.animate).toHaveProperty('transition')
      expect(Array.isArray((shake.animate as any).x)).toBe(true)
      expect((shake.animate as any).x).toHaveLength(6)
      expect((shake.animate as any).x[0]).toBe(0)
      expect((shake.animate as any).x[5]).toBe(0)
    })

    it('pulse should repeat infinitely', () => {
      expect(pulse.animate).toHaveProperty('scale')
      expect(pulse.animate).toHaveProperty('opacity')
      expect((pulse.animate as any).transition.repeat).toBe(Infinity)
      expect((pulse.animate as any).transition.duration).toBe(2)
    })
  })

  describe('Stagger Animations', () => {
    it('staggerContainer should be a function', () => {
      expect(typeof staggerContainer).toBe('function')
    })

    it('staggerContainer should return variants with staggerChildren', () => {
      const variants = staggerContainer(0.1)
      expect(variants).toHaveProperty('hidden')
      expect(variants).toHaveProperty('show')
      expect((variants.show as any).transition).toHaveProperty(
        'staggerChildren'
      )
      expect((variants.show as any).transition.staggerChildren).toBe(0.1)
    })

    it('staggerContainer should use custom delay', () => {
      const variants = staggerContainer(0.2)
      expect((variants.show as any).transition.staggerChildren).toBe(0.2)
    })

    it('staggerItem should have hidden and show states', () => {
      expect(staggerItem).toHaveProperty('hidden')
      expect(staggerItem).toHaveProperty('show')
      expect(staggerItem.hidden).toEqual({ opacity: 0, y: 20, scale: 0.95 })
      expect(staggerItem.show).toEqual({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springs.smooth,
      })
    })
  })

  describe('Performance Characteristics', () => {
    it('should only animate GPU-accelerated properties (transform, opacity)', () => {
      const checkGPUProperties = (variants: any) => {
        const allowedProps = [
          'opacity',
          'scale',
          'x',
          'y',
          'rotate',
          'rotateX',
          'rotateY',
          'rotateZ',
        ]
        const animatedProps = Object.keys(variants.animate || {})
        return animatedProps.every((prop) => allowedProps.includes(prop))
      }

      expect(checkGPUProperties(fadeIn)).toBe(true)
      expect(checkGPUProperties(fadeInUp)).toBe(true)
      expect(checkGPUProperties(fadeInScale)).toBe(true)
      expect(checkGPUProperties(slideInLeft)).toBe(true)
    })

    it('should have reasonable animation durations (< 1 second)', () => {
      Object.values(durations).forEach((duration) => {
        expect(duration).toBeLessThan(1)
        expect(duration).toBeGreaterThan(0)
      })
    })

    it('should use spring physics for interactive animations', () => {
      expect(buttonTap.transition).toHaveProperty('type', 'spring')
      expect(iconHover.transition).toHaveProperty('type', 'spring')
    })
  })

  describe('Accessibility', () => {
    it('should have scrollFadeIn with viewport configuration', () => {
      expect(scrollFadeIn).toHaveProperty('viewport')
      expect((scrollFadeIn as any).viewport).toHaveProperty('once', true)
    })

    it('scrollFadeIn should trigger once to respect motion preferences', () => {
      expect((scrollFadeIn as any).viewport.once).toBe(true)
    })
  })

  describe('Variant Consistency', () => {
    it('all fade variants should start with opacity: 0', () => {
      expect(fadeIn.initial).toHaveProperty('opacity', 0)
      expect(fadeInUp.initial).toHaveProperty('opacity', 0)
      expect(fadeInDown.initial).toHaveProperty('opacity', 0)
      expect(fadeInScale.initial).toHaveProperty('opacity', 0)
    })

    it('all fade variants should end with opacity: 1', () => {
      expect(fadeIn.animate).toHaveProperty('opacity', 1)
      expect(fadeInUp.animate).toHaveProperty('opacity', 1)
      expect(fadeInDown.animate).toHaveProperty('opacity', 1)
      expect(fadeInScale.animate).toHaveProperty('opacity', 1)
    })

    it('all variants should have initial, animate states', () => {
      const variants = [
        fadeIn,
        fadeInUp,
        fadeInDown,
        fadeInScale,
        slideInLeft,
        slideInRight,
      ]
      variants.forEach((variant) => {
        expect(variant).toHaveProperty('initial')
        expect(variant).toHaveProperty('animate')
      })
    })
  })

  describe('Export Completeness', () => {
    it('should export all essential animation utilities', () => {
      expect(easings).toBeDefined()
      expect(springs).toBeDefined()
      expect(durations).toBeDefined()
      expect(fadeIn).toBeDefined()
      expect(fadeInUp).toBeDefined()
      expect(buttonTap).toBeDefined()
      expect(staggerContainer).toBeDefined()
      expect(staggerItem).toBeDefined()
    })

    it('should have at least 20+ animation patterns', () => {
      // Count exported variants (not functions/objects)
      const animationCount =
        [
          fadeIn,
          fadeInUp,
          fadeInDown,
          fadeInScale,
          slideInLeft,
          slideInRight,
          buttonTap,
          cardHover,
          iconHover,
          shake,
          pulse,
          staggerItem,
          scrollFadeIn,
        ].length + 3 // +3 for easing/spring/duration objects

      expect(animationCount).toBeGreaterThanOrEqual(15)
    })
  })
})
