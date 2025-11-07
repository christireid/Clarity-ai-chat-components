/**
 * Focus Management Utilities
 *
 * Advanced focus management for accessibility
 */
import * as React from 'react';
/**
 * Focus trap hook
 *
 * Traps focus within an element (useful for modals)
 */
export declare function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active?: boolean): React.RefObject<T>;
/**
 * Get all focusable elements within a container
 */
export declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/**
 * Roving tabindex hook
 *
 * Implement roving tabindex pattern for keyboard navigation
 */
export declare function useRovingTabIndex<T extends HTMLElement = HTMLElement>(itemCount: number, options?: {
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
}): {
    activeIndex: number;
    getItemProps: (index: number) => {
        ref: (el: T | null) => void;
        tabIndex: number;
        onKeyDown: (e: React.KeyboardEvent) => void;
        onFocus: () => void;
    };
};
/**
 * Focus restoration hook
 *
 * Restores focus to previous element when component unmounts
 */
export declare function useFocusRestoration(): {
    saveFocus: () => void;
    restoreFocus: () => void;
};
/**
 * Focus visible hook
 *
 * Track if user is using keyboard navigation
 */
export declare function useFocusVisible(): boolean;
/**
 * Auto focus hook
 *
 * Auto focus element when component mounts
 */
export declare function useAutoFocus<T extends HTMLElement = HTMLElement>(enabled?: boolean, options?: {
    delay?: number;
    preventScroll?: boolean;
}): React.RefObject<T>;
/**
 * Focus within hook
 *
 * Detect if focus is within an element
 */
export declare function useFocusWithin<T extends HTMLElement = HTMLElement>(): {
    ref: React.RefObject<T>;
    isFocusWithin: boolean;
};
//# sourceMappingURL=focus-management.d.ts.map