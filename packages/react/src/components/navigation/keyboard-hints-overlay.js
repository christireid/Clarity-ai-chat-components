'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Keyboard Hints Overlay
 *
 * A beautiful overlay that shows available keyboard shortcuts for the current context.
 * Appears when holding Alt/Option key for discoverability.
 *
 * Features:
 * - Context-aware hints based on current focus
 * - Animated badges positioned near actionable elements
 * - Auto-detects buttons and interactive elements
 * - Respects reduced motion preferences
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Kbd } from '@clarity-chat/primitives';
import { useReducedMotion } from '@clarity-chat/primitives';
import { formatShortcutDisplay } from '../../hooks/keyboard/use-keyboard-navigation';
import { EASING_FRAMER } from '../../animations/constants';
export function KeyboardHintsOverlay({ hints, visible, className, }) {
    const [positions, setPositions] = React.useState(new Map());
    const prefersReducedMotion = useReducedMotion();
    // Calculate positions for all hints
    React.useEffect(() => {
        if (!visible)
            return;
        const calculatePositions = () => {
            const newPositions = new Map();
            hints.forEach((hint) => {
                let element = null;
                if (typeof hint.target === 'string') {
                    element = document.querySelector(hint.target);
                }
                else if (hint.target.current) {
                    element = hint.target.current;
                }
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const position = hint.position || 'top';
                    let x = rect.x + rect.width / 2;
                    let y = rect.y;
                    switch (position) {
                        case 'top':
                            y = rect.y - 8;
                            break;
                        case 'bottom':
                            y = rect.y + rect.height + 8;
                            break;
                        case 'left':
                            x = rect.x - 8;
                            y = rect.y + rect.height / 2;
                            break;
                        case 'right':
                            x = rect.x + rect.width + 8;
                            y = rect.y + rect.height / 2;
                            break;
                        case 'center':
                            y = rect.y + rect.height / 2;
                            break;
                    }
                    newPositions.set(hint.id, { x, y, visible: true });
                }
                else {
                    newPositions.set(hint.id, { x: 0, y: 0, visible: false });
                }
            });
            setPositions(newPositions);
        };
        calculatePositions();
        // Recalculate on scroll/resize
        window.addEventListener('scroll', calculatePositions, true);
        window.addEventListener('resize', calculatePositions);
        return () => {
            window.removeEventListener('scroll', calculatePositions, true);
            window.removeEventListener('resize', calculatePositions);
        };
    }, [visible, hints]);
    return (_jsx(AnimatePresence, { children: visible && (_jsxs(motion.div, { className: cn('fixed inset-0 z-[9997] pointer-events-none', className), initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: prefersReducedMotion ? 0 : 0.15 }, children: [_jsx("div", { className: "absolute inset-0 bg-black/5 backdrop-blur-[1px]" }), hints.map((hint, index) => {
                    const pos = positions.get(hint.id);
                    if (!pos?.visible)
                        return null;
                    return (_jsx(motion.div, { className: "absolute", style: {
                            left: pos.x,
                            top: pos.y,
                            transform: 'translate(-50%, -50%)',
                        }, initial: {
                            opacity: 0,
                            scale: prefersReducedMotion ? 1 : 0.8,
                            y: prefersReducedMotion ? 0 : -10,
                        }, animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }, exit: {
                            opacity: 0,
                            scale: prefersReducedMotion ? 1 : 0.8,
                            y: prefersReducedMotion ? 0 : -10,
                        }, transition: {
                            duration: prefersReducedMotion ? 0 : 0.2,
                            delay: prefersReducedMotion ? 0 : index * 0.03,
                            ease: EASING_FRAMER.sharp,
                        }, children: _jsxs("div", { className: cn('flex items-center gap-1.5 px-2 py-1.5 rounded-lg', 'bg-foreground text-background', 'shadow-lg border border-background/10', 'text-xs font-medium'), children: [_jsx(Kbd, { shortcut: formatShortcutDisplay(hint.shortcut), size: "sm", className: "bg-background/20 border-background/30 text-background" }), hint.description && (_jsx("span", { className: "text-background/80 whitespace-nowrap", children: hint.description }))] }) }, hint.id));
                })] })) }));
}
KeyboardHintsOverlay.displayName = 'KeyboardHintsOverlay';
/**
 * Hook to show keyboard hints overlay on modifier key hold
 */
export function useKeyboardHintsOverlay(hints, options) {
    const { modifierKey = 'alt', delay = 400, enabled = true } = options || {};
    const [visible, setVisible] = React.useState(false);
    const timeoutRef = React.useRef(null);
    React.useEffect(() => {
        if (!enabled) {
            setVisible(false);
            return;
        }
        const handleKeyDown = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier && !e.repeat) {
                timeoutRef.current = setTimeout(() => {
                    setVisible(true);
                }, delay);
            }
        };
        const handleKeyUp = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, modifierKey, delay]);
    return { visible, hints };
}
export function ContextualKeyboardHints({ enabled = true, modifierKey = 'alt', delay = 400, className, }) {
    const [visible, setVisible] = React.useState(false);
    const [hints, setHints] = React.useState([]);
    const timeoutRef = React.useRef(null);
    // Discover elements with keyboard shortcuts
    const discoverHints = React.useCallback(() => {
        const newHints = [];
        // Find all elements with data-shortcut attribute
        document.querySelectorAll('[data-shortcut]').forEach((element, index) => {
            const shortcut = element.getAttribute('data-shortcut');
            const description = element.getAttribute('data-shortcut-description') ||
                element.getAttribute('aria-label') ||
                element.textContent?.trim();
            if (shortcut) {
                newHints.push({
                    id: `hint-${index}`,
                    target: `[data-shortcut="${shortcut}"]`,
                    shortcut,
                    description: description?.slice(0, 20),
                    position: element.getAttribute('data-shortcut-position') || 'top',
                });
            }
        });
        // Find buttons with aria-keyshortcuts
        document
            .querySelectorAll('[aria-keyshortcuts]')
            .forEach((element, index) => {
            const shortcut = element.getAttribute('aria-keyshortcuts');
            const description = element.getAttribute('aria-label');
            if (shortcut) {
                newHints.push({
                    id: `aria-hint-${index}`,
                    target: `[aria-keyshortcuts="${shortcut}"]`,
                    shortcut,
                    description: description?.slice(0, 20),
                });
            }
        });
        setHints(newHints);
    }, []);
    React.useEffect(() => {
        if (!enabled) {
            setVisible(false);
            return;
        }
        const handleKeyDown = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier && !e.repeat) {
                timeoutRef.current = setTimeout(() => {
                    discoverHints();
                    setVisible(true);
                }, delay);
            }
        };
        const handleKeyUp = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, modifierKey, delay, discoverHints]);
    return (_jsx(KeyboardHintsOverlay, { hints: hints, visible: visible, className: className }));
}
ContextualKeyboardHints.displayName = 'ContextualKeyboardHints';
export function WithShortcut({ shortcut, description, position = 'top', children, }) {
    return (_jsx("div", { "data-shortcut": shortcut, "data-shortcut-description": description, "data-shortcut-position": position, className: "inline-block", children: children }));
}
WithShortcut.displayName = 'WithShortcut';
//# sourceMappingURL=keyboard-hints-overlay.js.map