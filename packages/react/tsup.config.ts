import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled for now due to Framer Motion type conflicts
  external: ['react', 'react-dom'],
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true
})
