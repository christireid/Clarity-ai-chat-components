import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  // Vite v7: Leveraging improved build performance and better ESM support
  build: {
    // Vite v7: Improved tree-shaking and minification
    minify: 'esbuild',
    target: 'esnext',
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    // Vitest v4: Leveraging improved thread pool configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2,
        minThreads: 1,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/examples/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.turbo', '**/examples/**'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
