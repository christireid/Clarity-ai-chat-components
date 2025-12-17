import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    
    // Memory and timeout configuration
    testTimeout: 30000, // 30 seconds for complex tests
    hookTimeout: 30000,
    teardownTimeout: 30000,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/test-setup.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/__tests__/**',
        'dist/**',
        'build/**',
        'coverage/**'
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/__tests__/**/*.{ts,tsx}'
    ],
    
    // Memory leak detection
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 2,
        minThreads: 1
      }
    },
    
    // Rejections handling
    onConsoleLog: (log, type) => {
      if (type === 'warn' && log.includes('act')) {
        return false // Suppress React act() warnings in tests
      }
    },
    
    // Clear mocks between tests
    clearMocks: true,
    restoreMocks: true,
    
    // Memory optimization
    maxConcurrency: 2,
    maxThreads: 2,
    minThreads: 1
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test-utils': resolve(__dirname, './src/test-utils.tsx'),
      '@clarity-chat/primitives': resolve(__dirname, '../primitives/src'),
      '@clarity-chat/types': resolve(__dirname, '../types/src'),
      '@clarity-chat/memory': resolve(__dirname, '../memory/src'),
      '@clarity-chat/shared-utils': resolve(__dirname, '../shared-utils/src')
    }
  },
  
  esbuild: {
    target: 'es2020',
    format: 'esm'
  },
  
  // Optimize for CI environments
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ]
  },
  
  // Server configuration for memory-constrained environments
  server: {
    hmr: false,
    watch: {
      usePolling: false
    }
  }
})