'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Toast Notification System
 *
 * Provides toast notifications for success, error, info, and warning messages.
 * Supports auto-dismiss, queue management, and custom durations.
 */
import React, { useState, useCallback, useRef, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { CheckCircleIcon, XCircleIcon, InfoIcon, AlertCircleIcon, CloseIcon, } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING,
// createSlideVariant, // Reserved for future use
 } from '../animations';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { getMotionSafeDuration, getMotionSafeValue } from '../animations/motion-safe';
// Icon mapping - reserved for future use
// const TOAST_ICONS = {
//   success: CheckCircleIcon,
//   error: XCircleIcon,
//   info: InfoIcon,
//   warning: AlertCircleIcon,
// } as const
// Color classes - reserved for future use
// const TOAST_COLOR_CLASSES = {
//   success: 'bg-success/10 border-success/20 text-success-foreground',
//   error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
//   info: 'bg-info/10 border-info/20 text-info-foreground',
//   warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
// } as const
// const TOAST_ICON_COLOR_CLASSES = {
//   success: 'text-success',
//   error: 'text-destructive',
//   info: 'text-info',
//   warning: 'text-warning',
// } as const
/**
 * Individual toast component
 */
export function ToastItem({ id, type, title, description, action, onClose, }) {
    const prefersReducedMotion = useReducedMotion();
    // Memoize icon selection
    const Icon = React.useMemo(() => ({
        success: CheckCircleIcon,
        error: XCircleIcon,
        info: InfoIcon,
        warning: AlertCircleIcon,
    }[type]), [type]);
    // Memoize color classes
    const colorClasses = React.useMemo(() => ({
        success: 'bg-success/10 border-success/30 text-success-foreground',
        error: 'bg-destructive/10 border-destructive/30 text-destructive-foreground',
        info: 'bg-info/10 border-info/30 text-info-foreground',
        warning: 'bg-warning/10 border-warning/30 text-warning-foreground',
    }[type]), [type]);
    // Memoize icon color classes
    const iconColorClasses = React.useMemo(() => ({
        success: 'text-success',
        error: 'text-destructive',
        info: 'text-info',
        warning: 'text-warning',
    }[type]), [type]);
    // Memoize close handler
    const handleClose = React.useCallback(() => onClose(id), [onClose, id]);
    return (_jsxs(motion.div, { layout: true, initial: {
            opacity: 0,
            y: getMotionSafeValue(prefersReducedMotion, -20, 0),
            scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1)
        }, animate: { opacity: 1, y: 0, scale: 1 }, exit: {
            opacity: 0,
            x: getMotionSafeValue(prefersReducedMotion, 100, 0),
            scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1)
        }, transition: {
            duration: getMotionSafeDuration(prefersReducedMotion, ANIMATION_DURATION.normal / 1000),
            ease: ANIMATION_EASING.spring,
        }, className: cn('relative flex gap-3.5 px-4 py-3.5 rounded-xl border border-border/40 shadow-lg backdrop-blur-xl', 'min-w-[340px] max-w-[440px]', colorClasses), children: [_jsx("div", { className: cn('flex-shrink-0 mt-0.5', iconColorClasses), children: _jsx(Icon, { size: 18 }) }), _jsxs("div", { className: "flex-1 space-y-1.5", children: [title && (_jsx("div", { className: "font-bold text-sm leading-tight", children: title })), _jsx("div", { className: "text-sm leading-relaxed opacity-95", children: description }), action && (_jsx("button", { onClick: action.onClick, className: "text-sm font-bold underline underline-offset-2 hover:no-underline mt-1.5 transition-all", "aria-label": action.label, children: action.label }))] }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: handleClose, className: "flex-shrink-0 p-1.5 rounded-lg hover:bg-background/40 transition-all duration-200", "aria-label": "Close notification", children: _jsx(CloseIcon, { size: 14 }) })] }));
}
ToastItem.displayName = 'ToastItem';
// Position classes - extracted as constant
const POSITION_CLASSES = {
    'top-left': 'top-6 left-6 items-start',
    'top-center': 'top-6 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-6 right-6 items-end',
    'bottom-left': 'bottom-6 left-6 items-start',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-6 right-6 items-end',
};
export function ToastContainer({ toasts, position = 'top-right', onClose, }) {
    const positionClass = useMemo(() => POSITION_CLASSES[position], [position]);
    return (_jsx("div", { className: cn('fixed z-50 flex flex-col gap-2.5 pointer-events-none', positionClass), children: _jsx(AnimatePresence, { mode: "popLayout", children: toasts.map((toast) => (_jsx("div", { className: "pointer-events-auto", children: _jsx(ToastItem, { ...toast, onClose: onClose }) }, toast.id))) }) }));
}
ToastContainer.displayName = 'ToastContainer';
const ToastContext = createContext(undefined);
export function ToastProvider({ children, position = 'top-right', defaultDuration = 5000, maxToasts = 5, }) {
    const [toasts, setToasts] = useState([]);
    const timeoutRefs = useRef(new Map());
    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
            timeoutRefs.current.clear();
        };
    }, []);
    // Remove toast
    const removeToast = useCallback((id) => {
        // Clear timeout if exists
        const timeout = timeoutRefs.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutRefs.current.delete(id);
        }
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    // Add toast
    const addToast = useCallback((toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => {
            // Limit number of toasts
            const updated = [...prev, newToast];
            if (updated.length > maxToasts) {
                return updated.slice(-maxToasts);
            }
            return updated;
        });
        // Auto-dismiss
        const duration = toast.duration ?? defaultDuration;
        if (duration > 0) {
            const timeout = setTimeout(() => {
                removeToast(id);
            }, duration);
            timeoutRefs.current.set(id, timeout);
        }
        return id;
    }, [defaultDuration, maxToasts, removeToast]);
    // Convenience methods
    const success = useCallback((description, title, duration) => {
        return addToast({ type: 'success', description, title, duration });
    }, [addToast]);
    const error = useCallback((description, title, duration) => {
        return addToast({ type: 'error', description, title, duration });
    }, [addToast]);
    const info = useCallback((description, title, duration) => {
        return addToast({ type: 'info', description, title, duration });
    }, [addToast]);
    const warning = useCallback((description, title, duration) => {
        return addToast({ type: 'warning', description, title, duration });
    }, [addToast]);
    const value = useMemo(() => ({
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
    }), [toasts, addToast, removeToast, success, error, info, warning]);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx(ToastContainer, { toasts: toasts, position: position, onClose: removeToast })] }));
}
/**
 * useToast hook
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
/**
 * Standalone toast function (without provider)
 * Useful for one-off toasts without setting up provider
 */
// Reserved for future implementation
// let toastContainerRoot: HTMLDivElement | null = null
// function _getToastContainer(): HTMLDivElement {
//   if (!toastContainerRoot) {
//     toastContainerRoot = document.createElement('div')
//     toastContainerRoot.id = 'toast-root'
//     document.body.appendChild(toastContainerRoot)
//   }
//   return toastContainerRoot
// }
export const toast = {
    success: (description, title) => {
        console.log('[Toast] Success:', title, description);
        // Implementation would render toast outside React tree
    },
    error: (description, title) => {
        console.log('[Toast] Error:', title, description);
    },
    info: (description, title) => {
        console.log('[Toast] Info:', title, description);
    },
    warning: (description, title) => {
        console.log('[Toast] Warning:', title, description);
    },
};
//# sourceMappingURL=toast.js.map