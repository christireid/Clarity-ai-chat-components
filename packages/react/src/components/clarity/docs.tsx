'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Book,
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Star,
  Clock,
  User,
  Hash,
  Link2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

// Types
export interface DocPage {
  id: string
  title: string
  slug: string
  description?: string
  category?: string
  tags?: string[]
  lastUpdated?: Date
  author?: string
}

export interface DocSection {
  id: string
  title: string
  pages: DocPage[]
  icon?: React.ReactNode
}

// Documentation Sidebar
export interface DocSidebarProps {
  sections: DocSection[]
  currentPage?: string
  onNavigate: (slug: string) => void
  searchable?: boolean
  className?: string
}

export function DocSidebar({
  sections,
  currentPage,
  onNavigate,
  searchable = true,
  className,
}: DocSidebarProps) {
  const [search, setSearch] = React.useState('')
  const [expandedSections, setExpandedSections] = React.useState<string[]>(
    sections.map((s) => s.id)
  )

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const filteredSections = sections
    .map((section) => ({
      ...section,
      pages: section.pages.filter(
        (page) =>
          page.title.toLowerCase().includes(search.toLowerCase()) ||
          page.description?.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.pages.length > 0)

  return (
    <div className={cn('w-64 shrink-0', className)}>
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs..."
              className="pl-9"
            />
          </div>
        </div>
      )}

      <nav className="space-y-4">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
            >
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {section.icon || <Book className="h-4 w-4" />}
              <span>{section.title}</span>
            </button>

            {expandedSections.includes(section.id) && (
              <ul className="ml-6 space-y-1">
                {section.pages.map((page) => (
                  <li key={page.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(page.slug)}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors',
                        currentPage === page.slug
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {page.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

// Documentation Header
export interface DocHeaderProps {
  title: string
  description?: string
  category?: string
  tags?: string[]
  lastUpdated?: Date
  author?: string
  className?: string
}

export function DocHeader({
  title,
  description,
  category,
  tags,
  lastUpdated,
  author,
  className,
}: DocHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {category && (
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{category}</Badge>
        </div>
      )}
      <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mb-4">{description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {lastUpdated && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdated.toLocaleDateString()}</span>
          </div>
        )}
        {author && (
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <Hash className="h-4 w-4 text-muted-foreground" />
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Code Example Block
export interface CodeExampleProps {
  title?: string
  description?: string
  code: string
  language?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeExample({
  title,
  description,
  code,
  language = 'typescript',
  showLineNumbers = true,
  className,
}: CodeExampleProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      {(title || description) && (
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          {title && <h4 className="font-medium text-sm">{title}</h4>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="absolute top-2 right-2 h-8 w-8"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <pre className="p-4 overflow-x-auto bg-code-bg">
          <code className="text-sm font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-muted-foreground w-8 shrink-0">
                    {i + 1}
                  </span>
                )}
                <span>{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// API Reference Card
export interface APIParameter {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

export interface APIReferenceProps {
  name: string
  description?: string
  parameters?: APIParameter[]
  returns?: { type: string; description: string }
  example?: string
  className?: string
}

export function APIReference({
  name,
  description,
  parameters,
  returns,
  example,
  className,
}: APIReferenceProps) {
  return (
    <div className={cn('border border-border rounded-lg', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-mono font-semibold">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {parameters && parameters.length > 0 && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium mb-3">Parameters</h4>
          <div className="space-y-3">
            {parameters.map((param) => (
              <div key={param.name} className="text-sm">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-accent">{param.name}</code>
                  <code className="text-muted-foreground">{param.type}</code>
                  {param.required && (
                    <Badge variant="destructive" className="text-xs">
                      required
                    </Badge>
                  )}
                  {param.default && (
                    <span className="text-muted-foreground">
                      = {param.default}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {param.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {returns && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium mb-2">Returns</h4>
          <div className="text-sm">
            <code className="text-muted-foreground">{returns.type}</code>
            <p className="text-muted-foreground mt-1">{returns.description}</p>
          </div>
        </div>
      )}

      {example && (
        <div className="p-4">
          <h4 className="text-sm font-medium mb-2">Example</h4>
          <pre className="p-3 bg-muted rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{example}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

// Documentation Navigation (prev/next)
export interface DocNavigationProps {
  prev?: { title: string; slug: string }
  next?: { title: string; slug: string }
  onNavigate: (slug: string) => void
  className?: string
}

export function DocNavigation({
  prev,
  next,
  onNavigate,
  className,
}: DocNavigationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-8 mt-8 border-t border-border',
        className
      )}
    >
      {prev ? (
        <button
          type="button"
          onClick={() => onNavigate(prev.slug)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Previous</div>
            <div className="font-medium">{prev.title}</div>
          </div>
        </button>
      ) : (
        <div />
      )}

      {next && (
        <button
          type="button"
          onClick={() => onNavigate(next.slug)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground text-right"
        >
          <div>
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="font-medium">{next.title}</div>
          </div>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Quick Links
export interface QuickLink {
  title: string
  href: string
  description?: string
  icon?: React.ReactNode
}

export interface QuickLinksProps {
  links: QuickLink[]
  title?: string
  className?: string
}

export function QuickLinks({
  links,
  title = 'Quick Links',
  className,
}: QuickLinksProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {link.icon || (
              <Link2 className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm">{link.title}</div>
              {link.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {link.description}
                </div>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}

// Callout/Admonition
export interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip'
  title?: string
  children: React.ReactNode
  className?: string
}

export function Callout({
  type = 'info',
  title,
  children,
  className,
}: CalloutProps) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/50 text-blue-500',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500',
    error: 'bg-red-500/10 border-red-500/50 text-red-500',
    success: 'bg-green-500/10 border-green-500/50 text-green-500',
    tip: 'bg-purple-500/10 border-purple-500/50 text-purple-500',
  }

  const titles = {
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
    tip: 'Tip',
  }

  return (
    <div className={cn('border-l-4 p-4 rounded-r-lg', styles[type], className)}>
      <div className="font-medium mb-1">{title || titles[type]}</div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}
