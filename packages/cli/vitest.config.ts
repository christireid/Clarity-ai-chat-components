import { defineConfig } from 'vitest/config'
import path from 'path'

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
    // Vitest v4: Leveraging improved thread pool configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2,
        minThreads: 1,
      },
    },
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@clarity-chat/utils': path.resolve(__dirname, '../utils/src'),
    },
    dedupe: ['zod', 'fs-extra'],
  },
  esbuild: {
    // Vite 7 requires Node 20.19+ or 22.12+, update target accordingly
    target: 'node20',
  },
})
