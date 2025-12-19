#!/usr/bin/env node
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entries = [
  { name: 'main', entry: 'src/index.ts src/styles/index.css', css: true },
  { name: 'core', entry: 'core=src/core.ts' },
  { name: 'core-minimal', entry: 'core-minimal=src/core-minimal.ts' },
  { name: 'utils', entry: 'utils/index=src/utils/index.ts' },
  { name: 'animations', entry: 'animations/index=src/animations/index.ts' },
  { name: 'prompt', entry: 'prompt/index=src/prompt/index.ts' },
  { name: 'analytics', entry: 'analytics/index=src/analytics/index.ts' },
  { name: 'memory', entry: 'memory/index=src/memory/index.ts' },
  { name: 'adapters', entry: 'adapters/index=src/adapters/index.ts' },
  { name: 'test-utils', entry: 'test-utils=src/test-utils.tsx' },
]

console.log(
  '🏗️  Building @clarity-chat/react sequentially to avoid memory issues...\n'
)

for (let i = 0; i < entries.length; i++) {
  const { name, entry, css } = entries[i]
  const isFirst = i === 0

  console.log(`[${i + 1}/${entries.length}] Building ${name}...`)

  try {
    const loaderFlag = css ? '--loader .css=copy' : ''
    const cleanFlag = isFirst ? '--clean' : ''
    const dtsFlag = '--dts --dts-resolve'

    const cmd = `npx tsup ${entry} --format cjs,esm ${dtsFlag} ${cleanFlag} ${loaderFlag} --no-sourcemap --no-minify --no-splitting --no-treeshake`

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

console.log('✨ All packages built successfully!')
