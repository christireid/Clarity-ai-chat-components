/**
 * Import Management Utilities
 * Shared utilities for managing imports in TypeScript/JavaScript files
 *
 * @module import-utils
 */
import * as vscode from 'vscode';
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
export declare function addImportToFile(editor: vscode.TextEditor, importStatement: string): Promise<void>;
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
export declare function findImportLocation(document: vscode.TextDocument): vscode.Position;
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
export declare function stripIconPrefix(label: string): string;
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
export declare function addIconPrefix(label: string, icon: string): string;
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
export declare function hasImport(text: string, importName: string): boolean;
/**
 * Generate a cryptographic nonce for Content Security Policy.
 * Used in webview HTML to allow inline scripts while maintaining CSP security.
 *
 * @returns A 32-character random alphanumeric string
 *
 * @example
 * const nonce = getNonce()
 * // Returns something like: "ABC123xyz789DEFghi456JKLmno012PQR"
 *
 * // Usage in CSP header:
 * `<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}';">`
 */
export declare function getNonce(): string;
//# sourceMappingURL=import-utils.d.ts.map