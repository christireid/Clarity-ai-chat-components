/**
 * Accessibility Testing Utilities
 *
 * Utilities for automated accessibility testing using axe-core.
 * These can be integrated into unit tests or run during development.
 *
 * @module accessibility-testing
 */
export interface AccessibilityViolation {
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
        html: string;
        target: string[];
        failureSummary: string;
    }>;
}
export interface AccessibilityResult {
    violations: AccessibilityViolation[];
    passes: number;
    incomplete: number;
    inapplicable: number;
}
/**
 * Runs axe-core accessibility checks on a DOM element.
 *
 * @param element - Element to check (defaults to document)
 * @param options - axe-core run options
 * @returns Accessibility test results
 *
 * @example
 * ```tsx
 * import { runAccessibilityChecks } from './utils/accessibility-testing'
 *
 * // In a test
 * it('should have no accessibility violations', async () => {
 *   const { violations } = await runAccessibilityChecks(container)
 *   expect(violations).toHaveLength(0)
 * })
 *
 * // During development
 * useEffect(() => {
 *   if (process.env.NODE_ENV === 'development') {
 *     runAccessibilityChecks().then(({ violations }) => {
 *       if (violations.length > 0) {
 *         console.warn('Accessibility violations:', violations)
 *       }
 *     })
 *   }
 * }, [])
 * ```
 */
export declare function runAccessibilityChecks(element?: HTMLElement, options?: Record<string, unknown>): Promise<AccessibilityResult>;
/**
 * Custom matcher for checking accessibility violations.
 *
 * @example
 * ```tsx
 * // In your test setup (setupTests.ts)
 * import { toHaveNoViolations } from './utils/accessibility-testing'
 * expect.extend({ toHaveNoViolations })
 *
 * // In your test
 * it('should be accessible', async () => {
 *   const results = await runAccessibilityChecks(container)
 *   expect(results).toHaveNoViolations()
 * })
 * ```
 */
export declare function toHaveNoViolations(received: AccessibilityResult): {
    pass: boolean;
    message: () => string;
};
/**
 * Logs accessibility violations to the console during development.
 * Only runs in development mode.
 *
 * @example
 * ```tsx
 * // Add to your app's entry point or layout component
 * useEffect(() => {
 *   logAccessibilityViolations()
 * }, [])
 * ```
 */
export declare function logAccessibilityViolations(): Promise<void>;
interface UseAccessibilityCheckOptions {
    /** Run checks automatically on mount */
    autoRun?: boolean;
    /** Re-run on these dependencies */
    runOnChange?: unknown[];
    /** Debounce time in ms */
    debounce?: number;
}
/**
 * React hook for running accessibility checks.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { violations, isChecking, runCheck } = useAccessibilityCheck({
 *     autoRun: true,
 *   })
 *
 *   return (
 *     <div>
 *       {violations.length > 0 && (
 *         <div role="alert">
 *           {violations.length} accessibility issues found
 *         </div>
 *       )}
 *       <button onClick={runCheck}>Re-check accessibility</button>
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useAccessibilityCheck(options?: UseAccessibilityCheckOptions): {
    violations: any;
    isChecking: any;
    runCheck: any;
    hasViolations: boolean;
};
/**
 * Asserts that an element is accessible.
 * Throws if violations are found.
 */
export declare function assertAccessible(element?: HTMLElement): Promise<void>;
/**
 * Gets all accessibility issues grouped by impact level.
 */
export declare function groupViolationsByImpact(violations: AccessibilityViolation[]): {
    critical: AccessibilityViolation[];
    serious: AccessibilityViolation[];
    moderate: AccessibilityViolation[];
    minor: AccessibilityViolation[];
};
export {};
//# sourceMappingURL=accessibility-testing.d.ts.map