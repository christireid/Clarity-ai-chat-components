'use client'

import { usePlayground } from '../context/PlaygroundContext'
import { Code2, Copy, Check, Download } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { useState } from 'react'
import { generateCode } from '../utils/codeGenerator'

export function CodeDisplay() {
  const { getComponentDefinition, props, codeLanguage, setCodeLanguage } = usePlayground()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'component' | 'full'>('component')

  const component = getComponentDefinition()
  if (!component) return null

  const code = generateCode(component, props, codeLanguage, activeTab === 'full')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.id}.${codeLanguage === 'tsx' ? 'tsx' : 'jsx'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-card p-6 space-y-4 h-fit sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Generated Code</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2',
              copied && 'bg-green-500/10 border border-green-500/30'
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-sm rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Download className="h-3 w-3" />
            Download
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setCodeLanguage('tsx')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            codeLanguage === 'tsx'
              ? 'gradient-accent text-white'
              : 'glass-panel hover:bg-white/80 dark:hover:bg-white/10'
          )}
        >
          TypeScript
        </button>
        <button
          onClick={() => setCodeLanguage('jsx')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            codeLanguage === 'jsx'
              ? 'gradient-accent text-white'
              : 'glass-panel hover:bg-white/80 dark:hover:bg-white/10'
          )}
        >
          JavaScript
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('component')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            activeTab === 'component'
              ? 'bg-primary/10 border border-primary/30'
              : 'glass-panel hover:bg-white/80 dark:hover:bg-white/10'
          )}
        >
          Component Only
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            activeTab === 'full'
              ? 'bg-primary/10 border border-primary/30'
              : 'glass-panel hover:bg-white/80 dark:hover:bg-white/10'
          )}
        >
          Full Example
        </button>
      </div>

      {/* Code Display */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10">
          <span className="text-xs font-mono text-muted-foreground">
            {component.id}.{codeLanguage === 'tsx' ? 'tsx' : 'jsx'}
          </span>
          <span className="text-xs badge-glass">{codeLanguage.toUpperCase()}</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-sm font-mono">
            <code className="language-typescript">
              <SyntaxHighlight code={code} language={codeLanguage} />
            </code>
          </pre>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-3 text-center">
          <div className="text-lg font-semibold">{code.split('\n').length}</div>
          <div className="text-xs text-muted-foreground">Lines</div>
        </div>
        <div className="glass-panel p-3 text-center">
          <div className="text-lg font-semibold">{code.length}</div>
          <div className="text-xs text-muted-foreground">Characters</div>
        </div>
      </div>
    </div>
  )
}

// Simple syntax highlighter
function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  const lines = code.split('\n')

  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell text-right pr-4 text-muted-foreground select-none">
            {i + 1}
          </span>
          <span className="table-cell">{highlightLine(line)}</span>
        </div>
      ))}
    </>
  )
}

function highlightLine(line: string) {
  // Simple syntax highlighting
  const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'interface', 'type']
  const strings = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g
  const comments = /\/\/.*/g
  const jsx = /<\/?[\w\s="/.':;#-\/\?]+>/g

  let highlighted = line

  // Comments
  highlighted = highlighted.replace(comments, '<span class="text-green-500">$&</span>')

  // Strings
  highlighted = highlighted.replace(strings, '<span class="text-amber-500">$&</span>')

  // Keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="text-purple-500">${keyword}</span>`)
  })

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
}
