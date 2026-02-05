'use client'

import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import { cn } from '@clarity-chat/primitives'

interface CodeHighlightProps {
  code: string
  language?: 'tsx' | 'typescript' | 'jsx' | 'bash' | 'json'
  className?: string
  showLineNumbers?: boolean
}

export function CodeHighlight({
  code,
  language = 'tsx',
  className,
  showLineNumbers = false,
}: CodeHighlightProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700/50">
        <span className="text-xs text-zinc-400 font-mono uppercase">
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100 font-mono"
        >
          Copy
        </button>
      </div>
      <pre
        className={cn(
          'p-4 overflow-x-auto text-sm bg-zinc-950 m-0',
          showLineNumbers && 'line-numbers'
        )}
      >
        <code ref={codeRef} className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  )
}
