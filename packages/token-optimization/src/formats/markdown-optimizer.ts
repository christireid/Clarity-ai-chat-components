/**
 * Markdown Optimization for Token Reduction
 *
 * This module provides utilities for optimizing markdown content to reduce
 * token usage when sending to LLMs. It can strip markdown formatting entirely,
 * compress markdown while preserving structure, and extract/analyze code blocks.
 *
 * Key features:
 * - Strip markdown to plain text (10-20% token reduction)
 * - Compress markdown while preserving readability
 * - Extract and analyze code blocks
 * - Estimate token savings before processing
 *
 * @module markdown-optimizer
 *
 * @example
 * ```typescript
 * import { MarkdownOptimizer, stripMarkdown, compressMarkdown } from '@clarity-ai/token-optimization'
 *
 * // Quick usage with convenience functions
 * const plainText = stripMarkdown('# Hello **World**')
 * // Result: 'Hello World'
 *
 * const compressed = compressMarkdown('# Hello\n\n\n\nWorld', { preserveHeaders: true })
 * // Result: '# Hello\n\nWorld'
 *
 * // Full class usage for advanced features
 * const optimizer = new MarkdownOptimizer()
 * const savings = optimizer.estimateSavings(markdownContent)
 * console.log(`Can save ${savings.savingsPercent}% tokens`)
 * ```
 */

import { SimpleTokenCounter } from '../tokenizers/simple-counter'

/**
 * Options for markdown compression
 *
 * @example
 * ```typescript
 * const options: MarkdownCompressOptions = {
 *   preserveHeaders: true,     // Keep # headers
 *   preserveLinks: false,      // Convert [text](url) to text
 *   preserveCodeBlocks: true,  // Keep code blocks intact
 *   preserveEmphasis: false    // Remove **bold** and *italic*
 * }
 * ```
 */
export interface MarkdownCompressOptions {
  /**
   * Preserve header formatting (# ## ###)
   * When false, headers become plain text with double newlines
   * @default true
   */
  preserveHeaders?: boolean

  /**
   * Preserve link formatting [text](url)
   * When false, links become just the text
   * @default false
   */
  preserveLinks?: boolean

  /**
   * Preserve code block formatting with fences
   * When false, code content is extracted without fences
   * @default true
   */
  preserveCodeBlocks?: boolean

  /**
   * Preserve emphasis formatting (**bold**, *italic*, _underline_)
   * When false, emphasis markers are removed
   * @default false
   */
  preserveEmphasis?: boolean
}

/**
 * Represents an extracted code block from markdown
 *
 * @example
 * ```typescript
 * const blocks = optimizer.extractCodeBlocks(markdown)
 * blocks.forEach(block => {
 *   console.log(`${block.language} code at lines ${block.startLine}-${block.endLine}`)
 *   console.log(block.code)
 * })
 * ```
 */
export interface CodeBlock {
  /**
   * Programming language identifier (e.g., 'typescript', 'python')
   * Empty string if no language was specified
   */
  language: string

  /**
   * The code content without the fence markers
   */
  code: string

  /**
   * Starting line number in the original document (1-indexed)
   */
  startLine: number

  /**
   * Ending line number in the original document (1-indexed)
   */
  endLine: number
}

/**
 * Result of token savings estimation
 *
 * @example
 * ```typescript
 * const result = optimizer.estimateSavings(markdown)
 * if (result.savingsPercent > 15) {
 *   const stripped = optimizer.stripMarkdown(markdown)
 *   // Use stripped version for LLM input
 * }
 * ```
 */
export interface SavingsEstimate {
  /**
   * Estimated token count for the original markdown
   */
  originalTokens: number

  /**
   * Estimated token count after stripping markdown
   */
  strippedTokens: number

  /**
   * Percentage of tokens saved (0-100)
   */
  savingsPercent: number
}

/**
 * Markdown Optimizer for Token Reduction
 *
 * Provides methods to strip, compress, and analyze markdown content
 * for optimal token usage when sending to LLMs.
 *
 * @example
 * ```typescript
 * const optimizer = new MarkdownOptimizer()
 *
 * // Strip all markdown formatting
 * const plain = optimizer.stripMarkdown(`
 * # Welcome
 *
 * This is **important** text with a [link](https://example.com).
 *
 * \`\`\`javascript
 * console.log('Hello')
 * \`\`\`
 * `)
 * // Result: 'Welcome\n\nThis is important text with a link.\n\nconsole.log(\'Hello\')'
 *
 * // Compress while keeping structure
 * const compressed = optimizer.compressMarkdown(markdown, {
 *   preserveHeaders: true,
 *   preserveCodeBlocks: true
 * })
 *
 * // Extract code blocks for separate processing
 * const blocks = optimizer.extractCodeBlocks(markdown)
 *
 * // Estimate savings before processing
 * const savings = optimizer.estimateSavings(markdown)
 * ```
 */
export class MarkdownOptimizer {
  private tokenCounter: SimpleTokenCounter

  constructor() {
    this.tokenCounter = new SimpleTokenCounter(true, { model: 'gpt-4' })
  }

  /**
   * Strip all markdown formatting to plain text
   *
   * Reduces tokens by 10-20% for formatted documents by removing:
   * - Headers (# ## ###) - converted to plain text
   * - Bold (**text**) - converted to text
   * - Italic (*text* or _text_) - converted to text
   * - Links [text](url) - converted to text
   * - Images ![alt](url) - converted to alt text
   * - Code blocks ```lang ... ``` - converted to content only
   * - Inline code `code` - converted to code
   * - Lists (- * 1.) - converted to text with space
   * - Blockquotes (>) - converted to text
   * - Horizontal rules (---) - removed
   * - Tables - converted to simple text
   *
   * @param text - Markdown text to strip
   * @returns Plain text with markdown formatting removed
   *
   * @example
   * ```typescript
   * const optimizer = new MarkdownOptimizer()
   *
   * const plain = optimizer.stripMarkdown(`
   * # Welcome to the Guide
   *
   * This is **important** information.
   *
   * - Item 1
   * - Item 2
   *
   * > A famous quote
   *
   * Visit [our site](https://example.com) for more.
   * `)
   *
   * // Result:
   * // 'Welcome to the Guide
   * //
   * // This is important information.
   * //
   * // Item 1
   * // Item 2
   * //
   * // A famous quote
   * //
   * // Visit our site for more.'
   * ```
   */
  stripMarkdown(text: string): string {
    if (!text) return ''

    let result = text

    // Remove horizontal rules (must be done early)
    result = result.replace(/^[-*_]{3,}\s*$/gm, '')

    // Convert code blocks to just code content
    result = result.replace(/```[\w-]*\n?([\s\S]*?)```/g, '$1')

    // Remove inline code backticks
    result = result.replace(/`([^`]+)`/g, '$1')

    // Convert headers to plain text
    result = result.replace(/^#{1,6}\s+(.+)$/gm, '$1')

    // Convert images to alt text
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

    // Convert links to just text
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // Remove reference-style link definitions
    result = result.replace(/^\[[^\]]+\]:\s+.+$/gm, '')

    // Remove bold formatting
    result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
    result = result.replace(/__([^_]+)__/g, '$1')

    // Remove italic formatting
    result = result.replace(/\*([^*]+)\*/g, '$1')
    result = result.replace(/_([^_]+)_/g, '$1')

    // Remove strikethrough
    result = result.replace(/~~([^~]+)~~/g, '$1')

    // Convert unordered lists to plain text
    result = result.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')

    // Convert ordered lists to plain text
    result = result.replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1')

    // Remove blockquote markers
    result = result.replace(/^>\s*/gm, '')

    // Convert tables to simple text
    result = this.stripTables(result)

    // Normalize whitespace - collapse multiple blank lines to one
    result = result.replace(/\n{3,}/g, '\n\n')

    // Trim leading/trailing whitespace
    result = result.trim()

    return result
  }

  /**
   * Compress markdown while preserving structure
   *
   * Applies selective compression based on options:
   * - Normalizes whitespace (always)
   * - Shortens unnecessary formatting
   * - Preserves structure for readability
   *
   * @param text - Markdown text to compress
   * @param options - Compression options
   * @returns Compressed markdown
   *
   * @example
   * ```typescript
   * const optimizer = new MarkdownOptimizer()
   *
   * // Preserve headers but strip other formatting
   * const compressed = optimizer.compressMarkdown(`
   * # Title
   *
   *
   *
   * This is **very** important.
   *
   * [Click here](https://example.com) for details.
   * `, {
   *   preserveHeaders: true,
   *   preserveEmphasis: false,
   *   preserveLinks: false
   * })
   *
   * // Result:
   * // '# Title
   * //
   * // This is very important.
   * //
   * // Click here for details.'
   * ```
   */
  compressMarkdown(text: string, options?: MarkdownCompressOptions): string {
    if (!text) return ''

    const opts: Required<MarkdownCompressOptions> = {
      preserveHeaders: options?.preserveHeaders ?? true,
      preserveLinks: options?.preserveLinks ?? false,
      preserveCodeBlocks: options?.preserveCodeBlocks ?? true,
      preserveEmphasis: options?.preserveEmphasis ?? false,
    }

    let result = text

    // Store code blocks to restore later if preserving
    const codeBlocks: string[] = []
    if (opts.preserveCodeBlocks) {
      result = result.replace(/```[\w-]*\n?([\s\S]*?)```/g, (match) => {
        codeBlocks.push(match)
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`
      })
    } else {
      // Extract code content only
      result = result.replace(/```[\w-]*\n?([\s\S]*?)```/g, '$1')
    }

    // Handle headers
    if (!opts.preserveHeaders) {
      result = result.replace(/^#{1,6}\s+(.+)$/gm, '$1')
    }

    // Handle links
    if (!opts.preserveLinks) {
      result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    }

    // Handle images (always convert to alt text for compression)
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

    // Handle emphasis
    if (!opts.preserveEmphasis) {
      result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
      result = result.replace(/__([^_]+)__/g, '$1')
      result = result.replace(/\*([^*]+)\*/g, '$1')
      result = result.replace(/_([^_]+)_/g, '$1')
    }

    // Remove inline code backticks (always)
    result = result.replace(/`([^`]+)`/g, '$1')

    // Normalize whitespace - collapse multiple blank lines to one
    result = result.replace(/\n{3,}/g, '\n\n')

    // Trim trailing whitespace from lines
    result = result
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')

    // Restore code blocks if preserved
    if (opts.preserveCodeBlocks) {
      codeBlocks.forEach((block, i) => {
        result = result.replace(`__CODE_BLOCK_${i}__`, block)
      })
    }

    return result.trim()
  }

  /**
   * Extract all code blocks from markdown
   *
   * Finds all fenced code blocks and returns them with metadata.
   * Useful for separate processing of code content.
   *
   * @param text - Markdown text to extract from
   * @returns Array of code blocks with metadata
   *
   * @example
   * ```typescript
   * const optimizer = new MarkdownOptimizer()
   *
   * const blocks = optimizer.extractCodeBlocks(`
   * # Example
   *
   * Here's some TypeScript:
   *
   * \`\`\`typescript
   * const greeting = 'Hello'
   * console.log(greeting)
   * \`\`\`
   *
   * And some Python:
   *
   * \`\`\`python
   * greeting = "Hello"
   * print(greeting)
   * \`\`\`
   * `)
   *
   * // Result: [
   * //   {
   * //     language: 'typescript',
   * //     code: "const greeting = 'Hello'\nconsole.log(greeting)",
   * //     startLine: 5,
   * //     endLine: 8
   * //   },
   * //   {
   * //     language: 'python',
   * //     code: 'greeting = "Hello"\nprint(greeting)',
   * //     startLine: 12,
   * //     endLine: 15
   * //   }
   * // ]
   * ```
   */
  extractCodeBlocks(text: string): CodeBlock[] {
    if (!text) return []

    const blocks: CodeBlock[] = []
    const lines = text.split('\n')

    let inBlock = false
    let currentLanguage = ''
    let currentCode: string[] = []
    let startLine = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNum = i + 1 // 1-indexed

      // Check for code fence start
      const startMatch = line.match(/^```([\w-]*)/)
      if (startMatch && !inBlock) {
        inBlock = true
        currentLanguage = startMatch[1] || ''
        currentCode = []
        startLine = lineNum
        continue
      }

      // Check for code fence end
      if (line.trim() === '```' && inBlock) {
        blocks.push({
          language: currentLanguage,
          code: currentCode.join('\n'),
          startLine,
          endLine: lineNum,
        })
        inBlock = false
        currentLanguage = ''
        currentCode = []
        continue
      }

      // Accumulate code content
      if (inBlock) {
        currentCode.push(line)
      }
    }

    return blocks
  }

  /**
   * Remove all code blocks from text
   *
   * Returns the markdown with code blocks removed entirely.
   * Useful for token counting without code content.
   *
   * @param text - Markdown text
   * @returns Text with code blocks removed
   *
   * @example
   * ```typescript
   * const optimizer = new MarkdownOptimizer()
   *
   * const withoutCode = optimizer.removeCodeBlocks(`
   * # Guide
   *
   * Here's how to do it:
   *
   * \`\`\`javascript
   * const x = 1
   * const y = 2
   * \`\`\`
   *
   * And that's it!
   * `)
   *
   * // Result:
   * // '# Guide
   * //
   * // Here's how to do it:
   * //
   * //
   * //
   * // And that's it!'
   * ```
   */
  removeCodeBlocks(text: string): string {
    if (!text) return ''

    return text.replace(/```[\w-]*\n?[\s\S]*?```/g, '')
  }

  /**
   * Estimate token savings from markdown stripping
   *
   * Calculates the potential token reduction from stripping
   * markdown formatting. Useful for deciding whether to strip.
   *
   * @param text - Markdown text to analyze
   * @returns Savings estimate with token counts and percentage
   *
   * @example
   * ```typescript
   * const optimizer = new MarkdownOptimizer()
   *
   * const savings = optimizer.estimateSavings(`
   * # Very Long Document
   *
   * With **lots** of _formatting_ and [many](https://example.com) links.
   *
   * \`\`\`javascript
   * // Some code
   * const x = 1
   * \`\`\`
   * `)
   *
   * console.log(`Original: ${savings.originalTokens} tokens`)
   * console.log(`Stripped: ${savings.strippedTokens} tokens`)
   * console.log(`Savings: ${savings.savingsPercent}%`)
   *
   * if (savings.savingsPercent > 10) {
   *   // Worth stripping for this content
   * }
   * ```
   */
  estimateSavings(text: string): SavingsEstimate {
    if (!text) {
      return {
        originalTokens: 0,
        strippedTokens: 0,
        savingsPercent: 0,
      }
    }

    const originalTokens = this.tokenCounter.count(text)
    const stripped = this.stripMarkdown(text)
    const strippedTokens = this.tokenCounter.count(stripped)

    const savings = originalTokens - strippedTokens
    const savingsPercent =
      originalTokens > 0
        ? Math.round((savings / originalTokens) * 100 * 100) / 100
        : 0

    return {
      originalTokens,
      strippedTokens,
      savingsPercent,
    }
  }

  /**
   * Strip table formatting to simple text
   * @private
   */
  private stripTables(text: string): string {
    // Split into lines for processing
    const lines = text.split('\n')
    const result: string[] = []

    let inTable = false

    for (const line of lines) {
      // Check if this is a table separator line
      if (/^\|?[\s-:|]+\|?$/.test(line) && line.includes('-')) {
        inTable = true
        continue
      }

      // Check if this is a table row
      if (line.includes('|')) {
        inTable = true
        // Extract cell contents
        const cells = line
          .split('|')
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0)

        if (cells.length > 0) {
          result.push(cells.join(' | '))
        }
        continue
      }

      // End of table
      if (inTable && !line.includes('|')) {
        inTable = false
      }

      result.push(line)
    }

    return result.join('\n')
  }
}

/**
 * Quick function to strip markdown formatting
 *
 * Convenience function that creates a MarkdownOptimizer and strips formatting.
 * For repeated use, create a MarkdownOptimizer instance instead.
 *
 * @param text - Markdown text to strip
 * @returns Plain text without markdown formatting
 *
 * @example
 * ```typescript
 * import { stripMarkdown } from '@clarity-ai/token-optimization'
 *
 * const plain = stripMarkdown('# Hello **World**')
 * // Result: 'Hello World'
 *
 * const content = stripMarkdown(`
 * ## Features
 *
 * - Fast
 * - Reliable
 * - **Easy to use**
 * `)
 * // Result: 'Features\n\nFast\nReliable\nEasy to use'
 * ```
 */
export function stripMarkdown(text: string): string {
  const optimizer = new MarkdownOptimizer()
  return optimizer.stripMarkdown(text)
}

/**
 * Quick function to compress markdown
 *
 * Convenience function that creates a MarkdownOptimizer and compresses.
 * For repeated use, create a MarkdownOptimizer instance instead.
 *
 * @param text - Markdown text to compress
 * @param options - Compression options
 * @returns Compressed markdown
 *
 * @example
 * ```typescript
 * import { compressMarkdown } from '@clarity-ai/token-optimization'
 *
 * // Default compression (preserves headers and code blocks)
 * const compressed = compressMarkdown('# Hello\n\n\n\n**World**')
 * // Result: '# Hello\n\nWorld'
 *
 * // Custom compression options
 * const minimal = compressMarkdown(markdown, {
 *   preserveHeaders: false,
 *   preserveLinks: false,
 *   preserveCodeBlocks: false,
 *   preserveEmphasis: false
 * })
 * ```
 */
export function compressMarkdown(
  text: string,
  options?: MarkdownCompressOptions
): string {
  const optimizer = new MarkdownOptimizer()
  return optimizer.compressMarkdown(text, options)
}
