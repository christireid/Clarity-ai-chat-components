import { defineConfig } from 'tsup'

const commonConfig = {
  format: ['cjs', 'esm'] as const,
  dts: false, // Temporarily disabled due to strict TypeScript errors
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
  sourcemap: false,
  minify: false,
  splitting: false,
  treeshake: false,
  outExtension({ format }: { format: string }) {
    return {
      js: `.${format === 'cjs' ? 'js' : 'mjs'}`,
    }
  },
}

export default defineConfig([
  // Main entry
  {
    entry: ['src/index.ts', 'src/styles/index.css'],
    ...commonConfig,
    clean: true,
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
  // Core entry (minimal bundle)
  {
    entry: { core: 'src/core.ts' },
    ...commonConfig,
    clean: false,
  },
  // Utils entry
  {
    entry: { 'utils/index': 'src/utils/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Animations entry
  {
    entry: { 'animations/index': 'src/animations/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Prompt entry
  {
    entry: { 'prompt/index': 'src/prompt/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Analytics entry
  {
    entry: { 'analytics/index': 'src/analytics/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Memory entry
  {
    entry: { 'memory/index': 'src/memory/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Adapters entry
  {
    entry: { 'adapters/index': 'src/adapters/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Test utilities entry
  {
    entry: { 'test-utils': 'src/test-utils.tsx' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
])
