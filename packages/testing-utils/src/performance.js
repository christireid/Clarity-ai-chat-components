/**
 * Performance Testing Utilities
 *
 * Measure and assert component performance
 */
// Use browser performance API (available in test environments)
/**
 * Measure render performance
 *
 * @example
 * ```tsx
 * const metrics = await measureRenderPerformance(() => {
 *   renderWithProviders(<ExpensiveComponent />)
 * })
 *
 * expect(metrics.duration).toBeLessThan(100)
 * ```
 */
export async function measureRenderPerformance(renderFn) {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    renderFn();
    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    return {
        duration: endTime - startTime,
        memory: endMemory - startMemory,
    };
}
/**
 * Measure multiple renders and get average
 *
 * @example
 * ```tsx
 * const metrics = await measureAveragePerformance(
 *   () => renderWithProviders(<Component />),
 *   10
 * )
 * ```
 */
export async function measureAveragePerformance(renderFn, iterations = 10) {
    const results = [];
    for (let i = 0; i < iterations; i++) {
        const metrics = await measureRenderPerformance(renderFn);
        results.push(metrics);
    }
    return {
        duration: results.reduce((sum, m) => sum + m.duration, 0) / iterations,
        memory: results.reduce((sum, m) => sum + m.memory, 0) / iterations,
    };
}
/**
 * Assert performance benchmarks
 *
 * @example
 * ```tsx
 * await expectPerformance(
 *   () => renderWithProviders(<Component />),
 *   { maxDuration: 100, maxMemory: 1024 * 1024 }
 * )
 * ```
 */
export async function expectPerformance(renderFn, thresholds) {
    const metrics = await measureRenderPerformance(renderFn);
    if (thresholds.maxDuration !== undefined) {
        expect(metrics.duration).toBeLessThan(thresholds.maxDuration);
    }
    if (thresholds.maxMemory !== undefined) {
        expect(metrics.memory).toBeLessThan(thresholds.maxMemory);
    }
}
/**
 * Profile component re-renders
 *
 * @example
 * ```tsx
 * const profile = await profileReRenders(() => {
 *   const { rerender } = renderWithProviders(<Component count={1} />)
 *   rerender(<Component count={2} />)
 *   rerender(<Component count={3} />)
 * })
 * ```
 */
export async function profileReRenders(testFn) {
    const startTime = performance.now();
    let renderCount = 0;
    // Mock React's render tracking
    const originalRender = console.log;
    console.log = (...args) => {
        if (args[0]?.includes?.('render')) {
            renderCount++;
        }
        originalRender(...args);
    };
    testFn();
    console.log = originalRender;
    const endTime = performance.now();
    return {
        renderCount,
        totalDuration: endTime - startTime,
        averageDuration: (endTime - startTime) / Math.max(renderCount, 1),
    };
}
//# sourceMappingURL=performance.js.map