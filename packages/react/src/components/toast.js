import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Toast Notification System
 *
 * Provides toast notifications for success, error, info, and warning messages.
 * Supports auto-dismiss, queue management, and custom durations.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { CheckCircleIcon, XCircleIcon, InfoIcon, AlertCircleIcon, CloseIcon, } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING,
// createSlideVariant, // Reserved for future use
 } from '../animations';
/**
 * Individual toast component
 */
export const ToastItem = React.memo(function ToastItem({ id, type, title, description, action, onClose, }) {
    const Icon = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        info: InfoIcon,
        warning: AlertCircleIcon,
    }[type];
    const colorClasses = {
        success: 'bg-success/10 border-success/20 text-success-foreground',
        error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
        info: 'bg-info/10 border-info/20 text-info-foreground',
        warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
    };
    const iconColorClasses = {
        success: 'text-success',
        error: 'text-destructive',
        info: 'text-info',
        warning: 'text-warning',
    };
    return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: -20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, x: 100, scale: 0.95 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.spring,
        }, className: cn('relative flex gap-3 p-4 rounded-xl border-2 shadow-xl backdrop-blur-md', 'min-w-[320px] max-w-[420px]', colorClasses[type]), children: [_jsx("div", { className: cn('flex-shrink-0 mt-0.5', iconColorClasses[type]), children: _jsx(Icon, { size: 20 }) }), _jsxs("div", { className: "flex-1 space-y-1", children: [title && (_jsx("div", { className: "font-semibold text-sm leading-none", children: title })), _jsx("div", { className: "text-sm opacity-90", children: description }), action && (_jsx("button", { onClick: action.onClick, className: "text-sm font-medium underline hover:no-underline mt-2", children: action.label }))] }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => onClose(id), className: "flex-shrink-0 p-1 rounded hover:bg-background/20 transition-colors", "aria-label": "Close notification", children: _jsx(CloseIcon, { size: 16 }) })] }));
});
ToastItem.displayName = 'ToastItem';
export const ToastContainer = React.memo(function ToastContainer({ toasts, position = 'top-right', onClose, }) {
    const positionClasses = {
        'top-left': 'top-4 left-4 items-start',
        'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
        'top-right': 'top-4 right-4 items-end',
        'bottom-left': 'bottom-4 left-4 items-start',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
        'bottom-right': 'bottom-4 right-4 items-end',
    };
    return (_jsx("div", { className: cn('fixed z-50 flex flex-col gap-2 pointer-events-none', positionClasses[position]), children: _jsx(AnimatePresence, { mode: "popLayout", children: toasts.map((toast) => (_jsx("div", { className: "pointer-events-auto", children: _jsx(ToastItem, { ...toast, onClose: onClose }) }, toast.id))) }) }));
});
ToastContainer.displayName = 'ToastContainer';
const ToastContext = React.createContext(undefined);
export const ToastProvider = ({ children, position = 'top-right', defaultDuration = 5000, maxToasts = 5, }) => {
    const [toasts, setToasts] = React.useState([]);
    // Add toast
    const addToast = React.useCallback((toast) => {
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
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id;
    }, [defaultDuration, maxToasts]);
    // Remove toast
    const removeToast = React.useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    // Convenience methods
    const success = React.useCallback((description, title, duration) => {
        return addToast({ type: 'success', description, title, duration });
    }, [addToast]);
    const error = React.useCallback((description, title, duration) => {
        return addToast({ type: 'error', description, title, duration });
    }, [addToast]);
    const info = React.useCallback((description, title, duration) => {
        return addToast({ type: 'info', description, title, duration });
    }, [addToast]);
    const warning = React.useCallback((description, title, duration) => {
        return addToast({ type: 'warning', description, title, duration });
    }, [addToast]);
    const value = {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
    };
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx(ToastContainer, { toasts: toasts, position: position, onClose: removeToast })] }));
};
/**
 * useToast hook
 */
export function useToast() {
    const context = React.useContext(ToastContext);
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