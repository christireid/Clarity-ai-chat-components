import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/index.css'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disable DTS generation to reduce memory usage
  external: ['react', 'react-dom', 'framer-motion', '@clarity-chat/primitives', '@clarity-chat/types'],
  clean: true,
  sourcemap: false, // Disable to reduce memory
  minify: false, // Disable to reduce memory
  splitting: false, // Disable to reduce memory
  treeshake: false, // Disable to reduce memory
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
