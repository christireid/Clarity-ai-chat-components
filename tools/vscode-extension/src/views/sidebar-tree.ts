/**
 * Clarity Chat Sidebar Tree View
 * Provides quick access to components, hooks, and tools in the Activity Bar
 */

import * as vscode from 'vscode'

type TreeItemType =
  | 'category'
  | 'component'
  | 'hook'
  | 'tool'
  | 'snippet'
  | 'help'

interface ClarityTreeItem {
  label: string
  type: TreeItemType
  icon?: string
  command?: string
  description?: string
  children?: ClarityTreeItem[]
  tooltip?: string
}

const TREE_DATA: ClarityTreeItem[] = [
  {
    label: 'Quick Actions',
    type: 'category',
    icon: 'zap',
    children: [
      {
        label: 'Add Component',
        type: 'tool',
        icon: 'symbol-class',
        command: 'clarity-chat.addComponent',
        description: 'Insert UI component',
        tooltip: 'Insert a Clarity Chat component into your code',
      },
      {
        label: 'Add Hook',
        type: 'tool',
        icon: 'symbol-method',
        command: 'clarity-chat.addHook',
        description: 'Insert React hook',
        tooltip: 'Insert a Clarity Chat hook into your code',
      },
      {
        label: 'Create API Route',
        type: 'tool',
        icon: 'server-environment',
        command: 'clarity-chat.createApiRoute',
        description: 'Generate endpoint',
        tooltip: 'Generate a streaming API route for your provider',
      },
      {
        label: 'Component Preview',
        type: 'tool',
        icon: 'preview',
        command: 'clarity-chat.showPreview',
        description: 'Live gallery',
        tooltip: 'Open the interactive component preview gallery',
      },
    ],
  },
  {
    label: 'Components',
    type: 'category',
    icon: 'symbol-class',
    children: [
      {
        label: 'Top-Level',
        type: 'category',
        icon: 'layers',
        children: [
          {
            label: 'ClarityChat',
            type: 'component',
            icon: 'comment-discussion',
            description: 'Complete chat UI',
            tooltip:
              'Full-featured chat interface with streaming, memory, and markdown support',
          },
          {
            label: 'ClarityChatPresets',
            type: 'component',
            icon: 'list-selection',
            description: 'Pre-configured variants',
            tooltip: 'Ready-to-use chat presets: minimal, standard, enterprise',
          },
        ],
      },
      {
        label: 'Building Blocks',
        type: 'category',
        icon: 'extensions',
        children: [
          {
            label: 'ChatWindow',
            type: 'component',
            icon: 'window',
            description: 'Container',
          },
          {
            label: 'MessageList',
            type: 'component',
            icon: 'list-ordered',
            description: 'Messages display',
          },
          {
            label: 'ChatInput',
            type: 'component',
            icon: 'edit',
            description: 'Input field',
          },
          {
            label: 'MessageBubble',
            type: 'component',
            icon: 'comment',
            description: 'Single message',
          },
        ],
      },
      {
        label: 'Streaming',
        type: 'category',
        icon: 'pulse',
        children: [
          {
            label: 'StreamingMessage',
            type: 'component',
            icon: 'pulse',
            description: 'Real-time text',
          },
          {
            label: 'ThinkingIndicator',
            type: 'component',
            icon: 'loading~spin',
            description: 'AI thinking',
          },
          {
            label: 'TypingIndicator',
            type: 'component',
            icon: 'keyboard',
            description: 'Typing dots',
          },
        ],
      },
      {
        label: 'Providers',
        type: 'category',
        icon: 'database',
        children: [
          {
            label: 'MemoryProvider',
            type: 'component',
            icon: 'database',
            description: 'Memory context',
          },
          {
            label: 'ClarityChatProvider',
            type: 'component',
            icon: 'symbol-namespace',
            description: 'Root provider',
          },
        ],
      },
      {
        label: 'Utilities',
        type: 'category',
        icon: 'tools',
        children: [
          {
            label: 'TokenBudgetDisplay',
            type: 'component',
            icon: 'dashboard',
            description: 'Token usage',
          },
          {
            label: 'MarkdownRenderer',
            type: 'component',
            icon: 'markdown',
            description: 'Render markdown',
          },
          {
            label: 'CodeBlock',
            type: 'component',
            icon: 'code',
            description: 'Syntax highlight',
          },
          {
            label: 'ErrorBoundary',
            type: 'component',
            icon: 'error',
            description: 'Error handler',
          },
        ],
      },
    ],
  },
  {
    label: 'Hooks',
    type: 'category',
    icon: 'symbol-method',
    children: [
      {
        label: 'Primary',
        type: 'category',
        icon: 'star',
        children: [
          {
            label: 'useClarityChat',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Full chat state',
          },
          {
            label: 'useChatEnhanced',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Composable chat',
          },
        ],
      },
      {
        label: 'Memory',
        type: 'category',
        icon: 'database',
        children: [
          {
            label: 'useMemoryContext',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Memory state',
          },
          {
            label: 'useConversationHistory',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Persist history',
          },
        ],
      },
      {
        label: 'Streaming',
        type: 'category',
        icon: 'broadcast',
        children: [
          {
            label: 'useStreamingSSE',
            type: 'hook',
            icon: 'symbol-method',
            description: 'SSE streaming',
          },
          {
            label: 'useStreamingWebSocket',
            type: 'hook',
            icon: 'symbol-method',
            description: 'WebSocket',
          },
        ],
      },
      {
        label: 'Token Optimization',
        type: 'category',
        icon: 'dashboard',
        children: [
          {
            label: 'useTokenBudgetMonitor',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Track usage',
          },
          {
            label: 'useTokenOptimizationEnhanced',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Optimize tokens',
          },
          {
            label: 'useTokenCounter',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Count tokens',
          },
        ],
      },
      {
        label: 'Utilities',
        type: 'category',
        icon: 'tools',
        children: [
          {
            label: 'useAutoScroll',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Auto scroll',
          },
          {
            label: 'useKeyboardShortcuts',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Shortcuts',
          },
          {
            label: 'useVoiceInput',
            type: 'hook',
            icon: 'symbol-method',
            description: 'Voice input',
          },
        ],
      },
    ],
  },
  {
    label: 'Snippets',
    type: 'category',
    icon: 'file-code',
    children: [
      {
        label: 'cc-chat',
        type: 'snippet',
        icon: 'file-code',
        description: 'Complete chat',
        tooltip: 'Full ClarityChat component with all options',
      },
      {
        label: 'cc-chat-memory',
        type: 'snippet',
        icon: 'file-code',
        description: 'Chat with memory',
        tooltip: 'ClarityChat wrapped in MemoryProvider',
      },
      {
        label: 'cc-useclaritychat',
        type: 'snippet',
        icon: 'file-code',
        description: 'Chat hook',
        tooltip: 'useClarityChat hook with full options',
      },
      {
        label: 'cc-api-openai',
        type: 'snippet',
        icon: 'file-code',
        description: 'OpenAI route',
        tooltip: 'Streaming API route for OpenAI',
      },
      {
        label: 'cc-api-anthropic',
        type: 'snippet',
        icon: 'file-code',
        description: 'Anthropic route',
        tooltip: 'Streaming API route for Anthropic',
      },
      {
        label: 'cc-page',
        type: 'snippet',
        icon: 'file-code',
        description: 'Complete page',
        tooltip: 'Full chat page with all imports',
      },
    ],
  },
  {
    label: 'Tools',
    type: 'category',
    icon: 'tools',
    children: [
      {
        label: 'Manage API Keys',
        type: 'tool',
        icon: 'key',
        command: 'clarity-chat.manageApiKeys',
        description: 'Secure storage',
        tooltip: 'Securely store and manage your AI provider API keys',
      },
      {
        label: 'Validate Setup',
        type: 'tool',
        icon: 'pass',
        command: 'clarity-chat.validateConfig',
        description: 'Check config',
        tooltip: 'Validate your Clarity Chat configuration',
      },
      {
        label: 'Convert from Vercel AI',
        type: 'tool',
        icon: 'sync',
        command: 'clarity-chat.convertToClarity',
        description: 'Migration',
        tooltip: 'Convert Vercel AI SDK code to Clarity Chat',
      },
      {
        label: 'Initialize Project',
        type: 'tool',
        icon: 'new-folder',
        command: 'clarity-chat.initProject',
        description: 'Setup project',
        tooltip: 'Initialize Clarity Chat in your project',
      },
    ],
  },
  {
    label: 'Help & Resources',
    type: 'category',
    icon: 'question',
    children: [
      {
        label: 'Documentation',
        type: 'help',
        icon: 'book',
        command: 'clarity-chat.openDocs',
        description: 'Official docs',
        tooltip: 'Open Clarity Chat documentation',
      },
      {
        label: 'Interactive Demos',
        type: 'help',
        icon: 'play-circle',
        command: 'clarity-chat.openStorybook',
        description: 'Storybook',
        tooltip: 'Open interactive Storybook demos',
      },
      {
        label: 'Browse Examples',
        type: 'help',
        icon: 'code',
        command: 'clarity-chat.showExamples',
        description: 'Code samples',
        tooltip: 'Browse example code and templates',
      },
      {
        label: 'Show Welcome',
        type: 'help',
        icon: 'home',
        command: 'clarity-chat.showWelcome',
        description: 'Getting started',
        tooltip: 'Show the welcome panel with quick start guide',
      },
    ],
  },
]

class ClarityTreeNode extends vscode.TreeItem {
  constructor(
    public readonly data: ClarityTreeItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(data.label, collapsibleState)

    this.description = data.description
    this.tooltip = data.tooltip || data.description || data.label

    // Set icon
    if (data.icon) {
      this.iconPath = new vscode.ThemeIcon(data.icon)
    }

    // Set command
    if (data.command) {
      this.command = {
        command: data.command,
        title: data.label,
        arguments: [],
      }
    }

    // Set context value for menus
    this.contextValue = data.type
  }
}

export class ClarityTreeDataProvider
  implements vscode.TreeDataProvider<ClarityTreeNode>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    ClarityTreeNode | undefined | null | void
  > = new vscode.EventEmitter<ClarityTreeNode | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<
    ClarityTreeNode | undefined | null | void
  > = this._onDidChangeTreeData.event

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: ClarityTreeNode): vscode.TreeItem {
    return element
  }

  getChildren(element?: ClarityTreeNode): Thenable<ClarityTreeNode[]> {
    if (!element) {
      // Root level
      return Promise.resolve(this.createNodes(TREE_DATA))
    }

    // Child level
    if (element.data.children) {
      return Promise.resolve(this.createNodes(element.data.children))
    }

    return Promise.resolve([])
  }

  private createNodes(items: ClarityTreeItem[]): ClarityTreeNode[] {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const collapsibleState = hasChildren
        ? item.type === 'category' &&
          ['Quick Actions', 'Help & Resources'].includes(item.label)
          ? vscode.TreeItemCollapsibleState.Expanded
          : vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None

      return new ClarityTreeNode(item, collapsibleState)
    })
  }

  getParent(_element: ClarityTreeNode): vscode.ProviderResult<ClarityTreeNode> {
    return null
  }
}
