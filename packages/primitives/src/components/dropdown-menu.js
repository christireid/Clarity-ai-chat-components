import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
const DropdownMenuContext = React.createContext(null);
const useDropdownMenu = () => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error('DropdownMenu components must be used within a DropdownMenu');
    }
    return context;
};
export const DropdownMenu = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, }) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const triggerRef = React.useRef(null);
    const focusFirstRef = React.useRef(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = React.useCallback((newOpen) => {
        if (controlledOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [controlledOpen, onOpenChange]);
    const close = React.useCallback((options = {}) => {
        const shouldFocusTrigger = options.focusTrigger ?? true;
        setOpen(false);
        if (shouldFocusTrigger && typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
                triggerRef.current?.focus();
            });
        }
    }, [setOpen]);
    const contextValue = React.useMemo(() => ({ open, setOpen, close, triggerRef, focusFirstRef }), [open, setOpen, close]);
    return (_jsx(DropdownMenuContext.Provider, { value: contextValue, children: children }));
};
const composeEventHandlers = (original, ours) => {
    return (event) => {
        original?.(event);
        if (!event.defaultPrevented) {
            ours?.(event);
        }
    };
};
export const DropdownMenuTrigger = ({ children, asChild = false, disabled = false, }) => {
    const { open, setOpen, triggerRef, focusFirstRef } = useDropdownMenu();
    const handleOpen = (nextOpen) => {
        if (disabled)
            return;
        setOpen(nextOpen);
    };
    const toggle = () => handleOpen(!open);
    const handleKeyDown = (event) => {
        if (disabled)
            return;
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            focusFirstRef.current = true;
            handleOpen(true);
        }
    };
    if (asChild && React.isValidElement(children)) {
        const child = children;
        return React.cloneElement(child, {
            ref: (node) => {
                // @ts-expect-error - need to assign to ref for proper DOM reference
                triggerRef.current = node;
                const { ref } = child;
                if (typeof ref === 'function') {
                    ref(node);
                }
                else if (ref && typeof ref === 'object') {
                    ref.current = node;
                }
            },
            onClick: composeEventHandlers(child.props.onClick, () => toggle()),
            onKeyDown: composeEventHandlers(child.props.onKeyDown, handleKeyDown),
            'aria-haspopup': 'menu',
            'aria-expanded': open,
            'data-state': open ? 'open' : 'closed',
            disabled,
        });
    }
    return (_jsx("button", { type: "button", ref: triggerRef, onClick: toggle, onKeyDown: handleKeyDown, "aria-haspopup": "menu", "aria-expanded": open, "data-state": open ? 'open' : 'closed', disabled: disabled, className: cn('inline-flex items-center gap-2 rounded-lg border border-border/60 bg-[hsl(var(--surface-elevated))] px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200', 'hover:border-primary/40 hover:text-primary hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60'), children: children }));
};
const DropdownMenuContent = ({ children, className, align = 'start', side = 'bottom', sideOffset = 8, alignOffset = 0, loopNavigation = true, autoFocus = true, }) => {
    const { open, close, triggerRef, focusFirstRef } = useDropdownMenu();
    const contentRef = React.useRef(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [actualSide, setActualSide] = React.useState(side);
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
        const willCollide = (testSide) => {
            const testPos = calculateForSide(testSide);
            if (!testPos)
                return false;
            let testX = testPos.x;
            let testY = testPos.y;
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
            const padding = 8;
            return (testX < padding ||
                testX + contentRect.width > viewport.width - padding ||
                testY < padding ||
                testY + contentRect.height > viewport.height - padding);
        };
        const basePos = calculateForSide(side);
        x = basePos?.x ?? 0;
        y = basePos?.y ?? 0;
        if (willCollide(side)) {
            const opposite = {
                top: 'bottom',
                bottom: 'top',
                left: 'right',
                right: 'left',
            }[side];
            if (!willCollide(opposite)) {
                finalSide = opposite;
                const newPos = calculateForSide(opposite);
                x = newPos?.x ?? x;
                y = newPos?.y ?? y;
            }
        }
        setActualSide(finalSide);
        setPosition({ x, y });
    }, [align, alignOffset, side, sideOffset, triggerRef]);
    React.useEffect(() => {
        if (open) {
            calculatePosition();
        }
    }, [open, calculatePosition]);
    React.useEffect(() => {
        if (!open)
            return;
        const updatePosition = () => calculatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open, calculatePosition]);
    React.useEffect(() => {
        if (!open)
            return;
        const handleClickOutside = (event) => {
            if (contentRef.current &&
                triggerRef.current &&
                !contentRef.current.contains(event.target) &&
                !triggerRef.current.contains(event.target)) {
                close({ focusTrigger: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, close, triggerRef]);
    React.useEffect(() => {
        if (!open)
            return;
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, close]);
    const getItems = React.useCallback(() => {
        return Array.from(contentRef.current?.querySelectorAll('[data-dropdown-item="true"]:not([data-disabled])') ?? []);
    }, []);
    const focusItemByIndex = React.useCallback((index) => {
        const items = getItems();
        if (items.length === 0)
            return;
        const clampedIndex = ((index % items.length) + items.length) % items.length;
        items[clampedIndex]?.focus();
    }, [getItems]);
    const handleKeyDown = (event) => {
        const items = getItems();
        if (!items.length)
            return;
        const activeElement = document.activeElement;
        const currentIndex = items.findIndex((item) => item === activeElement);
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;
            if (nextIndex >= items.length && !loopNavigation)
                return;
            focusItemByIndex(nextIndex);
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = currentIndex === -1 ? items.length - 1 : currentIndex - 1;
            if (prevIndex < 0 && !loopNavigation)
                return;
            focusItemByIndex(prevIndex);
        }
        else if (event.key === 'Home') {
            event.preventDefault();
            focusItemByIndex(0);
        }
        else if (event.key === 'End') {
            event.preventDefault();
            focusItemByIndex(items.length - 1);
        }
    };
    React.useEffect(() => {
        if (!open || !autoFocus)
            return;
        const frame = window.requestAnimationFrame(() => {
            if (focusFirstRef.current) {
                focusItemByIndex(0);
                focusFirstRef.current = false;
            }
        });
        return () => window.cancelAnimationFrame(frame);
    }, [open, autoFocus, focusFirstRef, focusItemByIndex]);
    const animationVariants = React.useMemo(() => {
        const offset = 8;
        switch (actualSide) {
            case 'top':
                return {
                    initial: { opacity: 0, y: offset, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: offset, scale: 0.98 },
                };
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -offset, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -offset, scale: 0.98 },
                };
            case 'left':
                return {
                    initial: { opacity: 0, x: offset, scale: 0.98 },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: offset, scale: 0.98 },
                };
            case 'right':
                return {
                    initial: { opacity: 0, x: -offset, scale: 0.98 },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: -offset, scale: 0.98 },
                };
            default:
                return {
                    initial: { opacity: 0, y: -offset, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -offset, scale: 0.98 },
                };
        }
    }, [actualSide]);
    return (_jsx(DropdownMenuPortal, { children: _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: contentRef, "data-dropdown-content": "true", ...animationVariants, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] }, style: {
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    transform: getMenuTransform(actualSide, align),
                    transformOrigin: getTransformOrigin(actualSide),
                    zIndex: 9999,
                }, className: cn('min-w-[12rem] overflow-hidden rounded-xl border border-border/60 bg-[hsl(var(--surface-elevated))] py-2 shadow-[0_24px_48px_rgba(15,23,42,0.32)] ring-1 ring-black/5 backdrop-blur-md', className), role: "menu", tabIndex: -1, onKeyDown: handleKeyDown, children: children })) }) }));
};
export const DropdownMenuItem = React.forwardRef(({ className, icon, shortcut, destructive = false, inset = false, keepOpenOnSelect = false, active = false, disabled = false, onClick, children, ...props }, ref) => {
    const { close } = useDropdownMenu();
    const handleClick = (event) => {
        if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onClick?.(event);
        if (!event.defaultPrevented && !keepOpenOnSelect) {
            close();
        }
    };
    return (_jsxs("button", { ref: ref, type: "button", role: "menuitem", "data-dropdown-item": "true", "data-disabled": disabled ? '' : undefined, "data-active": active ? '' : undefined, tabIndex: -1, disabled: disabled, onClick: handleClick, className: cn('flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-foreground/85 transition-all duration-150', 'rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0', destructive
            ? 'hover:bg-destructive/12 hover:text-destructive'
            : 'hover:bg-primary/10 hover:text-primary', active && !destructive && 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(22,119,255,0.18)]', inset && 'pl-10', disabled && 'cursor-not-allowed opacity-50', className), ...props, children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [icon && _jsx("span", { className: "text-base text-muted-foreground", children: icon }), _jsx("span", { className: "truncate text-left", children: children })] }), shortcut && (_jsx("kbd", { className: "rounded-md border border-border/60 bg-[hsl(var(--surface-muted))] px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: shortcut }))] }));
});
DropdownMenuItem.displayName = 'DropdownMenuItem';
export const DropdownMenuSeparator = ({ className }) => {
    return _jsx("div", { role: "separator", className: cn('my-1 h-px bg-border/60', className) });
};
export const DropdownMenuLabel = ({ children, className, }) => {
    return (_jsx("div", { role: "presentation", className: cn('px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70', className), children: children }));
};
export const DropdownMenuGroup = ({ children, className, }) => {
    return (_jsx("div", { role: "group", className: cn('py-1', className), children: children }));
};
const DropdownMenuPortal = ({ children }) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (!mounted)
        return null;
    return _jsx(_Fragment, { children: children });
};
function getMenuTransform(side, align) {
    let translateX = '-50%';
    let translateY = '0%';
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
    switch (side) {
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return 'center';
    }
}
export { DropdownMenuContent };
//# sourceMappingURL=dropdown-menu.js.map