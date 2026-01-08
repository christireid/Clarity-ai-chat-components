/**
 * Shared Vitest Configuration
 *
 * This file provides a base configuration that can be imported and extended
 * by individual package vitest configs.
 *
 * Usage:
 * ```ts
 * import { sharedConfig } from '@clarity-chat/testing-utils/vitest.shared'
 * import { defineConfig, mergeConfig } from 'vitest/config'
 *
 * export default mergeConfig(sharedConfig, defineConfig({
 *   test: {
 *     // package-specific overrides
 *   }
 * }))
 * ```
 */
import { defineConfig } from 'vitest/config';
/**
 * Shared test configuration with memory-optimized settings
 */
export const sharedConfig = defineConfig({
    test: {
        // Enable globals (describe, it, expect, vi)
        globals: true,
        // Thread pool configuration optimized for memory usage
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                // Limit threads to reduce memory usage in large test suites
                maxThreads: 2,
                minThreads: 1,
            },
        },
        // Reduce parallelism to avoid memory issues
        maxConcurrency: 2,
        // Reasonable timeout for tests
        testTimeout: 15000,
        // Isolate tests properly to prevent state leakage
        isolate: true,
        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/index.ts',
                '**/__tests__/**',
                '**/*.stories.tsx',
            ],
        },
    },
});
/**
 * Node environment configuration for non-UI packages
 */
export const nodeConfig = defineConfig({
    test: {
        ...sharedConfig.test,
        environment: 'node',
    },
});
/**
 * Happy-DOM configuration for React components
 */
export const happyDomConfig = defineConfig({
    test: {
        ...sharedConfig.test,
        environment: 'happy-dom',
    },
});
export default sharedConfig;
//# sourceMappingURL=vitest.shared.js.map