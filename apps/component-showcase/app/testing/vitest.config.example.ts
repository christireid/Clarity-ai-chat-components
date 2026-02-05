import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],

  test: {
    // Use happy-dom for faster tests (or 'jsdom' for better browser compatibility)
    environment: 'happy-dom',

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Setup files to run before tests
    setupFiles: ['./vitest.setup.ts'],

    // Test match patterns
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/index.ts',
        '**/*.d.ts',
        'vitest.setup.ts',
        '**/__tests__/**',
      ],
      // Coverage thresholds
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 85,
        statements: 85,
      },
    },

    // Test timeout
    testTimeout: 10000,

    // Hook timeout
    hookTimeout: 10000,

    // Fail test on console errors
    onConsoleLog(log, type) {
      if (type === 'error') {
        return false // Don't fail on errors in tests
      }
      return true
    },

    // Retry failed tests
    retry: 2,

    // Reporter configuration
    reporters: ['verbose'],

    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },

  esbuild: {
    target: 'node20',
  },
})
