import * as React from 'react';
/**
 * Get previous value of state or prop from the last render.
 * Useful for tracking changes and implementing undo/comparison features.
 *
 * **How it works:**
 * - Stores the value in a ref
 * - Updates ref after render completes
 * - Returns previous value from last render
 *
 * **Use Cases:**
 * - Tracking value changes
 * - Comparing current vs previous
 * - Animation triggers
 * - Undo functionality
 * - Debugging state changes
 *
 * @template T - Type of value to track
 * @param {T} value - Current value to track
 * @returns {T | undefined} Previous value (undefined on first render)
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const prevCount = usePrevious(count)
 *
 * return (
 *   <div>
 *     <p>Current: {count}</p>
 *     <p>Previous: {prevCount}</p>
 *     {prevCount !== undefined && (
 *       <p>Changed by: {count - prevCount}</p>
 *     )}
 *     <button onClick={() => setCount(count + 1)}>Increment</button>
 *   </div>
 * )
 * ```
 */
export function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
//# sourceMappingURL=use-previous.js.map