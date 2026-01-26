import { defineConfig } from 'tsup'

const commonConfig = {
  format: ['cjs', 'esm'] as const,
  // TypeScript declarations disabled in sandbox due to memory constraints
  // For production: enable with dts: { resolve: true, only: true }
  // Types are validated via 'tsc --noEmit' script
  dts: false,
  external: [
    'react',
    'react-dom',
    'framer-motion',
    '@clarity-chat/primitives',
    '@clarity-chat/types',
    '@clarity-chat/memory',
    '@clarity-chat/license',
    '@clarity-chat/error-handling',
    '@clarity-chat/token-optimization',
    '@clarity-chat/utils',
    'mermaid',
    'highlight.js/styles/github-dark.css',
    'katex/dist/katex.min.css',
    'dompurify',
    // Phase 1 externalizations (optional features - ~410KB savings)
    'shiki',
    'lucide-react',
    'jszip',
  ],
  sourcemap: false,
  minify: true,
  splitting: true,
  treeshake: {
    preset: 'recommended',
    moduleSideEffects: false,
  },
  esbuildOptions(options) {
    options.drop = ['console', 'debugger']
    options.legalComments = 'none'
  },
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
    splitting: true, // Enable code splitting for lazy loads
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
  // Internal entry (advanced users)
  {
    entry: { internal: 'src/internal.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Slim entry (minimal bundle ~200KB)
  {
    entry: { slim: 'src/slim.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
  // Namespaced entry (Clarity.Chat pattern)
  {
    entry: { namespaced: 'src/namespaced.ts' },
    outDir: 'dist',
    ...commonConfig,
    clean: false,
  },
])
