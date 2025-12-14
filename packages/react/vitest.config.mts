import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  // Vite v7: Leveraging improved build performance and better ESM support
  build: {
    // Vite v7: Improved tree-shaking and minification
    minify: 'esbuild',
    target: 'esnext',
  },
  test: {
    globals: true,
    // Use jsdom for best compatibility with @testing-library/user-event keyboard interactions.
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // Enables focus/selection APIs that user-event relies on for typing/tabbing.
        pretendToBeVisual: true,
      },
    },
    setupFiles: ['./vitest.setup.ts'],
    // Memory-optimized configuration for large test suites
    // Using vmThreads with singleThread for optimal memory usage
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        // Single thread mode significantly reduces memory overhead
        singleThread: true,
        // Memory limits per worker
        memoryLimit: '512MB',
      },
    },
    // Reduce parallelism to avoid memory issues
    maxConcurrency: 1,
    // Increase test timeout for slower execution
    testTimeout: 20000,
    // Disable isolation to reduce memory overhead (tests should clean up properly)
    isolate: false,
    // Include all test directories
    include: [
      'src/**/__tests__/**/*.test.{ts,tsx}',
    ],
    // Exclude heavy tests that cause memory issues
    exclude: [
      'node_modules',
      'dist',
      '**/*.stories.tsx',
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
      '@/lib/utils': path.resolve(__dirname, '../primitives/src/lib/utils'),
      '@': path.resolve(__dirname, '../primitives/src'),
    },
  },
})
