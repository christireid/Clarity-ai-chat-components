'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Plus,
  Minus,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  GitCommit,
  GitBranch,
  File,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'

interface DiffLine {
  type: 'add' | 'remove' | 'context' | 'header'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

interface CodeDiffProps {
  oldCode?: string
  newCode?: string
  diff?: DiffLine[]
  language?: string
  filename?: string
  className?: string
  showLineNumbers?: boolean
  unified?: boolean
}

export function CodeDiff({
  oldCode,
  newCode,
  diff,
  language = 'typescript',
  filename,
  className,
  showLineNumbers = true,
  unified = true,
}: CodeDiffProps) {
  const [copied, setCopied] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  // Generate diff from old and new code if not provided
  const diffLines = React.useMemo(() => {
    if (diff) return diff

    if (!oldCode && !newCode) return []

    const oldLines = oldCode?.split('\n') || []
    const newLines = newCode?.split('\n') || []
    const result: DiffLine[] = []

    // Simple line-by-line diff
    const maxLen = Math.max(oldLines.length, newLines.length)
    let oldIdx = 0
    let newIdx = 0

    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i]
      const newLine = newLines[i]

      if (oldLine === newLine) {
        result.push({
          type: 'context',
          content: oldLine || '',
          oldLineNumber: ++oldIdx,
          newLineNumber: ++newIdx,
        })
      } else {
        if (oldLine !== undefined) {
          result.push({
            type: 'remove',
            content: oldLine,
            oldLineNumber: ++oldIdx,
          })
        }
        if (newLine !== undefined) {
          result.push({
            type: 'add',
            content: newLine,
            newLineNumber: ++newIdx,
          })
        }
      }
    }

    return result
  }, [oldCode, newCode, diff])

  const stats = React.useMemo(() => {
    const additions = diffLines.filter((l) => l.type === 'add').length
    const deletions = diffLines.filter((l) => l.type === 'remove').length
    return { additions, deletions }
  }, [diffLines])

  const copyDiff = async () => {
    const text = diffLines
      .map((line) => {
        const prefix =
          line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '
        return `${prefix}${line.content}`
      })
      .join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden font-mono text-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-sm hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          <File className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {filename || 'changes.diff'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500">+{stats.additions}</span>
            <span className="text-red-500">-{stats.deletions}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={copyDiff}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Diff Content */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {diffLines.map((line, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border/50 last:border-0',
                    line.type === 'add' && 'bg-green-500/10',
                    line.type === 'remove' && 'bg-red-500/10',
                    line.type === 'header' && 'bg-muted/50'
                  )}
                >
                  {/* Line Numbers */}
                  {showLineNumbers && unified && (
                    <>
                      <td className="w-12 px-2 py-0.5 text-right text-xs text-muted-foreground select-none border-r border-border/30">
                        {line.oldLineNumber || ''}
                      </td>
                      <td className="w-12 px-2 py-0.5 text-right text-xs text-muted-foreground select-none border-r border-border/30">
                        {line.newLineNumber || ''}
                      </td>
                    </>
                  )}

                  {/* Prefix */}
                  <td className="w-6 px-1 py-0.5 text-center select-none">
                    {line.type === 'add' && (
                      <Plus className="w-3 h-3 text-green-500 inline" />
                    )}
                    {line.type === 'remove' && (
                      <Minus className="w-3 h-3 text-red-500 inline" />
                    )}
                  </td>

                  {/* Content */}
                  <td
                    className={cn(
                      'px-3 py-0.5 whitespace-pre',
                      line.type === 'add' && 'text-green-400',
                      line.type === 'remove' && 'text-red-400',
                      line.type === 'header' && 'text-blue-400 font-medium'
                    )}
                  >
                    {line.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Git Commit Component
interface CommitProps {
  hash: string
  message: string
  author: string
  date: string
  files?: { name: string; additions: number; deletions: number }[]
  className?: string
}

export function GitCommitCard({
  hash,
  message,
  author,
  date,
  files = [],
  className,
}: CommitProps) {
  const [expanded, setExpanded] = React.useState(false)
  const shortHash = hash.slice(0, 7)

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between p-3">
        <div className="flex items-start gap-3">
          <GitCommit className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium text-sm">{message}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{author}</span>
              <span>committed</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
          {shortHash}
        </code>
      </div>

      {files.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 border-t border-border"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span>{files.length} files changed</span>
          </button>

          {expanded && (
            <div className="border-t border-border divide-y divide-border">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <File className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-mono">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">+{file.additions}</span>
                    <span className="text-red-500">-{file.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Branch Selector
interface BranchSelectorProps {
  branches: string[]
  currentBranch: string
  onSelect: (branch: string) => void
  className?: string
}

export function BranchSelector({
  branches,
  currentBranch,
  onSelect,
  className,
}: BranchSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted/50 text-sm"
      >
        <GitBranch className="w-4 h-4 text-muted-foreground" />
        <span className="font-mono">{currentBranch}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 rounded-md border border-border bg-popover shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder="Find a branch..."
                className="w-full px-2 py-1.5 text-sm bg-background rounded border border-border outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => {
                    onSelect(branch)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 text-left',
                    branch === currentBranch && 'bg-muted'
                  )}
                >
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono">{branch}</span>
                  {branch === currentBranch && (
                    <Check className="w-4 h-4 ml-auto text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
