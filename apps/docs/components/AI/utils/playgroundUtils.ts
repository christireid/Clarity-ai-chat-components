/**
 * Code Playground Utilities
 *
 * Functions for extracting code blocks from markdown and generating
 * playground URLs (CodeSandbox) for interactive code exploration.
 */

export interface CodeBlock {
  language: string
  code: string
  startIndex: number
  endIndex: number
}

/**
 * Extract code blocks from markdown content
 *
 * Improved regex to handle:
 * - Optional language identifier
 * - Whitespace variations
 * - Code blocks without immediate newlines
 */
export function extractCodeBlocks(content: string): CodeBlock[] {
  // Regex explanation:
  // ```             Match opening backticks
  // (?:[\w-]+)?     Non-capturing group for optional language (alphanumeric + hyphens)
  // \s*             Match any whitespace (newlines, spaces) after opening
  // ([\s\S]*?)      Capture the code content (non-greedy)
  // \s*             Match any trailing whitespace
  // ```             Match closing backticks
  const codeBlockRegex = /```(?:([\w-]+)?)?\s*([\s\S]*?)\s*```/g
  const blocks: CodeBlock[] = []
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // If language group is undefined, default to text
    const language = match[1] || 'text'
    const code = match[2].trim()

    // Skip empty blocks
    if (!code) continue

    blocks.push({
      language: language.toLowerCase(),
      code,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  return blocks
}

/**
 * Detect if code is React/TypeScript and suitable for playground
 */
export function isPlaygroundCompatible(
  language: string,
  code: string
): boolean {
  const supportedLanguages = [
    'tsx',
    'jsx',
    'typescript',
    'javascript',
    'ts',
    'js',
    'react',
  ]
  if (!supportedLanguages.includes(language.toLowerCase())) return false

  // Check for React-like patterns
  const reactPatterns = [
    /import.*from\s+['"]react['"]/,
    /import.*@clarity-chat/,
    /<\w+[\s/>]/, // JSX tags
    /export\s+(default\s+)?function/,
    /const.*=.*\(.*\)\s*=>/, // Arrow function components
    /class.*extends.*Component/,
  ]

  return reactPatterns.some((pattern) => pattern.test(code))
}

/**
 * Generate CodeSandbox URL for React code
 */
export function generateCodeSandboxUrl(
  code: string,
  _language: string
): string {
  // Wrap code in a basic React app structure if needed
  const hasImport = /import.*from/.test(code)

  let fullCode = code

  // Add basic React imports if not present
  if (!hasImport) {
    fullCode = `import React from 'react';\nimport { useState } from 'react';\n\n${code}`
  }

  // Create CodeSandbox parameters
  const files = {
    'App.tsx': {
      content: fullCode,
    },
    'index.tsx': {
      content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
`,
    },
    'package.json': {
      content: JSON.stringify(
        {
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            '@clarity-chat/react': 'latest',
            'lucide-react': 'latest',
            'framer-motion': 'latest',
            clsx: 'latest',
            'tailwind-merge': 'latest',
          },
          devDependencies: {
            typescript: '^5.0.0',
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0',
          },
        },
        null,
        2
      ),
    },
  }

  // Encode for URL - convert UTF-8 to base64 safely
  // Use chunked approach to avoid "Maximum call stack size exceeded" with large payloads
  const filesJson = JSON.stringify({ files })
  const encoder = new TextEncoder()
  const bytes = encoder.encode(filesJson)

  // Convert bytes to base64 in chunks to avoid stack overflow
  let binary = ''
  const chunkSize = 8192
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  const encoded = btoa(binary)

  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${encoded}`
}

/**
 * Result of opening playground
 */
export interface OpenPlaygroundResult {
  success: boolean
  url: string
  error?: string
}

/**
 * Open code in playground (CodeSandbox by default)
 * Returns result object for handling popup blockers
 */
export function openInPlayground(
  code: string,
  language: string
): OpenPlaygroundResult {
  // SSR safety check
  if (typeof window === 'undefined') {
    return { success: false, url: '', error: 'Not in browser environment' }
  }

  const url = generateCodeSandboxUrl(code, language)

  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')

    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === 'undefined'
    ) {
      // Popup was blocked
      return {
        success: false,
        url,
        error: 'Popup was blocked. Please allow popups for this site.',
      }
    }

    return { success: true, url }
  } catch (e) {
    return {
      success: false,
      url,
      error: e instanceof Error ? e.message : 'Failed to open playground',
    }
  }
}
