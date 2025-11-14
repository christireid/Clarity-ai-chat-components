'use client'

import { Check, X, Copy } from 'lucide-react'
import { useState, useCallback } from 'react'
import clsx from 'clsx'

export interface Prop {
  name: string
  type: string
  default?: string
  required?: boolean
  description?: string
  deprecated?: boolean
  deprecatedMessage?: string
}

interface PropsTableProps {
  props: Prop[]
  title?: string
  className?: string
}

export function PropsTable({ props, title = 'Props', className }: PropsTableProps) {
  const [copiedProp, setCopiedProp] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedProp(text)
      setTimeout(() => setCopiedProp(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  if (props.length === 0) {
    return null
  }

  return (
    <div className={clsx('my-8', className)}>
      {title && (
        <h3 className="text-2xl font-bold mb-4 text-text-primary">{title}</h3>
      )}
      
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="text-left p-4 font-semibold text-text-primary">Name</th>
              <th className="text-left p-4 font-semibold text-text-primary">Type</th>
              <th className="text-left p-4 font-semibold text-text-primary">Default</th>
              <th className="text-left p-4 font-semibold text-text-primary">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <tr
                key={prop.name}
                className={clsx(
                  'border-b border-border last:border-b-0',
                  'hover:bg-bg-secondary/50 transition-colors',
                  prop.deprecated && 'opacity-60'
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-semibold text-text-primary bg-bg-tertiary px-2 py-1 rounded">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-xs font-medium text-red-500 dark:text-red-400">
                        required
                      </span>
                    )}
                    {prop.deprecated && (
                      <span className="text-xs font-medium text-orange-500 dark:text-orange-400">
                        deprecated
                      </span>
                    )}
                    <button
                      onClick={() => copyToClipboard(prop.name)}
                      className="ml-auto p-1 rounded hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Copy ${prop.name}`}
                    >
                      <Copy className="w-3 h-3 text-text-secondary" />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <code className="text-sm font-mono text-brand-500 dark:text-brand-400">
                    {prop.type}
                  </code>
                </td>
                <td className="p-4">
                  {prop.default ? (
                    <code className="text-sm font-mono text-text-secondary bg-bg-tertiary px-2 py-1 rounded">
                      {prop.default}
                    </code>
                  ) : (
                    <span className="text-text-tertiary">—</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm text-text-secondary">
                    {prop.deprecated && prop.deprecatedMessage && (
                      <div className="mb-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-orange-600 dark:text-orange-400">
                        <strong>Deprecated:</strong> {prop.deprecatedMessage}
                      </div>
                    )}
                    {prop.description || <span className="text-text-tertiary">—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
