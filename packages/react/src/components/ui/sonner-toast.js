'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Sonner Toast Integration
 *
 * Industry-standard toast notifications powered by Sonner.
 * Provides a drop-in replacement for the custom toast system with
 * better animations, accessibility, and maintenance.
 *
 * @see https://sonner.emilkowal.ski/
 * @license MIT
 */
import * as React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
/**
 * Clarity Toast Provider - Sonner-powered toast container
 *
 * Add this component once at the root of your app to enable toasts.
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { ClarityToaster } from '@clarity-chat/react'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ClarityToaster position="bottom-right" richColors />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ClarityToaster({ position = 'bottom-right', expand = false, richColors = true, closeButton = true, theme = 'system', className, duration = 5000, gap = 8, offset = 16, swipeToDismiss = true, toasterProps, }) {
    return (_jsx(SonnerToaster, { position: position, expand: expand, richColors: richColors, closeButton: closeButton, theme: theme, className: className, duration: duration, gap: gap, offset: offset, visibleToasts: 5, toastOptions: {
            classNames: {
                toast: 'clarity-toast',
                title: 'clarity-toast-title',
                description: 'clarity-toast-description',
                actionButton: 'clarity-toast-action',
                cancelButton: 'clarity-toast-cancel',
                closeButton: 'clarity-toast-close',
            },
        }, ...(swipeToDismiss ? {} : { swipeDirections: [] }), ...toasterProps }));
}
ClarityToaster.displayName = 'ClarityToaster';
/**
 * Unified toast API that works with or without ClarityToaster
 */
export const toast = {
    /**
     * Success toast
     */
    success: (message, options) => {
        return sonnerToast.success(options?.title || message, {
            description: options?.title ? message : undefined,
            duration: options?.duration,
            id: options?.id,
            action: options?.action
                ? {
                    label: options.action.label,
                    onClick: options.action.onClick,
                }
                : undefined,
            cancel: options?.cancel
                ? {
                    label: options.cancel.label,
                    onClick: options.cancel.onClick ?? (() => { }),
                }
                : undefined,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
    /**
     * Error toast
     */
    error: (message, options) => {
        return sonnerToast.error(options?.title || message, {
            description: options?.title ? message : undefined,
            duration: options?.duration,
            id: options?.id,
            action: options?.action
                ? {
                    label: options.action.label,
                    onClick: options.action.onClick,
                }
                : undefined,
            cancel: options?.cancel
                ? {
                    label: options.cancel.label,
                    onClick: options.cancel.onClick ?? (() => { }),
                }
                : undefined,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
    /**
     * Info toast
     */
    info: (message, options) => {
        return sonnerToast.info(options?.title || message, {
            description: options?.title ? message : undefined,
            duration: options?.duration,
            id: options?.id,
            action: options?.action
                ? {
                    label: options.action.label,
                    onClick: options.action.onClick,
                }
                : undefined,
            cancel: options?.cancel
                ? {
                    label: options.cancel.label,
                    onClick: options.cancel.onClick ?? (() => { }),
                }
                : undefined,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
    /**
     * Warning toast
     */
    warning: (message, options) => {
        return sonnerToast.warning(options?.title || message, {
            description: options?.title ? message : undefined,
            duration: options?.duration,
            id: options?.id,
            action: options?.action
                ? {
                    label: options.action.label,
                    onClick: options.action.onClick,
                }
                : undefined,
            cancel: options?.cancel
                ? {
                    label: options.cancel.label,
                    onClick: options.cancel.onClick ?? (() => { }),
                }
                : undefined,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
    /**
     * Loading toast (persistent until dismissed)
     */
    loading: (message, options) => {
        return sonnerToast.loading(message, {
            id: options?.id,
            description: options?.title,
            onDismiss: options?.onDismiss,
        });
    },
    /**
     * Promise toast - shows loading, then success/error
     */
    promise: (promise, options) => {
        const result = sonnerToast.promise(promise, {
            loading: options.loading,
            success: options.success,
            error: options.error,
            description: options.description,
            duration: options.duration,
        });
        // Return the toast ID for potential dismissal
        return typeof result === 'object' ? 0 : result;
    },
    /**
     * Custom toast with JSX content
     */
    custom: (content, options) => {
        return sonnerToast.custom(() => content, {
            duration: options?.duration,
            id: options?.id,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
    /**
     * Dismiss a specific toast or all toasts
     */
    dismiss: (id) => {
        if (id) {
            sonnerToast.dismiss(id);
        }
        else {
            sonnerToast.dismiss();
        }
    },
    /**
     * Message toast (neutral, no icon)
     */
    message: (message, options) => {
        return sonnerToast.message(options?.title || message, {
            description: options?.title ? message : undefined,
            duration: options?.duration,
            id: options?.id,
            action: options?.action
                ? {
                    label: options.action.label,
                    onClick: options.action.onClick,
                }
                : undefined,
            onDismiss: options?.onDismiss,
            onAutoClose: options?.onAutoClose,
        });
    },
};
// Re-export Sonner's toast for advanced usage
export { sonnerToast as sonner };
export default ClarityToaster;
//# sourceMappingURL=sonner-toast.js.map