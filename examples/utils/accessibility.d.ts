/**
 * Accessibility Helper Utilities
 *
 * Reusable utilities for implementing accessible interactive elements.
 * Based on WCAG 2.1 guidelines and React best practices.
 *
 * @module accessibility
 */
import { RefObject } from 'react';
/**
 * Props required for accessible click handlers on non-button elements
 */
export interface AccessibleClickProps {
    role: 'button';
    tabIndex: 0;
    onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}
/**
 * Options for focus trap behavior
 */
export interface FocusTrapOptions {
    /** Whether the focus trap is active */
    enabled?: boolean;
    /** Selector for focusable elements */
    focusableSelector?: string;
    /** Auto-focus first element when enabled */
    autoFocus?: boolean;
    /** Return focus to trigger when disabled */
    returnFocus?: boolean;
}
/**
 * Result of useFocusTrap hook
 */
export interface FocusTrapResult {
    /** Ref to attach to the container element */
    containerRef: RefObject<HTMLDivElement>;
}
/**
 * Creates accessible props for making a non-button element clickable.
 *
 * Use this when you absolutely must use a div or span as a button.
 * Prefer using actual <button> elements whenever possible.
 *
 * @param handler - Click handler function
 * @returns Object with role, tabIndex, onClick, and onKeyDown props
 *
 * @example
 * ```tsx
 * function ClickableCard({ onClick }) {
 *   return (
 *     <div
 *       {...accessibleClickHandler(onClick)}
 *       className="card cursor-pointer"
 *     >
 *       Card content
 *     </div>
 *   )
 * }
 * ```
 */
export declare function accessibleClickHandler(handler: (e: React.MouseEvent | React.KeyboardEvent) => void): AccessibleClickProps;
/**
 * Hook that traps focus within a container element.
 *
 * Essential for modals, dialogs, and other overlay content
 * to meet WCAG 2.4.3 (Focus Order) requirements.
 *
 * @param options - Focus trap configuration
 * @returns Object containing containerRef to attach to the trap container
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const { containerRef } = useFocusTrap({ enabled: isOpen })
 *
 *   return isOpen ? (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       <button onClick={onClose}>Close</button>
 *       <p>Modal content...</p>
 *     </div>
 *   ) : null
 * }
 * ```
 */
export declare function useFocusTrap(options?: FocusTrapOptions): FocusTrapResult;
/**
 * Hook that auto-focuses an element when a condition is met.
 *
 * Useful for focusing form fields, buttons, or other elements
 * when a component mounts or state changes.
 *
 * @param condition - Whether to focus the element
 * @returns Ref to attach to the element to focus
 *
 * @example
 * ```tsx
 * function SearchModal({ isOpen }) {
 *   const inputRef = useAutoFocus<HTMLInputElement>(isOpen)
 *
 *   return isOpen ? (
 *     <input ref={inputRef} type="search" placeholder="Search..." />
 *   ) : null
 * }
 * ```
 */
export declare function useAutoFocus<T extends HTMLElement>(condition: boolean): RefObject<T>;
/**
 * Hook that calls a handler when the Escape key is pressed.
 *
 * Useful for closing modals, dropdowns, and other dismissible content.
 *
 * @param handler - Function to call when Escape is pressed
 * @param enabled - Whether the handler is active (default: true)
 *
 * @example
 * ```tsx
 * function Modal({ onClose }) {
 *   useEscapeKey(onClose)
 *
 *   return <div role="dialog">...</div>
 * }
 * ```
 */
export declare function useEscapeKey(handler: () => void, enabled?: boolean): void;
/**
 * Announces a message to screen readers using an ARIA live region.
 *
 * Useful for announcing dynamic content changes, form errors,
 * or other important updates.
 *
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const handleSubmit = async () => {
 *     try {
 *       await submit()
 *       announceToScreenReader('Form submitted successfully')
 *     } catch {
 *       announceToScreenReader('Form submission failed', 'assertive')
 *     }
 *   }
 * }
 * ```
 */
export declare function announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void;
//# sourceMappingURL=accessibility.d.ts.map