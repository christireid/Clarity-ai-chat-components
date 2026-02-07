'use client'

import {
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import { LucideIcon, Eye, BookOpen, Link as LinkIcon } from 'lucide-react'
import { DocPanel, type ComponentDoc } from './doc-panel'
import { SectionErrorBoundary } from './section-error-boundary'
import { slugify } from '@/lib/slugify'

interface ComponentSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
  docs?: ComponentDoc | ComponentDoc[]
}

export function ComponentSection({
  title,
  description,
  children,
  className,
  icon: Icon,
  docs,
}: ComponentSectionProps) {
  const anchor = slugify(title)

  return (
    <div
      id={anchor}
      className={cn('glass-card p-6 mb-8 scroll-mt-24', className)}
    >
      <div className="flex items-start gap-3 mb-4 group/header">
        {Icon && (
          <div className="icon-container-sm shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <a
              href={`#${anchor}`}
              aria-label={`Link to ${title}`}
              className="opacity-0 group-hover/header:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </a>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <SectionErrorBoundary sectionTitle={title}>
        {docs ? (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="mb-4 h-auto gap-1 p-1 bg-muted/50">
              <TabsTrigger
                value="preview"
                className="rounded-md gap-1.5 text-xs px-3 py-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="rounded-md gap-1.5 text-xs px-3 py-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Documentation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div>{children}</div>
            </TabsContent>
            <TabsContent value="docs">
              <DocPanel docs={docs} />
            </TabsContent>
          </Tabs>
        ) : (
          <div>{children}</div>
        )}
      </SectionErrorBoundary>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description: string
  icon?: LucideIcon
  badge?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
}: PageHeaderProps) {
  return (
    <div className="mb-10 relative">
      {/* Background gradient */}
      <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5 rounded-3xl -z-10" />

      <div className="flex items-start gap-4">
        {Icon && (
          <div className="icon-container shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {badge && <span className="badge-glass text-xs">{badge}</span>}
          </div>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>

      {/* Decorative line */}
      <div className="section-divider mt-6" />
    </div>
  )
}

export function ComponentGrid({
  children,
  cols = 1,
}: {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
}) {
  return (
    <div
      className={cn(
        'grid gap-6',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      )}
    >
      {children}
    </div>
  )
}

export function ComponentDemo({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string
  title?: string
}) {
  return (
    <div className={cn('glass-panel p-4 rounded-xl', className)}>
      {title && (
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

export function ComponentCard({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}) {
  return (
    <div className={cn('feature-card', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h4 className="font-medium">{title}</h4>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export function StatCard({
  value,
  label,
  icon: Icon,
  trend,
  className,
}: {
  value: string | number
  label: string
  icon?: LucideIcon
  trend?: { value: string; positive: boolean }
  className?: string
}) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between mb-2">
        {Icon && (
          <div className="icon-container-sm">
            <Icon className="h-4 w-4" />
          </div>
        )}
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.positive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {trend.positive ? '+' : ''}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold gradient-text">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
