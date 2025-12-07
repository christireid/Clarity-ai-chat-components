/**
 * Animation Utilities
 *
 * Helper functions for creating consistent animations across components.
 */
import { ANIMATION_DURATION, ANIMATION_EASING, STAGGER_TIMING, } from './constants';
/**
 * Create a fade animation variant
 */
export function createFadeVariant(duration = 'normal', easing = 'default') {
    return {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
    };
}
/**
 * Create a slide animation variant
 */
export function createSlideVariant(direction, distance = 20, duration = 'normal', easing = 'out') {
    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const value = direction === 'down' || direction === 'right' ? distance : -distance;
    return {
        initial: {
            opacity: 0,
            [axis]: value,
        },
        animate: {
            opacity: 1,
            [axis]: 0,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
        exit: {
            opacity: 0,
            [axis]: -value,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
    };
}
/**
 * Create a scale animation variant
 */
export function createScaleVariant(initialScale = 0.9, duration = 'fast', easing = 'spring') {
    return {
        initial: {
            opacity: 0,
            scale: initialScale,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
        exit: {
            opacity: 0,
            scale: initialScale,
            transition: {
                duration: ANIMATION_DURATION[duration] / 1000,
                ease: ANIMATION_EASING[easing],
            },
        },
    };
}
/**
 * Create a stagger container variant
 */
export function createStaggerContainerVariant(staggerSpeed = 'normal', delayChildren = 0) {
    return {
        initial: {},
        animate: {
            transition: {
                staggerChildren: STAGGER_TIMING[staggerSpeed],
                delayChildren,
            },
        },
        exit: {
            transition: {
                staggerChildren: STAGGER_TIMING[staggerSpeed] / 2,
                staggerDirection: -1,
            },
        },
    };
}
/**
 * Create a stagger child variant
 */
export function createStaggerChildVariant(type = 'slide', duration = 'fast') {
    switch (type) {
        case 'fade':
            return {
                initial: { opacity: 0 },
                animate: {
                    opacity: 1,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
                exit: {
                    opacity: 0,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
            };
        case 'scale':
            return {
                initial: { opacity: 0, scale: 0.8 },
                animate: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
                exit: {
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
            };
        case 'slide':
        default:
            return {
                initial: { opacity: 0, y: 10 },
                animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
                exit: {
                    opacity: 0,
                    y: -10,
                    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
                },
            };
    }
}
/**
 * Create a hover/tap interaction
 */
export function createInteractionVariant(hoverScale = 1.02, tapScale = 0.98, duration = 'instant') {
    return {
        hover: { scale: hoverScale },
        tap: { scale: tapScale },
        transition: { duration: ANIMATION_DURATION[duration] / 1000 },
    };
}
/**
 * Create a loading pulse animation
 */
export function createPulseAnimation(minOpacity = 0.5, maxOpacity = 0.8, duration = 1.5) {
    return {
        animate: {
            opacity: [minOpacity, maxOpacity, minOpacity],
            transition: {
                duration,
                repeat: Infinity,
                ease: ANIMATION_EASING.inOut,
            },
        },
    };
}
/**
 * Create a shimmer loading animation
 */
export function createShimmerAnimation(duration = 2) {
    return {
        animate: {
            backgroundPosition: ['200% 0', '-200% 0'],
            transition: {
                duration,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };
}
/**
 * Create a spinner rotation animation
 */
export function createSpinnerAnimation(duration = 1) {
    return {
        animate: {
            rotate: [0, 360],
            transition: {
                duration,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };
}
/**
 * Create a dots loading animation
 */
export function createDotsAnimation(delay = 0, duration = 1.5) {
    return {
        animate: {
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
            transition: {
                duration,
                repeat: Infinity,
                delay,
            },
        },
    };
}
/**
 * Create a bounce animation
 */
export function createBounceAnimation(height = -10, duration = 0.5) {
    return {
        animate: {
            y: [0, height, 0],
            transition: {
                duration,
                repeat: Infinity,
                ease: ANIMATION_EASING.out,
            },
        },
    };
}
/**
 * Create a shake animation
 */
export function createShakeAnimation(intensity = 10, duration = 0.5) {
    return {
        animate: {
            x: [-intensity, intensity, -intensity, intensity, 0],
            transition: {
                duration,
            },
        },
    };
}
/**
 * Create a success checkmark animation
 */
export function createSuccessAnimation() {
    return {
        initial: { scale: 0, rotate: -45 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: ANIMATION_DURATION.normal / 1000,
                ease: ANIMATION_EASING.spring,
            },
        },
    };
}
/**
 * Create an error shake animation
 */
export function createErrorAnimation() {
    return {
        animate: {
            x: [-10, 10, -10, 10, 0],
            transition: {
                duration: 0.4,
            },
        },
    };
}
/**
 * Merge multiple transitions
 */
export function mergeTransitions(...transitions) {
    return transitions.reduce((acc, transition) => ({ ...acc, ...transition }), {});
}
/**
 * Get duration in seconds
 */
export function getDurationInSeconds(duration) {
    return ANIMATION_DURATION[duration] / 1000;
}
/**
 * Get duration in milliseconds
 */
export function getDurationInMs(duration) {
    return ANIMATION_DURATION[duration];
}
/**
 * Create custom spring transition
 */
export function createSpringTransition(stiffness = 300, damping = 20) {
    return {
        type: 'spring',
        stiffness,
        damping,
    };
}
/**
 * Create custom tween transition
 */
export function createTweenTransition(duration = 'normal', easing = 'default', delay = 0) {
    return {
        type: 'tween',
        duration: getDurationInSeconds(duration),
        ease: ANIMATION_EASING[easing],
        delay,
    };
}
//# sourceMappingURL=utils.js.map