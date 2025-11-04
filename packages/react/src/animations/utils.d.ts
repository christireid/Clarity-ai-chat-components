/**
 * Animation Utilities
 *
 * Helper functions for creating consistent animations across components.
 */
import { Variants, Transition } from 'framer-motion';
import { AnimationDuration, AnimationEasing, StaggerTiming } from './constants';
/**
 * Create a fade animation variant
 */
export declare function createFadeVariant(duration?: AnimationDuration, easing?: AnimationEasing): Variants;
/**
 * Create a slide animation variant
 */
export declare function createSlideVariant(direction: 'up' | 'down' | 'left' | 'right', distance?: number, duration?: AnimationDuration, easing?: AnimationEasing): Variants;
/**
 * Create a scale animation variant
 */
export declare function createScaleVariant(initialScale?: number, duration?: AnimationDuration, easing?: AnimationEasing): Variants;
/**
 * Create a stagger container variant
 */
export declare function createStaggerContainerVariant(staggerSpeed?: StaggerTiming, delayChildren?: number): Variants;
/**
 * Create a stagger child variant
 */
export declare function createStaggerChildVariant(type?: 'fade' | 'slide' | 'scale', duration?: AnimationDuration): Variants;
/**
 * Create a hover/tap interaction
 */
export declare function createInteractionVariant(hoverScale?: number, tapScale?: number, duration?: AnimationDuration): {
    hover: {
        scale: number;
    };
    tap: {
        scale: number;
    };
    transition: {
        duration: number;
    };
};
/**
 * Create a loading pulse animation
 */
export declare function createPulseAnimation(minOpacity?: number, maxOpacity?: number, duration?: number): Variants;
/**
 * Create a shimmer loading animation
 */
export declare function createShimmerAnimation(duration?: number): Variants;
/**
 * Create a spinner rotation animation
 */
export declare function createSpinnerAnimation(duration?: number): Variants;
/**
 * Create a dots loading animation
 */
export declare function createDotsAnimation(delay?: number, duration?: number): Variants;
/**
 * Create a bounce animation
 */
export declare function createBounceAnimation(height?: number, duration?: number): Variants;
/**
 * Create a shake animation
 */
export declare function createShakeAnimation(intensity?: number, duration?: number): Variants;
/**
 * Create a success checkmark animation
 */
export declare function createSuccessAnimation(): Variants;
/**
 * Create an error shake animation
 */
export declare function createErrorAnimation(): Variants;
/**
 * Merge multiple transitions
 */
export declare function mergeTransitions(...transitions: Partial<Transition>[]): Transition;
/**
 * Get duration in seconds
 */
export declare function getDurationInSeconds(duration: AnimationDuration): number;
/**
 * Get duration in milliseconds
 */
export declare function getDurationInMs(duration: AnimationDuration): number;
/**
 * Create custom spring transition
 */
export declare function createSpringTransition(stiffness?: number, damping?: number): Transition;
/**
 * Create custom tween transition
 */
export declare function createTweenTransition(duration?: AnimationDuration, easing?: AnimationEasing, delay?: number): Transition;
//# sourceMappingURL=utils.d.ts.map