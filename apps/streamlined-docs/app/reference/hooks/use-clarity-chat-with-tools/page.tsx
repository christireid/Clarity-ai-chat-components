'use client'

/**
 * useClarityChatWithTools Hook - API Reference Documentation
 *
 * Mid-level hook that combines chat functionality with automatic tool result
 * extraction and rendering. Extends useClarityChat with tool UI registry integration.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  ChevronRight,
  Wrench,
  Layers,
  CheckCircle,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Props/Return Table Components (Reused from useClarityChat)
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
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  {
    id: 'parameters',
    title: 'Parameters',
    children: [
      { id: 'core-options', title: 'Core Options' },
      { id: 'tool-options', title: 'Inherited Options' },
    ],
  },
  {
    id: 'returns',
    title: 'Return Value',
    children: [
      { id: 'state-properties', title: 'Inherited Properties' },
      { id: 'tool-properties', title: 'Tool Properties' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-registry', title: 'Tool Registry' },
      { id: 'example-rendering', title: 'Custom Rendering' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related APIs' },
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

const coreOptionsProps: PropDefinition[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description:
      'API endpoint URL for chat completions. Must be a valid URL path or full URL.',
  },
  {
    name: 'toolRegistry',
    type: 'ToolComponentRegistry',
    required: true,
    description:
      'Tool UI registry mapping tool names to React components for rendering results.',
  },
  {
    name: 'autoExtractTools',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to automatically extract tool results from messages. Set to false for manual extraction.',
  },
]

const inheritedOptionsProps: PropDefinition[] = [
  {
    name: '...chatOptions',
    type: 'UseClarityChatOptions',
    description:
      'All options from useClarityChat are supported (memory, promptOptimization, transport, etc.)',
  },
]

const toolPropertiesReturn: PropDefinition[] = [
  {
    name: 'toolResults',
    type: 'ExtractedToolResult[]',
    description:
      'Array of extracted tool results from messages with tool call metadata.',
  },
  {
    name: 'getToolResultsForMessage',
    type: '(messageId: string) => ExtractedToolResult[]',
    description: 'Get all tool results for a specific message ID.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { useClarityChatWithTools } from '@clarity-chat/react'
import { createToolUIRegistry } from '@clarity-chat/react'
import type {
  UseClarityChatWithToolsOptions,
  UseClarityChatWithToolsReturn,
  ExtractedToolResult,
  ToolComponentRegistry,
} from '@clarity-chat/react'`

const signatureCode = `function useClarityChatWithTools(
  options: UseClarityChatWithToolsOptions
): UseClarityChatWithToolsReturn`

const basicUsageCode = `import { useClarityChatWithTools, createToolUIRegistry } from '@clarity-chat/react'

// 1. Define tool UI components
function WeatherResult({ result }: { result: any }) {
  return (
    <div className="weather-card">
      <h3>{result.location}</h3>
      <p>Temperature: {result.temp}°F</p>
      <p>Conditions: {result.conditions}</p>
    </div>
  )
}

function SearchResult({ result }: { result: any }) {
  return (
    <div className="search-results">
      <h3>Search Results</h3>
      <ul>
        {result.results.map((item: any, i: number) => (
          <li key={i}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

// 2. Create tool registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  web_search: SearchResult,
})

// 3. Use the hook
function ChatWithTools() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    toolResults,
  } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
  })

  return (
    <div className="chat-container">
      {/* Render messages */}
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={\`message \${message.role}\`}>
            {/* Text content */}
            {typeof message.content === 'string' && (
              <p>{message.content}</p>
            )}

            {/* Tool results */}
            {message.role === 'assistant' && message.id && (
              <div className="tool-results">
                {toolResults
                  .filter(tr => tr.messageId === message.id)
                  .map((toolResult, i) => {
                    const Component = toolRegistry.get(
                      toolResult.toolCall.function.name
                    )
                    return Component ? (
                      <Component key={i} result={toolResult.result} />
                    ) : null
                  })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}`

const registryCode = `import { createToolUIRegistry } from '@clarity-chat/react'

// Create registry with type-safe tool mappings
const registry = createToolUIRegistry({
  // Weather tool
  get_weather: ({ result }) => (
    <div className="p-4 rounded-lg bg-blue-50">
      <h3 className="font-bold">{result.location}</h3>
      <p className="text-2xl">{result.temp}°F</p>
      <p className="text-sm text-gray-600">{result.conditions}</p>
    </div>
  ),

  // Search tool with loading state
  web_search: ({ result }) => {
    if (!result) return <div>Loading search results...</div>

    return (
      <div className="space-y-2">
        <h3 className="font-semibold">Search Results</h3>
        {result.results.map((item: any) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded hover:bg-gray-50"
          >
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.snippet}</p>
          </a>
        ))}
      </div>
    )
  },

  // Code execution tool
  execute_code: ({ result }) => (
    <div className="font-mono bg-gray-900 text-green-400 p-4 rounded">
      <div className="text-xs text-gray-500 mb-2">Output:</div>
      <pre>{result.output}</pre>
      {result.error && (
        <div className="text-red-400 mt-2">Error: {result.error}</div>
      )}
    </div>
  ),

  // Image generation tool
  generate_image: ({ result }) => (
    <div className="image-result">
      <img
        src={result.url}
        alt={result.prompt}
        className="max-w-full rounded-lg"
      />
      <p className="text-sm text-gray-600 mt-2">
        Prompt: {result.prompt}
      </p>
    </div>
  ),
})

// Use registry in hook
const chat = useClarityChatWithTools({
  api: '/api/chat',
  toolRegistry: registry,
})`

const renderingCode = `import { useClarityChatWithTools } from '@clarity-chat/react'
import { ToolExecutionCard } from '@clarity-chat/react'

function CustomToolRendering() {
  const {
    messages,
    toolResults,
    getToolResultsForMessage,
  } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
  })

  return (
    <div className="messages">
      {messages.map((message) => {
        // Get tools for this specific message
        const messageToolResults = getToolResultsForMessage(message.id || '')

        return (
          <div key={message.id} className="message">
            {/* Regular message content */}
            {message.content && <p>{String(message.content)}</p>}

            {/* Custom tool result rendering */}
            {messageToolResults.length > 0 && (
              <div className="tool-results-container">
                <h4>Tool Executions ({messageToolResults.length})</h4>
                {messageToolResults.map((toolResult, i) => {
                  const Component = toolRegistry.get(
                    toolResult.toolCall.function.name
                  )

                  return (
                    <ToolExecutionCard
                      key={i}
                      toolName={toolResult.toolCall.function.name}
                      status="success"
                      result={
                        Component ? (
                          <Component result={toolResult.result} />
                        ) : (
                          <pre>{JSON.stringify(toolResult.result, null, 2)}</pre>
                        )
                      }
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}`

const typesCode = `// Extracted tool result type
interface ExtractedToolResult {
  /** Tool call information */
  toolCall: ToolCall
  /** Tool execution result */
  result: any
  /** Message ID this tool result belongs to */
  messageId: string
  /** Index in the message's tool calls array */
  index: number
}

// Tool call type
interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}

// Tool component registry type
type ToolComponentRegistry = Map<
  string,
  React.ComponentType<{ result: any }>
>

// Options interface
interface UseClarityChatWithToolsOptions extends UseClarityChatOptions {
  /** Tool UI registry for rendering tool results */
  toolRegistry: ToolComponentRegistry
  /** Whether to automatically extract tool results from messages */
  autoExtractTools?: boolean
}

// Return interface
interface UseClarityChatWithToolsReturn extends UseClarityChatReturn {
  /** Extracted tool results from messages */
  toolResults: ExtractedToolResult[]
  /** Get tool results for a specific message */
  getToolResultsForMessage: (messageId: string) => ExtractedToolResult[]
}

// Create tool registry helper
function createToolUIRegistry(
  tools: Record<string, React.ComponentType<{ result: any }>>
): ToolComponentRegistry {
  return new Map(Object.entries(tools))
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseClarityChatWithToolsPage() {
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
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  <Wrench className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hook
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useClarityChatWithTools
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Mid-level hook that extends useClarityChat with automatic tool
                result extraction and rendering. Maps tool calls to React
                components for seamless integration of AI tool usage in your
                chat interface.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Wrench,
                  label: 'Tool Calling',
                  desc: 'Automatic extraction',
                },
                { icon: Layers, label: 'UI Registry', desc: 'Component mapping' },
                { icon: Zap, label: 'Auto Extract', desc: 'Zero config' },
                { icon: CheckCircle, label: 'Type Safe', desc: 'Full TypeScript' },
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
                  <code>useClarityChatWithTools</code> combines the full
                  functionality of <code>useClarityChat</code> with automatic
                  tool result extraction and a UI registry for rendering tool
                  outputs. This hook simplifies building agentic chat
                  interfaces where the AI can call functions and display
                  results inline.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Automatic Tool Extraction:</strong> Parses messages
                    for tool calls and results
                  </li>
                  <li>
                    <strong>UI Registry:</strong> Map tool names to React
                    components for custom rendering
                  </li>
                  <li>
                    <strong>Message-Level Filtering:</strong> Helper to get
                    tools for specific messages
                  </li>
                  <li>
                    <strong>Full Chat Features:</strong> Inherits all
                    useClarityChat capabilities (streaming, memory, etc.)
                  </li>
                  <li>
                    <strong>Type-Safe:</strong> Complete TypeScript support
                    with inference
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <p>
                  Use this hook when building AI agents that need to execute
                  tools (functions) and display results in the chat. Examples:
                  weather lookups, web searches, code execution, database
                  queries, or any external API integration.
                </p>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <div className="space-y-4">
                <div className="relative">
                  <CodeBlock
                    code={importCode}
                    language="tsx"
                    filename="Import"
                    showDownloadButton={false}
                  />
                </div>
              </div>
            </Section>

            {/* Signature Section */}
            <Section id="signature" title="Signature">
              <div className="space-y-4">
                <CodeBlock
                  code={signatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> The <code>toolRegistry</code> is
                    required. Create it with <code>createToolUIRegistry()</code>{' '}
                    mapping tool names to components.
                  </p>
                </div>
              </div>
            </Section>

            {/* Parameters Section */}
            <Section id="parameters" title="Parameters">
              <p className="text-muted-foreground mb-6">
                The hook accepts all options from <code>useClarityChat</code>{' '}
                plus tool-specific configuration.
              </p>

              <SubSection id="core-options" title="Core Options">
                <PropsTable props={coreOptionsProps} />
              </SubSection>

              <SubSection id="tool-options" title="Inherited Options">
                <PropsTable props={inheritedOptionsProps} />
                <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    See{' '}
                    <Link
                      href="/reference/hooks/use-clarity-chat#parameters"
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      useClarityChat parameters
                    </Link>{' '}
                    for complete list of inherited options including memory,
                    streaming, and optimization.
                  </p>
                </div>
              </SubSection>
            </Section>

            {/* Return Value Section */}
            <Section id="returns" title="Return Value">
              <p className="text-muted-foreground mb-6">
                Returns all properties from <code>useClarityChat</code> plus
                tool-specific additions.
              </p>

              <SubSection id="state-properties" title="Inherited Properties">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Includes: <code>messages</code>, <code>input</code>,{' '}
                    <code>isLoading</code>, <code>error</code>,{' '}
                    <code>append</code>, <code>reload</code>, <code>stop</code>
                    , and more.
                    <br />
                    See{' '}
                    <Link
                      href="/reference/hooks/use-clarity-chat#returns"
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      useClarityChat return value
                    </Link>{' '}
                    for details.
                  </p>
                </div>
              </SubSection>

              <SubSection id="tool-properties" title="Tool Properties">
                <PropsTable props={toolPropertiesReturn} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Complete example showing tool registry creation and tool
                  result rendering:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatWithTools.tsx"
                />
              </SubSection>

              <SubSection id="example-registry" title="Tool Registry">
                <p className="text-muted-foreground mb-4">
                  Create a comprehensive tool UI registry with multiple tool
                  types:
                </p>
                <CodeBlock
                  code={registryCode}
                  language="tsx"
                  filename="ToolRegistry.tsx"
                />
              </SubSection>

              <SubSection id="example-rendering" title="Custom Rendering">
                <p className="text-muted-foreground mb-4">
                  Advanced rendering with <code>getToolResultsForMessage</code>{' '}
                  and custom UI:
                </p>
                <CodeBlock
                  code={renderingCode}
                  language="tsx"
                  filename="CustomToolRendering.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for the hook and helper functions:
              </p>
              <CodeBlock
                code={typesCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'Base chat hook without tool integration',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'createToolUIRegistry',
                    type: 'function',
                    description: 'Helper to create type-safe tool registries',
                    href: '/reference/utilities/create-tool-ui-registry',
                  },
                  {
                    name: 'ToolExecutionCard',
                    type: 'component',
                    description: 'Pre-built UI for displaying tool results',
                    href: '/reference/components/tool-execution-card',
                  },
                  {
                    name: 'useTool',
                    type: 'hook',
                    description:
                      'Low-level tool execution and state management',
                    href: '/reference/hooks/use-tool',
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
                            : api.type === 'function'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
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
                  href="/reference/hooks/use-clarity-chat"
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
                      useClarityChat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-streaming-sse"
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
                      useStreamingSSE
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
