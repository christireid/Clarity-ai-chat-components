'use client'

import { Play, Code2 } from 'lucide-react'
import { ReactNode } from 'react'

interface TryItOutProps {
  title?: string
  children: ReactNode
  code?: string
  language?: string
}

export function TryItOut({ title = 'Try it out', children, code, language = 'tsx' }: TryItOutProps) {
  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Play className="w-4 h-4 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>
      
      <div className="mb-4">{children}</div>
      
      {code && (
        <details className="mt-4">
          <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            <Code2 className="w-4 h-4" />
            <span>Show code</span>
          </summary>
          <div className="mt-4">
            <pre className="p-4 rounded-lg bg-bg-secondary border border-border overflow-x-auto">
              <code className={`language-${language}`}>{code}</code>
            </pre>
          </div>
        </details>
      )}
    </div>
  )
}
