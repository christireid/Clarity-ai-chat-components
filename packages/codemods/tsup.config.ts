import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  target: 'node16',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    'jscodeshift',
  ],
})
