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
    environment: 'happy-dom',
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
    // Enable isolation to avoid cumulative memory growth across the suite
    isolate: true,
    // Include all test directories
    include: [
      'src/**/__tests__/**/*.test.{ts,tsx}',
      'src/**/__benchmarks__/**/*.bench.{ts,tsx}',
    ],
    // Exclude heavy tests that cause memory issues
    exclude: [
      'node_modules',
      'dist',
      '**/*.stories.tsx',
    ],
    // Benchmark configuration
    benchmark: {
      include: ['src/**/__benchmarks__/**/*.bench.{ts,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        // Exclude benchmarks that depend on @clarity-chat/dev-tools (not yet implemented)
        'src/__benchmarks__/concurrent-streams.bench.tsx',
        'src/__benchmarks__/layout-thrashing.bench.tsx',
        'src/__benchmarks__/long-message-list.bench.tsx',
        'src/__benchmarks__/streaming.bench.tsx',
        'src/__benchmarks__/virtualization.bench.tsx',
      ],
      // Benchmark options
      outputFile: './benchmark-results.json',
    },
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
      '@clarity-chat/types': path.resolve(__dirname, '../types/src/index.ts'),
      '@clarity-chat/primitives': path.resolve(__dirname, '../primitives/src/index.ts'),
      '@/lib/utils': path.resolve(__dirname, '../primitives/src/lib/utils'),
      '@': path.resolve(__dirname, '../primitives/src'),
      '@clarity-chat/memory': path.resolve(__dirname, '../memory/src/index.ts'),
      '@clarity-chat/token-optimization': path.resolve(__dirname, '../token-optimization/src/index.ts'),
      // Utils subpath exports must be defined before the main export
      '@clarity-chat/utils/logger': path.resolve(__dirname, '../utils/src/logger/index.ts'),
      '@clarity-chat/utils/errors': path.resolve(__dirname, '../utils/src/errors/index.ts'),
      '@clarity-chat/utils/format': path.resolve(__dirname, '../utils/src/format/index.ts'),
      '@clarity-chat/utils/cache': path.resolve(__dirname, '../utils/src/cache/index.ts'),
      '@clarity-chat/utils/async': path.resolve(__dirname, '../utils/src/async/index.ts'),
      '@clarity-chat/utils/validation': path.resolve(__dirname, '../utils/src/validation/index.ts'),
      '@clarity-chat/utils/progress': path.resolve(__dirname, '../utils/src/progress/index.ts'),
      '@clarity-chat/utils': path.resolve(__dirname, '../utils/src/index.ts'),
    },
  },
})
