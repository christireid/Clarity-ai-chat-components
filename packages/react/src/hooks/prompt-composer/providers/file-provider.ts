/**
 * File Provider for PromptComposer
 *
 * Provides file system integration for @file mentions with:
 * - Fuzzy file search
 * - Token cost calculation
 * - Progressive context expansion (90% token savings)
 * - Relevance scoring
 */

import { createContextItem, fuzzyMatch } from '../context-utils'
import type { ContextItem, ContextProvider } from '../types'

// ============================================================================
// Types
// ============================================================================

export interface FileSystemEntry {
  path: string
  name: string
  type: 'file' | 'directory'
  size?: number
  lastModified?: number
  extension?: string
  language?: string
  content?: string
  excerpt?: string // First few lines for preview
}

export interface FileProviderConfig {
  /**
   * Function to search files in the project
   * Can integrate with IDE APIs, file system, or custom search
   */
  searchFiles: (query: string) => Promise<FileSystemEntry[]>

  /**
   * Function to read full file content
   */
  readFile: (path: string) => Promise<string>

  /**
   * Maximum number of results to return
   * @default 10
   */
  maxResults?: number

  /**
   * Enable fuzzy search
   * @default true
   */
  fuzzySearch?: boolean

  /**
   * File extensions to prioritize in search
   * @default ['.ts', '.tsx', '.js', '.jsx', '.py', '.java']
   */
  priorityExtensions?: string[]

  /**
   * Base directory to search from (for display in paths)
   * @default ''
   */
  baseDirectory?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get file icon based on extension
 */
function getFileIcon(extension?: string): string {
  if (!extension) return '📄'

  const iconMap: Record<string, string> = {
    '.ts': '🔷',
    '.tsx': '⚛️',
    '.js': '🟨',
    '.jsx': '⚛️',
    '.py': '🐍',
    '.java': '☕',
    '.go': '🔵',
    '.rs': '🦀',
    '.c': '🔧',
    '.cpp': '🔧',
    '.css': '🎨',
    '.scss': '🎨',
    '.html': '🌐',
    '.json': '📋',
    '.md': '📝',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.toml': '⚙️',
    '.xml': '📋',
    '.sql': '🗄️',
    '.sh': '💻',
    '.bash': '💻',
    '.zsh': '💻',
    '.env': '🔐',
  }

  return iconMap[extension] || '📄'
}

/**
 * Generate file summary (lightweight context)
 */
function generateFileSummary(file: FileSystemEntry): string {
  const icon = getFileIcon(file.extension)
  const sizeMB = file.size ? (file.size / 1024 / 1024).toFixed(2) : '?'

  let summary = `${icon} ${file.name}`

  if (file.language) {
    summary += ` (${file.language})`
  }

  if (file.size) {
    summary += ` - ${sizeMB}MB`
  }

  // Add excerpt if available
  if (file.excerpt) {
    const lines = file.excerpt.split('\n').length
    summary += `, ${lines} lines`
  }

  return summary
}

/**
 * Generate file preview (medium context)
 */
async function generateFilePreview(
  file: FileSystemEntry,
  config: FileProviderConfig
): Promise<string> {
  const icon = getFileIcon(file.extension)
  let preview = `${icon} **${file.name}**\n\n`

  // Add metadata
  preview += `Path: \`${file.path}\`\n`
  if (file.language) {
    preview += `Language: ${file.language}\n`
  }
  if (file.size) {
    preview += `Size: ${(file.size / 1024).toFixed(1)}KB\n`
  }

  // Add excerpt or first 20 lines
  if (file.excerpt) {
    preview += `\n**Preview:**\n\`\`\`${file.language || ''}\n${file.excerpt}\n\`\`\``
  } else if (file.content) {
    const lines = file.content.split('\n').slice(0, 20).join('\n')
    preview += `\n**Preview (first 20 lines):**\n\`\`\`${file.language || ''}\n${lines}\n\`\`\``
  }

  return preview
}

/**
 * Calculate relevance score for file
 */
function calculateFileRelevance(file: FileSystemEntry, query: string): number {
  let score = 0

  // Exact name match (+0.5)
  if (file.name.toLowerCase() === query.toLowerCase()) {
    score += 0.5
  }

  // Name contains query (+0.3)
  if (file.name.toLowerCase().includes(query.toLowerCase())) {
    score += 0.3
  }

  // Path contains query (+0.1)
  if (file.path.toLowerCase().includes(query.toLowerCase())) {
    score += 0.1
  }

  // Recently modified (+0.1)
  if (file.lastModified) {
    const hoursAgo = (Date.now() - file.lastModified) / 1000 / 60 / 60
    if (hoursAgo < 24) {
      score += 0.1
    }
  }

  return Math.min(score, 1)
}

// ============================================================================
// File Provider Factory
// ============================================================================

/**
 * Create a file provider for PromptComposer
 *
 * @example
 * ```tsx
 * // Basic usage
 * const fileProvider = createFileProvider({
 *   searchFiles: async (query) => {
 *     // Search your file system
 *     return await searchProjectFiles(query)
 *   },
 *   readFile: async (path) => {
 *     // Read file content
 *     return await fs.readFile(path, 'utf-8')
 *   }
 * })
 *
 * // Use with PromptComposer
 * <PromptComposer
 *   api="/api/chat"
 *   features={{
 *     context: {
 *       triggers: ['@'],
 *       providers: [fileProvider]
 *     }
 *   }}
 * />
 * ```
 */
export function createFileProvider(
  config: FileProviderConfig
): ContextProvider {
  const {
    searchFiles,
    readFile,
    maxResults = 10,
    fuzzySearch = true,
    priorityExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java'],
    baseDirectory = '',
  } = config

  return {
    type: 'file',
    icon: '📁',
    priority: 80, // High priority for coding tasks
    enabled: true,
    maxResults,

    search: async (query: string): Promise<ContextItem[]> => {
      try {
        // Search files
        const files = await searchFiles(query)

        // Filter with fuzzy matching if enabled
        const filtered = fuzzySearch
          ? files.filter((file) => fuzzyMatch(query, file.name) || fuzzyMatch(query, file.path))
          : files.filter(
              (file) =>
                file.name.toLowerCase().includes(query.toLowerCase()) ||
                file.path.toLowerCase().includes(query.toLowerCase())
            )

        // Sort by priority and relevance
        const sorted = filtered
          .map((file) => ({
            file,
            relevance: calculateFileRelevance(file, query),
            isPriority: priorityExtensions.some((ext) => file.extension === ext),
          }))
          .sort((a, b) => {
            // Priority extensions first
            if (a.isPriority && !b.isPriority) return -1
            if (!a.isPriority && b.isPriority) return 1

            // Then by relevance
            return b.relevance - a.relevance
          })
          .slice(0, maxResults)

        // Convert to context items
        const contextItems: ContextItem[] = []

        for (const { file, relevance } of sorted) {
          const summary = generateFileSummary(file)
          const preview = await generateFilePreview(file, config)

          // Read full content if not already loaded
          const full = file.content || (await readFile(file.path).catch(() => ''))

          const item = createContextItem({
            id: `file:${file.path}`,
            type: 'file',
            label: file.name,
            description: file.path.replace(baseDirectory, ''),
            icon: getFileIcon(file.extension),
            summary,
            preview,
            full,
            relevance,
            priority: 80,
            metadata: {
              path: file.path,
              extension: file.extension,
              language: file.language,
              size: file.size,
              lastModified: file.lastModified,
            },
          })

          contextItems.push(item)
        }

        return contextItems
      } catch (error) {
        console.error('[FileProvider] Search failed:', error)
        return []
      }
    },
  }
}

// ============================================================================
// Mock File Provider (for testing/demos)
// ============================================================================

/**
 * Create a mock file provider for testing
 */
export function createMockFileProvider(): ContextProvider {
  const mockFiles: FileSystemEntry[] = [
    {
      path: 'src/components/Button.tsx',
      name: 'Button.tsx',
      type: 'file',
      size: 2048,
      extension: '.tsx',
      language: 'typescript',
      excerpt: 'export function Button({ children, onClick, ...props }: ButtonProps) {\n  return <button onClick={onClick} {...props}>{children}</button>\n}',
      content: `import React from 'react'\n\nexport interface ButtonProps {\n  children: React.ReactNode\n  onClick?: () => void\n}\n\nexport function Button({ children, onClick, ...props }: ButtonProps) {\n  return <button onClick={onClick} {...props}>{children}</button>\n}`,
    },
    {
      path: 'src/hooks/useAuth.ts',
      name: 'useAuth.ts',
      type: 'file',
      size: 1536,
      extension: '.ts',
      language: 'typescript',
      excerpt: 'export function useAuth() {\n  const [user, setUser] = useState(null)\n  return { user, setUser }\n}',
      content: `import { useState } from 'react'\n\nexport function useAuth() {\n  const [user, setUser] = useState(null)\n  return { user, setUser }\n}`,
    },
    {
      path: 'src/utils/api.ts',
      name: 'api.ts',
      type: 'file',
      size: 3072,
      extension: '.ts',
      language: 'typescript',
      excerpt: 'export async function fetchAPI(endpoint: string) {\n  return fetch(endpoint).then(r => r.json())\n}',
      content: `export async function fetchAPI(endpoint: string) {\n  const response = await fetch(endpoint)\n  return response.json()\n}`,
    },
  ]

  return createFileProvider({
    searchFiles: async (query) => {
      return mockFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.path.toLowerCase().includes(query.toLowerCase())
      )
    },
    readFile: async (path) => {
      const file = mockFiles.find((f) => f.path === path)
      return file?.content || ''
    },
  })
}
