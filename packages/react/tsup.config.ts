import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/index.css'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled due to export name conflicts - needs cleanup
  external: ['react', 'react-dom', 'framer-motion', '@clarity-chat/types'],
  noExternal: ['@clarity-chat/primitives'],
  clean: true,
  sourcemap: false,
  minify: false,
  splitting: false,
  treeshake: false,
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
