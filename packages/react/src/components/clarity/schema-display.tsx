'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  ChevronRight,
  Copy,
  Check,
  Braces,
  Hash,
  Type,
  ToggleLeft,
  List,
  Calendar,
  Link2,
  FileJson,
  Database,
  AlertCircle,
  Info,
} from 'lucide-react'

// Types
export interface SchemaProperty {
  name: string
  type: string | string[]
  description?: string
  required?: boolean
  enum?: string[]
  default?: unknown
  format?: string
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  properties?: Record<string, SchemaProperty>
  items?: SchemaProperty
  $ref?: string
}

export interface SchemaDisplayProps {
  schema: Record<string, unknown>
  title?: string
  description?: string
  format?: 'json-schema' | 'typescript' | 'graphql'
  expandLevel?: number
  showCopyButton?: boolean
  className?: string
}

// Type icons
const typeIcons: Record<string, React.ReactNode> = {
  string: <Type className="h-3 w-3" />,
  number: <Hash className="h-3 w-3" />,
  integer: <Hash className="h-3 w-3" />,
  boolean: <ToggleLeft className="h-3 w-3" />,
  array: <List className="h-3 w-3" />,
  object: <Braces className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
  uri: <Link2 className="h-3 w-3" />,
}

// Type colors
const typeColors: Record<string, string> = {
  string: 'text-green-500',
  number: 'text-blue-500',
  integer: 'text-blue-500',
  boolean: 'text-amber-500',
  array: 'text-purple-500',
  object: 'text-pink-500',
  null: 'text-gray-500',
}

// Property Row
function PropertyRow({
  name,
  property,
  required,
  depth = 0,
  expandLevel = 2,
}: {
  name: string
  property: SchemaProperty
  required?: boolean
  depth?: number
  expandLevel?: number
}) {
  const [isOpen, setIsOpen] = React.useState(depth < expandLevel)
  const hasChildren =
    property.properties ||
    (property.items &&
      (property.items.properties || property.items.type === 'object'))

  const typeStr = Array.isArray(property.type)
    ? property.type.join(' | ')
    : property.type || 'unknown'

  const primaryType = Array.isArray(property.type)
    ? property.type[0]
    : property.type

  return (
    <div className={cn('border-l border-border', depth > 0 && 'ml-4')}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-start gap-2 py-1.5 px-2 hover:bg-muted/50 rounded-r-md group">
          {/* Expand toggle */}
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button className="mt-0.5 p-0.5 hover:bg-muted rounded">
                <ChevronRight
                  className={cn(
                    'h-3 w-3 text-muted-foreground transition-transform',
                    isOpen && 'rotate-90'
                  )}
                />
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-4" />
          )}

          {/* Property name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-sm">{name}</span>
            {required && <span className="text-destructive text-xs">*</span>}
          </div>

          {/* Type badge */}
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'text-xs',
                typeColors[primaryType] || 'text-muted-foreground'
              )}
            >
              {typeIcons[primaryType]}
            </span>
            <span
              className={cn(
                'font-mono text-xs',
                typeColors[primaryType] || 'text-muted-foreground'
              )}
            >
              {typeStr}
              {property.format && (
                <span className="text-muted-foreground ml-1">
                  ({property.format})
                </span>
              )}
            </span>
          </div>

          {/* Enum indicator */}
          {property.enum && (
            <Badge variant="outline" className="text-xs h-5">
              enum
            </Badge>
          )}

          {/* Description tooltip */}
          {property.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">{property.description}</p>
                  {property.default !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Default: {JSON.stringify(property.default)}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Nested properties */}
        <CollapsibleContent>
          {property.properties && (
            <div className="ml-2">
              {Object.entries(property.properties).map(([key, prop]) => (
                <PropertyRow
                  key={key}
                  name={key}
                  property={prop as SchemaProperty}
                  required={(
                    property as { required?: string[] }
                  ).required?.includes(key)}
                  depth={depth + 1}
                  expandLevel={expandLevel}
                />
              ))}
            </div>
          )}
          {property.items && property.items.properties && (
            <div className="ml-2">
              <div className="text-xs text-muted-foreground px-2 py-1">
                Array items:
              </div>
              {Object.entries(property.items.properties).map(([key, prop]) => (
                <PropertyRow
                  key={key}
                  name={key}
                  property={prop as SchemaProperty}
                  depth={depth + 1}
                  expandLevel={expandLevel}
                />
              ))}
            </div>
          )}
          {property.enum && (
            <div className="ml-6 px-2 py-1 flex flex-wrap gap-1">
              {property.enum.map((val) => (
                <Badge
                  key={val}
                  variant="secondary"
                  className="text-xs font-mono"
                >
                  {val}
                </Badge>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// Main Schema Display
export function SchemaDisplay({
  schema,
  title,
  description,
  format = 'json-schema',
  expandLevel = 2,
  showCopyButton = true,
  className,
}: SchemaDisplayProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const properties = (schema.properties || schema) as Record<
    string,
    SchemaProperty
  >
  const requiredFields = (schema.required || []) as string[]

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent/10 text-accent">
            <FileJson className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{title || 'Schema'}</h4>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {format}
          </Badge>
          {showCopyButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Schema tree */}
      <div className="p-2 max-h-96 overflow-auto scrollbar-thin">
        {Object.entries(properties).map(([key, prop]) => (
          <PropertyRow
            key={key}
            name={key}
            property={prop as SchemaProperty}
            required={requiredFields.includes(key)}
            expandLevel={expandLevel}
          />
        ))}
      </div>
    </div>
  )
}

// JSON Schema Viewer
export interface JSONSchemaViewerProps {
  schema: Record<string, unknown>
  className?: string
}

export function JSONSchemaViewer({ schema, className }: JSONSchemaViewerProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn('rounded-lg border border-border bg-code-bg', className)}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-code-border">
        <span className="text-xs text-muted-foreground font-mono">
          JSON Schema
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="p-3 text-xs font-mono overflow-auto max-h-80 scrollbar-thin">
        {JSON.stringify(schema, null, 2)}
      </pre>
    </div>
  )
}

// Database Schema Display
export interface TableSchema {
  name: string
  columns: {
    name: string
    type: string
    nullable?: boolean
    primaryKey?: boolean
    foreignKey?: { table: string; column: string }
    default?: string
  }[]
}

export interface DatabaseSchemaProps {
  tables: TableSchema[]
  title?: string
  className?: string
}

export function DatabaseSchema({
  tables,
  title = 'Database Schema',
  className,
}: DatabaseSchemaProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-accent" />
        <h3 className="font-medium">{title}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tables.map((table) => (
          <div
            key={table.name}
            className="rounded-lg border border-border bg-card"
          >
            <div className="px-3 py-2 border-b border-border bg-muted/50">
              <span className="font-mono text-sm font-medium">
                {table.name}
              </span>
            </div>
            <div className="p-2">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between px-2 py-1 text-sm rounded hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    {col.primaryKey && (
                      <span className="text-amber-500 text-xs">PK</span>
                    )}
                    {col.foreignKey && (
                      <span className="text-blue-500 text-xs">FK</span>
                    )}
                    <span className="font-mono">{col.name}</span>
                    {!col.nullable && (
                      <span className="text-destructive text-xs">*</span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {col.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// File Path Display
export interface FilePathProps {
  path: string
  lineNumber?: number
  columnNumber?: number
  clickable?: boolean
  onPathClick?: () => void
  className?: string
}

export function FilePath({
  path,
  lineNumber,
  columnNumber,
  clickable = false,
  onPathClick,
  className,
}: FilePathProps) {
  const parts = path.split('/')
  const fileName = parts.pop()
  const directory = parts.join('/')

  return (
    <button
      className={cn(
        'inline-flex items-center gap-1 font-mono text-sm',
        clickable && 'hover:text-accent cursor-pointer',
        !clickable && 'cursor-default',
        className
      )}
      onClick={clickable ? onPathClick : undefined}
      disabled={!clickable}
    >
      {directory && <span className="text-muted-foreground">{directory}/</span>}
      <span className="font-medium">{fileName}</span>
      {lineNumber !== undefined && (
        <span className="text-muted-foreground">
          :{lineNumber}
          {columnNumber !== undefined && `:${columnNumber}`}
        </span>
      )}
    </button>
  )
}

// Stack Trace Display
export interface StackFrame {
  file: string
  line: number
  column?: number
  function?: string
  isInternal?: boolean
}

export interface StackTraceDisplayProps {
  frames: StackFrame[]
  error?: { name: string; message: string }
  title?: string
  onFrameClick?: (frame: StackFrame) => void
  className?: string
}

export function StackTraceDisplay({
  frames,
  error,
  title = 'Stack Trace',
  onFrameClick,
  className,
}: StackTraceDisplayProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-destructive/50 bg-destructive/5',
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-destructive/20">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="font-medium text-sm">{title}</span>
      </div>

      {error && (
        <div className="px-3 py-2 border-b border-destructive/20 bg-destructive/10">
          <span className="font-mono text-sm text-destructive font-medium">
            {error.name}: {error.message}
          </span>
        </div>
      )}

      <div className="p-2 max-h-64 overflow-auto scrollbar-thin">
        {frames.map((frame, index) => (
          <button
            key={index}
            className={cn(
              'w-full text-left px-2 py-1.5 rounded hover:bg-muted/50 transition-colors',
              frame.isInternal && 'opacity-50'
            )}
            onClick={() => onFrameClick?.(frame)}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground w-4">{index}</span>
              {frame.function && (
                <span className="font-mono text-sm">{frame.function}</span>
              )}
            </div>
            <div className="ml-6">
              <FilePath
                path={frame.file}
                lineNumber={frame.line}
                columnNumber={frame.column}
                clickable
                className="text-xs"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
