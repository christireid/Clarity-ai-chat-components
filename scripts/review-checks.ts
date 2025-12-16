import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
#!/usr/bin/env tsx
/**
 * Pre-commit Review Checks
 *
 * Lightweight rule-based checks based on the code review criteria.
 * Runs automatically before commits to catch common issues.
 *
 * Usage:
 *   pnpm review:check [files...]           # Check specific files
 *   pnpm review:check --staged             # Check staged files
 *   pnpm review:check --fix src/           # Auto-fix issues
 *   pnpm review:check --output json        # JSON output for CI
 *
 * Suppression:
 *   Add inline comments to suppress specific rules:
 *   // review-ignore: consoleLog
 *   // review-ignore: consoleLog, explicitAny
 *   // review-ignore-next-line: arbitraryTailwind
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Issue {
  file: string
  line: number
  rule: string
  severity: 'error' | 'warning'
  message: string
  fixable: boolean
  fixed?: boolean
}

interface CheckResult {
  issues: Issue[]
  fixed: Issue[]
  passed: boolean
  filesChecked: number
  duration: number
}

interface CheckDefinition {
  pattern?: RegExp
  check?: (content: string, filePath: string) => boolean | number[]
  message: string
  severity: 'error' | 'warning'
  fixable?: boolean
  fix?: (line: string) => string | null
  exclude?: string[]
}

interface Options {
  staged: boolean
  fix: boolean
  output: 'console' | 'json'
  help: boolean
  files: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ANSI Colors (with graceful fallback for non-TTY)
// ─────────────────────────────────────────────────────────────────────────────

const isTTY = process.stdout.isTTY

const colors = {
  reset: isTTY ? '\x1b[0m' : '',
  bold: isTTY ? '\x1b[1m' : '',
  dim: isTTY ? '\x1b[2m' : '',
  red: isTTY ? '\x1b[31m' : '',
  green: isTTY ? '\x1b[32m' : '',
  yellow: isTTY ? '\x1b[33m' : '',
  cyan: isTTY ? '\x1b[36m' : '',
}

// ─────────────────────────────────────────────────────────────────────────────
// Check Definitions
// ─────────────────────────────────────────────────────────────────────────────

const CHECKS: Record<string, CheckDefinition> = {
  // Tailwind: Arbitrary values that should use design tokens
  arbitraryTailwind: {
    pattern:
      /className=["'][^"']*(?:w-\[\d+px\]|h-\[\d+px\]|p-\[\d+px\]|m-\[\d+px\]|text-\[\d+px\]|gap-\[\d+px\])/g,
    message: 'Arbitrary pixel value found. Use design tokens (e.g., w-80 instead of w-[320px])',
    severity: 'warning',
    fixable: false,
  },

  // Tailwind: Hardcoded hex colors
  hardcodedColors: {
    pattern: /className=["'][^"']*(?:bg-\[#|text-\[#|border-\[#)/g,
    message: 'Hardcoded hex color found. Use theme colors (e.g., bg-gray-100 instead of bg-[#f5f5f5])',
    severity: 'warning',
    fixable: false,
  },

  // React: Missing 'use client' with hooks
  missingUseClient: {
    check: (content: string, filePath: string): boolean => {
      // Only check .tsx files in app directory (Next.js App Router)
      if (!filePath.endsWith('.tsx') || !filePath.includes('/app/')) {
        return false
      }
      // Skip layout and page files that might be server components
      const fileName = path.basename(filePath)
      if (fileName === 'layout.tsx' || fileName === 'page.tsx') {
        return false
      }
      const hasHooks =
        /\b(useState|useEffect|useRef|useCallback|useMemo|useReducer|useContext|useFormState|useFormStatus)\s*\(/.test(
          content
        )
      const hasUseClient =
        content.trimStart().startsWith("'use client'") || content.trimStart().startsWith('"use client"')
      return hasHooks && !hasUseClient
    },
    message: "File uses React hooks but missing 'use client' directive",
    severity: 'error',
    fixable: true,
    fix: (_line: string): string | null => null, // Handled specially - adds to top of file
  },

  // TypeScript: Explicit 'any' type
  explicitAny: {
    pattern: /:\s*any(?:\s*[;,)\]}]|\s*$)/gm,
    message: "Explicit 'any' type found. Use proper types or 'unknown' with type guards",
    severity: 'warning',
    fixable: false,
  },

  // Security: Dangerous innerHTML
  dangerousHtml: {
    pattern: /dangerouslySetInnerHTML\s*=\s*\{/g,
    message: 'dangerouslySetInnerHTML usage found. Ensure content is sanitized (DOMPurify)',
    severity: 'warning',
    fixable: false,
  },

  // Security: Unvalidated URL in src/href
  dynamicUrl: {
    pattern: /(?:src|href)=\{[^}]*(?:user|input|param|query)[^}]*\}/gi,
    message: 'Dynamic URL detected. Validate URLs before use to prevent XSS/open redirect',
    severity: 'warning',
    fixable: false,
  },

  // Performance: Native img instead of next/image
  nativeImg: {
    check: (content: string, filePath: string): boolean => {
      // Only for Next.js files
      if (!filePath.includes('/app/') && !filePath.includes('/pages/')) {
        return false
      }
      const hasNativeImg = /<img\s+[^>]*src=/.test(content)
      const hasNextImage = /import.*Image.*from\s+['"]next\/image['"]/.test(content)
      return hasNativeImg && !hasNextImage
    },
    message: 'Native <img> tag found. Use next/image for automatic optimization',
    severity: 'warning',
    fixable: false,
  },

  // Performance: Inline arrow functions in JSX onClick
  inlineArrowJsx: {
    pattern: /onClick=\{\s*\(\)\s*=>\s*\w+\(/g,
    message: 'Inline arrow function in onClick. Consider useCallback for stable references',
    severity: 'warning',
    fixable: false,
  },

  // Architecture: Console.log in production code
  consoleLog: {
    pattern: /console\.(log|debug|info)\s*\(/g,
    message: 'console.log found. Remove or use proper logging utility',
    severity: 'warning',
    fixable: true,
    fix: (line: string): string | null => {
      // Remove the entire console.log statement if it's on its own line
      if (/^\s*console\.(log|debug|info)\s*\([^)]*\)\s*;?\s*$/.test(line)) {
        return null // Signal to remove the line
      }
      return line // Can't safely fix inline console.log
    },
    exclude: ['.test.', '.spec.', '__tests__', 'scripts/', '.stories.'],
  },

  // Architecture: TODO/FIXME comments (info only)
  todoComments: {
    pattern: /\/\/\s*(TODO|FIXME|HACK|XXX):/gi,
    message: 'TODO/FIXME comment found. Consider addressing before merge.',
    severity: 'warning',
    fixable: false,
    exclude: ['.test.', '.spec.', '__tests__'],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Suppression Parsing
// ─────────────────────────────────────────────────────────────────────────────

interface SuppressionInfo {
  lineSuppressions: Map<number, Set<string>> // line -> suppressed rules
  fileSuppressions: Set<string> // file-wide suppressions
}

function parseSuppressions(content: string): SuppressionInfo {
  const lines = content.split('\n')
  const lineSuppressions = new Map<number, Set<string>>()
  const fileSuppressions = new Set<string>()

  lines.forEach((line, index) => {
    const lineNum = index + 1

    // File-wide suppression: // review-ignore-file: rule1, rule2
    const fileMatch = line.match(/\/\/\s*review-ignore-file:\s*(.+)$/i)
    if (fileMatch) {
      const rules = fileMatch[1].split(',').map((r) => r.trim())
      rules.forEach((r) => fileSuppressions.add(r))
    }

    // Line suppression: // review-ignore: rule1, rule2
    const lineMatch = line.match(/\/\/\s*review-ignore:\s*(.+)$/i)
    if (lineMatch) {
      const rules = lineMatch[1].split(',').map((r) => r.trim())
      const existing = lineSuppressions.get(lineNum) || new Set()
      rules.forEach((r) => existing.add(r))
      lineSuppressions.set(lineNum, existing)
    }

    // Next-line suppression: // review-ignore-next-line: rule1
    const nextLineMatch = line.match(/\/\/\s*review-ignore-next-line:\s*(.+)$/i)
    if (nextLineMatch) {
      const rules = nextLineMatch[1].split(',').map((r) => r.trim())
      const existing = lineSuppressions.get(lineNum + 1) || new Set()
      rules.forEach((r) => existing.add(r))
      lineSuppressions.set(lineNum + 1, existing)
    }
  })

  return { lineSuppressions, fileSuppressions }
}

function isSuppressed(suppressions: SuppressionInfo, ruleName: string, lineNumber: number): boolean {
  // Check file-wide suppressions
  if (suppressions.fileSuppressions.has(ruleName) || suppressions.fileSuppressions.has('all')) {
    return true
  }

  // Check line-specific suppressions
  const lineSuppressed = suppressions.lineSuppressions.get(lineNumber)
  if (lineSuppressed && (lineSuppressed.has(ruleName) || lineSuppressed.has('all'))) {
    return true
  }

  return false
}

// ─────────────────────────────────────────────────────────────────────────────
// File Operations
// ─────────────────────────────────────────────────────────────────────────────

function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
    return output
      .split('\n')
      .filter((f) => f.trim())
      .filter((f) => /\.(tsx?|jsx?)$/.test(f))
      .map((f) => path.resolve(f))
  } catch {
    return []
  }
}

function getFilesFromPath(filePath: string): string[] {
  const fullPath = path.resolve(filePath)

  if (!fs.existsSync(fullPath)) {
    return []
  }

  const stat = fs.statSync(fullPath)

  if (stat.isFile()) {
    return [fullPath]
  }

  if (stat.isDirectory()) {
    const files: string[] = []

    function walk(dir: string): void {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(entryPath)
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
          files.push(entryPath)
        }
      }
    }

    walk(fullPath)
    return files
  }

  return []
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Check Logic
// ─────────────────────────────────────────────────────────────────────────────

async function checkFile(filePath: string, options: Options): Promise<{ issues: Issue[]; fixed: Issue[] }> {
  const issues: Issue[] = []
  const fixed: Issue[] = []

  try {
    let content = await fs.promises.readFile(filePath, 'utf-8')
    const suppressions = parseSuppressions(content)
    let lines = content.split('\n')
    let contentModified = false

    for (const [ruleName, check] of Object.entries(CHECKS)) {
      // Skip if file matches exclude pattern
      if (check.exclude) {
        const shouldExclude = check.exclude.some((pattern) => filePath.includes(pattern))
        if (shouldExclude) continue
      }

      if (check.pattern) {
        // Pattern-based check
        const pattern = new RegExp(check.pattern.source, check.pattern.flags)
        let match

        while ((match = pattern.exec(content)) !== null) {
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length

          // Check for suppression
          if (isSuppressed(suppressions, ruleName, lineNumber)) {
            continue
          }

          const issue: Issue = {
            file: filePath,
            line: lineNumber,
            rule: ruleName,
            severity: check.severity,
            message: check.message,
            fixable: check.fixable || false,
          }

          // Attempt fix if requested
          if (options.fix && check.fixable && check.fix) {
            const lineContent = lines[lineNumber - 1]
            const fixedLine = check.fix(lineContent)

            if (fixedLine === null) {
              // Remove the line
              lines.splice(lineNumber - 1, 1)
              contentModified = true
              issue.fixed = true
              fixed.push(issue)
              // Re-parse content after modification
              content = lines.join('\n')
              pattern.lastIndex = 0 // Reset pattern to re-scan
              continue
            } else if (fixedLine !== lineContent) {
              lines[lineNumber - 1] = fixedLine
              contentModified = true
              issue.fixed = true
              fixed.push(issue)
              continue
            }
          }

          issues.push(issue)
        }
      } else if (check.check) {
        // Function-based check
        const result = check.check(content, filePath)
        if (result === true || (Array.isArray(result) && result.length > 0)) {
          const lineNumber = 1

          // Check for suppression
          if (isSuppressed(suppressions, ruleName, lineNumber)) {
            continue
          }

          const issue: Issue = {
            file: filePath,
            line: lineNumber,
            rule: ruleName,
            severity: check.severity,
            message: check.message,
            fixable: check.fixable || false,
          }

          // Special handling for missingUseClient fix
          if (options.fix && ruleName === 'missingUseClient') {
            lines.unshift("'use client'\n")
            contentModified = true
            issue.fixed = true
            fixed.push(issue)
            continue
          }

          issues.push(issue)
        }
      }
    }

    // Write back if modified
    if (contentModified) {
      await fs.promises.writeFile(filePath, lines.join('\n'), 'utf-8')
    }
  } catch {
    // File read error - skip silently
  }

  return { issues, fixed }
}

async function checkFiles(files: string[], options: Options): Promise<CheckResult> {
  const startTime = Date.now()
  const allIssues: Issue[] = []
  const allFixed: Issue[] = []

  // Process files in parallel for performance
  const results = await Promise.all(files.map((file) => checkFile(file, options)))

  for (const result of results) {
    allIssues.push(...result.issues)
    allFixed.push(...result.fixed)
  }

  return {
    issues: allIssues,
    fixed: allFixed,
    passed: !allIssues.some((i) => i.severity === 'error'),
    filesChecked: files.length,
    duration: Date.now() - startTime,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Output Formatting
// ─────────────────────────────────────────────────────────────────────────────

function printConsoleResults(result: CheckResult): void {
  if (result.issues.length === 0 && result.fixed.length === 0) {
    SecureLogger.debug(`${colors.green}✓ All review checks passed${colors.reset}`)
    SecureLogger.debug(
      `${colors.dim}  Checked ${result.filesChecked} file(s) in ${result.duration}ms${colors.reset}`
    )
    return
  }

  SecureLogger.debug(`\n${colors.cyan}━━━ Review Check Results ━━━${colors.reset}\n`)

  // Show fixed issues first
  if (result.fixed.length > 0) {
    SecureLogger.debug(`${colors.green}✓ Auto-fixed ${result.fixed.length} issue(s):${colors.reset}`)
    for (const issue of result.fixed) {
      const relativePath = path.relative(process.cwd(), issue.file)
      SecureLogger.debug(`  ${colors.dim}${relativePath}:${issue.line} - ${issue.rule}${colors.reset}`)
    }
    SecureLogger.debug('')
  }

  // Group remaining issues by file
  const byFile = new Map<string, Issue[]>()
  for (const issue of result.issues) {
    const existing = byFile.get(issue.file) || []
    existing.push(issue)
    byFile.set(issue.file, existing)
  }

  for (const [file, fileIssues] of byFile) {
    const relativePath = path.relative(process.cwd(), file)
    SecureLogger.debug(`${colors.bold}${relativePath}${colors.reset}`)

    for (const issue of fileIssues) {
      const icon = issue.severity === 'error' ? '✗' : '⚠'
      const color = issue.severity === 'error' ? colors.red : colors.yellow
      const fixableHint = issue.fixable ? ` ${colors.dim}(--fix available)${colors.reset}` : ''
      SecureLogger.debug(`  ${color}${icon}${colors.reset} Line ${issue.line}: ${issue.message}${fixableHint}`)
      SecureLogger.debug(`    ${colors.dim}Rule: ${issue.rule}${colors.reset}`)
    }
    SecureLogger.debug('')
  }

  // Summary
  const errors = result.issues.filter((i) => i.severity === 'error')
  const warnings = result.issues.filter((i) => i.severity === 'warning')

  SecureLogger.debug(`${colors.cyan}━━━ Summary ━━━${colors.reset}`)
  SecureLogger.debug(`${colors.dim}Checked ${result.filesChecked} file(s) in ${result.duration}ms${colors.reset}`)
  if (errors.length > 0) {
    SecureLogger.debug(`${colors.red}✗ ${errors.length} error(s)${colors.reset}`)
  }
  if (warnings.length > 0) {
    SecureLogger.debug(`${colors.yellow}⚠ ${warnings.length} warning(s)${colors.reset}`)
  }
  if (result.fixed.length > 0) {
    SecureLogger.debug(`${colors.green}✓ ${result.fixed.length} auto-fixed${colors.reset}`)
  }
  SecureLogger.debug('')

  // Suppression hint
  if (result.issues.length > 0) {
    SecureLogger.debug(`${colors.dim}Suppress with: // review-ignore: ruleName${colors.reset}`)
    SecureLogger.debug(`${colors.dim}Suppress next line: // review-ignore-next-line: ruleName${colors.reset}`)
    SecureLogger.debug('')
  }
}

function printJsonResults(result: CheckResult): void {
  const output = {
    passed: result.passed,
    filesChecked: result.filesChecked,
    duration: result.duration,
    summary: {
      errors: result.issues.filter((i) => i.severity === 'error').length,
      warnings: result.issues.filter((i) => i.severity === 'warning').length,
      fixed: result.fixed.length,
    },
    issues: result.issues.map((i) => ({
      file: path.relative(process.cwd(), i.file),
      line: i.line,
      rule: i.rule,
      severity: i.severity,
      message: i.message,
      fixable: i.fixable,
    })),
    fixed: result.fixed.map((i) => ({
      file: path.relative(process.cwd(), i.file),
      line: i.line,
      rule: i.rule,
    })),
  }

  SecureLogger.debug(JSON.stringify(output, null, 2))
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(args: string[]): Options {
  const options: Options = {
    staged: false,
    fix: false,
    output: 'console',
    help: false,
    files: [],
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true
        break
      case '--staged':
      case '-s':
        options.staged = true
        break
      case '--fix':
      case '-f':
        options.fix = true
        break
      case '--output':
      case '-o':
        const outputValue = args[++i]
        if (outputValue === 'json' || outputValue === 'console') {
          options.output = outputValue
        }
        break
      default:
        if (!arg.startsWith('-')) {
          options.files.push(arg)
        }
    }
  }

  return options
}

function printHelp(): void {
  SecureLogger.debug(`
${colors.cyan}${colors.bold}Review Checks${colors.reset} - Pre-commit code quality checks

${colors.bold}Usage:${colors.reset}
  pnpm review:check [options] [files...]

${colors.bold}Options:${colors.reset}
  -s, --staged        Check staged git files
  -f, --fix           Auto-fix fixable issues
  -o, --output MODE   Output format: console (default), json
  -h, --help          Show this help

${colors.bold}Examples:${colors.reset}
  ${colors.dim}# Check staged files${colors.reset}
  pnpm review:check --staged

  ${colors.dim}# Check and fix a directory${colors.reset}
  pnpm review:check --fix src/components/

  ${colors.dim}# JSON output for CI${colors.reset}
  pnpm review:check --staged --output json

${colors.bold}Suppression:${colors.reset}
  ${colors.dim}// review-ignore: ruleName${colors.reset}
  ${colors.dim}// review-ignore-next-line: ruleName${colors.reset}
  ${colors.dim}// review-ignore-file: ruleName${colors.reset}

${colors.bold}Rules:${colors.reset}
${Object.entries(CHECKS)
  .map(([name, check]) => `  ${check.fixable ? '🔧' : '  '} ${name} - ${check.message.split('.')[0]}`)
  .join('\n')}
`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  // Collect files to check
  let files: string[] = []

  if (options.staged) {
    files = getStagedFiles()
    if (files.length === 0) {
      if (options.output === 'json') {
        SecureLogger.debug(JSON.stringify({ passed: true, filesChecked: 0, issues: [] }))
      } else {
        SecureLogger.debug(`${colors.dim}No staged TypeScript/JavaScript files to check${colors.reset}`)
      }
      process.exit(0)
    }
  } else if (options.files.length > 0) {
    for (const filePath of options.files) {
      files.push(...getFilesFromPath(filePath))
    }
  } else {
    printHelp()
    process.exit(0)
  }

  // Run checks
  const result = await checkFiles(files, options)

  // Output results
  if (options.output === 'json') {
    printJsonResults(result)
  } else {
    printConsoleResults(result)
  }

  // Exit code
  if (!result.passed) {
    if (options.output !== 'json') {
      SecureLogger.debug(`${colors.red}Review checks failed. Please fix errors before committing.${colors.reset}`)
      SecureLogger.debug(`${colors.dim}Tip: Run 'pnpm review' for detailed AI-powered suggestions.${colors.reset}\n`)
    }
    process.exit(1)
  }

  if (result.issues.length > 0 && options.output !== 'json') {
    SecureLogger.debug(`${colors.yellow}Review checks passed with warnings.${colors.reset}`)
    SecureLogger.debug(`${colors.dim}Consider running 'pnpm review' for detailed suggestions.${colors.reset}\n`)
  }
}

main().catch((error) => {
  SecureLogger.error(`${colors.red}Error: ${error.message}${colors.reset}`)
  process.exit(1)
})

// ─────────────────────────────────────────────────────────────────────────────
// Exports for testing
// ─────────────────────────────────────────────────────────────────────────────

export { CHECKS, checkFile, parseSuppressions, isSuppressed }
export type { Issue, CheckResult, Options }
