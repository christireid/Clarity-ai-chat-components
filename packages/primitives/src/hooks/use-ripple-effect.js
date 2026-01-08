import * as React from 'react';
/**
 * Custom hook for managing ripple effects on buttons
 *
 * @example
 * ```tsx
 * const { ripples, handleClick } = useRippleEffect({
 *   enabled: true,
 * })
 * ```
 */
export function useRippleEffect({ enabled, onRipple } = { enabled: true }) {
    const [ripples, setRipples] = React.useState([]);
    const rippleIdRef = React.useRef(0);
    const timeoutRefsRef = React.useRef(new Map());
    const addRipple = React.useCallback((e) => {
        if (!enabled)
            return;
        const button = e.currentTarget;
        // SSR safety check
        if (typeof window === 'undefined' || !button.getBoundingClientRect) {
            return;
        }
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = {
            id: rippleIdRef.current++,
            x,
            y,
            size,
        };
        setRipples((prev) => [...prev, ripple]);
        onRipple?.(ripple);
        // Remove ripple after animation
        const timeoutId = setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            timeoutRefsRef.current.delete(ripple.id);
        }, 600);
        timeoutRefsRef.current.set(ripple.id, timeoutId);
    }, [enabled, onRipple]);
    // Cleanup all timeouts on unmount
    React.useEffect(() => {
        const timeoutRefs = timeoutRefsRef.current;
        return () => {
            timeoutRefs.forEach((timeout) => clearTimeout(timeout));
            timeoutRefs.clear();
        };
    }, []);
    return {
        ripples,
        addRipple,
    };
}
//# sourceMappingURL=use-ripple-effect.js.map