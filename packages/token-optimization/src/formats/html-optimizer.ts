/**
 * HTML Optimization for Token Reduction
 *
 * This module provides utilities for converting HTML content to plain text
 * or markdown format, reducing token usage when sending to LLMs.
 *
 * Key features:
 * - Convert HTML to plain text (removes all tags)
 * - Convert HTML to markdown (preserves semantic structure)
 * - Handles common HTML elements and entities
 *
 * @module html-optimizer
 *
 * @example
 * ```typescript
 * import { HTMLOptimizer, htmlToText, htmlToMarkdown } from '@clarity-chat/token-optimization'
 *
 * // Quick usage with convenience functions
 * const plainText = htmlToText('<h1>Hello</h1><p>World</p>')
 * // Result: 'Hello\n\nWorld'
 *
 * const markdown = htmlToMarkdown('<h1>Hello</h1><p><strong>World</strong></p>')
 * // Result: '# Hello\n\n**World**'
 *
 * // Full class usage for advanced features
 * const optimizer = new HTMLOptimizer()
 * const text = optimizer.htmlToText(htmlContent, {
 *   preserveLinks: true,
 *   preserveStructure: true
 * })
 * ```
 */

/**
 * Options for HTML to text conversion
 *
 * @example
 * ```typescript
 * const options: HTMLToTextOptions = {
 *   preserveLinks: true,      // Keep URLs inline
 *   preserveStructure: true   // Maintain paragraph breaks
 * }
 * ```
 */
export interface HTMLToTextOptions {
  /**
   * Preserve link URLs in the output
   * When true: [text](url) format
   * When false: just text
   * @default false
   */
  preserveLinks?: boolean

  /**
   * Preserve structural elements (paragraphs, headers)
   * When true: maintains paragraph breaks and header emphasis
   * When false: collapses to simple text with minimal breaks
   * @default true
   */
  preserveStructure?: boolean
}

/**
 * HTML Optimizer for Token Reduction
 *
 * Provides methods to convert HTML content to plain text or markdown
 * for optimal token usage when sending to LLMs.
 *
 * @example
 * ```typescript
 * const optimizer = new HTMLOptimizer()
 *
 * // Convert HTML to plain text
 * const plain = optimizer.htmlToText(`
 *   <article>
 *     <h1>Welcome</h1>
 *     <p>This is <strong>important</strong> text.</p>
 *     <a href="https://example.com">Click here</a>
 *   </article>
 * `)
 * // Result: 'Welcome\n\nThis is important text.\n\nClick here'
 *
 * // Convert HTML to markdown (preserves semantics)
 * const markdown = optimizer.htmlToMarkdown(`
 *   <article>
 *     <h1>Welcome</h1>
 *     <p>This is <strong>important</strong> text.</p>
 *     <ul>
 *       <li>Item 1</li>
 *       <li>Item 2</li>
 *     </ul>
 *   </article>
 * `)
 * // Result: '# Welcome\n\nThis is **important** text.\n\n- Item 1\n- Item 2'
 * ```
 */
export class HTMLOptimizer {
  /**
   * Common HTML entities and their replacements
   */
  private static readonly HTML_ENTITIES: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&mdash;': '--',
    '&ndash;': '-',
    '&hellip;': '...',
    '&copy;': '(c)',
    '&reg;': '(R)',
    '&trade;': '(TM)',
    '&bull;': '*',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&laquo;': '<<',
    '&raquo;': '>>',
  }

  /**
   * Convert HTML to plain text
   *
   * Strips all HTML tags and converts content to readable plain text.
   * Handles common HTML elements intelligently to preserve readability.
   *
   * @param html - HTML content to convert
   * @param options - Conversion options
   * @returns Plain text representation
   *
   * @example
   * ```typescript
   * const optimizer = new HTMLOptimizer()
   *
   * // Basic conversion
   * const text = optimizer.htmlToText('<p>Hello <strong>World</strong>!</p>')
   * // Result: 'Hello World!'
   *
   * // With structure preservation
   * const structured = optimizer.htmlToText(`
   *   <h1>Title</h1>
   *   <p>First paragraph.</p>
   *   <p>Second paragraph.</p>
   * `, { preserveStructure: true })
   * // Result: 'Title\n\nFirst paragraph.\n\nSecond paragraph.'
   *
   * // With links preserved
   * const withLinks = optimizer.htmlToText(
   *   '<a href="https://example.com">Visit site</a>',
   *   { preserveLinks: true }
   * )
   * // Result: 'Visit site (https://example.com)'
   * ```
   */
  htmlToText(html: string, options?: HTMLToTextOptions): string {
    if (!html) return ''

    const opts: Required<HTMLToTextOptions> = {
      preserveLinks: options?.preserveLinks ?? false,
      preserveStructure: options?.preserveStructure ?? true,
    }

    let result = html

    // Remove script and style content
    result = result.replace(/<script[\s\S]*?<\/script>/gi, '')
    result = result.replace(/<style[\s\S]*?<\/style>/gi, '')
    result = result.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')

    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '')

    // Handle links
    if (opts.preserveLinks) {
      result = result.replace(
        /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        '$2 ($1)'
      )
    } else {
      result = result.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    }

    // Handle images (extract alt text)
    result = result.replace(/<img[^>]+alt=["']([^"']*)["'][^>]*\/?>/gi, '$1')
    result = result.replace(/<img[^>]*\/?>/gi, '')

    // Handle structure elements
    if (opts.preserveStructure) {
      // Headers - add double newline
      result = result.replace(
        /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi,
        '\n\n$1\n\n'
      )

      // Paragraphs - add double newline
      result = result.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n')

      // Divs - add newline
      result = result.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '\n$1\n')

      // Line breaks
      result = result.replace(/<br\s*\/?>/gi, '\n')

      // Horizontal rules
      result = result.replace(/<hr\s*\/?>/gi, '\n---\n')
    }

    // Handle lists
    result = result.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    result = result.replace(/<[uo]l[^>]*>/gi, '\n')
    result = result.replace(/<\/[uo]l>/gi, '\n')

    // Handle definition lists
    result = result.replace(/<dt[^>]*>([\s\S]*?)<\/dt>/gi, '$1: ')
    result = result.replace(/<dd[^>]*>([\s\S]*?)<\/dd>/gi, '$1\n')
    result = result.replace(/<\/?dl[^>]*>/gi, '\n')

    // Handle blockquotes
    result = result.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      '\n> $1\n'
    )

    // Handle pre/code blocks
    result = result.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n$1\n')
    result = result.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1')

    // Handle tables - extract content simply
    result = this.convertTableToText(result)

    // Remove all remaining HTML tags
    result = result.replace(/<[^>]+>/g, '')

    // Decode HTML entities
    result = this.decodeEntities(result)

    // Normalize whitespace
    result = result.replace(/[ \t]+/g, ' ')
    result = result.replace(/\n[ \t]+/g, '\n')
    result = result.replace(/[ \t]+\n/g, '\n')
    result = result.replace(/\n{3,}/g, '\n\n')

    return result.trim()
  }

  /**
   * Convert HTML to markdown format
   *
   * Preserves semantic structure while converting to markdown.
   * Useful when you want to maintain formatting but reduce verbosity.
   *
   * @param html - HTML content to convert
   * @returns Markdown representation
   *
   * @example
   * ```typescript
   * const optimizer = new HTMLOptimizer()
   *
   * const markdown = optimizer.htmlToMarkdown(`
   *   <article>
   *     <h1>Getting Started</h1>
   *     <p>This guide covers the <em>basics</em> of our <strong>API</strong>.</p>
   *     <h2>Installation</h2>
   *     <pre><code>npm install my-package</code></pre>
   *     <h2>Usage</h2>
   *     <ul>
   *       <li>Import the package</li>
   *       <li>Initialize with config</li>
   *       <li>Call the methods</li>
   *     </ul>
   *     <p>For more info, visit <a href="https://example.com">our docs</a>.</p>
   *   </article>
   * `)
   *
   * // Result:
   * // '# Getting Started
   * //
   * // This guide covers the *basics* of our **API**.
   * //
   * // ## Installation
   * //
   * // ```
   * // npm install my-package
   * // ```
   * //
   * // ## Usage
   * //
   * // - Import the package
   * // - Initialize with config
   * // - Call the methods
   * //
   * // For more info, visit [our docs](https://example.com).'
   * ```
   */
  htmlToMarkdown(html: string): string {
    if (!html) return ''

    let result = html

    // Remove script and style content
    result = result.replace(/<script[\s\S]*?<\/script>/gi, '')
    result = result.replace(/<style[\s\S]*?<\/style>/gi, '')
    result = result.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')

    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '')

    // Convert headers
    result = result.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    result = result.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    result = result.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    result = result.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    result = result.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n\n##### $1\n\n')
    result = result.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n\n###### $1\n\n')

    // Convert emphasis
    result = result.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    result = result.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    result = result.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    result = result.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    result = result.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, '~~$1~~')
    result = result.replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, '~~$1~~')
    result = result.replace(/<strike[^>]*>([\s\S]*?)<\/strike>/gi, '~~$1~~')

    // Convert links
    result = result.replace(
      /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      '[$2]($1)'
    )

    // Convert images
    result = result.replace(
      /<img[^>]+src=["']([^"']+)["'][^>]+alt=["']([^"']*)["'][^>]*\/?>/gi,
      '![$2]($1)'
    )
    result = result.replace(
      /<img[^>]+alt=["']([^"']*)["'][^>]+src=["']([^"']+)["'][^>]*\/?>/gi,
      '![$1]($2)'
    )
    result = result.replace(
      /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi,
      '![]($1)'
    )

    // Convert code blocks
    result = result.replace(
      /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      '\n\n```\n$1\n```\n\n'
    )
    result = result.replace(
      /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
      '\n\n```\n$1\n```\n\n'
    )

    // Convert inline code
    result = result.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')

    // Convert blockquotes
    result = this.convertBlockquotesToMarkdown(result)

    // Convert lists
    result = this.convertListsToMarkdown(result)

    // Convert tables
    result = this.convertTableToMarkdown(result)

    // Convert paragraphs
    result = result.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n')

    // Handle line breaks
    result = result.replace(/<br\s*\/?>/gi, '\n')

    // Handle horizontal rules
    result = result.replace(/<hr\s*\/?>/gi, '\n\n---\n\n')

    // Remove remaining HTML tags
    result = result.replace(/<[^>]+>/g, '')

    // Decode HTML entities
    result = this.decodeEntities(result)

    // Normalize whitespace
    result = result.replace(/[ \t]+/g, ' ')
    result = result.replace(/\n[ \t]+/g, '\n')
    result = result.replace(/[ \t]+\n/g, '\n')
    result = result.replace(/\n{3,}/g, '\n\n')

    return result.trim()
  }

  /**
   * Decode HTML entities to characters
   * @private
   */
  private decodeEntities(text: string): string {
    let result = text

    // Decode named entities
    for (const [entity, char] of Object.entries(HTMLOptimizer.HTML_ENTITIES)) {
      result = result.replace(new RegExp(entity, 'gi'), char)
    }

    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10))
    )

    // Decode hex entities
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )

    return result
  }

  /**
   * Convert HTML table to plain text
   * @private
   */
  private convertTableToText(html: string): string {
    // Extract table content into simple format
    return html.replace(
      /<table[^>]*>([\s\S]*?)<\/table>/gi,
      (_, tableContent) => {
        let result = '\n'
        const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []

        for (const row of rows) {
          const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []
          const cellTexts = cells.map((cell: string) =>
            cell.replace(/<[^>]+>/g, '').trim()
          )
          result += cellTexts.join(' | ') + '\n'
        }

        return result + '\n'
      }
    )
  }

  /**
   * Convert HTML table to markdown table
   * @private
   */
  private convertTableToMarkdown(html: string): string {
    return html.replace(
      /<table[^>]*>([\s\S]*?)<\/table>/gi,
      (_, tableContent) => {
        const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
        if (rows.length === 0) return ''

        const result: string[] = []
        let isFirst = true

        for (const row of rows) {
          const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []
          const cellTexts = cells.map((cell: string) =>
            cell.replace(/<[^>]+>/g, '').trim()
          )

          result.push('| ' + cellTexts.join(' | ') + ' |')

          // Add separator row after header
          if (isFirst) {
            result.push('| ' + cellTexts.map(() => '---').join(' | ') + ' |')
            isFirst = false
          }
        }

        return '\n\n' + result.join('\n') + '\n\n'
      }
    )
  }

  /**
   * Convert HTML blockquotes to markdown
   * @private
   */
  private convertBlockquotesToMarkdown(html: string): string {
    return html.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (_, content) => {
        const lines = content
          .trim()
          .split('\n')
          .map((line: string) => '> ' + line.trim())
        return '\n\n' + lines.join('\n') + '\n\n'
      }
    )
  }

  /**
   * Convert HTML lists to markdown
   * @private
   */
  private convertListsToMarkdown(html: string): string {
    let result = html

    // Convert unordered lists
    result = result.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []
      const listItems = items.map(
        (item: string) => '- ' + item.replace(/<[^>]+>/g, '').trim()
      )
      return '\n\n' + listItems.join('\n') + '\n\n'
    })

    // Convert ordered lists
    result = result.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []
      const listItems = items.map(
        (item: string, index: number) =>
          `${index + 1}. ` + item.replace(/<[^>]+>/g, '').trim()
      )
      return '\n\n' + listItems.join('\n') + '\n\n'
    })

    return result
  }
}

/**
 * Quick function to convert HTML to plain text
 *
 * Convenience function that creates an HTMLOptimizer and converts.
 * For repeated use, create an HTMLOptimizer instance instead.
 *
 * @param html - HTML content to convert
 * @returns Plain text
 *
 * @example
 * ```typescript
 * import { htmlToText } from '@clarity-chat/token-optimization'
 *
 * const text = htmlToText('<h1>Hello</h1><p>World</p>')
 * // Result: 'Hello\n\nWorld'
 *
 * const fromPage = htmlToText(`
 *   <article>
 *     <h1>Article Title</h1>
 *     <p>First paragraph with <strong>bold</strong> text.</p>
 *     <p>Second paragraph with a <a href="https://example.com">link</a>.</p>
 *   </article>
 * `)
 * // Result: 'Article Title\n\nFirst paragraph with bold text.\n\nSecond paragraph with a link.'
 * ```
 */
export function htmlToText(html: string): string {
  const optimizer = new HTMLOptimizer()
  return optimizer.htmlToText(html)
}

/**
 * Quick function to convert HTML to markdown
 *
 * Convenience function that creates an HTMLOptimizer and converts.
 * For repeated use, create an HTMLOptimizer instance instead.
 *
 * @param html - HTML content to convert
 * @returns Markdown representation
 *
 * @example
 * ```typescript
 * import { htmlToMarkdown } from '@clarity-chat/token-optimization'
 *
 * const markdown = htmlToMarkdown('<h1>Hello</h1><p><strong>World</strong></p>')
 * // Result: '# Hello\n\n**World**'
 *
 * const fromPage = htmlToMarkdown(`
 *   <ul>
 *     <li>First item</li>
 *     <li>Second item</li>
 *   </ul>
 * `)
 * // Result: '- First item\n- Second item'
 * ```
 */
export function htmlToMarkdown(html: string): string {
  const optimizer = new HTMLOptimizer()
  return optimizer.htmlToMarkdown(html)
}
