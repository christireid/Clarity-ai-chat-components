/**
 * API Key Manager Webview
 * Secure API key management UI for VSCode
 */

import * as vscode from 'vscode'

export class ApiKeyManager {
  public static currentPanel: ApiKeyManager | undefined
  private readonly panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
  ) {
    this.panel = panel

    this.update(context)

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'saveKey':
            await this.saveApiKey(context, message.provider, message.key)
            vscode.window.showInformationMessage(
              `API key for ${message.provider} saved securely`
            )
            this.update(context)
            break

          case 'deleteKey':
            await this.deleteApiKey(context, message.provider)
            vscode.window.showInformationMessage(
              `API key for ${message.provider} removed`
            )
            this.update(context)
            break

          case 'validateKey':
            await this.validateApiKey(message.provider, message.key)
            break
        }
      },
      null,
      this.disposables
    )
  }

  public static createOrShow(context: vscode.ExtensionContext) {
    if (ApiKeyManager.currentPanel) {
      ApiKeyManager.currentPanel.panel.reveal(vscode.ViewColumn.One)
      return
    }

    const panel = vscode.window.createWebviewPanel(
      'clarityApiKeys',
      'Clarity Chat API Keys',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    )

    ApiKeyManager.currentPanel = new ApiKeyManager(panel, context)
  }

  public dispose() {
    ApiKeyManager.currentPanel = undefined
    this.panel.dispose()

    while (this.disposables.length) {
      const disposable = this.disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }

  private async update(context: vscode.ExtensionContext) {
    const webview = this.panel.webview
    this.panel.title = 'API Key Manager'
    this.panel.webview.html = await this.getHtmlForWebview(webview, context)
  }

  private async saveApiKey(
    context: vscode.ExtensionContext,
    provider: string,
    key: string
  ) {
    await context.secrets.store(`clarity-chat.${provider}-key`, key)
  }

  private async deleteApiKey(
    context: vscode.ExtensionContext,
    provider: string
  ) {
    await context.secrets.delete(`clarity-chat.${provider}-key`)
  }

  private async validateApiKey(provider: string, key: string) {
    // Basic validation
    const isValid = key && key.length > 10

    if (isValid) {
      vscode.window.showInformationMessage(
        `✓ ${provider} API key appears valid`
      )
    } else {
      vscode.window.showErrorMessage(`✗ ${provider} API key appears invalid`)
    }
  }

  private async getHtmlForWebview(
    webview: vscode.Webview,
    context: vscode.ExtensionContext
  ): Promise<string> {
    const providers = ['openai', 'anthropic', 'google']
    const keys = await Promise.all(
      providers.map(async (p) => ({
        provider: p,
        hasKey: !!(await context.secrets.get(`clarity-chat.${p}-key`)),
      }))
    )

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Key Manager</title>
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
      max-width: 600px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .subtitle {
      color: var(--vscode-descriptionForeground);
      margin-bottom: 24px;
    }
    
    .provider-section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      background: var(--vscode-editor-background);
    }
    
    .provider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .provider-name {
      font-size: 18px;
      font-weight: 600;
    }
    
    .status {
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 12px;
    }
    
    .status.configured {
      background: rgba(46, 204, 113, 0.2);
      color: #2ecc71;
    }
    
    .status.not-configured {
      background: rgba(231, 76, 60, 0.2);
      color: #e74c3c;
    }
    
    input[type="password"] {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--vscode-input-border);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .button-group {
      display: flex;
      gap: 8px;
    }
    
    button {
      padding: 6px 16px;
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
    
    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    
    button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    
    .warning {
      padding: 12px;
      background: rgba(255, 193, 7, 0.1);
      border-left: 3px solid #ffc107;
      border-radius: 4px;
      margin-bottom: 24px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔑 API Key Manager</h1>
    <p class="subtitle">Securely manage your AI provider API keys</p>

    <div class="warning">
      <strong>🔒 Security Note:</strong> API keys are stored securely in VSCode's secret storage.
      They are never written to disk in plain text.
    </div>

    ${providers
      .map((provider, index) => {
        const info = keys[index]
        return `
      <div class="provider-section">
        <div class="provider-header">
          <div class="provider-name">${provider.toUpperCase()}</div>
          <div class="status ${info.hasKey ? 'configured' : 'not-configured'}">
            ${info.hasKey ? '✓ Configured' : '✗ Not Configured'}
          </div>
        </div>
        
        <input
          type="password"
          id="${provider}-key"
          placeholder="Enter ${provider} API key..."
          ${info.hasKey ? 'value="••••••••••••••••"' : ''}
        />
        
        <div class="button-group">
          <button onclick="saveKey('${provider}')">
            ${info.hasKey ? 'Update' : 'Save'}
          </button>
          ${
            info.hasKey
              ? `<button class="secondary" onclick="deleteKey('${provider}')">Remove</button>`
              : ''
          }
          <button class="secondary" onclick="validateKey('${provider}')">Validate</button>
        </div>
      </div>
    `
      })
      .join('')}
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function saveKey(provider) {
      const input = document.getElementById(provider + '-key');
      const key = input.value;
      
      if (!key || key === '••••••••••••••••') {
        vscode.postMessage({
          command: 'alert',
          text: 'Please enter a valid API key'
        });
        return;
      }

      vscode.postMessage({
        command: 'saveKey',
        provider: provider,
        key: key
      });
    }

    function deleteKey(provider) {
      vscode.postMessage({
        command: 'deleteKey',
        provider: provider
      });
    }

    function validateKey(provider) {
      const input = document.getElementById(provider + '-key');
      const key = input.value;
      
      vscode.postMessage({
        command: 'validateKey',
        provider: provider,
        key: key
      });
    }
  </script>
</body>
</html>`
  }
}
