'use client'

/**
 * StructuredInputBuilder Component - API Reference Documentation
 *
 * A form-based component for building structured prompts with token optimization.
 * Helps users organize inputs into sections optimally ordered for LLM processing.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Blocks,
  Layers,
  Gauge,
  Code2,
  CheckCircle2,
  Zap,
  FileJson,
  FormInput,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Database,
  TestTube,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [displayMode, setDisplayMode] = React.useState<'form' | 'compact' | 'inline'>('form')
  const [showTokenBreakdown, setShowTokenBreakdown] = React.useState(true)
  const [result, setResult] = React.useState<string>('')

  const demoFields = [
    {
      id: 'task',
      name: 'task',
      label: 'Task',
      type: 'textarea' as const,
      required: true,
      section: 'instruction' as const,
      priority: 'critical' as const,
      placeholder: 'What do you want the AI to do?',
      rows: 2,
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea' as const,
      required: false,
      section: 'context' as const,
      priority: 'medium' as const,
      placeholder: 'Any background information...',
      rows: 3,
    },
    {
      id: 'format',
      name: 'format',
      label: 'Output Format',
      type: 'select' as const,
      required: false,
      section: 'instruction' as const,
      priority: 'high' as const,
      options: [
        { value: 'text', label: 'Plain Text' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'json', label: 'JSON' },
        { value: 'code', label: 'Code' },
      ],
    },
  ]

  const handleSubmit = () => {
    const formatted = Object.entries(values)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    setResult(formatted || 'No values entered')
  }

  return (
    <div className="space-y-4">
      {/* Display mode selector */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="text-sm font-medium text-foreground">Display Mode:</div>
        <div className="flex gap-2">
          {(['form', 'compact', 'inline'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode)}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                displayMode === mode
                  ? 'bg-brand-500 text-white'
                  : 'bg-background border border-border hover:bg-muted'
              )}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm ml-auto">
          <input
            type="checkbox"
            checked={showTokenBreakdown}
            onChange={(e) => setShowTokenBreakdown(e.target.checked)}
            className="rounded"
          />
          Show Token Breakdown
        </label>
      </div>

      {/* Demo visualization */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Demo visualization (actual component would render here)
            </div>

            {demoFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={values[field.name] || ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={values[field.name] || ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={values[field.name] || ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                  />
                )}
                {showTokenBreakdown && (
                  <div className="text-xs text-muted-foreground">
                    ~{Math.ceil((values[field.name]?.length || 0) / 4)} tokens
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
            >
              Build Prompt
            </button>

            {result && (
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-sm font-medium text-foreground mb-2">Result:</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'field-configuration', title: 'Field Configuration' },
      { id: 'display-props', title: 'Display Options' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Form' },
      { id: 'example-presets', title: 'Using Presets' },
      { id: 'example-hook', title: 'With useStructuredInput Hook' },
      { id: 'example-api-testing', title: 'API Testing Interface' },
    ],
  },
  { id: 'preset-fields', title: 'Preset Fields' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'use-cases', title: 'Use Cases' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'fields',
    type: 'StructuredInputField[]',
    required: true,
    description: 'Array of field configurations defining the form structure.',
  },
  {
    name: 'values',
    type: 'Record<string, string>',
    required: true,
    description: 'Current field values as key-value pairs.',
  },
  {
    name: 'onChange',
    type: '(values: Record<string, string>) => void',
    required: true,
    description: 'Callback when field values change.',
  },
  {
    name: 'onSubmit',
    type: '(result: StructuredInputResult) => void',
    description: 'Callback when form is submitted with validation and token breakdown.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    default: '4000',
    description: 'Maximum input tokens budget for all fields combined.',
  },
  {
    name: 'formatPrompt',
    type: '(values: Record<string, string>, fields: StructuredInputField[]) => string',
    description: 'Custom function to format values into a prompt string.',
  },
]

const fieldConfigProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the field (must be unique across all fields).',
  },
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Field name used in output mapping.',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Display label for the field.',
  },
  {
    name: 'type',
    type: '"text" | "textarea" | "select" | "number" | "toggle"',
    required: true,
    description: 'Field input type.',
  },
  {
    name: 'required',
    type: 'boolean',
    required: true,
    description: 'Whether the field must have a value.',
  },
  {
    name: 'section',
    type: '"instruction" | "context" | "reference" | "question" | "constraint" | "example"',
    description: 'Section type for prompt structure optimization.',
  },
  {
    name: 'priority',
    type: '"critical" | "high" | "medium" | "low"',
    description: 'Priority for token trimming (higher = preserved when over budget).',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text for the input.',
  },
  {
    name: 'options',
    type: 'SelectOption[]',
    description: 'Array of options for select type fields.',
  },
  {
    name: 'validate',
    type: '(value: string) => boolean | string',
    description: 'Custom validation function. Return true for valid, string for error message.',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'displayMode',
    type: '"form" | "compact" | "inline"',
    default: '"form"',
    description: 'Layout mode: form (full), compact (grid), or inline (horizontal).',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Size variant for spacing and text.',
  },
  {
    name: 'showTokenBreakdown',
    type: 'boolean',
    default: 'false',
    description: 'Show token count per field.',
  },
  {
    name: 'showTotalTokens',
    type: 'boolean',
    default: 'true',
    description: 'Show total token count and budget bar.',
  },
  {
    name: 'showSubmitButton',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the submit button.',
  },
  {
    name: 'submitLabel',
    type: 'string',
    default: '"Build Prompt"',
    description: 'Text for the submit button.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable all fields and submit button.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Optional title for the builder.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Optional description text.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { StructuredInputBuilder } from '@clarity-chat/react'
import { useStructuredInput, PRESET_FIELDS } from '@clarity-chat/react'
import type {
  StructuredInputField,
  StructuredInputResult
} from '@clarity-chat/react'`

const basicUsageCode = `import { useState } from 'react'
import { StructuredInputBuilder } from '@clarity-chat/react'
import type { StructuredInputField } from '@clarity-chat/react'

export function PromptBuilder() {
  const fields: StructuredInputField[] = [
    {
      id: 'task',
      name: 'task',
      label: 'Task Description',
      type: 'textarea',
      required: true,
      section: 'instruction',
      priority: 'critical',
      placeholder: 'What do you want the AI to do?',
      rows: 2,
    },
    {
      id: 'context',
      name: 'context',
      label: 'Background Context',
      type: 'textarea',
      required: false,
      section: 'context',
      priority: 'medium',
      placeholder: 'Any relevant background information...',
      rows: 3,
    },
    {
      id: 'format',
      name: 'format',
      label: 'Output Format',
      type: 'select',
      required: false,
      section: 'instruction',
      priority: 'high',
      options: [
        { value: 'text', label: 'Plain Text' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'json', label: 'JSON' },
      ],
    },
  ]

  const [values, setValues] = useState<Record<string, string>>({})

  const handleSubmit = (result: StructuredInputResult) => {
    console.log('Formatted prompt:', result.formattedPrompt)
    console.log('Total tokens:', result.totalTokens)
    console.log('Valid:', result.isValid)
  }

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      onSubmit={handleSubmit}
      maxTokens={4000}
      showTokenBreakdown
    />
  )
}`

const presetsCode = `import { PRESET_FIELDS } from '@clarity-chat/react'

// Use pre-built field configurations
const fields = [
  PRESET_FIELDS.task(),
  PRESET_FIELDS.context(),
  PRESET_FIELDS.constraints(),
  PRESET_FIELDS.format(),
  PRESET_FIELDS.tone(),
  PRESET_FIELDS.examples(),
]

// Customize presets with overrides
const customFields = [
  PRESET_FIELDS.task({
    label: 'What should the AI do?',
    placeholder: 'Describe the task in detail...',
  }),
  PRESET_FIELDS.context({
    required: true,
    priority: 'high',
  }),
]`

const hookCode = `import { useStructuredInput, PRESET_FIELDS } from '@clarity-chat/react'

export function SmartPromptBuilder() {
  const fields = [
    PRESET_FIELDS.task(),
    PRESET_FIELDS.context(),
    PRESET_FIELDS.format(),
  ]

  const {
    values,
    setValues,
    result,
    reset,
    isOverBudget,
    maxTokens,
  } = useStructuredInput(fields, {
    maxTokens: 4000,
    initialValues: {
      format: 'markdown',
    },
  })

  const handleSubmit = () => {
    if (result.isValid) {
      console.log('Sending prompt:', result.formattedPrompt)
      // Send to your API
    }
  }

  return (
    <div>
      <StructuredInputBuilder
        fields={fields}
        values={values}
        onChange={setValues}
        maxTokens={maxTokens}
        showTokenBreakdown
      />

      {isOverBudget && (
        <div className="text-amber-600">
          Over token budget! Consider reducing input length.
        </div>
      )}

      <button onClick={handleSubmit} disabled={!result.isValid}>
        Submit
      </button>
      <button onClick={reset}>Reset</button>

      <div>
        <h4>Preview:</h4>
        <pre>{result.formattedPrompt}</pre>
        <p>Tokens: {result.totalTokens} / {maxTokens}</p>
      </div>
    </div>
  )
}`

const apiTestingCode = `import { StructuredInputBuilder, PRESET_FIELDS } from '@clarity-chat/react'

export function APITestingTool() {
  const fields = [
    {
      id: 'endpoint',
      name: 'endpoint',
      label: 'API Endpoint',
      type: 'text',
      required: true,
      section: 'instruction',
      priority: 'critical',
      placeholder: '/api/generate',
    },
    {
      id: 'method',
      name: 'method',
      label: 'HTTP Method',
      type: 'select',
      required: true,
      section: 'instruction',
      priority: 'critical',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
    },
    {
      id: 'headers',
      name: 'headers',
      label: 'Headers (JSON)',
      type: 'textarea',
      required: false,
      section: 'context',
      priority: 'medium',
      placeholder: '{"Content-Type": "application/json"}',
      validate: (value) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'Invalid JSON format'
        }
      },
    },
    {
      id: 'body',
      name: 'body',
      label: 'Request Body (JSON)',
      type: 'textarea',
      required: false,
      section: 'context',
      priority: 'medium',
      placeholder: '{"prompt": "Hello"}',
      rows: 5,
      validate: (value) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'Invalid JSON format'
        }
      },
    },
  ]

  const [values, setValues] = useState({})

  const handleSubmit = async (result: StructuredInputResult) => {
    const { endpoint, method, headers, body } = result.values

    const options: RequestInit = {
      method,
      headers: headers ? JSON.parse(headers) : {},
    }

    if (body && method !== 'GET') {
      options.body = body
    }

    const response = await fetch(endpoint, options)
    const data = await response.json()
    console.log('API Response:', data)
  }

  return (
    <div className="max-w-2xl">
      <h2>API Testing Tool</h2>
      <StructuredInputBuilder
        fields={fields}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        title="Configure Request"
        description="Build and test API requests with JSON validation"
        displayMode="form"
        submitLabel="Send Request"
      />
    </div>
  )
}`

const typescriptCode = `// Core types
interface StructuredInputField {
  id: string
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'toggle'
  required: boolean
  defaultValue?: string
  description?: string
  placeholder?: string
  maxLength?: number
  options?: SelectOption[]
  validate?: (value: string) => boolean | string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  section?: 'instruction' | 'context' | 'reference' | 'question' | 'constraint' | 'example'
  rows?: number
  disabled?: boolean
}

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface StructuredInputResult {
  values: Record<string, string>
  formattedPrompt: string
  tokenBreakdown: TokenBreakdown[]
  totalTokens: number
  errors: Record<string, string>
  isValid: boolean
}

interface TokenBreakdown {
  fieldId: string
  fieldName: string
  tokens: number
  percentage: number
}

// Component props
interface StructuredInputBuilderProps {
  fields: StructuredInputField[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
  onSubmit?: (result: StructuredInputResult) => void
  maxTokens?: number
  showTokenBreakdown?: boolean
  showTotalTokens?: boolean
  formatPrompt?: (values: Record<string, string>, fields: StructuredInputField[]) => string
  displayMode?: 'form' | 'compact' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  submitLabel?: string
  showSubmitButton?: boolean
  title?: string
  description?: string
}

// Hook return type
interface UseStructuredInputReturn {
  values: Record<string, string>
  setValues: (values: Record<string, string>) => void
  setFieldValue: (name: string, value: string) => void
  result: StructuredInputResult
  reset: () => void
  maxTokens: number
  isOverBudget: boolean
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function StructuredInputBuilderPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Blocks className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Beta
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      P2
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                StructuredInputBuilder
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A form-based component for building structured prompts with token optimization.
                Organizes inputs into sections optimally ordered for LLM processing and KV cache
                efficiency, with real-time token estimation and priority-based field management.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Layers,
                  label: 'Section-Based',
                  desc: 'Organized structure',
                },
                {
                  icon: Gauge,
                  label: 'Token Tracking',
                  desc: 'Real-time estimation',
                },
                {
                  icon: CheckCircle2,
                  label: 'Validation',
                  desc: 'Built-in & custom',
                },
                {
                  icon: Zap,
                  label: 'Priority System',
                  desc: 'Smart trimming',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>StructuredInputBuilder</code> provides a token-aware form interface for
                  building complex, structured prompts. It's designed for applications that need
                  to organize user inputs into sections optimized for LLM processing.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Multiple Field Types:</strong> Text, textarea, select, number, and
                    toggle inputs
                  </li>
                  <li>
                    <strong>Real-Time Token Estimation:</strong> Track token usage per field with
                    visual breakdown
                  </li>
                  <li>
                    <strong>Priority-Based Management:</strong> Fields marked critical, high,
                    medium, or low for intelligent token budget allocation
                  </li>
                  <li>
                    <strong>Section Organization:</strong> Group fields into instruction, context,
                    reference, example, constraint, and question sections
                  </li>
                  <li>
                    <strong>Built-in Validation:</strong> Required fields, max length, custom
                    validators
                  </li>
                  <li>
                    <strong>Preset Fields:</strong> Pre-configured common fields (task, context,
                    format, tone, etc.)
                  </li>
                  <li>
                    <strong>Display Modes:</strong> Form, compact, and inline layouts
                  </li>
                  <li>
                    <strong>Custom Formatters:</strong> Control how values are formatted into
                    prompts
                  </li>
                  <li>
                    <strong>Accessible:</strong> Full keyboard navigation, ARIA labels, semantic HTML
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>Building prompt template interfaces</li>
                  <li>API testing and data entry tools</li>
                  <li>Complex form-based LLM interactions</li>
                  <li>Applications needing token budget awareness</li>
                  <li>Structured prompt builders for power users</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When NOT to Use
                </h4>
                <ul className="space-y-2">
                  <li>Simple single-input chat (use ChatInput instead)</li>
                  <li>When token optimization is not a concern</li>
                  <li>Real-time conversational interfaces</li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">Import the component:</p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Try the StructuredInputBuilder with different display modes and options.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Define fields and manage state with controlled values:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="PromptBuilder.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="field-configuration" title="Field Configuration">
                <p className="text-sm text-muted-foreground mb-4">
                  Properties for individual field definitions:
                </p>
                <PropsTable props={fieldConfigProps} />
              </SubSection>

              <SubSection id="display-props" title="Display Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Visual customization and layout options:
                </p>
                <PropsTable props={displayProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Form">
                <p className="text-muted-foreground mb-4">
                  Build a simple structured prompt form:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicForm.tsx"
                />
              </SubSection>

              <SubSection id="example-presets" title="Using Preset Fields">
                <p className="text-muted-foreground mb-4">
                  Leverage pre-built field configurations:
                </p>
                <CodeBlock
                  code={presetsCode}
                  language="tsx"
                  filename="PresetsExample.tsx"
                />
              </SubSection>

              <SubSection id="example-hook" title="With useStructuredInput Hook">
                <p className="text-muted-foreground mb-4">
                  Use the companion hook for automatic state management:
                </p>
                <CodeBlock
                  code={hookCode}
                  language="tsx"
                  filename="HookExample.tsx"
                />
              </SubSection>

              <SubSection id="example-api-testing" title="API Testing Interface">
                <p className="text-muted-foreground mb-4">
                  Build an API testing tool with JSON validation:
                </p>
                <CodeBlock
                  code={apiTestingCode}
                  language="tsx"
                  filename="APITesting.tsx"
                />
              </SubSection>
            </Section>

            {/* Preset Fields Section */}
            <Section id="preset-fields" title="Preset Fields">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The component includes pre-configured fields for common use cases:
                </p>

                <div className="not-prose space-y-4 mt-4">
                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.task()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Task description textarea with critical priority.
                    </p>
                    <code className="text-xs">Section: instruction</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.context()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Background context textarea with medium priority.
                    </p>
                    <code className="text-xs">Section: context</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.constraints()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Constraints textarea with high priority.
                    </p>
                    <code className="text-xs">Section: constraint</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.format()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Output format selector (text, markdown, JSON, code, bullet).
                    </p>
                    <code className="text-xs">Section: instruction</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.tone()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tone selector (professional, casual, technical, friendly, formal).
                    </p>
                    <code className="text-xs">Section: instruction</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.examples()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Examples textarea for providing sample inputs/outputs.
                    </p>
                    <code className="text-xs">Section: example</code>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-2">
                      PRESET_FIELDS.question()
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Question textarea with critical priority.
                    </p>
                    <code className="text-xs">Section: question</code>
                  </div>
                </div>

                <p className="mt-4">
                  All presets can be customized with overrides:
                </p>

                <CodeBlock
                  code={`PRESET_FIELDS.task({
  id: 'custom-task',
  label: 'Custom Label',
  placeholder: 'Custom placeholder...',
  required: false,
})`}
                  language="tsx"
                  filename="CustomPreset.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for type-safe development:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Use Cases Section */}
            <Section id="use-cases" title="Use Cases">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        API Testing Tools
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Build structured API request builders with JSON validation, header
                        management, and method selection. Perfect for developer tools and
                        debugging interfaces.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Data Entry Forms
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Create token-aware data entry interfaces that track input length and
                        validate against token budgets. Ideal for content management systems.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Prompt Template Builders
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Let users create reusable prompt templates with sections, priorities,
                        and validation. Great for prompt engineering tools and AI assistants.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <TestTube className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Experiment Configuration
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Configure complex AI experiments with structured parameters, constraints,
                        and objectives. Perfect for research and testing interfaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Duplicate field ID warnings
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure each field has a unique <code>id</code> property
                        </li>
                        <li>
                          When using presets multiple times, override the <code>id</code> and{' '}
                          <code>name</code>
                        </li>
                        <li>
                          Check console for development warnings about duplicates
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Token estimates seem inaccurate
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Token estimation uses a simple ~4 chars per token heuristic
                        </li>
                        <li>
                          For exact counts, integrate with a proper tokenizer (e.g., tiktoken)
                        </li>
                        <li>
                          Estimates are close enough for budget management in most cases
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Custom validation not working
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure validate function returns <code>true</code> for valid or a string
                          error message
                        </li>
                        <li>
                          Check that the function is defined on the field configuration
                        </li>
                        <li>
                          Validation runs on every change and before submit
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        formatPrompt not being called
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Custom formatter is only called when <code>onSubmit</code> is provided
                        </li>
                        <li>
                          If the custom formatter throws an error, it falls back to default
                        </li>
                        <li>
                          Check the <code>result.formattedPrompt</code> in the submit callback
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'AdvancedChatInput',
                    type: 'component',
                    description: 'Power-user chat input with autocomplete and file upload',
                    href: '/reference/components/advanced-chat-input',
                  },
                  {
                    name: 'OutputPreferenceSelector',
                    type: 'component',
                    description: 'Let users specify output format preferences',
                    href: '/reference/components/output-preference-selector',
                  },
                  {
                    name: 'useStructuredInput',
                    type: 'hook',
                    description: 'Hook for managing structured input state',
                    href: '/reference/hooks/use-structured-input',
                  },
                  {
                    name: 'TokenBudgetBar',
                    type: 'component',
                    description: 'Visual token budget indicator',
                    href: '/reference/components/token-budget-bar',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/advanced-chat-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AdvancedChatInput
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/output-preference-selector"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      OutputPreferenceSelector
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
