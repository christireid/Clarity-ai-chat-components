'use client'

import { cn } from '@clarity-chat/primitives'
import { CodeHighlight } from './code-highlight'
import { Star } from 'lucide-react'

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
}

interface DocPanelProps {
  docs: ComponentDoc | ComponentDoc[]
  className?: string
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
            <h4 className="text-lg font-semibold font-mono">{doc.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {doc.description}
            </p>
          </div>

          {/* Import */}
          <div className="mb-4">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Import
            </h5>
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
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-left">
                        <th className="px-3 py-2 font-medium text-xs text-muted-foreground">
                          Prop
                        </th>
                        <th className="px-3 py-2 font-medium text-xs text-muted-foreground">
                          Type
                        </th>
                        <th className="px-3 py-2 font-medium text-xs text-muted-foreground">
                          Default
                        </th>
                        <th className="px-3 py-2 font-medium text-xs text-muted-foreground hidden md:table-cell">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {doc.props.map((prop) => (
                        <tr
                          key={prop.name}
                          className={cn(
                            'hover:bg-muted/20 transition-colors',
                            prop.commonlyUsed && 'bg-primary/[0.03]'
                          )}
                        >
                          <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                            <span className="flex items-center gap-1.5">
                              {prop.commonlyUsed && (
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span
                                className={cn(prop.required && 'font-semibold')}
                              >
                                {prop.name}
                                {prop.required && (
                                  <span className="text-red-400">*</span>
                                )}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>= commonly used</span>
                <span className="mx-1">|</span>
                <span className="text-red-400 font-semibold">*</span>
                <span>= required</span>
              </div>
            </div>
          )}

          {/* Usage Example */}
          <div className="mb-4">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Usage
            </h5>
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
