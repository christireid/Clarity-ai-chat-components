/**
 * Mobile keyboard state
 */
export interface MobileKeyboardState {
    /** Whether keyboard is currently visible */
    isKeyboardVisible: boolean;
    /** Estimated keyboard height in pixels */
    keyboardHeight: number;
    /** Whether device is mobile */
    isMobile: boolean;
    /** Original viewport height (before keyboard) */
    originalViewportHeight: number;
}
/**
 * Mobile keyboard hook options
 */
export interface UseMobileKeyboardOptions {
    /** Callback when keyboard shows */
    onKeyboardShow?: (height: number) => void;
    /** Callback when keyboard hides */
    onKeyboardHide?: () => void;
    /** Debounce delay for resize events in ms */
    debounceDelay?: number;
    /** Enable auto-scroll to focused input */
    autoScroll?: boolean;
    /** Additional offset for auto-scroll in px */
    scrollOffset?: number;
}
/**
 * Production-ready mobile keyboard detection hook.
 *
 * **Features:**
 * - Detects keyboard show/hide events
 * - Estimates keyboard height
 * - Auto-scroll to focused input
 * - Handles viewport changes
 * - iOS and Android support
 * - Debounced resize handling
 *
 * **Use Cases:**
 * - Adjust UI when keyboard appears
 * - Scroll chat input into view
 * - Prevent content from being hidden
 * - Improve mobile UX
 *
 * **Platform Notes:**
 * - iOS: Uses visualViewport API and focusin/focusout events
 * - Android: Uses window resize detection
 * - Falls back gracefully on desktop
 *
 * @example
 * ```tsx
 * // Basic usage
 * function ChatInput() {
 *   const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard()
 *
 *   return (
 *     <div style={{ marginBottom: keyboardHeight }}>
 *       <input />
 *     </div>
 *   )
 * }
 *
 * // With callbacks
 * function ChatWindow() {
 *   const keyboard = useMobileKeyboard({
 *     onKeyboardShow: (height) => {
 *       console.log('Keyboard shown, height:', height)
 *     },
 *     onKeyboardHide: () => {
 *       console.log('Keyboard hidden')
 *     },
 *     autoScroll: true,
 *     scrollOffset: 20
 *   })
 *
 *   return <div>...</div>
 * }
 *
 * // Conditional rendering
 * function ChatFooter() {
 *   const { isKeyboardVisible, isMobile } = useMobileKeyboard()
 *
 *   if (!isMobile) return <FullFooter />
 *   if (isKeyboardVisible) return <CompactFooter />
 *   return <DefaultFooter />
 * }
 * ```
 */
export declare function useMobileKeyboard(options?: UseMobileKeyboardOptions): MobileKeyboardState;
/**
 * Utility hook for mobile-specific viewport height
 * Provides a stable viewport height that accounts for mobile browsers' address bar
 */
export declare function useMobileViewportHeight(): number;
/**
 * Utility hook to prevent body scroll when keyboard is visible
 * Useful for modal/fullscreen chat interfaces
 */
export declare function useMobileKeyboardScrollLock(): void;
//# sourceMappingURL=use-mobile-keyboard.d.ts.map