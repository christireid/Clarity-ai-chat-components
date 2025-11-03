/**
 * Component Preview Panel
 * Shows live preview of Clarity Chat components in VSCode
 */

import * as vscode from 'vscode'
import * as path from 'path'

export class PreviewPanel {
  public static currentPanel: PreviewPanel | undefined
  private readonly panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel

    // Set the webview's initial html content
    this.update()

    // Listen for when the panel is disposed
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

    // Update the content based on view changes
    this.panel.onDidChangeViewState(
      () => {
        if (this.panel.visible) {
          this.update()
        }
      },
      null,
      this.disposables
    )

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'alert':
            vscode.window.showInformationMessage(message.text)
            return
        }
      },
      null,
      this.disposables
    )
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    // If we already have a panel, show it
    if (PreviewPanel.currentPanel) {
      PreviewPanel.currentPanel.panel.reveal(column)
      return
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      'clarityPreview',
      'Clarity Chat Preview',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
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
    const webview = this.panel.webview
    this.panel.title = 'Clarity Chat Preview'
    this.panel.webview.html = this.getHtmlForWebview(webview)
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clarity Chat Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: var(--vscode-foreground);
    }
    
    .component-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    
    .component-card {
      padding: 16px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      background: var(--vscode-editor-background);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .component-card:hover {
      background: var(--vscode-list-hoverBackground);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .component-name {
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--vscode-textLink-foreground);
    }
    
    .component-desc {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.5;
    }
    
    .preview-frame {
      margin-top: 24px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      min-height: 400px;
      padding: 16px;
      background: var(--vscode-editor-background);
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    
    button {
      padding: 8px 16px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Clarity Chat Component Preview</h1>
    <p style="color: var(--vscode-descriptionForeground); margin-bottom: 24px;">
      Select a component to preview
    </p>

    <div class="component-grid">
      <div class="component-card" onclick="showPreview('ChatWindow')">
        <div class="component-name">ChatWindow</div>
        <div class="component-desc">Complete chat interface with message history</div>
      </div>
      
      <div class="component-card" onclick="showPreview('MessageBubble')">
        <div class="component-name">MessageBubble</div>
        <div class="component-desc">Individual message display</div>
      </div>
      
      <div class="component-card" onclick="showPreview('ChatInput')">
        <div class="component-name">ChatInput</div>
        <div class="component-desc">Message input with features</div>
      </div>
      
      <div class="component-card" onclick="showPreview('ModelSelector')">
        <div class="component-name">ModelSelector</div>
        <div class="component-desc">AI model selection</div>
      </div>
      
      <div class="component-card" onclick="showPreview('ThinkingIndicator')">
        <div class="component-name">ThinkingIndicator</div>
        <div class="component-desc">AI processing animation</div>
      </div>
      
      <div class="component-card" onclick="showPreview('TokenCounter')">
        <div class="component-name">TokenCounter</div>
        <div class="component-desc">Token usage display</div>
      </div>
    </div>

    <div id="preview" class="preview-frame" style="display: none;">
      <h2 id="preview-title" style="margin-bottom: 16px;"></h2>
      <div id="preview-content"></div>
      <div class="action-buttons">
        <button onclick="insertComponent()">Insert Component</button>
        <button onclick="viewDocs()">View Documentation</button>
        <button onclick="copyCode()">Copy Code</button>
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function showPreview(componentName) {
      const preview = document.getElementById('preview');
      const title = document.getElementById('preview-title');
      const content = document.getElementById('preview-content');
      
      title.textContent = componentName;
      preview.style.display = 'block';
      
      // Show component info
      content.innerHTML = getComponentInfo(componentName);
      
      // Scroll to preview
      preview.scrollIntoView({ behavior: 'smooth' });
    }

    function getComponentInfo(name) {
      const components = {
        'ChatWindow': {
          description: 'A complete chat interface with message history, scrolling, and theme support.',
          props: ['messages', 'onSend', 'isLoading', 'placeholder'],
          example: \`<ChatWindow
  messages={messages}
  onSend={handleSend}
  isLoading={isLoading}
  placeholder="Type a message..."
/>\`
        },
        'MessageBubble': {
          description: 'Displays a single message with role-based styling.',
          props: ['message', 'variant', 'showTimestamp'],
          example: \`<MessageBubble
  message={{
    role: 'assistant',
    content: 'Hello!'
  }}
  variant="default"
  showTimestamp
/>\`
        },
        'ChatInput': {
          description: 'Advanced input field with multiline, file upload, and more.',
          props: ['value', 'onChange', 'onSubmit', 'placeholder'],
          example: \`<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  placeholder="Type here..."
/>\`
        }
      };

      const info = components[name] || {};
      
      return \`
        <p style="margin-bottom: 16px; line-height: 1.6;">
          \${info.description || 'Component description'}
        </p>
        <h3 style="margin: 16px 0 8px; font-size: 14px;">Props:</h3>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
          \${(info.props || []).map(prop => \`<li><code>\${prop}</code></li>\`).join('')}
        </ul>
        <h3 style="margin: 16px 0 8px; font-size: 14px;">Example:</h3>
        <pre style="background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 4px; overflow-x: auto;"><code>\${info.example || ''}</code></pre>
      \`;
    }

    function insertComponent() {
      vscode.postMessage({
        command: 'insertComponent',
      });
    }

    function viewDocs() {
      vscode.postMessage({
        command: 'viewDocs',
      });
    }

    function copyCode() {
      const example = document.querySelector('#preview-content pre code');
      if (example) {
        navigator.clipboard.writeText(example.textContent);
        vscode.postMessage({
          command: 'alert',
          text: 'Code copied to clipboard!'
        });
      }
    }
  </script>
</body>
</html>`
  }
}

