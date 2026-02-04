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

module.exports = [
  // ===== Main Entry Points =====
  {
    name: '📦 Main Bundle (ESM)',
    path: 'dist/index.mjs',
    limit: '350 KB', // 10% buffer over Phase 2: 304 KB gzip
    gzip: true,
    webpack: false,
  },
  {
    name: '📦 Main Bundle (CJS)',
    path: 'dist/index.js',
    limit: '1.4 MB', // Raw size
    gzip: false,
    webpack: false,
  },

  // ===== Core Entry Points =====
  {
    name: '🎯 Core Bundle (ESM)',
    path: 'dist/core.mjs',
    limit: '150 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '⚡ Core Minimal (ESM)',
    path: 'dist/core-minimal.mjs',
    limit: '40 KB',
    gzip: true,
    webpack: false,
  },

  // ===== Specialized Entry Points =====
  {
    name: '📝 Slim Bundle',
    path: 'dist/slim.mjs',
    limit: '100 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '🔧 Utils Bundle',
    path: 'dist/utils/index.mjs',
    limit: '80 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '🎨 Animations Bundle',
    path: 'dist/animations/index.mjs',
    limit: '50 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '💬 Prompt Bundle',
    path: 'dist/prompt/index.mjs',
    limit: '60 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '📊 Analytics Bundle',
    path: 'dist/analytics/index.mjs',
    limit: '80 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '🧠 Memory Bundle',
    path: 'dist/memory/index.mjs',
    limit: '60 KB',
    gzip: true,
    webpack: false,
  },
  {
    name: '🔌 Adapters Bundle',
    path: 'dist/adapters/index.mjs',
    limit: '50 KB',
    gzip: true,
    webpack: false,
  },
]
