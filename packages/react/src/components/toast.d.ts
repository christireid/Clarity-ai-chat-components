/**
 * Toast Notification System
 *
 * Provides toast notifications for success, error, info, and warning messages.
 * Supports auto-dismiss, queue management, and custom durations.
 */
import * as React from 'react';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    description: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export interface ToastProps extends Toast {
    onClose: (id: string) => void;
}
/**
 * Individual toast component
 */
export declare const ToastItem: React.NamedExoticComponent<ToastProps>;
/**
 * Toast container component
 */
export interface ToastContainerProps {
    toasts: Toast[];
    position?: ToastPosition;
    onClose: (id: string) => void;
}
export declare const ToastContainer: React.NamedExoticComponent<ToastContainerProps>;
/**
 * Toast Context
 */
interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (description: string, title?: string, duration?: number) => string;
    error: (description: string, title?: string, duration?: number) => string;
    info: (description: string, title?: string, duration?: number) => string;
    warning: (description: string, title?: string, duration?: number) => string;
}
/**
 * Toast Provider
 */
export interface ToastProviderProps {
    children: React.ReactNode;
    position?: ToastPosition;
    defaultDuration?: number;
    maxToasts?: number;
}
export declare const ToastProvider: React.FC<ToastProviderProps>;
/**
 * useToast hook
 */
export declare function useToast(): ToastContextValue;
/**
 * Standalone toast function (without provider)
 * Useful for one-off toasts without setting up provider
 */
export declare const toast: {
    success: (description: string, title?: string) => void;
    error: (description: string, title?: string) => void;
    info: (description: string, title?: string) => void;
    warning: (description: string, title?: string) => void;
};
export {};
//# sourceMappingURL=toast.d.ts.map