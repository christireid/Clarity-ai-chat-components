import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/hooks/__tests__/use-streamable-ui.test.ts',
      'src/components/__tests__/stream-block.test.tsx',
    ],
    isolate: true,
    maxConcurrency: 1,
    minWorkers: 1,
    maxWorkers: 1,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    reporters: [
      [
        'default',
        {
          summary: false,
        },
      ],
    ],
  },
  resolve: {
    alias: {
      '@clarity-chat/types': path.resolve(__dirname, '../types/src'),
      '@clarity-chat/primitives': path.resolve(__dirname, '../primitives/src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxDev: false,
    target: 'es2019',
  },
})

