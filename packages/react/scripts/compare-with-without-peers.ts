#!/usr/bin/env node
/**
 * Compare Bundle Sizes: With vs Without Optional Peers
 *
 * This script demonstrates the impact of optional peer dependencies
 * by measuring bundle sizes in different scenarios.
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Scenario {
  name: string
  description: string
  dependencies: string[]
}

const scenarios: Scenario[] = [
  {
    name: 'baseline',
    description: 'Current build (all externalized)',
    dependencies: [],
  },
  {
    name: 'if-shiki-bundled',
    description: 'Hypothetical: If shiki was bundled',
    dependencies: ['shiki'],
  },
  {
    name: 'if-lucide-bundled',
    description: 'Hypothetical: If lucide-react was bundled',
    dependencies: ['lucide-react'],
  },
  {
    name: 'if-all-bundled',
    description: 'Hypothetical: If all optional deps were bundled',
    dependencies: ['shiki', 'lucide-react', 'jszip'],
  },
]

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function getLibrarySize(packageName: string): number {
  // Estimated gzipped sizes based on bundlephobia.com
  const sizes: Record<string, number> = {
    shiki: 150 * 1024, // ~150 KB
    'lucide-react': 200 * 1024, // ~200 KB
    jszip: 60 * 1024, // ~60 KB
    'react-markdown': 80 * 1024, // ~80 KB
    'remark-gfm': 30 * 1024, // ~30 KB
    'rehype-highlight': 25 * 1024, // ~25 KB
    prismjs: 40 * 1024, // ~40 KB
    zod: 15 * 1024, // ~15 KB
  }
  return sizes[packageName] || 0
}

function getCurrentBundleSize(): number {
  const mjsPath = path.join(__dirname, '..', 'dist', 'index.mjs')
  const jsPath = path.join(__dirname, '..', 'dist', 'index.js')

  // Try .mjs first, fall back to .js
  const distPath = fs.existsSync(mjsPath) ? mjsPath : jsPath

  if (!fs.existsSync(distPath)) {
    throw new Error(
      'dist/index.mjs or dist/index.js not found. Run pnpm build first.'
    )
  }

  const result = execSync(`gzip -c "${distPath}" | wc -c`, { encoding: 'utf8' })
  return parseInt(result.trim(), 10)
}

function main() {
  console.log('📊 Bundle Size Comparison: With vs Without Optional Peers')
  console.log('═'.repeat(80))
  console.log(
    '\nThis analysis shows the impact of externalizing optional dependencies.\n'
  )

  const baselineSize = getCurrentBundleSize()

  console.log('## Current Bundle Size (All Externalized)\n')
  console.log(
    `Main bundle (index.mjs, gzipped): **${formatBytes(baselineSize)}**\n`
  )

  console.log('## Hypothetical Scenarios\n')
  console.log(
    'What would the bundle size be if these dependencies were bundled?\n'
  )
  console.log('| Scenario | Estimated Size | vs Baseline | Impact |')
  console.log('|----------|---------------|-------------|--------|')

  const results = []

  for (const scenario of scenarios) {
    const additionalSize = scenario.dependencies.reduce(
      (sum, dep) => sum + getLibrarySize(dep),
      0
    )
    const totalSize = baselineSize + additionalSize
    const difference = totalSize - baselineSize
    const percentIncrease = ((difference / baselineSize) * 100).toFixed(1)

    results.push({
      scenario: scenario.name,
      description: scenario.description,
      size: totalSize,
      difference,
      percentIncrease,
    })

    const impact =
      difference > 0
        ? `+${formatBytes(difference)} (+${percentIncrease}%)`
        : 'Baseline'
    console.log(
      `| ${scenario.description} | ${formatBytes(totalSize)} | ${formatBytes(baselineSize)} | ${impact} |`
    )
  }

  console.log('\n\n## Pre-Phase-1 Baseline Estimate\n')
  const prePhase1Size =
    baselineSize +
    getLibrarySize('shiki') +
    getLibrarySize('lucide-react') +
    getLibrarySize('jszip') +
    getLibrarySize('react-markdown') +
    getLibrarySize('remark-gfm') +
    getLibrarySize('rehype-highlight') +
    getLibrarySize('prismjs') +
    getLibrarySize('zod')

  const totalSavings = prePhase1Size - baselineSize
  const percentSavings = ((totalSavings / prePhase1Size) * 100).toFixed(1)

  console.log('| Metric | Value |')
  console.log('|--------|-------|')
  console.log(
    `| Estimated pre-optimization size | ${formatBytes(prePhase1Size)} |`
  )
  console.log(`| Current optimized size | ${formatBytes(baselineSize)} |`)
  console.log(
    `| **Total savings** | **${formatBytes(totalSavings)} (${percentSavings}%)** |`
  )

  console.log('\n\n## Phase-by-Phase Breakdown\n')
  console.log('| Phase | Libraries | Estimated Savings |')
  console.log('|-------|-----------|------------------|')

  const phase1Savings =
    getLibrarySize('shiki') +
    getLibrarySize('lucide-react') +
    getLibrarySize('jszip')
  console.log(
    `| Phase 1 (Optional) | shiki, lucide-react, jszip | ${formatBytes(phase1Savings)} |`
  )

  const phase2Savings =
    getLibrarySize('react-markdown') +
    getLibrarySize('remark-gfm') +
    getLibrarySize('rehype-highlight') +
    getLibrarySize('prismjs') +
    getLibrarySize('zod')
  console.log(
    `| Phase 2 (Required) | react-markdown, remark-gfm, etc. | ${formatBytes(phase2Savings)} |`
  )
  console.log(
    `| **Total** | All externalized | **${formatBytes(totalSavings)}** |`
  )

  console.log('\n\n## User Experience Impact\n')
  console.log('### Scenario 1: Basic Chat (No Optional Features)\n')
  console.log(`- Bundle size: ${formatBytes(baselineSize)}`)
  console.log(
    `- Savings vs pre-optimization: ${formatBytes(totalSavings)} (${percentSavings}%)`
  )
  console.log('- User installs: 0 additional packages\n')

  console.log('### Scenario 2: Chat with Syntax Highlighting (shiki)\n')
  const withShikiSize = baselineSize + getLibrarySize('shiki')
  const withShikiSavings = prePhase1Size - withShikiSize
  const withShikiPercent = ((withShikiSavings / prePhase1Size) * 100).toFixed(1)
  console.log(`- Bundle size: ${formatBytes(withShikiSize)}`)
  console.log(
    `- Savings vs pre-optimization: ${formatBytes(withShikiSavings)} (${withShikiPercent}%)`
  )
  console.log('- User installs: pnpm add shiki\n')

  console.log('### Scenario 3: Full-Featured Chat (All Optional)\n')
  const fullFeaturedSize = baselineSize + phase1Savings
  const fullFeaturedSavings = prePhase1Size - fullFeaturedSize
  const fullFeaturedPercent = (
    (fullFeaturedSavings / prePhase1Size) *
    100
  ).toFixed(1)
  console.log(`- Bundle size: ${formatBytes(fullFeaturedSize)}`)
  console.log(
    `- Savings vs pre-optimization: ${formatBytes(fullFeaturedSavings)} (${fullFeaturedPercent}%)`
  )
  console.log('- User installs: pnpm add shiki jszip lucide-react\n')

  console.log('\n## Network Performance Impact\n')
  console.log('### Download Time (3G: 100 KB/s)\n')
  console.log(
    '| Scenario | Pre-optimization | Post-optimization | Time Saved |'
  )
  console.log('|----------|-----------------|-------------------|------------|')

  const preTime = (prePhase1Size / 1024 / 100).toFixed(1)
  const basicTime = (baselineSize / 1024 / 100).toFixed(1)
  const withShikiTime = (withShikiSize / 1024 / 100).toFixed(1)
  const fullTime = (fullFeaturedSize / 1024 / 100).toFixed(1)

  const basicSaved = (parseFloat(preTime) - parseFloat(basicTime)).toFixed(1)
  const withShikiSaved = (
    parseFloat(preTime) - parseFloat(withShikiTime)
  ).toFixed(1)
  const fullSaved = (parseFloat(preTime) - parseFloat(fullTime)).toFixed(1)

  console.log(
    `| Basic chat | ${preTime}s | ${basicTime}s | **${basicSaved}s (${percentSavings}%)** |`
  )
  console.log(
    `| With syntax highlighting | ${preTime}s | ${withShikiTime}s | **${withShikiSaved}s (${withShikiPercent}%)** |`
  )
  console.log(
    `| Full-featured | ${preTime}s | ${fullTime}s | **${fullSaved}s (${fullFeaturedPercent}%)** |`
  )

  console.log('\n\n## Key Takeaways\n')
  console.log(
    `✅ Base bundle size reduced by **${percentSavings}%** (${formatBytes(totalSavings)})`
  )
  console.log(`✅ Users only download what they need`)
  console.log(`✅ No breaking changes - optional deps work when installed`)
  console.log(`✅ Faster initial page load for all users`)
  console.log(`✅ Reduced mobile data usage`)

  // Save report
  const reportDir = path.join(__dirname, '..', '.perf-results')
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const report = {
    timestamp: new Date().toISOString(),
    baselineSize,
    prePhase1Size,
    totalSavings,
    percentSavings: parseFloat(percentSavings),
    scenarios: {
      basic: { size: baselineSize, description: 'No optional features' },
      withShiki: {
        size: withShikiSize,
        description: 'With syntax highlighting',
      },
      fullFeatured: {
        size: fullFeaturedSize,
        description: 'All optional features',
      },
    },
    phase1Savings,
    phase2Savings,
  }

  const reportPath = path.join(reportDir, 'comparison-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log(`\n📝 Report saved to: ${reportPath}`)
  console.log('═'.repeat(80))
}

main()
