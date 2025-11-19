import { defineConfig } from 'tsup'

export default defineConfig([
  // Main entry
  {
    entry: ['src/index.ts', 'src/styles/index.css'],
    format: ['cjs', 'esm'],
    dts: true, // Generate type declarations automatically
    external: [
      'react',
      'react-dom',
      'framer-motion',
      '@clarity-chat/primitives',
      '@clarity-chat/types',
      '@clarity-chat/memory',
      'mermaid',
      'highlight.js/styles/github-dark.css',
      'katex/dist/katex.min.css',
    ],
    clean: true,
    sourcemap: false,
    minify: false,
    splitting: false,
    treeshake: false,
    loader: {
      '.css': 'copy',
    },
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'js' : 'mjs'}`,
        css: '.css',
      }
    },
  },
  // TODO: Re-enable once prompt system core/ directory is implemented
  // Prompt optimization subpath export
  // {
  //   entry: ['src/prompt/index.ts'],
  //   format: ['cjs', 'esm'],
  //   dts: false,
  //   external: [
  //     'react',
  //     'react-dom',
  //   ],
  //   outDir: 'dist/prompt',
  //   sourcemap: false,
  //   minify: false,
  //   splitting: false,
  //   treeshake: false,
  //   outExtension({ format }) {
  //     return {
  //       js: `.${format === 'cjs' ? 'js' : 'mjs'}`,
  //     }
  //   },
  // },
])
