import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Disabled due to pre-existing type errors in codemod transforms
  clean: true,
  sourcemap: true,
  external: ['jscodeshift', 'commander', 'chalk', 'ora'],
})
