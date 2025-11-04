import { jsx as _jsx } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { createStaggerContainerVariant, createStaggerChildVariant, createSlideVariant, createFadeVariant, createScaleVariant, } from '../animations/utils';
/**
 * Container for animated list items with stagger effect
 */
export const AnimatedList = ({ children, variant: _variant = 'slide', // Reserved for future use
stagger = 'normal', duration: _duration = 'fast', // Reserved for future use
className, delay = 0, }) => {
    const containerVariants = createStaggerContainerVariant(stagger, delay);
    return (_jsx(motion.div, { className: className, variants: containerVariants, initial: "initial", animate: "animate", exit: "exit", children: children }));
};
/**
 * Individual list item with animation
 */
export const AnimatedListItem = ({ children, variant = 'slide', duration = 'fast', className, layout = false, }) => {
    const itemVariants = createStaggerChildVariant(variant, duration);
    return (_jsx(motion.div, { className: className, variants: itemVariants, layout: layout, children: children }));
};
/**
 * Fade in/out wrapper
 */
export const FadePresence = ({ children, duration = 'normal', className }) => {
    const variants = createFadeVariant(duration);
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Slide in/out wrapper
 */
export const SlidePresence = ({ children, direction = 'up', distance = 20, duration = 'normal', className }) => {
    const variants = createSlideVariant(direction, distance, duration);
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Scale in/out wrapper
 */
export const ScalePresence = ({ children, initialScale = 0.9, duration = 'fast', className }) => {
    const variants = createScaleVariant(initialScale, duration);
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }) }));
};
/**
 * Conditional presence wrapper - only animates when condition is true
 */
export const ConditionalPresence = ({ children, show, variant = 'fade', direction = 'up', className }) => {
    const variants = variant === 'fade'
        ? createFadeVariant()
        : variant === 'slide'
            ? createSlideVariant(direction)
            : createScaleVariant();
    return (_jsx(AnimatePresence, { mode: "wait", children: show && (_jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children })) }));
};
/**
 * Stagger children with configurable animation type
 */
export const StaggerContainer = ({ children, stagger = 'normal', delay = 0, className }) => {
    const variants = createStaggerContainerVariant(stagger, delay);
    return (_jsx(motion.div, { className: className, variants: variants, initial: "initial", animate: "animate", exit: "exit", children: children }));
};
/**
 * Grid with stagger animation
 */
export const AnimatedGrid = ({ children, columns = 3, gap = 4, stagger = 'fast', className }) => {
    const variants = createStaggerContainerVariant(stagger);
    return (_jsx(motion.div, { className: cn(`grid gap-${gap}`, className), style: { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }, variants: variants, initial: "initial", animate: "animate", children: children }));
};
//# sourceMappingURL=animated-list.js.map