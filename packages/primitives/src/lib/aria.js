/**
 * ARIA Utilities for Accessibility
 *
 * This module provides utilities for implementing accessible components
 * following WAI-ARIA Authoring Practices.
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/} WAI-ARIA APG
 */
// ============================================================================
// ID Generation
// ============================================================================
let idCounter = 0;
/**
 * Generate a unique ID for ARIA relationships
 *
 * @description
 * Creates a unique ID that can be used for aria-labelledby, aria-describedby,
 * and other ARIA relationships. The ID is guaranteed to be unique within
 * the current session.
 *
 * @example
 * ```tsx
 * const labelId = generateAriaId('label')
 * const inputId = generateAriaId('input')
 *
 * return (
 *   <>
 *     <label id={labelId}>Name</label>
 *     <input id={inputId} aria-labelledby={labelId} />
 *   </>
 * )
 * ```
 *
 * @param prefix - Optional prefix for the ID (default: 'aria')
 * @returns A unique string ID
 */
export function generateAriaId(prefix = 'aria') {
    return `${prefix}-${++idCounter}`;
}
/**
 * Reset the ID counter (useful for testing)
 */
export function resetAriaIdCounter() {
    idCounter = 0;
}
/**
 * Reset the announcer state (useful for testing)
 * @internal
 */
export function resetAnnouncer() {
    if (announcer && announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
    }
    announcer = null;
}
// ============================================================================
// Live Region Announcements
// ============================================================================
let announcer = null;
/**
 * Get or create the live region announcer element
 *
 * @description
 * Creates a visually hidden live region that screen readers will announce.
 * The element is created once and reused for all announcements.
 */
function getAnnouncer() {
    if (typeof document === 'undefined') {
        // Return a dummy element for SSR
        return {};
    }
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'clarity-aria-announcer';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        // Visually hidden but accessible to screen readers
        Object.assign(announcer.style, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: '0',
        });
        document.body.appendChild(announcer);
    }
    return announcer;
}
/**
 * Announce a message to screen readers
 *
 * @description
 * Uses a live region to announce a message to screen readers.
 * Messages are announced in order, with a small delay between them
 * to ensure proper announcement.
 *
 * @example
 * ```tsx
 * // Polite announcement (default) - waits for current speech to finish
 * announce('Item added to cart')
 *
 * // Assertive announcement - interrupts current speech
 * announce('Error: Please fix the form', { assertive: true })
 *
 * // Clear announcement after delay
 * announce('Loading complete', { clearAfter: 3000 })
 * ```
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/} APG Names and Descriptions
 *
 * @param message - The message to announce
 * @param options - Configuration options
 */
export function announce(message, options = {}) {
    const { assertive = false, clearAfter } = options;
    if (typeof document === 'undefined') {
        return;
    }
    const element = getAnnouncer();
    // Update aria-live based on assertiveness
    element.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    // Clear then set to ensure announcement
    // This is necessary because some screen readers won't re-announce identical content
    element.textContent = '';
    // Use requestAnimationFrame to ensure the clear is processed first
    requestAnimationFrame(() => {
        element.textContent = message;
        if (clearAfter && clearAfter > 0) {
            setTimeout(() => {
                if (element.textContent === message) {
                    element.textContent = '';
                }
            }, clearAfter);
        }
    });
}
/**
 * Clear any pending announcements
 */
export function clearAnnouncement() {
    const element = getAnnouncer();
    element.textContent = '';
}
// ============================================================================
// Focus Management
// ============================================================================
/**
 * Selector for focusable elements
 */
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not(:disabled)',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
    'details > summary:first-of-type',
].join(',');
/**
 * Get all focusable elements within a container
 *
 * @description
 * Returns an array of all focusable elements within the given container,
 * in DOM order. Useful for implementing focus traps and keyboard navigation.
 *
 * @example
 * ```tsx
 * const dialogRef = useRef<HTMLDivElement>(null)
 *
 * const focusableElements = getFocusableElements(dialogRef.current)
 * const firstElement = focusableElements[0]
 * const lastElement = focusableElements[focusableElements.length - 1]
 * ```
 *
 * @param container - The container element to search within
 * @returns Array of focusable HTML elements
 */
export function getFocusableElements(container) {
    if (!container)
        return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
        // Filter out elements with display: none or visibility: hidden
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
    });
}
/**
 * Get the first focusable element within a container
 *
 * @param container - The container element to search within
 * @returns The first focusable element, or null if none found
 */
export function getFirstFocusableElement(container) {
    const elements = getFocusableElements(container);
    return elements[0] || null;
}
/**
 * Get the last focusable element within a container
 *
 * @param container - The container element to search within
 * @returns The last focusable element, or null if none found
 */
export function getLastFocusableElement(container) {
    const elements = getFocusableElements(container);
    return elements[elements.length - 1] || null;
}
/**
 * Focus the first focusable element within a container
 *
 * @param container - The container element to search within
 * @returns true if an element was focused, false otherwise
 */
export function focusFirstElement(container) {
    const element = getFirstFocusableElement(container);
    if (element) {
        element.focus();
        return true;
    }
    return false;
}
/**
 * Store the currently focused element for later restoration
 *
 * @description
 * Returns a function that, when called, will restore focus to the element
 * that was focused when this function was called. Useful for dialogs and
 * other temporary UI that should return focus when closed.
 *
 * @example
 * ```tsx
 * const restoreFocus = saveFocus()
 *
 * // Open dialog, do stuff...
 *
 * // When closing:
 * restoreFocus()
 * ```
 *
 * @returns A function that restores focus to the previously focused element
 */
export function saveFocus() {
    const activeElement = document.activeElement;
    return () => {
        if (activeElement && typeof activeElement.focus === 'function') {
            // Use setTimeout to ensure this happens after any pending focus events
            setTimeout(() => {
                activeElement.focus();
            }, 0);
        }
    };
}
// ============================================================================
// Keyboard Navigation Helpers
// ============================================================================
/**
 * Common keyboard keys for accessibility
 */
export const Keys = {
    Enter: 'Enter',
    Space: ' ',
    Escape: 'Escape',
    Tab: 'Tab',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Home: 'Home',
    End: 'End',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
};
/**
 * Check if a keyboard event matches a specific key
 *
 * @param event - The keyboard event
 * @param key - The key to check for
 * @returns true if the event matches the key
 */
export function isKey(event, key) {
    return event.key === key;
}
/**
 * Check if Enter or Space was pressed (common activation keys)
 *
 * @param event - The keyboard event
 * @returns true if Enter or Space was pressed
 */
export function isActivationKey(event) {
    return isKey(event, Keys.Enter) || isKey(event, Keys.Space);
}
// ============================================================================
// ARIA Attribute Helpers
// ============================================================================
/**
 * Create an object of ARIA attributes for error states
 *
 * @description
 * Returns the appropriate ARIA attributes for form fields in an error state.
 *
 * @example
 * ```tsx
 * const errorAttrs = getErrorAriaAttributes(error, errorId)
 * return <input {...errorAttrs} />
 * ```
 *
 * @param hasError - Whether the field has an error
 * @param errorId - The ID of the error message element
 * @returns Object with aria-invalid and aria-describedby
 */
export function getErrorAriaAttributes(hasError, errorId) {
    if (!hasError)
        return {};
    return {
        'aria-invalid': true,
        ...(errorId ? { 'aria-describedby': errorId } : {}),
    };
}
/**
 * Create loading state ARIA attributes
 *
 * @param isLoading - Whether the component is loading
 * @returns Object with aria-busy
 */
export function getLoadingAriaAttributes(isLoading) {
    return isLoading ? { 'aria-busy': true } : {};
}
/**
 * Create expanded state ARIA attributes
 *
 * @param isExpanded - Whether the component is expanded
 * @param controlsId - ID of the element this controls
 * @returns Object with aria-expanded and aria-controls
 */
export function getExpandedAriaAttributes(isExpanded, controlsId) {
    return {
        'aria-expanded': isExpanded,
        ...(controlsId ? { 'aria-controls': controlsId } : {}),
    };
}
//# sourceMappingURL=aria.js.map