/**
 * Add Component Command
 * An enhanced, delightful experience for adding Clarity Chat components
 */

import * as vscode from 'vscode'
import { addImportToFile, stripIconPrefix } from '../utils/import-utils'

interface ComponentItem extends vscode.QuickPickItem {
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
  'Top-Level': { icon: '🚀', description: 'Complete, drop-in solutions' },
  'Building Blocks': { icon: '🧱', description: 'Core chat components' },
  Streaming: { icon: '🌊', description: 'Real-time content display' },
  Providers: { icon: '⚙️', description: 'Context and state management' },
  'Token Management': { icon: '📊', description: 'Token usage tracking' },
  Utilities: { icon: '🔧', description: 'Helper components' },
  Configuration: { icon: '⚡', description: 'Settings and configuration' },
}

const COMPONENTS: ComponentItem[] = [
  // Top-Level Components
  {
    label: '$(comment-discussion) ClarityChat',
    description: 'Complete drop-in chat UI',
    detail: '🚀 Top-Level • Full-featured chat interface with streaming, memory, and markdown',
    value: 'ClarityChat',
    category: 'Top-Level',
    imports: "import { ClarityChat } from '@clarity-chat/react'",
    code: `<ClarityChat
  api="\${1:/api/chat}"
  placeholder="\${2:Type your message...}"
  showTimestamp
  enableMarkdown
/>`,
  },
  {
    label: '$(list-selection) ClarityChatPresets',
    description: 'Pre-configured chat variants',
    detail: '🚀 Top-Level • Ready-to-use presets: minimal, standard, enterprise',
    value: 'ClarityChatPresets',
    category: 'Top-Level',
    imports: "import { ClarityChatPresets } from '@clarity-chat/react'",
    code: `<ClarityChatPresets
  variant="\${1|minimal,standard,enterprise|}"
  api="\${2:/api/chat}"
/>`,
  },

  // Building Blocks
  {
    label: '$(window) ChatWindow',
    description: 'Chat container component',
    detail: '🧱 Building Blocks • Scrollable container with proper chat layout',
    value: 'ChatWindow',
    category: 'Building Blocks',
    imports: "import { ChatWindow } from '@clarity-chat/react'",
    code: `<ChatWindow className="\${1:h-screen}">
  \${2:{children\\}}
</ChatWindow>`,
  },
  {
    label: '$(list-ordered) MessageList',
    description: 'Message display list',
    detail: '🧱 Building Blocks • Renders messages with virtualization for performance',
    value: 'MessageList',
    category: 'Building Blocks',
    imports: "import { MessageList } from '@clarity-chat/react'",
    code: `<MessageList
  messages={messages}
  isLoading={isLoading}
  showTimestamp
/>`,
  },
  {
    label: '$(edit) ChatInput',
    description: 'Chat input with submit',
    detail: '🧱 Building Blocks • Full-featured input with file upload and voice support',
    value: 'ChatInput',
    category: 'Building Blocks',
    imports: "import { ChatInput } from '@clarity-chat/react'",
    code: `<ChatInput
  value={input}
  onChange={handleInputChange}
  onSubmit={handleSubmit}
  isLoading={isLoading}
  placeholder="\${1:Type a message...}"
/>`,
  },
  {
    label: '$(comment) MessageBubble',
    description: 'Individual message display',
    detail: '🧱 Building Blocks • Styled message bubble with role-based theming',
    value: 'MessageBubble',
    category: 'Building Blocks',
    imports: "import { MessageBubble } from '@clarity-chat/react'",
    code: `<MessageBubble
  message={message}
  variant="\${1|default,compact,minimal|}"
  showTimestamp
/>`,
  },

  // Streaming Components
  {
    label: '$(pulse) StreamingMessage',
    description: 'Real-time text streaming',
    detail: '🌊 Streaming • Displays streaming text with typing cursor',
    value: 'StreamingMessage',
    category: 'Streaming',
    imports: "import { StreamingMessage } from '@clarity-chat/react'",
    code: `<StreamingMessage
  content={content}
  isStreaming={isStreaming}
  showCursor
/>`,
  },
  {
    label: '$(loading~spin) ThinkingIndicator',
    description: 'AI thinking animation',
    detail: '🌊 Streaming • Visual indicator while AI processes request',
    value: 'ThinkingIndicator',
    category: 'Streaming',
    imports: "import { ThinkingIndicator } from '@clarity-chat/react'",
    code: `<ThinkingIndicator
  variant="\${1|dots,pulse,spinner|}"
  text="\${2:AI is thinking...}"
/>`,
  },
  {
    label: '$(keyboard) TypingIndicator',
    description: 'User typing indicator',
    detail: '🌊 Streaming • Shows when user or AI is typing',
    value: 'TypingIndicator',
    category: 'Streaming',
    imports: "import { TypingIndicator } from '@clarity-chat/react'",
    code: `<TypingIndicator isTyping={isTyping} />`,
  },

  // Providers
  {
    label: '$(database) MemoryProvider',
    description: 'Memory context provider',
    detail: '⚙️ Providers • Enables conversation memory for child components',
    value: 'MemoryProvider',
    category: 'Providers',
    imports: "import { MemoryProvider } from '@clarity-chat/react'",
    code: `<MemoryProvider
  strategy="\${1|sliding-window,summarization,hybrid|}"
  maxTokens={2000}
>
  \${2:{children\\}}
</MemoryProvider>`,
  },
  {
    label: '$(symbol-namespace) ClarityChatProvider',
    description: 'Main context provider',
    detail: '⚙️ Providers • Root provider for Clarity Chat context',
    value: 'ClarityChatProvider',
    category: 'Providers',
    imports: "import { ClarityChatProvider } from '@clarity-chat/react'",
    code: `<ClarityChatProvider config={{ api: '\${1:/api/chat}' }}>
  \${2:{children\\}}
</ClarityChatProvider>`,
  },

  // Token & Optimization
  {
    label: '$(dashboard) TokenBudgetDisplay',
    description: 'Token usage visualization',
    detail: '📊 Token Management • Shows token consumption with visual progress',
    value: 'TokenBudgetDisplay',
    category: 'Token Management',
    imports: "import { TokenBudgetDisplay } from '@clarity-chat/react'",
    code: `<TokenBudgetDisplay
  stats={tokenStats}
  maxTokens={4000}
  showWarning
/>`,
  },
  {
    label: '$(graph) TokenCounter',
    description: 'Token count display',
    detail: '📊 Token Management • Displays current token count',
    value: 'TokenCounter',
    category: 'Token Management',
    imports: "import { TokenCounter } from '@clarity-chat/react'",
    code: `<TokenCounter
  count={tokenCount}
  maxTokens={4000}
/>`,
  },

  // UI Utilities
  {
    label: '$(markdown) MarkdownRenderer',
    description: 'Markdown content display',
    detail: '🔧 Utilities • Renders markdown with syntax highlighting',
    value: 'MarkdownRenderer',
    category: 'Utilities',
    imports: "import { MarkdownRenderer } from '@clarity-chat/react'",
    code: `<MarkdownRenderer
  content={content}
  enableCodeHighlight
/>`,
  },
  {
    label: '$(code) CodeBlock',
    description: 'Syntax highlighted code',
    detail: '🔧 Utilities • Code block with copy button and language detection',
    value: 'CodeBlock',
    category: 'Utilities',
    imports: "import { CodeBlock } from '@clarity-chat/react'",
    code: `<CodeBlock
  code={code}
  language="\${1:typescript}"
  showLineNumbers
  enableCopy
/>`,
  },
  {
    label: '$(error) ErrorBoundary',
    description: 'Error boundary wrapper',
    detail: '🔧 Utilities • Catches and displays errors gracefully',
    value: 'ErrorBoundary',
    category: 'Utilities',
    imports: "import { ErrorBoundary } from '@clarity-chat/react'",
    code: `<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={handleError}
>
  \${1:{children\\}}
</ErrorBoundary>`,
  },

  // Model Selection
  {
    label: '$(server) ModelSelector',
    description: 'AI model dropdown',
    detail: '⚡ Configuration • Select from available AI models',
    value: 'ModelSelector',
    category: 'Configuration',
    imports: "import { ModelSelector } from '@clarity-chat/react'",
    code: `<ModelSelector
  models={[\${1:'gpt-4-turbo', 'claude-3-opus'}]}
  value={selectedModel}
  onChange={setSelectedModel}
/>`,
  },
  {
    label: '$(settings-gear) SettingsPanel',
    description: 'Chat settings panel',
    detail: '⚡ Configuration • Configurable settings for chat behavior',
    value: 'SettingsPanel',
    category: 'Configuration',
    imports: "import { SettingsPanel } from '@clarity-chat/react'",
    code: `<SettingsPanel
  settings={settings}
  onChange={handleSettingsChange}
/>`,
  },
]

const RECENT_KEY = 'clarity-chat.recentComponents'
const PINNED_KEY = 'clarity-chat.pinnedComponents'

export async function addComponentCommand(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found')
    return
  }

  // Get recent and pinned components
  const recentNames = context.globalState.get<string[]>(RECENT_KEY, [])
  const pinnedNames = context.globalState.get<string[]>(PINNED_KEY, [])

  // Build items with pinned and recent at top
  const buildItems = (): ComponentItem[] => {
    const items: ComponentItem[] = []

    // Add pinned components
    const pinnedItems = COMPONENTS.filter((c) => pinnedNames.includes(c.value))
    if (pinnedItems.length > 0) {
      items.push({
        label: 'Pinned',
        kind: vscode.QuickPickItemKind.Separator,
      } as ComponentItem)
      items.push(
        ...pinnedItems.map((c) => ({
          ...c,
          label: `$(pinned) ${stripIconPrefix(c.label)}`,
          description: `⭐ ${c.description}`,
          isPinned: true,
        }))
      )
    }

    // Add recent components (excluding pinned)
    const recentItems = COMPONENTS.filter(
      (c) => recentNames.includes(c.value) && !pinnedNames.includes(c.value)
    )
      .sort(
        (a, b) => recentNames.indexOf(a.value) - recentNames.indexOf(b.value)
      )
      .slice(0, 3)

    if (recentItems.length > 0) {
      items.push({
        label: 'Recently Used',
        kind: vscode.QuickPickItemKind.Separator,
      } as ComponentItem)
      items.push(
        ...recentItems.map((c) => ({
          ...c,
          label: `$(history) ${stripIconPrefix(c.label)}`,
          isRecent: true,
        }))
      )
    }

    // Add all components by category
    const categories = [...new Set(COMPONENTS.map((c) => c.category))]
    for (const category of categories) {
      const categoryInfo = CATEGORY_INFO[category] || {
        icon: '📦',
        description: '',
      }
      items.push({
        label: `${categoryInfo.icon} ${category}`,
        kind: vscode.QuickPickItemKind.Separator,
      } as ComponentItem)
      items.push(...COMPONENTS.filter((c) => c.category === category))
    }

    return items
  }

  // Create the quick pick
  const picker = vscode.window.createQuickPick<ComponentItem>()
  picker.items = buildItems()
  picker.placeholder = 'Search components... (type to filter)'
  picker.title = 'Add Clarity Chat Component'
  picker.matchOnDescription = true
  picker.matchOnDetail = true

  // Add action buttons
  picker.buttons = [
    {
      iconPath: new vscode.ThemeIcon('preview'),
      tooltip: 'Open Component Gallery',
    },
    {
      iconPath: new vscode.ThemeIcon('book'),
      tooltip: 'Open Documentation',
    },
  ]

  picker.onDidTriggerButton((button) => {
    if (button.tooltip === 'Open Component Gallery') {
      vscode.commands.executeCommand('clarity-chat.showPreview')
    } else if (button.tooltip === 'Open Documentation') {
      vscode.commands.executeCommand('clarity-chat.openDocs')
    }
    picker.hide()
  })

  picker.onDidAccept(async () => {
    const selection = picker.selectedItems[0]
    if (!selection || selection.kind === vscode.QuickPickItemKind.Separator) {
      return
    }

    // Find the original component
    const originalComponent = COMPONENTS.find((c) => c.code === selection.code)
    if (!originalComponent) return

    // Update recent components
    const updated = [
      originalComponent.value,
      ...recentNames.filter((n) => n !== originalComponent.value),
    ].slice(0, 10)
    context.globalState.update(RECENT_KEY, updated)

    picker.hide()

    // Check if import already exists
    const document = editor.document
    const text = document.getText()
    const hasImport =
      text.includes(originalComponent.value) &&
      text.includes('@clarity-chat/react')

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
            description: 'Insert component only',
            value: 'skip',
          },
        ],
        {
          placeHolder: `Add import for ${originalComponent.value}?`,
          title: 'Import Handling',
        }
      )

      if (!addImport) return

      if (addImport.value === 'add') {
        await addImportToFile(editor, originalComponent.imports)
      } else if (addImport.value === 'copy') {
        await vscode.env.clipboard.writeText(originalComponent.imports)
        vscode.window.showInformationMessage('Import copied to clipboard')
      }
    }

    // Insert the component as a snippet
    const snippet = new vscode.SnippetString(originalComponent.code)
    await editor.insertSnippet(snippet)

    // Show success message with actions
    const action = await vscode.window.showInformationMessage(
      `✓ Added ${originalComponent.value}`,
      'Pin Component',
      'View Docs'
    )

    if (action === 'Pin Component') {
      const newPinned = [
        ...new Set([...pinnedNames, originalComponent.value]),
      ].slice(0, 5)
      context.globalState.update(PINNED_KEY, newPinned)
      vscode.window.showInformationMessage(
        `${originalComponent.value} pinned for quick access!`
      )
    } else if (action === 'View Docs') {
      vscode.env.openExternal(
        vscode.Uri.parse(
          `https://docs.claritychat.dev/components/${originalComponent.value.toLowerCase()}`
        )
      )
    }
  })

  picker.show()
}
