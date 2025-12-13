/**
 * Component Preview Panel
 * A stunning, interactive gallery for previewing Clarity Chat components
 */

import * as vscode from 'vscode'
import { getNonce } from '../utils/import-utils'

interface ComponentInfo {
  name: string
  category: string
  description: string
  icon: string
  props: Array<{ name: string; type: string; required: boolean; description: string }>
  example: string
  preview: string
  tags: string[]
}

const COMPONENTS: ComponentInfo[] = [
  // Top-Level Components
  {
    name: 'ClarityChat',
    category: 'Top-Level',
    description: 'Complete drop-in chat UI with all features. The easiest way to add AI chat to your app.',
    icon: '💬',
    tags: ['featured', 'streaming', 'memory', 'markdown'],
    props: [
      { name: 'api', type: 'string', required: true, description: 'API endpoint for chat requests' },
      { name: 'placeholder', type: 'string', required: false, description: 'Input placeholder text' },
      { name: 'showTimestamp', type: 'boolean', required: false, description: 'Show message timestamps' },
      { name: 'enableMarkdown', type: 'boolean', required: false, description: 'Enable markdown rendering' },
      { name: 'className', type: 'string', required: false, description: 'Custom CSS class' },
    ],
    example: `<ClarityChat
  api="/api/chat"
  placeholder="Ask me anything..."
  showTimestamp
  enableMarkdown
/>`,
    preview: `<div class="chat-preview">
      <div class="chat-messages">
        <div class="message user">Hello! How can you help me?</div>
        <div class="message assistant">Hi! I'm here to assist you with anything you need. I can help with coding, answer questions, or just chat!</div>
      </div>
      <div class="chat-input-preview">
        <input type="text" placeholder="Ask me anything..." />
        <button>Send</button>
      </div>
    </div>`,
  },
  {
    name: 'ClarityChatPresets',
    category: 'Top-Level',
    description: 'Pre-configured chat variants for common use cases. Choose from minimal, standard, or enterprise.',
    icon: '🎨',
    tags: ['featured', 'presets', 'themes'],
    props: [
      { name: 'variant', type: '"minimal" | "standard" | "enterprise"', required: true, description: 'Preset style variant' },
      { name: 'api', type: 'string', required: true, description: 'API endpoint' },
    ],
    example: `<ClarityChatPresets
  variant="standard"
  api="/api/chat"
/>`,
    preview: `<div class="preset-preview">
      <div class="preset-card active">Standard</div>
      <div class="preset-card">Minimal</div>
      <div class="preset-card">Enterprise</div>
    </div>`,
  },
  // Building Blocks
  {
    name: 'ChatWindow',
    category: 'Building Blocks',
    description: 'Scrollable chat container with auto-scroll behavior and proper layout.',
    icon: '🪟',
    tags: ['container', 'layout'],
    props: [
      { name: 'className', type: 'string', required: false, description: 'Custom CSS class' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Chat content' },
    ],
    example: `<ChatWindow className="h-screen">
  <MessageList messages={messages} />
  <ChatInput />
</ChatWindow>`,
    preview: `<div class="window-preview">
      <div class="window-header">Chat Window</div>
      <div class="window-content">
        <div class="msg-placeholder"></div>
        <div class="msg-placeholder"></div>
        <div class="msg-placeholder"></div>
      </div>
    </div>`,
  },
  {
    name: 'MessageList',
    category: 'Building Blocks',
    description: 'Virtualized message display for performance with large histories.',
    icon: '📋',
    tags: ['messages', 'virtualized', 'performance'],
    props: [
      { name: 'messages', type: 'Message[]', required: true, description: 'Array of messages' },
      { name: 'isLoading', type: 'boolean', required: false, description: 'Loading state' },
      { name: 'showTimestamp', type: 'boolean', required: false, description: 'Show timestamps' },
    ],
    example: `<MessageList
  messages={messages}
  isLoading={isLoading}
  showTimestamp
/>`,
    preview: `<div class="list-preview">
      <div class="message-row user">User message</div>
      <div class="message-row assistant">Assistant response</div>
      <div class="message-row user">Follow-up question</div>
    </div>`,
  },
  {
    name: 'ChatInput',
    category: 'Building Blocks',
    description: 'Full-featured input with file upload, voice input, and keyboard shortcuts.',
    icon: '⌨️',
    tags: ['input', 'upload', 'voice'],
    props: [
      { name: 'value', type: 'string', required: true, description: 'Input value' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Change handler' },
      { name: 'onSubmit', type: '() => void', required: true, description: 'Submit handler' },
      { name: 'isLoading', type: 'boolean', required: false, description: 'Disable during loading' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
    ],
    example: `<ChatInput
  value={input}
  onChange={handleInputChange}
  onSubmit={handleSubmit}
  isLoading={isLoading}
  placeholder="Type a message..."
/>`,
    preview: `<div class="input-preview">
      <div class="input-field">Type your message...</div>
      <div class="input-actions">
        <span class="action-icon">📎</span>
        <span class="action-icon">🎤</span>
        <button class="send-btn">→</button>
      </div>
    </div>`,
  },
  {
    name: 'MessageBubble',
    category: 'Building Blocks',
    description: 'Individual message display with role-based styling and timestamp.',
    icon: '💭',
    tags: ['message', 'styling', 'timestamp'],
    props: [
      { name: 'message', type: 'Message', required: true, description: 'Message object' },
      { name: 'variant', type: '"default" | "compact" | "minimal"', required: false, description: 'Style variant' },
      { name: 'showTimestamp', type: 'boolean', required: false, description: 'Show timestamp' },
    ],
    example: `<MessageBubble
  message={message}
  variant="default"
  showTimestamp
/>`,
    preview: `<div class="bubble-preview">
      <div class="bubble assistant">Hello! How can I help you today?</div>
      <div class="bubble-time">2:34 PM</div>
    </div>`,
  },
  // Streaming Components
  {
    name: 'StreamingMessage',
    category: 'Streaming',
    description: 'Displays streaming text with typing cursor animation.',
    icon: '🌊',
    tags: ['streaming', 'animation', 'cursor'],
    props: [
      { name: 'content', type: 'string', required: true, description: 'Current streamed content' },
      { name: 'isStreaming', type: 'boolean', required: true, description: 'Streaming state' },
      { name: 'showCursor', type: 'boolean', required: false, description: 'Show typing cursor' },
    ],
    example: `<StreamingMessage
  content={content}
  isStreaming={isStreaming}
  showCursor
/>`,
    preview: `<div class="streaming-preview">
      <span>I'm currently typing this message</span><span class="cursor">|</span>
    </div>`,
  },
  {
    name: 'ThinkingIndicator',
    category: 'Streaming',
    description: 'Visual indicator while AI processes request.',
    icon: '🤔',
    tags: ['loading', 'animation', 'thinking'],
    props: [
      { name: 'variant', type: '"dots" | "pulse" | "spinner"', required: false, description: 'Animation variant' },
      { name: 'text', type: 'string', required: false, description: 'Custom text' },
    ],
    example: `<ThinkingIndicator
  variant="dots"
  text="AI is thinking..."
/>`,
    preview: `<div class="thinking-preview">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="thinking-text">AI is thinking...</span>
    </div>`,
  },
  {
    name: 'TypingIndicator',
    category: 'Streaming',
    description: 'Shows when user or AI is typing.',
    icon: '✍️',
    tags: ['typing', 'status'],
    props: [
      { name: 'isTyping', type: 'boolean', required: true, description: 'Typing state' },
    ],
    example: `<TypingIndicator isTyping={isTyping} />`,
    preview: `<div class="typing-preview">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>`,
  },
  // Providers
  {
    name: 'MemoryProvider',
    category: 'Providers',
    description: 'Context provider that enables conversation memory for child components.',
    icon: '🧠',
    tags: ['memory', 'context', 'state'],
    props: [
      { name: 'strategy', type: '"sliding-window" | "summarization" | "hybrid"', required: true, description: 'Memory strategy' },
      { name: 'maxTokens', type: 'number', required: false, description: 'Maximum tokens to retain' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
    ],
    example: `<MemoryProvider
  strategy="hybrid"
  maxTokens={2000}
>
  <ClarityChat api="/api/chat" />
</MemoryProvider>`,
    preview: `<div class="memory-preview">
      <div class="memory-icon">🧠</div>
      <div class="memory-stats">
        <div>Strategy: Hybrid</div>
        <div>Tokens: 1,200 / 2,000</div>
      </div>
    </div>`,
  },
  {
    name: 'ClarityChatProvider',
    category: 'Providers',
    description: 'Root context provider for Clarity Chat configuration.',
    icon: '⚙️',
    tags: ['provider', 'config', 'context'],
    props: [
      { name: 'config', type: 'ClarityChatConfig', required: true, description: 'Global configuration' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
    ],
    example: `<ClarityChatProvider config={{ api: '/api/chat' }}>
  <App />
</ClarityChatProvider>`,
    preview: `<div class="provider-preview">
      <div class="provider-box">
        <span>Provider</span>
        <div class="provider-children">App</div>
      </div>
    </div>`,
  },
  // Token & Utilities
  {
    name: 'TokenBudgetDisplay',
    category: 'Utilities',
    description: 'Visual display of token usage with progress indicator.',
    icon: '📊',
    tags: ['tokens', 'budget', 'visualization'],
    props: [
      { name: 'stats', type: 'TokenStats', required: true, description: 'Token usage stats' },
      { name: 'maxTokens', type: 'number', required: true, description: 'Budget limit' },
      { name: 'showWarning', type: 'boolean', required: false, description: 'Show warning at threshold' },
    ],
    example: `<TokenBudgetDisplay
  stats={tokenStats}
  maxTokens={4000}
  showWarning
/>`,
    preview: `<div class="token-preview">
      <div class="token-label">Token Budget</div>
      <div class="token-bar">
        <div class="token-fill" style="width: 65%"></div>
      </div>
      <div class="token-text">2,600 / 4,000 tokens</div>
    </div>`,
  },
  {
    name: 'MarkdownRenderer',
    category: 'Utilities',
    description: 'Renders markdown content with syntax highlighting.',
    icon: '📝',
    tags: ['markdown', 'syntax', 'rendering'],
    props: [
      { name: 'content', type: 'string', required: true, description: 'Markdown content' },
      { name: 'enableCodeHighlight', type: 'boolean', required: false, description: 'Enable syntax highlighting' },
    ],
    example: `<MarkdownRenderer
  content={message.content}
  enableCodeHighlight
/>`,
    preview: `<div class="markdown-preview">
      <h4>Heading</h4>
      <p>This is <strong>bold</strong> and <em>italic</em></p>
      <code>inline code</code>
    </div>`,
  },
  {
    name: 'CodeBlock',
    category: 'Utilities',
    description: 'Syntax highlighted code block with copy button.',
    icon: '💻',
    tags: ['code', 'syntax', 'copy'],
    props: [
      { name: 'code', type: 'string', required: true, description: 'Code content' },
      { name: 'language', type: 'string', required: false, description: 'Programming language' },
      { name: 'showLineNumbers', type: 'boolean', required: false, description: 'Show line numbers' },
      { name: 'enableCopy', type: 'boolean', required: false, description: 'Enable copy button' },
    ],
    example: `<CodeBlock
  code={code}
  language="typescript"
  showLineNumbers
  enableCopy
/>`,
    preview: `<div class="code-preview">
      <div class="code-header">
        <span>typescript</span>
        <span class="copy-btn">📋 Copy</span>
      </div>
      <pre>const greeting = "Hello!"</pre>
    </div>`,
  },
  {
    name: 'ErrorBoundary',
    category: 'Utilities',
    description: 'Error boundary that catches and displays errors gracefully.',
    icon: '🛡️',
    tags: ['error', 'boundary', 'fallback'],
    props: [
      { name: 'fallback', type: 'ReactNode', required: true, description: 'Fallback UI' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
    ],
    example: `<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={handleError}
>
  <ClarityChat />
</ErrorBoundary>`,
    preview: `<div class="error-preview">
      <div class="error-icon">🛡️</div>
      <div class="error-text">Protected Content</div>
    </div>`,
  },
  // Configuration
  {
    name: 'ModelSelector',
    category: 'Configuration',
    description: 'Dropdown to select from available AI models.',
    icon: '🤖',
    tags: ['model', 'selection', 'dropdown'],
    props: [
      { name: 'models', type: 'string[]', required: true, description: 'Available models' },
      { name: 'value', type: 'string', required: true, description: 'Selected model' },
      { name: 'onChange', type: '(model: string) => void', required: true, description: 'Change handler' },
    ],
    example: `<ModelSelector
  models={['gpt-4-turbo', 'claude-3-opus']}
  value={selectedModel}
  onChange={setSelectedModel}
/>`,
    preview: `<div class="selector-preview">
      <select>
        <option>GPT-4 Turbo</option>
        <option>Claude 3 Opus</option>
        <option>Gemini Pro</option>
      </select>
    </div>`,
  },
]

export class PreviewPanel {
  public static currentPanel: PreviewPanel | undefined
  private readonly panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []

  private constructor(panel: vscode.WebviewPanel, _extensionUri: vscode.Uri) {
    this.panel = panel

    this.update()

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

    this.panel.onDidChangeViewState(
      () => {
        if (this.panel.visible) {
          this.update()
        }
      },
      null,
      this.disposables
    )

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'insertComponent':
            await this.insertComponent(message.componentName)
            break
          case 'copyCode':
            await vscode.env.clipboard.writeText(message.code)
            vscode.window.showInformationMessage('Code copied to clipboard!')
            break
          case 'copyImport':
            await vscode.env.clipboard.writeText(message.importStatement)
            vscode.window.showInformationMessage('Import copied to clipboard!')
            break
          case 'viewDocs':
            vscode.env.openExternal(
              vscode.Uri.parse(
                `https://docs.claritychat.dev/components/${message.componentName.toLowerCase()}`
              )
            )
            break
          case 'addComponent':
            vscode.commands.executeCommand('clarity-chat.addComponent')
            break
        }
      },
      null,
      this.disposables
    )
  }

  private async insertComponent(componentName: string) {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No active editor')
      return
    }

    const component = COMPONENTS.find((c) => c.name === componentName)
    if (component) {
      const snippet = new vscode.SnippetString(component.example)
      await editor.insertSnippet(snippet)
      vscode.window.showInformationMessage(`Inserted ${componentName}`)
    }
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    if (PreviewPanel.currentPanel) {
      PreviewPanel.currentPanel.panel.reveal(column)
      return
    }

    const panel = vscode.window.createWebviewPanel(
      'clarityPreview',
      'Clarity Chat Components',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
      }
    )

    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri)
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri)
  }

  public dispose() {
    PreviewPanel.currentPanel = undefined

    this.panel.dispose()

    while (this.disposables.length) {
      const disposable = this.disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }

  private update() {
    this.panel.title = 'Clarity Chat Components'
    this.panel.webview.html = this.getHtmlForWebview()
  }

  private getHtmlForWebview(): string {
    const componentsJson = JSON.stringify(COMPONENTS)
    const categories = [...new Set(COMPONENTS.map((c) => c.category))]
    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Clarity Chat Components</title>
  <style>
    :root {
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --gradient-start: #6366f1;
      --gradient-end: #8b5cf6;
      --card-bg: rgba(255, 255, 255, 0.03);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.08);
      --success: #10b981;
      --warning: #f59e0b;
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
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
      padding: 32px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header p {
      color: rgba(255,255,255,0.85);
      font-size: 15px;
    }

    .search-bar {
      margin-top: 20px;
      display: flex;
      gap: 12px;
    }

    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
      color: white;
      font-size: 14px;
      backdrop-filter: blur(4px);
    }

    .search-input::placeholder {
      color: rgba(255,255,255,0.6);
    }

    .search-input:focus {
      outline: none;
      background: rgba(255,255,255,0.2);
    }

    /* Main Content */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 24px;
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 140px;
      height: fit-content;
    }

    .category-nav {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 12px;
    }

    .category-btn {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: transparent;
      color: var(--vscode-foreground);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s ease;
    }

    .category-btn:hover {
      background: var(--card-hover);
    }

    .category-btn.active {
      background: var(--primary);
      color: white;
    }

    .category-count {
      float: right;
      opacity: 0.6;
      font-size: 12px;
    }

    /* Component Grid */
    .content {
      min-width: 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .component-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    /* Component Card */
    .component-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .component-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }

    .component-card:hover {
      background: var(--card-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .component-card:hover::before {
      transform: scaleX(1);
    }

    .component-card.selected {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }

    .component-card.selected::before {
      transform: scaleX(1);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .card-icon {
      font-size: 28px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
    }

    .card-desc {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      font-size: 11px;
      padding: 3px 8px;
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary);
      border-radius: 4px;
    }

    .tag.featured {
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
    }

    /* Detail Panel */
    .detail-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 480px;
      height: 100vh;
      background: var(--vscode-editor-background);
      border-left: 1px solid var(--card-border);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      z-index: 200;
    }

    .detail-panel.open {
      transform: translateX(0);
    }

    .detail-header {
      padding: 24px;
      background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
      position: sticky;
      top: 0;
    }

    .detail-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }

    .detail-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .detail-title {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
    }

    .detail-category {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }

    .detail-content {
      padding: 24px;
    }

    .detail-section {
      margin-bottom: 24px;
    }

    .detail-section h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--vscode-foreground);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-desc {
      font-size: 14px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.6;
    }

    /* Props Table */
    .props-table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
    }

    .props-table th {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid var(--card-border);
      font-weight: 600;
      color: var(--vscode-descriptionForeground);
    }

    .props-table td {
      padding: 8px;
      border-bottom: 1px solid var(--card-border);
    }

    .prop-name {
      font-family: monospace;
      color: var(--primary);
    }

    .prop-type {
      font-family: monospace;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    .prop-required {
      color: var(--warning);
      font-size: 11px;
    }

    /* Code Block */
    .code-block {
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(0,0,0,0.2);
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    .code-copy {
      background: var(--primary);
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .code-content {
      padding: 16px;
      overflow-x: auto;
    }

    .code-content pre {
      margin: 0;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
      color: #e2e8f0;
    }

    /* Preview Box */
    .preview-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 120px;
    }

    /* Action Buttons */
    .detail-actions {
      display: flex;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid var(--card-border);
      position: sticky;
      bottom: 0;
      background: var(--vscode-editor-background);
    }

    .action-btn {
      flex: 1;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn.primary {
      background: var(--primary);
      color: white;
      border: none;
    }

    .action-btn.primary:hover {
      background: var(--primary-hover);
    }

    .action-btn.secondary {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--vscode-foreground);
    }

    .action-btn.secondary:hover {
      background: var(--card-hover);
    }

    /* Preview Styles */
    .chat-preview {
      width: 100%;
      background: var(--vscode-editor-background);
      border-radius: 8px;
      padding: 12px;
    }

    .chat-messages { margin-bottom: 12px; }

    .message {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      font-size: 13px;
    }

    .message.user {
      background: var(--primary);
      color: white;
      margin-left: 20%;
    }

    .message.assistant {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      margin-right: 20%;
    }

    .chat-input-preview {
      display: flex;
      gap: 8px;
    }

    .chat-input-preview input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      background: var(--card-bg);
      color: var(--vscode-foreground);
      font-size: 13px;
    }

    .chat-input-preview button {
      padding: 8px 16px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .thinking-preview {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot, .typing-dot {
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite;
    }

    .dot:nth-child(2), .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3), .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
    }

    .thinking-text {
      margin-left: 8px;
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
    }

    .streaming-preview {
      font-size: 14px;
    }

    .cursor {
      animation: blink 1s step-end infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .token-preview {
      width: 100%;
      text-align: center;
    }

    .token-bar {
      height: 8px;
      background: var(--card-bg);
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }

    .token-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--success), var(--warning));
      border-radius: 4px;
    }

    .token-text {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    /* Overlay */
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 150;
    }

    .overlay.open {
      opacity: 1;
      visibility: visible;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--vscode-descriptionForeground);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }

      .detail-panel {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <h1>
        <span>✨</span>
        <span>Component Gallery</span>
      </h1>
      <p>Browse, preview, and insert Clarity Chat components into your code</p>
      <div class="search-bar">
        <input
          type="text"
          class="search-input"
          placeholder="Search components..."
          id="searchInput"
          oninput="filterComponents()"
        />
      </div>
    </div>
  </div>

  <div class="main">
    <aside class="sidebar">
      <nav class="category-nav">
        <button class="category-btn active" data-category="all" onclick="filterByCategory('all')">
          All Components
          <span class="category-count">${COMPONENTS.length}</span>
        </button>
        ${categories
          .map(
            (cat) => `
          <button class="category-btn" data-category="${cat}" onclick="filterByCategory('${cat}')">
            ${cat}
            <span class="category-count">${COMPONENTS.filter((c) => c.category === cat).length}</span>
          </button>
        `
          )
          .join('')}
      </nav>
    </aside>

    <div class="content" id="componentList">
      <!-- Components will be rendered here -->
    </div>
  </div>

  <div class="overlay" id="overlay" onclick="closeDetail()"></div>

  <div class="detail-panel" id="detailPanel">
    <div class="detail-header">
      <button class="detail-close" onclick="closeDetail()">×</button>
      <div class="detail-icon" id="detailIcon"></div>
      <div class="detail-title" id="detailTitle"></div>
      <div class="detail-category" id="detailCategory"></div>
    </div>
    <div class="detail-content">
      <div class="detail-section">
        <h3>📖 Description</h3>
        <p class="detail-desc" id="detailDesc"></p>
      </div>

      <div class="detail-section">
        <h3>🎯 Live Preview</h3>
        <div class="preview-box" id="detailPreview"></div>
      </div>

      <div class="detail-section">
        <h3>⚙️ Props</h3>
        <table class="props-table" id="detailProps">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      <div class="detail-section">
        <h3>💻 Example Code</h3>
        <div class="code-block">
          <div class="code-header">
            <span>TSX</span>
            <button class="code-copy" onclick="copyCode()">Copy</button>
          </div>
          <div class="code-content">
            <pre id="detailCode"></pre>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-actions">
      <button class="action-btn primary" onclick="insertSelected()">
        Insert Component
      </button>
      <button class="action-btn secondary" onclick="copyImport()">
        Copy Import
      </button>
      <button class="action-btn secondary" onclick="viewDocs()">
        View Docs
      </button>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const components = ${componentsJson};
    let selectedComponent = null;
    let currentFilter = 'all';
    let searchQuery = '';

    function renderComponents() {
      const container = document.getElementById('componentList');
      let filtered = components;

      if (currentFilter !== 'all') {
        filtered = filtered.filter(c => c.category === currentFilter);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(t => t.toLowerCase().includes(query))
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <p>No components found matching your search</p>
          </div>
        \`;
        return;
      }

      // Group by category
      const grouped = {};
      filtered.forEach(c => {
        if (!grouped[c.category]) grouped[c.category] = [];
        grouped[c.category].push(c);
      });

      let html = '';
      for (const [category, comps] of Object.entries(grouped)) {
        html += \`
          <div class="section-title">
            <span>\${getCategoryIcon(category)}</span>
            <span>\${category}</span>
          </div>
          <div class="component-grid">
            \${comps.map(c => \`
              <div class="component-card \${selectedComponent?.name === c.name ? 'selected' : ''}"
                   onclick="selectComponent('\${c.name}')">
                <div class="card-header">
                  <span class="card-icon">\${c.icon}</span>
                  <span class="card-title">\${c.name}</span>
                </div>
                <p class="card-desc">\${c.description.substring(0, 100)}\${c.description.length > 100 ? '...' : ''}</p>
                <div class="card-tags">
                  \${c.tags.slice(0, 3).map(t => \`<span class="tag \${t === 'featured' ? 'featured' : ''}">\${t}</span>\`).join('')}
                </div>
              </div>
            \`).join('')}
          </div>
        \`;
      }

      container.innerHTML = html;
    }

    function getCategoryIcon(category) {
      const icons = {
        'Top-Level': '🚀',
        'Building Blocks': '🧱',
        'Streaming': '🌊',
        'Providers': '⚙️',
        'Utilities': '🔧',
        'Configuration': '⚡'
      };
      return icons[category] || '📦';
    }

    function filterByCategory(category) {
      currentFilter = category;

      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
      });

      renderComponents();
    }

    function filterComponents() {
      searchQuery = document.getElementById('searchInput').value;
      renderComponents();
    }

    function selectComponent(name) {
      selectedComponent = components.find(c => c.name === name);
      if (!selectedComponent) return;

      document.getElementById('detailIcon').textContent = selectedComponent.icon;
      document.getElementById('detailTitle').textContent = selectedComponent.name;
      document.getElementById('detailCategory').textContent = selectedComponent.category;
      document.getElementById('detailDesc').textContent = selectedComponent.description;
      document.getElementById('detailPreview').innerHTML = selectedComponent.preview;
      document.getElementById('detailCode').textContent = selectedComponent.example;

      // Render props table
      const tbody = document.querySelector('#detailProps tbody');
      tbody.innerHTML = selectedComponent.props.map(prop => \`
        <tr>
          <td>
            <span class="prop-name">\${prop.name}</span>
            \${prop.required ? '<span class="prop-required">*</span>' : ''}
          </td>
          <td><span class="prop-type">\${prop.type}</span></td>
          <td>\${prop.description}</td>
        </tr>
      \`).join('');

      document.getElementById('detailPanel').classList.add('open');
      document.getElementById('overlay').classList.add('open');

      renderComponents();
    }

    function closeDetail() {
      document.getElementById('detailPanel').classList.remove('open');
      document.getElementById('overlay').classList.remove('open');
      selectedComponent = null;
      renderComponents();
    }

    function insertSelected() {
      if (!selectedComponent) return;
      vscode.postMessage({
        command: 'insertComponent',
        componentName: selectedComponent.name
      });
      closeDetail();
    }

    function copyCode() {
      if (!selectedComponent) return;
      vscode.postMessage({
        command: 'copyCode',
        code: selectedComponent.example
      });
    }

    function copyImport() {
      if (!selectedComponent) return;
      const importStatement = \`import { \${selectedComponent.name} } from '@clarity-chat/react'\`;
      vscode.postMessage({
        command: 'copyImport',
        importStatement: importStatement
      });
    }

    function viewDocs() {
      if (!selectedComponent) return;
      vscode.postMessage({
        command: 'viewDocs',
        componentName: selectedComponent.name
      });
    }

    // Initial render
    renderComponents();
  </script>
</body>
</html>`
  }
}
