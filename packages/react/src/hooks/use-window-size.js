import * as React from 'react';
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
export function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState(() => {
        if (typeof window === 'undefined') {
            return { width: 0, height: 0 };
        }
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    });
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }, 150); // Throttle resize events
        };
        window.addEventListener('resize', handleResize);
        // Set initial size
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);
    return windowSize;
}
//# sourceMappingURL=use-window-size.js.map