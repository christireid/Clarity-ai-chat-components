'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, } from 'framer-motion';
import { cn } from '../lib/cn';
import { saveFocus, getFocusableElements, announce } from '../lib/aria';
import { CloseIcon } from './icons';
import { springPresets, easingPresets, fadeVariants, scaleVariants, slideUpVariants, slideDownVariants, getReducedMotionVariants, getReducedMotionTransition, noAnimation, } from '../lib/animation-presets';
import { useBodyScrollLock } from '../hooks/use-body-scroll-lock';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useControllableState } from '../hooks/use-controllable-state';
const DialogContext = React.createContext(null);
/**
 * Hook to access Dialog context
 * @throws Error if used outside of Dialog
 */
const useDialog = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('Dialog components must be used within a Dialog');
    }
    return context;
};
// ============================================================================
// Focus Trap Hook
// ============================================================================
function useFocusTrap(ref, enabled) {
    React.useEffect(() => {
        if (!enabled || !ref.current)
            return;
        const element = ref.current;
        const restoreFocus = saveFocus();
        // Get all focusable elements
        const focusableElements = getFocusableElements(element);
        const firstFocusable = focusableElements[0];
        // Focus first element
        if (firstFocusable) {
            firstFocusable.focus();
        }
        // Handle tab key for focus trap
        const handleTab = (e) => {
            if (e.key !== 'Tab')
                return;
            const elements = getFocusableElements(element);
            if (elements.length === 0)
                return;
            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];
            if (e.shiftKey) {
                // Shift + Tab: wrap from first to last
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            }
            else {
                // Tab: wrap from last to first
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };
        element.addEventListener('keydown', handleTab);
        return () => {
            element.removeEventListener('keydown', handleTab);
            restoreFocus();
        };
    }, [enabled, ref]);
}
// ============================================================================
// Dialog Root Component
// ============================================================================
/**
 * Dialog root component - provides context for all dialog parts
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>Content</DialogBody>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button>Close</Button>
 *       </DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog = ({ open: controlledOpen, onOpenChange, children, modal = true, defaultOpen = false, }) => {
    // Use controllable state for controlled/uncontrolled support
    const [open, setOpen] = useControllableState({
        prop: controlledOpen,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    });
    // Generate unique IDs for ARIA relationships
    const titleId = React.useId();
    const descriptionId = React.useId();
    const contentId = React.useId();
    const contextValue = React.useMemo(() => ({ open, setOpen, titleId, descriptionId, contentId, modal }), [open, setOpen, titleId, descriptionId, contentId, modal]);
    return (_jsx(DialogContext.Provider, { value: contextValue, children: children }));
};
Dialog.displayName = 'Dialog';
// ============================================================================
// Dialog Trigger
// ============================================================================
/**
 * Button that opens the dialog
 */
export const DialogTrigger = ({ children, onClick, asChild, }) => {
    const { setOpen, contentId } = useDialog();
    const handleClick = () => {
        setOpen(true);
        onClick?.();
    };
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: handleClick,
            'aria-haspopup': 'dialog',
            'aria-controls': contentId,
        });
    }
    return (_jsx("button", { onClick: handleClick, type: "button", "aria-haspopup": "dialog", "aria-controls": contentId, children: children }));
};
DialogTrigger.displayName = 'DialogTrigger';
// ============================================================================
// Dialog Content (with Portal, Backdrop, and Animations)
// ============================================================================
const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
};
// Animation variants mapping
const animationVariantsMap = {
    scale: scaleVariants,
    'slide-up': slideUpVariants,
    'slide-down': slideDownVariants,
    fade: fadeVariants,
    zoom: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
    },
    none: {
        initial: {},
        animate: {},
        exit: {},
    },
};
/**
 * Dialog content - the modal window itself
 */
export const DialogContent = ({ children, className, size = 'md', closeOnClickOutside = true, closeOnEscape = true, showCloseButton = true, animation = 'scale', blurBackdrop = true, overlayClassName, }) => {
    const { open, setOpen, titleId, descriptionId, contentId, modal } = useDialog();
    const contentRef = React.useRef(null);
    const [portalContainer, setPortalContainer] = React.useState(null);
    const { lock } = useBodyScrollLock();
    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    // Get or create portal container
    React.useEffect(() => {
        let container = document.getElementById('dialog-portal-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'dialog-portal-root';
            document.body.appendChild(container);
        }
        setPortalContainer(container);
    }, []);
    // Focus trap (only for modal dialogs)
    useFocusTrap(contentRef, open && modal);
    // Escape key handling
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
    // Body scroll lock (only for modal dialogs)
    React.useEffect(() => {
        if (open && modal) {
            const unlockFn = lock();
            return unlockFn;
        }
        return undefined;
    }, [open, modal, lock]);
    // Announce dialog open/close to screen readers
    React.useEffect(() => {
        if (open) {
            announce('Dialog opened', { assertive: false });
        }
    }, [open]);
    // Get animation variants based on motion preference
    const contentVariants = React.useMemo(() => {
        const baseVariants = animationVariantsMap[animation] || scaleVariants;
        return getReducedMotionVariants(baseVariants, prefersReducedMotion);
    }, [animation, prefersReducedMotion]);
    // Get transition based on motion preference
    const contentTransition = React.useMemo(() => {
        if (animation === 'none')
            return noAnimation;
        return getReducedMotionTransition(springPresets.smooth, prefersReducedMotion);
    }, [animation, prefersReducedMotion]);
    const overlayTransition = React.useMemo(() => {
        return getReducedMotionTransition(easingPresets.enter, prefersReducedMotion);
    }, [prefersReducedMotion]);
    if (!portalContainer)
        return null;
    const dialogContent = (_jsx(AnimatePresence, { children: open && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: overlayTransition, className: cn('fixed inset-0 z-[var(--z-modal-backdrop,50)] bg-black/70', blurBackdrop && !prefersReducedMotion && 'backdrop-blur-lg', overlayClassName), onClick: closeOnClickOutside ? () => setOpen(false) : undefined, "aria-hidden": "true", "data-dialog-overlay": true }), _jsx("div", { className: "fixed inset-0 z-[var(--z-modal,51)] flex items-center justify-center p-4 pointer-events-none", "data-dialog-positioner": true, children: _jsxs(motion.div, { ref: contentRef, id: contentId, variants: contentVariants, initial: "initial", animate: "animate", exit: "exit", transition: contentTransition, onClick: (e) => e.stopPropagation(), className: cn('relative w-full bg-card border border-border/40 shadow-xl rounded-2xl pointer-events-auto', sizeClasses[size], className), role: "dialog", "aria-modal": modal, "aria-labelledby": titleId, "aria-describedby": descriptionId, "data-dialog-content": true, "data-state": open ? 'open' : 'closed', "data-reduced-motion": prefersReducedMotion || undefined, children: [showCloseButton && (_jsx(motion.button, { whileHover: prefersReducedMotion ? undefined : { scale: 1.1 }, whileTap: prefersReducedMotion ? undefined : { scale: 0.9 }, onClick: () => setOpen(false), className: cn('absolute top-4 right-4 w-8 h-8 rounded-lg', 'flex items-center justify-center', 'text-muted-foreground hover:text-foreground', 'hover:bg-accent/50', 'transition-colors duration-150 ease-out', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2'), "aria-label": "Close dialog", type: "button", children: _jsx(CloseIcon, { className: "h-[15px] w-[15px]" }) })), children] }) })] })) }));
    return createPortal(dialogContent, portalContainer);
};
DialogContent.displayName = 'DialogContent';
// ============================================================================
// Dialog Sub-components
// ============================================================================
/**
 * Container for dialog header content (title + description)
 */
export const DialogHeader = ({ children, className, }) => {
    return (_jsx("div", { className: cn('flex flex-col space-y-2.5 px-6 py-5 border-b border-border/40', className), "data-dialog-header": true, children: children }));
};
DialogHeader.displayName = 'DialogHeader';
/**
 * Dialog title - automatically linked via aria-labelledby
 */
export const DialogTitle = ({ children, className, }) => {
    const { titleId } = useDialog();
    return (_jsx("h2", { id: titleId, className: cn('text-xl font-bold leading-none tracking-tight text-foreground', className), "data-dialog-title": true, children: children }));
};
DialogTitle.displayName = 'DialogTitle';
/**
 * Dialog description - automatically linked via aria-describedby
 */
export const DialogDescription = ({ children, className, }) => {
    const { descriptionId } = useDialog();
    return (_jsx("p", { id: descriptionId, className: cn('text-sm text-muted-foreground/90 leading-relaxed', className), "data-dialog-description": true, children: children }));
};
DialogDescription.displayName = 'DialogDescription';
/**
 * Container for main dialog content
 */
export const DialogBody = ({ children, className }) => {
    return (_jsx("div", { className: cn('px-6 py-4', className), "data-dialog-body": true, children: children }));
};
DialogBody.displayName = 'DialogBody';
/**
 * Container for dialog footer (usually buttons)
 */
export const DialogFooter = ({ children, className, }) => {
    return (_jsx("div", { className: cn('flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border/40', className), "data-dialog-footer": true, children: children }));
};
DialogFooter.displayName = 'DialogFooter';
/**
 * Button that closes the dialog
 */
export const DialogClose = ({ children, className, asChild, }) => {
    const { setOpen } = useDialog();
    const handleClose = () => {
        setOpen(false);
        announce('Dialog closed', { assertive: false });
    };
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: handleClose,
        });
    }
    return (_jsx("button", { onClick: handleClose, className: className, type: "button", "data-dialog-close": true, children: children }));
};
DialogClose.displayName = 'DialogClose';
//# sourceMappingURL=dialog.js.map