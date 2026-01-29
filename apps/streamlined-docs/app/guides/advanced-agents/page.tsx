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
  Brain,
  TrendingDown,
  Zap,
  Network,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Layers,
  RefreshCw,
  Shield,
  Target,
  FileCode,
  Workflow,
  GitBranch,
  MessageSquare,
  Tool,
  Sparkles,
  Repeat,
  Database,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

// Agent patterns
const agentPatterns = [
  {
    name: 'ReAct',
    description: 'Reasoning and Acting in interleaved steps',
    useCase: 'Multi-step problem solving with tool calls',
    complexity: 'Medium',
    tokenUsage: 'High',
  },
  {
    name: 'Chain-of-Thought',
    description: 'Step-by-step reasoning before answering',
    useCase: 'Complex reasoning tasks',
    complexity: 'Low',
    tokenUsage: 'Medium',
  },
  {
    name: 'Tree-of-Thought',
    description: 'Explore multiple reasoning paths',
    useCase: 'Problems requiring exploration',
    complexity: 'High',
    tokenUsage: 'Very High',
  },
  {
    name: 'Reflection',
    description: 'Self-critique and iteration',
    useCase: 'Quality-critical outputs',
    complexity: 'Medium',
    tokenUsage: 'High',
  },
]

// Code examples
const codeExamples = {
  reactAgent: `import { useAgent, useTool } from '@clarity-chat/react'

function CustomerSupportAgent() {
  const { invoke, state } = useAgent({
    name: 'customer-support',
    model: 'gpt-4o',
    systemPrompt: \`You are a customer support agent. Use available tools to help customers.

Think step-by-step:
1. Understand the customer's issue
2. Identify which tools might help
3. Use tools to gather information
4. Provide a helpful response\`,
    maxIterations: 5,
  })

  // Register tools
  const searchDocs = useTool({
    name: 'search_documentation',
    description: 'Search product documentation',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
    execute: async ({ query }) => {
      const results = await searchAPI(query)
      return { results: results.slice(0, 3) } // Limit to 3 results
    },
  })

  const getOrderStatus = useTool({
    name: 'get_order_status',
    description: 'Get current status of an order',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
      },
      required: ['orderId'],
    },
    execute: async ({ orderId }) => {
      return await fetchOrderStatus(orderId)
    },
  })

  const handleQuery = async (query: string) => {
    const response = await invoke(query, {
      tools: [searchDocs, getOrderStatus],
      onToolCall: (tool, args) => {
        console.log(\`Calling tool: \${tool.name}\`, args)
      },
    })

    return response
  }

  return (
    <div>
      <AgentStatus
        status={state.status}
        thinking={state.isThinking}
        iterations={state.iterations}
      />
      <ChatInterface onSubmit={handleQuery} />
    </div>
  )
}`,

  chainOfThought: `import { useChainOfThought } from '@clarity-chat/react'

function ComplexReasoningAgent() {
  const { think, state } = useChainOfThought({
    model: 'claude-3-5-sonnet',
    systemPrompt: \`You are an analytical assistant. Always show your reasoning process.\`,
  })

  const handleQuestion = async (question: string) => {
    const response = await think(question, {
      // Show intermediate reasoning steps
      onThinking: (step) => {
        console.log('Thinking:', step)
        showThinkingStep(step)
      },
      // Compress reasoning for token efficiency
      compressReasoning: true,
      // Cache reasoning chains for similar questions
      enableCaching: true,
    })

    return response
  }

  return (
    <div>
      {/* Show reasoning chain */}
      {state.reasoning.map((step, i) => (
        <ReasoningStep key={i} step={step} index={i} />
      ))}

      {/* Final answer */}
      <Answer content={state.answer} confidence={state.confidence} />
    </div>
  )
}`,

  optimizedAgent: `import {
  useAgent,
  useTokenOptimization,
  createProviderCache,
} from '@clarity-chat/react'

function OptimizedAgent() {
  // Token optimization setup
  const { optimize, getStats } = useTokenOptimization({
    preset: 'production',
    model: 'gpt-4o',
    enableCache: true,
    enableCompression: true,
    enableRouting: true,
  })

  // Provider caching for system prompts
  const cache = createProviderCache({
    provider: 'anthropic',
    minTokens: 1024,
  })

  const agent = useAgent({
    name: 'optimized-agent',
    systemPrompt: largeSystemPrompt, // 3000+ tokens
    onBeforeCall: async (messages) => {
      // 1. Apply provider caching to system messages
      const cached = await cache(messages)

      // 2. Compress tool results if large
      const optimized = await optimize(cached.messages, {
        compressToolResults: true,
        targetRatio: 0.5, // Reduce tool results by 50%
      })

      // 3. Route to cheaper model if query is simple
      const model = optimized.recommendedModel || 'gpt-4o-mini'

      return {
        messages: optimized.messages,
        model,
        estimatedSavings: optimized.estimatedCostSaved,
      }
    },
  })

  // Show savings
  const stats = getStats()
  console.log(\`Saved \${stats.tokensSaved} tokens (~$\${stats.estimatedCostSaved.toFixed(4)})\`)

  return <AgentInterface agent={agent} />
}`,

  toolCalling: `import { useTool, useToolRegistry } from '@clarity-chat/react'

function MultiToolAgent() {
  const registry = useToolRegistry()

  // Calculator tool
  const calculator = useTool({
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Math expression to evaluate (e.g., "2 + 2 * 3")'
        },
      },
      required: ['expression'],
    },
    execute: async ({ expression }) => {
      try {
        const result = eval(expression) // Use safe-eval in production
        return { result, expression }
      } catch (error) {
        return { error: 'Invalid expression' }
      }
    },
  })

  // Weather tool
  const weather = useTool({
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        units: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          default: 'celsius'
        },
      },
      required: ['location'],
    },
    execute: async ({ location, units }) => {
      const data = await fetchWeather(location, units)
      return {
        temperature: data.temp,
        conditions: data.conditions,
        location,
      }
    },
  })

  // Register tools
  registry.register([calculator, weather])

  // Use with agent
  const agent = useAgent({
    name: 'multi-tool',
    tools: registry.getAll(),
    onToolCall: (tool, args, result) => {
      // Log tool usage for analytics
      analytics.track('tool_called', {
        tool: tool.name,
        success: !result.error,
      })
    },
  })

  return (
    <div>
      <ToolList tools={registry.getAll()} />
      <AgentChat agent={agent} />
    </div>
  )
}`,

  reasoningCompression: `import {
  compressReasoningChain,
  compressToolResults,
} from '@clarity-chat/token-optimization'

async function compressAgentContext(messages: Message[]) {
  // 1. Identify reasoning chains (consecutive assistant messages)
  const reasoningChains = extractReasoningChains(messages)

  // 2. Compress each chain while preserving key insights
  const compressed = await Promise.all(
    reasoningChains.map(chain =>
      compressReasoningChain(chain, {
        preserveSteps: 'key', // Keep only critical steps
        targetRatio: 0.3, // Reduce to 30% of original
        model: 'gpt-4o',
      })
    )
  )

  // 3. Compress tool call results
  const toolMessages = messages.filter(m => m.role === 'tool')
  const compressedTools = await Promise.all(
    toolMessages.map(msg =>
      compressToolResults(msg.content, {
        extractKeyData: true,
        removeRedundancy: true,
        maxTokens: 200,
      })
    )
  )

  // 4. Reconstruct message array
  return rebuildMessageArray(messages, compressed, compressedTools)
}

// Example compression
const original = {
  reasoning: \`Let me think through this step-by-step:
1. First, I need to understand what the user is asking...
2. Then I should consider the context...
3. Next, I'll evaluate possible approaches...
4. After that, I'll select the best option...
5. Finally, I'll formulate my response...\`,
  tokens: 500,
}

const compressed = await compressReasoningChain(original.reasoning)
// Result: "Analyzed query → evaluated approaches → selected optimal solution"
// Tokens: 50 (90% reduction)`,

  caching: `import {
  createProviderCache,
  anthropicCache,
} from '@clarity-chat/token-optimization'

function CachedAgentWorkflow() {
  // System prompt with tools definition (3500 tokens)
  const systemPrompt = \`You are an AI agent with access to these tools:

\${JSON.stringify(toolDefinitions, null, 2)}

# Agent Guidelines
\${agentGuidelines} // 2000+ tokens

# Example interactions
\${exampleInteractions} // 1500+ tokens
\`

  const runAgent = async (userQuery: string, conversationHistory: Message[]) => {
    // Build messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuery },
    ]

    // Apply caching (90% savings on system prompt)
    const cached = await anthropicCache(messages)

    // First call: Creates cache (pays full price for system prompt)
    // Subsequent calls: 90% discount on system prompt
    const response = await callAI({
      model: 'claude-3-5-sonnet',
      messages: cached.messages,
    })

    // Check cache performance
    console.log(\`Cache savings: \${cached.estimatedSavings}%\`)
    // "Cache savings: 78%" (3150 tokens cached @ 90% discount)

    return response
  }

  return <AgentWorkflow onQuery={runAgent} />
}`,

  multiStep: `import { useAgent, useWorkflow } from '@clarity-chat/react'

function MultiStepAgentWorkflow() {
  const workflow = useWorkflow({
    steps: [
      {
        name: 'analyze',
        agent: useAgent({
          name: 'analyzer',
          model: 'gpt-4o-mini', // Cheaper model for analysis
          systemPrompt: 'Analyze the user query and extract key information.',
        }),
      },
      {
        name: 'research',
        agent: useAgent({
          name: 'researcher',
          model: 'claude-3-haiku', // Fast model for research
          systemPrompt: 'Research the topic using available tools.',
          tools: [searchTool, retrieveTool],
        }),
      },
      {
        name: 'synthesize',
        agent: useAgent({
          name: 'synthesizer',
          model: 'gpt-4o', // Premium model for final output
          systemPrompt: 'Synthesize findings into a comprehensive response.',
        }),
      },
    ],

    // Cache intermediate results
    caching: {
      enabled: true,
      ttl: 3600, // 1 hour
    },

    // Compress between steps
    compression: {
      enabled: true,
      strategy: 'extractive',
    },
  })

  const handleQuery = async (query: string) => {
    // Step 1: Analyze (cheap, fast)
    const analysis = await workflow.run('analyze', query)

    // Step 2: Research (parallel tool calls)
    const research = await workflow.run('research', {
      query,
      context: analysis,
    })

    // Step 3: Synthesize (premium quality)
    const response = await workflow.run('synthesize', {
      query,
      analysis,
      research: compressResearch(research), // Compress before synthesis
    })

    return response
  }

  return (
    <div>
      <WorkflowVisualizer workflow={workflow} />
      <WorkflowInterface onSubmit={handleQuery} />
    </div>
  )
}`,

  production: `import {
  useAgent,
  useTokenBudgetTracking,
  useTokenOptimization,
  createModelBudgetMonitor,
  calculateCost,
} from '@clarity-chat/react'

function ProductionAgent() {
  // 1. Budget monitoring
  const budgetConfig = createModelBudgetMonitor('gpt-4o', {
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    autoTrim: true,
    onCritical: (usage) => {
      alert('Token budget critical! Consider starting new conversation.')
    },
  })

  const { usage, isExceeded } = useTokenBudgetTracking(budgetConfig)

  // 2. Token optimization
  const { optimize } = useTokenOptimization({
    preset: 'production',
    model: 'gpt-4o',
    availableModels: ['gpt-4o-mini', 'gpt-4o', 'claude-3-5-sonnet'],
  })

  // 3. Agent with error handling
  const agent = useAgent({
    name: 'production-agent',
    model: 'gpt-4o',
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,

    onError: (error, context) => {
      // Log to error tracking service
      logError({
        error,
        agent: 'production-agent',
        context,
        user: getCurrentUser(),
      })

      // Fallback to simpler model
      if (error.code === 'context_length_exceeded') {
        return { fallbackModel: 'gpt-4o-mini' }
      }
    },

    onBeforeCall: async (messages) => {
      // Optimize before every call
      const optimized = await optimize(messages)

      // Calculate cost
      const cost = calculateCost({
        model: optimized.recommendedModel,
        inputTokens: optimized.totalTokens,
        outputTokens: 1000, // estimated
      })

      // Check budget
      if (cost.totalCost > 0.10) {
        console.warn('High cost request:', cost)
      }

      return optimized
    },
  })

  // 4. Analytics tracking
  const handleQuery = async (query: string) => {
    const startTime = Date.now()

    try {
      const response = await agent.invoke(query)

      // Track success metrics
      analytics.track('agent_success', {
        duration: Date.now() - startTime,
        tokens: usage.current,
        cost: calculateCost({
          model: 'gpt-4o',
          inputTokens: usage.current,
          outputTokens: response.tokens,
        }).totalCost,
      })

      return response
    } catch (error) {
      // Track failure
      analytics.track('agent_error', {
        error: error.message,
        duration: Date.now() - startTime,
      })
      throw error
    }
  }

  return (
    <div>
      <BudgetIndicator usage={usage} isExceeded={isExceeded} />
      <AgentInterface agent={agent} onQuery={handleQuery} />
    </div>
  )
}`,

  customerSupport: `// Complete customer support agent example

import {
  useAgent,
  useTool,
  useTokenOptimization,
  createProviderCache,
} from '@clarity-chat/react'

function CustomerSupportAgent() {
  // Token optimization for cost efficiency
  const { optimize } = useTokenOptimization({
    preset: 'production',
    enableCache: true,
    enableCompression: true,
  })

  // Cache system prompt (product knowledge base)
  const cache = createProviderCache({
    provider: 'anthropic',
    minTokens: 1024,
  })

  // Define tools
  const searchKnowledgeBase = useTool({
    name: 'search_kb',
    description: 'Search knowledge base for solutions',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string', enum: ['billing', 'technical', 'account'] },
      },
      required: ['query'],
    },
    execute: async ({ query, category }) => {
      const results = await kbSearch(query, category)
      // Return top 3 results only (token efficiency)
      return {
        results: results.slice(0, 3).map(r => ({
          title: r.title,
          summary: r.summary, // Compressed version
          link: r.link,
        }))
      }
    },
  })

  const getOrderDetails = useTool({
    name: 'get_order',
    description: 'Retrieve order information',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
      },
      required: ['orderId'],
    },
    execute: async ({ orderId }) => {
      const order = await fetchOrder(orderId)
      // Return only essential fields
      return {
        id: order.id,
        status: order.status,
        total: order.total,
        items: order.items.length,
        shippingDate: order.shippingDate,
      }
    },
  })

  const createTicket = useTool({
    name: 'create_ticket',
    description: 'Escalate to support ticket',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
      },
      required: ['title', 'description'],
    },
    execute: async ({ title, description, priority }) => {
      const ticket = await createSupportTicket({
        title,
        description,
        priority: priority || 'medium',
      })
      return { ticketId: ticket.id, estimatedResponse: '2-4 hours' }
    },
  })

  // Agent setup
  const agent = useAgent({
    name: 'support-agent',
    model: 'claude-3-5-sonnet',
    systemPrompt: \`You are a helpful customer support agent.

# Your Goals
1. Understand the customer's issue
2. Search knowledge base for solutions
3. Retrieve order details if needed
4. Escalate to ticket if unresolved

# Guidelines
- Be empathetic and professional
- Ask clarifying questions if needed
- Provide step-by-step solutions
- Escalate complex issues to human support

# Product Knowledge
\${productKnowledgeBase} // 5000+ tokens

# Common Solutions
\${commonSolutions} // 2000+ tokens
\`,
    tools: [searchKnowledgeBase, getOrderDetails, createTicket],
    maxIterations: 5,

    onBeforeCall: async (messages) => {
      // Apply caching + optimization
      const cached = await cache(messages)
      const optimized = await optimize(cached.messages)
      return optimized
    },

    onToolCall: (tool, args, result) => {
      // Analytics
      analytics.track('tool_used', {
        tool: tool.name,
        success: !result.error,
      })
    },
  })

  const handleCustomerQuery = async (query: string) => {
    try {
      const response = await agent.invoke(query, {
        onThinking: (step) => {
          // Show "Agent is thinking..." indicator
          showThinkingIndicator(step)
        },
      })

      // Track resolution
      if (response.tools.some(t => t.name === 'create_ticket')) {
        analytics.track('escalated_to_ticket')
      } else {
        analytics.track('resolved_by_agent')
      }

      return response
    } catch (error) {
      // Fallback to ticket creation
      return {
        message: "I'm having trouble right now. Let me create a support ticket for you.",
        escalated: true,
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SupportHeader />
      <AgentChat
        agent={agent}
        onSubmit={handleCustomerQuery}
        placeholder="How can I help you today?"
      />
      <QuickActions
        actions={[
          'Check order status',
          'Billing question',
          'Technical issue',
          'Account help',
        ]}
      />
    </div>
  )
}`,
}

// Optimization strategies
const optimizationStrategies = [
  {
    title: 'Compress Reasoning Chains',
    description: 'Reduce verbose step-by-step reasoning to essential insights',
    savings: '60-80%',
    impact: 'High',
    techniques: [
      'Extract key decision points',
      'Remove redundant explanations',
      'Summarize intermediate steps',
    ],
  },
  {
    title: 'Cache Tool Definitions',
    description: 'Cache static tool schemas and descriptions with provider caching',
    savings: '90%',
    impact: 'Critical',
    techniques: [
      'Place tool definitions in system message',
      'Ensure >1024 tokens for caching',
      'Use consistent tool definitions',
    ],
  },
  {
    title: 'Smart Model Routing',
    description: 'Route simple queries to cheaper models, complex to premium',
    savings: '40-60%',
    impact: 'High',
    techniques: [
      'Classify query complexity',
      'Use gpt-4o-mini for simple tasks',
      'Reserve gpt-4o for reasoning',
    ],
  },
  {
    title: 'Truncate Tool Results',
    description: 'Compress large tool responses before passing to agent',
    savings: '50-70%',
    impact: 'Medium',
    techniques: [
      'Extract key data fields only',
      'Limit array results (e.g., top 3)',
      'Summarize long text responses',
    ],
  },
]

// Production patterns
const productionPatterns = [
  {
    title: 'Error Recovery',
    pattern: 'Automatic retry with exponential backoff',
    code: 'maxRetries: 3, retryDelay: 1000',
  },
  {
    title: 'Timeout Protection',
    pattern: 'Set maximum execution time',
    code: 'timeout: 30000 // 30 seconds',
  },
  {
    title: 'Budget Monitoring',
    pattern: 'Track token usage and costs in real-time',
    code: 'useTokenBudgetTracking(config)',
  },
  {
    title: 'Graceful Degradation',
    pattern: 'Fall back to simpler model or human escalation',
    code: 'fallbackModel: "gpt-4o-mini"',
  },
  {
    title: 'Analytics Tracking',
    pattern: 'Log all tool calls and agent decisions',
    code: 'onToolCall: (tool) => analytics.track()',
  },
]

export default function AdvancedAgentsGuidePage() {
  const [selectedPattern, setSelectedPattern] = useState<string>('react')

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Advanced Agents
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Building Optimized AI Agents
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Build production-ready AI agents with advanced reasoning patterns, tool calling,
            and token optimization. Reduce agent costs by 55-70% through intelligent caching
            and compression.
          </p>

          {/* Cost Savings Highlight */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">55-70%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Cost Reduction</div>
            </div>
            <div className="h-12 w-px bg-purple-200 dark:bg-purple-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Agent Patterns</div>
            </div>
            <div className="h-12 w-px bg-purple-200 dark:bg-purple-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">90%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Cache Savings</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">What You'll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'ReAct, Chain-of-Thought, and Tree-of-Thought patterns',
                    'Tool calling with function schemas',
                    'Token optimization for agents (55-70% reduction)',
                    'Reasoning compression strategies',
                    'Multi-step agent workflows with caching',
                    'Production deployment patterns',
                    'Error handling and graceful degradation',
                    'Real-world customer support agent example',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Agent Architectures */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Agent Architectures</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            AI agents use different reasoning patterns depending on the task. Understanding these
            patterns helps you choose the right architecture and optimize token usage.
          </p>

          {/* Pattern Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {agentPatterns.map((pattern, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <h3 className="text-lg font-semibold mb-2">{pattern.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {pattern.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Use Case:</span>
                    <span className="font-medium">{pattern.useCase}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Complexity:</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      pattern.complexity === 'Low' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                      pattern.complexity === 'Medium' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                      pattern.complexity === 'High' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                    )}>
                      {pattern.complexity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Token Usage:</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      pattern.tokenUsage === 'Medium' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                      pattern.tokenUsage === 'High' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                      pattern.tokenUsage === 'Very High' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                    )}>
                      {pattern.tokenUsage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Pattern Examples */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Workflow className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Agent Pattern Examples</h2>
          </div>

          {/* Pattern Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'react', label: 'ReAct Agent', icon: <Brain className="w-4 h-4" /> },
              { id: 'cot', label: 'Chain-of-Thought', icon: <GitBranch className="w-4 h-4" /> },
              { id: 'optimized', label: 'Optimized Agent', icon: <Zap className="w-4 h-4" /> },
              { id: 'tools', label: 'Tool Calling', icon: <Tool className="w-4 h-4" /> },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPattern(option.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedPattern === option.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPattern}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
            >
              <CodeBlock
                code={selectedPattern === 'react' ? codeExamples.reactAgent :
                      selectedPattern === 'cot' ? codeExamples.chainOfThought :
                      selectedPattern === 'optimized' ? codeExamples.optimizedAgent :
                      codeExamples.toolCalling}
                filename={`${selectedPattern}-agent.tsx`}
              />
            </motion.div>
          </AnimatePresence>
        </section>
      </ScrollReveal>

      {/* Token Optimization for Agents */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Token Optimization for Agents</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Agents typically use 3-5x more tokens than simple chat due to reasoning chains, tool
            calls, and multi-step workflows. Strategic optimization can reduce costs by 55-70%.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {optimizationStrategies.map((strategy, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{strategy.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    {strategy.savings} savings
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {strategy.description}
                </p>
                <div className="space-y-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Techniques:</span>
                  {strategy.techniques.map((technique, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span>{technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Reasoning Compression Example</h3>
          <CodeBlock code={codeExamples.reasoningCompression} filename="compress-reasoning.tsx" />
        </section>
      </ScrollReveal>

      {/* Provider Caching for Agents */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Provider Caching for Agents</h2>
          </div>

          <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Biggest Savings Opportunity for Agents
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Agent system prompts often contain tool definitions, guidelines, and examples
                  (2000-5000 tokens). Provider caching reduces costs by 90% on these static tokens
                  across all agent conversations.
                </p>
              </div>
            </div>
          </div>

          <CodeBlock code={codeExamples.caching} filename="cached-agent.tsx" />

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
            <h4 className="font-semibold mb-4">Cost Impact Example</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-2">Scenario: Customer support agent, 1000 conversations/day</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                  <p className="font-medium text-red-700 dark:text-red-300 mb-2">Without Caching</p>
                  <p className="font-mono text-sm">3500 tokens × $3.00/1M × 1000</p>
                  <p className="font-mono text-sm">30 days × 1000 conversations</p>
                  <p className="font-mono text-xl text-red-600 mt-2">= $315/mo</p>
                </div>
                <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                  <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">With Caching (90% hit rate)</p>
                  <p className="font-mono text-sm">3500 × $0.30/1M × 900 (cached)</p>
                  <p className="font-mono text-sm">+ 3500 × $3.00/1M × 100 (miss)</p>
                  <p className="font-mono text-xl text-emerald-600 mt-2">= $41/mo</p>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-300 dark:border-purple-700">
                <p className="font-bold text-lg">
                  Savings: $274/mo (87% reduction)
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Multi-Step Workflows */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Multi-Step Agent Workflows</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Complex tasks benefit from breaking down agents into specialized steps. Each step can
            use different models and optimization strategies for maximum efficiency.
          </p>

          <CodeBlock code={codeExamples.multiStep} filename="multi-step-workflow.tsx" />

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Step 1</div>
              <div className="text-sm font-medium mb-2">Analyze (gpt-4o-mini)</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Fast, cheap analysis. Extract key information from user query.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Step 2</div>
              <div className="text-sm font-medium mb-2">Research (claude-3-haiku)</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Parallel tool calls. Gather data from multiple sources.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Step 3</div>
              <div className="text-sm font-medium mb-2">Synthesize (gpt-4o)</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Premium quality synthesis. Generate comprehensive response.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Production Deployment */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Production Deployment Patterns</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Production agents need error handling, monitoring, and graceful degradation to ensure
            reliability at scale.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {productionPatterns.map((pattern, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <h4 className="font-semibold mb-2">{pattern.title}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  {pattern.pattern}
                </p>
                <code className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-brand-500">
                  {pattern.code}
                </code>
              </div>
            ))}
          </div>

          <CodeBlock code={codeExamples.production} filename="production-agent.tsx" />
        </section>
      </ScrollReveal>

      {/* Real-World Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Real-World Example: Customer Support Agent</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Complete implementation of a production-ready customer support agent with tool calling,
            token optimization, and analytics tracking.
          </p>

          <CodeBlock code={codeExamples.customerSupport} filename="customer-support-agent.tsx" />

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <h4 className="font-semibold mb-4">Key Features</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Tool className="w-4 h-4" />, text: '3 specialized tools (search, orders, tickets)' },
                { icon: <Database className="w-4 h-4" />, text: 'Provider caching for 5000+ token knowledge base' },
                { icon: <Zap className="w-4 h-4" />, text: 'Token optimization before each call' },
                { icon: <Target className="w-4 h-4" />, text: 'Automatic escalation to human support' },
                { icon: <BarChart3 className="w-4 h-4" />, text: 'Analytics tracking for all interactions' },
                { icon: <RefreshCw className="w-4 h-4" />, text: 'Error handling with fallbacks' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="text-blue-500">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Best Practices */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Best Practices</h2>
          </div>

          <div className="space-y-4">
            <CollapsibleSection title="Start Simple, Scale Up" badge="Architecture">
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Begin with basic ReAct agents and add complexity only when needed. Most tasks
                  don't require Tree-of-Thought or complex workflows.
                </p>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                  <h5 className="font-medium text-sm mb-2">Recommended Progression:</h5>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Single agent with 1-2 tools</li>
                    <li>Add token optimization</li>
                    <li>Implement caching for system prompts</li>
                    <li>Add multi-step workflows if needed</li>
                  </ol>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Cache Everything Static" badge="Performance">
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Tool definitions, system prompts, and guidelines rarely change. Use provider
                  caching to reduce costs by 90% on these tokens.
                </p>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                  <h5 className="font-medium text-sm mb-2">What to Cache:</h5>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>System prompts (guidelines, personality)</li>
                    <li>Tool schemas and descriptions</li>
                    <li>Example interactions</li>
                    <li>Product knowledge base</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Monitor Token Usage" badge="Optimization">
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Track token usage per conversation, tool call, and reasoning step. Identify
                  optimization opportunities through data.
                </p>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                  <h5 className="font-medium text-sm mb-2">Key Metrics:</h5>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Tokens per conversation (target: 2000-5000)</li>
                    <li>Cache hit rate (target: 80%+)</li>
                    <li>Tool call efficiency (limit results)</li>
                    <li>Cost per interaction (optimize continuously)</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Handle Errors Gracefully" badge="Reliability">
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Agents can fail for many reasons: API errors, token limits, tool failures.
                  Always provide fallback paths and escalation options.
                </p>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                  <h5 className="font-medium text-sm mb-2">Error Recovery Strategy:</h5>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Automatic retry with exponential backoff</li>
                    <li>Fall back to simpler model if context too long</li>
                    <li>Escalate to human if agent fails repeatedly</li>
                    <li>Log all errors for analysis and improvement</li>
                  </ol>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Building Agents</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore cookbooks, API reference, and examples to build production-ready AI agents.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'Agent Cookbooks',
                  description: 'Step-by-step recipes for common agent patterns',
                  href: '/cookbook#agents',
                },
                {
                  icon: <Cpu className="w-5 h-5" />,
                  title: 'Agent API Reference',
                  description: 'Complete API docs for useAgent, useTool, and workflows',
                  href: '/api/agents',
                },
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  title: 'Token Optimization Guide',
                  description: 'Deep dive into agent cost reduction strategies',
                  href: '/guides/token-optimization',
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

// Helper Components
interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({ code, filename }: CodeBlockProps) {
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
