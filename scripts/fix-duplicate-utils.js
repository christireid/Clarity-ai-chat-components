#!/usr/bin/env node

/**
 * Fix Duplicate Utility Functions
 * Replaces all duplicate formatBytes implementations with imports from primitives
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DUPLICATE_FUNCTIONS = {
  'formatBytes': {
    patterns: [
      /function formatBytes\(bytes: number\): string \{[\s\S]*?return.*\}/g,
      /const formatBytes = \(bytes: number\): string => \{[\s\S]*?return.*\}/g,
      /formatBytes\(bytes: number\): string \{[\s\S]*?return.*\}/g
    ],
    replacement: '',
    import: "import { formatBytes } from '@clarity-chat/primitives'"
  }
}

const FILES_TO_FIX = [
  'packages/react/src/components/dashboards/performance-analytics-dashboard.tsx',
  'packages/react/src/components/dashboards/performance-dashboard.tsx',
  'packages/react/src/components/media/batch-export-dialog.tsx',
  'packages/react/src/components/ui/progress.tsx',
  'packages/react/src/internal/helpers.ts',
  'packages/react/src/bundle-analyzer/bundle-analyzer.ts'
]

function findDuplicateFunctions(content, functionName) {
  const patterns = DUPLICATE_FUNCTIONS[functionName].patterns
  const matches = []
  
  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[0]
      })
    }
  })
  
  return matches
}

function hasImport(content, importStatement) {
  return content.includes(importStatement)
}

function addImport(content, importStatement) {
  // Find the last import statement
  const importRegex = /^import\s+.*$/gm
  const matches = [...content.matchAll(importRegex)]
  
  if (matches.length > 0) {
    const lastImport = matches[matches.length - 1]
    const insertPosition = lastImport.index + lastImport[0].length
    return content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition)
  } else {
    // No imports found, add at the beginning
    return importStatement + '\n' + content
  }
}

function fixFile(filePath) {
  console.log(`Processing: ${filePath}`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`)
    return false
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false
  
  // Check for duplicate formatBytes functions
  const duplicates = findDuplicateFunctions(content, 'formatBytes')
  
  if (duplicates.length > 0) {
    console.log(`  Found ${duplicates.length} duplicate formatBytes function(s)`)
    
    // Remove the duplicate functions (in reverse order to maintain positions)
    duplicates.reverse().forEach(duplicate => {
      content = content.slice(0, duplicate.start) + content.slice(duplicate.end)
    })
    
    // Add import if not already present
    const importStatement = DUPLICATE_FUNCTIONS.formatBytes.import
    if (!hasImport(content, importStatement)) {
      content = addImport(content, importStatement)
      console.log(`  Added import: ${importStatement}`)
    }
    
    modified = true
  }
  
  if (modified) {
    // Backup original file
    const backupPath = filePath + '.backup'
    fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf-8'))
    
    // Write modified content
    fs.writeFileSync(filePath, content)
    console.log(`  ✅ Fixed and backed up to: ${backupPath}`)
    return true
  } else {
    console.log(`  ℹ️  No duplicates found`)
    return false
  }
}

function main() {
  console.log('🔧 Fixing Duplicate Utility Functions')
  console.log('='.repeat(50))
  
  let fixedCount = 0
  
  FILES_TO_FIX.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fixFile(fullPath)) {
      fixedCount++
    }
  })
  
  console.log('\n' + '='.repeat(50))
  console.log(`✅ Fixed ${fixedCount} files`)
  console.log('\nNext steps:')
  console.log('1. Review the changes in each file')
  console.log('2. Run tests to ensure functionality is preserved')
  console.log('3. Remove backup files once verified')
  console.log('4. Update imports in other files as needed')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { findDuplicateFunctions, fixFile }