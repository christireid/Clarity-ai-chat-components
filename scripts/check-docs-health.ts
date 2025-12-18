#!/usr/bin/env tsx

/**
 * Documentation Health Check Script
 *
 * Analyzes documentation quality and generates a health report
 * Can be run manually, in CI, or scheduled for monthly audits
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

interface HealthReport {
  timestamp: string
  fileCount: {
    markdown: number
    text: number
    total: number
  }
  artifacts: {
    count: number
    files: string[]
  }
  orphans: {
    count: number
    files: string[]
  }
  empty: {
    count: number
    files: string[]
  }
  todos: {
    count: number
    files: string[]
  }
  essentialFiles: {
    missing: string[]
    present: string[]
  }
  healthScore: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

const ESSENTIAL_FILES = [
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'LICENSE',
  '.github/DOCUMENTATION_POLICY.md'
]

const ARTIFACT_PATTERNS = [
  /_COMPLETE\.md$/,
  /_SUMMARY\.md$/,
  /_STATUS\.md$/,
  /_REPORT\.md$/,
  /^FINAL_.+\.md$/,
  /^PROJECT_COMPLETE\.md$/,
  /^PHASE_[0-9]+_.+\.md$/,
  /_PROGRESS\.md$/,
  /_CHECKLIST\.md$/,
  /^CLEANUP_.+\.md$/,
  /^OPTIMIZATION_.+\.md$/,
  /^REFACTOR_.+\.md$/,
  /^IMPLEMENTATION_.+\.md$/
]

async function countFiles(pattern: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `find . -type f -name "${pattern}" -not -path "./node_modules/*" -not -path "./.git/*" | wc -l`
    )
    return parseInt(stdout.trim())
  } catch (error) {
    return 0
  }
}

async function findFiles(pattern: string): Promise<string[]> {
  try {
    const { stdout } = await execAsync(
      `find . -type f -name "${pattern}" -not -path "./node_modules/*" -not -path "./.git/*"`
    )
    return stdout.trim().split('\n').filter(Boolean)
  } catch (error) {
    return []
  }
}

async function findArtifacts(): Promise<string[]> {
  const allFiles = await findFiles('*.md')
  const artifacts: string[] = []

  for (const file of allFiles) {
    // Skip if in .archive
    if (file.includes('.archive/')) continue

    const filename = path.basename(file)

    // Check if filename matches any artifact pattern
    const isArtifact = ARTIFACT_PATTERNS.some(pattern => pattern.test(filename))

    if (isArtifact) {
      artifacts.push(file)
    }
  }

  return artifacts
}

async function findEmptyFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync(
      `find . -type f -name "*.md" -empty -not -path "./node_modules/*"`
    )
    return stdout.trim().split('\n').filter(Boolean)
  } catch (error) {
    return []
  }
}

async function findTodoMarkers(): Promise<{ count: number; files: string[] }> {
  try {
    const { stdout } = await execAsync(
      `grep -rl "TODO\\|FIXME\\|TBD\\|PLACEHOLDER" --include="*.md" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.archive . 2>/dev/null || true`
    )
    const files = stdout.trim().split('\n').filter(Boolean)
    return {
      count: files.length,
      files
    }
  } catch (error) {
    return { count: 0, files: [] }
  }
}

async function checkEssentialFiles(): Promise<{ missing: string[]; present: string[] }> {
  const missing: string[] = []
  const present: string[] = []

  for (const file of ESSENTIAL_FILES) {
    try {
      await fs.access(file)
      present.push(file)
    } catch {
      missing.push(file)
    }
  }

  return { missing, present }
}

function calculateHealthScore(report: Omit<HealthReport, 'healthScore' | 'status'>): number {
  let score = 100

  // Deduct points for issues
  score -= report.artifacts.count * 2 // -2 points per artifact
  score -= report.orphans.count * 1 // -1 point per orphan
  score -= report.empty.count * 1 // -1 point per empty file
  score -= report.essentialFiles.missing.length * 10 // -10 points per missing essential file

  // Deduct points if file count too high
  if (report.fileCount.total > 400) {
    score -= Math.min((report.fileCount.total - 400) / 10, 20) // Max -20 points
  }

  return Math.max(0, Math.min(100, score))
}

function getHealthStatus(score: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'warning'
  return 'critical'
}

function formatReport(report: HealthReport, format: 'text' | 'json'): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2)
  }

  // Text format with colors
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
  }

  const statusColor = {
    excellent: colors.green,
    good: colors.blue,
    warning: colors.yellow,
    critical: colors.red
  }[report.status]

  let output = `
${colors.bold}═══════════════════════════════════════════════════════════════════${colors.reset}
${colors.bold}${colors.cyan}📊 DOCUMENTATION HEALTH REPORT${colors.reset}
${colors.bold}═══════════════════════════════════════════════════════════════════${colors.reset}

${colors.bold}Timestamp:${colors.reset} ${report.timestamp}
${colors.bold}Health Score:${colors.reset} ${statusColor}${report.healthScore}/100 (${report.status.toUpperCase()})${colors.reset}

${colors.bold}${colors.cyan}📁 FILE COUNTS${colors.reset}
────────────────────────────────────────────────────────────────────
  Markdown files: ${report.fileCount.markdown}
  Text files: ${report.fileCount.text}
  Total: ${report.fileCount.total}

  ${report.fileCount.total < 400 ? colors.green + '✅' : colors.yellow + '⚠️'} ${report.fileCount.total < 400 ? 'Healthy' : 'Above threshold'} (target: < 400 files)${colors.reset}

${colors.bold}${colors.cyan}🚨 ARTIFACTS${colors.reset}
────────────────────────────────────────────────────────────────────
  ${report.artifacts.count === 0 ? colors.green + '✅ No artifacts found!' : colors.red + '❌ ' + report.artifacts.count + ' artifact(s) found'}${colors.reset}
`

  if (report.artifacts.count > 0) {
    output += '\n  Files:\n'
    report.artifacts.files.slice(0, 10).forEach(file => {
      output += `    • ${file}\n`
    })
    if (report.artifacts.count > 10) {
      output += `    ... and ${report.artifacts.count - 10} more\n`
    }
  }

  output += `
${colors.bold}${colors.cyan}📄 EMPTY FILES${colors.reset}
────────────────────────────────────────────────────────────────────
  ${report.empty.count === 0 ? colors.green + '✅ No empty files' : colors.yellow + '⚠️  ' + report.empty.count + ' empty file(s)'}${colors.reset}
`

  if (report.empty.count > 0) {
    output += '\n  Files:\n'
    report.empty.files.forEach(file => {
      output += `    • ${file}\n`
    })
  }

  output += `
${colors.bold}${colors.cyan}📝 TODO MARKERS${colors.reset}
────────────────────────────────────────────────────────────────────
  ${report.todos.count === 0 ? colors.green + '✅ No TODO markers' : colors.blue + 'ℹ️  ' + report.todos.count + ' file(s) with TODO/FIXME'}${colors.reset}

${colors.bold}${colors.cyan}🔒 ESSENTIAL FILES${colors.reset}
────────────────────────────────────────────────────────────────────
  ${report.essentialFiles.missing.length === 0 ? colors.green + '✅ All essential files present' : colors.red + '❌ ' + report.essentialFiles.missing.length + ' essential file(s) missing'}${colors.reset}
`

  if (report.essentialFiles.missing.length > 0) {
    output += '\n  Missing:\n'
    report.essentialFiles.missing.forEach(file => {
      output += `    ${colors.red}• ${file}${colors.reset}\n`
    })
  }

  output += `
${colors.bold}═══════════════════════════════════════════════════════════════════${colors.reset}
${colors.bold}RECOMMENDATION${colors.reset}
────────────────────────────────────────────────────────────────────
`

  if (report.status === 'excellent') {
    output += `  ${colors.green}✅ Documentation is in excellent health!${colors.reset}\n`
    output += `  Keep up the good work maintaining documentation standards.\n`
  } else if (report.status === 'good') {
    output += `  ${colors.blue}👍 Documentation is in good health.${colors.reset}\n`
    output += `  Address minor issues to achieve excellent status.\n`
  } else if (report.status === 'warning') {
    output += `  ${colors.yellow}⚠️  Documentation needs attention.${colors.reset}\n`
    if (report.artifacts.count > 0) {
      output += `  • Archive or remove ${report.artifacts.count} artifact(s)\n`
    }
    if (report.essentialFiles.missing.length > 0) {
      output += `  • Add missing essential files\n`
    }
  } else {
    output += `  ${colors.red}🚨 Documentation requires immediate attention!${colors.reset}\n`
    if (report.artifacts.count > 0) {
      output += `  • ${colors.bold}URGENT:${colors.reset} Archive or remove ${report.artifacts.count} artifact(s)\n`
    }
    if (report.essentialFiles.missing.length > 0) {
      output += `  • ${colors.bold}CRITICAL:${colors.reset} Add missing essential files\n`
    }
  }

  output += `
${colors.bold}═══════════════════════════════════════════════════════════════════${colors.reset}

For details, see: .github/DOCUMENTATION_POLICY.md

`

  return output
}

async function main() {
  const format = process.argv.includes('--json') ? 'json' : 'text'

  SecureLogger.debug('🔍 Analyzing documentation health...\n')

  // Gather data
  const mdCount = await countFiles('*.md')
  const txtCount = await countFiles('*.txt')
  const artifacts = await findArtifacts()
  const empty = await findEmptyFiles()
  const todos = await findTodoMarkers()
  const essentialFiles = await checkEssentialFiles()

  // Build report
  const partialReport = {
    timestamp: new Date().toISOString(),
    fileCount: {
      markdown: mdCount,
      text: txtCount,
      total: mdCount + txtCount
    },
    artifacts: {
      count: artifacts.length,
      files: artifacts
    },
    orphans: {
      count: 0, // Placeholder for future orphan detection
      files: []
    },
    empty: {
      count: empty.length,
      files: empty
    },
    todos,
    essentialFiles
  }

  const healthScore = calculateHealthScore(partialReport)
  const status = getHealthStatus(healthScore)

  const report: HealthReport = {
    ...partialReport,
    healthScore,
    status
  }

  // Output report
  SecureLogger.debug(formatReport(report, format))

  // Exit with appropriate code
  if (report.status === 'critical') {
    process.exit(2)
  } else if (report.status === 'warning') {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

main().catch(error => {
  SecureLogger.error('Error running documentation health check:', error)
  process.exit(1)
})
