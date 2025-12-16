import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Copilot Chat Participant for Clarity Chat
 * Provides @clarity chat assistant for documentation, code generation, and migration help
 */

import * as vscode from 'vscode'

/**
 * Register the Copilot chat participant
 */
export function registerChatParticipant(
  context: vscode.ExtensionContext
): void {
  // Check if chat API is available (VS Code 1.90+)
  if (!vscode.chat) {
    SecureLogger.debug('Chat API not available - Copilot features disabled')
    return
  }

  const participant = vscode.chat.createChatParticipant(
    'clarity-chat.assistant',
    handleChatRequest
  )

  participant.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    'assets',
    'icon.png'
  )

  participant.followupProvider = {
    provideFollowups: (_result, _context, _token) => {
      return [
        {
          prompt: 'Show me memory management examples',
          label: 'Memory Examples',
        },
        {
          prompt: 'How do I optimize tokens?',
          label: 'Token Optimization',
        },
        {
          prompt: 'Help me migrate from Vercel AI SDK',
          label: 'Migration Help',
        },
        {
          prompt: 'Show available components',
          label: 'Components',
        },
        {
          prompt: 'Show available hooks',
          label: 'Hooks',
        },
      ]
    },
  }

  context.subscriptions.push(participant)
}

/**
 * Handle chat participant requests
 */
async function handleChatRequest(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  response: vscode.ChatResponseStream,
  _token: vscode.CancellationToken
): Promise<vscode.ChatResult | void> {
  const prompt = request.prompt.toLowerCase()

  // Check for slash commands
  if (request.command === 'component') {
    await handleComponentRequest(request, response)
    return { metadata: { command: 'component' } }
  }

  if (request.command === 'hook') {
    await handleHookRequest(request, response)
    return { metadata: { command: 'hook' } }
  }

  if (request.command === 'memory') {
    await handleMemoryRequest(response)
    return { metadata: { command: 'memory' } }
  }

  if (request.command === 'optimize') {
    await handleOptimizationRequest(response)
    return { metadata: { command: 'optimize' } }
  }

  if (request.command === 'migrate') {
    await handleMigrationRequest(response)
    return { metadata: { command: 'migrate' } }
  }

  if (request.command === 'docs') {
    await handleDocsRequest(request, response)
    return { metadata: { command: 'docs' } }
  }

  // Natural language handling
  if (prompt.includes('component') || prompt.includes('add')) {
    await handleComponentRequest(request, response)
  } else if (prompt.includes('hook')) {
    await handleHookRequest(request, response)
  } else if (prompt.includes('memory')) {
    await handleMemoryRequest(response)
  } else if (prompt.includes('token') || prompt.includes('optimi')) {
    await handleOptimizationRequest(response)
  } else if (
    prompt.includes('migrate') ||
    prompt.includes('convert') ||
    prompt.includes('vercel')
  ) {
    await handleMigrationRequest(response)
  } else if (prompt.includes('stream')) {
    await handleStreamingRequest(response)
  } else if (prompt.includes('api') || prompt.includes('route')) {
    await handleApiRouteRequest(response)
  } else if (prompt.includes('doc')) {
    await handleDocsRequest(request, response)
  } else if (prompt.includes('example') || prompt.includes('show')) {
    await handleExamplesRequest(response)
  } else {
    await handleGeneralRequest(request.prompt, response)
  }

  return { metadata: { command: 'general' } }
}

async function handleComponentRequest(
  request: vscode.ChatRequest,
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Clarity Chat Components\n\n')

  response.markdown('## Top-Level Components (Drop-in Ready)\n\n')
  response.markdown('| Component | Description |\n')
  response.markdown('|-----------|-------------|\n')
  response.markdown('| `ClarityChat` | Complete chat UI with all features |\n')
  response.markdown(
    '| `ClarityChatPresets` | Pre-configured variants (minimal, standard, enterprise) |\n\n'
  )

  response.markdown('## Building Blocks\n\n')
  response.markdown('| Component | Description |\n')
  response.markdown('|-----------|-------------|\n')
  response.markdown(
    '| `ChatWindow` | Scrollable container with proper layout |\n'
  )
  response.markdown('| `ChatInput` | Full-featured input with submit |\n')
  response.markdown('| `MessageList` | Virtualized message display |\n')
  response.markdown('| `MessageBubble` | Individual message styling |\n')
  response.markdown('| `StreamingMessage` | Real-time text with cursor |\n')
  response.markdown('| `ThinkingIndicator` | AI processing animation |\n\n')

  response.markdown('## Providers\n\n')
  response.markdown('| Component | Description |\n')
  response.markdown('|-----------|-------------|\n')
  response.markdown('| `MemoryProvider` | Enables conversation memory |\n')
  response.markdown('| `ClarityChatProvider` | Root context provider |\n\n')

  response.markdown('### Quick Example\n\n')
  response.markdown('```tsx\n')
  response.markdown("import { ClarityChat } from '@clarity-chat/react'\n\n")
  response.markdown('<ClarityChat\n')
  response.markdown('  api="/api/chat"\n')
  response.markdown('  placeholder="Type your message..."\n')
  response.markdown('  showTimestamp\n')
  response.markdown('  enableMarkdown\n')
  response.markdown('/>\n')
  response.markdown('```\n\n')

  response.button({
    command: 'clarity-chat.addComponent',
    title: 'Add Component',
  })
}

async function handleHookRequest(
  request: vscode.ChatRequest,
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Clarity Chat Hooks\n\n')

  response.markdown('## Primary Hooks\n\n')
  response.markdown('| Hook | Description |\n')
  response.markdown('|------|-------------|\n')
  response.markdown(
    '| `useClarityChat` | Full-featured chat state management |\n'
  )
  response.markdown(
    '| `useChatEnhanced` | Composable chat with more control |\n\n'
  )

  response.markdown('## Memory Hooks\n\n')
  response.markdown('| Hook | Description |\n')
  response.markdown('|------|-------------|\n')
  response.markdown(
    '| `useMemoryContext` | Access memory state from provider |\n'
  )
  response.markdown(
    '| `useConversationHistory` | Persist and manage history |\n\n'
  )

  response.markdown('## Streaming Hooks\n\n')
  response.markdown('| Hook | Description |\n')
  response.markdown('|------|-------------|\n')
  response.markdown('| `useStreamingSSE` | Server-sent events streaming |\n')
  response.markdown('| `useStreamingWebSocket` | WebSocket streaming |\n\n')

  response.markdown('## Token Optimization\n\n')
  response.markdown('| Hook | Description |\n')
  response.markdown('|------|-------------|\n')
  response.markdown('| `useTokenBudgetMonitor` | Track token usage |\n')
  response.markdown(
    '| `useTokenOptimizationEnhanced` | Advanced optimization |\n'
  )
  response.markdown('| `useTokenCounter` | Count tokens for text |\n\n')

  response.markdown('### Quick Example\n\n')
  response.markdown('```tsx\n')
  response.markdown("import { useClarityChat } from '@clarity-chat/react'\n\n")
  response.markdown('const {\n')
  response.markdown('  messages,\n')
  response.markdown('  input,\n')
  response.markdown('  handleInputChange,\n')
  response.markdown('  handleSubmit,\n')
  response.markdown('  isLoading,\n')
  response.markdown('} = useClarityChat({\n')
  response.markdown("  api: '/api/chat',\n")
  response.markdown('  memory: { enabled: true, strategy: "hybrid" },\n')
  response.markdown('})\n')
  response.markdown('```\n\n')

  response.button({
    command: 'clarity-chat.addHook',
    title: 'Add Hook',
  })
}

async function handleMemoryRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Memory Management\n\n')
  response.markdown(
    'Clarity Chat provides built-in conversation memory to help you build context-aware AI applications.\n\n'
  )

  response.markdown('## Memory Strategies\n\n')
  response.markdown('| Strategy | Description | Best For |\n')
  response.markdown('|----------|-------------|----------|\n')
  response.markdown(
    '| `sliding-window` | Keep last N messages | Simple chat apps |\n'
  )
  response.markdown(
    '| `summarization` | Compress old messages | Long conversations |\n'
  )
  response.markdown(
    '| `hybrid` | Combine both approaches | Production apps |\n\n'
  )

  response.markdown('## Basic Setup\n\n')
  response.markdown('```tsx\n')
  response.markdown(
    "import { MemoryProvider, useClarityChat } from '@clarity-chat/react'\n\n"
  )
  response.markdown('function App() {\n')
  response.markdown('  return (\n')
  response.markdown('    <MemoryProvider\n')
  response.markdown('      strategy="hybrid"\n')
  response.markdown('      maxTokens={2000}\n')
  response.markdown('    >\n')
  response.markdown('      <ChatWithMemory />\n')
  response.markdown('    </MemoryProvider>\n')
  response.markdown('  )\n')
  response.markdown('}\n\n')
  response.markdown('function ChatWithMemory() {\n')
  response.markdown('  const { messages, memoryInfo } = useClarityChat({\n')
  response.markdown("    api: '/api/chat',\n")
  response.markdown('    memory: {\n')
  response.markdown('      enabled: true,\n')
  response.markdown("      strategy: 'hybrid',\n")
  response.markdown('      maxTokens: 2000,\n')
  response.markdown('    },\n')
  response.markdown('  })\n')
  response.markdown(
    '  // memoryInfo contains: totalTokens, compressionRatio, etc.\n'
  )
  response.markdown('}\n')
  response.markdown('```\n\n')

  response.markdown('## Accessing Memory State\n\n')
  response.markdown('```tsx\n')
  response.markdown('const {\n')
  response.markdown('  memoryInfo,      // Current memory stats\n')
  response.markdown('  clearMemory,     // Clear all memory\n')
  response.markdown('  summarizeMemory, // Force summarization\n')
  response.markdown('  getRelevantContext, // Get context for query\n')
  response.markdown('} = useMemoryContext()\n')
  response.markdown('```\n\n')
}

async function handleOptimizationRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Token Optimization\n\n')
  response.markdown(
    'Clarity Chat provides several strategies to optimize token usage and reduce costs.\n\n'
  )

  response.markdown('## 1. Token Budget Monitor\n\n')
  response.markdown('Track token usage in real-time:\n\n')
  response.markdown('```tsx\n')
  response.markdown(
    "import { useTokenBudgetMonitor } from '@clarity-chat/react'\n\n"
  )
  response.markdown('const {\n')
  response.markdown(
    '  stats,           // { inputTokens, outputTokens, totalCost }\n'
  )
  response.markdown('  optimizeMessages, // Trim messages to fit budget\n')
  response.markdown('  isOverBudget,    // Boolean check\n')
  response.markdown('  percentUsed,     // 0-100 percentage\n')
  response.markdown('  remainingTokens, // Tokens left in budget\n')
  response.markdown('} = useTokenBudgetMonitor({\n')
  response.markdown('  maxInputTokens: 4000,\n')
  response.markdown('  maxOutputTokens: 1000,\n')
  response.markdown('  warningThreshold: 0.8, // Warn at 80%\n')
  response.markdown('})\n')
  response.markdown('```\n\n')

  response.markdown('## 2. Message Optimization\n\n')
  response.markdown('```tsx\n')
  response.markdown(
    'const { optimizedMessages, compressionRatio } = useTokenOptimizationEnhanced({\n'
  )
  response.markdown('  messages,\n')
  response.markdown('  targetTokens: 2000,\n')
  response.markdown("  strategies: ['truncate', 'summarize', 'prioritize'],\n")
  response.markdown('})\n')
  response.markdown('```\n\n')

  response.markdown('## 3. Cost Estimation\n\n')
  response.markdown('```tsx\n')
  response.markdown('const { countTokens, estimateCost } = useTokenCounter({\n')
  response.markdown("  model: 'gpt-4-turbo',\n")
  response.markdown('})\n\n')
  response.markdown("const tokens = countTokens('Hello, world!')\n")
  response.markdown(
    'const cost = estimateCost(1000, 500) // input, output tokens\n'
  )
  response.markdown('```\n\n')

  response.markdown('## Best Practices\n\n')
  response.markdown(
    '1. Use `hybrid` memory strategy for automatic optimization\n'
  )
  response.markdown('2. Set appropriate `maxTokens` for your use case\n')
  response.markdown('3. Monitor token usage with `useTokenBudgetMonitor`\n')
  response.markdown('4. Use streaming to improve perceived performance\n')
}

async function handleMigrationRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Migration from Vercel AI SDK\n\n')
  response.markdown(
    'Clarity Chat is designed to be a drop-in replacement with enhanced features.\n\n'
  )

  response.markdown('## Import Changes\n\n')
  response.markdown('```tsx\n')
  response.markdown('// Before (Vercel AI SDK)\n')
  response.markdown("import { useChat } from 'ai/react'\n")
  response.markdown("import { Message } from 'ai'\n\n")
  response.markdown('// After (Clarity Chat)\n')
  response.markdown("import { useClarityChat } from '@clarity-chat/react'\n")
  response.markdown("import type { CoreMessage } from '@clarity-chat/react'\n")
  response.markdown('```\n\n')

  response.markdown('## Hook Migration\n\n')
  response.markdown('```tsx\n')
  response.markdown('// Before\n')
  response.markdown(
    'const { messages, input, handleInputChange, handleSubmit } = useChat({\n'
  )
  response.markdown("  api: '/api/chat',\n")
  response.markdown('})\n\n')
  response.markdown('// After (same API, plus memory!)\n')
  response.markdown(
    'const { messages, input, handleInputChange, handleSubmit } = useClarityChat({\n'
  )
  response.markdown("  api: '/api/chat',\n")
  response.markdown('  memory: { enabled: true }, // Built-in memory!\n')
  response.markdown('})\n')
  response.markdown('```\n\n')

  response.markdown('## Key Differences\n\n')
  response.markdown('| Feature | Vercel AI SDK | Clarity Chat |\n')
  response.markdown('|---------|--------------|---------------|\n')
  response.markdown('| Memory | Manual | Built-in |\n')
  response.markdown('| Token optimization | Manual | Built-in |\n')
  response.markdown('| Multi-provider | Limited | Full support |\n')
  response.markdown('| UI Components | None | Full library |\n')
  response.markdown('| Streaming | Basic | Enhanced |\n\n')

  response.button({
    command: 'clarity-chat.convertToClarity',
    title: 'Convert Current File',
  })
}

async function handleStreamingRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Streaming Responses\n\n')
  response.markdown(
    'Clarity Chat supports multiple streaming transports for real-time responses.\n\n'
  )

  response.markdown('## Server-Sent Events (SSE) - Recommended\n\n')
  response.markdown('```tsx\n')
  response.markdown('// Client\n')
  response.markdown('const chat = useClarityChat({\n')
  response.markdown("  api: '/api/chat',\n")
  response.markdown("  transport: 'sse', // Default\n")
  response.markdown('})\n\n')
  response.markdown('// Server (Next.js App Router)\n')
  response.markdown('export async function POST(req: NextRequest) {\n')
  response.markdown('  const { messages } = await req.json()\n')
  response.markdown('  const stream = new ReadableStream({ ... })\n')
  response.markdown('  return new Response(stream, {\n')
  response.markdown("    headers: { 'Content-Type': 'text/event-stream' },\n")
  response.markdown('  })\n')
  response.markdown('}\n')
  response.markdown('```\n\n')

  response.markdown('## WebSocket\n\n')
  response.markdown('```tsx\n')
  response.markdown(
    'const { data, isConnected, send } = useStreamingWebSocket({\n'
  )
  response.markdown("  url: 'wss://your-server.com/ws',\n")
  response.markdown('  reconnect: true,\n')
  response.markdown('  maxRetries: 3,\n')
  response.markdown('})\n')
  response.markdown('```\n\n')

  response.button({
    command: 'clarity-chat.createApiRoute',
    title: 'Create API Route',
  })
}

async function handleApiRouteRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# API Routes\n\n')
  response.markdown('Clarity Chat works with any streaming API endpoint.\n\n')

  response.markdown('## OpenAI Example\n\n')
  response.markdown('```tsx\n')
  response.markdown("import { OpenAI } from 'openai'\n\n")
  response.markdown('const openai = new OpenAI()\n\n')
  response.markdown('export async function POST(req: NextRequest) {\n')
  response.markdown('  const { messages } = await req.json()\n')
  response.markdown('  \n')
  response.markdown('  const stream = new ReadableStream({\n')
  response.markdown('    async start(controller) {\n')
  response.markdown(
    '      const completion = await openai.chat.completions.create({\n'
  )
  response.markdown("        model: 'gpt-4-turbo',\n")
  response.markdown('        messages,\n')
  response.markdown('        stream: true,\n')
  response.markdown('      })\n')
  response.markdown('      // ... handle streaming\n')
  response.markdown('    },\n')
  response.markdown('  })\n')
  response.markdown('}\n')
  response.markdown('```\n\n')

  response.button({
    command: 'clarity-chat.createApiRoute',
    title: 'Create API Route',
  })
}

async function handleDocsRequest(
  request: vscode.ChatRequest,
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Clarity Chat Documentation\n\n')

  response.markdown('## Quick Links\n\n')
  response.markdown(
    '- [Getting Started](https://docs.claritychat.dev/getting-started)\n'
  )
  response.markdown('- [Components](https://docs.claritychat.dev/components)\n')
  response.markdown('- [Hooks](https://docs.claritychat.dev/hooks)\n')
  response.markdown(
    '- [Memory Management](https://docs.claritychat.dev/memory)\n'
  )
  response.markdown(
    '- [Token Optimization](https://docs.claritychat.dev/token-optimization)\n'
  )
  response.markdown('- [API Routes](https://docs.claritychat.dev/api-routes)\n')
  response.markdown(
    '- [Migration Guide](https://docs.claritychat.dev/migration)\n'
  )
  response.markdown('- [Examples](https://docs.claritychat.dev/examples)\n\n')

  response.button({
    command: 'clarity-chat.openDocs',
    title: 'Open Documentation',
  })

  response.button({
    command: 'clarity-chat.openStorybook',
    title: 'Open Storybook',
  })
}

async function handleExamplesRequest(
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown('# Code Examples\n\n')

  response.markdown('## Complete Chat Page\n\n')
  response.markdown('```tsx\n')
  response.markdown("'use client'\n\n")
  response.markdown(
    "import { ClarityChat, MemoryProvider } from '@clarity-chat/react'\n\n"
  )
  response.markdown('export default function ChatPage() {\n')
  response.markdown('  return (\n')
  response.markdown('    <MemoryProvider strategy="hybrid" maxTokens={2000}>\n')
  response.markdown('      <div className="h-screen">\n')
  response.markdown('        <ClarityChat\n')
  response.markdown('          api="/api/chat"\n')
  response.markdown('          placeholder="Ask me anything..."\n')
  response.markdown('          showTimestamp\n')
  response.markdown('          enableMarkdown\n')
  response.markdown('        />\n')
  response.markdown('      </div>\n')
  response.markdown('    </MemoryProvider>\n')
  response.markdown('  )\n')
  response.markdown('}\n')
  response.markdown('```\n\n')

  response.button({
    command: 'clarity-chat.showExamples',
    title: 'Browse Examples',
  })
}

async function handleGeneralRequest(
  prompt: string,
  response: vscode.ChatResponseStream
): Promise<void> {
  response.markdown(
    "I'm the **Clarity Chat** assistant! I can help you with:\n\n"
  )

  response.markdown('## Ask me about:\n\n')
  response.markdown(
    '- **Components** - "show me components" or "add a chat component"\n'
  )
  response.markdown('- **Hooks** - "what hooks are available?"\n')
  response.markdown('- **Memory** - "how do I set up memory?"\n')
  response.markdown('- **Token Optimization** - "how do I optimize tokens?"\n')
  response.markdown('- **Migration** - "help me migrate from Vercel AI SDK"\n')
  response.markdown('- **Streaming** - "how does streaming work?"\n')
  response.markdown('- **API Routes** - "create an API route"\n')
  response.markdown('- **Examples** - "show me examples"\n')
  response.markdown('- **Documentation** - "open docs"\n\n')

  response.markdown('## Slash Commands:\n\n')
  response.markdown('- `/component` - Get help with components\n')
  response.markdown('- `/hook` - Get help with hooks\n')
  response.markdown('- `/memory` - Learn about memory\n')
  response.markdown('- `/optimize` - Token optimization tips\n')
  response.markdown('- `/migrate` - Migration assistance\n')
  response.markdown('- `/docs` - Open documentation\n')
}
