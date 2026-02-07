'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { useClipboard } from '@clarity-chat/react'
import { CodeHighlight } from './code-highlight'
import { Star, Copy, Check, ChevronRight, FileCode } from 'lucide-react'

function CopyChip({ text, label }: { text: string; label: string }) {
  const { copy, copied } = useClipboard({ timeout: 2000 })
  return (
    <button
      onClick={() => copy(text)}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
        copied
          ? 'bg-green-500/10 text-green-500'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
  commonlyUsed?: boolean
}

export interface ComponentDoc {
  name: string
  description: string
  importPath: string
  importName?: string
  usageCode: string
  props: PropDefinition[]
  notes?: string[]
  sourceFile?: string
}

interface DocPanelProps {
  docs: ComponentDoc | ComponentDoc[]
  className?: string
}

function PropRow({ prop }: { prop: PropDefinition }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className={cn(
          'hover:bg-muted/20 transition-colors cursor-pointer md:cursor-default',
          prop.commonlyUsed && 'bg-primary/[0.03]'
        )}
        onClick={() => setExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((prev) => !prev)
          }
        }}
        tabIndex={0}
        role="row"
        aria-expanded={expanded}
      >
        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
          <span className="flex items-center gap-1.5">
            <ChevronRight
              className={cn(
                'h-3 w-3 text-muted-foreground transition-transform md:hidden shrink-0',
                expanded && 'rotate-90'
              )}
              aria-hidden="true"
            />
            {prop.commonlyUsed && (
              <Star
                className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0"
                aria-hidden="true"
              />
            )}
            <span className={cn(prop.required && 'font-semibold')}>
              {prop.name}
              {prop.required && <span className="text-red-400">*</span>}
            </span>
          </span>
        </td>
        <td className="px-3 py-2 font-mono text-xs text-muted-foreground max-w-[200px]">
          <span className="break-words">{prop.type}</span>
        </td>
        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
          {prop.default ?? '—'}
        </td>
        <td className="px-3 py-2 text-xs text-muted-foreground hidden md:table-cell">
          {prop.description}
        </td>
      </tr>
      {/* Expanded description row for mobile */}
      {expanded && (
        <tr className="md:hidden">
          <td colSpan={3} className="px-3 pb-3 pt-0">
            <p className="text-xs text-muted-foreground pl-5">
              {prop.description}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}

export function DocPanel({ docs, className }: DocPanelProps) {
  const docArray = Array.isArray(docs) ? docs : [docs]

  return (
    <div className={cn('space-y-8', className)}>
      {docArray.map((doc, index) => (
        <div
          key={doc.name}
          className={cn(index > 0 && 'pt-6 border-t border-border/50')}
        >
          {/* Component Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold font-mono">{doc.name}</h4>
              {doc.sourceFile && (
                <a
                  href={`https://github.com/christireid/Clarity-ai-chat-components/blob/main/packages/react/src/${doc.sourceFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`View source for ${doc.name}`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Source</span>
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {doc.description}
            </p>
          </div>

          {/* Import */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Import
              </h5>
              <CopyChip
                text={`import { ${doc.importName || doc.name} } from '${doc.importPath}'`}
                label="Copy import"
              />
            </div>
            <CodeHighlight
              code={`import { ${doc.importName || doc.name} } from '${doc.importPath}'`}
              language="typescript"
            />
          </div>

          {/* Props Table */}
          {doc.props.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Props
              </h5>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="table">
                    <thead>
                      <tr className="bg-muted/50 text-left">
                        <th
                          scope="col"
                          className="px-3 py-2 font-medium text-xs text-muted-foreground"
                        >
                          Prop
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 font-medium text-xs text-muted-foreground"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 font-medium text-xs text-muted-foreground"
                        >
                          Default
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 font-medium text-xs text-muted-foreground hidden md:table-cell"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {doc.props.map((prop) => (
                        <PropRow key={prop.name} prop={prop} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground"
                role="note"
              >
                <Star
                  className="h-3 w-3 text-amber-500 fill-amber-500"
                  aria-hidden="true"
                />
                <span>= commonly used</span>
                <span className="mx-1">|</span>
                <span className="text-red-400 font-semibold">*</span>
                <span>= required</span>
                <span className="mx-1 hidden md:inline">|</span>
                <span className="hidden md:inline">
                  Click row to expand on mobile
                </span>
              </div>
            </div>
          )}

          {/* Usage Example */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usage
              </h5>
              <CopyChip text={doc.usageCode} label="Copy example" />
            </div>
            <CodeHighlight code={doc.usageCode} language="tsx" />
          </div>

          {/* Notes */}
          {doc.notes && doc.notes.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Notes
              </h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {doc.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
