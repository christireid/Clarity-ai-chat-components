/**
 * Size Limit Configuration
 *
 * Monitors bundle size across all entry points to prevent unexpected growth.
 * Thresholds based on Phase 2 baseline measurements (Jan 2026).
 *
 * Phase 2 Baseline (after peer dependency externalization):
 * - Main bundle: 1180 KB (304 KB gzip) - 73% reduction from Phase 1
 * - Required peers: React, Framer Motion, Lucide, Zod
 * - Optional peers: 12 heavy dependencies (mermaid, pdfjs, mammoth, etc.)
 *
 * Run: pnpm size
 * Why analysis: pnpm size:why
 * JSON output: pnpm size:analyze
 */

const modifyEsbuildConfig = (config) => {
  // Externalize all peer dependencies
  config.external = [
    ...(config.external || []),
    // Required peer dependencies
    'react',
    'react-dom',
    'framer-motion',
    'lucide-react',
    'zod',
    // Optional peer dependencies (heavy libs)
    'flowtoken',
    'mermaid',
    'pdfjs-dist',
    'mammoth',
    'cohere-ai',
    'shiki',
    'jszip',
    'prismjs',
    'react-markdown',
    'remark-gfm',
    'rehype-highlight',
    // CSS dependencies
    'katex/dist/katex.min.css',
    'highlight.js/styles/github-dark.css',
    // Workspace dependencies
    '@clarity-chat/primitives',
    '@clarity-chat/types',
    '@clarity-chat/memory',
    '@clarity-chat/license',
    '@clarity-chat/error-handling',
    '@clarity-chat/token-optimization',
    '@clarity-chat/utils',
    // Core utilities
    'dompurify',
  ]

  // Handle font and asset files
  config.loader = {
    ...config.loader,
    '.woff': 'empty',
    '.woff2': 'empty',
    '.ttf': 'empty',
    '.eot': 'empty',
    '.css': 'empty',
  }

  return config
}

module.exports = [
  // ===== Main Entry Points =====
  {
    name: '📦 Main Bundle (ESM)',
    path: 'dist/index.mjs',
    limit: '1.3 MB', // 10% buffer over Phase 2: 1180 KB
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '📦 Main Bundle (CJS)',
    path: 'dist/index.js',
    limit: '1.4 MB', // Slightly larger due to CJS overhead
    gzip: true,
    modifyEsbuildConfig,
  },

  // ===== Core Entry Points =====
  {
    name: '🎯 Core Bundle (ESM)',
    path: 'dist/core.mjs',
    limit: '400 KB', // Core components only
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🎯 Core Bundle (CJS)',
    path: 'dist/core.js',
    limit: '420 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '⚡ Core Minimal (ESM)',
    path: 'dist/core-minimal.mjs',
    limit: '40 KB', // Ultra-light bundle
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '⚡ Core Minimal (CJS)',
    path: 'dist/core-minimal.js',
    limit: '45 KB',
    gzip: true,
    modifyEsbuildConfig,
  },

  // ===== Specialized Entry Points =====
  {
    name: '📝 Slim Bundle',
    path: 'dist/slim.mjs',
    limit: '250 KB', // Minimal feature set
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🔧 Utils Bundle',
    path: 'dist/utils/index.mjs',
    limit: '150 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🎨 Animations Bundle',
    path: 'dist/animations/index.mjs',
    limit: '80 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '💬 Prompt Bundle',
    path: 'dist/prompt/index.mjs',
    limit: '100 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '📊 Analytics Bundle',
    path: 'dist/analytics/index.mjs',
    limit: '120 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🧠 Memory Bundle',
    path: 'dist/memory/index.mjs',
    limit: '100 KB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🔌 Adapters Bundle',
    path: 'dist/adapters/index.mjs',
    limit: '60 KB',
    gzip: true,
    modifyEsbuildConfig,
  },

  // ===== Tree-Shaking Tests =====
  {
    name: '🌳 Tree-shake: useClarityChat hook',
    path: 'dist/index.mjs',
    import: '{ useClarityChat }',
    limit: '250 KB', // Should tree-shake most components
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🌳 Tree-shake: ChatWindow component',
    path: 'dist/index.mjs',
    import: '{ ChatWindow }',
    limit: '300 KB', // Component + minimal dependencies
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🌳 Tree-shake: ChatMessage component',
    path: 'dist/index.mjs',
    import: '{ ChatMessage }',
    limit: '200 KB', // Message rendering only
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: '🌳 Tree-shake: ChatInput component',
    path: 'dist/index.mjs',
    import: '{ ChatInput }',
    limit: '180 KB', // Input handling only
    gzip: true,
    modifyEsbuildConfig,
  },
]
