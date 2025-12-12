#!/usr/bin/env tsx
/**
 * Pre-commit Review Checks
 *
 * Lightweight rule-based checks based on the code review criteria.
 * Runs automatically before commits to catch common issues.
 *
 * Usage:
 *   tsx scripts/review-checks.ts [files...]
 *   tsx scripts/review-checks.ts --staged
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

interface Issue {
  file: string
  line: number
  rule: string
  severity: 'error' | 'warning'
  message: string
}

interface CheckResult {
  issues: Issue[]
  passed: boolean
}

// Patterns that indicate potential issues
const CHECKS = {
  // Tailwind: Arbitrary values that should use design tokens
  arbitraryTailwind: {
    pattern: /className="[^"]*(?:w-\[\d+px\]|h-\[\d+px\]|p-\[\d+px\]|m-\[\d+px\]|text-\[\d+px\]|gap-\[\d+px\])/g,
    message: 'Arbitrary pixel value found. Use design tokens (e.g., w-80 instead of w-[320px])',
    severity: 'warning' as const,
  },

  // Tailwind: Hardcoded hex colors
  hardcodedColors: {
    pattern: /className="[^"]*(?:bg-\[#|text-\[#|border-\[#)/g,
    message: 'Hardcoded hex color found. Use theme colors (e.g., bg-gray-100 instead of bg-[#f5f5f5])',
    severity: 'warning' as const,
  },

  // React: Missing 'use client' with hooks
  missingUseClient: {
    check: (content: string, filePath: string): boolean => {
      // Only check .tsx files in app directory (Next.js App Router)
      if (!filePath.endsWith('.tsx') || !filePath.includes('/app/')) {
        return false
      }
      const hasHooks = /\b(useState|useEffect|useRef|useCallback|useMemo|useReducer|useContext)\s*\(/.test(content)
      const hasUseClient = content.startsWith("'use client'") || content.startsWith('"use client"')
      return hasHooks && !hasUseClient
    },
    message: "File uses React hooks but missing 'use client' directive",
    severity: 'error' as const,
  },

  // TypeScript: Explicit 'any' type
  explicitAny: {
    pattern: /:\s*any(?:\s*[;,\)\]\}]|\s*$)/gm,
    message: "Explicit 'any' type found. Use proper types or 'unknown' with type guards",
    severity: 'warning' as const,
  },

  // Security: Dangerous innerHTML
  dangerousHtml: {
    pattern: /dangerouslySetInnerHTML\s*=\s*\{/g,
    message: 'dangerouslySetInnerHTML usage found. Ensure content is sanitized (DOMPurify)',
    severity: 'warning' as const,
  },

  // Security: Unvalidated URL in src/href
  dynamicUrl: {
    pattern: /(?:src|href)=\{[^}]*(?:user|input|param|query)[^}]*\}/gi,
    message: 'Dynamic URL detected. Validate URLs before use to prevent XSS/open redirect',
    severity: 'warning' as const,
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
    severity: 'warning' as const,
  },

  // Performance: Inline arrow functions in JSX onClick
  inlineArrowJsx: {
    pattern: /onClick=\{\s*\(\)\s*=>\s*\w+\(/g,
    message: 'Inline arrow function in onClick. Consider useCallback for stable references',
    severity: 'warning' as const,
  },

  // Architecture: Console.log in production code
  consoleLog: {
    pattern: /console\.(log|debug|info)\(/g,
    message: 'console.log found. Remove or use proper logging utility',
    severity: 'warning' as const,
    exclude: ['.test.', '.spec.', '__tests__', 'scripts/'],
  },
}

function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
    return output
      .split('\n')
      .filter((f) => f.trim())
      .filter((f) => /\.(tsx?|jsx?)$/.test(f))
  } catch {
    return []
  }
}

function checkFile(filePath: string): Issue[] {
  const issues: Issue[] = []

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    for (const [ruleName, check] of Object.entries(CHECKS)) {
      // Skip if file matches exclude pattern
      if ('exclude' in check && check.exclude) {
        const shouldExclude = check.exclude.some((pattern) => filePath.includes(pattern))
        if (shouldExclude) continue
      }

      if ('pattern' in check) {
        // Pattern-based check
        const pattern = check.pattern
        let match

        // Need to reset lastIndex for global patterns
        pattern.lastIndex = 0

        while ((match = pattern.exec(content)) !== null) {
          // Find line number
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length

          issues.push({
            file: filePath,
            line: lineNumber,
            rule: ruleName,
            severity: check.severity,
            message: check.message,
          })
        }
      } else if ('check' in check) {
        // Function-based check
        if (check.check(content, filePath)) {
          issues.push({
            file: filePath,
            line: 1,
            rule: ruleName,
            severity: check.severity,
            message: check.message,
          })
        }
      }
    }
  } catch (error) {
    // File read error - skip
  }

  return issues
}

function printResults(results: CheckResult): void {
  if (results.issues.length === 0) {
    console.log(`${colors.green}✓ All review checks passed${colors.reset}`)
    return
  }

  const errors = results.issues.filter((i) => i.severity === 'error')
  const warnings = results.issues.filter((i) => i.severity === 'warning')

  console.log(`\n${colors.cyan}━━━ Review Check Results ━━━${colors.reset}\n`)

  // Group by file
  const byFile = new Map<string, Issue[]>()
  for (const issue of results.issues) {
    const existing = byFile.get(issue.file) || []
    existing.push(issue)
    byFile.set(issue.file, existing)
  }

  for (const [file, fileIssues] of byFile) {
    const relativePath = path.relative(process.cwd(), file)
    console.log(`${colors.bold}${relativePath}${colors.reset}`)

    for (const issue of fileIssues) {
      const icon = issue.severity === 'error' ? '✗' : '⚠'
      const color = issue.severity === 'error' ? colors.red : colors.yellow
      console.log(`  ${color}${icon}${colors.reset} Line ${issue.line}: ${issue.message}`)
      console.log(`    ${colors.dim}Rule: ${issue.rule}${colors.reset}`)
    }
    console.log('')
  }

  console.log(`${colors.cyan}━━━ Summary ━━━${colors.reset}`)
  if (errors.length > 0) {
    console.log(`${colors.red}✗ ${errors.length} error(s)${colors.reset}`)
  }
  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠ ${warnings.length} warning(s)${colors.reset}`)
  }
  console.log('')
}

function main(): void {
  const args = process.argv.slice(2)

  let files: string[] = []

  if (args.includes('--staged')) {
    files = getStagedFiles()
    if (files.length === 0) {
      console.log(`${colors.dim}No staged TypeScript/JavaScript files to check${colors.reset}`)
      process.exit(0)
    }
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    // Files passed as arguments
    files = args.filter((f) => fs.existsSync(f))
  } else {
    console.log(`Usage: tsx scripts/review-checks.ts [--staged | files...]`)
    process.exit(0)
  }

  const allIssues: Issue[] = []

  for (const file of files) {
    const fullPath = path.resolve(file)
    const issues = checkFile(fullPath)
    allIssues.push(...issues)
  }

  const result: CheckResult = {
    issues: allIssues,
    passed: !allIssues.some((i) => i.severity === 'error'),
  }

  printResults(result)

  // Exit with error code if there are errors (not warnings)
  if (!result.passed) {
    console.log(`${colors.red}Review checks failed. Please fix errors before committing.${colors.reset}`)
    console.log(`${colors.dim}Tip: Run 'pnpm review' for detailed AI-powered review suggestions.${colors.reset}\n`)
    process.exit(1)
  }

  if (result.issues.length > 0) {
    console.log(`${colors.yellow}Review checks passed with warnings.${colors.reset}`)
    console.log(`${colors.dim}Consider running 'pnpm review' for detailed suggestions.${colors.reset}\n`)
  }
}

main()
