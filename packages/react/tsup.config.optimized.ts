import { defineConfig } from 'tsup'
import { dependencies, peerDependencies } from './package.json'

/**
 * Optimized Build Configuration for Bundle Size Reduction
 * Addresses the 2-5MB+ bundle size issue by implementing proper tree shaking
 */

const external = [
  'react',
  'react-dom',
  'framer-motion',
  '@clarity-chat/primitives',
  '@clarity-chat/types',
  '@clarity-chat/memory',
  'mermaid',
  'highlight.js/styles/github-dark.css',
  'katex/dist/katex.min.css',
  // Additional heavy dependencies for tree shaking
  'shiki',
  'prismjs',
  'mermaid',
  'react-virtualized-auto-sizer',
  'react-window',
  'jszip',
  'katex',
  'framer-motion',
]

const commonConfig = {
  format: ['cjs', 'esm'] as const,
  // Enable TypeScript declarations for proper tree shaking
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
    },
  },
  external,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
  clean: true,
  // Optimize for tree shaking
  platform: 'browser',
  target: 'es2020',
  // Bundle size optimization
  bundle: false, // Don't bundle dependencies
  skipNodeModulesBundle: true,
  // Tree shaking optimization
  keepNames: false,
  // Code splitting for better caching
  outExtension({ format }: { format: string }) {
    return {
      js: `.${format === 'cjs' ? 'js' : 'mjs'}`,
    }
  },
}

export default defineConfig([
  // Main entry - Full featured bundle
  {
    entry: ['src/index.ts', 'src/styles/index.css'],
    ...commonConfig,
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
  // Core entry - Medium bundle (~150KB)
  {
    entry: { core: 'src/core.ts' },
    ...commonConfig,
    clean: false,
    // Optimize core bundle
    external: [
      ...external,
      'react-markdown',
      'rehype-highlight',
      'rehype-katex',
      'rehype-raw',
    ],
  },
  // Core minimal entry - Ultra-light (~30KB actual)
  {
    entry: { 'core-minimal': 'src/core-minimal.ts' },
    ...commonConfig,
    clean: false,
    splitting: true,
    // Minimal external dependencies
    external: [
      'react',
      'react-dom',
      'framer-motion',
      '@clarity-chat/primitives',
      '@clarity-chat/types',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
    // Tree shake aggressively
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
    },
    // Optimize for size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    },
  },
  // Utils entry - Tree-shakeable utilities
  {
    entry: { 'utils/index': 'src/utils/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    // Optimize for tree shaking
    treeshake: true,
    splitting: false, // Don't split utilities
  },
  // Animations entry - Optional animations
  {
    entry: { 'animations/index': 'src/animations/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    external: [...external, 'framer-motion'], // Make framer-motion optional
  },
  // Prompt entry - Optional prompt features
  {
    entry: { 'prompt/index': 'src/prompt/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    external: [...external, 'js-tiktoken'], // Make token counting optional
  },
  // Analytics entry - Optional analytics
  {
    entry: { 'analytics/index': 'src/analytics/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    external: [...external, 'js-tiktoken'], // Analytics dependencies
  },
  // Memory entry - Optional memory features
  {
    entry: { 'memory/index': 'src/memory/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    external: [...external, '@clarity-chat/memory'], // Make memory optional
  },
  // Adapters entry - Optional adapters
  {
    entry: { 'adapters/index': 'src/adapters/index.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    external: [...external, 'js-tiktoken'], // Token counting for adapters
  },
  // Test utilities entry - Development only
  {
    entry: { 'test-utils': 'src/test-utils.tsx' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
    // Don't minify test utils for better debugging
    minify: false,
  },
])
