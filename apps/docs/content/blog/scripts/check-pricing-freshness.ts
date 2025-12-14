#!/usr/bin/env npx ts-node
/**
 * Pricing Freshness Checker
 *
 * Scans blog posts for pricing information and flags content that may be outdated.
 * Run quarterly or when provider pricing changes.
 *
 * Usage:
 *   npx ts-node check-pricing-freshness.ts
 *   npx ts-node check-pricing-freshness.ts --update-baseline
 *
 * @license MIT
 */

import * as fs from 'fs'
import * as path from 'path'

// =============================================================================
// CONFIGURATION
// =============================================================================

const POSTS_DIR = path.join(__dirname, '..', 'posts')
const BASELINE_FILE = path.join(__dirname, 'pricing-baseline.json')

// Posts known to contain pricing information
const PRICING_POSTS = [
  '13-cut-gpt4-bill.md',
  '15-model-selection.md',
  '10-token-counting.md',
  '16-hidden-costs.md',
]

// Regex patterns for extracting pricing
const PRICING_PATTERNS = [
  // Dollar amounts with decimal (e.g., $0.01, $0.0001)
  /\$(\d+\.?\d*)/g,
  // Cost per 1k tokens (e.g., 0.01/1k, $0.002 per 1k)
  /(\d+\.?\d*)\s*(?:\/|per)\s*1k/gi,
  // Model names with versions
  /gpt-4[a-z0-9-]*/gi,
  /gpt-3\.5[a-z0-9-]*/gi,
  /claude-[a-z0-9.-]+/gi,
  /text-embedding-[a-z0-9-]+/gi,
]

// =============================================================================
// TYPES
// =============================================================================

interface PricingMention {
  file: string
  line: number
  text: string
  pattern: string
  value: string
}

interface PricingBaseline {
  generatedAt: string
  mentions: PricingMention[]
  checksum: string
}

interface FreshnessReport {
  checkedAt: string
  postsChecked: number
  mentionsFound: number
  newMentions: PricingMention[]
  changedMentions: { old: PricingMention; new: PricingMention }[]
  removedMentions: PricingMention[]
  recommendations: string[]
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

function extractPricingMentions(filePath: string): PricingMention[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const fileName = path.basename(filePath)
  const mentions: PricingMention[] = []

  lines.forEach((line, index) => {
    // Skip code comments and markdown frontmatter
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return
    }

    for (const pattern of PRICING_PATTERNS) {
      // Reset regex state
      pattern.lastIndex = 0
      let match

      while ((match = pattern.exec(line)) !== null) {
        mentions.push({
          file: fileName,
          line: index + 1,
          text: line.trim().slice(0, 100),
          pattern: pattern.source,
          value: match[0],
        })
      }
    }
  })

  return mentions
}

function scanAllPosts(): PricingMention[] {
  const allMentions: PricingMention[] = []

  for (const postFile of PRICING_POSTS) {
    const filePath = path.join(POSTS_DIR, postFile)

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Post not found: ${postFile}`)
      continue
    }

    const mentions = extractPricingMentions(filePath)
    allMentions.push(...mentions)
  }

  return allMentions
}

function generateChecksum(mentions: PricingMention[]): string {
  const content = JSON.stringify(
    mentions.map((m) => `${m.file}:${m.line}:${m.value}`)
  )
  // Simple hash for change detection
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(16)
}

function loadBaseline(): PricingBaseline | null {
  if (!fs.existsSync(BASELINE_FILE)) {
    return null
  }

  try {
    const content = fs.readFileSync(BASELINE_FILE, 'utf-8')
    return JSON.parse(content) as PricingBaseline
  } catch {
    console.warn('Warning: Could not parse baseline file')
    return null
  }
}

function saveBaseline(mentions: PricingMention[]): void {
  const baseline: PricingBaseline = {
    generatedAt: new Date().toISOString(),
    mentions,
    checksum: generateChecksum(mentions),
  }

  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2))
  console.log(`Baseline saved to ${BASELINE_FILE}`)
}

function compareMentions(
  baseline: PricingMention[],
  current: PricingMention[]
): FreshnessReport {
  const report: FreshnessReport = {
    checkedAt: new Date().toISOString(),
    postsChecked: PRICING_POSTS.length,
    mentionsFound: current.length,
    newMentions: [],
    changedMentions: [],
    removedMentions: [],
    recommendations: [],
  }

  // Create maps for comparison
  const baselineMap = new Map<string, PricingMention>()
  const currentMap = new Map<string, PricingMention>()

  baseline.forEach((m) => {
    const key = `${m.file}:${m.line}`
    baselineMap.set(key, m)
  })

  current.forEach((m) => {
    const key = `${m.file}:${m.line}`
    currentMap.set(key, m)
  })

  // Find new and changed mentions
  for (const [key, mention] of currentMap) {
    const baselineMention = baselineMap.get(key)

    if (!baselineMention) {
      report.newMentions.push(mention)
    } else if (baselineMention.value !== mention.value) {
      report.changedMentions.push({
        old: baselineMention,
        new: mention,
      })
    }
  }

  // Find removed mentions
  for (const [key, mention] of baselineMap) {
    if (!currentMap.has(key)) {
      report.removedMentions.push(mention)
    }
  }

  // Generate recommendations
  if (report.newMentions.length > 0) {
    report.recommendations.push(
      `Review ${report.newMentions.length} new pricing mention(s) for accuracy`
    )
  }

  if (report.changedMentions.length > 0) {
    report.recommendations.push(
      `Verify ${report.changedMentions.length} changed pricing value(s)`
    )
  }

  // Check baseline age
  const baselineAge =
    Date.now() -
    new Date(
      baseline[0]?.file ? loadBaseline()?.generatedAt || Date.now() : Date.now()
    ).getTime()
  const daysOld = Math.floor(baselineAge / (1000 * 60 * 60 * 24))

  if (daysOld > 90) {
    report.recommendations.push(
      `Baseline is ${daysOld} days old. Consider verifying all pricing against current provider rates.`
    )
  }

  // Check for specific high-risk patterns
  const modelMentions = current.filter((m) =>
    /gpt-4|claude|embedding/i.test(m.value)
  )

  if (modelMentions.length > 0) {
    report.recommendations.push(
      'Verify model names and versions are still current'
    )
  }

  return report
}

function printReport(report: FreshnessReport): void {
  console.log('\n' + '='.repeat(60))
  console.log('PRICING FRESHNESS REPORT')
  console.log('='.repeat(60))
  console.log(`Checked at: ${report.checkedAt}`)
  console.log(`Posts checked: ${report.postsChecked}`)
  console.log(`Pricing mentions found: ${report.mentionsFound}`)
  console.log('')

  if (report.newMentions.length > 0) {
    console.log('NEW MENTIONS:')
    report.newMentions.forEach((m) => {
      console.log(`  [${m.file}:${m.line}] ${m.value}`)
      console.log(`    "${m.text}"`)
    })
    console.log('')
  }

  if (report.changedMentions.length > 0) {
    console.log('CHANGED MENTIONS:')
    report.changedMentions.forEach(({ old, new: newM }) => {
      console.log(`  [${newM.file}:${newM.line}]`)
      console.log(`    Old: ${old.value}`)
      console.log(`    New: ${newM.value}`)
    })
    console.log('')
  }

  if (report.removedMentions.length > 0) {
    console.log('REMOVED MENTIONS:')
    report.removedMentions.forEach((m) => {
      console.log(`  [${m.file}:${m.line}] ${m.value}`)
    })
    console.log('')
  }

  if (report.recommendations.length > 0) {
    console.log('RECOMMENDATIONS:')
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`)
    })
    console.log('')
  }

  const hasIssues =
    report.newMentions.length > 0 ||
    report.changedMentions.length > 0 ||
    report.recommendations.length > 0

  if (!hasIssues) {
    console.log('✅ No pricing freshness issues detected')
  } else {
    console.log('⚠️  Review recommended before publishing')
  }

  console.log('='.repeat(60) + '\n')
}

// =============================================================================
// CURRENT PRICING REFERENCE (Update quarterly)
// =============================================================================

const CURRENT_PRICING_REFERENCE = {
  lastUpdated: '2025-01-01',
  models: {
    'gpt-4o': {
      input: 0.0025,
      output: 0.01,
      unit: 'per 1k tokens',
    },
    'gpt-4o-mini': {
      input: 0.00015,
      output: 0.0006,
      unit: 'per 1k tokens',
    },
    'gpt-4-turbo': {
      input: 0.01,
      output: 0.03,
      unit: 'per 1k tokens',
    },
    'claude-3-5-sonnet': {
      input: 0.003,
      output: 0.015,
      unit: 'per 1k tokens',
    },
    'claude-3-haiku': {
      input: 0.00025,
      output: 0.00125,
      unit: 'per 1k tokens',
    },
    'text-embedding-3-small': {
      input: 0.00002,
      output: 0,
      unit: 'per 1k tokens',
    },
    'text-embedding-3-large': {
      input: 0.00013,
      output: 0,
      unit: 'per 1k tokens',
    },
  },
  note: 'Verify at openai.com/pricing and anthropic.com/pricing',
}

function printPricingReference(): void {
  console.log('\n' + '='.repeat(60))
  console.log('CURRENT PRICING REFERENCE')
  console.log(`Last updated: ${CURRENT_PRICING_REFERENCE.lastUpdated}`)
  console.log('='.repeat(60))

  for (const [model, pricing] of Object.entries(
    CURRENT_PRICING_REFERENCE.models
  )) {
    console.log(`${model}:`)
    console.log(`  Input:  $${pricing.input} ${pricing.unit}`)
    if (pricing.output > 0) {
      console.log(`  Output: $${pricing.output} ${pricing.unit}`)
    }
  }

  console.log('')
  console.log(`Note: ${CURRENT_PRICING_REFERENCE.note}`)
  console.log('='.repeat(60) + '\n')
}

// =============================================================================
// MAIN
// =============================================================================

function main(): void {
  const args = process.argv.slice(2)
  const updateBaseline = args.includes('--update-baseline')
  const showReference = args.includes('--reference')

  console.log('Pricing Freshness Checker')
  console.log('Scanning posts for pricing information...\n')

  if (showReference) {
    printPricingReference()
    return
  }

  const currentMentions = scanAllPosts()
  console.log(`Found ${currentMentions.length} pricing mentions`)

  if (updateBaseline) {
    saveBaseline(currentMentions)
    console.log(
      '\nBaseline updated. Run without --update-baseline to check freshness.'
    )
    return
  }

  const baseline = loadBaseline()

  if (!baseline) {
    console.log('\nNo baseline found. Creating initial baseline...')
    saveBaseline(currentMentions)
    console.log('Run this script again to check for changes.')
    return
  }

  const report = compareMentions(baseline.mentions, currentMentions)
  printReport(report)

  // Exit with error code if issues found (for CI integration)
  if (report.recommendations.length > 0) {
    process.exit(1)
  }
}

main()
