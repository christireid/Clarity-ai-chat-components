import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@clarity-chat/utils/async',
        replacement: resolve(__dirname, '../utils/src/async/index.ts'),
      },
      {
        find: '@clarity-chat/utils/cache',
        replacement: resolve(__dirname, '../utils/src/cache/index.ts'),
      },
      {
        find: '@clarity-chat/utils/errors',
        replacement: resolve(__dirname, '../utils/src/errors/index.ts'),
      },
      {
        find: '@clarity-chat/utils/format',
        replacement: resolve(__dirname, '../utils/src/format/index.ts'),
      },
      {
        find: '@clarity-chat/utils/logger',
        replacement: resolve(__dirname, '../utils/src/logger/index.ts'),
      },
      {
        find: '@clarity-chat/utils/progress',
        replacement: resolve(__dirname, '../utils/src/progress/index.ts'),
      },
      {
        find: '@clarity-chat/utils/validation',
        replacement: resolve(__dirname, '../utils/src/validation/index.ts'),
      },
      {
        find: /^@clarity-chat\/utils\/(.*)/,
        replacement: resolve(__dirname, '../utils/src/$1'),
      },
      {
        find: '@clarity-chat/utils',
        replacement: resolve(__dirname, '../utils/src/index.ts'),
      },
    ],
  },
  // Vite v7: Leveraging improved build performance and better ESM support
  build: {
    // Vite v7: Improved tree-shaking and minification
    minify: 'esbuild',
    target: 'esnext',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Vitest v4: Leveraging improved thread pool configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2,
        minThreads: 1,
      },
    },
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
})
