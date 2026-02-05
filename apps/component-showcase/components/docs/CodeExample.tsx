'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import type { CodeExample as CodeExampleType } from '@/lib/docs-parser'

interface CodeExampleProps {
  example: CodeExampleType
  className?: string
}

export function CodeExample({ example, className }: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(example.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('glass-panel rounded-lg overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/30">
        <div>
          <h4 className="font-medium">{example.title}</h4>
          {example.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {example.description}
            </p>
          )}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-background/50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code className="language-tsx">{example.code}</code>
        </pre>
      </div>
    </div>
  )
}
