#!/usr/bin/env node
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// External dependencies (same as tsup.config.ts)
const externals = [
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
  // Phase 2 externalizations (required features - ~175KB savings)
  'react-markdown',
  'remark-gfm',
  'rehype-highlight',
  'prismjs',
  'zod',
]

const entries = [
  { name: 'main', entry: 'src/index.ts src/styles/index.css', css: true },
  { name: 'extended', entry: 'src/extended.ts' },
  { name: 'advanced', entry: 'src/advanced.ts' },
  { name: 'core-minimal', entry: 'src/core-minimal.ts' },
  { name: 'utils', entry: 'src/utils/index.ts', outDir: 'dist/utils' },
  { name: 'animations', entry: 'src/animations/index.ts', outDir: 'dist/animations' },
  { name: 'prompt', entry: 'src/prompt/index.ts', outDir: 'dist/prompt' },
  { name: 'analytics', entry: 'src/analytics/index.ts', outDir: 'dist/analytics' },
  { name: 'memory', entry: 'src/memory/index.ts', outDir: 'dist/memory' },
  { name: 'adapters', entry: 'src/adapters/index.ts', outDir: 'dist/adapters' },
  { name: 'test-utils', entry: 'src/test-utils.tsx' },
  { name: 'internal', entry: 'src/internal.ts' },
  { name: 'slim', entry: 'src/slim.ts' },
  { name: 'namespaced', entry: 'src/namespaced.ts' },
]

console.log(
  '🏗️  Building @clarity-chat/react sequentially to avoid memory issues...\n'
)

for (let i = 0; i < entries.length; i++) {
  const { name, entry, css, outDir } = entries[i]
  const isFirst = i === 0

  console.log(`[${i + 1}/${entries.length}] Building ${name}...`)

  try {
    const loaderFlag = css ? '--loader .css=copy' : ''
    const cleanFlag = isFirst ? '--clean' : ''
    // DTS generation disabled - causes memory exhaustion (~275-335s per entry)
    // Types validated via separate 'pnpm typecheck' script
    // const dtsFlag = '--dts'
    const outDirFlag = outDir ? `--out-dir ${outDir}` : ''
    const externalFlag = externals.map(e => `--external ${e}`).join(' ')

    // Build without config file to avoid conflicts with multi-entry config array
    const cmd = `npx tsup ${entry} --format cjs,esm ${cleanFlag} ${loaderFlag} ${outDirFlag} ${externalFlag} --no-sourcemap --no-config --minify --splitting --treeshake`

    execSync(cmd, {
      cwd: resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=2048',
      },
    })

    console.log(`✓ ${name} built successfully\n`)
  } catch (error) {
    console.error(`✗ Failed to build ${name}`)
    process.exit(1)
  }
}

// Ensure CSS is copied to dist/styles/ and dist/theme/ (tsup loader may not work consistently)
console.log('📦 Copying CSS files to dist/styles/ and dist/theme/...')
try {
  execSync('mkdir -p dist/styles && cp src/styles/*.css dist/styles/ && mkdir -p dist/theme && cp src/theme/*.css dist/theme/', {
    cwd: resolve(__dirname, '..'),
    stdio: 'inherit',
  })
  console.log('✓ CSS files copied successfully\n')
} catch (error) {
  console.error('✗ Failed to copy CSS files')
  process.exit(1)
}

console.log('✨ All packages built successfully!')
