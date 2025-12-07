'use client';
import { useState, useCallback } from 'react';
/**
 * Enhanced boolean state with convenience helper functions for common toggle operations.
 * Eliminates repetitive setState callbacks for boolean values.
 *
 * **Features:**
 * - Simple toggle function
 * - Explicit setTrue/setFalse helpers
 * - Standard setState for advanced usage
 * - Memoized functions (no re-renders)
 *
 * **Use Cases:**
 * - Modal/dialog visibility
 * - Sidebar/drawer state
 * - Feature flags/switches
 * - Accordion expand/collapse
 *
 * @param {boolean} [initialValue=false] - Initial boolean state
 * @returns {UseToggleReturn} Object with value and toggle functions
 * @example
 * ```tsx
 * const modal = useToggle(false)
 * const sidebar = useToggle(true)
 *
 * return (
 *   <>
 *     <button onClick={modal.toggle}>Toggle Modal</button>
 *     <button onClick={modal.setTrue}>Open Modal</button>
 *     <button onClick={modal.setFalse}>Close Modal</button>
 *     {modal.value && <Modal onClose={modal.setFalse} />}
 *   </>
 * )
 * ```
 */
export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => {
        setValue((v) => !v);
    }, []);
    const setTrue = useCallback(() => {
        setValue(true);
    }, []);
    const setFalse = useCallback(() => {
        setValue(false);
    }, []);
    return {
        value,
        toggle,
        setTrue,
        setFalse,
        setValue,
    };
}
//# sourceMappingURL=use-toggle.js.map