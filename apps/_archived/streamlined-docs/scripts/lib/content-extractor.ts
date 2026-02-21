/**
 * Content extraction utilities for page.tsx files
 * Extracts text content, code blocks, and metadata from React components
 */

import { readFile } from 'fs/promises'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import type { ExtractedPageContent, CodeBlock, PageMetadata } from '../types'

// Create singleton token counter instance for cl100k_base encoding (GPT-4, GPT-3.5-turbo)
const tokenCounter = new AccurateTokenCounter({
  model: 'gpt-4',
  enableCaching: true,
})

/**
 * Extract metadata from a page.tsx file
 */
export function extractMetadata(content: string): PageMetadata {
  const metadata: PageMetadata = {}

  // Extract metadata export
  const metadataMatch = content.match(
    /export\s+const\s+metadata\s*:\s*Metadata\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s
  )

  if (metadataMatch) {
    const metadataStr = metadataMatch[1]

    // Extract title
    const titleMatch = metadataStr.match(/title:\s*['"`]([^'"`]+)['"`]/)
    if (titleMatch) {
      metadata.title = titleMatch[1]
    }

    // Extract description
    const descMatch = metadataStr.match(/description:\s*['"`]([^'"`]+)['"`]/)
    if (descMatch) {
      metadata.description = descMatch[1]
    }
  }

  return metadata
}

/**
 * Extract code blocks from JSX content
 * Handles escaped backticks within template literals
 */
export function extractCodeBlocks(content: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = []

  // Pattern to match template literal content (handles escaped backticks)
  // Matches: any char except ` or \, OR \ followed by any char
  const templateLiteralPattern = '(?:[^`\\\\]|\\\\.)*'

  // Match CodePlayground components
  const playgroundRegex = new RegExp(
    `<CodePlayground[^>]*code=\\\{\\` +
      '`(' +
      templateLiteralPattern +
      ')' +
      '`\\}[^>]*\\/>',
    'gs'
  )
  let match
  while ((match = playgroundRegex.exec(content)) !== null) {
    const code = match[1]
    const language = detectLanguage(code)
    codeBlocks.push({ language, code: unescapeCode(code) })
  }

  // Match EnhancedCodeBlock components (code before language)
  const enhancedRegex = new RegExp(
    `<EnhancedCodeBlock[^>]*code=\\\{\\` +
      '`(' +
      templateLiteralPattern +
      ')' +
      '`\\}[^>]*language=["\']([^"\']+)["\'][^>]*(?:filename=["\']([^"\']+)["\'])?[^>]*\\/>',
    'gs'
  )
  while ((match = enhancedRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[2],
      code: unescapeCode(match[1]),
      filename: match[3],
    })
  }

  // Also try the reverse order (language before code)
  const enhancedRegex2 = new RegExp(
    `<EnhancedCodeBlock[^>]*language=["\']([^"\']+)["\'][^>]*code=\\\{\\` +
      '`(' +
      templateLiteralPattern +
      ')' +
      '`\\}[^>]*(?:filename=["\']([^"\']+)["\'])?[^>]*\\/>',
    'gs'
  )
  while ((match = enhancedRegex2.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1],
      code: unescapeCode(match[2]),
      filename: match[3],
    })
  }

  // Match template literal code blocks in pre/code tags
  const preCodeRegex = new RegExp(
    `<pre[^>]*><code[^>]*>\\\{\\` +
      '`(' +
      templateLiteralPattern +
      ')' +
      '`\\}<\\/code><\\/pre>',
    'gs'
  )
  while ((match = preCodeRegex.exec(content)) !== null) {
    const code = match[1]
    codeBlocks.push({
      language: detectLanguage(code),
      code: unescapeCode(code),
    })
  }

  return codeBlocks
}

/**
 * Detect programming language from code content
 */
function detectLanguage(code: string): string {
  if (
    code.includes('import ') &&
    (code.includes('from ') || code.includes('require('))
  ) {
    if (
      code.includes(': ') ||
      code.includes('<') ||
      code.includes('interface ')
    ) {
      return 'tsx'
    }
    return 'jsx'
  }
  if (
    code.includes('npm install') ||
    code.includes('pnpm add') ||
    code.includes('yarn add')
  ) {
    return 'bash'
  }
  if (
    code.includes('function ') ||
    code.includes('const ') ||
    code.includes('let ')
  ) {
    return 'typescript'
  }
  return 'typescript'
}

/**
 * Unescape code from template literals
 */
function unescapeCode(code: string): string {
  return code
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\`/g, '`')
    .replace(/\\\$/g, '$')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
}

/**
 * Extract text content from JSX, removing React-specific syntax
 */
export function extractTextContent(content: string): string {
  const lines: string[] = []

  // Extract h1 headings
  const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/g
  let match
  while ((match = h1Regex.exec(content)) !== null) {
    lines.push(`# ${cleanText(match[1])}`)
  }

  // Extract h2 headings
  const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/g
  while ((match = h2Regex.exec(content)) !== null) {
    lines.push(`\n## ${cleanText(match[1])}`)
  }

  // Extract h3 headings
  const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/g
  while ((match = h3Regex.exec(content)) !== null) {
    lines.push(`\n### ${cleanText(match[1])}`)
  }

  // Extract h4 headings
  const h4Regex = /<h4[^>]*>([^<]+)<\/h4>/g
  while ((match = h4Regex.exec(content)) !== null) {
    lines.push(`\n#### ${cleanText(match[1])}`)
  }

  // Extract paragraph content
  const pRegex = /<p[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/p>/g
  while ((match = pRegex.exec(content)) !== null) {
    const text = stripTags(match[1])
    if (text.trim()) {
      lines.push(`\n${cleanText(text)}`)
    }
  }

  // Extract list items
  const liRegex = /<li[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/li>/g
  while ((match = liRegex.exec(content)) !== null) {
    const text = stripTags(match[1])
    if (text.trim()) {
      lines.push(`- ${cleanText(text)}`)
    }
  }

  // Extract Callout content
  const calloutRegex =
    /<Callout[^>]*type=["'](\w+)["'][^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/Callout>/gs
  while ((match = calloutRegex.exec(content)) !== null) {
    const type = match[1]
    const text = stripTags(match[2])
    if (text.trim()) {
      const prefix =
        type === 'tip'
          ? 'Tip'
          : type === 'info'
            ? 'Info'
            : type === 'warning'
              ? 'Warning'
              : 'Note'
      lines.push(`\n> **${prefix}**: ${cleanText(text)}`)
    }
  }

  // Extract table content
  const tableRows = extractTableContent(content)
  if (tableRows.length > 0) {
    lines.push('\n' + tableRows.join('\n'))
  }

  return lines.join('\n')
}

/**
 * Extract table content from JSX
 */
function extractTableContent(content: string): string[] {
  const rows: string[] = []

  // Match table structure
  const tableMatch = content.match(/<table[^>]*>([\s\S]*?)<\/table>/g)
  if (!tableMatch) return rows

  for (const table of tableMatch) {
    // Extract header
    const theadMatch = table.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)
    if (theadMatch) {
      const headerCells = [
        ...theadMatch[1].matchAll(/<th[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/th>/g),
      ]
      if (headerCells.length > 0) {
        const headers = headerCells.map((m) => cleanText(stripTags(m[1])))
        rows.push('| ' + headers.join(' | ') + ' |')
        rows.push('| ' + headers.map(() => '---').join(' | ') + ' |')
      }
    }

    // Extract body rows
    const tbodyMatch = table.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)
    if (tbodyMatch) {
      const rowMatches = [
        ...tbodyMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g),
      ]
      for (const rowMatch of rowMatches) {
        const cells = [
          ...rowMatch[1].matchAll(/<td[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/td>/g),
        ]
        if (cells.length > 0) {
          const cellTexts = cells.map((m) => cleanText(stripTags(m[1])))
          rows.push('| ' + cellTexts.join(' | ') + ' |')
        }
      }
    }
  }

  return rows
}

/**
 * Strip HTML tags from text
 */
function stripTags(html: string): string {
  return html
    .replace(/<code[^>]*>([^<]+)<\/code>/g, '`$1`')
    .replace(/<strong[^>]*>([^<]+)<\/strong>/g, '**$1**')
    .replace(/<em[^>]*>([^<]+)<\/em>/g, '*$1*')
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/g, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\{[^}]*\}/g, '')
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

/**
 * Extract complete page content from a page.tsx file
 */
export async function extractPageContent(
  filePath: string
): Promise<ExtractedPageContent> {
  const content = await readFile(filePath, 'utf-8')

  const metadata = extractMetadata(content)
  const textContent = extractTextContent(content)
  const codeBlocks = extractCodeBlocks(content)

  // Check for draft status
  const isDraft =
    content.includes('draft: true') || content.includes("'draft': true")

  return {
    title: metadata.title || extractTitleFromContent(content) || 'Untitled',
    description: metadata.description || '',
    content: textContent,
    codeBlocks,
    isDraft,
  }
}

/**
 * Extract title from content if not in metadata
 */
function extractTitleFromContent(content: string): string | null {
  // Try to find first h1
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
  if (h1Match) {
    return cleanText(h1Match[1])
  }

  // Try to find title in className with gradient
  const gradientTitleMatch = content.match(
    /<h1[^>]*className="[^"]*text-4xl[^"]*"[^>]*>\s*([^<]+)\s*<\/h1>/
  )
  if (gradientTitleMatch) {
    return cleanText(gradientTitleMatch[1])
  }

  return null
}

/**
 * Convert extracted content to markdown format
 */
export function contentToMarkdown(extracted: ExtractedPageContent): string {
  const lines: string[] = []

  // Add title
  if (extracted.title) {
    lines.push(`# ${extracted.title}`)
    lines.push('')
  }

  // Add description
  if (extracted.description) {
    lines.push(extracted.description)
    lines.push('')
  }

  // Add main content
  if (extracted.content) {
    lines.push(extracted.content)
    lines.push('')
  }

  // Add code blocks
  for (const block of extracted.codeBlocks) {
    if (block.filename) {
      lines.push(`\`\`\`${block.language}`)
      lines.push(`// ${block.filename}`)
    } else {
      lines.push(`\`\`\`${block.language}`)
    }
    lines.push(block.code)
    lines.push('```')
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Count tokens using AccurateTokenCounter from @clarity-chat/token-optimization
 * Uses cl100k_base encoding (used by GPT-4, GPT-3.5-turbo)
 */
export function estimateTokens(text: string): number {
  try {
    return tokenCounter.count(text)
  } catch {
    // Fallback to rough approximation if tokenizer fails
    return Math.ceil(text.length / 4)
  }
}
