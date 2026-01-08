import * as React from 'react';
/**
 * Custom hook to lock body scroll when a modal/dialog is open
 *
 * @example
 * ```tsx
 * const { lock, unlock } = useBodyScrollLock()
 *
 * React.useEffect(() => {
 *   if (isOpen) {
 *     lock()
 *     return unlock
 *   }
 * }, [isOpen, lock, unlock])
 * ```
 */
export function useBodyScrollLock() {
    const lock = React.useCallback(() => {
        // SSR safety check
        if (typeof window === 'undefined' || !document.body) {
            return () => { };
        }
        // Store original overflow value
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            // Safety check in cleanup
            if (typeof window !== 'undefined' && document.body) {
                document.body.style.overflow = originalOverflow;
            }
        };
    }, []);
    const unlock = React.useCallback(() => {
        // SSR safety check
        if (typeof window === 'undefined' || !document.body) {
            return;
        }
        document.body.style.overflow = '';
    }, []);
    return { lock, unlock };
}
//# sourceMappingURL=use-body-scroll-lock.js.map