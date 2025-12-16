import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Completion Provider for Clarity Chat
 *
 * Provides intelligent code completion for Clarity Chat components,
 * hooks, and AI SDKs
 */

import * as vscode from 'vscode'

export class CompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const linePrefix = document
      .lineAt(position)
      .text.substring(0, position.character)

    const completions: vscode.CompletionItem[] = []

    // Clarity Chat component completions
    if (linePrefix.endsWith('<') || linePrefix.match(/<[A-Z][a-zA-Z]*$/)) {
      completions.push(...this.getClarityChatComponents())
    }

    // Clarity Chat hook completions
    if (linePrefix.match(/use[A-Z]?$/)) {
      completions.push(...this.getClarityChatHooks())
    }

    // Import completions for @clarity-chat/react
    if (
      linePrefix.includes("from '@clarity-chat") ||
      linePrefix.includes('from "@clarity-chat')
    ) {
      completions.push(...this.getClarityChatExports())
    }

    // OpenAI completions
    if (linePrefix.includes('openai.chat.completions.create')) {
      completions.push(...this.getOpenAICompletions())
    }

    // Anthropic completions
    if (linePrefix.includes('anthropic.messages.create')) {
      completions.push(...this.getAnthropicCompletions())
    }

    // Google AI completions
    if (linePrefix.includes('generateContent')) {
      completions.push(...this.getGoogleAICompletions())
    }

    // Model suggestions
    if (linePrefix.includes('model:') || linePrefix.includes('model =')) {
      completions.push(...this.getModelCompletions())
    }

    // Environment variable suggestions
    if (linePrefix.includes('process.env.')) {
      completions.push(...this.getEnvCompletions())
    }

    // useClarityChat options
    if (
      linePrefix.includes('useClarityChat({') ||
      linePrefix.includes('useClarityChat({\n')
    ) {
      completions.push(...this.getUseClarityChatOptions())
    }

    // Memory strategy completions
    if (linePrefix.includes('strategy:') || linePrefix.includes('strategy =')) {
      completions.push(...this.getMemoryStrategyCompletions())
    }

    return completions
  }

  private getClarityChatComponents(): vscode.CompletionItem[] {
    const components = [
      {
        label: 'ClarityChat',
        snippet:
          'ClarityChat api="${1:/api/chat}" placeholder="${2:Type your message...}" $0/>',
        detail: 'Complete drop-in chat UI',
        docs: 'Full-featured chat interface with streaming, markdown, and accessibility support.',
      },
      {
        label: 'ClarityChatPresets',
        snippet:
          'ClarityChatPresets variant="${1|minimal,standard,enterprise|}" api="${2:/api/chat}" />',
        detail: 'Pre-configured chat variants',
        docs: 'Ready-to-use chat presets for common use cases.',
      },
      {
        label: 'ChatWindow',
        snippet: 'ChatWindow className="${1:h-screen}">\n\t$0\n</ChatWindow>',
        detail: 'Chat container component',
        docs: 'Scrollable container with proper chat layout and auto-scroll.',
      },
      {
        label: 'MessageList',
        snippet:
          'MessageList messages={${1:messages}} isLoading={${2:isLoading}} />',
        detail: 'Message list display',
        docs: 'Virtualized message list for performance with large histories.',
      },
      {
        label: 'ChatInput',
        snippet:
          'ChatInput\n\tvalue={${1:input}}\n\tonChange={${2:handleInputChange}}\n\tonSubmit={${3:handleSubmit}}\n\tisLoading={${4:isLoading}}\n\tplaceholder="${5:Type a message...}"\n/>',
        detail: 'Chat input with submit',
        docs: 'Full-featured input with file upload, voice input, and keyboard shortcuts.',
      },
      {
        label: 'MessageBubble',
        snippet:
          'MessageBubble message={${1:message}} variant="${2|default,compact,minimal|}" />',
        detail: 'Individual message display',
        docs: 'Styled message bubble with role-based theming and timestamps.',
      },
      {
        label: 'MemoryProvider',
        snippet:
          'MemoryProvider strategy="${1|hybrid,sliding-window,summarization|}" maxTokens={${2:2000}}>\n\t$0\n</MemoryProvider>',
        detail: 'Memory context provider',
        docs: 'Enables conversation memory for child components.',
      },
      {
        label: 'StreamingMessage',
        snippet:
          'StreamingMessage content={${1:content}} isStreaming={${2:isStreaming}} showCursor />',
        detail: 'Streaming text display',
        docs: 'Real-time text display with typing cursor animation.',
      },
      {
        label: 'ThinkingIndicator',
        snippet: 'ThinkingIndicator variant="${1|dots,pulse,spinner|}" />',
        detail: 'AI thinking animation',
        docs: 'Visual indicator while AI processes request.',
      },
      {
        label: 'TokenBudgetDisplay',
        snippet:
          'TokenBudgetDisplay stats={${1:tokenStats}} maxTokens={${2:4000}} showWarning />',
        detail: 'Token usage visualization',
        docs: 'Shows token consumption with visual progress bar.',
      },
      {
        label: 'MarkdownRenderer',
        snippet:
          'MarkdownRenderer content={${1:content}} enableCodeHighlight />',
        detail: 'Markdown content display',
        docs: 'Renders markdown with syntax highlighting and sanitization.',
      },
      {
        label: 'CodeBlock',
        snippet:
          'CodeBlock code={${1:code}} language="${2:typescript}" showLineNumbers enableCopy />',
        detail: 'Syntax highlighted code',
        docs: 'Code block with copy button and language detection.',
      },
    ]

    return components.map(({ label, snippet, detail, docs }) => {
      const item = new vscode.CompletionItem(
        label,
        vscode.CompletionItemKind.Class
      )
      item.detail = `Clarity Chat - ${detail}`
      item.insertText = new vscode.SnippetString(snippet)
      item.documentation = new vscode.MarkdownString(
        `**${label}**\n\n${docs}\n\n[View Documentation](https://docs.claritychat.dev/components/${label.toLowerCase()})`
      )
      item.sortText = `0_${label}` // Sort Clarity Chat components first
      return item
    })
  }

  private getClarityChatHooks(): vscode.CompletionItem[] {
    const hooks = [
      {
        label: 'useClarityChat',
        snippet:
          "{ messages, input, handleInputChange, handleSubmit, isLoading } = useClarityChat({\n\tapi: '${1:/api/chat}',\n})",
        detail: 'Primary chat hook with state management',
        docs: 'Full-featured hook for chat state, streaming, memory, and optimization.',
      },
      {
        label: 'useTokenBudgetMonitor',
        snippet:
          '{ stats, optimizeMessages, isOverBudget } = useTokenBudgetMonitor({\n\tmaxInputTokens: ${1:4000},\n\twarningThreshold: ${2:0.8},\n})',
        detail: 'Token budget tracking and optimization',
        docs: 'Monitor and optimize token usage to stay within budget limits.',
      },
      {
        label: 'useMemoryContext',
        snippet:
          '{ memoryInfo, clearMemory, summarizeMemory } = useMemoryContext()',
        detail: 'Access memory state from MemoryProvider',
        docs: 'Get and manage conversation memory state.',
      },
      {
        label: 'useStreamingSSE',
        snippet:
          "{ data, isStreaming, error } = useStreamingSSE({\n\turl: '${1:/api/chat}',\n})",
        detail: 'Server-sent events streaming',
        docs: 'Stream responses using Server-Sent Events.',
      },
      {
        label: 'useChatEnhanced',
        snippet:
          '{ messages, send, isLoading } = useChatEnhanced(${1:options})',
        detail: 'Composable chat hook',
        docs: 'Enhanced hook with more granular control and composability.',
      },
      {
        label: 'useConversationHistory',
        snippet:
          "{ history, addToHistory, clearHistory } = useConversationHistory({\n\tstorageKey: '${1:clarity-chat}',\n})",
        detail: 'Conversation history management',
        docs: 'Persist and manage conversation history across sessions.',
      },
      {
        label: 'useAutoScroll',
        snippet:
          '{ containerRef, scrollToBottom, isAtBottom } = useAutoScroll()',
        detail: 'Auto-scroll behavior',
        docs: 'Automatically scroll to new messages.',
      },
      {
        label: 'useProviderConfig',
        snippet:
          "{ provider, model, setProvider } = useProviderConfig({\n\tdefaultProvider: '${1|openai,anthropic,google|}',\n})",
        detail: 'Provider configuration',
        docs: 'Configure AI provider settings dynamically.',
      },
    ]

    return hooks.map(({ label, snippet, detail, docs }) => {
      const item = new vscode.CompletionItem(
        label,
        vscode.CompletionItemKind.Function
      )
      item.detail = `Clarity Chat - ${detail}`
      item.insertText = new vscode.SnippetString(snippet)
      item.documentation = new vscode.MarkdownString(
        `**${label}**\n\n${docs}\n\n[View Documentation](https://docs.claritychat.dev/hooks/${label.toLowerCase()})`
      )
      item.sortText = `0_${label}` // Sort Clarity Chat hooks first
      return item
    })
  }

  private getClarityChatExports(): vscode.CompletionItem[] {
    const exports = [
      // Components
      { name: 'ClarityChat', kind: vscode.CompletionItemKind.Class },
      { name: 'ClarityChatPresets', kind: vscode.CompletionItemKind.Class },
      { name: 'ChatWindow', kind: vscode.CompletionItemKind.Class },
      { name: 'ChatInput', kind: vscode.CompletionItemKind.Class },
      { name: 'MessageList', kind: vscode.CompletionItemKind.Class },
      { name: 'MessageBubble', kind: vscode.CompletionItemKind.Class },
      { name: 'StreamingMessage', kind: vscode.CompletionItemKind.Class },
      { name: 'ThinkingIndicator', kind: vscode.CompletionItemKind.Class },
      { name: 'TypingIndicator', kind: vscode.CompletionItemKind.Class },
      { name: 'MemoryProvider', kind: vscode.CompletionItemKind.Class },
      { name: 'ClarityChatProvider', kind: vscode.CompletionItemKind.Class },
      { name: 'TokenBudgetDisplay', kind: vscode.CompletionItemKind.Class },
      { name: 'MarkdownRenderer', kind: vscode.CompletionItemKind.Class },
      { name: 'CodeBlock', kind: vscode.CompletionItemKind.Class },
      { name: 'ErrorBoundary', kind: vscode.CompletionItemKind.Class },
      // Hooks
      { name: 'useClarityChat', kind: vscode.CompletionItemKind.Function },
      { name: 'useChatEnhanced', kind: vscode.CompletionItemKind.Function },
      { name: 'useMemoryContext', kind: vscode.CompletionItemKind.Function },
      {
        name: 'useConversationHistory',
        kind: vscode.CompletionItemKind.Function,
      },
      { name: 'useStreamingSSE', kind: vscode.CompletionItemKind.Function },
      {
        name: 'useStreamingWebSocket',
        kind: vscode.CompletionItemKind.Function,
      },
      {
        name: 'useTokenBudgetMonitor',
        kind: vscode.CompletionItemKind.Function,
      },
      {
        name: 'useTokenOptimizationEnhanced',
        kind: vscode.CompletionItemKind.Function,
      },
      { name: 'useTokenCounter', kind: vscode.CompletionItemKind.Function },
      { name: 'useAutoScroll', kind: vscode.CompletionItemKind.Function },
      { name: 'useProviderConfig', kind: vscode.CompletionItemKind.Function },
      { name: 'useMultiProvider', kind: vscode.CompletionItemKind.Function },
      {
        name: 'useKeyboardShortcuts',
        kind: vscode.CompletionItemKind.Function,
      },
      { name: 'useVoiceInput', kind: vscode.CompletionItemKind.Function },
      // Types
      { name: 'CoreMessage', kind: vscode.CompletionItemKind.Interface },
      {
        name: 'UseClarityChatOptions',
        kind: vscode.CompletionItemKind.Interface,
      },
      {
        name: 'ClarityMemoryOptions',
        kind: vscode.CompletionItemKind.Interface,
      },
      { name: 'TokenBudgetStats', kind: vscode.CompletionItemKind.Interface },
      { name: 'StreamingState', kind: vscode.CompletionItemKind.Interface },
      // Utilities
      {
        name: 'buildKVCacheOptimizedPrompt',
        kind: vscode.CompletionItemKind.Function,
      },
      { name: 'createSystemSegment', kind: vscode.CompletionItemKind.Function },
      {
        name: 'createHistorySegment',
        kind: vscode.CompletionItemKind.Function,
      },
    ]

    return exports.map(({ name, kind }) => {
      const item = new vscode.CompletionItem(name, kind)
      item.detail = '@clarity-chat/react'
      return item
    })
  }

  private getUseClarityChatOptions(): vscode.CompletionItem[] {
    const options = [
      { name: 'api', type: 'string', desc: 'API endpoint URL' },
      { name: 'memory', type: 'object', desc: 'Memory configuration' },
      { name: 'onStart', type: 'function', desc: 'Called when request starts' },
      {
        name: 'onFinish',
        type: 'function',
        desc: 'Called when request completes',
      },
      { name: 'onError', type: 'function', desc: 'Error handler callback' },
      {
        name: 'initialMessages',
        type: 'array',
        desc: 'Initial message history',
      },
      { name: 'initialValue', type: 'string', desc: 'Initial input value' },
      {
        name: 'requestBody',
        type: 'object',
        desc: 'Additional request body data',
      },
      { name: 'headers', type: 'object', desc: 'Custom request headers' },
    ]

    return options.map(({ name, type, desc }) => {
      const item = new vscode.CompletionItem(
        name,
        vscode.CompletionItemKind.Property
      )
      item.detail = type
      item.documentation = desc
      return item
    })
  }

  private getMemoryStrategyCompletions(): vscode.CompletionItem[] {
    const strategies = [
      {
        name: 'hybrid',
        desc: 'Combine sliding window and summarization (recommended)',
      },
      { name: 'sliding-window', desc: 'Keep last N messages' },
      { name: 'summarization', desc: 'Compress old messages into summaries' },
    ]

    return strategies.map(({ name, desc }) => {
      const item = new vscode.CompletionItem(
        name,
        vscode.CompletionItemKind.EnumMember
      )
      item.detail = desc
      item.insertText = `'${name}'`
      return item
    })
  }

  private getOpenAICompletions(): vscode.CompletionItem[] {
    const models = [
      {
        name: 'gpt-4-turbo',
        detail: 'Latest GPT-4 Turbo (128K context)',
        cost: '$0.01/$0.03 per 1K tokens',
      },
      {
        name: 'gpt-4o',
        detail: 'GPT-4 Omni (128K context)',
        cost: '$0.005/$0.015 per 1K tokens',
      },
      {
        name: 'gpt-4',
        detail: 'GPT-4 (8K context)',
        cost: '$0.03/$0.06 per 1K tokens',
      },
      {
        name: 'gpt-3.5-turbo',
        detail: 'GPT-3.5 Turbo (16K context)',
        cost: '$0.0005/$0.0015 per 1K tokens',
      },
    ]

    return models.map((model) => {
      const item = new vscode.CompletionItem(
        model.name,
        vscode.CompletionItemKind.Value
      )
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getAnthropicCompletions(): vscode.CompletionItem[] {
    const models = [
      {
        name: 'claude-3-opus-20240229',
        detail: 'Most capable Claude 3 model',
        cost: '$0.015/$0.075 per 1K tokens',
      },
      {
        name: 'claude-3-sonnet-20240229',
        detail: 'Balanced Claude 3 model',
        cost: '$0.003/$0.015 per 1K tokens',
      },
      {
        name: 'claude-3-haiku-20240307',
        detail: 'Fastest Claude 3 model',
        cost: '$0.00025/$0.00125 per 1K tokens',
      },
    ]

    return models.map((model) => {
      const item = new vscode.CompletionItem(
        model.name,
        vscode.CompletionItemKind.Value
      )
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getGoogleAICompletions(): vscode.CompletionItem[] {
    const models = [
      {
        name: 'gemini-pro',
        detail: 'Gemini Pro text model',
        cost: '$0.00025/$0.0005 per 1K tokens',
      },
      {
        name: 'gemini-pro-vision',
        detail: 'Gemini Pro with vision',
        cost: '$0.00025/$0.0005 per 1K tokens',
      },
    ]

    return models.map((model) => {
      const item = new vscode.CompletionItem(
        model.name,
        vscode.CompletionItemKind.Value
      )
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getModelCompletions(): vscode.CompletionItem[] {
    return [
      ...this.getOpenAICompletions(),
      ...this.getAnthropicCompletions(),
      ...this.getGoogleAICompletions(),
    ]
  }

  private getEnvCompletions(): vscode.CompletionItem[] {
    const envVars = [
      {
        name: 'OPENAI_API_KEY',
        detail: 'OpenAI API key',
        docs: 'Get your API key from https://platform.openai.com/api-keys',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        detail: 'Anthropic API key',
        docs: 'Get your API key from https://console.anthropic.com/settings/keys',
      },
      {
        name: 'GOOGLE_API_KEY',
        detail: 'Google AI API key',
        docs: 'Get your API key from https://makersuite.google.com/app/apikey',
      },
    ]

    return envVars.map((env) => {
      const item = new vscode.CompletionItem(
        env.name,
        vscode.CompletionItemKind.Variable
      )
      item.detail = env.detail
      item.documentation = new vscode.MarkdownString(env.docs)
      item.insertText = env.name
      return item
    })
  }
}
