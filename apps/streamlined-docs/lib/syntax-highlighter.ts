import { codeToHtml } from 'shiki'

/**
 * Syntax highlighting using Shiki with Night Owl theme
 *
 * Shiki provides VS Code-quality syntax highlighting with TextMate grammars.
 * Night Owl theme is a popular dark theme designed for readability.
 */

export interface HighlightCodeOptions {
  code: string
  language: string
  theme?: 'night-owl' | 'nord' | 'github-dark'
  lineNumbers?: boolean
  highlightLines?: number[]
}

/**
 * Highlight code with Night Owl theme (default)
 *
 * @param options - Highlighting options
 * @returns HTML string with syntax-highlighted code
 *
 * @example
 * ```ts
 * const html = await highlightCode({
 *   code: 'const foo = "bar"',
 *   language: 'typescript',
 *   lineNumbers: true,
 *   highlightLines: [1]
 * })
 * ```
 */
export async function highlightCode({
  code,
  language,
  theme = 'night-owl',
  lineNumbers = false,
  highlightLines = [],
}: HighlightCodeOptions): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang: language,
      theme: theme,
      transformers: [
        {
          name: 'line-numbers',
          line(node, line) {
            // Add line numbers if enabled
            if (lineNumbers) {
              node.properties['data-line'] = line
            }

            // Add highlight class for specified lines
            if (highlightLines.includes(line)) {
              this.addClassToHast(node, 'highlighted-line')
            }
          },
        },
      ],
    })

    return html
  } catch (error) {
    // Fallback to plain text if language not supported
    console.warn(
      `Shiki: Unsupported language "${language}", falling back to plain text`
    )
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

/**
 * Synchronous highlighting with cached bundled highlighter (for client-side)
 *
 * Note: This is a lighter version for client-side use.
 * For full language support, use the async version.
 */
export function highlightCodeSync({
  code,
  language,
}: Pick<HighlightCodeOptions, 'code' | 'language'>): string {
  // For client-side, we'll use a simplified approach
  // The full highlighting will be done server-side
  return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char])
}

/**
 * Language aliases for common variations
 */
export const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
}

/**
 * Normalize language identifier
 */
export function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase().trim()
  return LANGUAGE_ALIASES[normalized] || normalized
}

/**
 * Get friendly language name for display
 */
export function getLanguageDisplayName(lang: string): string {
  const displayNames: Record<string, string> = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    python: 'Python',
    ruby: 'Ruby',
    bash: 'Bash',
    sh: 'Shell',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    markdown: 'Markdown',
    md: 'Markdown',
    css: 'CSS',
    scss: 'SCSS',
    html: 'HTML',
    sql: 'SQL',
    rust: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    swift: 'Swift',
    kotlin: 'Kotlin',
    php: 'PHP',
  }

  return displayNames[lang.toLowerCase()] || lang.toUpperCase()
}
