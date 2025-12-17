import { defineConfig } from 'tsup'

const commonConfig = {
  format: ['cjs', 'esm'] as const,
  // TypeScript declarations ENABLED for production
  // Generates proper .d.ts files for all 249 components and 99 hooks
  dts: {
    resolve: true,
    only: true,
    entry: {
      'src/index.ts': 'dist/index.d.ts',
      'src/core.ts': 'dist/core.d.ts',
      'src/core-minimal.ts': 'dist/core-minimal.d.ts',
      'src/utils/index.ts': 'dist/utils/index.d.ts',
      'src/animations/index.ts': 'dist/animations/index.d.ts',
      'src/prompt/index.ts': 'dist/prompt/index.d.ts',
      'src/analytics/index.ts': 'dist/analytics/index.d.ts',
      'src/memory/index.ts': 'dist/memory/index.d.ts',
      'src/adapters/index.ts': 'dist/adapters/index.d.ts',
      'src/test-utils.tsx': 'dist/test-utils.d.ts',
    }
  },
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
  sourcemap: true, // Enable sourcemaps for production debugging
  minify: true, // Enable minification for production
  splitting: true, // Enable code splitting for better tree shaking
  treeshake: true, // Enable tree shaking for smaller bundles
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
  // Core minimal entry (ultra-light ~30KB)
  {
    entry: { 'core-minimal': 'src/core-minimal.ts' },
    ...commonConfig,
    clean: false,
    splitting: true,
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