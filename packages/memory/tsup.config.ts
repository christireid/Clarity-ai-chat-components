import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: [],
  // Optimize for tree-shaking
  esbuildOptions(options) {
    options.treeShaking = true
    options.minifyIdentifiers = false
    options.minifySyntax = false
    options.minifyWhitespace = false
  },
})
