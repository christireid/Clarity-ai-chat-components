import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
const PopoverContext = React.createContext(null);
const usePopover = () => {
    const context = React.useContext(PopoverContext);
    if (!context) {
        throw new Error('Popover components must be used within a Popover');
    }
    return context;
};
// ============================================================================
// Popover Root Component
// ============================================================================
export const Popover = ({ open: controlledOpen, onOpenChange, children, defaultOpen = false, }) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const triggerRef = React.useRef(null);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = React.useCallback((newOpen) => {
        if (controlledOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [controlledOpen, onOpenChange]);
    return (_jsx(PopoverContext.Provider, { value: { open, setOpen, triggerRef }, children: children }));
};
// ============================================================================
// Popover Trigger
// ============================================================================
export const PopoverTrigger = ({ children, asChild, }) => {
    const { open, setOpen, triggerRef } = usePopover();
    const handleClick = (e) => {
        e.preventDefault();
        setOpen(!open);
    };
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ref: triggerRef,
            onClick: handleClick,
            'aria-expanded': open,
            'aria-haspopup': 'dialog',
        });
    }
    return (_jsx("button", { ref: triggerRef, onClick: handleClick, type: "button", "aria-expanded": open, "aria-haspopup": "dialog", children: children }));
};
// ============================================================================
// Popover Content
// ============================================================================
export const PopoverContent = ({ children, className, side = 'bottom', align = 'center', sideOffset = 8, alignOffset = 0, closeOnClickOutside = true, closeOnEscape = true, showArrow = false, avoidCollisions = true, collisionPadding = 8, }) => {
    const { open, setOpen, triggerRef } = usePopover();
    const contentRef = React.useRef(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [actualSide, setActualSide] = React.useState(side);
    // Calculate position
    const calculatePosition = React.useCallback(() => {
        if (!triggerRef.current || !contentRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        let finalSide = side;
        let x = 0;
        let y = 0;
        // Calculate base position
        const calculateForSide = (s) => {
            let newX = 0;
            let newY = 0;
            switch (s) {
                case 'top':
                    newX = triggerRect.left + triggerRect.width / 2;
                    newY = triggerRect.top - sideOffset;
                    break;
                case 'bottom':
                    newX = triggerRect.left + triggerRect.width / 2;
                    newY = triggerRect.bottom + sideOffset;
                    break;
                case 'left':
                    newX = triggerRect.left - sideOffset;
                    newY = triggerRect.top + triggerRect.height / 2;
                    break;
                case 'right':
                    newX = triggerRect.right + sideOffset;
                    newY = triggerRect.top + triggerRect.height / 2;
                    break;
            }
            // Apply alignment
            if (s === 'top' || s === 'bottom') {
                if (align === 'start')
                    newX = triggerRect.left + alignOffset;
                else if (align === 'end')
                    newX = triggerRect.right + alignOffset;
            }
            else {
                if (align === 'start')
                    newY = triggerRect.top + alignOffset;
                else if (align === 'end')
                    newY = triggerRect.bottom + alignOffset;
            }
            return { x: newX, y: newY };
        };
        const pos = calculateForSide(side);
        x = pos.x;
        y = pos.y;
        // Collision detection
        if (avoidCollisions) {
            const willCollide = (testSide) => {
                const testPos = calculateForSide(testSide);
                let testX = testPos.x;
                let testY = testPos.y;
                // Adjust for content dimensions based on side
                if (testSide === 'top' || testSide === 'bottom') {
                    testX -= contentRect.width / 2;
                }
                if (testSide === 'top') {
                    testY -= contentRect.height;
                }
                if (testSide === 'left' || testSide === 'right') {
                    testY -= contentRect.height / 2;
                }
                if (testSide === 'left') {
                    testX -= contentRect.width;
                }
                return (testX < collisionPadding ||
                    testX + contentRect.width > viewport.width - collisionPadding ||
                    testY < collisionPadding ||
                    testY + contentRect.height > viewport.height - collisionPadding);
            };
            // Try opposite side if collision detected
            if (willCollide(side)) {
                const oppositeSides = {
                    top: 'bottom',
                    bottom: 'top',
                    left: 'right',
                    right: 'left',
                };
                const opposite = oppositeSides[side];
                if (!willCollide(opposite)) {
                    finalSide = opposite;
                    const newPos = calculateForSide(opposite);
                    x = newPos.x;
                    y = newPos.y;
                }
            }
        }
        setActualSide(finalSide);
        setPosition({ x, y });
    }, [side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, triggerRef]);
    // Update position when open changes
    React.useEffect(() => {
        if (open) {
            calculatePosition();
        }
    }, [open, calculatePosition]);
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
    // Click outside handler
    React.useEffect(() => {
        if (!open || !closeOnClickOutside)
            return;
        const handleClickOutside = (e) => {
            if (contentRef.current &&
                triggerRef.current &&
                !contentRef.current.contains(e.target) &&
                !triggerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closeOnClickOutside, setOpen, triggerRef]);
    // Escape key handler
    React.useEffect(() => {
        if (!open || !closeOnEscape)
            return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, setOpen]);
    // Animation variants
    const getAnimationVariants = () => {
        const offset = 8;
        switch (actualSide) {
            case 'top':
                return {
                    initial: { opacity: 0, y: offset, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: offset, scale: 0.95 },
                };
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -offset, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -offset, scale: 0.95 },
                };
            case 'left':
                return {
                    initial: { opacity: 0, x: offset, scale: 0.95 },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: offset, scale: 0.95 },
                };
            case 'right':
                return {
                    initial: { opacity: 0, x: -offset, scale: 0.95 },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: -offset, scale: 0.95 },
                };
        }
    };
    if (!open)
        return null;
    return (_jsx(PopoverPortal, { children: _jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: contentRef, ...getAnimationVariants(), transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }, style: {
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    transform: getPopoverTransform(actualSide, align),
                    transformOrigin: getTransformOrigin(actualSide),
                    zIndex: 9999,
                }, className: cn('bg-popover text-popover-foreground', 'border-2 rounded-xl shadow-xl', 'outline-none backdrop-blur-sm', 'animate-in fade-in-0 zoom-in-95', className), role: "dialog", "aria-modal": "false", children: [children, showArrow && (_jsx("div", { className: cn('absolute w-3 h-3 bg-[hsl(var(--surface-elevated))] border border-border/60', getArrowClasses(actualSide, align)), style: { transform: 'rotate(45deg)' } }))] })) }) }));
};
// ============================================================================
// Portal Component
// ============================================================================
const PopoverPortal = ({ children }) => {
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
function getPopoverTransform(side, align) {
    let translateX = '-50%';
    let translateY = '-50%';
    if (side === 'top') {
        translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
        translateY = '-100%';
    }
    else if (side === 'bottom') {
        translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
        translateY = '0%';
    }
    else if (side === 'left') {
        translateX = '-100%';
        translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
    }
    else if (side === 'right') {
        translateX = '0%';
        translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
    }
    return `translate(${translateX}, ${translateY})`;
}
function getTransformOrigin(side) {
    if (side === 'top')
        return 'bottom';
    if (side === 'bottom')
        return 'top';
    if (side === 'left')
        return 'right';
    if (side === 'right')
        return 'left';
    return 'center';
}
function getArrowClasses(side, align) {
    const baseClasses = [];
    if (side === 'top') {
        baseClasses.push('bottom-[-5px]', 'border-t', 'border-l');
        if (align === 'start')
            baseClasses.push('left-4');
        else if (align === 'end')
            baseClasses.push('right-4');
        else
            baseClasses.push('left-1/2', '-translate-x-1/2');
    }
    else if (side === 'bottom') {
        baseClasses.push('top-[-5px]', 'border-b', 'border-r');
        if (align === 'start')
            baseClasses.push('left-4');
        else if (align === 'end')
            baseClasses.push('right-4');
        else
            baseClasses.push('left-1/2', '-translate-x-1/2');
    }
    else if (side === 'left') {
        baseClasses.push('right-[-5px]', 'border-l', 'border-b');
        if (align === 'start')
            baseClasses.push('top-4');
        else if (align === 'end')
            baseClasses.push('bottom-4');
        else
            baseClasses.push('top-1/2', '-translate-y-1/2');
    }
    else if (side === 'right') {
        baseClasses.push('left-[-5px]', 'border-r', 'border-t');
        if (align === 'start')
            baseClasses.push('top-4');
        else if (align === 'end')
            baseClasses.push('bottom-4');
        else
            baseClasses.push('top-1/2', '-translate-y-1/2');
    }
    return baseClasses.join(' ');
}
// ============================================================================
// Popover Sub-components
// ============================================================================
export const PopoverClose = ({ children, className, asChild }) => {
    const { setOpen } = usePopover();
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: () => setOpen(false),
        });
    }
    return (_jsx("button", { onClick: () => setOpen(false), className: className, type: "button", children: children }));
};
export const PopoverAnchor = ({ children }) => {
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=popover.js.map