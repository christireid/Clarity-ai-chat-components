import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom'],
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
})
