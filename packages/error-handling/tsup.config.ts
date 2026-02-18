import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    accessibility: 'src/accessibility.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    }
  },
})
