import { defineWorkspace } from 'vitest/config'

/**
 * Vitest Workspace Configuration
 * Centralizes test configuration for all packages
 */

export default defineWorkspace([
  {
    test: {
      name: '@clarity-chat/primitives',
      root: './packages/primitives',
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.d.ts',
          '**/*.config.{js,ts}',
          '**/test-setup.ts',
          '**/__tests__/**',
        ],
        thresholds: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
  {
    test: {
      name: '@clarity-chat/react',
      root: './packages/react',
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.d.ts',
          '**/*.config.{js,ts}',
          '**/test-setup.ts',
          '**/__tests__/**',
        ],
        thresholds: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
  {
    test: {
      name: '@clarity-chat/error-handling',
      root: './packages/error-handling',
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        thresholds: {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
  {
    test: {
      name: '@clarity-chat/memory',
      root: './packages/memory',
      environment: 'node',
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        thresholds: {
          statements: 85,
          branches: 75,
          functions: 85,
          lines: 85,
        },
      },
    },
  },
  {
    test: {
      name: '@clarity-chat/types',
      root: './packages/types',
      environment: 'node',
      globals: true,
    },
  },
])
