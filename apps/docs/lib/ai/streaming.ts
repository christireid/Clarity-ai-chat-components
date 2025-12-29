/**
 * Streaming Utilities
 *
 * Handles streaming responses from LLMs using Server-Sent Events (SSE).
 * Supports OpenAI, Anthropic, and Google Gemini streaming APIs.
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'

export interface StreamChunk {
  type:
    | 'text'
    | 'error'
    | 'done'
    | 'sources'
    | 'thinking'
    | 'tool_use'
    | 'tool_result'
  content?: string
  data?: unknown
  tool_name?: string
  tool_use_id?: string
  tool_input?: unknown
  tool_result?: unknown
}

/**
 * Create a ReadableStream for Server-Sent Events
 */
export function createSSEStream(
  generator: AsyncGenerator<StreamChunk>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(data))
        }

        // Send done signal
        const doneChunk = `data: ${JSON.stringify({ type: 'done' })}\n\n`
        controller.enqueue(encoder.encode(doneChunk))

        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)

        const errorChunk = `data: ${JSON.stringify({
          type: 'error',
          content: error instanceof Error ? error.message : 'Unknown error',
        })}\n\n`

        controller.enqueue(encoder.encode(errorChunk))
        controller.close()
      }
    },
  })
}

/**
 * Stream from OpenAI API
 */
export async function* streamFromOpenAI(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI({ apiKey })

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages:
        messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content

      if (content) {
        yield {
          type: 'text',
          content,
        }
      }

      // Check for finish reason
      const finishReason = chunk.choices[0]?.finish_reason
      if (finishReason === 'length') {
        yield {
          type: 'text',
          content: '\n\n[Response truncated due to length]',
        }
      }
    }
  } catch (error) {
    console.error('OpenAI streaming error:', error)
    throw error
  }
}

/**
 * Stream from Anthropic Claude API
 */
export async function* streamFromClaude(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    const stream = await anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })) as Anthropic.MessageParam[],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield {
          type: 'text',
          content: chunk.delta.text,
        }
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error)
    throw error
  }
}

/**
 * Stream from Anthropic Claude API with tool support
 *
 * This function enables the docs assistant to use tools for enhanced responses:
 * - generate_diagram: Create Mermaid diagrams
 * - lookup_component: Look up component documentation
 * - lookup_hook: Look up hook documentation
 * - generate_code_example: Generate code examples
 * - calculate_bundle_impact: Calculate bundle size impact
 */
export async function* streamFromClaudeWithTools(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    tools?: Anthropic.Tool[]
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 4000,
    tools = [],
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  // Import tool handlers dynamically to avoid circular deps
  const { executeToolCall, TOOL_NAMES } = await import('./tools')

  try {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    // Create the initial request with tools
    let response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      tools: tools.length > 0 ? tools : undefined,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })) as Anthropic.MessageParam[],
    })

    // Process response content blocks
    const processContentBlocks = async function* (
      contentBlocks: Anthropic.ContentBlock[]
    ): AsyncGenerator<StreamChunk> {
      for (const block of contentBlocks) {
        if (block.type === 'text') {
          // Stream text in chunks for natural UX
          const words = block.text.split(' ')
          let buffer = ''

          for (let i = 0; i < words.length; i++) {
            buffer += words[i] + (i < words.length - 1 ? ' ' : '')

            // Yield chunks of ~5-10 words
            if (buffer.split(' ').length >= 7 || i === words.length - 1) {
              yield {
                type: 'text',
                content: buffer,
              }
              buffer = ''

              // Small delay for natural streaming feel
              await new Promise((resolve) => setTimeout(resolve, 15))
            }
          }
        } else if (block.type === 'tool_use') {
          // Emit tool use event for UI to show progress
          yield {
            type: 'tool_use',
            tool_name: block.name,
            tool_use_id: block.id,
            tool_input: block.input,
          }

          // Execute the tool
          try {
            const toolResult = await executeToolCall(
              block.name as keyof typeof TOOL_NAMES,
              block.input as Record<string, unknown>
            )

            // Emit tool result for UI to render
            yield {
              type: 'tool_result',
              tool_name: block.name,
              tool_use_id: block.id,
              tool_result: toolResult,
            }
          } catch (error) {
            console.error(`Tool execution error for ${block.name}:`, error)
            yield {
              type: 'tool_result',
              tool_name: block.name,
              tool_use_id: block.id,
              tool_result: {
                success: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Tool execution failed',
              },
            }
          }
        }
      }
    }

    // Process initial response
    yield* processContentBlocks(response.content)

    // Handle tool use loop - continue until model is done
    let loopCount = 0
    const maxLoops = 5 // Prevent infinite loops

    while (response.stop_reason === 'tool_use' && loopCount < maxLoops) {
      loopCount++

      // Collect tool results for the continuation
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          try {
            const result = await executeToolCall(
              block.name as keyof typeof TOOL_NAMES,
              block.input as Record<string, unknown>
            )
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(result),
            })
          } catch (error) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
              is_error: true,
            })
          }
        }
      }

      // Continue the conversation with tool results
      const continuationMessages: Anthropic.MessageParam[] = [
        ...conversationMessages.map((m) => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as
            | 'user'
            | 'assistant',
          content: m.content,
        })),
        {
          role: 'assistant',
          content: response.content,
        },
        {
          role: 'user',
          content: toolResults,
        },
      ]

      response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemMessage,
        tools: tools.length > 0 ? tools : undefined,
        messages: continuationMessages,
      })

      // Process continuation response
      yield* processContentBlocks(response.content)
    }

    // Emit done
    yield { type: 'done' }
  } catch (error) {
    console.error('Claude with tools streaming error:', error)
    throw error
  }
}

/**
 * Stream from Google Gemini API
 */
export async function* streamFromGemini(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  } = {}
): AsyncGenerator<StreamChunk> {
  const { model = 'gemini-1.5-flash', systemPrompt } = options

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({ model })

  try {
    // Build history from messages (excluding the last user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    }))

    // Add system prompt as initial exchange if provided
    if (systemPrompt) {
      history.unshift(
        {
          role: 'user' as const,
          parts: [{ text: `System instructions: ${systemPrompt}` }],
        },
        {
          role: 'model' as const,
          parts: [{ text: 'Understood. I will follow these instructions.' }],
        }
      )
    }

    const chat = geminiModel.startChat({ history })
    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessageStream(lastMessage)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        yield {
          type: 'text',
          content: text,
        }
      }
    }
  } catch (error) {
    console.error('Gemini streaming error:', error)
    throw error
  }
}

/**
 * Demo/fallback streaming function when no API keys are configured
 */
export async function* streamFromDemo(
  messages: { role: string; content: string }[]
): AsyncGenerator<StreamChunk> {
  const lastMessage = messages[messages.length - 1]
  const query = lastMessage.content.toLowerCase()

  // Comprehensive simulated responses based on common queries
  const responses: Record<string, string> = {
    // Getting Started
    'getting started':
      'To get started with Clarity Chat, first install it via npm:\n\n```bash\nnpm install @clarity-chat/react\n```\n\nThen import and use the components:\n\n```tsx\nimport { ClarityChat } from "@clarity-chat/react"\nimport "@clarity-chat/react/styles.css"\n\nfunction App() {\n  return <ClarityChat api="/api/chat" />\n}\n```\n\nThat\'s it! You now have a fully functional chat interface. 🚀\n\n📖 **Learn more**: [Quick Start Guide](/guides/quick-start) | [Installation](/guides/installation)',
    install:
      'Install Clarity Chat with your preferred package manager:\n\n```bash\n# npm\nnpm install @clarity-chat/react\n\n# yarn\nyarn add @clarity-chat/react\n\n# pnpm\npnpm add @clarity-chat/react\n```\n\nMake sure you also have React 18+ installed as a peer dependency.\n\n📖 **Learn more**: [Installation Guide](/guides/installation)',

    // Streaming
    streaming:
      'Clarity Chat has built-in streaming support via Server-Sent Events (SSE):\n\n```tsx\nimport { useClarityChat } from "@clarity-chat/react"\n\nfunction Chat() {\n  const { messages, sendMessage, isLoading } = useClarityChat({\n    api: "/api/chat",\n    transport: "sse", // Enable streaming\n  })\n\n  return (\n    <ChatWindow\n      messages={messages}\n      onSendMessage={sendMessage}\n      isLoading={isLoading}\n    />\n  )\n}\n```\n\nStreaming provides real-time responses as tokens are generated.\n\n📖 **Learn more**: [Streaming Guide](/guides/streaming)',

    // Components
    components:
      'Clarity Chat provides **70+ pre-built components**:\n\n**Core Components:**\n- `<ClarityChat />` - Drop-in complete chat UI\n- `<ChatWindow />` - Main chat interface\n- `<ChatInput />` - Message input with auto-resize\n- `<MessageList />` - Virtualized message container\n- `<Message />` - Individual message display\n\n**Advanced Components:**\n- `<VoiceInput />` - Speech-to-text\n- `<FileUpload />` - Drag & drop file attachments\n- `<CommandPalette />` - Cmd+K interface\n- `<TokenCounter />` - Real-time token tracking\n- `<PromptSuggestions />` - AI-generated follow-ups\n\n📖 **Learn more**: [Component Reference](/reference/components)',

    // Hooks
    hook: 'Clarity Chat includes **35+ custom hooks**:\n\n**Core Hooks:**\n```tsx\nimport {\n  useClarityChat,    // Main chat hook\n  useStreamingSSE,   // SSE streaming\n  useTokenTracker,   // Token counting\n  useMessageOps,     // Edit/delete/regenerate\n} from "@clarity-chat/react"\n```\n\n**Utility Hooks:**\n- `useAutoScroll()` - Smart scrolling\n- `useClipboard()` - Copy-paste support\n- `useLocalStorage()` - Persistence\n- `useReducedMotion()` - Accessibility\n\n📖 **Learn more**: [Hooks Reference](/reference/hooks)',

    // Theming
    theme:
      'Customize Clarity Chat with **11 built-in themes** or create your own:\n\n```tsx\nimport { ClarityChat, themes } from "@clarity-chat/react"\n\n// Use a preset theme\n<ClarityChat theme={themes.dark} />\n\n// Or customize with CSS variables\n<ClarityChat\n  style={{\n    "--cc-primary": "#6366f1",\n    "--cc-bg": "#0f172a",\n  }}\n/>\n```\n\n**Available themes:** light, dark, system, ocean, forest, sunset, midnight, lavender, slate, rose, emerald\n\n📖 **Learn more**: [Theming Guide](/guides/theming)',

    // Memory
    memory:
      'Clarity Chat supports long-term conversation memory:\n\n```tsx\nimport { MemoryProvider, useClarityChat } from "@clarity-chat/react"\n\nfunction App() {\n  return (\n    <MemoryProvider strategy="sliding-window" maxTokens={4000}>\n      <Chat />\n    </MemoryProvider>\n  )\n}\n```\n\n**Memory strategies:**\n- `sliding-window` - Keep recent messages\n- `summary` - Compress old messages\n- `semantic` - Vector-based retrieval\n\n📖 **Learn more**: [Memory Guide](/guides/memory)',

    // Token optimization
    token:
      'Optimize costs with token tracking and budget management:\n\n```tsx\nimport { useTokenBudgetMonitor } from "@clarity-chat/react"\n\nconst {\n  currentTokens,\n  isNearLimit,\n  isCritical,\n} = useTokenBudgetMonitor({\n  maxTokens: 8000,\n  warningThreshold: 0.8,\n})\n```\n\nClarity Chat can reduce costs by **50-80%** with:\n- TOON format compression\n- Prompt caching\n- Smart model routing\n\n📖 **Learn more**: [Token Optimization](/guides/token-optimization)',

    // Accessibility
    accessib:
      'Clarity Chat is **WCAG 2.1 AAA compliant** with:\n\n- Full keyboard navigation\n- Screen reader support (ARIA labels)\n- Focus management\n- Reduced motion support\n- High contrast mode\n- RTL language support\n\n```tsx\nimport { useReducedMotion } from "@clarity-chat/react"\n\nconst prefersReducedMotion = useReducedMotion()\n```\n\n📖 **Learn more**: [Accessibility Guide](/guides/accessibility)',

    // Error handling
    error:
      'Handle errors gracefully with built-in error boundaries:\n\n```tsx\nimport { ErrorBoundary, useErrorRecovery } from "@clarity-chat/react"\n\nconst { retry, resetError } = useErrorRecovery({\n  maxRetries: 3,\n  onError: (error) => console.error(error),\n})\n\n<ErrorBoundary fallback={<ErrorMessage />}>\n  <ChatWindow />\n</ErrorBoundary>\n```\n\n📖 **Learn more**: [Error Handling](/guides/error-handling)',

    // Testing
    test: 'Test your chat components with our testing utilities:\n\n```tsx\nimport { render, screen } from "@testing-library/react"\nimport { ChatWindow } from "@clarity-chat/react"\n\ntest("renders chat input", () => {\n  render(<ChatWindow messages={[]} />)\n  expect(screen.getByRole("textbox")).toBeInTheDocument()\n})\n```\n\nWe provide mocks for streaming and API calls.\n\n📖 **Learn more**: [Testing Guide](/guides/testing)',

    // Props / API
    props:
      'Each component accepts typed props for full customization:\n\n```tsx\ninterface ChatWindowProps {\n  messages: Message[]\n  onSendMessage: (content: string) => void\n  isLoading?: boolean\n  placeholder?: string\n  maxLength?: number\n  theme?: Theme\n  className?: string\n}\n```\n\nAll props are documented with TSDoc comments for IntelliSense support.\n\n📖 **Learn more**: [API Reference](/reference/components)',

    // Examples
    example:
      'Check out our **30+ production-ready examples**:\n\n- Simple Chat Bot\n- Multi-turn Conversation\n- RAG with Documents\n- Voice Assistant\n- Customer Support Widget\n- Collaborative Chat\n- AI Code Assistant\n\nEach example includes full source code and live demos.\n\n📖 **Explore**: [Examples Gallery](/examples)',

    // Performance
    perform:
      'Clarity Chat is optimized for performance:\n\n- **Virtual scrolling** for 1000+ messages\n- **Lazy loading** of heavy components\n- **Memoized renders** with React.memo\n- **Code splitting** for smaller bundles\n\n```tsx\nimport { VirtualizedMessageList } from "@clarity-chat/react"\n\n<VirtualizedMessageList\n  messages={messages}\n  overscan={5}\n/>\n```\n\n📖 **Learn more**: [Performance Guide](/guides/performance)',
  }

  // Improved default response with contextual help
  const defaultResponse = `👋 **Welcome to Clarity Chat Demo Mode!**

I'm running without an API key, so I can only provide pre-defined answers. Here's what I can help with:

**📚 Documentation Topics:**
- Installation & getting started
- Streaming messages (SSE/WebSocket)
- Available components (70+)
- Hooks reference (35+)
- Theming & customization
- Memory & conversation history
- Token optimization
- Accessibility features
- Error handling
- Testing strategies

**🔗 Quick Links:**
- [Quick Start Guide](/guides/quick-start)
- [Component Reference](/reference/components)
- [Hooks Reference](/reference/hooks)
- [Examples Gallery](/examples)

**💡 Try asking:**
- "How do I install Clarity Chat?"
- "What components are available?"
- "How does streaming work?"
- "How do I customize the theme?"

*To enable full AI-powered responses, add your API key to \`.env.local\`*`

  // Find matching response with priority ordering
  let response = defaultResponse
  const priorityKeys = [
    'getting started',
    'install',
    'streaming',
    'components',
    'hook',
    'theme',
    'memory',
    'token',
    'accessib',
    'error',
    'test',
    'props',
    'example',
    'perform',
  ]

  for (const key of priorityKeys) {
    if (query.includes(key)) {
      response = responses[key]
      break
    }
  }

  // Calculate token estimates for demo mode transparency
  const inputTokens = Math.ceil(lastMessage.content.length / 4)
  const outputTokens = Math.ceil(response.length / 4)
  const matchedTopic =
    priorityKeys.find((key) => query.includes(key)) || 'default'

  // Stream the response character by character
  const words = response.split(' ')
  let buffer = ''

  for (let i = 0; i < words.length; i++) {
    buffer += words[i] + (i < words.length - 1 ? ' ' : '')

    // Yield chunks of ~5-10 words for natural streaming
    if (buffer.split(' ').length >= 7 || i === words.length - 1) {
      yield {
        type: 'text',
        content: buffer,
      }
      buffer = ''

      // Small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
  }

  // Add token usage footer in demo mode for transparency
  const tokenFooter = `\n\n---\n📊 **Demo Mode Stats:** ~${inputTokens} input tokens, ~${outputTokens} output tokens | Topic: ${matchedTopic}`

  yield {
    type: 'text',
    content: tokenFooter,
  }

  // Yield thinking chunk with metadata for UI consumption
  yield {
    type: 'thinking',
    data: {
      demoMode: true,
      matchedTopic,
      tokenEstimate: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
    },
  }
}

/**
 * Query complexity classification for smart model routing
 */
export type QueryComplexity = 'simple' | 'moderate' | 'complex'

export interface QueryClassification {
  complexity: QueryComplexity
  reason: string
  suggestedModel: string
  estimatedTokens: number
}

/**
 * Classify query complexity to determine optimal model routing
 */
export function classifyQueryComplexity(
  query: string,
  conversationLength: number = 0
): QueryClassification {
  const wordCount = query.split(/\s+/).length
  const hasCode = /```|`[^`]+`|function\s+\w+|const\s+\w+|class\s+\w+/.test(
    query
  )

  // Patterns indicating complex queries
  const complexPatterns = [
    /\b(implement|build|create|design|architect|refactor)\b.*\b(system|application|service|feature)\b/i,
    /\b(compare|analyze|evaluate|explain in detail|step by step)\b/i,
    /\b(debug|troubleshoot|fix|solve).*\b(error|issue|bug|problem)\b/i,
    /\b(how|why)\b.*\b(work|works|working)\b.*\b(under the hood|internally|behind)\b/i,
    /\b(best practices?|patterns?|architecture)\b/i,
    /\b(multiple|several|many|all)\b.*\b(components?|hooks?|features?)\b/i,
  ]

  // Patterns indicating simple queries
  const simplePatterns = [
    /^(what is|what's|what are)\s+\w+(\s+\w+)?\??$/i,
    /^(how|where)\s+(do|can|to)\s+\w+\??$/i,
    /^(list|show|get)\s+\w+$/i,
    /\b(version|install|import)\b/i,
    /^(yes|no|ok|thanks?|thank you)\b/i,
  ]

  // Check for simple patterns first
  for (const pattern of simplePatterns) {
    if (pattern.test(query) && wordCount < 15 && !hasCode) {
      return {
        complexity: 'simple',
        reason: 'Short, direct question',
        suggestedModel: 'gpt-3.5-turbo',
        estimatedTokens: Math.ceil(query.length / 4) + 500,
      }
    }
  }

  // Check for complex patterns
  for (const pattern of complexPatterns) {
    if (pattern.test(query)) {
      return {
        complexity: 'complex',
        reason: 'Technical deep-dive or multi-step task',
        suggestedModel: 'gpt-4-turbo-preview',
        estimatedTokens: Math.ceil(query.length / 4) + 2000,
      }
    }
  }

  // Factor in conversation length and code presence
  const isComplex =
    wordCount > 50 ||
    hasCode ||
    conversationLength > 10 ||
    (query.match(/\?/g) || []).length > 2

  const isModerate =
    wordCount > 20 ||
    conversationLength > 5 ||
    (query.match(/\?/g) || []).length > 1

  if (isComplex) {
    return {
      complexity: 'complex',
      reason: 'Long query, code, or extended conversation',
      suggestedModel: 'gpt-4-turbo-preview',
      estimatedTokens: Math.ceil(query.length / 4) + 2000,
    }
  }

  if (isModerate) {
    return {
      complexity: 'moderate',
      reason: 'Moderate complexity question',
      suggestedModel: 'gpt-4-turbo-preview',
      estimatedTokens: Math.ceil(query.length / 4) + 1000,
    }
  }

  return {
    complexity: 'simple',
    reason: 'Standard documentation query',
    suggestedModel: 'gpt-3.5-turbo',
    estimatedTokens: Math.ceil(query.length / 4) + 500,
  }
}

/**
 * Model routing configuration
 */
export interface ModelRoutingConfig {
  /** Enable smart routing (default: true if multiple models available) */
  enabled?: boolean
  /** Force a specific model regardless of complexity */
  forceModel?: string
  /** Cost optimization mode - prefer cheaper models when possible */
  optimizeForCost?: boolean
  /** Speed optimization mode - prefer faster models when possible */
  optimizeForSpeed?: boolean
}

/**
 * Get the appropriate streaming function based on configured model
 */
export function getStreamingFunction():
  | typeof streamFromOpenAI
  | typeof streamFromClaude
  | typeof streamFromGemini
  | typeof streamFromDemo {
  // Check if any API key is configured
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY

  // If no API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    logger.warn('⚠️  No API keys configured - using demo mode')
    return streamFromDemo
  }

  const model = process.env.AI_MODEL || 'gpt-4-turbo-preview'

  if (model.startsWith('claude') && hasAnthropic) {
    return streamFromClaude
  }

  if (model.startsWith('gemini') && hasGemini) {
    return streamFromGemini
  }

  if (hasOpenAI) {
    return streamFromOpenAI
  }

  // Fallback to demo if configured model doesn't have a key
  logger.warn('⚠️  Configured model has no API key - using demo mode')
  return streamFromDemo
}

/**
 * Get streaming function with smart model routing based on query complexity
 */
export function getStreamingFunctionWithRouting(
  query: string,
  conversationLength: number = 0,
  config: ModelRoutingConfig = {}
): {
  streamFn:
    | typeof streamFromOpenAI
    | typeof streamFromClaude
    | typeof streamFromGemini
    | typeof streamFromDemo
  model: string
  classification: QueryClassification
} {
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY

  // Classify query complexity
  const classification = classifyQueryComplexity(query, conversationLength)

  // If no API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    return {
      streamFn: streamFromDemo,
      model: 'demo',
      classification,
    }
  }

  // If forced model, use it
  if (config.forceModel) {
    if (config.forceModel.startsWith('claude') && hasAnthropic) {
      return {
        streamFn: streamFromClaude,
        model: config.forceModel,
        classification,
      }
    }
    if (config.forceModel.startsWith('gemini') && hasGemini) {
      return {
        streamFn: streamFromGemini,
        model: config.forceModel,
        classification,
      }
    }
    if (hasOpenAI) {
      return {
        streamFn: streamFromOpenAI,
        model: config.forceModel,
        classification,
      }
    }
  }

  // If routing disabled, use default
  if (config.enabled === false) {
    return {
      streamFn: getStreamingFunction(),
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      classification,
    }
  }

  // Smart routing based on complexity
  let selectedModel: string
  let streamFn:
    | typeof streamFromOpenAI
    | typeof streamFromClaude
    | typeof streamFromGemini
    | typeof streamFromDemo

  switch (classification.complexity) {
    case 'simple':
      // For simple queries, prefer fast/cheap models
      if (config.optimizeForSpeed && hasGemini) {
        selectedModel = 'gemini-1.5-flash'
        streamFn = streamFromGemini
      } else if (config.optimizeForCost && hasOpenAI) {
        selectedModel = 'gpt-3.5-turbo'
        streamFn = streamFromOpenAI
      } else if (hasOpenAI) {
        selectedModel = 'gpt-3.5-turbo'
        streamFn = streamFromOpenAI
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-flash'
        streamFn = streamFromGemini
      } else if (hasAnthropic) {
        selectedModel = 'claude-3-haiku-20240307'
        streamFn = streamFromClaude
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    case 'moderate':
      // For moderate queries, use balanced models
      if (hasOpenAI) {
        selectedModel = 'gpt-4-turbo-preview'
        streamFn = streamFromOpenAI
      } else if (hasAnthropic) {
        selectedModel = 'claude-3-5-sonnet-20241022'
        streamFn = streamFromClaude
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-pro'
        streamFn = streamFromGemini
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    case 'complex':
      // For complex queries, use the most capable models
      if (hasAnthropic) {
        selectedModel = 'claude-3-5-sonnet-20241022'
        streamFn = streamFromClaude
      } else if (hasOpenAI) {
        selectedModel = 'gpt-4-turbo-preview'
        streamFn = streamFromOpenAI
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-pro'
        streamFn = streamFromGemini
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    default:
      selectedModel = process.env.AI_MODEL || 'gpt-4-turbo-preview'
      streamFn = getStreamingFunction()
  }

  return {
    streamFn,
    model: selectedModel,
    classification,
  }
}

/**
 * Rate limiting for API requests
 */
interface RateLimitStore {
  requests: number[]
  lastReset: number
}

const rateLimitStore = new Map<string, RateLimitStore>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let store = rateLimitStore.get(identifier)

  // Initialize or reset if window expired
  if (!store || now - store.lastReset > windowMs) {
    store = {
      requests: [],
      lastReset: now,
    }
    rateLimitStore.set(identifier, store)
  }

  // Remove old requests outside the window
  store.requests = store.requests.filter((time) => now - time < windowMs)

  // Check if limit exceeded
  const allowed = store.requests.length < maxRequests

  if (allowed) {
    store.requests.push(now)
  }

  return {
    allowed,
    remaining: Math.max(0, maxRequests - store.requests.length),
    resetAt: store.lastReset + windowMs,
  }
}

/**
 * Token counter for rate limiting
 */
export function estimateMessageTokens(
  messages: { role: string; content: string }[]
): number {
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0)
  return Math.ceil(totalChars / 4) // Rough estimate: 4 chars per token
}

/**
 * Validate request size
 */
export function validateRequest(
  messages: { role: string; content: string }[],
  maxTokens = 10000
): { valid: boolean; error?: string } {
  if (messages.length === 0) {
    return { valid: false, error: 'No messages provided' }
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'user') {
    return { valid: false, error: 'Last message must be from user' }
  }

  const estimatedTokens = estimateMessageTokens(messages)
  if (estimatedTokens > maxTokens) {
    return {
      valid: false,
      error: `Request too large: ${estimatedTokens} tokens (max: ${maxTokens})`,
    }
  }

  return { valid: true }
}

/**
 * Error handler for streaming errors
 */
export function handleStreamError(error: unknown): StreamChunk {
  console.error('Stream error:', error)

  let errorMessage = 'An unexpected error occurred'

  if (error instanceof Error) {
    // OpenAI errors
    if ('status' in error && error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.'
    } else if ('status' in error && error.status === 401) {
      errorMessage = 'Authentication failed. Please check API credentials.'
    } else {
      errorMessage = error.message
    }
  }

  return {
    type: 'error',
    content: errorMessage,
  }
}

/**
 * Retry logic for failed requests
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      logger.warn(`Attempt ${attempt + 1} failed:`, error)

      if (attempt < maxRetries - 1) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Format response with metadata
 */
export interface FormattedResponse {
  content: string
  metadata: {
    model: string
    tokensUsed?: number
    sources?: Array<{ title: string; url: string }>
    timestamp: string
  }
}

export function formatResponse(
  content: string,
  sources?: Array<{ title: string; url: string }>
): FormattedResponse {
  return {
    content,
    metadata: {
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      sources,
      timestamp: new Date().toISOString(),
    },
  }
}
