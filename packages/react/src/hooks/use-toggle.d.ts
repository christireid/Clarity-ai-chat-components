import * as React from 'react';
export interface UseToggleReturn {
    /**
     * Current toggle state
     */
    value: boolean;
    /**
     * Toggle the state
     */
    toggle: () => void;
    /**
     * Set to true
     */
    setTrue: () => void;
    /**
     * Set to false
     */
    setFalse: () => void;
    /**
     * Set to specific value
     */
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
}
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
export declare function useToggle(initialValue?: boolean): UseToggleReturn;
//# sourceMappingURL=use-toggle.d.ts.map