import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Animated List Components
 *
 * Pre-configured AnimatePresence wrappers for common list animation patterns.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, useReducedMotion } from '@clarity-chat/primitives';
import { createStaggerContainerVariant, createStaggerChildVariant, createSlideVariant, createFadeVariant, createScaleVariant, } from '../../animations/utils';
/**
 * Container for animated list items with stagger effect
 */
export const AnimatedList = ({ children, variant: _variant = 'slide', // Reserved for future use
stagger = 'normal', duration: _duration = 'fast', // Reserved for future use
className, delay = 0, }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const containerVariants = createStaggerContainerVariant(stagger, delay);
    // When reduced motion is preferred, render without animation
    if (prefersReducedMotion) {
        return _jsx("div", { className: className, children: children });
    }
    return (_jsx(motion.div, { className: className, variants: containerVariants, initial: "initial", animate: "animate", exit: "exit", children: children }));
};
/**
 * Individual list item with animation
 */
export const AnimatedListItem = ({ children, variant = 'slide', duration = 'fast', className, layout = false, }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const itemVariants = createStaggerChildVariant(variant, duration);
    // When reduced motion is preferred, render without animation
    if (prefersReducedMotion) {
        return _jsx("div", { className: className, children: children });
    }
    return (_jsx(motion.div, { className: className, variants: itemVariants, layout: layout, children: children }));
};
/**
 * Fade in/out wrapper
 */
export const FadePresence = ({ children, duration = 'normal', className }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const variants = createFadeVariant(duration);
    // When reduced motion is preferred, render without animation
    if (prefersReducedMotion) {
        return _jsx("div", { className: className, children: children });
    }
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Slide in/out wrapper
 */
export const SlidePresence = ({ children, direction = 'up', distance = 20, duration = 'normal', className, }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const variants = createSlideVariant(direction, distance, duration);
    // Use fade-only variant when reduced motion is preferred
    const fadeVariants = createFadeVariant(duration);
    if (prefersReducedMotion) {
        return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: fadeVariants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
    }
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Scale in/out wrapper
 */
export const ScalePresence = ({ children, initialScale = 0.9, duration = 'fast', className }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const variants = createScaleVariant(initialScale, duration);
    // Use fade-only variant when reduced motion is preferred
    const fadeVariants = createFadeVariant(duration);
    if (prefersReducedMotion) {
        return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: fadeVariants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
    }
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Conditional presence wrapper - only animates when condition is true
 */
export const ConditionalPresence = ({ children, show, variant = 'fade', direction = 'up', className }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    // Use fade-only when reduced motion is preferred (for slide/scale)
    const effectiveVariant = prefersReducedMotion && variant !== 'fade' ? 'fade' : variant;
    const variants = effectiveVariant === 'fade'
        ? createFadeVariant()
        : effectiveVariant === 'slide'
            ? createSlideVariant(direction)
            : createScaleVariant();
    return (_jsx(AnimatePresence, { mode: "wait", children: show && (_jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children })) }));
};
/**
 * Stagger children with configurable animation type
 */
export const StaggerContainer = ({ children, stagger = 'normal', delay = 0, className }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const variants = createStaggerContainerVariant(stagger, delay);
    // When reduced motion is preferred, render without stagger animation
    if (prefersReducedMotion) {
        return _jsx("div", { className: className, children: children });
    }
    return (_jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }));
};
/**
 * Grid with stagger animation
 */
export const AnimatedGrid = ({ children, columns = 3, gap = 4, stagger = 'fast', className }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const variants = createStaggerContainerVariant(stagger);
    // When reduced motion is preferred, render without stagger animation
    if (prefersReducedMotion) {
        return (_jsx("div", { className: cn(`grid gap-${gap}`, className), style: { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }, children: children }));
    }
    return (_jsx(motion.div, { className: cn(`grid gap-${gap}`, className), style: { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }, variants: variants, initial: "initial", animate: "animate", children: children }));
};
//# sourceMappingURL=animated-list.js.map