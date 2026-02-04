/**
 * Check bundle size thresholds
 * Use in CI to fail builds if bundles exceed limits
 */
const fs = require('fs')
const path = require('path')

const reportPath = path.join(__dirname, 'tree-shaking-report.json')

if (!fs.existsSync(reportPath)) {
  console.error('❌ No report found. Run tests first.')
  process.exit(1)
}

const results = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

// Define thresholds (in bytes, gzipped)
const thresholds = {
  minimal: 5 * 1024, // 5 KB
  'single-component': 50 * 1024, // 50 KB
  'multiple-components': 100 * 1024, // 100 KB
  'hooks-only': 30 * 1024, // 30 KB
  'utilities-only': 10 * 1024, // 10 KB
  'external-deps': 50 * 1024, // 50 KB
  'full-import': 500 * 1024, // 500 KB (warning only)
}

let failed = false

console.log('🎯 Checking Bundle Size Thresholds\n')

results.forEach((result) => {
  const threshold = thresholds[result.test]
  if (!threshold) return

  const size = result.rollup.gzip
  const limit = threshold
  const percentage = ((size / limit) * 100).toFixed(1)

  const status = size <= limit ? '✅' : '❌'
  console.log(
    `${status} ${result.test.padEnd(25)} ${formatBytes(size).padStart(10)} / ${formatBytes(limit).padStart(10)} (${percentage}%)`
  )

  if (size > limit && result.test !== 'full-import') {
    failed = true
    console.log(`   ⚠️  Exceeds threshold by ${formatBytes(size - limit)}`)
  }
})

// Check tree-shaking effectiveness
const fullImport = results.find((r) => r.test === 'full-import')
const minimal = results.find((r) => r.test === 'minimal')

if (fullImport && minimal) {
  const ratio = minimal.rollup.gzip / fullImport.rollup.gzip
  const percentage = (ratio * 100).toFixed(1)

  console.log(`\n📊 Tree-shaking Effectiveness: ${percentage}%`)

  if (ratio > 0.3) {
    // Minimal should be < 30% of full
    console.log(
      '❌ Poor tree-shaking: Minimal bundle is too large relative to full import'
    )
    failed = true
  } else {
    console.log('✅ Good tree-shaking effectiveness')
  }
}

// Check for unexpected content
console.log('\n🔍 Content Analysis:')

results.forEach((result) => {
  if (!result.analysis) return

  const warnings = []

  if (result.test === 'utilities-only' && result.analysis.hasReact) {
    warnings.push('Contains React code')
  }

  if (result.test === 'minimal' && result.analysis.hasThemeSystem) {
    warnings.push('Contains theme system')
  }

  if (result.test === 'hooks-only' && result.analysis.hasDashboard) {
    warnings.push('Contains dashboard code')
  }

  if (warnings.length > 0) {
    console.log(`❌ ${result.test}: ${warnings.join(', ')}`)
    failed = true
  }
})

if (failed) {
  console.log('\n❌ Bundle size checks FAILED')
  console.log('Some bundles exceed thresholds or contain unexpected code.')
  process.exit(1)
} else {
  console.log('\n✅ All bundle size checks PASSED')
  process.exit(0)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
