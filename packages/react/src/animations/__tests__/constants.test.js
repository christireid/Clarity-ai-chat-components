/**
 * Animation Constants Unit Tests
 *
 * Tests to ensure animation constants are properly exported and used.
 * These tests prevent the "undefined durations" bug from recurring.
 */
import { describe, it, expect } from 'vitest';
import { DURATION_SECONDS, DURATION_CSS, ANIMATION_DURATION, ANIMATION_EASING, EASING_FRAMER, DELAY_SECONDS, STAGGER_TIMING, duration, delay, ease, getTransition, getEasing, getTailwindTransition, getPreset, getInteractionVariant, ANIMATION_PRESETS, INTERACTION_VARIANTS, } from '../constants';
describe('Animation Constants', () => {
    describe('DURATION_SECONDS', () => {
        it('should export all duration keys', () => {
            expect(DURATION_SECONDS).toHaveProperty('instant');
            expect(DURATION_SECONDS).toHaveProperty('faster');
            expect(DURATION_SECONDS).toHaveProperty('fast');
            expect(DURATION_SECONDS).toHaveProperty('normal');
            expect(DURATION_SECONDS).toHaveProperty('slow');
            expect(DURATION_SECONDS).toHaveProperty('slower');
            expect(DURATION_SECONDS).toHaveProperty('slowest');
        });
        it('should have numeric values in seconds', () => {
            expect(typeof DURATION_SECONDS.instant).toBe('number');
            expect(typeof DURATION_SECONDS.fast).toBe('number');
            expect(typeof DURATION_SECONDS.normal).toBe('number');
            expect(typeof DURATION_SECONDS.slower).toBe('number');
        });
        it('should have values less than 1 second (Framer Motion format)', () => {
            expect(DURATION_SECONDS.instant).toBe(0);
            expect(DURATION_SECONDS.fast).toBeLessThan(1);
            expect(DURATION_SECONDS.normal).toBeLessThan(1);
            expect(DURATION_SECONDS.slowest).toBeLessThanOrEqual(1);
        });
        it('should be in ascending order', () => {
            expect(DURATION_SECONDS.instant).toBeLessThan(DURATION_SECONDS.faster);
            expect(DURATION_SECONDS.faster).toBeLessThan(DURATION_SECONDS.fast);
            expect(DURATION_SECONDS.fast).toBeLessThan(DURATION_SECONDS.normal);
            expect(DURATION_SECONDS.normal).toBeLessThan(DURATION_SECONDS.slow);
            expect(DURATION_SECONDS.slow).toBeLessThan(DURATION_SECONDS.slower);
            expect(DURATION_SECONDS.slower).toBeLessThan(DURATION_SECONDS.slowest);
        });
    });
    describe('DURATION_CSS', () => {
        it('should export CSS-formatted strings', () => {
            expect(DURATION_CSS.instant).toBe('0ms');
            expect(DURATION_CSS.fast).toMatch(/^\d+ms$/);
            expect(DURATION_CSS.normal).toMatch(/^\d+ms$/);
        });
    });
    describe('duration() helper', () => {
        it('should return the correct duration for valid keys', () => {
            expect(duration('fast')).toBe(DURATION_SECONDS.fast);
            expect(duration('normal')).toBe(DURATION_SECONDS.normal);
            expect(duration('slower')).toBe(DURATION_SECONDS.slower);
        });
        it('should return a number', () => {
            expect(typeof duration('fast')).toBe('number');
        });
        // TypeScript will catch invalid keys at compile time
        // This test ensures runtime behavior is correct
        it('should work with all defined keys', () => {
            const keys = [
                'instant',
                'faster',
                'fast',
                'normal',
                'slow',
                'slower',
                'slowest',
            ];
            keys.forEach((key) => {
                expect(() => duration(key)).not.toThrow();
                expect(typeof duration(key)).toBe('number');
            });
        });
    });
    describe('delay() helper', () => {
        it('should return the correct delay for valid keys', () => {
            expect(delay('none')).toBe(DELAY_SECONDS.none);
            expect(delay('short')).toBe(DELAY_SECONDS.short);
            expect(delay('normal')).toBe(DELAY_SECONDS.normal);
        });
    });
    describe('ease() helper', () => {
        it('should return Framer Motion compatible easing', () => {
            expect(ease('linear')).toBe('linear');
            expect(Array.isArray(ease('out'))).toBe(true);
            expect(Array.isArray(ease('default'))).toBe(true);
        });
    });
    describe('ANIMATION_EASING', () => {
        it('should export CSS cubic-bezier values', () => {
            expect(ANIMATION_EASING.linear).toBe('linear');
            expect(ANIMATION_EASING.default).toMatch(/cubic-bezier/);
            expect(ANIMATION_EASING.out).toMatch(/cubic-bezier/);
        });
    });
    describe('EASING_FRAMER', () => {
        it('should export Framer Motion compatible values', () => {
            expect(EASING_FRAMER.linear).toBe('linear');
            expect(Array.isArray(EASING_FRAMER.default)).toBe(true);
            expect(EASING_FRAMER.default).toHaveLength(4);
        });
    });
    describe('getTransition()', () => {
        it('should return a valid transition config', () => {
            const transition = getTransition('normal', 'default', false);
            expect(transition).toHaveProperty('duration');
            expect(transition).toHaveProperty('ease');
            expect(transition).toHaveProperty('delay');
            expect(transition.duration).toBe(DURATION_SECONDS.normal);
        });
        it('should return zero duration for reduced motion', () => {
            const transition = getTransition('normal', 'default', true);
            expect(transition.duration).toBe(0);
            expect(transition.ease).toBe('linear');
        });
    });
    describe('getEasing()', () => {
        it('should return all easing formats', () => {
            const easing = getEasing('out');
            expect(easing).toHaveProperty('css');
            expect(easing).toHaveProperty('framer');
            expect(easing).toHaveProperty('tailwind');
        });
    });
    describe('getTailwindTransition()', () => {
        it('should return Tailwind transition classes', () => {
            const classes = getTailwindTransition('normal', 'default');
            expect(classes).toContain('transition-all');
            expect(classes).toContain('duration-');
        });
    });
    describe('ANIMATION_PRESETS', () => {
        it('should have all standard presets', () => {
            expect(ANIMATION_PRESETS).toHaveProperty('fadeIn');
            expect(ANIMATION_PRESETS).toHaveProperty('slideUp');
            expect(ANIMATION_PRESETS).toHaveProperty('slideDown');
            expect(ANIMATION_PRESETS).toHaveProperty('scale');
        });
        it('should have initial, animate, exit states', () => {
            expect(ANIMATION_PRESETS.fadeIn).toHaveProperty('initial');
            expect(ANIMATION_PRESETS.fadeIn).toHaveProperty('animate');
            expect(ANIMATION_PRESETS.fadeIn).toHaveProperty('exit');
        });
    });
    describe('INTERACTION_VARIANTS', () => {
        it('should have all interaction types', () => {
            expect(INTERACTION_VARIANTS).toHaveProperty('button');
            expect(INTERACTION_VARIANTS).toHaveProperty('card');
            expect(INTERACTION_VARIANTS).toHaveProperty('icon');
            expect(INTERACTION_VARIANTS).toHaveProperty('link');
        });
        it('should have hover and tap states', () => {
            expect(INTERACTION_VARIANTS.button).toHaveProperty('hover');
            expect(INTERACTION_VARIANTS.button).toHaveProperty('tap');
        });
    });
    describe('getPreset()', () => {
        it('should return correct preset for normal motion', () => {
            const preset = getPreset('fadeIn', false);
            expect(preset.initial).toEqual({ opacity: 0 });
        });
        it('should return reduced preset for reduced motion', () => {
            const preset = getPreset('slideUp', true);
            // Reduced motion presets only use opacity
            expect(preset.initial).toEqual({ opacity: 0 });
            expect(preset.animate).toEqual({ opacity: 1 });
        });
    });
    describe('getInteractionVariant()', () => {
        it('should return correct variant for normal motion', () => {
            const variant = getInteractionVariant('button', false);
            expect(variant.hover).toHaveProperty('scale');
        });
        it('should return reduced variant for reduced motion', () => {
            const variant = getInteractionVariant('button', true);
            expect(variant.hover).not.toHaveProperty('scale');
            expect(variant.hover).toHaveProperty('opacity');
        });
    });
    describe('STAGGER_TIMING', () => {
        it('should export stagger values in seconds', () => {
            expect(STAGGER_TIMING.instant).toBe(0);
            expect(STAGGER_TIMING.normal).toBeGreaterThan(0);
            expect(STAGGER_TIMING.normal).toBeLessThan(1);
        });
    });
});
describe('Regression: Undefined durations bug', () => {
    // This test ensures the bug where "durations.fast" was used instead of
    // "DURATION_SECONDS.fast" doesn't recur
    it('should NOT have a global "durations" export', async () => {
        // Dynamically import to check exports
        const exports = await import('../constants');
        expect(exports).not.toHaveProperty('durations');
    });
    it('should have DURATION_SECONDS as the correct export', () => {
        expect(DURATION_SECONDS).toBeDefined();
        expect(DURATION_SECONDS.fast).toBeDefined();
        expect(DURATION_SECONDS.normal).toBeDefined();
        expect(DURATION_SECONDS.slower).toBeDefined();
    });
    it('duration() helper should work as alternative to direct access', () => {
        // This is the new recommended pattern
        expect(duration('fast')).toBe(0.15);
        expect(duration('normal')).toBe(0.2);
        expect(duration('slower')).toBe(0.4);
    });
});
//# sourceMappingURL=constants.test.js.map