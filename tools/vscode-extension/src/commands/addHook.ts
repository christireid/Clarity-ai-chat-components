/**
 * Add Hook Command
 * Provides a visual picker to insert Clarity Chat hooks
 */

import * as vscode from 'vscode'

interface HookItem extends vscode.QuickPickItem {
  value: string
  category: string
  code: string
  imports: string
}

const HOOKS: HookItem[] = [
  // Primary Hooks
  {
    label: '$(symbol-method) useClarityChat',
    description: 'Primary chat hook',
    detail: 'Full-featured chat state management with streaming, memory, and optimization',
    value: 'useClarityChat',
    category: 'Primary',
    imports: "import { useClarityChat } from '@clarity-chat/react'",
    code: `const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  reload,
  stop,
} = useClarityChat({
  api: '\${1:/api/chat}',
  \${2:memory: {
    enabled: true,
    strategy: 'hybrid',
    maxTokens: 2000,
  },}
})`
  },
  {
    label: '$(symbol-method) useChatEnhanced',
    description: 'Composable chat hook',
    detail: 'Enhanced hook with more granular control and composability',
    value: 'useChatEnhanced',
    category: 'Primary',
    imports: "import { useChatEnhanced } from '@clarity-chat/react'",
    code: `const {
  messages,
  send,
  append,
  isLoading,
  streamingContent,
} = useChatEnhanced({
  api: '\${1:/api/chat}',
  onFinish: (message) => {
    \${2:console.log('Message complete:', message)}
  },
})`
  },

  // Memory Hooks
  {
    label: '$(database) useMemoryContext',
    description: 'Access memory state',
    detail: 'Get and manage conversation memory from MemoryProvider',
    value: 'useMemoryContext',
    category: 'Memory',
    imports: "import { useMemoryContext } from '@clarity-chat/react'",
    code: `const {
  memoryInfo,
  clearMemory,
  summarizeMemory,
  getRelevantContext,
} = useMemoryContext()`
  },
  {
    label: '$(history) useConversationHistory',
    description: 'Conversation history management',
    detail: 'Manage and persist conversation history',
    value: 'useConversationHistory',
    category: 'Memory',
    imports: "import { useConversationHistory } from '@clarity-chat/react'",
    code: `const {
  history,
  addToHistory,
  clearHistory,
  exportHistory,
  importHistory,
} = useConversationHistory({
  storageKey: '\${1:clarity-chat-history}',
  maxConversations: \${2:50},
})`
  },

  // Streaming Hooks
  {
    label: '$(broadcast) useStreamingSSE',
    description: 'Server-sent events streaming',
    detail: 'Stream responses using Server-Sent Events',
    value: 'useStreamingSSE',
    category: 'Streaming',
    imports: "import { useStreamingSSE } from '@clarity-chat/react'",
    code: `const {
  data,
  isStreaming,
  error,
  start,
  stop,
} = useStreamingSSE({
  url: '\${1:/api/chat}',
  onChunk: (chunk) => {
    \${2:console.log('Received chunk:', chunk)}
  },
})`
  },
  {
    label: '$(plug) useStreamingWebSocket',
    description: 'WebSocket streaming',
    detail: 'Real-time bidirectional streaming via WebSocket',
    value: 'useStreamingWebSocket',
    category: 'Streaming',
    imports: "import { useStreamingWebSocket } from '@clarity-chat/react'",
    code: `const {
  data,
  isConnected,
  isStreaming,
  send,
  disconnect,
} = useStreamingWebSocket({
  url: '\${1:wss://your-server.com/ws}',
  reconnect: true,
  maxRetries: 3,
})`
  },

  // Token Optimization Hooks
  {
    label: '$(dashboard) useTokenBudgetMonitor',
    description: 'Token budget tracking',
    detail: 'Monitor and optimize token usage to stay within budget',
    value: 'useTokenBudgetMonitor',
    category: 'Token Optimization',
    imports: "import { useTokenBudgetMonitor } from '@clarity-chat/react'",
    code: `const {
  stats,
  optimizeMessages,
  isOverBudget,
  percentUsed,
  remainingTokens,
} = useTokenBudgetMonitor({
  maxInputTokens: \${1:4000},
  maxOutputTokens: \${2:1000},
  warningThreshold: \${3:0.8},
})`
  },
  {
    label: '$(zap) useTokenOptimizationEnhanced',
    description: 'Advanced token optimization',
    detail: 'Advanced optimization strategies for token efficiency',
    value: 'useTokenOptimizationEnhanced',
    category: 'Token Optimization',
    imports: "import { useTokenOptimizationEnhanced } from '@clarity-chat/react'",
    code: `const {
  optimizedMessages,
  compressionRatio,
  applyOptimization,
  strategies,
} = useTokenOptimizationEnhanced({
  messages,
  targetTokens: \${1:2000},
  strategies: ['\${2|truncate,summarize,prioritize|}'],
})`
  },
  {
    label: '$(symbol-numeric) useTokenCounter',
    description: 'Token counting utility',
    detail: 'Count tokens for messages and text',
    value: 'useTokenCounter',
    category: 'Token Optimization',
    imports: "import { useTokenCounter } from '@clarity-chat/react'",
    code: `const {
  countTokens,
  estimateCost,
  tokenize,
} = useTokenCounter({
  model: '\${1|gpt-4-turbo,claude-3-opus,gemini-pro|}',
})`
  },

  // UI State Hooks
  {
    label: '$(symbol-boolean) useLoadingState',
    description: 'Loading state management',
    detail: 'Manage loading states with timeout and error handling',
    value: 'useLoadingState',
    category: 'UI State',
    imports: "import { useLoadingState } from '@clarity-chat/react'",
    code: `const {
  isLoading,
  startLoading,
  stopLoading,
  withLoading,
} = useLoadingState({
  timeout: \${1:30000},
  onTimeout: () => {
    \${2:console.error('Request timed out')}
  },
})`
  },
  {
    label: '$(error) useErrorHandler',
    description: 'Error handling hook',
    detail: 'Centralized error handling with retry logic',
    value: 'useErrorHandler',
    category: 'UI State',
    imports: "import { useErrorHandler } from '@clarity-chat/react'",
    code: `const {
  error,
  handleError,
  clearError,
  retryLastAction,
} = useErrorHandler({
  onError: (error) => {
    \${1:console.error('Chat error:', error)}
  },
  retryCount: \${2:3},
})`
  },
  {
    label: '$(scroll) useAutoScroll',
    description: 'Auto-scroll behavior',
    detail: 'Automatically scroll to new messages',
    value: 'useAutoScroll',
    category: 'UI State',
    imports: "import { useAutoScroll } from '@clarity-chat/react'",
    code: `const {
  containerRef,
  scrollToBottom,
  isAtBottom,
} = useAutoScroll({
  smooth: true,
  threshold: \${1:100},
})`
  },

  // Provider Integration Hooks
  {
    label: '$(cloud) useProviderConfig',
    description: 'Provider configuration',
    detail: 'Configure AI provider settings',
    value: 'useProviderConfig',
    category: 'Provider',
    imports: "import { useProviderConfig } from '@clarity-chat/react'",
    code: `const {
  provider,
  model,
  setProvider,
  setModel,
  availableModels,
} = useProviderConfig({
  defaultProvider: '\${1|openai,anthropic,google|}',
  defaultModel: '\${2:gpt-4-turbo}',
})`
  },
  {
    label: '$(symbol-interface) useMultiProvider',
    description: 'Multi-provider support',
    detail: 'Use multiple AI providers in one chat',
    value: 'useMultiProvider',
    category: 'Provider',
    imports: "import { useMultiProvider } from '@clarity-chat/react'",
    code: `const {
  activeProvider,
  switchProvider,
  compareResponses,
  providers,
} = useMultiProvider({
  providers: {
    openai: { model: 'gpt-4-turbo' },
    anthropic: { model: 'claude-3-opus' },
  },
})`
  },

  // Utility Hooks
  {
    label: '$(file-text) useMessageParser',
    description: 'Parse message content',
    detail: 'Parse and transform message content',
    value: 'useMessageParser',
    category: 'Utilities',
    imports: "import { useMessageParser } from '@clarity-chat/react'",
    code: `const {
  parseMessage,
  extractCode,
  extractLinks,
  formatMessage,
} = useMessageParser()`
  },
  {
    label: '$(keyboard) useKeyboardShortcuts',
    description: 'Keyboard shortcuts',
    detail: 'Add keyboard shortcuts to chat',
    value: 'useKeyboardShortcuts',
    category: 'Utilities',
    imports: "import { useKeyboardShortcuts } from '@clarity-chat/react'",
    code: `useKeyboardShortcuts({
  'mod+enter': handleSubmit,
  'escape': handleCancel,
  'mod+k': clearChat,
})`
  },
  {
    label: '$(mic) useVoiceInput',
    description: 'Voice input support',
    detail: 'Enable voice-to-text input',
    value: 'useVoiceInput',
    category: 'Utilities',
    imports: "import { useVoiceInput } from '@clarity-chat/react'",
    code: `const {
  isListening,
  transcript,
  startListening,
  stopListening,
  error,
} = useVoiceInput({
  language: '\${1:en-US}',
  continuous: \${2:false},
})`
  }
]

export async function addHookCommand(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found')
    return
  }

  // Group hooks by category
  const categories = [...new Set(HOOKS.map(h => h.category))]

  // Show category picker first
  const categoryPick = await vscode.window.showQuickPick(
    [
      { label: 'All Hooks', description: 'Show all available hooks', value: 'all' },
      ...categories.map(cat => ({
        label: `$(folder) ${cat}`,
        description: `${HOOKS.filter(h => h.category === cat).length} hooks`,
        value: cat
      }))
    ],
    {
      placeHolder: 'Select hook category',
      title: 'Clarity Chat Hooks'
    }
  )

  if (!categoryPick) return

  // Filter hooks by category
  const filteredHooks = categoryPick.value === 'all'
    ? HOOKS
    : HOOKS.filter(h => h.category === categoryPick.value)

  // Show hook picker
  const selection = await vscode.window.showQuickPick(
    filteredHooks,
    {
      placeHolder: 'Select a hook to add',
      title: 'Clarity Chat Hooks',
      matchOnDescription: true,
      matchOnDetail: true
    }
  ) as HookItem | undefined

  if (!selection) return

  // Check if import already exists
  const document = editor.document
  const text = document.getText()
  const hasImport = text.includes(selection.value) && text.includes('@clarity-chat/react')

  // If import doesn't exist, ask if user wants to add it
  if (!hasImport) {
    const addImport = await vscode.window.showQuickPick(
      [
        { label: 'Yes', description: 'Add import statement at the top', value: true },
        { label: 'No', description: 'Insert hook only', value: false }
      ],
      {
        placeHolder: `Add import for ${selection.value}?`,
        title: 'Add Import'
      }
    )

    if (addImport?.value) {
      // Find the best location for the import
      const importLocation = findImportLocation(document)

      await editor.edit(editBuilder => {
        editBuilder.insert(importLocation, selection.imports + '\n')
      })
    }
  }

  // Insert the hook as a snippet
  const snippet = new vscode.SnippetString(selection.code)
  await editor.insertSnippet(snippet)

  // Show success message
  vscode.window.showInformationMessage(
    `Added ${selection.value} hook`,
    'View Docs'
  ).then(choice => {
    if (choice === 'View Docs') {
      vscode.env.openExternal(
        vscode.Uri.parse(`https://docs.claritychat.dev/hooks/${selection.value.toLowerCase()}`)
      )
    }
  })
}

function findImportLocation(document: vscode.TextDocument): vscode.Position {
  const text = document.getText()
  const lines = text.split('\n')

  // Find the last import statement
  let lastImportLine = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('import ') || line.startsWith("import{")) {
      lastImportLine = i
    } else if (lastImportLine >= 0 && line && !line.startsWith('//') && !line.startsWith('/*')) {
      break
    }
  }

  if (lastImportLine >= 0) {
    return new vscode.Position(lastImportLine + 1, 0)
  }

  // No imports found, insert at the beginning (after any 'use client' directive)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (lines[i].includes("'use client'") || lines[i].includes('"use client"')) {
      return new vscode.Position(i + 1, 0)
    }
  }

  return new vscode.Position(0, 0)
}
