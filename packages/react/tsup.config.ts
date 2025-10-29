import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    // Don't resolve types from external dependencies - just generate for our code
    resolve: false,
    compilerOptions: {
      skipLibCheck: true,
    },
  },
  external: ['react', 'react-dom', 'framer-motion'],
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true,
})
