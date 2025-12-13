/**
 * Import Management Utilities
 * Shared utilities for managing imports in TypeScript/JavaScript files
 *
 * @module import-utils
 */

import * as vscode from 'vscode'

/**
 * Regular expression to match @clarity-chat/react imports
 * Uses the 's' flag to handle multiline imports where the import statement
 * spans multiple lines (common in formatted code)
 *
 * @example
 * // Matches single-line:
 * import { ClarityChat } from '@clarity-chat/react'
 *
 * // Also matches multiline:
 * import {
 *   ClarityChat,
 *   ChatInput
 * } from '@clarity-chat/react'
 */
const CLARITY_IMPORT_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+['"]@clarity-chat\/react['"]/s

/**
 * Add an import statement to a file, merging with existing @clarity-chat/react imports if present.
 *
 * This function intelligently handles import management:
 * - If no @clarity-chat/react import exists, adds a new import statement
 * - If an import exists, merges the new imports with existing ones
 * - Handles both single-line and multiline import statements
 * - Deduplicates imports automatically
 *
 * @param editor - The VS Code text editor containing the file to modify
 * @param importStatement - The full import statement to add
 *
 * @example
 * // Add a single import
 * await addImportToFile(editor, "import { ClarityChat } from '@clarity-chat/react'")
 *
 * // If file already has: import { ChatInput } from '@clarity-chat/react'
 * // Result will be: import { ChatInput, ClarityChat } from '@clarity-chat/react'
 */
export async function addImportToFile(
  editor: vscode.TextEditor,
  importStatement: string
): Promise<void> {
  const document = editor.document
  const text = document.getText()

  // Check if we can merge with existing import (supports multiline)
  const existingImportMatch = text.match(CLARITY_IMPORT_REGEX)

  if (existingImportMatch) {
    // Extract new import items
    const newImportMatch = importStatement.match(/import\s+\{([^}]+)\}/s)
    if (newImportMatch) {
      const existingImports = parseImportNames(existingImportMatch[1])
      const newImports = parseImportNames(newImportMatch[1])

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
 * Parse import names from the content between curly braces in an import statement.
 * Handles multiline imports, type imports, and various whitespace patterns.
 *
 * @param importContent - The content between { and } in an import statement
 * @returns Array of trimmed import names
 *
 * @example
 * parseImportNames('ClarityChat, ChatInput') // ['ClarityChat', 'ChatInput']
 * parseImportNames('  ClarityChat  ,\n  ChatInput  ') // ['ClarityChat', 'ChatInput']
 * parseImportNames('type Message, ClarityChat') // ['type Message', 'ClarityChat']
 */
function parseImportNames(importContent: string): string[] {
  return importContent
    .split(',')
    .map((s) => s.trim().replace(/\s+/g, ' ')) // Normalize internal whitespace
    .filter(Boolean)
}

/**
 * Find the best location to insert a new import statement in a document.
 *
 * The algorithm follows these priorities:
 * 1. After the last existing import statement
 * 2. After 'use client' directive (for Next.js)
 * 3. At the beginning of the file
 *
 * @param document - The VS Code text document to search
 * @returns Position where the new import should be inserted
 *
 * @example
 * // Given a file:
 * // import { useState } from 'react'
 * // import { useEffect } from 'react'
 * //
 * // function App() {}
 *
 * // Returns: Position(line: 2, character: 0)
 */
export function findImportLocation(document: vscode.TextDocument): vscode.Position {
  const text = document.getText()
  const lines = text.split('\n')

  // Find the last import statement
  let lastImportLine = -1
  let inMultilineImport = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Track multiline imports
    if (line.startsWith('import ') || line.startsWith('import{')) {
      lastImportLine = i
      // Check if this is a multiline import (no closing brace on same line with 'from')
      if (line.includes('{') && !line.includes('}')) {
        inMultilineImport = true
      } else if (line.includes('from')) {
        inMultilineImport = false
      }
    } else if (inMultilineImport) {
      // Continue tracking multiline import
      lastImportLine = i
      if (line.includes('from')) {
        inMultilineImport = false
      }
    } else if (
      lastImportLine >= 0 &&
      line &&
      !line.startsWith('//') &&
      !line.startsWith('/*') &&
      !line.startsWith('*')
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
 * Strip VS Code icon prefix from a QuickPick label.
 * VS Code QuickPick items can have icon prefixes like "$(icon-name)".
 * This function removes such prefixes to get the clean label text.
 *
 * @param label - The label that may contain an icon prefix
 * @returns The label with the icon prefix removed
 *
 * @example
 * stripIconPrefix('$(symbol-method) useClarityChat') // 'useClarityChat'
 * stripIconPrefix('$(loading~spin) Loading') // 'Loading'
 * stripIconPrefix('Plain Text') // 'Plain Text'
 */
export function stripIconPrefix(label: string): string {
  return label.replace(/^\$\([^)]+\)\s*/, '')
}

/**
 * Add a VS Code icon prefix to a label.
 * If the label already has an icon prefix, it will be replaced.
 *
 * @param label - The base label text
 * @param icon - The icon name (without $() wrapper)
 * @returns The label with the icon prefix added
 *
 * @example
 * addIconPrefix('ClarityChat', 'symbol-class') // '$(symbol-class) ClarityChat'
 * addIconPrefix('$(old-icon) Text', 'new-icon') // '$(new-icon) Text'
 */
export function addIconPrefix(label: string, icon: string): string {
  const strippedLabel = stripIconPrefix(label)
  return `$(${icon}) ${strippedLabel}`
}

/**
 * Check if an import statement already exists in a file.
 *
 * @param text - The full text content of the file
 * @param importName - The name of the import to check for
 * @returns True if the import exists in a @clarity-chat/react import
 *
 * @example
 * hasImport(fileContent, 'ClarityChat') // true if ClarityChat is imported
 */
export function hasImport(text: string, importName: string): boolean {
  const match = text.match(CLARITY_IMPORT_REGEX)
  if (!match) return false

  const imports = parseImportNames(match[1])
  return imports.some((imp) => imp === importName || imp.endsWith(` ${importName}`))
}
