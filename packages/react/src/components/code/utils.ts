/**
 * Code Block Utility Functions
 *
 * Helper functions for parsing line ranges, escaping HTML,
 * and other code block operations
 *
 * @packageDocumentation
 */

/**
 * Parse line range string into a Set of line numbers
 *
 * @param rangeString - Comma-separated ranges like "2,5-7,10"
 * @returns Set of line numbers
 *
 * @example
 * parseLineRanges("2,5-7,10") // Set { 2, 5, 6, 7, 10 }
 * parseLineRanges("1-3") // Set { 1, 2, 3 }
 */
export function parseLineRanges(rangeString?: string): Set<number> {
  const result = new Set<number>()
  if (!rangeString) return result

  const parts = rangeString.split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-')
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          result.add(i)
        }
      }
    } else {
      const num = parseInt(trimmed, 10)
      if (!isNaN(num)) {
        result.add(num)
      }
    }
  }

  return result
}

/**
 * Escape HTML special characters
 *
 * @param text - Raw text to escape
 * @returns HTML-safe string
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Common programming languages for detection
 */
export const COMMON_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'markdown',
  'sql',
  'bash',
  'shell',
  'powershell',
  'dockerfile',
  'graphql',
  'vue',
  'svelte',
  'jsx',
  'tsx',
] as const

export type CommonLanguage = (typeof COMMON_LANGUAGES)[number]

/**
 * Language display names for UI
 */
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  scala: 'Scala',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  sql: 'SQL',
  bash: 'Bash',
  shell: 'Shell',
  powershell: 'PowerShell',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  vue: 'Vue',
  svelte: 'Svelte',
  jsx: 'JSX',
  tsx: 'TSX',
  text: 'Plain Text',
  plaintext: 'Plain Text',
}

/**
 * Get display name for a language
 */
export function getLanguageDisplayName(language: string): string {
  return (
    LANGUAGE_DISPLAY_NAMES[language.toLowerCase()] || language.toUpperCase()
  )
}

/**
 * Normalize language identifier
 *
 * @param language - Raw language string (may include aliases)
 * @returns Normalized language identifier
 */
export function normalizeLanguage(language?: string): string {
  if (!language) return 'text'

  const normalized = language.toLowerCase().trim()

  // Common aliases
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    md: 'markdown',
    'c++': 'cpp',
    'c#': 'csharp',
    cs: 'csharp',
    objc: 'objective-c',
    objectivec: 'objective-c',
    kt: 'kotlin',
    rs: 'rust',
    ps1: 'powershell',
    psm1: 'powershell',
  }

  return aliases[normalized] || normalized
}

/**
 * Simple language detection based on code patterns
 *
 * @param code - Code content
 * @returns Detected language or 'text'
 */
export function detectLanguage(code: string): string {
  const trimmed = code.trim()

  // TypeScript/JavaScript patterns
  if (
    trimmed.includes('interface ') ||
    trimmed.includes('type ') ||
    trimmed.match(/:\s*(string|number|boolean|any)\b/)
  ) {
    return 'typescript'
  }

  if (
    trimmed.includes('function ') ||
    trimmed.includes('=>') ||
    trimmed.includes('const ') ||
    trimmed.includes('let ') ||
    trimmed.includes('var ')
  ) {
    return 'javascript'
  }

  // Python patterns
  if (
    trimmed.includes('def ') ||
    trimmed.includes('import ') ||
    trimmed.includes('from ') ||
    (trimmed.includes('class ') && trimmed.includes(':'))
  ) {
    return 'python'
  }

  // Java/C# patterns
  if (
    trimmed.includes('public class ') ||
    trimmed.includes('public static void main')
  ) {
    return trimmed.includes('namespace ') ? 'csharp' : 'java'
  }

  // Go patterns
  if (
    trimmed.includes('package ') ||
    trimmed.includes('func ') ||
    trimmed.includes('import (')
  ) {
    return 'go'
  }

  // Rust patterns
  if (
    trimmed.includes('fn ') ||
    trimmed.includes('let mut ') ||
    trimmed.includes('impl ')
  ) {
    return 'rust'
  }

  // PHP patterns
  if (trimmed.includes('<?php') || trimmed.match(/<\?[^=]/)) {
    return 'php'
  }

  // HTML patterns
  if (trimmed.match(/^<(!DOCTYPE|html|head|body|div|span|p)/i)) {
    return 'html'
  }

  // JSON patterns
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      // Not valid JSON
    }
  }

  // YAML patterns
  if (trimmed.match(/^[\w-]+:\s/) || trimmed.startsWith('---')) {
    return 'yaml'
  }

  // Bash/Shell patterns
  if (
    trimmed.startsWith('#!/') ||
    trimmed.includes('echo ') ||
    trimmed.includes('$ ')
  ) {
    return 'bash'
  }

  // SQL patterns
  if (trimmed.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i)) {
    return 'sql'
  }

  // CSS patterns
  if (trimmed.match(/^[\w.-]+\s*\{/) || trimmed.includes('@media')) {
    return 'css'
  }

  return 'text'
}

/**
 * Extract language from className (format: language-xxx)
 */
export function extractLanguageFromClassName(
  className?: string
): string | undefined {
  if (!className) return undefined
  const match = /language-(\w+)/.exec(className)
  return match?.[1]
}

/**
 * Count lines in code
 */
export function countLines(code: string): number {
  return code.split('\n').length
}

/**
 * Truncate code to a maximum number of lines
 */
export function truncateCode(code: string, maxLines: number): string {
  const lines = code.split('\n')
  if (lines.length <= maxLines) return code
  return lines.slice(0, maxLines).join('\n')
}
