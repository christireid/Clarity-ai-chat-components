import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/index.css'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled - JS/CSS builds successfully, types can be added later
  external: ['react', 'react-dom', 'framer-motion'],
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
  // Handle CSS files
  loader: {
    '.css': 'copy',
  },
  outExtension({ format }) {
    return {
      js: `.${format === 'cjs' ? 'js' : 'mjs'}`,
      css: '.css',
    }
  },
})
