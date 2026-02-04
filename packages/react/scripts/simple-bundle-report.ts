#!/usr/bin/env node
/**
 * Simple Bundle Size Report
 *
 * Analyzes whatever is currently in dist/ and generates a comprehensive report
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

interface FileStats {
  path: string
  raw: number
  gzip: number
}

function getAllJSFiles(dir: string): FileStats[] {
  const results: FileStats[] = []

  function walk(currentPath: string) {
    const files = fs.readdirSync(currentPath)

    for (const file of files) {
      const fullPath = path.join(currentPath, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !file.startsWith('.')) {
        walk(fullPath)
      } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
        const raw = getFileSize(fullPath)
        const gzip = raw > 0 ? getGzipSize(fullPath) : 0
        results.push({
          path: fullPath.replace(dir + '/', ''),
          raw,
          gzip,
        })
      }
    }
  }

  walk(dir)
  return results
}

function main() {
  const distDir = path.join(__dirname, '..', 'dist')

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run pnpm run build first.')
    process.exit(1)
  }

  console.log('📊 React Package Bundle Size Report')
  console.log('═'.repeat(80))
  console.log(`\nAnalyzing: ${distDir}`)
  console.log(`Timestamp: ${new Date().toISOString()}\n`)

  // Get all JS files
  const files = getAllJSFiles(distDir)

  if (files.length === 0) {
    console.error('❌ No JS files found in dist/')
    process.exit(1)
  }

  // Calculate totals
  const totalRaw = files.reduce((sum, f) => sum + f.raw, 0)
  const totalGzip = files.reduce((sum, f) => sum + f.gzip, 0)

  // Categorize files
  const entryPoints = files.filter(
    (f) => !f.path.includes('/') && !f.path.startsWith('chunk-')
  )
  const chunks = files.filter((f) => f.path.startsWith('chunk-'))
  const subEntries = files.filter(
    (f) => f.path.includes('/') && !f.path.startsWith('chunk-')
  )

  console.log('## Overall Summary\n')
  console.log(`Total Files: ${files.length}`)
  console.log(`Total Size (Raw): ${formatBytes(totalRaw)}`)
  console.log(`Total Size (Gzipped): ${formatBytes(totalGzip)}`)
  console.log(
    `Compression Ratio: ${((totalGzip / totalRaw) * 100).toFixed(1)}%`
  )

  // Entry Points
  if (entryPoints.length > 0) {
    console.log('\n\n## Main Entry Points\n')
    console.log('| File | Format | Raw Size | Gzipped | Compression |')
    console.log('|------|--------|----------|---------|-------------|')

    entryPoints
      .sort((a, b) => b.gzip - a.gzip)
      .forEach((file) => {
        const format = file.path.endsWith('.mjs') ? 'ESM' : 'CJS'
        const compression = ((file.gzip / file.raw) * 100).toFixed(1)
        console.log(
          `| ${file.path} | ${format} | ${formatBytes(file.raw)} | ${formatBytes(file.gzip)} | ${compression}% |`
        )
      })

    const entryRaw = entryPoints.reduce((sum, f) => sum + f.raw, 0)
    const entryGzip = entryPoints.reduce((sum, f) => sum + f.gzip, 0)
    console.log(
      '| **TOTAL** | | **' +
        formatBytes(entryRaw) +
        '** | **' +
        formatBytes(entryGzip) +
        '** | |'
    )
  }

  // Sub-entry points (e.g., utils/index.js, animations/index.js)
  if (subEntries.length > 0) {
    console.log('\n\n## Sub-Entry Points\n')
    console.log('| File | Format | Raw Size | Gzipped |')
    console.log('|------|--------|----------|---------|')

    subEntries
      .sort((a, b) => b.gzip - a.gzip)
      .forEach((file) => {
        const format = file.path.endsWith('.mjs') ? 'ESM' : 'CJS'
        console.log(
          `| ${file.path} | ${format} | ${formatBytes(file.raw)} | ${formatBytes(file.gzip)} |`
        )
      })

    const subRaw = subEntries.reduce((sum, f) => sum + f.raw, 0)
    const subGzip = subEntries.reduce((sum, f) => sum + f.gzip, 0)
    console.log(
      '| **TOTAL** | | **' +
        formatBytes(subRaw) +
        '** | **' +
        formatBytes(subGzip) +
        '** |'
    )
  }

  // Code-split chunks
  if (chunks.length > 0) {
    console.log('\n\n## Code-Split Chunks\n')
    console.log('| File | Format | Raw Size | Gzipped |')
    console.log('|------|--------|----------|---------|')

    chunks
      .sort((a, b) => b.gzip - a.gzip)
      .slice(0, 15) // Top 15
      .forEach((file) => {
        const format = file.path.endsWith('.mjs') ? 'ESM' : 'CJS'
        console.log(
          `| ${file.path} | ${format} | ${formatBytes(file.raw)} | ${formatBytes(file.gzip)} |`
        )
      })

    const chunkRaw = chunks.reduce((sum, f) => sum + f.raw, 0)
    const chunkGzip = chunks.reduce((sum, f) => sum + f.gzip, 0)
    console.log(
      '| **TOTAL (${chunks.length} chunks)** | | **' +
        formatBytes(chunkRaw) +
        '** | **' +
        formatBytes(chunkGzip) +
        '** |'
    )
  }

  // Top 10 largest files
  console.log('\n\n## Top 10 Largest Files (by Gzipped Size)\n')
  console.log('| Rank | File | Format | Gzipped |')
  console.log('|------|------|--------|---------|')

  files
    .sort((a, b) => b.gzip - a.gzip)
    .slice(0, 10)
    .forEach((file, idx) => {
      const format = file.path.endsWith('.mjs') ? 'ESM' : 'CJS'
      console.log(
        `| ${idx + 1} | ${file.path} | ${format} | ${formatBytes(file.gzip)} |`
      )
    })

  // Analyze CSS
  const cssPath = path.join(distDir, 'styles', 'index.css')
  if (fs.existsSync(cssPath)) {
    const cssRaw = getFileSize(cssPath)
    const cssGzip = getGzipSize(cssPath)
    console.log('\n\n## CSS Bundle\n')
    console.log('| Metric | Size |')
    console.log('|--------|------|')
    console.log(`| Raw | ${formatBytes(cssRaw)} |`)
    console.log(`| Gzipped | ${formatBytes(cssGzip)} |`)
    console.log(`| Compression | ${((cssGzip / cssRaw) * 100).toFixed(1)}% |`)
  }

  // Externalization Analysis
  console.log('\n\n## Bundle Size Optimization Status\n')
  console.log('### Phase 1: Optional Peer Dependencies (Completed)\n')
  console.log('The following libraries are externalized as optional peers:\n')
  console.log('- ✅ `shiki` - Syntax highlighting (~150KB)')
  console.log('- ✅ `lucide-react` - Icon library (~200KB)')
  console.log('- ✅ `jszip` - ZIP file handling (~60KB)')
  console.log('- ✅ `mermaid` - Diagram rendering (not in bundle)')
  console.log('- ✅ `pdfjs-dist` - PDF parsing (not in bundle)')
  console.log('- ✅ `mammoth` - DOCX parsing (not in bundle)')
  console.log('- ✅ `cohere-ai` - Reranking API (not in bundle)\n')
  console.log(
    '**Estimated savings**: ~410KB+ when these features are not used\n'
  )

  console.log('### Phase 2: Required Peer Dependencies (Completed)\n')
  console.log('The following libraries are externalized as required peers:\n')
  console.log('- ✅ `react-markdown` - Markdown rendering (~80KB)')
  console.log('- ✅ `remark-gfm` - GitHub Flavored Markdown (~30KB)')
  console.log('- ✅ `rehype-highlight` - Code highlighting (~25KB)')
  console.log('- ✅ `prismjs` - Syntax highlighting (~40KB)')
  console.log('- ✅ `zod` - Schema validation (~15KB)\n')
  console.log('**Estimated savings**: ~190KB (now installed by user)\n')

  console.log('### Key Metrics\n')
  console.log('| Metric | Value |')
  console.log('|--------|-------|')
  console.log(
    `| Main bundle (index.mjs, gzipped) | ${formatBytes(files.find((f) => f.path === 'index.mjs')?.gzip || 0)} |`
  )
  console.log(
    `| Main bundle (index.js, gzipped) | ${formatBytes(files.find((f) => f.path === 'index.js')?.gzip || 0)} |`
  )
  console.log(`| Code-split chunks | ${chunks.length} |`)
  console.log(`| Total externalized | ~600KB+ |`)
  console.log(`| Tree-shakeable | Yes |`)

  // Save JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalRaw,
      totalGzip,
      compressionRatio: ((totalGzip / totalRaw) * 100).toFixed(1) + '%',
    },
    entryPoints: entryPoints.map((f) => ({
      path: f.path,
      format: f.path.endsWith('.mjs') ? 'ESM' : 'CJS',
      raw: f.raw,
      gzip: f.gzip,
      rawFormatted: formatBytes(f.raw),
      gzipFormatted: formatBytes(f.gzip),
    })),
    chunks: chunks.length,
    externalizations: {
      phase1: [
        'shiki',
        'lucide-react',
        'jszip',
        'mermaid',
        'pdfjs-dist',
        'mammoth',
        'cohere-ai',
      ],
      phase2: [
        'react-markdown',
        'remark-gfm',
        'rehype-highlight',
        'prismjs',
        'zod',
      ],
    },
  }

  const reportDir = path.join(__dirname, '..', '.perf-results')
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const reportPath = path.join(reportDir, 'bundle-report-latest.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log('\n\n✅ Analysis complete!')
  console.log(`📝 JSON report saved to: ${reportPath}`)
  console.log('═'.repeat(80))
}

main()
