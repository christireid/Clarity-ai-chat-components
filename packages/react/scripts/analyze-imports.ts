#!/usr/bin/env tsx
/**
 * Import Analysis Script
 *
 * Analyzes import patterns to identify optimization opportunities:
 * - Namespace imports that could be named imports
 * - Imports only used as types
 * - Duplicate imports from same module
 *
 * @module scripts/analyze-imports
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

interface ImportPattern {
  file: string
  line: number
  import: string
  type: 'namespace' | 'named' | 'default' | 'type-only'
  module: string
  suggestion?: string
}

interface AnalysisReport {
  namespaceImports: ImportPattern[]
  reactNamespaceImports: ImportPattern[]
  typeOnlyCandidates: ImportPattern[]
  duplicateModules: Map<string, ImportPattern[]>
  summary: {
    totalFiles: number
    totalImports: number
    namespaceCount: number
    reactNamespaceCount: number
    duplicateModuleCount: number
  }
}

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      // Skip certain directories
      if (
        file === 'node_modules' ||
        file === 'dist' ||
        file === '__tests__' ||
        file === '__benchmarks__' ||
        file === 'examples'
      ) {
        continue
      }
      getAllTsFiles(filePath, fileList)
    } else if (
      (file.endsWith('.ts') || file.endsWith('.tsx')) &&
      !file.endsWith('.test.ts') &&
      !file.endsWith('.test.tsx') &&
      !file.endsWith('.stories.ts') &&
      !file.endsWith('.stories.tsx')
    ) {
      fileList.push(filePath)
    }
  }

  return fileList
}

async function analyzeImports(): Promise<AnalysisReport> {
  const srcDir = join(process.cwd(), 'src')
  const files = getAllTsFiles(srcDir)

  const report: AnalysisReport = {
    namespaceImports: [],
    reactNamespaceImports: [],
    typeOnlyCandidates: [],
    duplicateModules: new Map(),
    summary: {
      totalFiles: files.length,
      totalImports: 0,
      namespaceCount: 0,
      reactNamespaceCount: 0,
      duplicateModuleCount: 0,
    },
  }

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const lines = content.split('\n')
    const modulesSeen = new Map<string, ImportPattern[]>()

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      // Skip comments and non-import lines
      if (!trimmed.startsWith('import ')) return

      report.summary.totalImports++

      // Namespace imports (import * as)
      const namespaceMatch = trimmed.match(
        /import \* as (\w+) from ['"]([^'"]+)['"]/
      )
      if (namespaceMatch) {
        const [, alias, module] = namespaceMatch
        const pattern: ImportPattern = {
          file: file.replace(process.cwd(), ''),
          line: index + 1,
          import: trimmed,
          type: 'namespace',
          module,
        }

        report.namespaceImports.push(pattern)
        report.summary.namespaceCount++

        if (module === 'react') {
          report.reactNamespaceImports.push({
            ...pattern,
            suggestion: analyzeReactNamespaceUsage(content, alias),
          })
          report.summary.reactNamespaceCount++
        }

        // Track for duplicates
        if (!modulesSeen.has(module)) {
          modulesSeen.set(module, [])
        }
        modulesSeen.get(module)!.push(pattern)
      }

      // Type-only import candidates (named imports that might be type-only)
      const namedMatch = trimmed.match(
        /^import \{([^}]+)\} from ['"]([^'"]+)['"]/
      )
      if (namedMatch) {
        const [, imports, module] = namedMatch

        // Check if all imports look like types (PascalCase or Type suffix)
        const importNames = imports
          .split(',')
          .map((i) => i.trim().split(' as ')[0])
        const allLikelyTypes = importNames.every(
          (name) =>
            /^[A-Z]/.test(name) ||
            name.endsWith('Type') ||
            name.endsWith('Props')
        )

        if (allLikelyTypes && !trimmed.startsWith('import type')) {
          report.typeOnlyCandidates.push({
            file: file.replace(process.cwd(), ''),
            line: index + 1,
            import: trimmed,
            type: 'named',
            module,
            suggestion: trimmed.replace('import {', 'import type {'),
          })
        }

        // Track for duplicates
        const pattern: ImportPattern = {
          file: file.replace(process.cwd(), ''),
          line: index + 1,
          import: trimmed,
          type: 'named',
          module,
        }
        if (!modulesSeen.has(module)) {
          modulesSeen.set(module, [])
        }
        modulesSeen.get(module)!.push(pattern)
      }
    })

    // Check for duplicate imports
    modulesSeen.forEach((patterns, module) => {
      if (patterns.length > 1) {
        report.duplicateModules.set(module, patterns)
        report.summary.duplicateModuleCount++
      }
    })
  }

  return report
}

function analyzeReactNamespaceUsage(
  content: string,
  namespace: string
): string {
  const hooks = [
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useCallback',
    'useMemo',
    'useRef',
    'useLayoutEffect',
  ]

  const types = [
    'FC',
    'ReactNode',
    'ReactElement',
    'ComponentProps',
    'ComponentType',
    'PropsWithChildren',
  ]

  const usedHooks = hooks.filter((hook) =>
    content.includes(`${namespace}.${hook}`)
  )
  const usedTypes = types.filter((type) =>
    content.includes(`${namespace}.${type}`)
  )

  const hasJsx = /<[A-Z][a-zA-Z0-9]*/.test(content)
  const hasCreateElement = content.includes(`${namespace}.createElement`)

  if (
    hasCreateElement ||
    (!hasJsx && usedHooks.length === 0 && usedTypes.length === 0)
  ) {
    return 'Keep namespace (uses React API directly)'
  }

  const suggestions: string[] = []

  if (usedHooks.length > 0) {
    suggestions.push(`import { ${usedHooks.join(', ')} } from 'react'`)
  }

  if (usedTypes.length > 0) {
    suggestions.push(`import type { ${usedTypes.join(', ')} } from 'react'`)
  }

  if (suggestions.length === 0 && hasJsx) {
    return 'Can remove (JSX transform handles React)'
  }

  return suggestions.join('\n')
}

function printReport(report: AnalysisReport): void {
  console.log('\n' + '='.repeat(80))
  console.log('IMPORT ANALYSIS REPORT')
  console.log('='.repeat(80) + '\n')

  console.log('SUMMARY')
  console.log('-'.repeat(80))
  console.log(`Total files analyzed: ${report.summary.totalFiles}`)
  console.log(`Total imports found: ${report.summary.totalImports}`)
  console.log(`Namespace imports: ${report.summary.namespaceCount}`)
  console.log(`  └─ React namespace: ${report.summary.reactNamespaceCount}`)
  console.log(`Type-only candidates: ${report.typeOnlyCandidates.length}`)
  console.log(
    `Modules with duplicate imports: ${report.summary.duplicateModuleCount}`
  )

  // React namespace imports
  if (report.reactNamespaceImports.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('REACT NAMESPACE IMPORTS (High Priority)')
    console.log('='.repeat(80) + '\n')
    console.log(
      'Modern React with JSX transform often doesn\'t need "import * as React"\n'
    )

    const sample = report.reactNamespaceImports.slice(0, 10)
    sample.forEach((pattern) => {
      console.log(`📁 ${pattern.file}:${pattern.line}`)
      console.log(`   Current:  ${pattern.import}`)
      if (pattern.suggestion) {
        console.log(`   Suggest:  ${pattern.suggestion}`)
      }
      console.log('')
    })

    if (report.reactNamespaceImports.length > 10) {
      console.log(`... and ${report.reactNamespaceImports.length - 10} more\n`)
    }

    console.log('💡 TIP: With modern JSX transform, you typically only need:')
    console.log(
      '   - Named imports for hooks: import { useState, useEffect } from "react"'
    )
    console.log(
      '   - Type imports for types: import type { FC, ReactNode } from "react"'
    )
  }

  // Other namespace imports
  const nonReactNamespace = report.namespaceImports.filter(
    (p) => p.module !== 'react'
  )
  if (nonReactNamespace.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('OTHER NAMESPACE IMPORTS')
    console.log('='.repeat(80) + '\n')

    const moduleCounts = new Map<string, number>()
    nonReactNamespace.forEach((p) => {
      moduleCounts.set(p.module, (moduleCounts.get(p.module) || 0) + 1)
    })

    const sorted = Array.from(moduleCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )
    sorted.slice(0, 10).forEach(([module, count]) => {
      console.log(`  ${count.toString().padStart(3)} × ${module}`)
    })

    console.log(
      '\n💡 TIP: Consider converting to named imports for better tree-shaking:'
    )
    console.log(
      '   - import * as utils from "./utils" → import { fn1, fn2 } from "./utils"'
    )
  }

  // Type-only candidates
  if (report.typeOnlyCandidates.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('TYPE-ONLY IMPORT CANDIDATES')
    console.log('='.repeat(80) + '\n')
    console.log(
      'These imports appear to only import types and could use "import type"\n'
    )

    const sample = report.typeOnlyCandidates.slice(0, 10)
    sample.forEach((pattern) => {
      console.log(`📁 ${pattern.file}:${pattern.line}`)
      console.log(`   Current:  ${pattern.import}`)
      console.log(`   Suggest:  ${pattern.suggestion}`)
      console.log('')
    })

    if (report.typeOnlyCandidates.length > 10) {
      console.log(`... and ${report.typeOnlyCandidates.length - 10} more\n`)
    }

    console.log(
      '💡 TIP: Type-only imports are erased at runtime, reducing bundle size'
    )
  }

  // Duplicate imports
  if (report.duplicateModules.size > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('DUPLICATE MODULE IMPORTS')
    console.log('='.repeat(80) + '\n')
    console.log('These modules are imported multiple times in the same file\n')

    const sample = Array.from(report.duplicateModules.entries()).slice(0, 5)
    sample.forEach(([module, patterns]) => {
      console.log(`📦 ${module} (${patterns.length} imports)`)
      patterns.forEach((p) => {
        console.log(`   ${p.file}:${p.line} → ${p.import}`)
      })
      console.log('')
    })

    if (report.duplicateModules.size > 5) {
      console.log(`... and ${report.duplicateModules.size - 5} more modules\n`)
    }

    console.log('💡 TIP: Consolidate these into a single import statement')
  }

  // Recommendations
  console.log('\n' + '='.repeat(80))
  console.log('RECOMMENDATIONS')
  console.log('='.repeat(80) + '\n')

  const totalOptimizations =
    report.reactNamespaceImports.length +
    nonReactNamespace.length +
    report.typeOnlyCandidates.length +
    report.duplicateModules.size

  if (totalOptimizations > 0) {
    console.log('Estimated bundle size impact:')
    console.log(
      `  • ${report.reactNamespaceImports.length} React namespaces → ~${report.reactNamespaceImports.length * 0.5}KB savings`
    )
    console.log(
      `  • ${nonReactNamespace.length} other namespaces → Better tree-shaking`
    )
    console.log(
      `  • ${report.typeOnlyCandidates.length} type-only candidates → Runtime size reduction`
    )
    console.log(
      `  • ${report.duplicateModules.size} duplicate consolidations → Cleaner code\n`
    )

    console.log('Next steps:')
    console.log('  1. Update tsconfig.json with "verbatimModuleSyntax": true')
    console.log('  2. Convert React namespace imports to named/type imports')
    console.log('  3. Add type-only modifiers where appropriate')
    console.log('  4. Consolidate duplicate imports')
    console.log('  5. Verify build with bundle analyzer')
  } else {
    console.log('✅ All imports are well-optimized!')
  }

  console.log('\n' + '='.repeat(80) + '\n')
}

// Main
async function main() {
  console.log('Analyzing import patterns...\n')

  const report = await analyzeImports()
  printReport(report)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
