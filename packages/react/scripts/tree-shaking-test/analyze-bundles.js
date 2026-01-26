/**
 * Analyze bundle sizes and tree-shaking effectiveness
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const distDir = path.join(__dirname, 'dist')

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

/**
 * Get gzipped size
 */
function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath)
    const gzipped = zlib.gzipSync(content, { level: 9 })
    return gzipped.length
  } catch {
    return 0
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Calculate percentage reduction
 */
function calcReduction(original, optimized) {
  if (original === 0) return 0
  return ((1 - optimized / original) * 100).toFixed(1)
}

/**
 * Check if bundle contains specific code patterns
 */
function analyzeContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    return {
      hasReact: content.includes('react') || content.includes('React'),
      hasThemeSystem: content.includes('theme') || content.includes('Theme'),
      hasDashboard:
        content.includes('Dashboard') || content.includes('dashboard'),
      hasCodeBlock:
        content.includes('CodeBlock') || content.includes('codeBlock'),
      hasMarkdown: content.includes('markdown') || content.includes('Markdown'),
      hasAnimation:
        content.includes('framer-motion') || content.includes('animate'),
      hasLucide: content.includes('lucide-react'),
      estimatedComponents: (content.match(/function [A-Z]\w+\(/g) || []).length,
      size: content.length,
    }
  } catch {
    return null
  }
}

/**
 * Analyze all bundles
 */
function analyzeBundles() {
  console.log('\n🔍 Tree-shaking Analysis Results')
  console.log('=================================\n')

  const testApps = [
    'minimal',
    'single-component',
    'multiple-components',
    'hooks-only',
    'utilities-only',
    'external-deps',
    'full-import',
  ]

  const results = []

  testApps.forEach((testName) => {
    console.log(`\n📊 ${testName.toUpperCase()}`)
    console.log('-'.repeat(50))

    const rollupFile = path.join(distDir, `rollup-${testName}.js`)
    const esbuildFile = path.join(distDir, `esbuild-${testName}.js`)
    const noTreeshakeFile = path.join(distDir, `no-treeshake-${testName}.js`)

    const rollupSize = getFileSize(rollupFile)
    const rollupGzip = getGzipSize(rollupFile)
    const esbuildSize = getFileSize(esbuildFile)
    const esbuildGzip = getGzipSize(esbuildFile)
    const baselineSize = getFileSize(noTreeshakeFile)
    const baselineGzip = getGzipSize(noTreeshakeFile)

    if (rollupSize > 0) {
      console.log(
        `  Rollup (minified):  ${formatBytes(rollupSize).padStart(10)}`
      )
      console.log(
        `  Rollup (gzip):      ${formatBytes(rollupGzip).padStart(10)}`
      )
    }

    if (esbuildSize > 0) {
      console.log(
        `  esbuild (minified): ${formatBytes(esbuildSize).padStart(10)}`
      )
      console.log(
        `  esbuild (gzip):     ${formatBytes(esbuildGzip).padStart(10)}`
      )
    }

    if (baselineSize > 0) {
      console.log(
        `  No tree-shake:      ${formatBytes(baselineSize).padStart(10)}`
      )
      console.log(
        `  Reduction:          ${calcReduction(baselineSize, rollupSize)}%`
      )
    }

    // Content analysis
    const analysis = analyzeContent(rollupFile)
    if (analysis) {
      console.log('\n  Content Analysis:')
      console.log(`    - React code:      ${analysis.hasReact ? '✓' : '✗'}`)
      console.log(
        `    - Theme system:    ${analysis.hasThemeSystem ? '✓' : '✗'}`
      )
      console.log(`    - Dashboards:      ${analysis.hasDashboard ? '✓' : '✗'}`)
      console.log(`    - CodeBlock:       ${analysis.hasCodeBlock ? '✓' : '✗'}`)
      console.log(`    - Markdown:        ${analysis.hasMarkdown ? '✓' : '✗'}`)
      console.log(`    - Animations:      ${analysis.hasAnimation ? '✓' : '✗'}`)
      console.log(`    - Lucide icons:    ${analysis.hasLucide ? '✓' : '✗'}`)
    }

    results.push({
      test: testName,
      rollup: { size: rollupSize, gzip: rollupGzip },
      esbuild: { size: esbuildSize, gzip: esbuildGzip },
      baseline: { size: baselineSize, gzip: baselineGzip },
      analysis,
    })
  })

  // Summary report
  console.log('\n\n📈 SUMMARY REPORT')
  console.log('='.repeat(80))
  console.log(
    '\n' +
      'Test'.padEnd(25) +
      'Rollup (gzip)'.padStart(15) +
      'esbuild (gzip)'.padStart(15) +
      'Reduction'.padStart(12)
  )
  console.log('-'.repeat(80))

  results.forEach((r) => {
    const reduction = calcReduction(r.baseline.size, r.rollup.size)
    console.log(
      r.test.padEnd(25) +
        formatBytes(r.rollup.gzip).padStart(15) +
        formatBytes(r.esbuild.gzip).padStart(15) +
        `${reduction}%`.padStart(12)
    )
  })

  // Tree-shaking effectiveness analysis
  console.log('\n\n🌳 TREE-SHAKING EFFECTIVENESS')
  console.log('='.repeat(80))

  const fullImport = results.find((r) => r.test === 'full-import')
  const minimal = results.find((r) => r.test === 'minimal')

  if (fullImport && minimal) {
    const ratio = (
      (minimal.rollup.gzip / fullImport.rollup.gzip) *
      100
    ).toFixed(1)
    console.log(`\nMinimal bundle is ${ratio}% the size of full import`)
    console.log(
      `Tree-shaking eliminated ${(100 - ratio).toFixed(1)}% of unused code`
    )
    console.log(`\nSize comparison:`)
    console.log(`  Full import:  ${formatBytes(fullImport.rollup.gzip)} (gzip)`)
    console.log(`  Minimal:      ${formatBytes(minimal.rollup.gzip)} (gzip)`)
    console.log(
      `  Savings:      ${formatBytes(fullImport.rollup.gzip - minimal.rollup.gzip)} (gzip)`
    )
  }

  // Recommendations
  console.log('\n\n💡 RECOMMENDATIONS')
  console.log('='.repeat(80))

  results.forEach((r) => {
    if (r.test === 'utilities-only' && r.analysis?.hasReact) {
      console.log(
        `⚠️  ${r.test}: Contains React code despite being utilities-only`
      )
    }
    if (r.test === 'minimal' && r.rollup.gzip > 5000) {
      console.log(
        `⚠️  ${r.test}: Bundle larger than expected (${formatBytes(r.rollup.gzip)})`
      )
    }
    if (
      r.baseline.size > 0 &&
      calcReduction(r.baseline.size, r.rollup.size) < 30
    ) {
      console.log(
        `⚠️  ${r.test}: Low tree-shaking effectiveness (${calcReduction(r.baseline.size, r.rollup.size)}% reduction)`
      )
    }
  })

  // Export results to JSON
  const reportPath = path.join(__dirname, 'tree-shaking-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`\n\n📄 Full report saved to: ${reportPath}`)

  // Generate markdown report
  generateMarkdownReport(results)
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  const lines = [
    '# Tree-shaking Effectiveness Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Bundle Size Comparison',
    '',
    '| Test Case | Rollup (min) | Rollup (gzip) | esbuild (min) | esbuild (gzip) | Reduction |',
    '|-----------|--------------|---------------|---------------|----------------|-----------|',
  ]

  results.forEach((r) => {
    const reduction = calcReduction(r.baseline.size, r.rollup.size)
    lines.push(
      `| ${r.test} | ${formatBytes(r.rollup.size)} | ${formatBytes(r.rollup.gzip)} | ` +
        `${formatBytes(r.esbuild.size)} | ${formatBytes(r.esbuild.gzip)} | ${reduction}% |`
    )
  })

  lines.push('', '## Test Case Descriptions', '')

  const descriptions = {
    minimal: 'Single utility function import (no React)',
    'single-component': 'One React component import',
    'multiple-components': 'Three related components',
    'hooks-only': 'Custom hooks without UI components',
    'utilities-only': 'Utility functions only (no React)',
    'external-deps': 'Test peer dependency externalization',
    'full-import': 'Import everything (worst case baseline)',
  }

  Object.entries(descriptions).forEach(([test, desc]) => {
    lines.push(`### ${test}`)
    lines.push(`${desc}`)
    lines.push('')
  })

  // Tree-shaking effectiveness
  const fullImport = results.find((r) => r.test === 'full-import')
  const minimal = results.find((r) => r.test === 'minimal')

  if (fullImport && minimal) {
    lines.push('## Tree-shaking Effectiveness', '')
    const ratio = (
      (minimal.rollup.gzip / fullImport.rollup.gzip) *
      100
    ).toFixed(1)
    lines.push(`- Minimal bundle is **${ratio}%** the size of full import`)
    lines.push(
      `- Tree-shaking eliminated **${(100 - ratio).toFixed(1)}%** of unused code`
    )
    lines.push('')
    lines.push('### Size Comparison', '')
    lines.push(`- Full import: ${formatBytes(fullImport.rollup.gzip)} (gzip)`)
    lines.push(`- Minimal: ${formatBytes(minimal.rollup.gzip)} (gzip)`)
    lines.push(
      `- **Savings: ${formatBytes(fullImport.rollup.gzip - minimal.rollup.gzip)}** (gzip)`
    )
  }

  // Content analysis
  lines.push('', '## Content Analysis', '')
  lines.push(
    '| Test | React | Theme | Dashboard | CodeBlock | Markdown | Animations |'
  )
  lines.push(
    '|------|-------|-------|-----------|-----------|----------|------------|'
  )

  results.forEach((r) => {
    if (r.analysis) {
      lines.push(
        `| ${r.test} | ${r.analysis.hasReact ? '✓' : '✗'} | ` +
          `${r.analysis.hasThemeSystem ? '✓' : '✗'} | ${r.analysis.hasDashboard ? '✓' : '✗'} | ` +
          `${r.analysis.hasCodeBlock ? '✓' : '✗'} | ${r.analysis.hasMarkdown ? '✓' : '✗'} | ` +
          `${r.analysis.hasAnimation ? '✓' : '✗'} |`
      )
    }
  })

  lines.push('', '## Key Findings', '')

  // Generate findings
  const singleComponent = results.find((r) => r.test === 'single-component')
  const multipleComponents = results.find(
    (r) => r.test === 'multiple-components'
  )
  const hooksOnly = results.find((r) => r.test === 'hooks-only')
  const utilitiesOnly = results.find((r) => r.test === 'utilities-only')

  if (singleComponent) {
    lines.push(
      `1. **Single component import**: ${formatBytes(singleComponent.rollup.gzip)} (gzip)`
    )
  }
  if (multipleComponents && singleComponent) {
    const increase = (
      (multipleComponents.rollup.gzip / singleComponent.rollup.gzip - 1) *
      100
    ).toFixed(1)
    lines.push(
      `2. **Multiple components**: ${increase}% larger than single component`
    )
  }
  if (hooksOnly) {
    lines.push(
      `3. **Hooks only**: ${formatBytes(hooksOnly.rollup.gzip)} (gzip) - ${hooksOnly.analysis?.hasReact ? 'includes' : 'excludes'} React`
    )
  }
  if (utilitiesOnly) {
    lines.push(
      `4. **Utilities only**: ${formatBytes(utilitiesOnly.rollup.gzip)} (gzip) - smallest bundle`
    )
  }

  lines.push('', '## Recommendations', '')
  lines.push(
    '1. ✅ Always use named imports: `import { Component } from "@clarity-ai/react"`'
  )
  lines.push(
    '2. ✅ Avoid namespace imports: `import * as Clarity from "@clarity-ai/react"`'
  )
  lines.push('3. ✅ Import utilities from dedicated paths when available')
  lines.push('4. ✅ Ensure bundler supports ESM and has tree-shaking enabled')
  lines.push('5. ✅ Keep React and other peer dependencies as externals')

  const reportPath = path.join(__dirname, 'TREE-SHAKING-REPORT.md')
  fs.writeFileSync(reportPath, lines.join('\n'))
  console.log(`📄 Markdown report saved to: ${reportPath}`)
}

// Run analysis
if (!fs.existsSync(distDir)) {
  console.error('❌ No dist directory found. Run build-all-tests.js first.')
  process.exit(1)
}

analyzeBundles()
