/**
 * Add Hook Command
 * An enhanced experience for adding Clarity Chat hooks with pinning and history
 */

import * as vscode from 'vscode'
import { addImportToFile, stripIconPrefix } from '../utils/import-utils'

interface HookItem extends vscode.QuickPickItem {
  value: string
  category: string
  code: string
  imports: string
  isRecent?: boolean
  isPinned?: boolean
}

interface CategoryInfo {
  icon: string
  description: string
}

const CATEGORY_INFO: Record<string, CategoryInfo> = {
  Primary: { icon: '⭐', description: 'Essential chat hooks' },
  Memory: { icon: '🧠', description: 'Conversation memory management' },
  Streaming: { icon: '🌊', description: 'Real-time data streaming' },
  'Token Optimization': { icon: '📊', description: 'Token usage & optimization' },
  'UI State': { icon: '🎨', description: 'UI state management' },
  Provider: { icon: '🔌', description: 'AI provider integration' },
  Utilities: { icon: '🔧', description: 'Helper utilities' },
}

const HOOKS: HookItem[] = [
  // Primary Hooks
  {
    label: '$(symbol-method) useClarityChat',
    description: 'Primary chat hook',
    detail: '⭐ Primary • Full-featured chat state management with streaming, memory, and optimization',
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
})`,
  },
  {
    label: '$(symbol-method) useChatEnhanced',
    description: 'Composable chat hook',
    detail: '⭐ Primary • Enhanced hook with more granular control and composability',
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
})`,
  },

  // Memory Hooks
  {
    label: '$(database) useMemoryContext',
    description: 'Access memory state',
    detail: '🧠 Memory • Get and manage conversation memory from MemoryProvider',
    value: 'useMemoryContext',
    category: 'Memory',
    imports: "import { useMemoryContext } from '@clarity-chat/react'",
    code: `const {
  memoryInfo,
  clearMemory,
  summarizeMemory,
  getRelevantContext,
} = useMemoryContext()`,
  },
  {
    label: '$(history) useConversationHistory',
    description: 'Conversation history management',
    detail: '🧠 Memory • Manage and persist conversation history',
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
})`,
  },

  // Streaming Hooks
  {
    label: '$(broadcast) useStreamingSSE',
    description: 'Server-sent events streaming',
    detail: '🌊 Streaming • Stream responses using Server-Sent Events',
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
})`,
  },
  {
    label: '$(plug) useStreamingWebSocket',
    description: 'WebSocket streaming',
    detail: '🌊 Streaming • Real-time bidirectional streaming via WebSocket',
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
})`,
  },

  // Token Optimization Hooks
  {
    label: '$(dashboard) useTokenBudgetMonitor',
    description: 'Token budget tracking',
    detail: '📊 Token Optimization • Monitor and optimize token usage to stay within budget',
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
})`,
  },
  {
    label: '$(zap) useTokenOptimizationEnhanced',
    description: 'Advanced token optimization',
    detail: '📊 Token Optimization • Advanced optimization strategies for token efficiency',
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
})`,
  },
  {
    label: '$(symbol-numeric) useTokenCounter',
    description: 'Token counting utility',
    detail: '📊 Token Optimization • Count tokens for messages and text',
    value: 'useTokenCounter',
    category: 'Token Optimization',
    imports: "import { useTokenCounter } from '@clarity-chat/react'",
    code: `const {
  countTokens,
  estimateCost,
  tokenize,
} = useTokenCounter({
  model: '\${1|gpt-4-turbo,claude-3-opus,gemini-pro|}',
})`,
  },

  // UI State Hooks
  {
    label: '$(symbol-boolean) useLoadingState',
    description: 'Loading state management',
    detail: '🎨 UI State • Manage loading states with timeout and error handling',
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
})`,
  },
  {
    label: '$(error) useErrorHandler',
    description: 'Error handling hook',
    detail: '🎨 UI State • Centralized error handling with retry logic',
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
})`,
  },
  {
    label: '$(arrow-down) useAutoScroll',
    description: 'Auto-scroll behavior',
    detail: '🎨 UI State • Automatically scroll to new messages',
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
})`,
  },

  // Provider Integration Hooks
  {
    label: '$(cloud) useProviderConfig',
    description: 'Provider configuration',
    detail: '🔌 Provider • Configure AI provider settings',
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
})`,
  },
  {
    label: '$(symbol-interface) useMultiProvider',
    description: 'Multi-provider support',
    detail: '🔌 Provider • Use multiple AI providers in one chat',
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
})`,
  },

  // Utility Hooks
  {
    label: '$(file-text) useMessageParser',
    description: 'Parse message content',
    detail: '🔧 Utilities • Parse and transform message content',
    value: 'useMessageParser',
    category: 'Utilities',
    imports: "import { useMessageParser } from '@clarity-chat/react'",
    code: `const {
  parseMessage,
  extractCode,
  extractLinks,
  formatMessage,
} = useMessageParser()`,
  },
  {
    label: '$(keyboard) useKeyboardShortcuts',
    description: 'Keyboard shortcuts',
    detail: '🔧 Utilities • Add keyboard shortcuts to chat',
    value: 'useKeyboardShortcuts',
    category: 'Utilities',
    imports: "import { useKeyboardShortcuts } from '@clarity-chat/react'",
    code: `useKeyboardShortcuts({
  'mod+enter': handleSubmit,
  'escape': handleCancel,
  'mod+k': clearChat,
})`,
  },
  {
    label: '$(mic) useVoiceInput',
    description: 'Voice input support',
    detail: '🔧 Utilities • Enable voice-to-text input',
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
})`,
  },
]

const RECENT_KEY = 'clarity-chat.recentHooks'
const PINNED_KEY = 'clarity-chat.pinnedHooks'

export async function addHookCommand(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found')
    return
  }

  // Get recent and pinned hooks
  const recentNames = context.globalState.get<string[]>(RECENT_KEY, [])
  const pinnedNames = context.globalState.get<string[]>(PINNED_KEY, [])

  // Build items with pinned and recent at top
  const buildItems = (): HookItem[] => {
    const items: HookItem[] = []

    // Add pinned hooks
    const pinnedItems = HOOKS.filter((h) => pinnedNames.includes(h.value))
    if (pinnedItems.length > 0) {
      items.push({
        label: 'Pinned',
        kind: vscode.QuickPickItemKind.Separator,
      } as HookItem)
      items.push(
        ...pinnedItems.map((h) => ({
          ...h,
          label: `$(pinned) ${stripIconPrefix(h.label)}`,
          description: `⭐ ${h.description}`,
          isPinned: true,
        }))
      )
    }

    // Add recent hooks (excluding pinned)
    const recentItems = HOOKS.filter(
      (h) => recentNames.includes(h.value) && !pinnedNames.includes(h.value)
    )
      .sort((a, b) => recentNames.indexOf(a.value) - recentNames.indexOf(b.value))
      .slice(0, 3)

    if (recentItems.length > 0) {
      items.push({
        label: 'Recently Used',
        kind: vscode.QuickPickItemKind.Separator,
      } as HookItem)
      items.push(
        ...recentItems.map((h) => ({
          ...h,
          label: `$(history) ${stripIconPrefix(h.label)}`,
          isRecent: true,
        }))
      )
    }

    // Add all hooks by category
    const categories = [...new Set(HOOKS.map((h) => h.category))]
    for (const category of categories) {
      const categoryInfo = CATEGORY_INFO[category] || {
        icon: '📦',
        description: '',
      }
      items.push({
        label: `${categoryInfo.icon} ${category}`,
        kind: vscode.QuickPickItemKind.Separator,
      } as HookItem)
      items.push(...HOOKS.filter((h) => h.category === category))
    }

    return items
  }

  // Create the quick pick
  const picker = vscode.window.createQuickPick<HookItem>()
  picker.items = buildItems()
  picker.placeholder = 'Search hooks... (type to filter)'
  picker.title = 'Add Clarity Chat Hook'
  picker.matchOnDescription = true
  picker.matchOnDetail = true

  // Add action buttons
  picker.buttons = [
    {
      iconPath: new vscode.ThemeIcon('book'),
      tooltip: 'Open Documentation',
    },
  ]

  // Dispose picker when hidden to prevent memory leaks
  picker.onDidHide(() => picker.dispose())

  picker.onDidTriggerButton((button) => {
    if (button.tooltip === 'Open Documentation') {
      vscode.commands.executeCommand('clarity-chat.openDocs')
    }
    picker.hide()
  })

  picker.onDidAccept(async () => {
    const selection = picker.selectedItems[0]
    if (!selection || selection.kind === vscode.QuickPickItemKind.Separator) {
      return
    }

    // Find the original hook
    const originalHook = HOOKS.find((h) => h.code === selection.code)
    if (!originalHook) return

    // Update recent hooks
    const updated = [
      originalHook.value,
      ...recentNames.filter((n) => n !== originalHook.value),
    ].slice(0, 10)
    context.globalState.update(RECENT_KEY, updated)

    picker.hide()

    // Check if import already exists
    const document = editor.document
    const text = document.getText()
    const hasImport =
      text.includes(originalHook.value) && text.includes('@clarity-chat/react')

    // If import doesn't exist, ask if user wants to add it
    if (!hasImport) {
      const addImport = await vscode.window.showQuickPick(
        [
          {
            label: '$(add) Yes, add import',
            description: 'Add import statement at the top',
            value: 'add',
          },
          {
            label: '$(clippy) Copy to clipboard',
            description: 'Copy import statement to clipboard',
            value: 'copy',
          },
          {
            label: '$(x) No, skip import',
            description: 'Insert hook only',
            value: 'skip',
          },
        ],
        {
          placeHolder: `Add import for ${originalHook.value}?`,
          title: 'Import Handling',
        }
      )

      if (!addImport) return

      if (addImport.value === 'add') {
        await addImportToFile(editor, originalHook.imports)
      } else if (addImport.value === 'copy') {
        await vscode.env.clipboard.writeText(originalHook.imports)
        vscode.window.showInformationMessage('Import copied to clipboard')
      }
    }

    // Insert the hook as a snippet
    const snippet = new vscode.SnippetString(originalHook.code)
    await editor.insertSnippet(snippet)

    // Show success message with actions
    const action = await vscode.window.showInformationMessage(
      `✓ Added ${originalHook.value}`,
      'Pin Hook',
      'View Docs'
    )

    if (action === 'Pin Hook') {
      const newPinned = [
        ...new Set([...pinnedNames, originalHook.value]),
      ].slice(0, 5)
      context.globalState.update(PINNED_KEY, newPinned)
      vscode.window.showInformationMessage(
        `${originalHook.value} pinned for quick access!`
      )
    } else if (action === 'View Docs') {
      vscode.env.openExternal(
        vscode.Uri.parse(
          `https://docs.claritychat.dev/hooks/${originalHook.value.toLowerCase()}`
        )
      )
    }
  })

  picker.show()
}
