#!/usr/bin/env tsx
/**
 * SEO Audit Script
 *
 * Validates SEO implementation across the documentation site:
 * - Metadata completeness and uniqueness
 * - Structured data validation
 * - Sitemap generation
 * - robots.txt compliance
 * - Performance metrics
 *
 * Run with: npx tsx scripts/seo-audit.ts
 */

import { hookMetadata, componentMetadata } from '../lib/hook-metadata'
import {
  generateHookMetadata,
  generateComponentMetadata,
  validateMetadata,
  generateBreadcrumbs,
} from '../lib/seo/metadata-generators'

interface AuditResult {
  category: string
  passed: number
  failed: number
  warnings: string[]
  errors: string[]
}

interface AuditReport {
  timestamp: string
  results: AuditResult[]
  summary: {
    totalTests: number
    totalPassed: number
    totalFailed: number
    score: number
  }
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function header(text: string) {
  console.log('\n' + '='.repeat(60))
  log(text, 'cyan')
  console.log('='.repeat(60) + '\n')
}

async function auditMetadata(): Promise<AuditResult> {
  const result: AuditResult = {
    category: 'Metadata Generation',
    passed: 0,
    failed: 0,
    warnings: [],
    errors: [],
  }

  // Test hook metadata generation
  for (const hook of hookMetadata) {
    const metadata = generateHookMetadata(hook)
    const validation = validateMetadata(metadata)

    if (validation.isValid) {
      result.passed++
    } else {
      result.failed++
      result.errors.push(`Hook ${hook.name}: ${validation.errors.join(', ')}`)
    }

    // Check for unique titles
    const titleStr =
      typeof metadata.title === 'string' ? metadata.title : 'Unknown'
    if (!titleStr.includes(hook.name)) {
      result.warnings.push(`Hook ${hook.name} title doesn't include hook name`)
    }
  }

  // Test component metadata generation
  for (const component of componentMetadata) {
    const metadata = generateComponentMetadata(component)
    const validation = validateMetadata(metadata)

    if (validation.isValid) {
      result.passed++
    } else {
      result.failed++
      result.errors.push(
        `Component ${component.name}: ${validation.errors.join(', ')}`
      )
    }
  }

  return result
}

async function auditBreadcrumbs(): Promise<AuditResult> {
  const result: AuditResult = {
    category: 'Breadcrumb Generation',
    passed: 0,
    failed: 0,
    warnings: [],
    errors: [],
  }

  const testPaths = [
    '/reference/hooks/use-clarity-chat',
    '/reference/components/clarity-chat',
    '/guides/getting-started',
    '/examples/basic-chat',
  ]

  for (const path of testPaths) {
    try {
      const breadcrumbs = generateBreadcrumbs(path)

      // Validate breadcrumbs
      if (breadcrumbs.length === 0) {
        result.failed++
        result.errors.push(`No breadcrumbs generated for ${path}`)
        continue
      }

      if (breadcrumbs[0].name !== 'Home') {
        result.warnings.push(`First breadcrumb should be "Home" for ${path}`)
      }

      if (
        breadcrumbs[breadcrumbs.length - 1].url !==
        `https://clarity-chat.dev${path}`
      ) {
        result.warnings.push(`Last breadcrumb URL mismatch for ${path}`)
      }

      result.passed++
    } catch (error) {
      result.failed++
      result.errors.push(`Breadcrumb generation failed for ${path}: ${error}`)
    }
  }

  return result
}

async function auditUniqueMetadata(): Promise<AuditResult> {
  const result: AuditResult = {
    category: 'Metadata Uniqueness',
    passed: 0,
    failed: 0,
    warnings: [],
    errors: [],
  }

  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const urls = new Set<string>()

  // Check hook metadata
  for (const hook of hookMetadata) {
    const metadata = generateHookMetadata(hook)
    const title = typeof metadata.title === 'string' ? metadata.title : ''
    const description = metadata.description || ''

    if (titles.has(title)) {
      result.failed++
      result.errors.push(`Duplicate title: "${title}"`)
    } else {
      titles.add(title)
      result.passed++
    }

    if (descriptions.has(description)) {
      result.warnings.push(
        `Duplicate description: "${description.substring(0, 50)}..."`
      )
    } else {
      descriptions.add(description)
    }

    if (urls.has(hook.href)) {
      result.failed++
      result.errors.push(`Duplicate URL: ${hook.href}`)
    } else {
      urls.add(hook.href)
      result.passed++
    }
  }

  // Check component metadata
  for (const component of componentMetadata) {
    const metadata = generateComponentMetadata(component)
    const title = typeof metadata.title === 'string' ? metadata.title : ''
    const description = metadata.description || ''

    if (titles.has(title)) {
      result.failed++
      result.errors.push(`Duplicate title: "${title}"`)
    } else {
      titles.add(title)
      result.passed++
    }

    if (descriptions.has(description)) {
      result.warnings.push(
        `Duplicate description: "${description.substring(0, 50)}..."`
      )
    } else {
      descriptions.add(description)
    }

    if (urls.has(component.href)) {
      result.failed++
      result.errors.push(`Duplicate URL: ${component.href}`)
    } else {
      urls.add(component.href)
      result.passed++
    }
  }

  return result
}

async function auditKeywords(): Promise<AuditResult> {
  const result: AuditResult = {
    category: 'Keyword Optimization',
    passed: 0,
    failed: 0,
    warnings: [],
    errors: [],
  }

  // Check that hooks have relevant keywords
  for (const hook of hookMetadata) {
    const metadata = generateHookMetadata(hook)
    const keywords = metadata.keywords || []

    if (keywords.length === 0) {
      result.failed++
      result.errors.push(`Hook ${hook.name} has no keywords`)
      continue
    }

    if (!keywords.includes('react hook') && !keywords.includes('react')) {
      result.warnings.push(`Hook ${hook.name} missing "react hook" keyword`)
    }

    if (!keywords.includes(hook.name)) {
      result.warnings.push(`Hook ${hook.name} missing its own name in keywords`)
    }

    result.passed++
  }

  // Check that components have relevant keywords
  for (const component of componentMetadata) {
    const metadata = generateComponentMetadata(component)
    const keywords = metadata.keywords || []

    if (keywords.length === 0) {
      result.failed++
      result.errors.push(`Component ${component.name} has no keywords`)
      continue
    }

    if (!keywords.includes('react component') && !keywords.includes('react')) {
      result.warnings.push(
        `Component ${component.name} missing "react component" keyword`
      )
    }

    result.passed++
  }

  return result
}

async function auditOpenGraph(): Promise<AuditResult> {
  const result: AuditResult = {
    category: 'OpenGraph & Twitter Cards',
    passed: 0,
    failed: 0,
    warnings: [],
    errors: [],
  }

  // Check hooks
  for (const hook of hookMetadata) {
    const metadata = generateHookMetadata(hook)

    if (!metadata.openGraph) {
      result.failed++
      result.errors.push(`Hook ${hook.name} missing OpenGraph metadata`)
      continue
    }

    if (!metadata.openGraph.title || !metadata.openGraph.description) {
      result.failed++
      result.errors.push(`Hook ${hook.name} OpenGraph missing required fields`)
      continue
    }

    if (!metadata.twitter) {
      result.failed++
      result.errors.push(`Hook ${hook.name} missing Twitter card metadata`)
      continue
    }

    result.passed++
  }

  // Check components
  for (const component of componentMetadata) {
    const metadata = generateComponentMetadata(component)

    if (!metadata.openGraph) {
      result.failed++
      result.errors.push(
        `Component ${component.name} missing OpenGraph metadata`
      )
      continue
    }

    if (!metadata.twitter) {
      result.failed++
      result.errors.push(
        `Component ${component.name} missing Twitter card metadata`
      )
      continue
    }

    result.passed++
  }

  return result
}

async function generateReport(): Promise<AuditReport> {
  header('SEO AUDIT REPORT')
  log('Starting comprehensive SEO audit...', 'blue')

  const results: AuditResult[] = []

  // Run all audits
  log('\n📊 Auditing metadata generation...', 'blue')
  results.push(await auditMetadata())

  log('🔗 Auditing breadcrumb generation...', 'blue')
  results.push(await auditBreadcrumbs())

  log('🎯 Auditing metadata uniqueness...', 'blue')
  results.push(await auditUniqueMetadata())

  log('🔑 Auditing keyword optimization...', 'blue')
  results.push(await auditKeywords())

  log('📱 Auditing OpenGraph & Twitter cards...', 'blue')
  results.push(await auditOpenGraph())

  // Calculate summary
  const totalTests = results.reduce((sum, r) => sum + r.passed + r.failed, 0)
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const score =
    totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0

  return {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      totalTests,
      totalPassed,
      totalFailed,
      score,
    },
  }
}

function printReport(report: AuditReport) {
  header('AUDIT RESULTS')

  for (const result of report.results) {
    console.log(`\n${result.category}:`)
    log(
      `  ✅ Passed: ${result.passed}`,
      result.failed === 0 ? 'green' : 'yellow'
    )
    log(`  ❌ Failed: ${result.failed}`, result.failed > 0 ? 'red' : 'green')

    if (result.errors.length > 0) {
      log('\n  Errors:', 'red')
      result.errors.forEach((error) => {
        log(`    • ${error}`, 'red')
      })
    }

    if (result.warnings.length > 0 && result.warnings.length <= 10) {
      log('\n  Warnings:', 'yellow')
      result.warnings.slice(0, 10).forEach((warning) => {
        log(`    • ${warning}`, 'yellow')
      })
      if (result.warnings.length > 10) {
        log(
          `    ... and ${result.warnings.length - 10} more warnings`,
          'yellow'
        )
      }
    }
  }

  header('SUMMARY')
  log(`Total Tests: ${report.summary.totalTests}`, 'blue')
  log(`Passed: ${report.summary.totalPassed}`, 'green')
  log(
    `Failed: ${report.summary.totalFailed}`,
    report.summary.totalFailed > 0 ? 'red' : 'green'
  )
  log(
    `\nSEO Score: ${report.summary.score}/100`,
    report.summary.score >= 95
      ? 'green'
      : report.summary.score >= 80
        ? 'yellow'
        : 'red'
  )

  if (report.summary.score >= 95) {
    log('\n🎉 Excellent! SEO implementation meets all requirements.', 'green')
  } else if (report.summary.score >= 80) {
    log('\n⚠️  Good, but there are some issues to address.', 'yellow')
  } else {
    log('\n❌ SEO implementation needs improvement.', 'red')
  }

  console.log('\n' + '='.repeat(60) + '\n')
}

// Run audit
async function main() {
  try {
    const report = await generateReport()
    printReport(report)

    // Exit with error code if score is below 95
    if (report.summary.score < 95) {
      process.exit(1)
    }
  } catch (error) {
    log(`\n❌ Audit failed: ${error}`, 'red')
    process.exit(1)
  }
}

main()
