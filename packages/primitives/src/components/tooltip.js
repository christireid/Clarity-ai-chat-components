import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
// ============================================================================
// Tooltip Component
// ============================================================================
export const Tooltip = ({ children, content, side = 'top', align = 'center', delay = 200, showArrow = true, className, contentClassName, disabled = false, open: controlledOpen, onOpenChange, }) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    // eslint-disable-next-line no-unused-vars
    const [_position, _setPosition] = React.useState({ x: 0, y: 0 });
    const triggerRef = React.useRef(null);
    const tooltipRef = React.useRef(null);
    const timeoutRef = React.useRef();
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = React.useCallback((newOpen) => {
        if (controlledOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [controlledOpen, onOpenChange]);
    // Calculate tooltip position
    const calculatePosition = React.useCallback(() => {
        if (!triggerRef.current || !tooltipRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        // const tooltipRect = tooltipRef.current.getBoundingClientRect()
        let x = 0;
        let y = 0;
        // Calculate base position based on side
        switch (side) {
            case 'top':
                x = triggerRect.left + triggerRect.width / 2;
                y = triggerRect.top;
                break;
            case 'bottom':
                x = triggerRect.left + triggerRect.width / 2;
                y = triggerRect.bottom;
                break;
            case 'left':
                x = triggerRect.left;
                y = triggerRect.top + triggerRect.height / 2;
                break;
            case 'right':
                x = triggerRect.right;
                y = triggerRect.top + triggerRect.height / 2;
                break;
        }
        // Adjust for alignment
        if (side === 'top' || side === 'bottom') {
            switch (align) {
                case 'start':
                    x = triggerRect.left;
                    break;
                case 'end':
                    x = triggerRect.right;
                    break;
                // 'center' is default
            }
        }
        else {
            switch (align) {
                case 'start':
                    y = triggerRect.top;
                    break;
                case 'end':
                    y = triggerRect.bottom;
                    break;
                // 'center' is default
            }
        }
        _setPosition({ x, y });
    }, [side, align]);
    // Handle mouse enter with delay
    const handleMouseEnter = () => {
        if (disabled)
            return;
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setOpen(true);
            calculatePosition();
        }, delay);
    };
    // Handle mouse leave
    const handleMouseLeave = () => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        setOpen(false);
    };
    // Update position on scroll/resize
    React.useEffect(() => {
        if (!open)
            return;
        const updatePosition = () => {
            calculatePosition();
        };
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [open, calculatePosition]);
    // Cleanup timeout
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, []);
    // Animation variants based on side
    const getAnimationVariants = () => {
        const offset = 8;
        switch (side) {
            case 'top':
                return {
                    initial: { opacity: 0, y: offset },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: offset },
                };
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -offset },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -offset },
                };
            case 'left':
                return {
                    initial: { opacity: 0, x: offset },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: offset },
                };
            case 'right':
                return {
                    initial: { opacity: 0, x: -offset },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -offset },
                };
        }
    };
    // Get transform origin based on side and align
    const getTransformOrigin = () => {
        if (side === 'top')
            return 'bottom';
        if (side === 'bottom')
            return 'top';
        if (side === 'left')
            return 'right';
        if (side === 'right')
            return 'left';
        return 'center';
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: triggerRef, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onFocus: handleMouseEnter, onBlur: handleMouseLeave, className: cn('inline-block', className), children: children }), typeof document !== 'undefined' && (_jsx(TooltipPortal, { children: _jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: tooltipRef, ...getAnimationVariants(), transition: { duration: 0.15, ease: 'easeOut' }, style: {
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            transform: getTooltipTransform(side, align),
                            transformOrigin: getTransformOrigin(),
                            zIndex: 9999,
                        }, className: cn('px-3.5 py-2 text-xs rounded-lg', 'bg-[hsl(var(--surface-overlay))] text-foreground/90', 'border border-border/70 shadow-[0_16px_32px_rgba(15,23,42,0.32)] ring-1 ring-black/5', 'pointer-events-none', contentClassName), role: "tooltip", children: [content, showArrow && (_jsx("div", { className: cn('absolute w-2.5 h-2.5 bg-[hsl(var(--surface-overlay))] border border-border/70', getArrowClasses(side, align)), style: { transform: getArrowTransform(side) } }))] })) }) }))] }));
};
// ============================================================================
// Portal Component
// ============================================================================
const TooltipPortal = ({ children }) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (!mounted)
        return null;
    return _jsx(_Fragment, { children: children });
};
// ============================================================================
// Helper Functions
// ============================================================================
function getTooltipTransform(side, align) {
    const offset = 8; // Distance from trigger
    let translateX = '-50%';
    let translateY = '-50%';
    // Base positioning
    if (side === 'top') {
        translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
        translateY = `calc(-100% - ${offset}px)`;
    }
    else if (side === 'bottom') {
        translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
        translateY = `${offset}px`;
    }
    else if (side === 'left') {
        translateX = `calc(-100% - ${offset}px)`;
        translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
    }
    else if (side === 'right') {
        translateX = `${offset}px`;
        translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
    }
    return `translate(${translateX}, ${translateY})`;
}
function getArrowClasses(side, align) {
    const baseClasses = [];
    // Position arrow on opposite side
    if (side === 'top') {
        baseClasses.push('bottom-[-5px]', 'border-t', 'border-l');
        if (align === 'start')
            baseClasses.push('left-3');
        else if (align === 'end')
            baseClasses.push('right-3');
        else
            baseClasses.push('left-1/2', '-translate-x-1/2');
    }
    else if (side === 'bottom') {
        baseClasses.push('top-[-5px]', 'border-b', 'border-r');
        if (align === 'start')
            baseClasses.push('left-3');
        else if (align === 'end')
            baseClasses.push('right-3');
        else
            baseClasses.push('left-1/2', '-translate-x-1/2');
    }
    else if (side === 'left') {
        baseClasses.push('right-[-5px]', 'border-l', 'border-b');
        if (align === 'start')
            baseClasses.push('top-3');
        else if (align === 'end')
            baseClasses.push('bottom-3');
        else
            baseClasses.push('top-1/2', '-translate-y-1/2');
    }
    else if (side === 'right') {
        baseClasses.push('left-[-5px]', 'border-r', 'border-t');
        if (align === 'start')
            baseClasses.push('top-3');
        else if (align === 'end')
            baseClasses.push('bottom-3');
        else
            baseClasses.push('top-1/2', '-translate-y-1/2');
    }
    return baseClasses.join(' ');
}
function getArrowTransform(side) {
    if (side === 'top')
        return 'rotate(45deg)';
    if (side === 'bottom')
        return 'rotate(45deg)';
    if (side === 'left')
        return 'rotate(45deg)';
    if (side === 'right')
        return 'rotate(45deg)';
    return 'rotate(45deg)';
}
// ============================================================================
// Simple Tooltip (Alternative API)
// ============================================================================
export const SimpleTooltip = ({ children, text, side = 'top', delay = 200 }) => {
    return (_jsx(Tooltip, { content: text, side: side, delay: delay, children: children }));
};
//# sourceMappingURL=tooltip.js.map