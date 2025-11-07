import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/index.css'],
  format: ['cjs', 'esm'],
  dts: false, // Use tsc for declarations (see build script)
  external: [
    'react',
    'react-dom',
    'framer-motion',
    '@clarity-chat/primitives',
    '@clarity-chat/types',
    '@clarity-chat/memory',
    'mermaid',
  ],
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
