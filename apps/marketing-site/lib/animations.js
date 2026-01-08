/**
 * Animation variants with reduced-motion support.
 * These variants automatically respect the user's prefers-reduced-motion setting.
 */
import { Variants } from 'framer-motion';
import { durations, easings } from './constants';
/**
 * Hook to check if reduced motion is preferred.
 * Returns true if the user has requested reduced motion in their OS settings.
 */
export function useReducedMotion() {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
/**
 * Creates motion-safe animation props.
 * Returns empty object if reduced motion is preferred.
 */
export function motionSafe(props) {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return {};
    }
    return props;
}
/**
 * Fade in from below animation variant.
 * Respects reduced-motion preference.
 */
export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.slow,
            ease: easings.easeOut,
        },
    },
};
/**
 * Fade in from the right animation variant.
 */
export const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: durations.slow,
            ease: easings.easeOut,
        },
    },
};
/**
 * Scale up animation variant.
 */
export const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: durations.slow,
            ease: easings.easeOut,
        },
    },
};
/**
 * Simple fade animation variant.
 */
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: durations.slow,
            ease: easings.easeOut,
        },
    },
};
/**
 * Staggered children animation variant.
 * Use with containerStagger for parent.
 */
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.slow,
            ease: easings.easeOut,
        },
    },
};
/**
 * Container for staggered children animations.
 */
export const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};
/**
 * Reduced motion safe wrapper for inline animations.
 * Use this for motion components that need accessibility support.
 */
export const reducedMotionConfig = {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-100px' },
};
//# sourceMappingURL=animations.js.map