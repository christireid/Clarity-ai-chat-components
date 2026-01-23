import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  // DTS disabled due to verbatimModuleSyntax issues in source files
  // Types are validated via 'tsc --noEmit' script
  dts: false,
  clean: true,
  external: ['jscodeshift'],
  banner: {
    js: '#!/usr/bin/env node',
  },
})
