/**
 * Clarity Chat VS Code Extension
 *
 * The ultimate VS Code extension for building AI chat applications.
 * Provides IntelliSense, code snippets, commands, and Copilot integration
 * for the Clarity Chat library.
 */

import * as vscode from 'vscode'
import { CompletionProvider } from './providers/completion'
import { HoverProvider } from './providers/hover'
import { CodeLensProvider } from './providers/codelens'
import { DiagnosticsProvider, QuickFixProvider } from './providers/diagnostics'
import { initProjectCommand } from './commands/init'
import { addProviderCommand } from './commands/add-provider'
import { validateConfigCommand } from './commands/validate'
import { showExamplesCommand } from './commands/examples'
import { addComponentCommand } from './commands/addComponent'
import { addHookCommand } from './commands/addHook'
import { createApiRouteCommand } from './commands/createApiRoute'
import { convertToClarityCommand } from './commands/convertToClarity'
import { openDocsCommand, openStorybookCommand } from './commands/openExternal'
import { PreviewPanel } from './views/preview-panel'
import { ApiKeyManager } from './views/api-key-manager'
import { registerChatParticipant } from './chatParticipant'
import { ClarityTreeDataProvider } from './views/sidebar-tree'
import { getNonce } from './utils/import-utils'

let statusBarItem: vscode.StatusBarItem
let outputChannel: vscode.OutputChannel

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel('Clarity Chat')
  outputChannel.appendLine('Clarity Chat extension is now active!')

  // Get configuration
  const config = vscode.workspace.getConfiguration('clarityChat')

  // Create and show status bar item
  statusBarItem = createStatusBarItem()
  context.subscriptions.push(statusBarItem)
  updateStatusBar('ready')

  // Register completion provider
  if (config.get('enableIntelliSense', true)) {
    const completionProvider = new CompletionProvider()

    const completionDisposable =
      vscode.languages.registerCompletionItemProvider(
        [
          { language: 'typescript', scheme: 'file' },
          { language: 'javascript', scheme: 'file' },
          { language: 'typescriptreact', scheme: 'file' },
          { language: 'javascriptreact', scheme: 'file' },
        ],
        completionProvider,
        '.',
        '"',
        "'",
        '<',
        ' '
      )

    context.subscriptions.push(completionDisposable)
  }

  // Register hover provider
  if (config.get('enableHoverDocs', true)) {
    const hoverProvider = new HoverProvider()
    const hoverDisposable = vscode.languages.registerHoverProvider(
      [
        { language: 'typescript', scheme: 'file' },
        { language: 'javascript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' },
      ],
      hoverProvider
    )
    context.subscriptions.push(hoverDisposable)
  }

  // Register CodeLens provider
  if (config.get('enableCodeLens', true)) {
    const codeLensProvider = new CodeLensProvider()
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
      [
        { language: 'typescript', scheme: 'file' },
        { language: 'javascript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' },
      ],
      codeLensProvider
    )
    context.subscriptions.push(codeLensDisposable)
  }

  // Register diagnostics provider
  const diagnosticsProvider = new DiagnosticsProvider()
  context.subscriptions.push(diagnosticsProvider)

  // Update diagnostics on document change
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      diagnosticsProvider.updateDiagnostics(event.document)
    },
    null,
    context.subscriptions
  )

  // Update diagnostics on document open
  vscode.workspace.onDidOpenTextDocument(
    (document) => {
      diagnosticsProvider.updateDiagnostics(document)
    },
    null,
    context.subscriptions
  )

  // Register quick fix provider
  if (config.get('enableCodeActions', true)) {
    const quickFixProvider = new QuickFixProvider()
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        [
          { language: 'typescript', scheme: 'file' },
          { language: 'javascript', scheme: 'file' },
          { language: 'typescriptreact', scheme: 'file' },
          { language: 'javascriptreact', scheme: 'file' },
        ],
        quickFixProvider,
        {
          providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
        }
      )
    )
  }

  // Register sidebar tree view
  const treeDataProvider = new ClarityTreeDataProvider(context)
  const treeView = vscode.window.createTreeView('clarityChat.explorer', {
    treeDataProvider,
    showCollapseAll: true,
  })
  context.subscriptions.push(treeView)

  // Register commands
  context.subscriptions.push(
    // New Clarity Chat specific commands
    vscode.commands.registerCommand('clarity-chat.addComponent', () => {
      updateStatusBar('working')
      addComponentCommand(context).finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand('clarity-chat.addHook', () => {
      updateStatusBar('working')
      addHookCommand(context).finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand(
      'clarity-chat.createApiRoute',
      (uri?: vscode.Uri) => {
        updateStatusBar('working')
        createApiRouteCommand(context, uri).finally(() =>
          updateStatusBar('ready')
        )
      }
    ),
    vscode.commands.registerCommand('clarity-chat.convertToClarity', () => {
      updateStatusBar('working')
      convertToClarityCommand().finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand('clarity-chat.openDocs', openDocsCommand),
    vscode.commands.registerCommand(
      'clarity-chat.openStorybook',
      openStorybookCommand
    ),

    // Existing commands
    vscode.commands.registerCommand('clarity-chat.initProject', () => {
      updateStatusBar('working')
      initProjectCommand().finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand('clarity-chat.addProvider', () => {
      updateStatusBar('working')
      addProviderCommand().finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand('clarity-chat.validateConfig', () => {
      updateStatusBar('working')
      validateConfigCommand().finally(() => updateStatusBar('ready'))
    }),
    vscode.commands.registerCommand(
      'clarity-chat.showExamples',
      showExamplesCommand
    ),
    vscode.commands.registerCommand('clarity-chat.showPreview', () => {
      PreviewPanel.createOrShow(context.extensionUri)
    }),
    vscode.commands.registerCommand('clarity-chat.manageApiKeys', () => {
      ApiKeyManager.createOrShow(context)
    }),

    // Quick access commands
    vscode.commands.registerCommand('clarity-chat.quickAction', () => {
      showQuickActions(context)
    }),
    vscode.commands.registerCommand('clarity-chat.showWelcome', () => {
      showWelcomePanel(context)
    }),
    vscode.commands.registerCommand('clarity-chat.refreshExplorer', () => {
      treeDataProvider.refresh()
    }),
    vscode.commands.registerCommand(
      'clarity-chat.insertSnippet',
      (snippetId: string) => {
        insertSnippetById(snippetId)
      }
    )
  )

  // Register Copilot chat participant (requires VS Code 1.90+)
  registerChatParticipant(context)

  // Show welcome message on first install
  const hasShownWelcome = context.globalState.get(
    'clarity-chat.hasShownWelcome',
    false
  )
  if (!hasShownWelcome) {
    showWelcomePanel(context)
    context.globalState.update('clarity-chat.hasShownWelcome', true)
  }

  // Track usage statistics
  trackExtensionActivation(context)

  // Configuration change listener
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('clarityChat')) {
      vscode.window
        .showInformationMessage(
          'Clarity Chat settings changed. Reload to apply?',
          'Reload',
          'Later'
        )
        .then((selection) => {
          if (selection === 'Reload') {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          }
        })
    }
  })

  // Log successful activation
  outputChannel.appendLine('All providers and commands registered successfully')
}

/**
 * Create status bar item with enhanced visuals
 */
function createStatusBarItem(): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  )
  item.command = 'clarity-chat.quickAction'
  item.tooltip = new vscode.MarkdownString(
    '**Clarity Chat**\n\nClick for quick actions',
    true
  )
  return item
}

/**
 * Update status bar state
 */
function updateStatusBar(state: 'ready' | 'working' | 'error' | 'success') {
  switch (state) {
    case 'ready':
      statusBarItem.text = '$(sparkle) Clarity'
      statusBarItem.backgroundColor = undefined
      break
    case 'working':
      statusBarItem.text = '$(sync~spin) Clarity'
      statusBarItem.backgroundColor = undefined
      break
    case 'error':
      statusBarItem.text = '$(error) Clarity'
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground'
      )
      break
    case 'success':
      statusBarItem.text = '$(check) Clarity'
      statusBarItem.backgroundColor = undefined
      setTimeout(() => updateStatusBar('ready'), 2000)
      break
  }
  statusBarItem.show()
}

/**
 * Show quick actions picker
 */
async function showQuickActions(context: vscode.ExtensionContext) {
  const recentlyUsed = context.globalState.get<string[]>(
    'clarity-chat.recentActions',
    []
  )

  interface QuickActionItem extends vscode.QuickPickItem {
    action: string
    category: 'recent' | 'components' | 'hooks' | 'tools' | 'help'
  }

  const quickActions: QuickActionItem[] = [
    // Recently used (dynamically populated)
    ...recentlyUsed.slice(0, 3).map((action) => ({
      label: `$(history) ${getActionLabel(action)}`,
      description: 'Recently used',
      action,
      category: 'recent' as const,
    })),

    // Separator
    ...(recentlyUsed.length > 0
      ? [
          {
            label: '',
            kind: vscode.QuickPickItemKind.Separator,
            action: '',
            category: 'components' as const,
          } as QuickActionItem,
        ]
      : []),

    // Components & Hooks
    {
      label: '$(symbol-class) Add Component',
      description: 'Insert a Clarity Chat component',
      detail: 'ClarityChat, ChatInput, MessageList, and more',
      action: 'clarity-chat.addComponent',
      category: 'components',
    },
    {
      label: '$(symbol-method) Add Hook',
      description: 'Insert a Clarity Chat hook',
      detail: 'useClarityChat, useMemoryContext, and more',
      action: 'clarity-chat.addHook',
      category: 'hooks',
    },

    // Tools
    {
      label: '$(server-environment) Create API Route',
      description: 'Generate streaming API endpoint',
      detail: 'OpenAI, Anthropic, Google AI support',
      action: 'clarity-chat.createApiRoute',
      category: 'tools',
    },
    {
      label: '$(key) Manage API Keys',
      description: 'Secure API key storage',
      action: 'clarity-chat.manageApiKeys',
      category: 'tools',
    },
    {
      label: '$(beaker) Component Preview',
      description: 'Live component gallery',
      action: 'clarity-chat.showPreview',
      category: 'tools',
    },
    {
      label: '$(sync) Convert from Vercel AI',
      description: 'Migrate existing code',
      action: 'clarity-chat.convertToClarity',
      category: 'tools',
    },
    {
      label: '$(pass) Validate Setup',
      description: 'Check configuration',
      action: 'clarity-chat.validateConfig',
      category: 'tools',
    },

    // Help
    {
      label: '$(book) Documentation',
      description: 'Open official docs',
      action: 'clarity-chat.openDocs',
      category: 'help',
    },
    {
      label: '$(play-circle) Interactive Demos',
      description: 'Open Storybook',
      action: 'clarity-chat.openStorybook',
      category: 'help',
    },
    {
      label: '$(code) Browse Examples',
      description: 'View code examples',
      action: 'clarity-chat.showExamples',
      category: 'help',
    },
  ]

  const picker = vscode.window.createQuickPick<QuickActionItem>()
  picker.items = quickActions.filter((item) => item.action !== '')
  picker.placeholder = 'What would you like to do?'
  picker.title = 'Clarity Chat Quick Actions'
  picker.matchOnDescription = true
  picker.matchOnDetail = true

  picker.onDidAccept(() => {
    const selected = picker.selectedItems[0]
    if (selected?.action) {
      // Track recently used
      const updated = [
        selected.action,
        ...recentlyUsed.filter((a) => a !== selected.action),
      ].slice(0, 5)
      context.globalState.update('clarity-chat.recentActions', updated)

      vscode.commands.executeCommand(selected.action)
    }
    picker.hide()
  })

  // Dispose picker when hidden to prevent memory leaks
  picker.onDidHide(() => picker.dispose())

  picker.show()
}

/**
 * Get label for an action command
 */
function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'clarity-chat.addComponent': 'Add Component',
    'clarity-chat.addHook': 'Add Hook',
    'clarity-chat.createApiRoute': 'Create API Route',
    'clarity-chat.manageApiKeys': 'Manage API Keys',
    'clarity-chat.showPreview': 'Component Preview',
    'clarity-chat.convertToClarity': 'Convert from Vercel AI',
    'clarity-chat.validateConfig': 'Validate Setup',
    'clarity-chat.openDocs': 'Documentation',
    'clarity-chat.openStorybook': 'Interactive Demos',
    'clarity-chat.showExamples': 'Browse Examples',
  }
  return labels[action] || action
}

/**
 * Show welcome panel with onboarding
 */
async function showWelcomePanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'clarityWelcome',
    'Welcome to Clarity Chat',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  )

  // Get version from extension manifest
  const extension = vscode.extensions.getExtension('code-and-clarity.clarity-chat')
  const version = extension?.packageJSON?.version || context.extension.packageJSON.version || '1.0.0'

  panel.webview.html = getWelcomeHtml(version)

  panel.webview.onDidReceiveMessage(async (message) => {
    switch (message.command) {
      case 'addComponent':
        vscode.commands.executeCommand('clarity-chat.addComponent')
        break
      case 'addHook':
        vscode.commands.executeCommand('clarity-chat.addHook')
        break
      case 'createApiRoute':
        vscode.commands.executeCommand('clarity-chat.createApiRoute')
        break
      case 'openDocs':
        vscode.commands.executeCommand('clarity-chat.openDocs')
        break
      case 'manageKeys':
        vscode.commands.executeCommand('clarity-chat.manageApiKeys')
        break
      case 'showExamples':
        vscode.commands.executeCommand('clarity-chat.showExamples')
        break
      case 'dismiss':
        panel.dispose()
        break
    }
  })
}

/**
 * Get welcome panel HTML
 * @param version - The extension version to display
 */
function getWelcomeHtml(version: string): string {
  const nonce = getNonce()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Welcome to Clarity Chat</title>
  <style>
    :root {
      --gradient-start: #6366f1;
      --gradient-end: #8b5cf6;
      --card-bg: rgba(255, 255, 255, 0.05);
      --card-border: rgba(255, 255, 255, 0.1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      line-height: 1.6;
      padding: 0;
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
      padding: 48px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.5;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .logo {
      font-size: 48px;
      margin-bottom: 16px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .hero h1 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .hero p {
      font-size: 18px;
      color: rgba(255,255,255,0.9);
      max-width: 600px;
      margin: 0 auto;
    }

    .version-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      margin-top: 16px;
      backdrop-filter: blur(4px);
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title .icon {
      font-size: 24px;
    }

    .quick-start {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .action-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .action-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .action-card:hover {
      background: var(--vscode-list-hoverBackground);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .action-card:hover::before {
      opacity: 1;
    }

    .action-card .card-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .action-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--vscode-foreground);
    }

    .action-card p {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .feature {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid var(--card-border);
    }

    .feature .feature-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .feature h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .feature p {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    .keyboard-shortcuts {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
    }

    .shortcut-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .shortcut {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--vscode-editor-background);
      border-radius: 6px;
    }

    .shortcut-label {
      font-size: 13px;
    }

    .shortcut-key {
      display: flex;
      gap: 4px;
    }

    kbd {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      border: 1px solid var(--vscode-panel-border);
    }

    .footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid var(--card-border);
      margin-top: 32px;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 16px;
    }

    .footer-link {
      color: var(--vscode-textLink-foreground);
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    .dismiss-btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .dismiss-btn:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .copilot-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="logo">✨</div>
      <h1>Welcome to Clarity Chat</h1>
      <p>Build stunning AI chat applications with intelligent memory, streaming, and token optimization.</p>
      <span class="version-badge">v${version} - Production Ready</span>
      <div class="copilot-badge">
        <span>🤖</span>
        <span>GitHub Copilot Integrated - Type @clarity in chat</span>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="section-title">
      <span class="icon">🚀</span>
      <span>Quick Start</span>
    </div>

    <div class="quick-start">
      <div class="action-card" onclick="sendMessage('addComponent')">
        <div class="card-icon">🧩</div>
        <h3>Add Component</h3>
        <p>Insert ready-to-use chat UI components</p>
      </div>

      <div class="action-card" onclick="sendMessage('addHook')">
        <div class="card-icon">🪝</div>
        <h3>Add Hook</h3>
        <p>Insert powerful React hooks for chat</p>
      </div>

      <div class="action-card" onclick="sendMessage('createApiRoute')">
        <div class="card-icon">⚡</div>
        <h3>Create API Route</h3>
        <p>Generate streaming API endpoints</p>
      </div>

      <div class="action-card" onclick="sendMessage('manageKeys')">
        <div class="card-icon">🔑</div>
        <h3>Manage API Keys</h3>
        <p>Securely store provider credentials</p>
      </div>
    </div>

    <div class="section-title">
      <span class="icon">⭐</span>
      <span>Key Features</span>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">🧠</div>
        <div>
          <h4>Smart Memory</h4>
          <p>Built-in conversation memory with multiple strategies</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🌊</div>
        <div>
          <h4>Real-time Streaming</h4>
          <p>SSE and WebSocket support out of the box</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">💰</div>
        <div>
          <h4>Token Optimization</h4>
          <p>Reduce costs with intelligent token management</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🎨</div>
        <div>
          <h4>Beautiful UI</h4>
          <p>Production-ready components with theming</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🔌</div>
        <div>
          <h4>Multi-Provider</h4>
          <p>OpenAI, Anthropic, Google AI support</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">📝</div>
        <div>
          <h4>50+ Snippets</h4>
          <p>Type 'cc-' for instant code templates</p>
        </div>
      </div>
    </div>

    <div class="keyboard-shortcuts">
      <div class="section-title">
        <span class="icon">⌨️</span>
        <span>Keyboard Shortcuts</span>
      </div>

      <div class="shortcut-grid">
        <div class="shortcut">
          <span class="shortcut-label">Add Component</span>
          <div class="shortcut-key">
            <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>C</kbd><kbd>C</kbd>
          </div>
        </div>

        <div class="shortcut">
          <span class="shortcut-label">Add Hook</span>
          <div class="shortcut-key">
            <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>C</kbd><kbd>H</kbd>
          </div>
        </div>

        <div class="shortcut">
          <span class="shortcut-label">Add Provider</span>
          <div class="shortcut-key">
            <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>C</kbd><kbd>P</kbd>
          </div>
        </div>

        <div class="shortcut">
          <span class="shortcut-label">View Docs</span>
          <div class="shortcut-key">
            <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>C</kbd><kbd>D</kbd>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-links">
        <a class="footer-link" onclick="sendMessage('openDocs')">📖 Documentation</a>
        <a class="footer-link" onclick="sendMessage('showExamples')">💡 Examples</a>
      </div>
      <button class="dismiss-btn" onclick="sendMessage('dismiss')">Get Started</button>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    function sendMessage(command) {
      vscode.postMessage({ command });
    }
  </script>
</body>
</html>`
}

/**
 * Insert snippet by ID
 */
async function insertSnippetById(snippetId: string) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor')
    return
  }

  // This would map to actual snippets - simplified for now
  vscode.commands.executeCommand('editor.action.insertSnippet', {
    name: snippetId,
  })
}

/**
 * Track extension activation for analytics
 */
function trackExtensionActivation(context: vscode.ExtensionContext) {
  const activationCount = context.globalState.get<number>(
    'clarity-chat.activationCount',
    0
  )
  context.globalState.update(
    'clarity-chat.activationCount',
    activationCount + 1
  )

  const lastActivation = context.globalState.get<string>(
    'clarity-chat.lastActivation'
  )
  context.globalState.update(
    'clarity-chat.lastActivation',
    new Date().toISOString()
  )

  outputChannel.appendLine(`Activation #${activationCount + 1}`)
  if (lastActivation) {
    outputChannel.appendLine(`Last activation: ${lastActivation}`)
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  if (outputChannel) {
    outputChannel.appendLine('Clarity Chat extension is now deactivated')
    outputChannel.dispose()
  }
}
