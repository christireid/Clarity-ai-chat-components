/**
 * Code Display Components
 *
 * World-class code display components with Shiki-powered syntax highlighting.
 *
 * Features:
 * - Shiki syntax highlighting (VS Code engine)
 * - 15+ popular themes (Material, Night Owl, GitHub, Dracula, etc.)
 * - Premium fonts with ligature support (Fira Code, JetBrains Mono)
 * - Line numbers, highlighting, and diff visualization
 * - Animated copy-to-clipboard
 * - Streaming support for AI responses
 * - WCAG 2.1 AA accessible
 *
 * @example
 * ```tsx
 * import { CodeBlock, InlineCode, StreamingCodeBlock } from '@clarity-chat/react'
 *
 * // Static code block
 * <CodeBlock
 *   language="typescript"
 *   theme="github-dark"
 *   showLineNumbers
 *   highlightLines="2,5-7"
 * >
 *   {codeString}
 * </CodeBlock>
 *
 * // Streaming code block
 * <StreamingCodeBlock
 *   code={streamingCode}
 *   isStreaming={isGenerating}
 *   language="python"
 * />
 *
 * // Inline code
 * <InlineCode>npm install</InlineCode>
 * ```
 *
 * @packageDocumentation
 */

// Main Components
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeFontFamily,
} from './CodeBlock'
export {
  StreamingCodeBlock,
  type StreamingCodeBlockProps,
} from './StreamingCodeBlock'
export { InlineCode, type InlineCodeProps } from './InlineCode'

// Sub-components (for composition)
export { LineNumbers, type LineNumbersProps } from './LineNumbers'
export { CodeBlockHeader, type CodeBlockHeaderProps } from './CodeBlockHeader'
export {
  CodeBlockCopyButton,
  type CodeBlockCopyButtonProps,
} from './CodeBlockCopyButton'

// Themes
export {
  CODE_THEMES,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getDarkThemes,
  getLightThemes,
  getThemeDefinition,
  isValidTheme,
  type CodeThemeDefinition,
  type CodeThemeName,
} from './themes'

// Utilities
export {
  parseLineRanges,
  escapeHtml,
  normalizeLanguage,
  detectLanguage,
  getLanguageDisplayName,
  extractLanguageFromClassName,
  countLines,
  truncateCode,
  parseCodeBlocks,
  hasCodeBlocks,
  extractCodeBlocks,
  COMMON_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  type CommonLanguage,
  type ParsedCodeBlock,
} from './utils'
