'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Focus Indicator Component
 *
 * Provides beautiful, animated focus indicators that follow focused elements.
 * Enhances keyboard navigation with visual feedback.
 *
 * Features:
 * - Smooth animated focus ring that follows elements
 * - Customizable colors and styles
 * - Respects reduced motion preferences
 * - Works with any focusable element
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { useReducedMotion } from '@clarity-chat/primitives';
import { EASING_FRAMER } from '../../animations/constants';
export function FocusIndicator({ enabled = true, className, color = 'hsl(var(--primary))', ringWidth = 2, offset = 3, borderRadius = 'inherit', duration = 150, keyboardOnly = true, }) {
    const [focusRect, setFocusRect] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isKeyboardNav, setIsKeyboardNav] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();
    const animationDuration = prefersReducedMotion ? 0 : duration;
    // Track keyboard vs mouse navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsKeyboardNav(true);
            }
        };
        const handleMouseDown = () => {
            setIsKeyboardNav(false);
        };
        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('mousedown', handleMouseDown, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('mousedown', handleMouseDown, true);
        };
    }, []);
    // Track focused element
    React.useEffect(() => {
        if (!enabled) {
            setIsVisible(false);
            return;
        }
        const updateFocusRect = () => {
            const activeElement = document.activeElement;
            // Skip if not keyboard navigation and keyboardOnly is true
            if (keyboardOnly && !isKeyboardNav) {
                setIsVisible(false);
                return;
            }
            // Skip if no active element or it's the body
            if (!activeElement || activeElement === document.body) {
                setIsVisible(false);
                return;
            }
            // Skip elements that should not show focus indicator
            if (activeElement.hasAttribute('data-no-focus-indicator') ||
                activeElement.closest('[data-no-focus-indicator]')) {
                setIsVisible(false);
                return;
            }
            const rect = activeElement.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(activeElement);
            // Calculate border radius
            let br;
            if (borderRadius === 'inherit') {
                br = computedStyle.borderRadius || '0px';
            }
            else if (typeof borderRadius === 'number') {
                br = `${borderRadius}px`;
            }
            else {
                br = borderRadius;
            }
            setFocusRect({
                x: rect.x - offset,
                y: rect.y - offset,
                width: rect.width + offset * 2,
                height: rect.height + offset * 2,
                borderRadius: br,
            });
            setIsVisible(true);
        };
        const handleFocus = () => {
            // Small delay to ensure DOM has updated
            requestAnimationFrame(updateFocusRect);
        };
        const handleBlur = () => {
            setIsVisible(false);
        };
        const handleScroll = () => {
            if (isVisible) {
                updateFocusRect();
            }
        };
        const handleResize = () => {
            if (isVisible) {
                updateFocusRect();
            }
        };
        document.addEventListener('focusin', handleFocus, true);
        document.addEventListener('focusout', handleBlur, true);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        // Initial check
        if (document.activeElement && document.activeElement !== document.body) {
            handleFocus();
        }
        return () => {
            document.removeEventListener('focusin', handleFocus, true);
            document.removeEventListener('focusout', handleBlur, true);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [enabled, offset, borderRadius, keyboardOnly, isKeyboardNav, isVisible]);
    return (_jsx(AnimatePresence, { children: isVisible && focusRect && (_jsx(motion.div, { className: cn('fixed pointer-events-none z-[9998]', 'border-solid', className), initial: {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
            }, animate: {
                opacity: 1,
                scale: 1,
                x: focusRect.x,
                y: focusRect.y,
                width: focusRect.width,
                height: focusRect.height,
                borderRadius: focusRect.borderRadius,
            }, exit: {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
            }, transition: {
                duration: animationDuration / 1000,
                ease: EASING_FRAMER.sharp,
            }, style: {
                borderWidth: ringWidth,
                borderColor: color,
                boxShadow: `0 0 0 ${ringWidth}px ${color}20, 0 0 ${ringWidth * 4}px ${color}30`,
            }, "aria-hidden": "true" })) }));
}
FocusIndicator.displayName = 'FocusIndicator';
/**
 * Hook to detect if the user is navigating with keyboard
 */
export function useKeyboardNavigating() {
    const [isKeyboardNav, setIsKeyboardNav] = React.useState(false);
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsKeyboardNav(true);
            }
        };
        const handleMouseDown = () => {
            setIsKeyboardNav(false);
        };
        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('mousedown', handleMouseDown, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('mousedown', handleMouseDown, true);
        };
    }, []);
    return isKeyboardNav;
}
export function FocusRing({ children, focusClassName, color = 'hsl(var(--ring))', ringWidth = 2, enabled = true, keyboardOnly = true, }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const isKeyboardNav = useKeyboardNavigating();
    const showRing = enabled && isFocused && (!keyboardOnly || isKeyboardNav);
    return (_jsx("div", { className: cn('relative transition-shadow duration-150', showRing && (focusClassName || 'ring-2 ring-offset-2'), showRing && `ring-[${color}]`), style: showRing
            ? {
                boxShadow: `0 0 0 ${ringWidth}px ${color}`,
            }
            : undefined, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), children: children }));
}
FocusRing.displayName = 'FocusRing';
export function FocusVisible({ children }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const isKeyboardNav = useKeyboardNavigating();
    const isFocusVisible = isFocused && isKeyboardNav;
    return (_jsx("div", { onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), children: children(isFocusVisible) }));
}
FocusVisible.displayName = 'FocusVisible';
//# sourceMappingURL=focus-indicator.js.map