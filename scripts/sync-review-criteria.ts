#!/usr/bin/env tsx
/**
 * Sync Review Criteria
 *
 * Validates that review-checks.ts rules align with docs/prompts/criteria/*.md
 * and generates a mapping report.
 *
 * Usage:
 *   pnpm review:sync          # Validate alignment
 *   pnpm review:sync --report # Generate detailed report
 */

import * as fs from 'fs'
import * as path from 'path'

const CRITERIA_DIR = 'docs/prompts/criteria'
const CHECKS_FILE = 'scripts/review-checks.ts'

interface CriteriaItem {
  category: string
  file: string
  items: string[]
}

interface RuleMapping {
  rule: string
  criteria: string[]
  covered: boolean
}

// Map check rules to their criteria categories
const RULE_TO_CRITERIA: Record<string, string[]> = {
  arbitraryTailwind: ['tailwind.md'],
  hardcodedColors: ['tailwind.md'],
  missingUseClient: ['architecture.md', 'security.md'],
  explicitAny: ['typescript.md'],
  dangerousHtml: ['security.md'],
  dynamicUrl: ['security.md'],
  nativeImg: ['performance.md'],
  inlineArrowJsx: ['performance.md'],
  consoleLog: ['architecture.md'],
  todoComments: ['architecture.md'],
}

function parseCriteriaFile(filePath: string): CriteriaItem {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)
  const items: string[] = []

  // Extract checklist items (lines starting with - [ ] or - [x])
  const checklistPattern = /^[-*]\s*\[[ x]\]\s*(.+)$/gm
  let match
  while ((match = checklistPattern.exec(content)) !== null) {
    items.push(match[1].trim())
  }

  // Extract bold items that might be rules
  const boldPattern = /\*\*([^*]+)\*\*/g
  while ((match = boldPattern.exec(content)) !== null) {
    const item = match[1].trim()
    if (item.length > 3 && item.length < 100) {
      items.push(item)
    }
  }

  return {
    category: fileName.replace('.md', ''),
    file: fileName,
    items: [...new Set(items)], // Dedupe
  }
}

function loadAllCriteria(): CriteriaItem[] {
  const criteriaPath = path.join(process.cwd(), CRITERIA_DIR)

  if (!fs.existsSync(criteriaPath)) {
    SecureLogger.error(`Criteria directory not found: ${criteriaPath}`)
    return []
  }

  const files = fs.readdirSync(criteriaPath).filter((f) => f.endsWith('.md') && f !== 'README.md')

  return files.map((file) => parseCriteriaFile(path.join(criteriaPath, file)))
}

function extractRulesFromChecks(): string[] {
  const checksPath = path.join(process.cwd(), CHECKS_FILE)
  const content = fs.readFileSync(checksPath, 'utf-8')

  // Extract rule names from CHECKS object
  const rulePattern = /^\s*(\w+):\s*\{/gm
  const rules: string[] = []
  let match

  while ((match = rulePattern.exec(content)) !== null) {
    const ruleName = match[1]
    // Filter out non-rule matches
    if (
      ruleName !== 'pattern' &&
      ruleName !== 'check' &&
      ruleName !== 'message' &&
      ruleName !== 'severity' &&
      ruleName !== 'fixable' &&
      ruleName !== 'fix' &&
      ruleName !== 'exclude'
    ) {
      rules.push(ruleName)
    }
  }

  return rules
}

function generateReport(criteria: CriteriaItem[], rules: string[]): void {
  SecureLogger.debug('\n╔═══════════════════════════════════════════════════════════╗')
  SecureLogger.debug('║         Review Criteria Sync Report                        ║')
  SecureLogger.debug('╚═══════════════════════════════════════════════════════════╝\n')

  // Rules coverage
  SecureLogger.debug('📋 RULES COVERAGE\n')
  SecureLogger.debug('Rule                    │ Criteria Files')
  SecureLogger.debug('────────────────────────┼─────────────────────────────────')

  for (const rule of rules) {
    const criteriaFiles = RULE_TO_CRITERIA[rule] || ['(unmapped)']
    const status = RULE_TO_CRITERIA[rule] ? '✓' : '⚠'
    SecureLogger.debug(`${status} ${rule.padEnd(20)} │ ${criteriaFiles.join(', ')}`)
  }

  // Criteria coverage
  SecureLogger.debug('\n\n📚 CRITERIA FILES\n')

  for (const item of criteria) {
    const rulesForCriteria = Object.entries(RULE_TO_CRITERIA)
      .filter(([_, files]) => files.includes(item.file))
      .map(([rule]) => rule)

    SecureLogger.debug(`\n${item.category.toUpperCase()} (${item.file})`)
    SecureLogger.debug(`  Automated checks: ${rulesForCriteria.length > 0 ? rulesForCriteria.join(', ') : 'None'}`)
    SecureLogger.debug(`  Manual review items: ${item.items.length}`)
  }

  // Summary
  const mappedRules = rules.filter((r) => RULE_TO_CRITERIA[r])
  const unmappedRules = rules.filter((r) => !RULE_TO_CRITERIA[r])

  SecureLogger.debug('\n\n📊 SUMMARY\n')
  SecureLogger.debug(`Total automated rules:    ${rules.length}`)
  SecureLogger.debug(`Mapped to criteria:       ${mappedRules.length}`)
  SecureLogger.debug(`Unmapped rules:           ${unmappedRules.length}`)
  SecureLogger.debug(`Criteria files:           ${criteria.length}`)

  if (unmappedRules.length > 0) {
    SecureLogger.debug(`\n⚠️  Unmapped rules: ${unmappedRules.join(', ')}`)
    SecureLogger.debug('   Add these to RULE_TO_CRITERIA in sync-review-criteria.ts')
  }

  // Coverage by category
  SecureLogger.debug('\n\n📈 COVERAGE BY CATEGORY\n')
  SecureLogger.debug('Category      │ Auto Rules │ Coverage')
  SecureLogger.debug('──────────────┼────────────┼──────────')

  for (const item of criteria) {
    const rulesForCriteria = Object.entries(RULE_TO_CRITERIA)
      .filter(([_, files]) => files.includes(item.file))
      .map(([rule]) => rule)

    const coverage = rulesForCriteria.length > 0 ? '✓ Partial' : '○ Manual only'
    SecureLogger.debug(`${item.category.padEnd(13)} │ ${String(rulesForCriteria.length).padEnd(10)} │ ${coverage}`)
  }

  SecureLogger.debug('\n')
}

function validateAlignment(criteria: CriteriaItem[], rules: string[]): boolean {
  let valid = true

  // Check all rules are mapped
  for (const rule of rules) {
    if (!RULE_TO_CRITERIA[rule]) {
      SecureLogger.warn(`⚠️  Rule '${rule}' is not mapped to any criteria file`)
      valid = false
    }
  }

  // Check all criteria files have at least one rule
  for (const item of criteria) {
    const hasRules = Object.values(RULE_TO_CRITERIA).some((files) => files.includes(item.file))
    if (!hasRules && item.file !== 'clarity-chat.md') {
      SecureLogger.warn(`⚠️  Criteria file '${item.file}' has no automated checks`)
    }
  }

  return valid
}

function main(): void {
  const args = process.argv.slice(2)
  const showReport = args.includes('--report') || args.includes('-r')

  const criteria = loadAllCriteria()
  const rules = extractRulesFromChecks()

  if (criteria.length === 0) {
    SecureLogger.error('No criteria files found')
    process.exit(1)
  }

  if (showReport) {
    generateReport(criteria, rules)
  }

  const valid = validateAlignment(criteria, rules)

  if (valid) {
    SecureLogger.debug('✓ All rules are mapped to criteria files')
  } else {
    SecureLogger.debug('\nRun with --report for detailed coverage analysis')
  }
}

main()
