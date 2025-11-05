import * as React from 'react';
/**
 * Throttle a value - only updates at most once per delay period
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 100)
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY)
 *   window.addEventListener('scroll', handleScroll)
 *   return () => window.removeEventListener('scroll', handleScroll)
 * }, [])
 * ```
 */
export function useThrottle(value, delay = 500) {
    const [throttledValue, setThrottledValue] = React.useState(value);
    const lastRan = React.useRef(Date.now());
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (Date.now() - lastRan.current >= delay) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, delay - (Date.now() - lastRan.current));
        return () => clearTimeout(timer);
    }, [value, delay]);
    return throttledValue;
}
/**
 * Throttle a callback function
 *
 * @example
 * ```tsx
 * const throttledResize = useThrottledCallback(
 *   () => console.log('Resized!'),
 *   200
 * )
 *
 * useEffect(() => {
 *   window.addEventListener('resize', throttledResize)
 *   return () => window.removeEventListener('resize', throttledResize)
 * }, [throttledResize])
 * ```
 */
export function useThrottledCallback(callback, delay = 500) {
    const lastRan = React.useRef(Date.now());
    const timeoutRef = React.useRef();
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return React.useCallback((...args) => {
        if (Date.now() - lastRan.current >= delay) {
            callback(...args);
            lastRan.current = Date.now();
        }
        else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
                lastRan.current = Date.now();
            }, delay - (Date.now() - lastRan.current));
        }
    }, [callback, delay]);
}
//# sourceMappingURL=use-throttle.js.map