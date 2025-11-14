/**
 * Toast notification configuration
 */
export interface ErrorToast {
    id: string;
    message: string;
    type: 'error' | 'warning' | 'info';
    duration?: number;
}
/**
 * Hook for managing error toast notifications
 *
 * @example
 * ```tsx
 * const { toasts, showToast, hideToast, clearAll } = useErrorToast()
 *
 * // Show an error toast
 * showToast('Something went wrong', 'error', 5000)
 *
 * // Render toasts
 * {toasts.map(toast => (
 *   <ErrorToast
 *     key={toast.id}
 *     message={toast.message}
 *     type={toast.type}
 *     onClose={() => hideToast(toast.id)}
 *   />
 * ))}
 * ```
 */
export declare function useErrorToast(): {
    /** Array of active toasts */
    toasts: ErrorToast[];
    /** Show a new toast notification */
    showToast: (message: string, type?: "error" | "warning" | "info", duration?: number) => string;
    /** Hide a specific toast */
    hideToast: (id: string) => void;
    /** Clear all toasts */
    clearAll: () => void;
};
//# sourceMappingURL=useErrorToast.d.ts.map