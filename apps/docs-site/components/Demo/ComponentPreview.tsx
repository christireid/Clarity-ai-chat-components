'use client'

import { useState, ReactNode } from 'react'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Eye, Code } from 'lucide-react'
import clsx from 'clsx'

interface ComponentPreviewProps {
  children: ReactNode
  code: string
  title?: string
  description?: string
  language?: string
  className?: string
}

export function ComponentPreview({
  children,
  code,
  title,
  description,
  language = 'tsx',
  className,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  return (
    <div className={clsx('my-6 border border-border rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="px-4 py-3">
          {title && <h3 className="font-semibold text-lg mb-1">{title}</h3>}
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        
        {/* Tabs */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveTab('preview')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
              activeTab === 'preview'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
              activeTab === 'code'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'preview' ? (
        <div className="p-8 bg-bg-primary min-h-[300px] flex items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="p-0">
          <CodeBlock code={code} language={language} showLineNumbers />
        </div>
      )}
    </div>
  )
}
