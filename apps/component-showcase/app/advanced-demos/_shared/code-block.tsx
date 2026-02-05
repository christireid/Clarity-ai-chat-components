'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { Copy, Check, Download, Play, FileCode } from 'lucide-react'

interface CodeBlockDisplayProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  onRun?: () => void
  className?: string
}

const languageColors: Record<string, string> = {
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  python: 'text-green-400',
  rust: 'text-orange-400',
  go: 'text-cyan-400',
  html: 'text-red-400',
  css: 'text-purple-400',
  json: 'text-yellow-300',
  bash: 'text-green-300',
  tsx: 'text-blue-400',
  jsx: 'text-yellow-400',
  markdown: 'text-gray-400',
  sql: 'text-pink-400',
  mermaid: 'text-violet-400',
  svg: 'text-emerald-400',
}

export function CodeBlockDisplay({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
  onRun,
  className,
}: CodeBlockDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className={cn('rounded-xl overflow-hidden border bg-[#1e1e2e] my-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-white/5">
        <div className="flex items-center gap-2">
          <FileCode className={cn('h-3.5 w-3.5', languageColors[language] || 'text-gray-400')} />
          <span className="text-xs text-gray-400 font-mono">
            {title || language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-green-400 hover:bg-green-400/10 transition-colors"
            >
              <Play className="h-3 w-3" />
              Run
            </button>
          )}
          <button
            onClick={() => {
              const blob = new Blob([code], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `code.${language}`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-gray-600 text-right pr-4 w-8 shrink-0 font-mono text-xs leading-relaxed">
                    {i + 1}
                  </span>
                )}
                <span className="text-gray-200 font-mono text-xs leading-relaxed flex-1">
                  {highlightLine(line, language)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// Simple syntax highlighting (production would use Shiki/Prism)
function highlightLine(line: string, _language: string): React.ReactNode {
  // Keywords
  const keywords = /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|new|try|catch|throw|switch|case|default|break|continue|typeof|instanceof|in|of|as|is)\b/g
  // Strings
  const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g
  // Comments
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/g
  // Numbers
  const numbers = /\b(\d+\.?\d*)\b/g

  if (comments.test(line)) {
    return <span className="text-gray-500 italic">{line}</span>
  }

  // Simple approach: render as-is with basic keyword coloring
  const parts = line.split(/(\b(?:import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|new|try|catch|throw)\b|(?:["'`])(?:(?=(?:\\?))\\.)*?(?:["'`])|\/\/.*$)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (/^(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|new|try|catch|throw)$/.test(part)) {
          return <span key={i} className="text-purple-400">{part}</span>
        }
        if (/^["'`]/.test(part)) {
          return <span key={i} className="text-green-400">{part}</span>
        }
        if (/^\/\//.test(part)) {
          return <span key={i} className="text-gray-500 italic">{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
