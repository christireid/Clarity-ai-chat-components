/**
 * Accessibility Utilities
 * Helpers for building accessible dev tools components
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Screen reader announcer component
 * Announces dynamic content changes to assistive technologies
 */
export function ScreenReaderAnnouncer({ message, politeness = 'polite', className, }) {
    return (_jsx("div", { role: "status", "aria-live": politeness, "aria-atomic": "true", className: `sr-only ${className || ''}`, children: message }));
}
/**
 * Hook for announcing messages to screen readers
 */
export function useAnnounce() {
    const [message, setMessage] = React.useState('');
    const [politeness, setPoliteness] = React.useState('polite');
    const announce = React.useCallback((text, level = 'polite') => {
        // Clear first to ensure re-announcement of same message
        setMessage('');
        setPoliteness(level);
        // Set message in next tick
        setTimeout(() => setMessage(text), 50);
    }, []);
    const Announcer = React.useCallback(() => _jsx(ScreenReaderAnnouncer, { message: message, politeness: politeness }), [message, politeness]);
    return { announce, Announcer };
}
/**
 * Skip link for keyboard navigation
 * Allows users to skip repetitive navigation
 */
export function SkipLink({ targetId, children = 'Skip to main content', className, }) {
    const handleClick = (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (_jsx("a", { href: `#${targetId}`, className: `skip-link ${className || ''}`, onClick: handleClick, children: children }));
}
/**
 * Hook for trapping focus within a container
 * Useful for modals and dialogs
 */
export function useFocusTrap(containerRef, options = {}) {
    const { enabled = true, returnFocus = true, initialFocus } = options;
    const previousActiveElement = React.useRef(null);
    React.useEffect(() => {
        if (!enabled || !containerRef.current)
            return;
        // Store the previously focused element
        previousActiveElement.current = document.activeElement;
        // Focus initial element or first focusable
        const container = containerRef.current;
        const focusableElements = getFocusableElements(container);
        if (initialFocus) {
            const initial = container.querySelector(initialFocus);
            initial?.focus();
        }
        else if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        else {
            container.focus();
        }
        // Handle Tab key for trapping
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab')
                return;
            const elements = getFocusableElements(container);
            if (elements.length === 0)
                return;
            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
            else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Return focus when trap is disabled
            if (returnFocus && previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [enabled, containerRef, returnFocus, initialFocus]);
}
/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container) {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
    ].join(', ');
    const elements = container.querySelectorAll(focusableSelectors);
    return Array.from(elements);
}
/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardNavigation({ items, selectedIndex, onSelect, wrap = true, orientation = 'vertical', }) {
    const handleKeyDown = React.useCallback((e) => {
        const length = items.length;
        if (length === 0)
            return;
        let newIndex = selectedIndex;
        const isVertical = orientation === 'vertical' || orientation === 'both';
        const isHorizontal = orientation === 'horizontal' || orientation === 'both';
        switch (e.key) {
            case 'ArrowDown':
                if (isVertical) {
                    e.preventDefault();
                    newIndex = wrap
                        ? (selectedIndex + 1) % length
                        : Math.min(selectedIndex + 1, length - 1);
                }
                break;
            case 'ArrowUp':
                if (isVertical) {
                    e.preventDefault();
                    newIndex = wrap
                        ? (selectedIndex - 1 + length) % length
                        : Math.max(selectedIndex - 1, 0);
                }
                break;
            case 'ArrowRight':
                if (isHorizontal) {
                    e.preventDefault();
                    newIndex = wrap
                        ? (selectedIndex + 1) % length
                        : Math.min(selectedIndex + 1, length - 1);
                }
                break;
            case 'ArrowLeft':
                if (isHorizontal) {
                    e.preventDefault();
                    newIndex = wrap
                        ? (selectedIndex - 1 + length) % length
                        : Math.max(selectedIndex - 1, 0);
                }
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = length - 1;
                break;
            default:
                return;
        }
        if (newIndex !== selectedIndex) {
            onSelect(newIndex);
        }
    }, [items.length, selectedIndex, onSelect, wrap, orientation]);
    return { onKeyDown: handleKeyDown };
}
// ============================================================================
// Reduced Motion
// ============================================================================
/**
 * Hook to detect user's reduced motion preference
 */
export function useReducedMotion() {
    const [reducedMotion, setReducedMotion] = React.useState(false);
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleChange = (e) => {
            setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return reducedMotion;
}
// ============================================================================
// High Contrast
// ============================================================================
/**
 * Hook to detect high contrast mode
 */
export function useHighContrast() {
    const [highContrast, setHighContrast] = React.useState(false);
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(forced-colors: active)');
        setHighContrast(mediaQuery.matches);
        const handleChange = (e) => {
            setHighContrast(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return highContrast;
}
// ============================================================================
// ARIA Helpers
// ============================================================================
/**
 * Generate unique IDs for ARIA relationships
 */
export function useAriaIds(prefix = 'dt') {
    const id = React.useId();
    return {
        labelId: `${prefix}-label-${id}`,
        descriptionId: `${prefix}-desc-${id}`,
        errorId: `${prefix}-error-${id}`,
        controlId: `${prefix}-control-${id}`,
    };
}
/**
 * Props for accessible descriptions
 */
export function getDescribedByProps(hasError, hasDescription, errorId, descriptionId) {
    const describedBy = [];
    if (hasError)
        describedBy.push(errorId);
    if (hasDescription)
        describedBy.push(descriptionId);
    return describedBy.length > 0
        ? { 'aria-describedby': describedBy.join(' ') }
        : {};
}
/**
 * Component to visually hide content but keep it accessible to screen readers
 */
export function VisuallyHidden({ children, hidden = false, }) {
    if (hidden) {
        return _jsx("span", { hidden: true, children: children });
    }
    return _jsx("span", { className: "sr-only", children: children });
}
export default {
    ScreenReaderAnnouncer,
    SkipLink,
    VisuallyHidden,
    useAnnounce,
    useFocusTrap,
    useKeyboardNavigation,
    useReducedMotion,
    useHighContrast,
    useAriaIds,
    getFocusableElements,
    getDescribedByProps,
};
//# sourceMappingURL=accessibility.js.map