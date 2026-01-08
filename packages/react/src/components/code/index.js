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
export { CodeBlock, } from './CodeBlock';
export { StreamingCodeBlock, } from './StreamingCodeBlock';
export { InlineCode } from './InlineCode';
// Sub-components (for composition)
export { LineNumbers } from './LineNumbers';
export { CodeBlockHeader } from './CodeBlockHeader';
export { CodeBlockCopyButton, } from './CodeBlockCopyButton';
// Themes
export { CODE_THEMES, DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME, getDarkThemes, getLightThemes, getThemeDefinition, isValidTheme, } from './themes';
// Utilities
export { parseLineRanges, escapeHtml, normalizeLanguage, detectLanguage, getLanguageDisplayName, extractLanguageFromClassName, countLines, truncateCode, COMMON_LANGUAGES, LANGUAGE_DISPLAY_NAMES, } from './utils';
//# sourceMappingURL=index.js.map