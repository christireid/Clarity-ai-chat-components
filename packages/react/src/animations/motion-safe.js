/**
 * Motion-Safe Animation Utilities
 *
 * Provides animation variants that automatically respect `prefers-reduced-motion`.
 * When reduced motion is preferred, animations are simplified or disabled entirely.
 */
/**
 * Create animation variants that respect reduced motion preferences
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param variants - Animation variants (initial, animate, exit)
 * @param fallbackVariants - Optional simplified variants for reduced motion (default: instant opacity changes)
 * @returns Motion-safe animation variants
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * const variants = getMotionSafeVariants(prefersReducedMotion, {
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   exit: { opacity: 0, y: -20 }
 * })
 *
 * return <motion.div variants={variants} />
 * ```
 */
export function getMotionSafeVariants(reducedMotion, variants, fallbackVariants) {
    if (!reducedMotion) {
        return variants;
    }
    // Default fallback: instant opacity changes only
    const defaultFallback = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };
    return (fallbackVariants || defaultFallback);
}
/**
 * Get motion-safe transition settings
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param transition - Transition configuration
 * @returns Motion-safe transition (instant if reduced motion)
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={getMotionSafeTransition(prefersReducedMotion, {
 *     duration: 0.3,
 *     ease: 'easeOut'
 *   })}
 * />
 * ```
 */
export function getMotionSafeTransition(reducedMotion, transition) {
    if (reducedMotion) {
        return { duration: 0 };
    }
    return transition;
}
/**
 * Get motion-safe duration
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param duration - Duration in seconds
 * @returns 0 if reduced motion, original duration otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={{ duration: getMotionSafeDuration(prefersReducedMotion, 0.3) }}
 * />
 * ```
 */
export function getMotionSafeDuration(reducedMotion, duration) {
    return reducedMotion ? 0 : duration;
}
/**
 * Get motion-safe scale value
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param scale - Scale value
 * @returns 1 if reduced motion (no scale), original scale otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   whileHover={{ scale: getMotionSafeScale(prefersReducedMotion, 1.05) }}
 * />
 * ```
 */
export function getMotionSafeScale(reducedMotion, scale) {
    return reducedMotion ? 1 : scale;
}
/**
 * Get motion-safe animation value
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param value - Animation value
 * @param fallback - Fallback value for reduced motion (default: 0)
 * @returns Fallback if reduced motion, original value otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{
 *     y: getMotionSafeValue(prefersReducedMotion, 20, 0),
 *     rotate: getMotionSafeValue(prefersReducedMotion, 45, 0)
 *   }}
 * />
 * ```
 */
export function getMotionSafeValue(reducedMotion, value, fallback = 0) {
    return reducedMotion ? fallback : value;
}
/**
 * Common motion-safe animation presets
 */
export const MOTION_SAFE_PRESETS = {
    /**
     * Fade in/out - safe for reduced motion (opacity only)
     */
    fade: {
        full: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        reduced: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
    /**
     * Slide up - simplified for reduced motion
     */
    slideUp: {
        full: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        reduced: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
    /**
     * Scale - simplified for reduced motion
     */
    scale: {
        full: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
        },
        reduced: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
    /**
     * Slide and scale - simplified for reduced motion
     */
    slideScale: {
        full: {
            initial: { opacity: 0, y: 10, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 10, scale: 0.95 },
        },
        reduced: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
};
/**
 * Get preset variants that respect reduced motion
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param preset - Preset name
 * @returns Motion-safe variants
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const variants = getMotionSafePreset(prefersReducedMotion, 'slideUp')
 *
 * <motion.div variants={variants} />
 * ```
 */
export function getMotionSafePreset(reducedMotion, preset) {
    return reducedMotion
        ? MOTION_SAFE_PRESETS[preset].reduced
        : MOTION_SAFE_PRESETS[preset].full;
}
/**
 * Create motion-safe animation variants with a clean factory API
 *
 * This factory automatically handles reduced motion preferences and provides
 * consistent animation configurations across components.
 *
 * @param config - Variant configuration
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Complete motion configuration object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *
 *   const motion = createMotionVariants({
 *     initial: { opacity: 0, y: 20 },
 *     animate: { opacity: 1, y: 0 },
 *     exit: { opacity: 0, y: -10 },
 *     hover: { scale: 1.02 },
 *     tap: { scale: 0.98 },
 *     transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
 *   }, prefersReducedMotion)
 *
 *   return (
 *     <motion.div
 *       variants={motion.variants}
 *       initial="initial"
 *       animate="animate"
 *       exit="exit"
 *       whileHover={motion.interactions.whileHover}
 *       whileTap={motion.interactions.whileTap}
 *       transition={motion.transition}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function createMotionVariants(config, prefersReducedMotion) {
    const { initial, animate, exit = initial, hover, tap, focus, reduced, transition = {}, } = config;
    // Default reduced motion variants (opacity only)
    const defaultReduced = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        hover: hover ? { opacity: 0.9 } : undefined,
        tap: tap ? { opacity: 0.8 } : undefined,
        focus: focus ? { opacity: 0.95 } : undefined,
    };
    // Merge custom reduced variants with defaults
    const reducedVariants = {
        ...defaultReduced,
        ...reduced,
    };
    // Select appropriate variants based on motion preference
    const variants = prefersReducedMotion
        ? {
            initial: reducedVariants.initial ?? { opacity: 0 },
            animate: reducedVariants.animate ?? { opacity: 1 },
            exit: reducedVariants.exit ?? { opacity: 0 },
        }
        : {
            initial,
            animate,
            exit,
        };
    // Select appropriate interaction variants
    const interactions = prefersReducedMotion
        ? {
            whileHover: reducedVariants.hover,
            whileTap: reducedVariants.tap,
            whileFocus: reducedVariants.focus,
        }
        : {
            whileHover: hover,
            whileTap: tap,
            whileFocus: focus,
        };
    // Configure transition (instant for reduced motion)
    const transitionConfig = prefersReducedMotion
        ? { duration: 0, ease: 'linear', delay: 0 }
        : {
            duration: transition.duration ?? 0.2,
            ease: transition.ease ?? [0.4, 0, 0.2, 1],
            delay: transition.delay ?? 0,
        };
    return {
        variants,
        interactions,
        transition: transitionConfig,
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
    };
}
/**
 * Simplified variant factory for common use cases
 *
 * @param preset - Preset animation type
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Motion configuration object
 *
 * @example
 * ```tsx
 * const motion = createPresetVariants('slideUp', prefersReducedMotion)
 * return <motion.div {...motion.props}>Content</motion.div>
 * ```
 */
export function createPresetVariants(preset, prefersReducedMotion) {
    const variants = getMotionSafePreset(prefersReducedMotion, preset);
    return {
        variants,
        props: {
            variants,
            initial: 'initial',
            animate: 'animate',
            exit: 'exit',
        },
    };
}
//# sourceMappingURL=motion-safe.js.map