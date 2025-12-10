/**
 * Size Limit Configuration
 *
 * Tracks bundle size to prevent unexpected growth.
 * These are baseline measurements - adjust as the library evolves.
 *
 * Note: Heavy dependencies like framer-motion, react-markdown are included.
 * Consider lazy loading or code splitting for production optimization.
 */

const modifyEsbuildConfig = (config) => {
  // Externalize peer dependencies and optional heavy deps
  config.external = [
    ...(config.external || []),
    // Peer dependencies
    'react',
    'react-dom',
    // Heavy optional dependencies
    'katex',
    'katex/dist/katex.min.css',
    'mermaid',
    'highlight.js',
    'prismjs',
  ]
  // Handle font files
  config.loader = {
    ...config.loader,
    '.woff': 'empty',
    '.woff2': 'empty',
    '.ttf': 'empty',
    '.eot': 'empty',
  }
  return config
}

module.exports = [
  {
    name: 'Full Bundle (ESM)',
    path: 'dist/index.mjs',
    limit: '3.2 MB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: 'Full Bundle (CJS)',
    path: 'dist/index.js',
    limit: '3.5 MB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: 'Core Hooks Only',
    path: 'dist/index.mjs',
    import: '{ useClarityChat, useChat }',
    limit: '3 MB',
    gzip: true,
    modifyEsbuildConfig,
  },
  {
    name: 'Single Component (ChatWindow)',
    path: 'dist/index.mjs',
    import: '{ ChatWindow }',
    limit: '3 MB',
    gzip: true,
    modifyEsbuildConfig,
  },
]
