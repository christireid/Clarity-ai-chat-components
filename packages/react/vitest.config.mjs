import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.ts'],
        // Optimize memory usage - use threads instead of forks for better memory management
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                maxThreads: 2, // Limit threads to reduce memory usage
                minThreads: 1,
            },
        },
        // Reduce parallelism to avoid memory issues
        maxConcurrency: 2,
        // Increase test timeout for slower execution
        testTimeout: 15000,
        // Isolate tests properly
        isolate: true,
        // Enable more component tests with memory optimizations
        include: [
            'src/embeddings/__tests__/**/*.test.ts',
            'src/prompts/__tests__/**/*.test.ts',
            'src/plugins/__tests__/**/*.test.ts',
            'src/safety/__tests__/**/*.test.ts',
            'src/hooks/__tests__/**/*.test.ts',
            'src/utils/__tests__/**/*.test.ts',
            'src/components/__tests__/**/*.test.tsx',
        ],
        // Exclude heavy tests that cause memory issues
        exclude: [
            'node_modules',
            'dist',
            '**/*.stories.tsx',
            '**/chat-window.test.enhanced.tsx', // Heavy test, enable separately
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