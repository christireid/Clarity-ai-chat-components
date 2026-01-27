#!/usr/bin/env node
/**
 * Export Verification Script
 *
 * Validates that all exports in public-api.ts actually exist.
 * Prevents "Cannot find module" build errors.
 *
 * Usage: node scripts/verify-exports.js
 * Exit: 0 if valid, 1 if errors found
 */

const fs = require('fs')
const path = require('path')

const PUBLIC_API_PATH = path.join(__dirname, '../src/public-api.ts')
const SRC_DIR = path.join(__dirname, '../src')

// Read public-api.ts
const publicApiContent = fs.readFileSync(PUBLIC_API_PATH, 'utf-8')

// Extract all import paths
const importRegex = /from\s+['"](.+)['"]/g
const matches = [...publicApiContent.matchAll(importRegex)]

let errors = 0
let checked = 0

console.log('🔍 Verifying exports in public-api.ts...\n')

for (const match of matches) {
  const importPath = match[1]

  // Skip external packages
  if (!importPath.startsWith('.')) {
    continue
  }

  checked++

  // Resolve relative path
  const resolvedPath = path.join(path.dirname(PUBLIC_API_PATH), importPath)

  // Check if file exists (try .ts, .tsx extensions)
  const possiblePaths = [
    resolvedPath + '.ts',
    resolvedPath + '.tsx',
    path.join(resolvedPath, 'index.ts'),
    path.join(resolvedPath, 'index.tsx'),
  ]

  const exists = possiblePaths.some((p) => {
    try {
      return fs.existsSync(p)
    } catch {
      return false
    }
  })

  if (!exists) {
    console.error(`❌ Missing: ${importPath}`)
    errors++
  } else {
    console.log(`✅ Valid: ${importPath}`)
  }
}

console.log(
  `\n📊 Results: ${checked} imports checked, ${errors} errors found\n`
)

if (errors > 0) {
  console.error('❌ Export verification FAILED\n')
  process.exit(1)
} else {
  console.log('✅ All exports verified successfully\n')
  process.exit(0)
}
