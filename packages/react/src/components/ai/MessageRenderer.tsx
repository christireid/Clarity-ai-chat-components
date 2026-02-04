'use client'

/**
 * MessageRenderer - Plugin-Based Message Rendering
 *
 * An extensible message renderer that parses content and applies
 * plugins to render rich content like code blocks, citations,
 * tool results, links, images, tables, and more.
 *
 * Features:
 * - Plugin architecture for extensible rendering
 * - Built-in plugins for common content types
 * - Component overrides for customization
 * - Streaming content support
 * - Markdown parsing with custom extensions
 *
 * @example
 * ```tsx
 * // Basic usage with default plugins
 * <MessageRenderer content={message.content} />
 *
 * // Custom plugins
 * <MessageRenderer
 *   content={message.content}
 *   plugins={[...defaultPlugins, myCustomPlugin]}
 *   components={{
 *     CodeBlock: MyCustomCodeBlock,
 *   }}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

/** Plugin render context */
export interface PluginRenderContext {
  /** Full message content */
  fullContent: string
  /** Index of this match in the content */
  matchIndex: number
  /** Total number of matches */
  totalMatches: number
  /** Whether content is still streaming */
  isStreaming?: boolean
  /** Custom components to use */
  components?: ComponentOverrides
  /** Extra data from the message */
  metadata?: Record<string, unknown>
}

/** Plugin definition */
export interface MessagePlugin {
  /** Unique plugin name */
  name: string
  /** Priority (higher = processed first) */
  priority?: number
  /** Regex or function to match content */
  match: RegExp | ((content: string) => PluginMatch[])
  /** Render the matched content */
  render: (match: PluginMatch, context: PluginRenderContext) => React.ReactNode
  /** Pre-process content before matching (optional) */
  preprocess?: (content: string) => string
  /** Whether this plugin consumes the matched content (prevents other plugins from matching) */
  exclusive?: boolean
}

/** Match result from plugin */
export interface PluginMatch {
  /** Start index in content */
  start: number
  /** End index in content */
  end: number
  /** Matched text */
  text: string
  /** Captured groups */
  groups?: Record<string, string>
  /** Additional data */
  data?: unknown
}

/** Component overrides for customization */
export interface ComponentOverrides {
  /** Code block component */
  CodeBlock?: React.ComponentType<CodeBlockProps>
  /** Inline code component */
  InlineCode?: React.ComponentType<InlineCodeProps>
  /** Citation component */
  Citation?: React.ComponentType<CitationProps>
  /** Link component */
  Link?: React.ComponentType<LinkProps>
  /** Image component */
  Image?: React.ComponentType<ImageProps>
  /** Table component */
  Table?: React.ComponentType<TableProps>
  /** Tool result component */
  ToolResult?: React.ComponentType<ToolResultProps>
  /** File card component */
  FileCard?: React.ComponentType<FileCardProps>
  /** Text wrapper component */
  Text?: React.ComponentType<TextProps>
}

/** Component props for overrides */
export interface CodeBlockProps {
  language?: string
  code: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export interface InlineCodeProps {
  code: string
  className?: string
}

export interface CitationProps {
  index: number
  source?: string
  url?: string
  className?: string
}

export interface LinkProps {
  href: string
  title?: string
  children: React.ReactNode
  className?: string
}

export interface ImageProps {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  className?: string
}

export interface TableProps {
  headers: string[]
  rows: string[][]
  className?: string
}

export interface ToolResultProps {
  toolName: string
  result: unknown
  status?: 'success' | 'error' | 'pending'
  className?: string
}

export interface FileCardProps {
  filename: string
  type?: string
  size?: number
  url?: string
  className?: string
}

export interface TextProps {
  children: React.ReactNode
  className?: string
}

/** Main component props */
export interface MessageRendererProps {
  /** Content to render */
  content: string
  /** Plugins to use (default plugins used if not specified) */
  plugins?: MessagePlugin[]
  /** Whether to include default plugins */
  includeDefaultPlugins?: boolean
  /** Component overrides */
  components?: ComponentOverrides
  /** Whether content is still streaming */
  isStreaming?: boolean
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** Custom class name */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
  /** Animation on render */
  animate?: boolean
}

// ============================================================================
// Default Components
// ============================================================================

const DefaultCodeBlock: React.FC<CodeBlockProps> = ({
  language,
  code,
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className={`message-renderer-code-block ${className || ''}`}>
      <div className="code-block-header">
        {filename && <span className="code-block-filename">{filename}</span>}
        {language && <span className="code-block-language">{language}</span>}
        <button
          className="code-block-copy"
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? '✓' : '⎘'}
        </button>
      </div>
      <pre className="code-block-content">
        <code className={`language-${language || 'plaintext'}`}>
          {showLineNumbers
            ? lines.map((line, i) => (
                <div
                  key={i}
                  className={`code-line ${highlightLines.includes(i + 1) ? 'highlighted' : ''}`}
                >
                  <span className="line-number">{i + 1}</span>
                  <span className="line-content">{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </div>
  )
}

const DefaultInlineCode: React.FC<InlineCodeProps> = ({ code, className }) => (
  <code className={`message-renderer-inline-code ${className || ''}`}>{code}</code>
)

const DefaultCitation: React.FC<CitationProps> = ({ index, source, url, className }) => (
  <a
    href={url || '#'}
    className={`message-renderer-citation ${className || ''}`}
    title={source}
    data-citation-index={index}
  >
    [{index}]
  </a>
)

const DefaultLink: React.FC<LinkProps> = ({ href, title, children, className }) => (
  <a
    href={href}
    title={title}
    className={`message-renderer-link ${className || ''}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

const DefaultImage: React.FC<ImageProps> = ({ src, alt, title, width, height, className }) => (
  <figure className={`message-renderer-image ${className || ''}`}>
    <img src={src} alt={alt || ''} title={title} width={width} height={height} loading="lazy" />
    {(title || alt) && <figcaption>{title || alt}</figcaption>}
  </figure>
)

const DefaultTable: React.FC<TableProps> = ({ headers, rows, className }) => (
  <div className={`message-renderer-table-wrapper ${className || ''}`}>
    <table className="message-renderer-table">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const DefaultToolResult: React.FC<ToolResultProps> = ({ toolName, result, status, className }) => (
  <div className={`message-renderer-tool-result status-${status || 'success'} ${className || ''}`}>
    <div className="tool-result-header">
      <span className="tool-result-name">{toolName}</span>
      {status && <span className={`tool-result-status ${status}`}>{status}</span>}
    </div>
    <div className="tool-result-content">
      <pre>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
    </div>
  </div>
)

const DefaultFileCard: React.FC<FileCardProps> = ({ filename, type, size, url, className }) => (
  <a href={url} className={`message-renderer-file-card ${className || ''}`} download={filename}>
    <span className="file-card-icon">📄</span>
    <span className="file-card-info">
      <span className="file-card-name">{filename}</span>
      {(type || size) && (
        <span className="file-card-meta">
          {type && <span className="file-card-type">{type}</span>}
          {size && <span className="file-card-size">{formatFileSize(size)}</span>}
        </span>
      )}
    </span>
  </a>
)

const DefaultText: React.FC<TextProps> = ({ children, className }) => (
  <span className={`message-renderer-text ${className || ''}`}>{children}</span>
)

// ============================================================================
// Default Plugins
// ============================================================================

/**
 * Code block plugin - Matches ```language\ncode```
 */
export const codeBlockPlugin: MessagePlugin = {
  name: 'codeBlock',
  priority: 100,
  match: /```(\w+)?\n?([\s\S]*?)```/g,
  exclusive: true,
  render: (match, context) => {
    const groups = match.groups || {}
    const language = groups.language || (match.text.match(/```(\w+)/)?.[1])
    const code = groups.code || match.text.replace(/```\w*\n?/, '').replace(/```$/, '')
    const CodeBlock = context.components?.CodeBlock || DefaultCodeBlock

    return <CodeBlock key={match.start} language={language} code={code.trim()} />
  },
}

/**
 * Inline code plugin - Matches `code`
 */
export const inlineCodePlugin: MessagePlugin = {
  name: 'inlineCode',
  priority: 90,
  match: /`([^`\n]+)`/g,
  render: (match, context) => {
    const code = match.groups?.code || match.text.replace(/`/g, '')
    const InlineCode = context.components?.InlineCode || DefaultInlineCode

    return <InlineCode key={match.start} code={code} />
  },
}

/**
 * Citation plugin - Matches [1], [2], etc.
 */
export const citationPlugin: MessagePlugin = {
  name: 'citation',
  priority: 80,
  match: /\[(\d+)\]/g,
  render: (match, context) => {
    const index = parseInt(match.groups?.index || match.text.replace(/[\[\]]/g, ''), 10)
    const Citation = context.components?.Citation || DefaultCitation

    // Look for citation source in metadata
    const sources = (context.metadata?.citations as Array<{ source?: string; url?: string }>) || []
    const source = sources[index - 1]

    return (
      <Citation key={match.start} index={index} source={source?.source} url={source?.url} />
    )
  },
}

/**
 * Link plugin - Matches [text](url) and raw URLs
 */
export const linkPlugin: MessagePlugin = {
  name: 'link',
  priority: 70,
  match: /\[([^\]]+)\]\(([^)]+)\)|https?:\/\/[^\s<>\[\]"']+/g,
  render: (match, context) => {
    const Link = context.components?.Link || DefaultLink

    // Markdown link [text](url)
    const mdMatch = match.text.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (mdMatch) {
      return (
        <Link key={match.start} href={mdMatch[2]}>
          {mdMatch[1]}
        </Link>
      )
    }

    // Raw URL
    return (
      <Link key={match.start} href={match.text}>
        {match.text}
      </Link>
    )
  },
}

/**
 * Image plugin - Matches ![alt](src)
 */
export const imagePlugin: MessagePlugin = {
  name: 'image',
  priority: 75,
  match: /!\[([^\]]*)\]\(([^)]+)\)/g,
  exclusive: true,
  render: (match, context) => {
    const imgMatch = match.text.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (!imgMatch) return null

    const Image = context.components?.Image || DefaultImage

    return <Image key={match.start} src={imgMatch[2]} alt={imgMatch[1]} />
  },
}

/**
 * Table plugin - Matches markdown tables
 */
export const tablePlugin: MessagePlugin = {
  name: 'table',
  priority: 60,
  match: /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g,
  exclusive: true,
  render: (match, context) => {
    const Table = context.components?.Table || DefaultTable

    const lines = match.text.trim().split('\n')
    if (lines.length < 3) return <span key={match.start}>{match.text}</span>

    const headers = lines[0]
      .split('|')
      .map((h) => h.trim())
      .filter(Boolean)

    const rows = lines.slice(2).map((line) =>
      line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
    )

    return <Table key={match.start} headers={headers} rows={rows} />
  },
}

/**
 * Tool result plugin - Matches <tool_result>...</tool_result>
 */
export const toolResultPlugin: MessagePlugin = {
  name: 'toolResult',
  priority: 95,
  match: /<tool_result\s+name="([^"]+)"(?:\s+status="([^"]+)")?>([^<]*)<\/tool_result>/g,
  exclusive: true,
  render: (match, context) => {
    const ToolResult = context.components?.ToolResult || DefaultToolResult

    const resultMatch = match.text.match(
      /<tool_result\s+name="([^"]+)"(?:\s+status="([^"]+)")?>([^<]*)<\/tool_result>/
    )
    if (!resultMatch) return null

    let result: unknown = resultMatch[3]
    try {
      result = JSON.parse(resultMatch[3])
    } catch {
      // Keep as string
    }

    return (
      <ToolResult
        key={match.start}
        toolName={resultMatch[1]}
        result={result}
        status={(resultMatch[2] as 'success' | 'error' | 'pending') || 'success'}
      />
    )
  },
}

/**
 * File plugin - Matches <file>...</file>
 */
export const filePlugin: MessagePlugin = {
  name: 'file',
  priority: 85,
  match: /<file\s+name="([^"]+)"(?:\s+type="([^"]+)")?(?:\s+size="(\d+)")?(?:\s+url="([^"]+)")?\s*\/>/g,
  exclusive: true,
  render: (match, context) => {
    const FileCard = context.components?.FileCard || DefaultFileCard

    const fileMatch = match.text.match(
      /<file\s+name="([^"]+)"(?:\s+type="([^"]+)")?(?:\s+size="(\d+)")?(?:\s+url="([^"]+)")?\s*\/>/
    )
    if (!fileMatch) return null

    return (
      <FileCard
        key={match.start}
        filename={fileMatch[1]}
        type={fileMatch[2]}
        size={fileMatch[3] ? parseInt(fileMatch[3], 10) : undefined}
        url={fileMatch[4]}
      />
    )
  },
}

/**
 * Bold plugin - Matches **text** or __text__
 */
export const boldPlugin: MessagePlugin = {
  name: 'bold',
  priority: 50,
  match: /\*\*([^*]+)\*\*|__([^_]+)__/g,
  render: (match) => {
    const text = match.text.replace(/\*\*|__/g, '')
    return <strong key={match.start}>{text}</strong>
  },
}

/**
 * Italic plugin - Matches *text* or _text_
 */
export const italicPlugin: MessagePlugin = {
  name: 'italic',
  priority: 45,
  match: /(?<!\*)\*([^*\n]+)\*(?!\*)|(?<!_)_([^_\n]+)_(?!_)/g,
  render: (match) => {
    const text = match.text.replace(/^\*|\*$|^_|_$/g, '')
    return <em key={match.start}>{text}</em>
  },
}

/**
 * Strikethrough plugin - Matches ~~text~~
 */
export const strikethroughPlugin: MessagePlugin = {
  name: 'strikethrough',
  priority: 40,
  match: /~~([^~]+)~~/g,
  render: (match) => {
    const text = match.text.replace(/~~/g, '')
    return <del key={match.start}>{text}</del>
  },
}

/**
 * Heading plugin - Matches # Heading
 */
export const headingPlugin: MessagePlugin = {
  name: 'heading',
  priority: 55,
  match: /^(#{1,6})\s+(.+)$/gm,
  render: (match) => {
    const headingMatch = match.text.match(/^(#{1,6})\s+(.+)$/)
    if (!headingMatch) return <span key={match.start}>{match.text}</span>

    const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6
    const text = headingMatch[2]
    const Tag = `h${level}` as keyof JSX.IntrinsicElements

    return (
      <Tag key={match.start} className={`message-renderer-heading h${level}`}>
        {text}
      </Tag>
    )
  },
}

/**
 * List plugin - Matches - item or 1. item
 */
export const listPlugin: MessagePlugin = {
  name: 'list',
  priority: 35,
  match: /(?:^|\n)((?:[-*+]|\d+\.)\s+.+(?:\n(?:[-*+]|\d+\.)\s+.+)*)/g,
  exclusive: true,
  render: (match) => {
    const items = match.text.trim().split('\n')
    const isOrdered = /^\d+\./.test(items[0])
    const Tag = isOrdered ? 'ol' : 'ul'

    return (
      <Tag key={match.start} className="message-renderer-list">
        {items.map((item, i) => (
          <li key={i}>{item.replace(/^[-*+]|\d+\.\s*/, '')}</li>
        ))}
      </Tag>
    )
  },
}

/**
 * Blockquote plugin - Matches > quote
 */
export const blockquotePlugin: MessagePlugin = {
  name: 'blockquote',
  priority: 30,
  match: /(?:^|\n)((?:>\s*.+\n?)+)/g,
  exclusive: true,
  render: (match) => {
    const text = match.text
      .split('\n')
      .map((line) => line.replace(/^>\s*/, ''))
      .join('\n')
      .trim()

    return (
      <blockquote key={match.start} className="message-renderer-blockquote">
        {text}
      </blockquote>
    )
  },
}

/**
 * Horizontal rule plugin - Matches --- or ***
 */
export const hrPlugin: MessagePlugin = {
  name: 'hr',
  priority: 25,
  match: /(?:^|\n)([-*_]{3,})(?:\n|$)/g,
  exclusive: true,
  render: (match) => <hr key={match.start} className="message-renderer-hr" />,
}

/** All default plugins, sorted by priority */
export const defaultPlugins: MessagePlugin[] = [
  codeBlockPlugin,
  toolResultPlugin,
  inlineCodePlugin,
  filePlugin,
  citationPlugin,
  imagePlugin,
  linkPlugin,
  tablePlugin,
  headingPlugin,
  boldPlugin,
  italicPlugin,
  strikethroughPlugin,
  listPlugin,
  blockquotePlugin,
  hrPlugin,
].sort((a, b) => (b.priority || 0) - (a.priority || 0))

// ============================================================================
// Utility Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function findMatches(content: string, plugin: MessagePlugin): PluginMatch[] {
  if (typeof plugin.match === 'function') {
    return plugin.match(content)
  }

  const matches: PluginMatch[] = []
  const regex = new RegExp(plugin.match.source, plugin.match.flags)
  let result

  while ((result = regex.exec(content)) !== null) {
    matches.push({
      start: result.index,
      end: result.index + result[0].length,
      text: result[0],
      groups: result.groups,
    })

    // Prevent infinite loops with zero-width matches
    if (result[0].length === 0) {
      regex.lastIndex++
    }
  }

  return matches
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * MessageRenderer - Plugin-based message content renderer
 */
export function MessageRenderer({
  content,
  plugins,
  includeDefaultPlugins = true,
  components,
  isStreaming = false,
  metadata,
  className,
  style,
  animate = true,
}: MessageRendererProps) {
  const prefersReducedMotion = useReducedMotion()

  // Merge plugins
  const activePlugins = React.useMemo(() => {
    const allPlugins = [
      ...(includeDefaultPlugins ? defaultPlugins : []),
      ...(plugins || []),
    ]
    return allPlugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }, [plugins, includeDefaultPlugins])

  // Process content with plugins
  const renderedContent = React.useMemo(() => {
    if (!content) return null

    // Preprocess content
    let processedContent = content
    for (const plugin of activePlugins) {
      if (plugin.preprocess) {
        processedContent = plugin.preprocess(processedContent)
      }
    }

    // Find all matches from all plugins
    const allMatches: Array<{
      match: PluginMatch
      plugin: MessagePlugin
    }> = []

    for (const plugin of activePlugins) {
      const matches = findMatches(processedContent, plugin)
      for (const match of matches) {
        allMatches.push({ match, plugin })
      }
    }

    // Sort by start position
    allMatches.sort((a, b) => a.match.start - b.match.start)

    // Remove overlapping matches (keep higher priority)
    const nonOverlapping: Array<{ match: PluginMatch; plugin: MessagePlugin }> = []
    for (const item of allMatches) {
      const overlaps = nonOverlapping.some(
        (existing) =>
          (item.match.start >= existing.match.start && item.match.start < existing.match.end) ||
          (item.match.end > existing.match.start && item.match.end <= existing.match.end)
      )
      if (!overlaps) {
        nonOverlapping.push(item)
      }
    }

    // Build rendered content
    const result: React.ReactNode[] = []
    let lastIndex = 0

    const context: PluginRenderContext = {
      fullContent: processedContent,
      matchIndex: 0,
      totalMatches: nonOverlapping.length,
      isStreaming,
      components,
      metadata,
    }

    for (let i = 0; i < nonOverlapping.length; i++) {
      const { match, plugin } = nonOverlapping[i]
      context.matchIndex = i

      // Add text before match
      if (match.start > lastIndex) {
        const text = processedContent.slice(lastIndex, match.start)
        const Text = components?.Text || DefaultText
        result.push(<Text key={`text-${lastIndex}`}>{text}</Text>)
      }

      // Render match with plugin
      const rendered = plugin.render(match, context)
      if (rendered) {
        result.push(rendered)
      }

      lastIndex = match.end
    }

    // Add remaining text
    if (lastIndex < processedContent.length) {
      const text = processedContent.slice(lastIndex)
      const Text = components?.Text || DefaultText
      result.push(<Text key={`text-${lastIndex}`}>{text}</Text>)
    }

    return result
  }, [content, activePlugins, components, isStreaming, metadata])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion || !animate ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.easeOut,
      },
    },
  }

  return (
    <motion.div
      className={`message-renderer ${isStreaming ? 'streaming' : ''} ${className || ''}`}
      style={style}
      variants={containerVariants}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      data-streaming={isStreaming}
    >
      {renderedContent}
      {isStreaming && (
        <span className="message-renderer-cursor" aria-hidden="true">
          ▋
        </span>
      )}
    </motion.div>
  )
}

// ============================================================================
// Plugin Builder Utilities
// ============================================================================

/**
 * Create a custom plugin
 */
export function createPlugin(
  name: string,
  match: RegExp | ((content: string) => PluginMatch[]),
  render: MessagePlugin['render'],
  options?: Partial<Pick<MessagePlugin, 'priority' | 'exclusive' | 'preprocess'>>
): MessagePlugin {
  return {
    name,
    match,
    render,
    ...options,
  }
}

/**
 * Create a simple text replacement plugin
 */
export function createReplacementPlugin(
  name: string,
  pattern: RegExp,
  replacement: (match: string, ...groups: string[]) => React.ReactNode,
  priority?: number
): MessagePlugin {
  return {
    name,
    priority,
    match: pattern,
    render: (match) => {
      const regex = new RegExp(pattern.source, pattern.flags)
      const result = regex.exec(match.text)
      if (!result) return <span key={match.start}>{match.text}</span>
      return (
        <React.Fragment key={match.start}>
          {replacement(result[0], ...result.slice(1))}
        </React.Fragment>
      )
    },
  }
}

/**
 * Extend default plugins with custom ones
 */
export function extendPlugins(
  customPlugins: MessagePlugin[],
  includeDefaults = true
): MessagePlugin[] {
  const base = includeDefaults ? [...defaultPlugins] : []
  return [...base, ...customPlugins].sort((a, b) => (b.priority || 0) - (a.priority || 0))
}

export default MessageRenderer
