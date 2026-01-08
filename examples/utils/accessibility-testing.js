/**
 * Accessibility Testing Utilities
 *
 * Utilities for automated accessibility testing using axe-core.
 * These can be integrated into unit tests or run during development.
 *
 * @module accessibility-testing
 */
// =============================================================================
// 💡 axe-core Integration
// =============================================================================
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
export async function runAccessibilityChecks(element, options = {}) {
    // Dynamic import of axe-core to avoid bundling in production
    const axeCore = await import('axe-core');
    const axe = axeCore.default || axeCore;
    const results = await axe.run(element || document, {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        ...options,
    });
    return {
        violations: results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map((n) => ({
                html: n.html,
                target: n.target,
                failureSummary: n.failureSummary || '',
            })),
        })),
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
    };
}
// =============================================================================
// 💡 Jest/Vitest Matcher
// =============================================================================
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
export function toHaveNoViolations(received) {
    const { violations } = received;
    if (violations.length === 0) {
        return {
            pass: true,
            message: () => 'Expected accessibility violations but found none',
        };
    }
    const violationSummary = violations
        .map((v) => `  - ${v.id} (${v.impact}): ${v.help}\n    ${v.helpUrl}\n    Nodes:\n${v.nodes
        .map((n) => `      ${n.target.join(', ')}`)
        .join('\n')}`)
        .join('\n\n');
    return {
        pass: false,
        message: () => `Found ${violations.length} accessibility violation(s):\n\n${violationSummary}`,
    };
}
// =============================================================================
// 💡 Development Helper
// =============================================================================
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
export async function logAccessibilityViolations() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
        return;
    }
    try {
        const { violations } = await runAccessibilityChecks();
        if (violations.length === 0) {
            console.log('%c✓ No accessibility violations found', 'color: green');
            return;
        }
        console.log(`%c⚠️ ${violations.length} accessibility violations`, 'color: orange');
        violations.forEach((v) => {
            const impactColor = {
                critical: 'red',
                serious: 'orange',
                moderate: 'yellow',
                minor: 'gray',
            }[v.impact];
            console.log(`%c${v.id}`, `color: ${impactColor}; font-weight: bold`);
            console.log('Impact:', v.impact);
            console.log('Description:', v.description);
            console.log('Help:', v.help);
            console.log('Docs:', v.helpUrl);
            console.log('Affected elements:', v.nodes.map((n) => n.target.join(', ')));
            console.log();
        });
        console.log();
    }
    catch (error) {
        // axe-core might not be installed
        console.warn('Accessibility checks skipped (axe-core not available)');
    }
}
// =============================================================================
// 💡 React Hook
// =============================================================================
import { useEffect, useState, useCallback } from 'react';
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
export function useAccessibilityCheck(options = {}) {
    const { autoRun = false, runOnChange = [], debounce = 0 } = options;
    const [violations, setViolations] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const runCheck = useCallback(async () => {
        if (typeof window === 'undefined')
            return;
        setIsChecking(true);
        try {
            const results = await runAccessibilityChecks();
            setViolations(results.violations);
        }
        catch (error) {
            console.warn('Accessibility check failed:', error);
        }
        finally {
            setIsChecking(false);
        }
    }, []);
    useEffect(() => {
        if (!autoRun)
            return;
        const timeoutId = setTimeout(runCheck, debounce);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRun, debounce, runCheck, ...runOnChange]);
    return {
        violations,
        isChecking,
        runCheck,
        hasViolations: violations.length > 0,
    };
}
// =============================================================================
// 💡 Test Helper Functions
// =============================================================================
/**
 * Asserts that an element is accessible.
 * Throws if violations are found.
 */
export async function assertAccessible(element) {
    const results = await runAccessibilityChecks(element);
    if (results.violations.length > 0) {
        const summary = results.violations
            .map((v) => `${v.id} (${v.impact}): ${v.help}`)
            .join('\n');
        throw new Error(`Accessibility violations found:\n${summary}`);
    }
}
/**
 * Gets all accessibility issues grouped by impact level.
 */
export function groupViolationsByImpact(violations) {
    return {
        critical: violations.filter((v) => v.impact === 'critical'),
        serious: violations.filter((v) => v.impact === 'serious'),
        moderate: violations.filter((v) => v.impact === 'moderate'),
        minor: violations.filter((v) => v.impact === 'minor'),
    };
}
//# sourceMappingURL=accessibility-testing.js.map