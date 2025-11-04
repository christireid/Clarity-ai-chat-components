export interface WindowSize {
    width: number;
    height: number;
}
/**
 * Track window dimensions with throttled updates to prevent performance issues
 * during window resize events.
 *
 * **Features:**
 * - Automatic throttling (150ms default)
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient
 *
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 *
 * @returns {WindowSize} Object containing current window width and height
 * @example
 * ```tsx
 * const { width, height } = useWindowSize()
 *
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *     {width < 768 ? <MobileView /> : <DesktopView />}
 *   </div>
 * )
 * ```
 */
export declare function useWindowSize(): WindowSize;
//# sourceMappingURL=use-window-size.d.ts.map