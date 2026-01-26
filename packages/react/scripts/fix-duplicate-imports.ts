#!/usr/bin/env tsx
/**
 * Duplicate Import Fixer
 *
 * Consolidates duplicate imports from the same module into a single import statement.
 *
 * @module scripts/fix-duplicate-imports
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

interface FixResult {
  filesProcessed: number
  filesModified: number
  duplicatesFixed: number
  errors: string[]
}

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
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

interface Import {
  line: number
  full: string
  module: string
  isTypeOnly: boolean
  defaultImport?: string
  namedImports: string[]
  namespaceImport?: string
}

function parseImport(line: string): Import | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('import ')) return null

  // Extract module
  const moduleMatch = trimmed.match(/from ['"]([^'"]+)['"]/)
  if (!moduleMatch) return null

  const module = moduleMatch[1]
  const isTypeOnly = trimmed.startsWith('import type ')

  const result: Import = {
    line: 0,
    full: trimmed,
    module,
    isTypeOnly,
    namedImports: [],
  }

  // Check for namespace import
  const namespaceMatch = trimmed.match(/import \* as (\w+)/)
  if (namespaceMatch) {
    result.namespaceImport = namespaceMatch[1]
    return result
  }

  // Extract default import
  const defaultMatch = trimmed.match(/^import\s+(?:type\s+)?(\w+)\s*,?\s*/)
  if (defaultMatch && !trimmed.includes('{')) {
    result.defaultImport = defaultMatch[1]
  } else if (defaultMatch && trimmed.includes('{')) {
    result.defaultImport = defaultMatch[1]
  }

  // Extract named imports
  const namedMatch = trimmed.match(/\{([^}]+)\}/)
  if (namedMatch) {
    result.namedImports = namedMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  return result
}

function consolidateImports(imports: Import[]): string[] {
  const consolidated: string[] = []

  // Separate value and type imports
  const valueImports = imports.filter((imp) => !imp.isTypeOnly)
  const typeImports = imports.filter((imp) => imp.isTypeOnly)

  // Consolidate value imports
  if (valueImports.length > 0) {
    const defaultImport = valueImports.find(
      (imp) => imp.defaultImport
    )?.defaultImport
    const allNamed = new Set<string>()
    const hasNamespace = valueImports.some((imp) => imp.namespaceImport)

    valueImports.forEach((imp) => {
      imp.namedImports.forEach((n) => allNamed.add(n))
    })

    if (hasNamespace) {
      // Keep namespace import as-is
      const namespaceImport = valueImports.find((imp) => imp.namespaceImport)
      if (namespaceImport) {
        consolidated.push(namespaceImport.full)
      }
    } else {
      let importStr = 'import '

      if (defaultImport) {
        importStr += defaultImport
        if (allNamed.size > 0) {
          importStr += ', '
        }
      }

      if (allNamed.size > 0) {
        importStr += `{ ${Array.from(allNamed).sort().join(', ')} }`
      }

      importStr += ` from '${valueImports[0].module}'`
      consolidated.push(importStr)
    }
  }

  // Consolidate type imports
  if (typeImports.length > 0) {
    const defaultImport = typeImports.find(
      (imp) => imp.defaultImport
    )?.defaultImport
    const allNamed = new Set<string>()

    typeImports.forEach((imp) => {
      imp.namedImports.forEach((n) => allNamed.add(n))
    })

    let importStr = 'import type '

    if (defaultImport) {
      importStr += defaultImport
      if (allNamed.size > 0) {
        importStr += ', '
      }
    }

    if (allNamed.size > 0) {
      importStr += `{ ${Array.from(allNamed).sort().join(', ')} }`
    }

    importStr += ` from '${typeImports[0].module}'`
    consolidated.push(importStr)
  }

  return consolidated
}

function fixDuplicateImports(filePath: string): number {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Parse all imports
  const imports: Import[] = []
  const importLineNumbers = new Set<number>()

  for (let i = 0; i < lines.length; i++) {
    const parsed = parseImport(lines[i])
    if (parsed) {
      parsed.line = i
      imports.push(parsed)
      importLineNumbers.add(i)
    }
  }

  if (imports.length === 0) return 0

  // Group by module
  const byModule = new Map<string, Import[]>()
  imports.forEach((imp) => {
    if (!byModule.has(imp.module)) {
      byModule.set(imp.module, [])
    }
    byModule.get(imp.module)!.push(imp)
  })

  // Find duplicates
  const duplicateModules = Array.from(byModule.entries()).filter(
    ([, imps]) => imps.length > 1
  )

  if (duplicateModules.length === 0) return 0

  // Build new lines array
  const newLines: string[] = []
  const skipLines = new Set<number>()

  duplicateModules.forEach(([module, imps]) => {
    const consolidated = consolidateImports(imps)

    // Mark all import lines for this module for skipping
    imps.forEach((imp) => skipLines.add(imp.line))

    // We'll insert consolidated imports at the position of the first import
    const firstLine = Math.min(...imps.map((imp) => imp.line))

    // Store consolidated imports to insert later
    if (!newLines[firstLine]) {
      newLines[firstLine] = consolidated.join('\n')
    }
  })

  // Build final content
  let finalLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (skipLines.has(i)) {
      // Insert consolidated imports at first occurrence
      if (newLines[i]) {
        finalLines.push(newLines[i])
      }
      continue
    }
    finalLines.push(lines[i])
  }

  writeFileSync(filePath, finalLines.join('\n'), 'utf-8')
  return duplicateModules.length
}

async function main() {
  console.log('Fixing duplicate imports...\n')

  const result: FixResult = {
    filesProcessed: 0,
    filesModified: 0,
    duplicatesFixed: 0,
    errors: [],
  }

  const srcDir = join(process.cwd(), 'src')
  const files = getAllTsFiles(srcDir)

  console.log(`Found ${files.length} TypeScript files\n`)

  for (const file of files) {
    try {
      result.filesProcessed++
      const duplicatesFixed = fixDuplicateImports(file)

      if (duplicatesFixed > 0) {
        result.filesModified++
        result.duplicatesFixed += duplicatesFixed
        const shortPath = file.replace(process.cwd(), '')
        console.log(`✓ ${shortPath} (${duplicatesFixed} modules)`)
      }

      if (result.filesProcessed % 100 === 0) {
        console.log(`  Processed ${result.filesProcessed}/${files.length}...`)
      }
    } catch (error) {
      result.errors.push(
        `${file}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('RESULTS')
  console.log('='.repeat(80))
  console.log(`Files processed: ${result.filesProcessed}`)
  console.log(`Files modified: ${result.filesModified}`)
  console.log(`Duplicates fixed: ${result.duplicatesFixed}`)
  console.log(`Errors: ${result.errors.length}`)

  if (result.errors.length > 0) {
    console.log('\nErrors:')
    result.errors.forEach((err) => console.log(`  - ${err}`))
  }

  if (result.filesModified > 0) {
    console.log('\n✅ Duplicate imports consolidated!')
    console.log('   Run `pnpm typecheck` to verify no errors were introduced.')
  } else {
    console.log('\n✅ No duplicate imports found.')
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
