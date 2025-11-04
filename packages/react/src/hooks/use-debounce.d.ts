/**
 * Debounce a value - only updates after delay has passed since last change.
 * Useful for reducing the frequency of expensive operations like API calls or
 * heavy computations during rapid user input.
 *
 * **Use Cases:**
 * - Search input with API calls
 * - Form validation
 * - Auto-save functionality
 * - Filtering large lists
 *
 * @template T - The type of value to debounce
 * @param {T} value - The value to debounce
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {T} The debounced value
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // Only fires 500ms after user stops typing
 *   searchAPI(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export declare function useDebounce<T>(value: T, delay?: number): T;
/**
 * Debounce a callback function - creates a debounced version of the provided
 * callback that delays execution until after the specified delay has elapsed
 * since the last call.
 *
 * **Use Cases:**
 * - Form auto-save
 * - Resize handlers
 * - Scroll event handlers
 * - API calls triggered by user input
 *
 * @template T - The callback function type
 * @param {T} callback - The function to debounce
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {(...args: Parameters<T>) => void} Debounced version of the callback
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback(
 *   (value) => saveToAPI(value),
 *   1000
 * )
 *
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 * ```
 */
export declare function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay?: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=use-debounce.d.ts.map