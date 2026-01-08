/**
 * Test Environment Fix
 *
 * This file provides utilities to fix common test environment issues
 * that cause failures in the Clarity Chat test suite.
 */
import { vi } from 'vitest';
/**
 * Fix for timing-sensitive tests that fail due to race conditions
 */
export function fixTimingIssues() {
    // Increase test timeout for memory operations
    vi.setConfig({ testTimeout: 30000 });
    // Mock timers for consistent timing
    vi.useFakeTimers();
}
/**
 * Fix for floating point precision issues in tests
 */
export function fixFloatingPointPrecision(actual, expected, tolerance = 0.0001) {
    return Math.abs(actual - expected) < tolerance;
}
/**
 * Fix for snapshot testing issues
 */
export function fixSnapshotTesting(snapshot) {
    // Remove dynamic fields that change between runs
    const cleanedSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Remove timestamps and IDs that vary
    const removeDynamicFields = (obj) => {
        if (typeof obj !== 'object' || obj === null)
            return obj;
        if (Array.isArray(obj)) {
            return obj.map(removeDynamicFields);
        }
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            // Skip dynamic fields
            if (key === 'id' || key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
                continue;
            }
            cleaned[key] = removeDynamicFields(value);
        }
        return cleaned;
    };
    return removeDynamicFields(cleanedSnapshot);
}
/**
 * Fix for mock setup issues
 */
export function fixMockSetup() {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset modules to prevent test interference
    vi.resetModules();
}
/**
 * Fix for theme test environment issues
 */
export function fixThemeEnvironment() {
    // Mock window.matchMedia for theme tests
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}
/**
 * Comprehensive test environment setup
 */
export function setupTestEnvironment() {
    fixTimingIssues();
    fixMockSetup();
    fixThemeEnvironment();
}
/**
 * Clean up test environment
 */
export function cleanupTestEnvironment() {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers();
}
//# sourceMappingURL=fix-test-environment.js.map