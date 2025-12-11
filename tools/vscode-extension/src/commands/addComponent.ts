/**
 * Add Component Command
 * Provides a visual picker to insert Clarity Chat components
 */

import * as vscode from 'vscode'

interface ComponentItem extends vscode.QuickPickItem {
  value: string
  category: string
  code: string
  imports: string
}

const COMPONENTS: ComponentItem[] = [
  // Top-Level Components
  {
    label: '$(symbol-class) ClarityChat',
    description: 'Complete drop-in chat UI',
    detail: 'Full-featured chat interface with all bells and whistles',
    value: 'ClarityChat',
    category: 'Top-Level',
    imports: "import { ClarityChat } from '@clarity-chat/react'",
    code: `<ClarityChat
  api="\${1:/api/chat}"
  placeholder="\${2:Type your message...}"
  showTimestamp
  enableMarkdown
/>`
  },
  {
    label: '$(symbol-class) ClarityChatPresets',
    description: 'Pre-configured chat variants',
    detail: 'Ready-to-use chat presets for common use cases',
    value: 'ClarityChatPresets',
    category: 'Top-Level',
    imports: "import { ClarityChatPresets } from '@clarity-chat/react'",
    code: `<ClarityChatPresets
  variant="\${1|minimal,standard,enterprise|}"
  api="\${2:/api/chat}"
/>`
  },

  // Building Blocks
  {
    label: '$(window) ChatWindow',
    description: 'Chat container component',
    detail: 'Scrollable container with proper chat layout',
    value: 'ChatWindow',
    category: 'Building Blocks',
    imports: "import { ChatWindow } from '@clarity-chat/react'",
    code: `<ChatWindow className="\${1:h-screen}">
  \${2:{children\\}}
</ChatWindow>`
  },
  {
    label: '$(list-ordered) MessageList',
    description: 'Message display list',
    detail: 'Renders messages with virtualization for performance',
    value: 'MessageList',
    category: 'Building Blocks',
    imports: "import { MessageList } from '@clarity-chat/react'",
    code: `<MessageList
  messages={messages}
  isLoading={isLoading}
  showTimestamp
/>`
  },
  {
    label: '$(edit) ChatInput',
    description: 'Chat input with submit',
    detail: 'Full-featured input with file upload and voice support',
    value: 'ChatInput',
    category: 'Building Blocks',
    imports: "import { ChatInput } from '@clarity-chat/react'",
    code: `<ChatInput
  value={input}
  onChange={handleInputChange}
  onSubmit={handleSubmit}
  isLoading={isLoading}
  placeholder="\${1:Type a message...}"
/>`
  },
  {
    label: '$(comment) MessageBubble',
    description: 'Individual message display',
    detail: 'Styled message bubble with role-based theming',
    value: 'MessageBubble',
    category: 'Building Blocks',
    imports: "import { MessageBubble } from '@clarity-chat/react'",
    code: `<MessageBubble
  message={message}
  variant="\${1|default,compact,minimal|}"
  showTimestamp
/>`
  },

  // Streaming Components
  {
    label: '$(pulse) StreamingMessage',
    description: 'Real-time text streaming',
    detail: 'Displays streaming text with typing cursor',
    value: 'StreamingMessage',
    category: 'Streaming',
    imports: "import { StreamingMessage } from '@clarity-chat/react'",
    code: `<StreamingMessage
  content={content}
  isStreaming={isStreaming}
  showCursor
/>`
  },
  {
    label: '$(loading~spin) ThinkingIndicator',
    description: 'AI thinking animation',
    detail: 'Visual indicator while AI processes request',
    value: 'ThinkingIndicator',
    category: 'Streaming',
    imports: "import { ThinkingIndicator } from '@clarity-chat/react'",
    code: `<ThinkingIndicator
  variant="\${1|dots,pulse,spinner|}"
  text="\${2:AI is thinking...}"
/>`
  },
  {
    label: '$(keyboard) TypingIndicator',
    description: 'User typing indicator',
    detail: 'Shows when user or AI is typing',
    value: 'TypingIndicator',
    category: 'Streaming',
    imports: "import { TypingIndicator } from '@clarity-chat/react'",
    code: `<TypingIndicator isTyping={isTyping} />`
  },

  // Providers
  {
    label: '$(database) MemoryProvider',
    description: 'Memory context provider',
    detail: 'Enables conversation memory for child components',
    value: 'MemoryProvider',
    category: 'Providers',
    imports: "import { MemoryProvider } from '@clarity-chat/react'",
    code: `<MemoryProvider
  strategy="\${1|sliding-window,summarization,hybrid|}"
  maxTokens={2000}
>
  \${2:{children\\}}
</MemoryProvider>`
  },
  {
    label: '$(symbol-namespace) ClarityChatProvider',
    description: 'Main context provider',
    detail: 'Root provider for Clarity Chat context',
    value: 'ClarityChatProvider',
    category: 'Providers',
    imports: "import { ClarityChatProvider } from '@clarity-chat/react'",
    code: `<ClarityChatProvider config={{ api: '\${1:/api/chat}' }}>
  \${2:{children\\}}
</ClarityChatProvider>`
  },

  // Token & Optimization
  {
    label: '$(dashboard) TokenBudgetDisplay',
    description: 'Token usage visualization',
    detail: 'Shows token consumption with visual progress',
    value: 'TokenBudgetDisplay',
    category: 'Token Management',
    imports: "import { TokenBudgetDisplay } from '@clarity-chat/react'",
    code: `<TokenBudgetDisplay
  stats={tokenStats}
  maxTokens={4000}
  showWarning
/>`
  },
  {
    label: '$(graph) TokenCounter',
    description: 'Token count display',
    detail: 'Displays current token count',
    value: 'TokenCounter',
    category: 'Token Management',
    imports: "import { TokenCounter } from '@clarity-chat/react'",
    code: `<TokenCounter
  count={tokenCount}
  maxTokens={4000}
/>`
  },

  // UI Utilities
  {
    label: '$(markdown) MarkdownRenderer',
    description: 'Markdown content display',
    detail: 'Renders markdown with syntax highlighting',
    value: 'MarkdownRenderer',
    category: 'Utilities',
    imports: "import { MarkdownRenderer } from '@clarity-chat/react'",
    code: `<MarkdownRenderer
  content={content}
  enableCodeHighlight
/>`
  },
  {
    label: '$(code) CodeBlock',
    description: 'Syntax highlighted code',
    detail: 'Code block with copy button and language detection',
    value: 'CodeBlock',
    category: 'Utilities',
    imports: "import { CodeBlock } from '@clarity-chat/react'",
    code: `<CodeBlock
  code={code}
  language="\${1:typescript}"
  showLineNumbers
  enableCopy
/>`
  },
  {
    label: '$(error) ErrorBoundary',
    description: 'Error boundary wrapper',
    detail: 'Catches and displays errors gracefully',
    value: 'ErrorBoundary',
    category: 'Utilities',
    imports: "import { ErrorBoundary } from '@clarity-chat/react'",
    code: `<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={handleError}
>
  \${1:{children\\}}
</ErrorBoundary>`
  },

  // Model Selection
  {
    label: '$(server) ModelSelector',
    description: 'AI model dropdown',
    detail: 'Select from available AI models',
    value: 'ModelSelector',
    category: 'Configuration',
    imports: "import { ModelSelector } from '@clarity-chat/react'",
    code: `<ModelSelector
  models={[\${1:'gpt-4-turbo', 'claude-3-opus'}]}
  value={selectedModel}
  onChange={setSelectedModel}
/>`
  },
  {
    label: '$(settings-gear) SettingsPanel',
    description: 'Chat settings panel',
    detail: 'Configurable settings for chat behavior',
    value: 'SettingsPanel',
    category: 'Configuration',
    imports: "import { SettingsPanel } from '@clarity-chat/react'",
    code: `<SettingsPanel
  settings={settings}
  onChange={handleSettingsChange}
/>`
  }
]

export async function addComponentCommand(_context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found')
    return
  }

  // Group components by category
  const categories = [...new Set(COMPONENTS.map(c => c.category))]

  // Show category picker first
  const categoryPick = await vscode.window.showQuickPick(
    [
      { label: 'All Components', description: 'Show all available components', value: 'all' },
      ...categories.map(cat => ({
        label: `$(folder) ${cat}`,
        description: `${COMPONENTS.filter(c => c.category === cat).length} components`,
        value: cat
      }))
    ],
    {
      placeHolder: 'Select component category',
      title: 'Clarity Chat Components'
    }
  )

  if (!categoryPick) return

  // Filter components by category
  const filteredComponents = categoryPick.value === 'all'
    ? COMPONENTS
    : COMPONENTS.filter(c => c.category === categoryPick.value)

  // Show component picker
  const selection = await vscode.window.showQuickPick(
    filteredComponents.map(comp => ({
      ...comp,
      buttons: [
        {
          iconPath: new vscode.ThemeIcon('book'),
          tooltip: 'View Documentation'
        }
      ]
    })),
    {
      placeHolder: 'Select a component to add',
      title: 'Clarity Chat Components',
      matchOnDescription: true,
      matchOnDetail: true
    }
  ) as ComponentItem | undefined

  if (!selection) return

  // Check if import already exists
  const document = editor.document
  const text = document.getText()
  const hasImport = text.includes(selection.value) && text.includes('@clarity-chat/react')

  // Prepare the code to insert
  const insertText = selection.code

  // If import doesn't exist, ask if user wants to add it
  if (!hasImport) {
    const addImport = await vscode.window.showQuickPick(
      [
        { label: 'Yes', description: 'Add import statement at the top', value: true },
        { label: 'No', description: 'Insert component only', value: false }
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
        // Add import
        editBuilder.insert(importLocation, selection.imports + '\n')
      })
    }
  }

  // Insert the component as a snippet
  const snippet = new vscode.SnippetString(insertText)
  await editor.insertSnippet(snippet)

  // Show success message
  vscode.window.showInformationMessage(
    `Added ${selection.value} component`,
    'View Docs'
  ).then(choice => {
    if (choice === 'View Docs') {
      vscode.env.openExternal(
        vscode.Uri.parse(`https://docs.claritychat.dev/components/${selection.value.toLowerCase()}`)
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
      // Found non-import, non-comment line after imports
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
