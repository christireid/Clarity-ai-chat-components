'use client'

import { useState, useMemo } from 'react'
import { Search, Info, Code, AlertCircle, BookOpen, Link as LinkIcon } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import type { ComponentDocs } from '@/lib/docs-parser'
import { PropsTable } from './PropsTable'
import { CodeExample } from './CodeExample'
import { BestPractices } from './BestPractices'
import { TroubleshootingGuide } from './TroubleshootingGuide'
import { RelatedComponents } from './RelatedComponents'

interface DocumentationViewerProps {
  docs: ComponentDocs
  className?: string
}

type Tab = 'overview' | 'props' | 'examples' | 'best-practices' | 'troubleshooting'

export function DocumentationViewer({
  docs,
  className,
}: DocumentationViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter props based on search
  const filteredProps = useMemo(() => {
    if (!searchQuery) return docs.props

    const query = searchQuery.toLowerCase()
    return docs.props.filter(
      (prop) =>
        prop.name.toLowerCase().includes(query) ||
        prop.type.toLowerCase().includes(query) ||
        (prop.description?.toLowerCase().includes(query) ?? false)
    )
  }, [docs.props, searchQuery])

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Info },
    { id: 'props' as const, label: 'Props', icon: Code, count: docs.props.length },
    {
      id: 'examples' as const,
      label: 'Examples',
      icon: BookOpen,
      count: docs.examples.length,
    },
    {
      id: 'best-practices' as const,
      label: 'Best Practices',
      icon: AlertCircle,
      count: docs.bestPractices.length,
    },
    {
      id: 'troubleshooting' as const,
      label: 'Troubleshooting',
      icon: AlertCircle,
      count: docs.troubleshooting.length,
    },
  ]

  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      {/* Header */}
      <div className="border-b border-border/50 bg-background/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{docs.name}</h2>
            {docs.description && (
              <p className="text-muted-foreground">{docs.description}</p>
            )}
            {docs.tags && docs.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {docs.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge-glass text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {docs.category && (
            <div className="badge-glass">
              {docs.category}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search props, examples, or documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50 bg-background/30">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  'hover:bg-background/50',
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full',
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-hide">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Component Overview</h3>
              <p className="text-muted-foreground">
                {docs.description ||
                  `The ${docs.name} component provides advanced functionality for your application.`}
              </p>
            </div>

            {docs.props.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Reference</h3>
                <div className="glass-panel p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    This component accepts {docs.props.length} prop
                    {docs.props.length !== 1 ? 's' : ''}, with{' '}
                    {docs.props.filter((p) => p.required).length} required.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {docs.props.slice(0, 5).map((prop) => (
                      <code
                        key={prop.name}
                        className="text-xs bg-background/50 px-2 py-1 rounded"
                      >
                        {prop.name}
                        {prop.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </code>
                    ))}
                    {docs.props.length > 5 && (
                      <span className="text-xs text-muted-foreground self-center">
                        +{docs.props.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {docs.relatedComponents && docs.relatedComponents.length > 0 && (
              <RelatedComponents components={docs.relatedComponents} />
            )}
          </div>
        )}

        {activeTab === 'props' && (
          <PropsTable props={searchQuery ? filteredProps : docs.props} />
        )}

        {activeTab === 'examples' && (
          <div className="space-y-6">
            {docs.examples.length > 0 ? (
              docs.examples.map((example, index) => (
                <CodeExample key={index} example={example} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No examples available yet.</p>
                <p className="text-sm mt-2">Check back later for usage examples.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'best-practices' && (
          <BestPractices practices={docs.bestPractices} />
        )}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingGuide items={docs.troubleshooting} />
        )}
      </div>

      {/* Footer with external link */}
      <div className="border-t border-border/50 bg-background/30 p-4">
        <a
          href={`https://docs.clarity-chat.com/components/${docs.name.toLowerCase()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <LinkIcon className="h-4 w-4" />
          View full documentation
        </a>
      </div>
    </div>
  )
}
