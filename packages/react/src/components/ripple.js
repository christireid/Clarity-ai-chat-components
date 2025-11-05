import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Ripple Effect Component
 *
 * Material Design-inspired ripple effect for buttons and clickable elements.
 * Provides tactile feedback on click/tap.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_EASING } from '../animations/constants';
/**
 * Hook to manage ripple effect state
 */
export function useRipple({ duration = 600, color, opacity = 0.3, disabled = false, } = {}) {
    const [ripples, setRipples] = React.useState();
    const rippleIdRef = React.useRef(0);
    const addRipple = React.useCallback((event) => {
        if (disabled)
            return;
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        // Get click/touch position
        const x = 'touches' in event
            ? event.touches[0].clientX - rect.left
            : event.clientX - rect.left;
        const y = 'touches' in event
            ? event.touches[0].clientY - rect.top
            : event.clientY - rect.top;
        // Calculate size (diameter to cover the entire element)
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = {
            id: rippleIdRef.current++,
            x,
            y,
            size,
        };
        setRipples((prev) => [...(prev || []), ripple]);
        // Remove ripple after animation completes
        setTimeout(() => {
            setRipples((prev) => prev?.filter((r) => r.id !== ripple.id));
        }, duration);
    }, [duration, disabled]);
    const clearRipples = React.useCallback(() => {
        setRipples([]);
    }, []);
    return {
        ripples,
        addRipple,
        clearRipples,
        rippleProps: {
            color,
            opacity,
            duration,
        },
    };
}
export const Ripple = ({ ripples = [], color, opacity = 0.3, duration = 600, }) => {
    return (_jsx("span", { className: "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none", "aria-hidden": "true", children: _jsx(AnimatePresence, { children: ripples.map((ripple) => (_jsx(motion.span, { className: "absolute", style: {
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: color || 'currentColor',
                    opacity: opacity,
                }, initial: { scale: 0, opacity: opacity }, animate: { scale: 2, opacity: 0 }, exit: { opacity: 0 }, transition: {
                    duration: duration / 1000,
                    ease: ANIMATION_EASING.out,
                } }, ripple.id))) }) }));
};
export const WithRipple = ({ children, className, onClick, onTouchStart, ...rippleProps }) => {
    const { ripples, addRipple, rippleProps: computedRippleProps } = useRipple(rippleProps);
    const handleClick = (event) => {
        addRipple(event);
        onClick?.(event);
    };
    const handleTouchStart = (event) => {
        addRipple(event);
        onTouchStart?.(event);
    };
    return (_jsxs("span", { className: `relative overflow-hidden ${className || ''}`, onClick: handleClick, onTouchStart: handleTouchStart, children: [children, _jsx(Ripple, { ripples: ripples, ...computedRippleProps })] }));
};
//# sourceMappingURL=ripple.js.map