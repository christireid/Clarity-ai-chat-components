#!/usr/bin/env node

/**
 * Bundle Size Checker
 *
 * Reports the size of the built bundle and warns if it exceeds thresholds.
 * Used in CI to prevent bundle bloat.
 */

import { readFileSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

// Size thresholds in bytes
const THRESHOLDS = {
  esm: {
    raw: 50 * 1024, // 50KB
    gzip: 15 * 1024, // 15KB
  },
  cjs: {
    raw: 55 * 1024, // 55KB
    gzip: 16 * 1024, // 16KB
  },
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  return `${kb.toFixed(2)} KB`
}

function getFileSize(filePath) {
  if (!existsSync(filePath)) {
    return null
  }
  const content = readFileSync(filePath)
  const gzipped = gzipSync(content)
  return {
    raw: content.length,
    gzip: gzipped.length,
  }
}

function checkSize(name, sizes, thresholds) {
  const results = {
    name,
    raw: sizes.raw,
    gzip: sizes.gzip,
    rawOk: sizes.raw <= thresholds.raw,
    gzipOk: sizes.gzip <= thresholds.gzip,
  }
  return results
}

function printResults(results, verbose = false) {
  console.log('\n📦 Bundle Size Report')
  console.log('═'.repeat(50))

  let hasWarnings = false

  for (const result of results) {
    const rawStatus = result.rawOk ? '✓' : '⚠'
    const gzipStatus = result.gzipOk ? '✓' : '⚠'

    console.log(`\n${result.name}:`)
    console.log(`  ${rawStatus} Raw:  ${formatBytes(result.raw)}`)
    console.log(`  ${gzipStatus} Gzip: ${formatBytes(result.gzip)}`)

    if (!result.rawOk || !result.gzipOk) {
      hasWarnings = true
    }
  }

  console.log('\n' + '═'.repeat(50))

  if (hasWarnings) {
    console.log('⚠️  Some bundles exceed size thresholds!')
    console.log('   Consider reviewing recent changes for bundle bloat.')
  } else {
    console.log('✅ All bundles within size limits.')
  }

  // Calculate totals
  const totalRaw = results.reduce((sum, r) => sum + r.raw, 0)
  const totalGzip = results.reduce((sum, r) => sum + r.gzip, 0)

  console.log(`\n📊 Total: ${formatBytes(totalRaw)} (${formatBytes(totalGzip)} gzipped)`)
  console.log('')

  return hasWarnings
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    bundles: results.map((r) => ({
      name: r.name,
      raw: r.raw,
      gzip: r.gzip,
      rawFormatted: formatBytes(r.raw),
      gzipFormatted: formatBytes(r.gzip),
    })),
    total: {
      raw: results.reduce((sum, r) => sum + r.raw, 0),
      gzip: results.reduce((sum, r) => sum + r.gzip, 0),
    },
  }

  const reportPath = join(__dirname, '..', 'size-report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📝 Report written to ${reportPath}`)

  return report
}

function main() {
  const args = process.argv.slice(2)
  const shouldReport = args.includes('--report')
  const failOnExceed = args.includes('--fail-on-exceed')

  const files = [
    { name: 'ESM Bundle', path: join(distDir, 'index.js'), thresholds: THRESHOLDS.esm },
    { name: 'CJS Bundle', path: join(distDir, 'index.cjs'), thresholds: THRESHOLDS.cjs },
  ]

  const results = []

  for (const file of files) {
    const sizes = getFileSize(file.path)
    if (sizes) {
      results.push(checkSize(file.name, sizes, file.thresholds))
    } else {
      console.error(`❌ File not found: ${file.path}`)
      console.error('   Run "npm run build" first.')
      process.exit(1)
    }
  }

  const hasWarnings = printResults(results)

  if (shouldReport) {
    generateReport(results)
  }

  if (failOnExceed && hasWarnings) {
    process.exit(1)
  }
}

main()
