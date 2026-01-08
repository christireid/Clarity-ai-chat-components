import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion';
/**
 * Hook for creating magnetic hover effects
 * Creates a subtle movement effect that follows the mouse cursor
 */
export function useMagnetic({ strength = 0.15, throttleMs = 16, disabled = false, } = {}) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const prefersReducedMotion = useReducedMotion();
    const lastMoveTime = useRef(0);
    const handleMouseMove = useCallback((e) => {
        if (disabled || prefersReducedMotion || !ref.current) {
            return;
        }
        // Throttle
        const now = Date.now();
        if (now - lastMoveTime.current < throttleMs) {
            return;
        }
        lastMoveTime.current = now;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setPosition({ x: deltaX, y: deltaY });
    }, [disabled, prefersReducedMotion, strength, throttleMs]);
    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);
    return {
        position,
        ref,
        handleMouseMove,
        handleMouseLeave,
    };
}
//# sourceMappingURL=use-magnetic.js.map