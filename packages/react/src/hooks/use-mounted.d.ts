/**
 * Track if component is currently mounted
 * Useful for preventing state updates after unmount
 *
 * @example
 * ```tsx
 * const isMounted = useMounted()
 *
 * useEffect(() => {
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (isMounted()) {
 *       setData(data)
 *     }
 *   }
 *   fetchData()
 * }, [])
 * ```
 */
export declare function useMounted(): () => boolean;
//# sourceMappingURL=use-mounted.d.ts.map