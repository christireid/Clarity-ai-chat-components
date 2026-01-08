/**
 * Animation variants with reduced-motion support.
 * These variants automatically respect the user's prefers-reduced-motion setting.
 */
import { Variants } from 'framer-motion';
/**
 * Hook to check if reduced motion is preferred.
 * Returns true if the user has requested reduced motion in their OS settings.
 */
export declare function useReducedMotion(): boolean;
/**
 * Creates motion-safe animation props.
 * Returns empty object if reduced motion is preferred.
 */
export declare function motionSafe<T extends object>(props: T): T | Record<string, never>;
/**
 * Fade in from below animation variant.
 * Respects reduced-motion preference.
 */
export declare const fadeInUp: Variants;
/**
 * Fade in from the right animation variant.
 */
export declare const fadeInRight: Variants;
/**
 * Scale up animation variant.
 */
export declare const scaleUp: Variants;
/**
 * Simple fade animation variant.
 */
export declare const fadeIn: Variants;
/**
 * Staggered children animation variant.
 * Use with containerStagger for parent.
 */
export declare const staggerItem: Variants;
/**
 * Container for staggered children animations.
 */
export declare const containerStagger: Variants;
/**
 * Reduced motion safe wrapper for inline animations.
 * Use this for motion components that need accessibility support.
 */
export declare const reducedMotionConfig: {
    readonly initial: "hidden";
    readonly whileInView: "visible";
    readonly viewport: {
        readonly once: true;
        readonly margin: "-100px";
    };
};
//# sourceMappingURL=animations.d.ts.map