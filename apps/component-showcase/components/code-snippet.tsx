'use client'

import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'
import { Copy, Check } from 'lucide-react'

interface CodeSnippetProps {
  code: string
  language?: string
  title?: string
}

export function CodeSnippet({ code, language = 'tsx', title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-7 px-2 z-10"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  )
}

interface CodeShowcaseProps {
  children: React.ReactNode
  code: string
  title?: string
}

export function CodeShowcase({ children, code, title }: CodeShowcaseProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="space-y-3">
      <div className="glass-panel p-6 rounded-lg">{children}</div>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCode(!showCode)}
          className="w-full"
        >
          {showCode ? 'Hide' : 'Show'} Code
        </Button>
        {showCode && (
          <div className="mt-3">
            <CodeSnippet code={code} title={title} />
          </div>
        )}
      </div>
    </div>
  )
}
