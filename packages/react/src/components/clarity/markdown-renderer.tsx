'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CodeBlock } from './code-block'
import {
  ExternalLink,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { JSX } from 'react/jsx-runtime'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  const elements = React.useMemo(() => parseMarkdown(content), [content])

  return (
    <div className={cn('prose-ai', className)}>
      {elements.map((element, idx) => (
        <MarkdownElement key={idx} element={element} />
      ))}
    </div>
  )
}

type MarkdownElementType =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'blockquote'; content: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'hr' }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | {
      type: 'callout'
      variant: 'info' | 'warning' | 'error' | 'success'
      content: string
    }

function parseMarkdown(content: string): MarkdownElementType[] {
  const elements: MarkdownElementType[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push({ type: 'code', language, code: codeLines.join('\n') })
      i++
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      elements.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        content: headingMatch[2],
      })
      i++
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      elements.push({ type: 'hr' })
      i++
      continue
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].slice(1).trim())
        i++
      }
      elements.push({ type: 'blockquote', content: quoteLines.join('\n') })
      continue
    }

    // Callouts (custom syntax: :::info, :::warning, :::error, :::success)
    const calloutMatch = line.match(/^:::(info|warning|error|success)$/)
    if (calloutMatch) {
      const variant = calloutMatch[1] as
        | 'info'
        | 'warning'
        | 'error'
        | 'success'
      const calloutLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith(':::')) {
        calloutLines.push(lines[i])
        i++
      }
      elements.push({
        type: 'callout',
        variant,
        content: calloutLines.join('\n'),
      })
      i++
      continue
    }

    // Unordered lists
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ''))
        i++
      }
      elements.push({ type: 'list', ordered: false, items })
      continue
    }

    // Ordered lists
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push({ type: 'list', ordered: true, items })
      continue
    }

    // Tables
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      lines[i + 1].includes('---')
    ) {
      const headers = line
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean)
      i += 2 // Skip header and separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        const row = lines[i]
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean)
        rows.push(row)
        i++
      }
      elements.push({ type: 'table', headers, rows })
      continue
    }

    // Paragraph
    if (line.trim()) {
      const paragraphLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('>') &&
        !lines[i].startsWith('```') &&
        !/^[-*+\d]/.test(lines[i])
      ) {
        paragraphLines.push(lines[i])
        i++
      }
      elements.push({ type: 'paragraph', content: paragraphLines.join(' ') })
      continue
    }

    i++
  }

  return elements
}

function MarkdownElement({ element }: { element: MarkdownElementType }) {
  switch (element.type) {
    case 'paragraph':
      return (
        <p>
          <InlineMarkdown content={element.content} />
        </p>
      )

    case 'heading':
      const HeadingTag = `h${element.level}` as keyof JSX.IntrinsicElements
      return (
        <HeadingTag>
          <InlineMarkdown content={element.content} />
        </HeadingTag>
      )

    case 'code':
      return <CodeBlock code={element.code} language={element.language} />

    case 'blockquote':
      return (
        <blockquote>
          <InlineMarkdown content={element.content} />
        </blockquote>
      )

    case 'hr':
      return <hr className="my-6 border-border" />

    case 'list':
      const ListTag = element.ordered ? 'ol' : 'ul'
      return (
        <ListTag className={element.ordered ? 'list-decimal' : 'list-disc'}>
          {element.items.map((item, idx) => (
            <li key={idx}>
              <InlineMarkdown content={item} />
            </li>
          ))}
        </ListTag>
      )

    case 'table':
      return (
        <div className="overflow-x-auto my-4">
          <table>
            <thead>
              <tr>
                {element.headers.map((header, idx) => (
                  <th key={idx}>
                    <InlineMarkdown content={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>
                      <InlineMarkdown content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'callout':
      return <Callout variant={element.variant} content={element.content} />

    default:
      return null
  }
}

function InlineMarkdown({ content }: { content: string }) {
  // Parse inline markdown: bold, italic, code, links, strikethrough
  const parts = parseInlineMarkdown(content)

  return (
    <>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <span key={idx}>{part}</span>
        }

        switch (part.type) {
          case 'bold':
            return <strong key={idx}>{part.content}</strong>
          case 'italic':
            return <em key={idx}>{part.content}</em>
          case 'code':
            return <code key={idx}>{part.content}</code>
          case 'link':
            return (
              <a
                key={idx}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                {part.content}
                <ExternalLink className="h-3 w-3" />
              </a>
            )
          case 'strikethrough':
            return <del key={idx}>{part.content}</del>
          default:
            return <span key={idx}>{part.content}</span>
        }
      })}
    </>
  )
}

type InlinePart =
  | string
  | {
      type: 'bold' | 'italic' | 'code' | 'link' | 'strikethrough'
      content: string
      url?: string
    }

function parseInlineMarkdown(content: string): InlinePart[] {
  const parts: InlinePart[] = []
  let remaining = content

  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: 'bold' as const },
    { regex: /\*(.+?)\*/g, type: 'italic' as const },
    { regex: /`(.+?)`/g, type: 'code' as const },
    { regex: /\[(.+?)\]\((.+?)\)/g, type: 'link' as const },
    { regex: /~~(.+?)~~/g, type: 'strikethrough' as const },
  ]

  // Simple approach: just return the content with basic replacements
  // For a full implementation, you'd want a proper tokenizer

  // Handle links
  remaining = remaining.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
    return `<link:${url}>${text}</link>`
  })

  // Split by special markers and process
  const linkParts = remaining.split(/(<link:[^>]+>[^<]+<\/link>)/)

  for (const part of linkParts) {
    const linkMatch = part.match(/<link:([^>]+)>([^<]+)<\/link>/)
    if (linkMatch) {
      parts.push({ type: 'link', url: linkMatch[1], content: linkMatch[2] })
    } else if (part) {
      // Process other inline formatting
      let processed = part

      // Bold
      processed = processed.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      // Italic
      processed = processed.replace(/\*(.+?)\*/g, '<i>$1</i>')
      // Code
      processed = processed.replace(/`(.+?)`/g, '<c>$1</c>')
      // Strikethrough
      processed = processed.replace(/~~(.+?)~~/g, '<s>$1</s>')

      const formatParts = processed.split(/(<[bics]>[^<]+<\/[bics]>)/)

      for (const fp of formatParts) {
        const boldMatch = fp.match(/<b>(.+?)<\/b>/)
        const italicMatch = fp.match(/<i>(.+?)<\/i>/)
        const codeMatch = fp.match(/<c>(.+?)<\/c>/)
        const strikeMatch = fp.match(/<s>(.+?)<\/s>/)

        if (boldMatch) {
          parts.push({ type: 'bold', content: boldMatch[1] })
        } else if (italicMatch) {
          parts.push({ type: 'italic', content: italicMatch[1] })
        } else if (codeMatch) {
          parts.push({ type: 'code', content: codeMatch[1] })
        } else if (strikeMatch) {
          parts.push({ type: 'strikethrough', content: strikeMatch[1] })
        } else if (fp) {
          parts.push(fp)
        }
      }
    }
  }

  return parts
}

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
}

const calloutStyles = {
  info: 'bg-ai-user/10 border-ai-user/30 text-foreground',
  warning: 'bg-ai-warning/10 border-ai-warning/30 text-foreground',
  error: 'bg-destructive/10 border-destructive/30 text-foreground',
  success: 'bg-ai-success/10 border-ai-success/30 text-foreground',
}

const calloutIconStyles = {
  info: 'text-ai-user',
  warning: 'text-ai-warning',
  error: 'text-destructive',
  success: 'text-ai-success',
}

function Callout({
  variant,
  content,
}: {
  variant: 'info' | 'warning' | 'error' | 'success'
  content: string
}) {
  const Icon = calloutIcons[variant]

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border my-4',
        calloutStyles[variant]
      )}
    >
      <Icon
        className={cn('h-5 w-5 shrink-0 mt-0.5', calloutIconStyles[variant])}
      />
      <div className="text-sm">
        <InlineMarkdown content={content} />
      </div>
    </div>
  )
}

// Standalone callout component for use outside markdown
export function CalloutBlock({
  variant = 'info',
  title,
  children,
  className,
}: {
  variant?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const Icon = calloutIcons[variant]

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        calloutStyles[variant],
        className
      )}
    >
      <Icon
        className={cn('h-5 w-5 shrink-0 mt-0.5', calloutIconStyles[variant])}
      />
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
