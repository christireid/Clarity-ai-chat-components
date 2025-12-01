import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        // Optimize memory usage
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true, // Run tests in a single process to reduce memory
            },
        },
        // Reduce parallelism to avoid memory issues
        maxConcurrency: 1,
        // Increase test timeout for slower execution
        testTimeout: 10000,
        // Isolate tests properly
        isolate: true,
        // Only run enterprise module tests that work without memory issues
        // See TEST_INFRASTRUCTURE_ISSUES.md for details on excluded tests
        include: [
            'src/agents/__tests__/**/*.test.ts',
            'src/embeddings/__tests__/**/*.test.ts',
            'src/prompts/__tests__/**/*.test.ts',
            'src/plugins/__tests__/**/*.test.ts',
            'src/safety/__tests__/**/*.test.ts',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.stories.tsx',
                '**/*.config.*',
                '**/index.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@clarity-chat/types': path.resolve(__dirname, '../types/src'),
            '@clarity-chat/primitives': path.resolve(__dirname, '../primitives/src'),
        },
    },
});
//# sourceMappingURL=vitest.config.mjs.map