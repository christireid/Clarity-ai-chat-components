'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Terminal,
  Play,
  Code2,
  Zap,
} from 'lucide-react'

// MDX Heading Components
interface MDXHeadingProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export function MDXHeading1({ children, id, className }: MDXHeadingProps) {
  return (
    <h1
      id={id}
      className={cn(
        'mt-10 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0',
        className
      )}
    >
      {children}
    </h1>
  )
}

export function MDXHeading2({ children, id, className }: MDXHeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
    >
      {children}
    </h2>
  )
}

export function MDXHeading3({ children, id, className }: MDXHeadingProps) {
  return (
    <h3
      id={id}
      className={cn(
        'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h3>
  )
}

export function MDXHeading4({ children, id, className }: MDXHeadingProps) {
  return (
    <h4
      id={id}
      className={cn(
        'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h4>
  )
}

// MDX Paragraph
export function MDXParagraph({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  )
}

// MDX Blockquote
export function MDXBlockquote({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-accent pl-6 italic text-muted-foreground',
        className
      )}
    >
      {children}
    </blockquote>
  )
}

// MDX List Components
export function MDXUnorderedList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>
      {children}
    </ul>
  )
}

export function MDXOrderedList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ol className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}>
      {children}
    </ol>
  )
}

// MDX Code Components
interface MDXInlineCodeProps {
  children: React.ReactNode
  className?: string
}

export function MDXInlineCode({ children, className }: MDXInlineCodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
    >
      {children}
    </code>
  )
}

interface MDXCodeBlockProps {
  children: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export function MDXCodeBlock({
  children,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: MDXCodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = children.trim().split('\n')

  return (
    <div
      className={cn(
        'group relative my-6 overflow-hidden rounded-lg border',
        className
      )}
    >
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2">
            {filename ? (
              <>
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{filename}</span>
              </>
            ) : (
              <Badge variant="secondary" className="text-xs">
                {language}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Code */}
      <pre className="overflow-x-auto bg-muted/30 p-4">
        <code className="font-mono text-sm">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                'whitespace-pre',
                highlightLines.includes(i + 1) && 'bg-accent/20 -mx-4 px-4'
              )}
            >
              {showLineNumbers && (
                <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground">
                  {i + 1}
                </span>
              )}
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

// MDX Callout/Admonition
type CalloutType = 'note' | 'tip' | 'warning' | 'danger' | 'info'

interface MDXCalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

export function MDXCallout({
  type = 'note',
  title,
  children,
  className,
}: MDXCalloutProps) {
  const config = {
    note: {
      icon: <Info className="h-5 w-5" />,
      bgClass: 'bg-accent/10 border-accent',
      textClass: 'text-accent',
      defaultTitle: 'Note',
    },
    tip: {
      icon: <Lightbulb className="h-5 w-5" />,
      bgClass: 'bg-green-500/10 border-green-500',
      textClass: 'text-green-600',
      defaultTitle: 'Tip',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5" />,
      bgClass: 'bg-yellow-500/10 border-yellow-500',
      textClass: 'text-yellow-600',
      defaultTitle: 'Warning',
    },
    danger: {
      icon: <XCircle className="h-5 w-5" />,
      bgClass: 'bg-destructive/10 border-destructive',
      textClass: 'text-destructive',
      defaultTitle: 'Danger',
    },
    info: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      bgClass: 'bg-blue-500/10 border-blue-500',
      textClass: 'text-blue-600',
      defaultTitle: 'Info',
    },
  }

  const { icon, bgClass, textClass, defaultTitle } = config[type]

  return (
    <div className={cn('my-6 rounded-lg border-l-4 p-4', bgClass, className)}>
      <div className={cn('flex items-center gap-2 font-semibold', textClass)}>
        {icon}
        <span>{title || defaultTitle}</span>
      </div>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  )
}

// MDX Tabs
interface MDXTabsProps {
  items: { label: string; value: string; content: React.ReactNode }[]
  defaultValue?: string
  className?: string
}

export function MDXTabs({ items, defaultValue, className }: MDXTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue || items[0]?.value}
      className={cn('my-6', className)}
    >
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

// MDX Accordion/Details
interface MDXAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function MDXAccordion({
  title,
  children,
  defaultOpen = false,
  className,
}: MDXAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('my-4 rounded-lg border', className)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-muted/50">
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t p-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

// MDX Card
interface MDXCardProps {
  title: string
  description?: string
  href?: string
  icon?: React.ReactNode
  className?: string
}

export function MDXCard({
  title,
  description,
  href,
  icon,
  className,
}: MDXCardProps) {
  const content = (
    <Card
      className={cn(
        'group transition-colors',
        href && 'cursor-pointer hover:border-accent hover:bg-muted/50',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          {href && (
            <ExternalLink className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
          )}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    </Card>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

// MDX Card Grid
interface MDXCardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

export function MDXCardGrid({
  children,
  columns = 2,
  className,
}: MDXCardGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={cn('my-6 grid gap-4', gridClass[columns], className)}>
      {children}
    </div>
  )
}

// MDX Steps
interface MDXStepsProps {
  children: React.ReactNode
  className?: string
}

export function MDXSteps({ children, className }: MDXStepsProps) {
  return (
    <div className={cn('my-6 ml-4 border-l pl-8', className)}>{children}</div>
  )
}

interface MDXStepProps {
  title: string
  children: React.ReactNode
  number?: number
}

export function MDXStep({ title, children, number }: MDXStepProps) {
  return (
    <div className="relative pb-8 last:pb-0">
      <div className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full border bg-background">
        {number !== undefined ? (
          <span className="text-sm font-semibold">{number}</span>
        ) : (
          <div className="h-2 w-2 rounded-full bg-accent" />
        )}
      </div>
      <h4 className="mb-2 font-semibold">{title}</h4>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

// MDX Table
interface MDXTableProps {
  children: React.ReactNode
  className?: string
}

export function MDXTable({ children, className }: MDXTableProps) {
  return (
    <div className={cn('my-6 w-full overflow-auto', className)}>
      <table className="w-full">{children}</table>
    </div>
  )
}

export function MDXTableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>
}

export function MDXTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function MDXTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>
}

export function MDXTableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </th>
  )
}

export function MDXTableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  )
}

// MDX Link
interface MDXLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function MDXLink({ href, children, className }: MDXLinkProps) {
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'font-medium text-accent underline underline-offset-4 hover:text-accent/80',
        className
      )}
    >
      {children}
      {isExternal && <ExternalLink className="ml-1 inline-block h-3 w-3" />}
    </a>
  )
}

// MDX Image
interface MDXImageProps {
  src: string
  alt: string
  caption?: string
  className?: string
}

export function MDXImage({ src, alt, caption, className }: MDXImageProps) {
  return (
    <figure className={cn('my-6', className)}>
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className="rounded-lg border"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Export MDX Components object for use with MDX providers
export const MDXComponents = {
  h1: MDXHeading1,
  h2: MDXHeading2,
  h3: MDXHeading3,
  h4: MDXHeading4,
  p: MDXParagraph,
  blockquote: MDXBlockquote,
  ul: MDXUnorderedList,
  ol: MDXOrderedList,
  code: MDXInlineCode,
  pre: MDXCodeBlock,
  a: MDXLink,
  table: MDXTable,
  thead: MDXTableHeader,
  tbody: MDXTableBody,
  tr: MDXTableRow,
  th: MDXTableHead,
  td: MDXTableCell,
  img: MDXImage,
  Callout: MDXCallout,
  Tabs: MDXTabs,
  Accordion: MDXAccordion,
  Card: MDXCard,
  CardGrid: MDXCardGrid,
  Steps: MDXSteps,
  Step: MDXStep,
}
