import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'setup.ts',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@clarity-chat/primitives': path.resolve(__dirname, '../../packages/primitives/src'),
      '@clarity-chat/react': path.resolve(__dirname, '../../packages/react/src'),
      '@clarity-chat/types': path.resolve(__dirname, '../../packages/types/src'),
      '@clarity-chat/testing-utils': path.resolve(__dirname, '../../packages/testing-utils/src'),
      '@clarity-chat/memory': path.resolve(__dirname, '../../packages/memory/src'),
      '@clarity-chat/error-handling': path.resolve(__dirname, '../../packages/error-handling/src'),
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-dev-runtime'),
    },
  },
})
