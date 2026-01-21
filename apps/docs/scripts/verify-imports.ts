#!/usr/bin/env tsx
/**
 * Import Verification Script
 * 
 * Verifies all imports from @clarity-chat/react in the docs app
 * against what's actually exported from the package.
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

interface ImportIssue {
  file: string
  line: number
  import: string
  issue: 'missing' | 'typo' | 'incorrect'
}

const issues: ImportIssue[] = []

// Read all exports from public-api.ts
function getExports(): Set<string> {
  const publicApiPath = join(
    process.cwd(),
    '../../packages/react/src/public-api.ts'
  )
  const content = readFileSync(publicApiPath, 'utf-8')
  const exports = new Set<string>()

  // Extract exports from export statements
  const exportRegex = /export\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))/g
  let match

  while ((match = exportRegex.exec(content)) !== null) {
    if (match[1]) {
      // Named exports: { a, b, c }
      const names = match[1]
        .split(',')
        .map((n) => n.trim().replace(/\s+as\s+\w+/, '').replace(/:\s*.*/, ''))
        .filter((n) => !n.startsWith('type ') && n.length > 0)
      names.forEach((name) => exports.add(name))
    } else if (match[2]) {
      // Single export: export Something
      exports.add(match[2])
    }
  }

  return exports
}

// Find all TypeScript files in a directory
function findTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  files.forEach((file) => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules, .next, dist, etc.
      if (
        !file.startsWith('.') &&
        file !== 'node_modules' &&
        file !== '.next' &&
        file !== 'dist'
      ) {
        findTsFiles(filePath, fileList)
      }
    } else if (
      ['.ts', '.tsx'].includes(extname(file)) &&
      !file.includes('.test.') &&
      !file.includes('.spec.')
    ) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Extract imports from a file
function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8')
  const imports: string[] = []
  const lines = content.split('\n')

  let inImport = false
  let importBuffer = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.includes("from '@clarity-chat/react'")) {
      // Extract import names
      const importMatch = line.match(/import\s+(?:\{([^}]+)\}|(\w+))/)
      if (importMatch) {
        if (importMatch[1]) {
          // Named imports
          const names = importMatch[1]
            .split(',')
            .map((n) =>
              n
                .trim()
                .replace(/\s+as\s+\w+/, '')
                .replace(/:\s*.*/, '')
                .replace(/^type\s+/, '')
            )
            .filter((n) => n.length > 0)
          imports.push(...names)
        } else if (importMatch[2]) {
          // Default import
          imports.push(importMatch[2])
        }
      }
    }
  }

  return imports
}

// Main verification
function verifyImports() {
  const exports = getExports()
  const docsDir = join(process.cwd(), 'app')
  const files = findTsFiles(docsDir)

  console.log(`Checking ${files.length} files...`)
  console.log(`Found ${exports.size} exports`)

  files.forEach((file) => {
    const imports = extractImports(file)
    imports.forEach((imp) => {
      if (!exports.has(imp)) {
        issues.push({
          file: file.replace(process.cwd(), ''),
          line: 0, // Would need to track line numbers
          import: imp,
          issue: 'missing',
        })
      }
    })
  })

  if (issues.length > 0) {
    console.log(`\nFound ${issues.length} import issues:\n`)
    issues.forEach((issue) => {
      console.log(`  ${issue.file}`)
      console.log(`    Missing: ${issue.import}`)
    })
    process.exit(1)
  } else {
    console.log('\n✓ All imports verified successfully!')
    process.exit(0)
  }
}

verifyImports()
