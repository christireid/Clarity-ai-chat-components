'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  Wrench,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Shield,
  Terminal,
  FileCode,
  ChevronRight,
  Layers,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  Clock,
  AlertCircle,
  Workflow,
  Cpu,
  Search,
  Calculator,
  Cloud,
  Code,
  Settings,
  Lock,
  Bug,
  HelpCircle,
  Box,
  GitBranch,
  CheckSquare,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const toolDefinitionExample = `import { z } from 'zod'
import type { ToolDefinition } from '@clarity-chat/react'

// Define the tool with TypeScript types
interface WeatherArgs {
  location: string
  units?: 'celsius' | 'fahrenheit'
}

interface WeatherResult {
  temperature: number
  conditions: string
  humidity: number
  windSpeed: number
}

export const weatherTool: ToolDefinition<WeatherArgs, WeatherResult> = {
  // Unique identifier (alphanumeric + underscore)
  name: 'get_weather',

  // Description helps the AI decide when to use this tool
  description: 'Get current weather conditions for a specific location. ' +
    'Use this when the user asks about weather, temperature, or conditions.',

  // Display name for UI (optional)
  displayName: 'Weather Lookup',

  // Parameter schema using JSON Schema format
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City and state/country, e.g., "San Francisco, CA" or "London, UK"',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units (default: celsius)',
        default: 'celsius',
      },
    },
    required: ['location'],
  },

  // The actual execution function
  execute: async (args, context) => {
    console.log(\`Executing weather tool for \${args.location}\`)

    const response = await fetch(
      \`https://api.weather.example/v1/current?\` +
      \`location=\${encodeURIComponent(args.location)}&units=\${args.units || 'celsius'}\`
    )

    if (!response.ok) {
      throw new Error(\`Weather API error: \${response.status}\`)
    }

    return response.json()
  },

  // Security settings
  requiresApproval: true,  // User must approve before execution
  cacheable: true,         // Results can be cached
  cacheTtl: 300000,        // Cache for 5 minutes
  timeout: 10000,          // 10 second timeout

  // Organization
  category: 'information',
  tags: ['weather', 'api', 'external'],
  icon: 'cloud',
  color: '#3B82F6',

  // Lifecycle hooks for advanced control
  hooks: {
    onBefore: async (args, context) => {
      console.log(\`[Weather] Starting request for \${args.location}\`)
    },
    onAfter: async (result, args, context) => {
      console.log(\`[Weather] Completed: \${result.temperature} degrees\`)
    },
    onError: async (error, args, context) => {
      console.error(\`[Weather] Failed for \${args.location}:\`, error)
    },
  },
}`

const zodSchemaExample = `import { z } from 'zod'
import type { ToolDefinition, ToolParameters } from '@clarity-chat/react'

// Define schema with Zod for runtime validation
const searchParamsSchema = z.object({
  query: z.string().min(1).max(500).describe('Search query text'),
  maxResults: z.number().int().min(1).max(100).default(10),
  filters: z.object({
    dateRange: z.enum(['day', 'week', 'month', 'year', 'all']).optional(),
    type: z.array(z.enum(['article', 'video', 'image'])).optional(),
  }).optional(),
})

// Type inference from Zod schema
type SearchParams = z.infer<typeof searchParamsSchema>

// Convert Zod schema to JSON Schema for tool definition
function zodToJsonSchema(schema: z.ZodType): ToolParameters {
  // Use zod-to-json-schema library in production
  // This is a simplified example
  return {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query text',
        minLength: 1,
        maxLength: 500,
      },
      maxResults: {
        type: 'integer',
        description: 'Maximum number of results to return',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
      filters: {
        type: 'object',
        properties: {
          dateRange: {
            type: 'string',
            enum: ['day', 'week', 'month', 'year', 'all'],
          },
          type: {
            type: 'array',
            items: { type: 'string', enum: ['article', 'video', 'image'] },
          },
        },
      },
    },
    required: ['query'],
  }
}

export const searchTool: ToolDefinition<SearchParams> = {
  name: 'search',
  description: 'Search for information across multiple sources',
  parameters: zodToJsonSchema(searchParamsSchema),

  execute: async (args, context) => {
    // Validate with Zod before processing
    const validated = searchParamsSchema.parse(args)
    // ... perform search
    return { results: [] }
  },
}`

const basicToolSetupExample = `'use client'

import { useClarityChatWithTools, createToolUIRegistry } from '@clarity-chat/react'
import { weatherTool } from './tools/weather'
import { searchTool } from './tools/search'
import { calculatorTool } from './tools/calculator'
import { WeatherCard } from './components/WeatherCard'
import { SearchResults } from './components/SearchResults'
import { CalculatorResult } from './components/CalculatorResult'

// Create a registry mapping tool names to UI components
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherCard,
  search: SearchResults,
  calculator: CalculatorResult,
})

export function ChatWithTools() {
  const {
    messages,
    toolResults,
    isLoading,
    error,
    sendMessage,
    getToolResultsForMessage,
  } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
    autoExtractTools: true,
  })

  return (
    <div className="flex flex-col h-screen">
      {/* Message list */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {/* Message content */}
            <div className={\`p-4 rounded-lg \${
              message.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
            }\`}>
              {message.content}
            </div>

            {/* Tool results for this message */}
            {getToolResultsForMessage(message.id).map((toolResult, index) => {
              const Component = toolRegistry.get(toolResult.toolCall.function.name)
              if (!Component) return null

              return (
                <div key={index} className="ml-8 p-4 border rounded-lg">
                  <Component result={toolResult.result} />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => {
        e.preventDefault()
        const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
        if (input.value.trim()) {
          sendMessage(input.value)
          input.value = ''
        }
      }}>
        <input
          name="message"
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="w-full px-4 py-3 border-t"
        />
      </form>
    </div>
  )
}`

const serverToolExecutionExample = `// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ToolOrchestrator } from '@clarity-chat/react/tools'
import { weatherTool, searchTool, calculatorTool } from '@/lib/tools'

// Create orchestrator with tools
const orchestrator = new ToolOrchestrator({
  autoApprove: false,  // IMPORTANT: Require approval in production
  defaultTimeout: 30000,
  enableCaching: true,
  tools: [weatherTool, searchTool, calculatorTool],
})

export async function POST(req: NextRequest) {
  const { messages, toolCalls } = await req.json()

  // Handle tool execution requests
  if (toolCalls && toolCalls.length > 0) {
    const results = await Promise.all(
      toolCalls.map(async (call: { id: string; name: string; args: any }) => {
        try {
          const result = await orchestrator.executeTool(call.name, call.args)

          return {
            callId: call.id,
            toolName: call.name,
            success: result.status === 'completed',
            result: result.result,
            error: result.error?.message,
          }
        } catch (error) {
          return {
            callId: call.id,
            toolName: call.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    return NextResponse.json({ toolResults: results })
  }

  // Stream AI response with tool calling
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages,
      tools: orchestrator.getAllTools().map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
      tool_choice: 'auto',
      stream: true,
    }),
  })

  // Return streaming response
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}`

const toolExecutionCardExample = `'use client'

import { ToolApprovalDialog } from '@clarity-chat/react'
import { useState, useEffect } from 'react'
import type { ToolCallRecord, ToolDefinition } from '@clarity-chat/react'

interface ToolExecutionCardProps {
  toolCall: ToolCallRecord
  toolDefinition?: ToolDefinition
  onApprove: (callId: string) => void
  onReject: (callId: string, reason: string) => void
}

export function ToolExecutionCard({
  toolCall,
  toolDefinition,
  onApprove,
  onReject,
}: ToolExecutionCardProps) {
  const statusColors = {
    pending: 'bg-gray-100 border-gray-300',
    pending_approval: 'bg-yellow-50 border-yellow-300',
    approved: 'bg-blue-50 border-blue-300',
    executing: 'bg-blue-100 border-blue-400',
    completed: 'bg-green-50 border-green-300',
    failed: 'bg-red-50 border-red-300',
    timeout: 'bg-orange-50 border-orange-300',
    cancelled: 'bg-gray-100 border-gray-400',
    rejected: 'bg-red-50 border-red-400',
  }

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-gray-500" />,
    pending_approval: <UserCheck className="w-4 h-4 text-yellow-500" />,
    approved: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
    executing: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    timeout: <Clock className="w-4 h-4 text-orange-500" />,
    cancelled: <XCircle className="w-4 h-4 text-gray-500" />,
    rejected: <XCircle className="w-4 h-4 text-red-500" />,
  }

  return (
    <div className={\`rounded-lg border-2 p-4 \${statusColors[toolCall.status]}\`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{toolCall.toolName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {statusIcons[toolCall.status]}
          <span className="text-sm capitalize">{toolCall.status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Arguments */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Arguments:</p>
        <pre className="text-xs bg-white/50 p-2 rounded overflow-x-auto">
          {JSON.stringify(toolCall.args, null, 2)}
        </pre>
      </div>

      {/* Result or Error */}
      {toolCall.status === 'completed' && toolCall.result && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Result:</p>
          <pre className="text-xs bg-white/50 p-2 rounded overflow-x-auto max-h-32">
            {JSON.stringify(toolCall.result, null, 2)}
          </pre>
        </div>
      )}

      {toolCall.status === 'failed' && toolCall.error && (
        <div className="mb-3 p-2 bg-red-100 rounded">
          <p className="text-sm text-red-700">{toolCall.error.message}</p>
        </div>
      )}

      {/* Approval Actions */}
      {toolCall.status === 'pending_approval' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onApprove(toolCall.id)}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(toolCall.id, 'User declined')}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}

      {/* Duration */}
      {toolCall.duration && (
        <p className="text-xs text-gray-400 mt-2">
          Completed in {toolCall.duration}ms
        </p>
      )}
    </div>
  )
}`

const humanInTheLoopExample = `'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToolOrchestrator, ToolApprovalDialog } from '@clarity-chat/react/tools'
import type { ToolCallRecord, ToolDefinition } from '@clarity-chat/react'

export function ChatWithApproval() {
  const [orchestrator] = useState(() => new ToolOrchestrator({
    autoApprove: false,  // Require manual approval
  }))

  const [pendingApprovals, setPendingApprovals] = useState<ToolCallRecord[]>([])
  const [currentApproval, setCurrentApproval] = useState<ToolCallRecord | null>(null)

  // Listen for tools awaiting approval
  useEffect(() => {
    const unsubscribe = orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPendingApprovals(prev => [...prev, event.call])
      // Show approval dialog for first pending tool
      if (!currentApproval) {
        setCurrentApproval(event.call)
      }
    })

    return unsubscribe
  }, [orchestrator, currentApproval])

  // Handle approval
  const handleApprove = useCallback(async (callId: string, reason?: string) => {
    orchestrator.approveTool(callId, 'user')

    // Execute the approved tool
    const result = await orchestrator.executeApprovedTool(callId)
    console.log('Tool executed:', result)

    // Remove from pending and show next
    setPendingApprovals(prev => {
      const remaining = prev.filter(p => p.id !== callId)
      setCurrentApproval(remaining[0] || null)
      return remaining
    })
  }, [orchestrator])

  // Handle rejection
  const handleReject = useCallback((callId: string, reason: string) => {
    orchestrator.rejectTool(callId, reason, 'user')

    // Remove from pending and show next
    setPendingApprovals(prev => {
      const remaining = prev.filter(p => p.id !== callId)
      setCurrentApproval(remaining[0] || null)
      return remaining
    })
  }, [orchestrator])

  return (
    <div>
      {/* Chat interface */}
      <ChatInterface orchestrator={orchestrator} />

      {/* Pending approval count */}
      {pendingApprovals.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full">
          {pendingApprovals.length} tool(s) awaiting approval
        </div>
      )}

      {/* Approval dialog */}
      {currentApproval && (
        <ToolApprovalDialog
          toolCall={currentApproval}
          toolDefinition={orchestrator.getTool(currentApproval.toolName)}
          onApprove={handleApprove}
          onReject={handleReject}
          showArguments={true}
          showDescription={true}
          showRiskLevel={true}
          theme="auto"
        />
      )}
    </div>
  )
}`

const multiStepToolExample = `'use client'

import { ToolOrchestrator, executeBatch, executeWithRetry } from '@clarity-chat/react/tools'
import { useState } from 'react'

// Example: Multi-step research workflow
export async function performResearch(
  orchestrator: ToolOrchestrator,
  query: string,
  onProgress?: (step: string, status: string) => void
) {
  const results: Record<string, any> = {}

  try {
    // Step 1: Search for relevant information
    onProgress?.('search', 'executing')
    const searchResult = await executeWithRetry(
      orchestrator,
      'search',
      { query, maxResults: 10 },
      { maxRetries: 2, onRetry: (attempt) => onProgress?.('search', \`retry \${attempt}\`) }
    )
    results.search = searchResult
    onProgress?.('search', 'completed')

    // Step 2: Analyze each result in parallel (batch execution)
    onProgress?.('analyze', 'executing')
    const analysisCalls = searchResult.results.slice(0, 5).map((result: any) => ({
      toolName: 'analyze_content',
      args: { url: result.url, extractSummary: true },
    }))

    const analyses = await executeBatch(orchestrator, analysisCalls, {
      maxConcurrent: 3,
      deduplicate: true,
      onProgress: (completed, total) => {
        onProgress?.('analyze', \`\${completed}/\${total}\`)
      },
    })
    results.analyses = analyses.filter(a => a.success).map(a => a.result)
    onProgress?.('analyze', 'completed')

    // Step 3: Synthesize findings
    onProgress?.('synthesize', 'executing')
    const synthesis = await orchestrator.executeTool('synthesize', {
      query,
      sources: results.analyses,
      format: 'summary',
    })
    results.synthesis = synthesis.result
    onProgress?.('synthesize', 'completed')

    return {
      success: true,
      results,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      partialResults: results,
    }
  }
}

// Usage in component
export function ResearchAssistant() {
  const [steps, setSteps] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)

  const handleResearch = async (query: string) => {
    setSteps({})
    setResult(null)

    const orchestrator = new ToolOrchestrator({ autoApprove: true })

    const research = await performResearch(orchestrator, query, (step, status) => {
      setSteps(prev => ({ ...prev, [step]: status }))
    })

    setResult(research)
  }

  return (
    <div>
      {/* Progress indicators */}
      <div className="space-y-2">
        {Object.entries(steps).map(([step, status]) => (
          <div key={step} className="flex items-center gap-2">
            {status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : status === 'executing' ? (
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
            <span className="capitalize">{step}</span>
            <span className="text-sm text-gray-500">({status})</span>
          </div>
        ))}
      </div>
    </div>
  )
}`

const builtInToolsExample = `import { ToolOrchestrator, ToolDefinition } from '@clarity-chat/react/tools'

// =============================================================================
// Calculator Tool
// =============================================================================
const calculatorTool: ToolDefinition = {
  name: 'calculator',
  description: 'Perform mathematical calculations. Supports basic arithmetic, ' +
    'percentages, and common math functions.',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate, e.g., "2 + 2", "sqrt(16)", "15% of 200"',
      },
    },
    required: ['expression'],
  },
  requiresApproval: false,  // Safe, no side effects
  cacheable: true,
  category: 'utility',
  tags: ['math', 'calculation'],

  execute: async (args) => {
    const { expression } = args

    // Parse and evaluate safely (use a proper math parser in production!)
    // This is simplified - use mathjs or similar library
    try {
      // Handle percentages
      const processed = expression
        .replace(/(\\d+)%\\s*of\\s*(\\d+)/gi, '($1/100)*$2')
        .replace(/(\\d+)%/g, '($1/100)')

      // Safe evaluation (in production, use a proper math parser)
      const result = Function(\`"use strict"; return (\${processed})\`)()

      return {
        expression,
        result,
        formatted: typeof result === 'number' ? result.toLocaleString() : String(result),
      }
    } catch (error) {
      throw new Error(\`Invalid expression: \${expression}\`)
    }
  },
}

// =============================================================================
// Search Tool
// =============================================================================
const searchTool: ToolDefinition = {
  name: 'web_search',
  description: 'Search the web for current information. Use this for recent events, ' +
    'facts, or anything that might have changed since training.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
      maxResults: {
        type: 'integer',
        description: 'Maximum number of results (1-10)',
        minimum: 1,
        maximum: 10,
        default: 5,
      },
    },
    required: ['query'],
  },
  requiresApproval: true,  // External API call
  cacheable: true,
  cacheTtl: 60000,  // 1 minute cache
  category: 'information',
  tags: ['search', 'web', 'external'],

  execute: async (args) => {
    const { query, maxResults = 5 } = args

    // In production, use a real search API (Google, Bing, Brave, etc.)
    const response = await fetch(
      \`https://api.search.example/v1/search?q=\${encodeURIComponent(query)}&limit=\${maxResults}\`,
      {
        headers: { 'Authorization': \`Bearer \${process.env.SEARCH_API_KEY}\` },
      }
    )

    if (!response.ok) {
      throw new Error(\`Search failed: \${response.status}\`)
    }

    return response.json()
  },
}

// =============================================================================
// Code Execution Tool (Sandboxed)
// =============================================================================
const codeExecutionTool: ToolDefinition = {
  name: 'execute_code',
  description: 'Execute code in a sandboxed environment. Supports JavaScript and Python.',
  parameters: {
    type: 'object',
    properties: {
      language: {
        type: 'string',
        enum: ['javascript', 'python'],
        description: 'Programming language',
      },
      code: {
        type: 'string',
        description: 'Code to execute',
      },
      timeout: {
        type: 'integer',
        description: 'Execution timeout in milliseconds (max 30000)',
        maximum: 30000,
        default: 5000,
      },
    },
    required: ['language', 'code'],
  },
  requiresApproval: true,  // ALWAYS require approval for code execution
  cacheable: false,        // Code execution should not be cached
  timeout: 30000,
  category: 'development',
  tags: ['code', 'execution', 'sandbox'],

  execute: async (args) => {
    const { language, code, timeout = 5000 } = args

    // In production, use a proper sandboxed execution environment
    // e.g., Web Workers, Docker containers, or cloud functions
    const response = await fetch('https://api.sandbox.example/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, timeout }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Execution failed')
    }

    return response.json()
  },
}

// Register all built-in tools
export function createDefaultOrchestrator() {
  return new ToolOrchestrator({
    tools: [calculatorTool, searchTool, codeExecutionTool],
    autoApprove: false,
  })
}`

const customToolTemplateExample = `import type { ToolDefinition, ToolExecutionContext } from '@clarity-chat/react'

// =============================================================================
// Custom Tool Template
// =============================================================================

interface MyToolArgs {
  // Define your input parameters
  param1: string
  param2?: number
}

interface MyToolResult {
  // Define your output structure
  data: any
  metadata: {
    processedAt: string
    duration: number
  }
}

export const myCustomTool: ToolDefinition<MyToolArgs, MyToolResult> = {
  // ===== REQUIRED FIELDS =====

  name: 'my_custom_tool',  // Unique identifier

  description: 'Describe what this tool does and when to use it. ' +
    'Be specific so the AI knows when to call it.',

  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of param1',
      },
      param2: {
        type: 'number',
        description: 'Optional numeric parameter',
        default: 10,
      },
    },
    required: ['param1'],
  },

  execute: async (args, context): Promise<MyToolResult> => {
    const startTime = Date.now()

    // Validate inputs
    if (!args.param1 || args.param1.length === 0) {
      throw new Error('param1 cannot be empty')
    }

    // Your tool logic here
    const result = await processData(args)

    return {
      data: result,
      metadata: {
        processedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
      },
    }
  },

  // ===== SECURITY SETTINGS =====

  requiresApproval: true,  // Set based on risk level
  cacheable: false,        // Set to true for pure functions
  cacheTtl: 300000,        // 5 minutes if cacheable
  timeout: 30000,          // 30 seconds max

  // ===== ORGANIZATION =====

  category: 'custom',
  tags: ['custom', 'example'],
  displayName: 'My Custom Tool',
  icon: 'wrench',
  color: '#8B5CF6',

  // ===== LIFECYCLE HOOKS =====

  hooks: {
    onBefore: async (args, context) => {
      // Validate, log, rate limit, etc.
      console.log(\`[MyTool] Starting with args:\`, args)
    },

    onAfter: async (result, args, context) => {
      // Log success, track metrics, etc.
      console.log(\`[MyTool] Completed:\`, result.metadata.duration, 'ms')
    },

    onError: async (error, args, context) => {
      // Error tracking, cleanup, etc.
      console.error(\`[MyTool] Error:\`, error.message)
      // Optionally report to error tracking service
    },

    onTimeout: async (args, context) => {
      // Handle timeout-specific cleanup
      console.warn(\`[MyTool] Timed out for args:\`, args)
    },

    onCancel: async (args, context) => {
      // Handle cancellation cleanup
      console.info(\`[MyTool] Cancelled\`)
    },
  },
}

async function processData(args: MyToolArgs): Promise<any> {
  // Implement your tool logic
  return { processed: true }
}`

const securityConsiderationsExample = `import { ToolOrchestrator, ToolDefinition } from '@clarity-chat/react/tools'
import { rateLimit } from '@/lib/rate-limit'
import { sanitize } from '@/lib/sanitize'

// =============================================================================
// 1. Input Validation
// =============================================================================

const validateToolInput = (toolName: string, args: Record<string, unknown>) => {
  // Sanitize string inputs to prevent injection
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(args)) {
    if (typeof value === 'string') {
      // Remove potential script injection
      sanitized[key] = sanitize(value)
    } else if (typeof value === 'number') {
      // Validate numeric ranges
      if (!Number.isFinite(value)) {
        throw new Error(\`Invalid number for \${key}\`)
      }
      sanitized[key] = value
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

// =============================================================================
// 2. Rate Limiting
// =============================================================================

const rateLimits: Record<string, { windowMs: number; maxRequests: number }> = {
  'web_search': { windowMs: 60000, maxRequests: 10 },      // 10/minute
  'execute_code': { windowMs: 60000, maxRequests: 5 },     // 5/minute
  'send_email': { windowMs: 3600000, maxRequests: 20 },    // 20/hour
}

const checkRateLimit = async (toolName: string, userId: string) => {
  const limit = rateLimits[toolName]
  if (!limit) return true

  const allowed = await rateLimit.check(\`tool:\${toolName}:\${userId}\`, limit)
  if (!allowed) {
    throw new Error(\`Rate limit exceeded for \${toolName}. Please try again later.\`)
  }
  return true
}

// =============================================================================
// 3. Sandboxed Execution
// =============================================================================

// For code execution tools, use proper sandboxing:
// - Web Workers (client-side)
// - Docker containers (server-side)
// - Cloud Functions (serverless)
// - VM2 or isolated-vm (Node.js)

const executeInSandbox = async (code: string, language: string) => {
  // Example using a sandboxed API endpoint
  const response = await fetch(process.env.SANDBOX_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Sandbox-Key': process.env.SANDBOX_API_KEY!,
    },
    body: JSON.stringify({
      code,
      language,
      limits: {
        memory: '128mb',
        cpu: '1',
        timeout: 5000,
        networkDisabled: true,  // No network access
        filesystemReadOnly: true,
      },
    }),
  })

  return response.json()
}

// =============================================================================
// 4. Secure Tool Orchestrator Setup
// =============================================================================

export function createSecureOrchestrator(userId: string) {
  const orchestrator = new ToolOrchestrator({
    autoApprove: false,  // NEVER auto-approve in production

    // Security: Prevent auto-approve in production is enforced by ToolOrchestrator
    // It will throw an error if autoApprove: true in production environment
  })

  // Add security middleware via lifecycle hooks
  orchestrator.lifecycle.on('tool_executing', async (event) => {
    const { call } = event

    // Rate limit check
    await checkRateLimit(call.toolName, userId)

    // Input validation
    call.args = validateToolInput(call.toolName, call.args)

    // Audit log
    console.log(\`[AUDIT] User \${userId} executing \${call.toolName}\`, {
      callId: call.id,
      args: call.args,
      timestamp: new Date().toISOString(),
    })
  })

  orchestrator.lifecycle.on('tool_completed', (event) => {
    // Audit successful execution
    console.log(\`[AUDIT] Tool \${event.call.toolName} completed\`, {
      callId: event.call.id,
      duration: event.call.duration,
      cached: event.call.cached,
    })
  })

  orchestrator.lifecycle.on('tool_failed', (event) => {
    // Log failures for security monitoring
    console.error(\`[SECURITY] Tool \${event.call.toolName} failed\`, {
      callId: event.call.id,
      error: event.call.error?.message,
      args: event.call.args,
    })
  })

  return orchestrator
}

// =============================================================================
// 5. Dangerous Tool Patterns to Avoid
// =============================================================================

// NEVER do these:
/*
const unsafeTool: ToolDefinition = {
  name: 'unsafe_eval',
  execute: async (args) => {
    // DANGER: Never use eval() with user input!
    return eval(args.code)
  },
}

const unsafeFileTool: ToolDefinition = {
  name: 'file_access',
  execute: async (args) => {
    // DANGER: Never allow unrestricted file access!
    return fs.readFileSync(args.path, 'utf8')
  },
}

const unsafeDbTool: ToolDefinition = {
  name: 'db_query',
  execute: async (args) => {
    // DANGER: Never interpolate user input into SQL!
    return db.query(\`SELECT * FROM users WHERE id = \${args.userId}\`)
  },
}
*/`

const completeExample = `'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ToolOrchestrator,
  ToolApprovalDialog,
  executeBatch,
  executeWithRetry,
  type ToolCallRecord,
  type ToolDefinition,
} from '@clarity-chat/react/tools'
import { useClarityChatWithTools, createToolUIRegistry } from '@clarity-chat/react'

// Import your tool definitions
import { weatherTool } from './tools/weather'
import { searchTool } from './tools/search'
import { calculatorTool } from './tools/calculator'

// Import your tool UI components
import { WeatherCard } from './components/WeatherCard'
import { SearchResults } from './components/SearchResults'
import { CalculatorResult } from './components/CalculatorResult'
import { ToolExecutionCard } from './components/ToolExecutionCard'

// Create tool registry for UI rendering
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherCard,
  web_search: SearchResults,
  calculator: CalculatorResult,
})

export default function ToolCallingDemo() {
  // Create orchestrator
  const [orchestrator] = useState(() => new ToolOrchestrator({
    autoApprove: false,
    defaultTimeout: 30000,
    enableCaching: true,
    tools: [weatherTool, searchTool, calculatorTool],
  }))

  // State
  const [pendingApprovals, setPendingApprovals] = useState<ToolCallRecord[]>([])
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallRecord[]>([])
  const [completedCalls, setCompletedCalls] = useState<ToolCallRecord[]>([])

  // Chat integration
  const chat = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
    autoExtractTools: true,
  })

  // Subscribe to tool lifecycle events
  useEffect(() => {
    const unsubscribers = [
      orchestrator.lifecycle.on('tool_pending_approval', (event) => {
        setPendingApprovals(prev => [...prev, event.call])
      }),

      orchestrator.lifecycle.on('tool_executing', (event) => {
        setPendingApprovals(prev => prev.filter(p => p.id !== event.call.id))
        setActiveToolCalls(prev => [...prev, event.call])
      }),

      orchestrator.lifecycle.on('tool_completed', (event) => {
        setActiveToolCalls(prev => prev.filter(p => p.id !== event.call.id))
        setCompletedCalls(prev => [...prev, event.call])
      }),

      orchestrator.lifecycle.on('tool_failed', (event) => {
        setActiveToolCalls(prev => prev.filter(p => p.id !== event.call.id))
        setCompletedCalls(prev => [...prev, event.call])
      }),

      orchestrator.lifecycle.on('tool_rejected', (event) => {
        setPendingApprovals(prev => prev.filter(p => p.id !== event.call.id))
        setCompletedCalls(prev => [...prev, event.call])
      }),
    ]

    return () => unsubscribers.forEach(unsub => unsub())
  }, [orchestrator])

  // Handle tool approval
  const handleApprove = useCallback(async (callId: string) => {
    orchestrator.approveTool(callId, 'user')
    await orchestrator.executeApprovedTool(callId)
  }, [orchestrator])

  // Handle tool rejection
  const handleReject = useCallback((callId: string, reason: string) => {
    orchestrator.rejectTool(callId, reason, 'user')
  }, [orchestrator])

  // Get current approval if any
  const currentApproval = pendingApprovals[0]

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {chat.messages.map((message) => (
            <div key={message.id}>
              <div className={\`p-4 rounded-lg \${
                message.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
              }\`}>
                {message.content}
              </div>

              {/* Render tool results inline */}
              {chat.getToolResultsForMessage(message.id).map((toolResult, idx) => {
                const Component = toolRegistry.get(toolResult.toolCall.function.name)
                return Component ? (
                  <div key={idx} className="ml-8 mt-2">
                    <Component result={toolResult.result} />
                  </div>
                ) : null
              })}
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
            if (input.value.trim()) {
              chat.sendMessage(input.value)
              input.value = ''
            }
          }}
          className="border-t p-4"
        >
          <input
            name="message"
            placeholder="Ask about the weather, search something, or do calculations..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </form>
      </div>

      {/* Tool Activity Sidebar */}
      <div className="w-80 border-l bg-gray-50 p-4 overflow-auto">
        <h2 className="font-bold text-lg mb-4">Tool Activity</h2>

        {/* Active Tools */}
        {activeToolCalls.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Executing</h3>
            <div className="space-y-2">
              {activeToolCalls.map(call => (
                <ToolExecutionCard
                  key={call.id}
                  toolCall={call}
                  toolDefinition={orchestrator.getTool(call.toolName)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tools */}
        {completedCalls.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Completed ({completedCalls.length})
            </h3>
            <div className="space-y-2">
              {completedCalls.slice(-5).reverse().map(call => (
                <ToolExecutionCard
                  key={call.id}
                  toolCall={call}
                  toolDefinition={orchestrator.getTool(call.toolName)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          <div>Total calls: {orchestrator.getStats().calls.total}</div>
          <div>Cache hits: {orchestrator.getCacheStats().hits}</div>
        </div>
      </div>

      {/* Approval Dialog */}
      {currentApproval && (
        <ToolApprovalDialog
          toolCall={currentApproval}
          toolDefinition={orchestrator.getTool(currentApproval.toolName)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}`

const troubleshootingItems = [
  {
    title: 'Tool not being called by AI',
    description: 'The AI acknowledges the tool exists but never uses it.',
    solution: `Check your tool definition:

1. Description must clearly explain WHEN to use the tool
   Bad: "Gets weather data"
   Good: "Get current weather conditions for a location. Use this when
         the user asks about weather, temperature, or conditions."

2. Parameter descriptions should be clear
3. Ensure tool is registered in the orchestrator
4. Verify tools are passed to the AI API request`,
  },
  {
    title: 'Tool execution times out',
    description: 'Tool calls fail with timeout errors.',
    solution: `Adjust timeout settings:

1. Increase timeout in tool definition:
   timeout: 60000  // 60 seconds

2. Use executeWithTimeout for specific calls:
   await executeWithTimeout(orchestrator, 'slow_tool', args, {
     timeout: 120000
   })

3. Consider breaking into smaller operations

4. Check if external API is slow`,
  },
  {
    title: 'SECURITY ERROR: autoApprove cannot be enabled in production',
    description: 'Application crashes when deploying with autoApprove: true.',
    solution: `This is intentional security protection.

In production (NODE_ENV === 'production'), tools MUST require
explicit user approval to prevent unauthorized actions.

Fix: Set autoApprove: false and implement proper approval UI:

const orchestrator = new ToolOrchestrator({
  autoApprove: false,  // Required for production
})

// Use ToolApprovalDialog for user consent`,
  },
  {
    title: 'Cache not working',
    description: 'Tool results are not being cached despite cacheable: true.',
    solution: `Check cache configuration:

1. Ensure cacheable: true on tool definition
2. Verify orchestrator has caching enabled:
   new ToolOrchestrator({ enableCaching: true })

3. Cache TTL may have expired (default: 5 min)
4. Different arguments create different cache keys
5. Check if skipCache option is being passed:
   orchestrator.executeTool(name, args, { skipCache: false })`,
  },
  {
    title: 'Tool results not appearing in chat',
    description: 'Tools execute but results do not display.',
    solution: `Verify tool UI integration:

1. Register UI components in toolRegistry:
   const registry = createToolUIRegistry({
     tool_name: ToolComponent,
   })

2. Tool name in registry must match tool.name exactly

3. Use getToolResultsForMessage to render:
   {getToolResultsForMessage(message.id).map(result => ...)}

4. Ensure component handles the result format`,
  },
  {
    title: 'Maximum listener count exceeded',
    description: 'Error about too many listeners on ToolRegistry.',
    solution: `This indicates a memory leak from uncleared subscriptions.

1. Always unsubscribe in useEffect cleanup:
   useEffect(() => {
     const unsub = orchestrator.lifecycle.on('event', handler)
     return () => unsub()  // Cleanup!
   }, [])

2. Increase limit if needed (not recommended):
   registry.setMaxListeners(200)

3. Check for multiple orchestrator instances`,
  },
]

export default function ToolCallingGuidePage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Wrench className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Tool Calling Guide
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Build AI Agents with Tool Calling
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Enable your AI to take actions in the real world. Tool calling (also known as
            function calling) lets AI models execute code, fetch data, and interact
            with external services.
          </p>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200/50 dark:border-brand-800/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold">What You'll Learn</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Define tools with type-safe schemas using TypeScript and Zod',
                'Execute tools on the server with ToolOrchestrator',
                'Build approval workflows for human-in-the-loop patterns',
                'Create beautiful tool execution UI with built-in components',
                'Implement multi-step tool chains and batch execution',
                'Handle errors, timeouts, and retries gracefully',
                'Secure your tools with rate limiting and sandboxing',
                'Debug and troubleshoot common tool calling issues',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Understanding Tool Calling */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Understanding Tool Calling</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-brand-500" />
                What are Tools?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Tools (also called functions) are predefined actions that AI models can
                invoke to interact with external systems. They bridge the gap between
                AI's reasoning abilities and real-world capabilities.
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'Fetch real-time data (weather, stocks, news)',
                  'Perform calculations and data processing',
                  'Execute code in sandboxed environments',
                  'Interact with APIs and databases',
                  'Send emails, create files, update records',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-brand-500" />
                How Tool Calling Works
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'User sends message', desc: '"What\'s the weather in Tokyo?"' },
                  { step: 2, title: 'AI decides to use tool', desc: 'Model outputs tool call with args' },
                  { step: 3, title: 'Tool executes', desc: 'Your code runs (optionally with approval)' },
                  { step: 4, title: 'Result returned to AI', desc: 'AI incorporates data into response' },
                  { step: 5, title: 'User sees answer', desc: '"It\'s 22 C and sunny in Tokyo"' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-neutral-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">
                  Security First:
                </strong>{' '}
                Tool calling gives AI the ability to take real actions. Always implement
                proper authorization, validation, and human approval for sensitive operations.
                Clarity Chat enforces approval requirements in production by default.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Defining Tools */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Defining Tools</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Tools are defined using the <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">ToolDefinition</code> interface.
            Each tool needs a name, description, parameter schema, and execute function.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Create a complete tool definition">
              <CodeBlock
                code={toolDefinitionExample}
                filename="lib/tools/weather.ts"
              />
            </StepCard>

            <CollapsibleSection
              title="Using Zod for Schema Validation"
              badge="Type Safety"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                For complex tools, use Zod for runtime validation alongside TypeScript types.
              </p>
              <CodeBlock
                code={zodSchemaExample}
                filename="lib/tools/search.ts"
              />
            </CollapsibleSection>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Tool Definition Best Practices
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                <li>Use clear, descriptive names (snake_case)</li>
                <li>Write detailed descriptions for AI</li>
                <li>Define parameter types precisely</li>
                <li>Set appropriate security flags</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                Security Defaults
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                <li><code>requiresApproval: true</code> by default</li>
                <li><code>cacheable: false</code> by default</li>
                <li><code>timeout: 30000</code> (30 seconds)</li>
                <li>Auto-approve blocked in production</li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Basic Tool Setup */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Basic Tool Setup</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Integrate tools with your chat using <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">useClarityChatWithTools</code> hook
            and <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">ToolOrchestrator</code>.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Set up client-side with useClarityChatWithTools">
              <CodeBlock
                code={basicToolSetupExample}
                filename="components/ChatWithTools.tsx"
              />
            </StepCard>

            <StepCard number={2} title="Create server-side tool execution">
              <CodeBlock
                code={serverToolExecutionExample}
                filename="app/api/chat/route.ts"
              />
            </StepCard>
          </div>
        </section>
      </ScrollReveal>

      {/* Tool Execution UI */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Tool Execution UI</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Build informative UI to show users what tools are doing.
            Clarity Chat provides <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">ToolApprovalDialog</code> for
            approval workflows.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Create a ToolExecutionCard component">
              <CodeBlock
                code={toolExecutionCardExample}
                filename="components/ToolExecutionCard.tsx"
              />
            </StepCard>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { status: 'pending_approval', label: 'Awaiting Approval', color: 'yellow', icon: <UserCheck className="w-5 h-5" /> },
                { status: 'executing', label: 'Executing', color: 'blue', icon: <RefreshCw className="w-5 h-5 animate-spin" /> },
                { status: 'completed', label: 'Completed', color: 'green', icon: <CheckCircle2 className="w-5 h-5" /> },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-4 rounded-xl border-2',
                    item.color === 'yellow' && 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20 dark:border-yellow-800',
                    item.color === 'blue' && 'bg-blue-50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800',
                    item.color === 'green' && 'bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-800'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      item.color === 'yellow' && 'text-yellow-600',
                      item.color === 'blue' && 'text-blue-600',
                      item.color === 'green' && 'text-green-600'
                    )}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {item.status === 'pending_approval' && 'User must approve before execution'}
                    {item.status === 'executing' && 'Tool is currently running'}
                    {item.status === 'completed' && 'Tool finished successfully'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Advanced Patterns */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Advanced Patterns</h2>
          </div>

          <div className="space-y-4">
            <CollapsibleSection
              title="Human-in-the-Loop Approval"
              badge="Recommended"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Require explicit user approval before executing sensitive tools.
                This is the recommended pattern for production applications.
              </p>
              <CodeBlock
                code={humanInTheLoopExample}
                filename="components/ChatWithApproval.tsx"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Multi-Step Tool Chains"
              badge="Advanced"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Execute multiple tools in sequence or parallel with progress tracking.
                Use batch execution for performance.
              </p>
              <CodeBlock
                code={multiStepToolExample}
                filename="lib/workflows/research.ts"
              />
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* Built-in Tools */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Built-in Tools</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Common tool patterns you can adapt for your application.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <Calculator className="w-6 h-6" />, name: 'Calculator', desc: 'Math operations', approval: false },
              { icon: <Search className="w-6 h-6" />, name: 'Web Search', desc: 'External search API', approval: true },
              { icon: <Code className="w-6 h-6" />, name: 'Code Execution', desc: 'Sandboxed runtime', approval: true },
            ].map((tool, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-brand-500">{tool.icon}</div>
                  <div>
                    <div className="font-semibold">{tool.name}</div>
                    <div className="text-xs text-neutral-500">{tool.desc}</div>
                  </div>
                </div>
                <div className={cn(
                  'text-xs px-2 py-1 rounded inline-block',
                  tool.approval ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                )}>
                  {tool.approval ? 'Requires Approval' : 'Auto-approve Safe'}
                </div>
              </div>
            ))}
          </div>

          <CodeBlock
            code={builtInToolsExample}
            filename="lib/tools/built-in.ts"
          />
        </section>
      </ScrollReveal>

      {/* Custom Tool Creation */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Custom Tool Creation</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Use this template as a starting point for creating your own tools.
          </p>

          <CodeBlock
            code={customToolTemplateExample}
            filename="lib/tools/template.ts"
          />
        </section>
      </ScrollReveal>

      {/* Security Considerations */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Security Considerations</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                Security Checklist
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Validate all inputs before execution',
                  'Rate limit tool calls per user',
                  'Sandbox code execution environments',
                  'Require approval for sensitive operations',
                  'Log all tool executions for audit',
                  'Never use eval() with user input',
                  'Parameterize database queries',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Common Vulnerabilities
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Code injection via eval()',
                  'SQL injection in queries',
                  'Path traversal in file operations',
                  'Command injection in shell exec',
                  'Missing rate limiting',
                  'Unrestricted file access',
                  'Auto-approve in production',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CollapsibleSection
            title="Security Implementation Examples"
            badge="Stable"
          >
            <CodeBlock
              code={securityConsiderationsExample}
              filename="lib/tools/security.ts"
            />
          </CollapsibleSection>
        </section>
      </ScrollReveal>

      {/* Complete Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Complete Example</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            A full implementation combining all the patterns: tool definition,
            orchestration, approval workflow, and UI components.
          </p>

          <CodeBlock
            code={completeExample}
            filename="app/chat/page.tsx"
          />
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingItems.map((issue, i) => (
              <CollapsibleSection
                key={i}
                title={issue.title}
                badge="Common Issue"
              >
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {issue.description}
                  </p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{issue.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Continue Learning</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Now that you understand tool calling, explore these related topics
              to build even more powerful AI applications.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Streaming Guide',
                  description: 'Stream tool results in real-time',
                  href: '/guides/streaming',
                },
                {
                  icon: <Cpu className="w-5 h-5" />,
                  title: 'AI Agents',
                  description: 'Build autonomous AI agents with tools',
                  href: '/explore/agents',
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: 'Security Best Practices',
                  description: 'Secure your AI applications',
                  href: '/get-started/guides',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
        {number}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({
  code,
  filename,
  language = 'typescript',
}: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
