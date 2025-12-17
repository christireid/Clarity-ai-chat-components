import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: [
      { find: '@clarity-chat/utils/async', replacement: resolve(__dirname, '../utils/src/async/index.ts') },
      { find: '@clarity-chat/utils/cache', replacement: resolve(__dirname, '../utils/src/cache/index.ts') },
      { find: '@clarity-chat/utils/errors', replacement: resolve(__dirname, '../utils/src/errors/index.ts') },
      { find: '@clarity-chat/utils/format', replacement: resolve(__dirname, '../utils/src/format/index.ts') },
      { find: '@clarity-chat/utils/logger', replacement: resolve(__dirname, '../utils/src/logger/index.ts') },
      { find: '@clarity-chat/utils/progress', replacement: resolve(__dirname, '../utils/src/progress/index.ts') },
      { find: '@clarity-chat/utils/validation', replacement: resolve(__dirname, '../utils/src/validation/index.ts') },
      { find: /^@clarity-chat\/utils\/(.*)/, replacement: resolve(__dirname, '../utils/src/$1') },
      { find: '@clarity-chat/utils', replacement: resolve(__dirname, '../utils/src/index.ts') },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ClarityChat',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
    },
    sourcemap: true,
  },
})
