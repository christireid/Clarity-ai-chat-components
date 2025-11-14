import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'], // External peer dependencies
  esbuildOptions(options) {
    options.target = 'es2020'
    options.legalComments = 'none'
  },
  onSuccess: 'echo "✅ Build complete!"',
})
