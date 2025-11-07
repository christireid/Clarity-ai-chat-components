import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'ink',
    'ink-gradient',
    'ink-select-input',
    'ink-text-input',
    'ink-spinner',
    'react'
  ],
  esbuildOptions(options) {
    options.jsx = 'transform'
    options.loader = {
      ...options.loader,
      '.js': 'jsx',
    }
  },
})
