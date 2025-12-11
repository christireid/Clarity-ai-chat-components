/**
 * Hover Provider for Clarity Chat
 *
 * Provides documentation on hover for AI models, APIs, and Clarity Chat components/hooks
 */

import * as vscode from 'vscode'

interface ModelInfo {
  name: string
  provider: string
  description: string
  contextWindow: string
  pricing: {
    input: string
    output: string
  }
  capabilities: string[]
  bestFor: string[]
  docs: string
}

interface ClarityItemInfo {
  name: string
  type: 'component' | 'hook' | 'type'
  description: string
  props?: string[]
  returns?: string
  example: string
  docs: string
}

const MODEL_INFO: Record<string, ModelInfo> = {
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description:
      'The latest GPT-4 model with improved performance and 128K context window',
    contextWindow: '128,000 tokens',
    pricing: {
      input: '$0.01 per 1K tokens',
      output: '$0.03 per 1K tokens',
    },
    capabilities: [
      'Text generation',
      'Code generation',
      'Function calling',
      'JSON mode',
    ],
    bestFor: [
      'Complex reasoning',
      'Long-form content',
      'Code generation',
      'Analysis',
    ],
    docs: 'https://platform.openai.com/docs/models/gpt-4-turbo',
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    description: "OpenAI's most capable model for complex tasks",
    contextWindow: '8,192 tokens',
    pricing: {
      input: '$0.03 per 1K tokens',
      output: '$0.06 per 1K tokens',
    },
    capabilities: ['Text generation', 'Code generation', 'Function calling'],
    bestFor: ['Complex reasoning', 'Creative writing', 'Technical analysis'],
    docs: 'https://platform.openai.com/docs/models/gpt-4',
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient model for most tasks',
    contextWindow: '16,385 tokens',
    pricing: {
      input: '$0.0005 per 1K tokens',
      output: '$0.0015 per 1K tokens',
    },
    capabilities: ['Text generation', 'Code generation', 'Function calling'],
    bestFor: ['Quick responses', 'Simple tasks', 'Cost efficiency'],
    docs: 'https://platform.openai.com/docs/models/gpt-3-5-turbo',
  },
  'claude-3-opus-20240229': {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable Claude model for complex tasks',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.015 per 1K tokens',
      output: '$0.075 per 1K tokens',
    },
    capabilities: ['Text generation', 'Analysis', 'Code generation', 'Vision'],
    bestFor: [
      'Complex analysis',
      'Creative writing',
      'Research',
      'Long documents',
    ],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview',
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced Claude model for everyday tasks',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.003 per 1K tokens',
      output: '$0.015 per 1K tokens',
    },
    capabilities: ['Text generation', 'Analysis', 'Code generation', 'Vision'],
    bestFor: ['Balanced performance', 'General tasks', 'Cost efficiency'],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fastest Claude model for quick responses',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.00125 per 1K tokens',
    },
    capabilities: ['Text generation', 'Analysis', 'Vision'],
    bestFor: ['Speed', 'Simple tasks', 'High volume', 'Cost efficiency'],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview',
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'Google',
    description: "Google's multimodal AI model for text tasks",
    contextWindow: '32,768 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.0005 per 1K tokens',
    },
    capabilities: ['Text generation', 'Code generation', 'Analysis'],
    bestFor: ['General tasks', 'Cost efficiency', 'Fast responses'],
    docs: 'https://ai.google.dev/models/gemini',
  },
  'gemini-pro-vision': {
    name: 'Gemini Pro Vision',
    provider: 'Google',
    description: 'Gemini Pro with vision capabilities',
    contextWindow: '16,384 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.0005 per 1K tokens',
    },
    capabilities: ['Text generation', 'Image understanding', 'Analysis'],
    bestFor: ['Image analysis', 'Multimodal tasks', 'Visual Q&A'],
    docs: 'https://ai.google.dev/models/gemini',
  },
}

// Clarity Chat Components
const CLARITY_COMPONENTS: Record<string, ClarityItemInfo> = {
  ClarityChat: {
    name: 'ClarityChat',
    type: 'component',
    description:
      'Complete drop-in chat UI with all features including streaming, memory, and markdown support.',
    props: [
      'api: string - API endpoint for chat',
      'placeholder?: string - Input placeholder text',
      'showTimestamp?: boolean - Show message timestamps',
      'enableMarkdown?: boolean - Enable markdown rendering',
      'className?: string - Custom CSS class',
    ],
    example: `<ClarityChat
  api="/api/chat"
  placeholder="Type your message..."
  showTimestamp
  enableMarkdown
/>`,
    docs: 'https://docs.claritychat.dev/components/clarity-chat',
  },
  ClarityChatPresets: {
    name: 'ClarityChatPresets',
    type: 'component',
    description:
      'Pre-configured chat variants for common use cases (minimal, standard, enterprise).',
    props: [
      'variant: "minimal" | "standard" | "enterprise"',
      'api: string - API endpoint',
    ],
    example: `<ClarityChatPresets variant="standard" api="/api/chat" />`,
    docs: 'https://docs.claritychat.dev/components/presets',
  },
  ChatWindow: {
    name: 'ChatWindow',
    type: 'component',
    description:
      'Scrollable container with proper chat layout and auto-scroll behavior.',
    props: [
      'className?: string - Custom CSS class',
      'children: ReactNode - Chat content',
    ],
    example: `<ChatWindow className="h-screen">
  <MessageList messages={messages} />
  <ChatInput />
</ChatWindow>`,
    docs: 'https://docs.claritychat.dev/components/chat-window',
  },
  MessageList: {
    name: 'MessageList',
    type: 'component',
    description:
      'Virtualized message display for performance with large message histories.',
    props: [
      'messages: Message[] - Array of messages',
      'isLoading?: boolean - Loading state',
      'showTimestamp?: boolean - Show timestamps',
    ],
    example: `<MessageList
  messages={messages}
  isLoading={isLoading}
  showTimestamp
/>`,
    docs: 'https://docs.claritychat.dev/components/message-list',
  },
  ChatInput: {
    name: 'ChatInput',
    type: 'component',
    description:
      'Full-featured input with submit button, file upload support, and keyboard shortcuts.',
    props: [
      'value: string - Input value',
      'onChange: (value: string) => void',
      'onSubmit: () => void',
      'isLoading?: boolean - Disable during loading',
      'placeholder?: string',
    ],
    example: `<ChatInput
  value={input}
  onChange={handleInputChange}
  onSubmit={handleSubmit}
  isLoading={isLoading}
/>`,
    docs: 'https://docs.claritychat.dev/components/chat-input',
  },
  MessageBubble: {
    name: 'MessageBubble',
    type: 'component',
    description: 'Individual message display with role-based styling.',
    props: [
      'message: Message - Message object',
      'variant?: "default" | "compact" | "minimal"',
      'showTimestamp?: boolean',
    ],
    example: `<MessageBubble message={message} variant="default" showTimestamp />`,
    docs: 'https://docs.claritychat.dev/components/message-bubble',
  },
  StreamingMessage: {
    name: 'StreamingMessage',
    type: 'component',
    description: 'Displays streaming text with typing cursor animation.',
    props: [
      'content: string - Current streamed content',
      'isStreaming: boolean - Streaming state',
      'showCursor?: boolean - Show typing cursor',
    ],
    example: `<StreamingMessage content={content} isStreaming={isStreaming} showCursor />`,
    docs: 'https://docs.claritychat.dev/components/streaming-message',
  },
  ThinkingIndicator: {
    name: 'ThinkingIndicator',
    type: 'component',
    description: 'Visual indicator while AI processes a request.',
    props: [
      'variant?: "dots" | "pulse" | "spinner"',
      'text?: string - Custom text',
    ],
    example: `<ThinkingIndicator variant="dots" text="AI is thinking..." />`,
    docs: 'https://docs.claritychat.dev/components/thinking-indicator',
  },
  MemoryProvider: {
    name: 'MemoryProvider',
    type: 'component',
    description:
      'Context provider that enables conversation memory for child components.',
    props: [
      'strategy: "sliding-window" | "summarization" | "hybrid"',
      'maxTokens?: number - Maximum tokens to retain',
      'children: ReactNode',
    ],
    example: `<MemoryProvider strategy="hybrid" maxTokens={2000}>
  <ClarityChat api="/api/chat" />
</MemoryProvider>`,
    docs: 'https://docs.claritychat.dev/memory',
  },
  ClarityChatProvider: {
    name: 'ClarityChatProvider',
    type: 'component',
    description: 'Root context provider for Clarity Chat configuration.',
    props: ['config: ClarityChatConfig - Global configuration', 'children: ReactNode'],
    example: `<ClarityChatProvider config={{ api: '/api/chat' }}>
  <App />
</ClarityChatProvider>`,
    docs: 'https://docs.claritychat.dev/providers',
  },
  TokenBudgetDisplay: {
    name: 'TokenBudgetDisplay',
    type: 'component',
    description: 'Visual display of token usage with progress indicator.',
    props: [
      'stats: TokenStats - Token usage stats',
      'maxTokens: number - Budget limit',
      'showWarning?: boolean - Show warning at threshold',
    ],
    example: `<TokenBudgetDisplay stats={tokenStats} maxTokens={4000} showWarning />`,
    docs: 'https://docs.claritychat.dev/token-optimization',
  },
  MarkdownRenderer: {
    name: 'MarkdownRenderer',
    type: 'component',
    description: 'Renders markdown content with syntax highlighting for code blocks.',
    props: [
      'content: string - Markdown content',
      'enableCodeHighlight?: boolean',
    ],
    example: `<MarkdownRenderer content={message.content} enableCodeHighlight />`,
    docs: 'https://docs.claritychat.dev/components/markdown-renderer',
  },
  CodeBlock: {
    name: 'CodeBlock',
    type: 'component',
    description: 'Syntax highlighted code block with copy button.',
    props: [
      'code: string - Code content',
      'language?: string - Programming language',
      'showLineNumbers?: boolean',
      'enableCopy?: boolean',
    ],
    example: `<CodeBlock code={code} language="typescript" showLineNumbers enableCopy />`,
    docs: 'https://docs.claritychat.dev/components/code-block',
  },
  ErrorBoundary: {
    name: 'ErrorBoundary',
    type: 'component',
    description: 'Error boundary that catches and displays errors gracefully.',
    props: [
      'fallback: ReactNode - Fallback UI',
      'onError?: (error: Error) => void',
      'children: ReactNode',
    ],
    example: `<ErrorBoundary fallback={<ErrorFallback />} onError={handleError}>
  <ClarityChat />
</ErrorBoundary>`,
    docs: 'https://docs.claritychat.dev/components/error-boundary',
  },
}

// Clarity Chat Hooks
const CLARITY_HOOKS: Record<string, ClarityItemInfo> = {
  useClarityChat: {
    name: 'useClarityChat',
    type: 'hook',
    description:
      'Primary hook for chat state management with streaming, memory, and callbacks.',
    returns:
      '{ messages, input, handleInputChange, handleSubmit, isLoading, error, memoryInfo }',
    example: `const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
} = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'hybrid' },
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-clarity-chat',
  },
  useChatEnhanced: {
    name: 'useChatEnhanced',
    type: 'hook',
    description: 'Enhanced chat hook with more granular control over chat behavior.',
    returns: '{ ...useClarityChat, reload, stop, setMessages }',
    example: `const { messages, reload, stop } = useChatEnhanced({
  api: '/api/chat',
  onFinish: (message) => console.log('Done:', message),
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-chat-enhanced',
  },
  useMemoryContext: {
    name: 'useMemoryContext',
    type: 'hook',
    description: 'Access memory state and controls from MemoryProvider.',
    returns: '{ memoryInfo, clearMemory, summarizeMemory, getRelevantContext }',
    example: `const { memoryInfo, clearMemory } = useMemoryContext()

// Check memory usage
console.log(\`Using \${memoryInfo.totalTokens} tokens\`)

// Clear conversation memory
clearMemory()`,
    docs: 'https://docs.claritychat.dev/hooks/use-memory-context',
  },
  useConversationHistory: {
    name: 'useConversationHistory',
    type: 'hook',
    description: 'Persist and manage conversation history across sessions.',
    returns: '{ history, saveConversation, loadConversation, clearHistory }',
    example: `const { history, saveConversation } = useConversationHistory({
  storageKey: 'my-chat',
  maxConversations: 10,
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-conversation-history',
  },
  useStreamingSSE: {
    name: 'useStreamingSSE',
    type: 'hook',
    description: 'Low-level hook for Server-Sent Events streaming.',
    returns: '{ data, isStreaming, error, startStream, stopStream }',
    example: `const { data, isStreaming, startStream } = useStreamingSSE({
  url: '/api/chat',
  onMessage: (chunk) => console.log(chunk),
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-streaming-sse',
  },
  useStreamingWebSocket: {
    name: 'useStreamingWebSocket',
    type: 'hook',
    description: 'WebSocket-based streaming with reconnection support.',
    returns: '{ data, isConnected, send, disconnect }',
    example: `const { data, isConnected, send } = useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  reconnect: true,
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-streaming-websocket',
  },
  useTokenBudgetMonitor: {
    name: 'useTokenBudgetMonitor',
    type: 'hook',
    description: 'Monitor and optimize token usage in real-time.',
    returns:
      '{ stats, isOverBudget, percentUsed, remainingTokens, optimizeMessages }',
    example: `const { stats, isOverBudget, percentUsed } = useTokenBudgetMonitor({
  maxInputTokens: 4000,
  maxOutputTokens: 1000,
  warningThreshold: 0.8,
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-token-budget-monitor',
  },
  useTokenOptimizationEnhanced: {
    name: 'useTokenOptimizationEnhanced',
    type: 'hook',
    description: 'Advanced token optimization with multiple strategies.',
    returns: '{ optimizedMessages, compressionRatio, suggestedActions }',
    example: `const { optimizedMessages } = useTokenOptimizationEnhanced({
  messages,
  targetTokens: 2000,
  strategies: ['truncate', 'summarize', 'prioritize'],
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-token-optimization',
  },
  useTokenCounter: {
    name: 'useTokenCounter',
    type: 'hook',
    description: 'Count tokens and estimate costs for text.',
    returns: '{ countTokens, estimateCost }',
    example: `const { countTokens, estimateCost } = useTokenCounter({
  model: 'gpt-4-turbo',
})

const tokens = countTokens('Hello, world!')
const cost = estimateCost(1000, 500) // input, output`,
    docs: 'https://docs.claritychat.dev/hooks/use-token-counter',
  },
  useLoadingState: {
    name: 'useLoadingState',
    type: 'hook',
    description: 'Manage loading states with timeout and retry support.',
    returns: '{ isLoading, startLoading, stopLoading, error }',
    example: `const { isLoading, startLoading, stopLoading } = useLoadingState({
  timeout: 30000,
  onTimeout: () => console.log('Request timed out'),
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-loading-state',
  },
  useErrorHandler: {
    name: 'useErrorHandler',
    type: 'hook',
    description: 'Centralized error handling with retry logic.',
    returns: '{ error, handleError, clearError, retry }',
    example: `const { error, handleError, retry } = useErrorHandler({
  maxRetries: 3,
  onError: (err) => toast.error(err.message),
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-error-handler',
  },
  useAutoScroll: {
    name: 'useAutoScroll',
    type: 'hook',
    description: 'Auto-scroll to bottom when new messages arrive.',
    returns: '{ ref, scrollToBottom, isAtBottom }',
    example: `const { ref, scrollToBottom, isAtBottom } = useAutoScroll({
  behavior: 'smooth',
  threshold: 100,
})

return <div ref={ref}>{messages}</div>`,
    docs: 'https://docs.claritychat.dev/hooks/use-auto-scroll',
  },
  useProviderConfig: {
    name: 'useProviderConfig',
    type: 'hook',
    description: 'Access and update AI provider configuration.',
    returns: '{ config, updateConfig, resetConfig }',
    example: `const { config, updateConfig } = useProviderConfig()

updateConfig({ model: 'gpt-4-turbo', temperature: 0.7 })`,
    docs: 'https://docs.claritychat.dev/hooks/use-provider-config',
  },
  useMultiProvider: {
    name: 'useMultiProvider',
    type: 'hook',
    description: 'Switch between multiple AI providers dynamically.',
    returns: '{ currentProvider, switchProvider, availableProviders }',
    example: `const { currentProvider, switchProvider } = useMultiProvider({
  providers: ['openai', 'anthropic', 'google'],
  default: 'openai',
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-multi-provider',
  },
  useMessageParser: {
    name: 'useMessageParser',
    type: 'hook',
    description: 'Parse and transform message content (markdown, code blocks, etc).',
    returns: '{ parse, parseAsync }',
    example: `const { parse } = useMessageParser({
  enableMarkdown: true,
  enableCodeHighlight: true,
})

const parsed = parse(message.content)`,
    docs: 'https://docs.claritychat.dev/hooks/use-message-parser',
  },
  useKeyboardShortcuts: {
    name: 'useKeyboardShortcuts',
    type: 'hook',
    description: 'Add keyboard shortcuts for chat actions.',
    returns: 'void (registers shortcuts)',
    example: `useKeyboardShortcuts({
  'mod+enter': handleSubmit,
  'mod+k': clearChat,
  'escape': cancelRequest,
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-keyboard-shortcuts',
  },
  useVoiceInput: {
    name: 'useVoiceInput',
    type: 'hook',
    description: 'Voice-to-text input using Web Speech API.',
    returns: '{ transcript, isListening, startListening, stopListening }',
    example: `const { transcript, isListening, startListening } = useVoiceInput({
  language: 'en-US',
  continuous: false,
})`,
    docs: 'https://docs.claritychat.dev/hooks/use-voice-input',
  },
}

export class HoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Try to get word at position with different patterns
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][\w]*/g)
    if (!wordRange) {
      // Try quoted strings for model names
      const quotedRange = document.getWordRangeAtPosition(
        position,
        /['"][\w\-]+['"]/g
      )
      if (quotedRange) {
        const word = document.getText(quotedRange).replace(/['"]/g, '')
        const modelInfo = MODEL_INFO[word]
        if (modelInfo) {
          return new vscode.Hover(this.createModelHover(modelInfo))
        }
        if (word.includes('API_KEY')) {
          return new vscode.Hover(this.createEnvVarHover(word))
        }
      }
      return undefined
    }

    const word = document.getText(wordRange)

    // Check for Clarity Chat components
    const componentInfo = CLARITY_COMPONENTS[word]
    if (componentInfo) {
      return new vscode.Hover(this.createClarityHover(componentInfo), wordRange)
    }

    // Check for Clarity Chat hooks
    const hookInfo = CLARITY_HOOKS[word]
    if (hookInfo) {
      return new vscode.Hover(this.createClarityHover(hookInfo), wordRange)
    }

    // Check if it's a model name (without quotes in some contexts)
    const modelInfo = MODEL_INFO[word]
    if (modelInfo) {
      return new vscode.Hover(this.createModelHover(modelInfo))
    }

    // Check for environment variables
    if (word.includes('API_KEY')) {
      return new vscode.Hover(this.createEnvVarHover(word))
    }

    return undefined
  }

  private createClarityHover(info: ClarityItemInfo): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.supportHtml = true
    md.isTrusted = true

    const icon = info.type === 'component' ? '🧩' : info.type === 'hook' ? '🪝' : '📦'
    md.appendMarkdown(`## ${icon} ${info.name}\n\n`)
    md.appendMarkdown(`*${info.type}*\n\n`)
    md.appendMarkdown(`${info.description}\n\n`)

    if (info.props && info.props.length > 0) {
      md.appendMarkdown(`---\n\n`)
      md.appendMarkdown(`**Props:**\n`)
      info.props.forEach((prop) => {
        md.appendMarkdown(`- \`${prop}\`\n`)
      })
      md.appendMarkdown(`\n`)
    }

    if (info.returns) {
      md.appendMarkdown(`**Returns:**\n`)
      md.appendMarkdown(`\`${info.returns}\`\n\n`)
    }

    md.appendMarkdown(`---\n\n`)
    md.appendMarkdown(`**Example:**\n`)
    md.appendMarkdown(`\`\`\`tsx\n${info.example}\n\`\`\`\n\n`)
    md.appendMarkdown(`[📖 Documentation](${info.docs})`)

    return md
  }

  private createModelHover(info: ModelInfo): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.supportHtml = true
    md.isTrusted = true

    md.appendMarkdown(`## ${info.name}\n\n`)
    md.appendMarkdown(`**Provider:** ${info.provider}\n\n`)
    md.appendMarkdown(`${info.description}\n\n`)
    md.appendMarkdown(`---\n\n`)
    md.appendMarkdown(`**Context Window:** ${info.contextWindow}\n\n`)
    md.appendMarkdown(`**Pricing:**\n`)
    md.appendMarkdown(`- Input: ${info.pricing.input}\n`)
    md.appendMarkdown(`- Output: ${info.pricing.output}\n\n`)
    md.appendMarkdown(`**Capabilities:**\n`)
    info.capabilities.forEach((cap) => {
      md.appendMarkdown(`- ${cap}\n`)
    })
    md.appendMarkdown(`\n**Best For:**\n`)
    info.bestFor.forEach((use) => {
      md.appendMarkdown(`- ${use}\n`)
    })
    md.appendMarkdown(`\n---\n\n`)
    md.appendMarkdown(`[📖 Documentation](${info.docs})`)

    return md
  }

  private createEnvVarHover(envVar: string): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.supportHtml = true
    md.isTrusted = true

    const envDocs: Record<
      string,
      { provider: string; url: string; description: string }
    > = {
      OPENAI_API_KEY: {
        provider: 'OpenAI',
        url: 'https://platform.openai.com/api-keys',
        description: 'Your OpenAI API key for accessing GPT models',
      },
      ANTHROPIC_API_KEY: {
        provider: 'Anthropic',
        url: 'https://console.anthropic.com/settings/keys',
        description: 'Your Anthropic API key for accessing Claude models',
      },
      GOOGLE_API_KEY: {
        provider: 'Google AI',
        url: 'https://makersuite.google.com/app/apikey',
        description: 'Your Google AI API key for accessing Gemini models',
      },
    }

    const info = envDocs[envVar]
    if (info) {
      md.appendMarkdown(`## ${envVar}\n\n`)
      md.appendMarkdown(`**Provider:** ${info.provider}\n\n`)
      md.appendMarkdown(`${info.description}\n\n`)
      md.appendMarkdown(`**Setup:**\n`)
      md.appendMarkdown(
        `1. Get your API key from [${info.provider}](${info.url})\n`
      )
      md.appendMarkdown(`2. Add to your \`.env.local\` file:\n`)
      md.appendMarkdown(`\`\`\`bash\n${envVar}=your-api-key-here\n\`\`\`\n`)
      md.appendMarkdown(`3. Load in your code:\n`)
      md.appendMarkdown(
        `\`\`\`typescript\nconst apiKey = process.env.${envVar}\n\`\`\`\n`
      )
    }

    return md
  }
}
