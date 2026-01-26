#!/usr/bin/env node
/**
 * Quick Bundle Analysis
 *
 * Analyzes the current dist/ directory without rebuilding
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getFileSize(filePath: string): number {
  try {
    return fs.statSync(filePath).size
  } catch {
    return 0
  }
}

function getGzipSize(filePath: string): number {
  try {
    const result = execSync(`gzip -c "${filePath}" | wc -c`, {
      encoding: 'utf8',
    })
    return parseInt(result.trim(), 10)
  } catch {
    return 0
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function analyzeFile(filePath: string): { raw: number; gzip: number } {
  const raw = getFileSize(filePath)
  const gzip = getGzipSize(filePath)
  return { raw, gzip }
}

interface EntryPoint {
  name: string
  esm?: { raw: number; gzip: number }
  cjs?: { raw: number; gzip: number }
}

function main() {
  const distDir = path.join(__dirname, '..', 'dist')

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run pnpm run build first.')
    process.exit(1)
  }

  console.log('📊 Current Bundle Analysis')
  console.log('═'.repeat(80))
  console.log(`\nAnalyzing: ${distDir}\n`)

  // Define entry points
  const entryPoints = [
    'index',
    'core',
    'core-minimal',
    'animations/index',
    'utils/index',
    'prompt/index',
    'analytics/index',
    'memory/index',
    'adapters/index',
    'test-utils',
    'internal',
    'slim',
    'namespaced',
  ]

  const results: EntryPoint[] = []
  let totalRaw = 0
  let totalGzip = 0

  for (const entry of entryPoints) {
    const esmPath = path.join(distDir, `${entry}.js`)
    const cjsPath = path.join(distDir, `${entry}.cjs`)

    const result: EntryPoint = { name: entry }

    if (fs.existsSync(esmPath)) {
      result.esm = analyzeFile(esmPath)
      totalRaw += result.esm.raw
      totalGzip += result.esm.gzip
    }

    if (fs.existsSync(cjsPath)) {
      result.cjs = analyzeFile(cjsPath)
      totalRaw += result.cjs.raw
      totalGzip += result.cjs.gzip
    }

    if (result.esm || result.cjs) {
      results.push(result)
    }
  }

  // Print table
  console.log(
    '| Entry Point | ESM (Raw) | ESM (Gzip) | CJS (Raw) | CJS (Gzip) |'
  )
  console.log(
    '|------------|-----------|------------|-----------|------------|'
  )

  for (const result of results) {
    const esmRaw = result.esm ? formatBytes(result.esm.raw) : '-'
    const esmGzip = result.esm ? formatBytes(result.esm.gzip) : '-'
    const cjsRaw = result.cjs ? formatBytes(result.cjs.raw) : '-'
    const cjsGzip = result.cjs ? formatBytes(result.cjs.gzip) : '-'

    console.log(
      `| ${result.name} | ${esmRaw} | ${esmGzip} | ${cjsRaw} | ${cjsGzip} |`
    )
  }

  console.log(
    '|------------|-----------|------------|-----------|------------|'
  )
  console.log(`| **TOTAL** | | **${formatBytes(totalGzip)}** | | |`)

  console.log('\n\n📈 Summary\n')
  console.log(`Total Raw Size: ${formatBytes(totalRaw)}`)
  console.log(`Total Gzipped: ${formatBytes(totalGzip)}`)
  console.log(
    `Compression Ratio: ${((totalGzip / totalRaw) * 100).toFixed(1)}%`
  )

  // Find largest files
  console.log('\n\n🔝 Top 5 Largest Files (Gzipped)\n')
  const allFiles = results
    .flatMap((r) => [
      r.esm ? { name: `${r.name}.js`, size: r.esm.gzip } : null,
      r.cjs ? { name: `${r.name}.cjs`, size: r.cjs.gzip } : null,
    ])
    .filter(Boolean) as { name: string; size: number }[]

  allFiles
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
    .forEach((file, idx) => {
      console.log(`${idx + 1}. ${file.name}: ${formatBytes(file.size)}`)
    })

  // Analyze CSS
  const cssPath = path.join(distDir, 'styles', 'index.css')
  if (fs.existsSync(cssPath)) {
    const cssStats = analyzeFile(cssPath)
    console.log('\n\n🎨 CSS Bundle\n')
    console.log(`Raw: ${formatBytes(cssStats.raw)}`)
    console.log(`Gzipped: ${formatBytes(cssStats.gzip)}`)
  }

  // Look for any large chunks
  console.log('\n\n📦 Additional Chunks\n')
  const files = fs.readdirSync(distDir)
  const chunks = files.filter(
    (f) => f.startsWith('chunk-') && f.endsWith('.js')
  )

  if (chunks.length > 0) {
    console.log(`Found ${chunks.length} code-split chunks:\n`)
    const chunkStats = chunks
      .map((chunk) => {
        const chunkPath = path.join(distDir, chunk)
        const stats = analyzeFile(chunkPath)
        return { name: chunk, ...stats }
      })
      .sort((a, b) => b.gzip - a.gzip)

    chunkStats.slice(0, 10).forEach((chunk) => {
      console.log(`  ${chunk.name}: ${formatBytes(chunk.gzip)} (gzipped)`)
    })

    const totalChunkGzip = chunkStats.reduce((sum, c) => sum + c.gzip, 0)
    console.log(`\n  Total chunks: ${formatBytes(totalChunkGzip)} (gzipped)`)
  }

  console.log('\n✅ Analysis complete!\n')
}

main()
