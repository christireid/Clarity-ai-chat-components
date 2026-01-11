/**
 * Markdown Renderer Component
 * Render markdown with syntax highlighting support
 */

import React, { useMemo } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Simple markdown renderer that handles common markdown patterns.
 * For production use, consider integrating react-markdown or similar.
 */
export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  const rendered = useMemo(() => {
    // This is a simplified markdown renderer
    // For full support, use react-markdown with remark-gfm

    let html = content
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks (```code```)
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
      })
      // Inline code (`code`)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">$1</code>')
      // Bold (**text**)
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic (*text*)
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // Unordered lists
      .replace(/^[*-] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
      // Paragraphs (double newlines)
      .split(/\n\n+/)
      .map(para => {
        if (para.startsWith('<')) return para
        return `<p class="mb-4">${para}</p>`
      })
      .join('')
      // Single newlines to <br>
      .replace(/([^>])\n([^<])/g, '$1<br />$2')

    return html
  }, [content])

  return (
    <div
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
