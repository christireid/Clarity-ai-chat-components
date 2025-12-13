/**
 * Import Management Utilities
 * Shared utilities for managing imports in TypeScript/JavaScript files
 */

import * as vscode from 'vscode'

/**
 * Add an import statement to a file, merging with existing @clarity-chat/react imports if present
 */
export async function addImportToFile(
  editor: vscode.TextEditor,
  importStatement: string
): Promise<void> {
  const document = editor.document
  const text = document.getText()

  // Check if we can merge with existing import
  const existingImportMatch = text.match(
    /import\s+\{([^}]+)\}\s+from\s+['"]@clarity-chat\/react['"]/
  )

  if (existingImportMatch) {
    // Extract new import items
    const newImportMatch = importStatement.match(/import\s+\{([^}]+)\}/)
    if (newImportMatch) {
      const existingImports = existingImportMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const newImports = newImportMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      // Merge and deduplicate
      const mergedImports = [...new Set([...existingImports, ...newImports])]

      // Replace the existing import with merged version
      const mergedStatement = `import { ${mergedImports.join(', ')} } from '@clarity-chat/react'`
      const startIndex = text.indexOf(existingImportMatch[0])
      const endIndex = startIndex + existingImportMatch[0].length

      const startPos = document.positionAt(startIndex)
      const endPos = document.positionAt(endIndex)

      await editor.edit((editBuilder) => {
        editBuilder.replace(new vscode.Range(startPos, endPos), mergedStatement)
      })
      return
    }
  }

  // No existing import, add new one
  const importLocation = findImportLocation(document)
  await editor.edit((editBuilder) => {
    editBuilder.insert(importLocation, importStatement + '\n')
  })
}

/**
 * Find the best location to insert a new import statement
 */
export function findImportLocation(document: vscode.TextDocument): vscode.Position {
  const text = document.getText()
  const lines = text.split('\n')

  // Find the last import statement
  let lastImportLine = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('import ') || line.startsWith('import{')) {
      lastImportLine = i
    } else if (
      lastImportLine >= 0 &&
      line &&
      !line.startsWith('//') &&
      !line.startsWith('/*')
    ) {
      // Found non-import, non-comment line after imports
      break
    }
  }

  if (lastImportLine >= 0) {
    return new vscode.Position(lastImportLine + 1, 0)
  }

  // No imports found, insert at the beginning (after any 'use client' directive)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (
      lines[i].includes("'use client'") ||
      lines[i].includes('"use client"')
    ) {
      return new vscode.Position(i + 1, 0)
    }
  }

  return new vscode.Position(0, 0)
}

/**
 * Strip icon prefix from a QuickPick label
 * Converts "$(icon) Text" to "Text"
 */
export function stripIconPrefix(label: string): string {
  return label.replace(/^\$\([^)]+\)\s*/, '')
}

/**
 * Add an icon prefix to a label
 */
export function addIconPrefix(label: string, icon: string): string {
  const strippedLabel = stripIconPrefix(label)
  return `$(${icon}) ${strippedLabel}`
}
