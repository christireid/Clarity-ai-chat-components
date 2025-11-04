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
export declare function useThrottle<T>(value: T, delay?: number): T;
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
export declare function useThrottledCallback<T extends (...args: any[]) => any>(callback: T, delay?: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=use-throttle.d.ts.map