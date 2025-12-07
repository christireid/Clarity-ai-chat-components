import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        // Exclude compiled .js test files - only run .ts/.tsx source files
        exclude: [
            'node_modules/**',
            'dist/**',
            '**/*.js',
            '**/*.d.ts',
            '**/*.config.*',
            '**/*.stories.tsx',
        ],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/dist/',
                '**/*.stories.tsx',
                '**/*.js', // Exclude compiled JS files
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
//# sourceMappingURL=vitest.config.js.map