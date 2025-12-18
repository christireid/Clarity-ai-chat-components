/**
 * API Key Manager Webview
 * A secure, beautifully designed UI for managing AI provider API keys
 */

import * as vscode from 'vscode'
import { getNonce } from '../utils/import-utils'

interface ProviderInfo {
  id: string
  name: string
  icon: string
  color: string
  description: string
  keyFormat: string
  docsUrl: string
  dashboardUrl: string
}

/**
 * Validation result with detailed error information
 */
interface ValidationResult {
  valid: boolean
  error?: string
  errorType?: 'format' | 'invalid' | 'rate_limited' | 'expired' | 'network'
}

const PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    color: '#10a37f',
    description: 'GPT-4, GPT-3.5 Turbo, and DALL-E models',
    keyFormat: 'sk-...',
    docsUrl: 'https://platform.openai.com/docs',
    dashboardUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    color: '#d97706',
    description: 'Claude 3 Opus, Sonnet, and Haiku models',
    keyFormat: 'sk-ant-...',
    docsUrl: 'https://docs.anthropic.com',
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '✨',
    color: '#4285f4',
    description: 'Gemini Pro and Gemini Pro Vision models',
    keyFormat: 'AIza...',
    docsUrl: 'https://ai.google.dev/docs',
    dashboardUrl: 'https://makersuite.google.com/app/apikey',
  },
]

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
              `${this.getProviderName(message.provider)} API key saved securely`
            )
            this.update(context)
            break

          case 'deleteKey':
            await this.deleteApiKey(context, message.provider)
            vscode.window.showInformationMessage(
              `${this.getProviderName(message.provider)} API key removed`
            )
            this.update(context)
            break

          case 'validateKey': {
            const validationResult = await this.validateApiKey(
              message.provider,
              message.key
            )
            this.panel.webview.postMessage({
              command: 'validationResult',
              provider: message.provider,
              ...validationResult,
            })
            break
          }

          case 'openDashboard': {
            const provider = PROVIDERS.find((p) => p.id === message.provider)
            if (provider) {
              vscode.env.openExternal(vscode.Uri.parse(provider.dashboardUrl))
            }
            break
          }

          case 'openDocs': {
            const providerDocs = PROVIDERS.find(
              (p) => p.id === message.provider
            )
            if (providerDocs) {
              vscode.env.openExternal(vscode.Uri.parse(providerDocs.docsUrl))
            }
            break
          }
        }
      },
      null,
      this.disposables
    )
  }

  private getProviderName(id: string): string {
    return PROVIDERS.find((p) => p.id === id)?.name || id
  }

  public static createOrShow(context: vscode.ExtensionContext) {
    if (ApiKeyManager.currentPanel) {
      ApiKeyManager.currentPanel.panel.reveal(vscode.ViewColumn.One)
      return
    }

    const panel = vscode.window.createWebviewPanel(
      'clarityApiKeys',
      'API Key Manager',
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
    this.panel.title = 'API Key Manager'
    this.panel.webview.html = await this.getHtmlForWebview(context)
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

  /**
   * Validates an API key by making a real API call to the provider
   * @param provider - The provider ID (openai, anthropic, google)
   * @param key - The API key to validate
   * @returns ValidationResult with status and error details
   */
  private async validateApiKey(
    provider: string,
    key: string
  ): Promise<ValidationResult> {
    // Basic format validation first
    if (!key || key.length < 10) {
      return { valid: false, error: 'Key is too short', errorType: 'format' }
    }

    // Format checks
    const formatCheck = this.checkKeyFormat(provider, key)
    if (!formatCheck.valid) {
      return formatCheck
    }

    // Real API validation
    try {
      switch (provider) {
        case 'openai':
          return await this.validateOpenAI(key)
        case 'anthropic':
          return await this.validateAnthropic(key)
        case 'google':
          return await this.validateGoogle(key)
        default:
          return { valid: true }
      }
    } catch {
      return {
        valid: false,
        error: 'Network error - could not reach API',
        errorType: 'network',
      }
    }
  }

  /**
   * Check if the key matches the expected format for the provider
   */
  private checkKeyFormat(provider: string, key: string): ValidationResult {
    switch (provider) {
      case 'openai':
        // OpenAI keys can start with: sk-, sk-proj-, sk-svcacct-, etc.
        if (!/^sk-[a-zA-Z0-9_-]{20,}$/.test(key)) {
          return {
            valid: false,
            error:
              'Invalid format. OpenAI keys start with "sk-" followed by alphanumeric characters',
            errorType: 'format',
          }
        }
        break
      case 'anthropic':
        if (!key.startsWith('sk-ant-') || key.length < 20) {
          return {
            valid: false,
            error: 'Invalid format. Anthropic keys start with "sk-ant-"',
            errorType: 'format',
          }
        }
        break
      case 'google':
        if (!key.startsWith('AIza') || key.length < 20) {
          return {
            valid: false,
            error: 'Invalid format. Google AI keys start with "AIza"',
            errorType: 'format',
          }
        }
        break
    }
    return { valid: true }
  }

  /**
   * Validate OpenAI API key by fetching models list
   */
  private async validateOpenAI(key: string): Promise<ValidationResult> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${key}`,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return { valid: true }
      }

      const status = response.status
      if (status === 401) {
        return {
          valid: false,
          error: 'Invalid API key - authentication failed',
          errorType: 'invalid',
        }
      } else if (status === 429) {
        return {
          valid: false,
          error: 'Rate limited - please try again later',
          errorType: 'rate_limited',
        }
      } else if (status === 403) {
        return {
          valid: false,
          error: 'Access denied - key may be expired or restricted',
          errorType: 'expired',
        }
      } else if (status >= 500) {
        // Server errors - not the user's fault
        return {
          valid: false,
          error: 'OpenAI service unavailable - try again later',
          errorType: 'network',
        }
      }

      return {
        valid: false,
        error: `API error (${status})`,
        errorType: 'invalid',
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          valid: false,
          error: 'Request timed out - check your connection',
          errorType: 'network',
        }
      }
      return {
        valid: false,
        error: 'Network error - check your connection',
        errorType: 'network',
      }
    }
  }

  /**
   * Validate Anthropic API key using a lightweight models endpoint check
   * Note: We avoid the messages endpoint to not incur costs
   */
  private async validateAnthropic(key: string): Promise<ValidationResult> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      // Use the models endpoint which doesn't incur costs
      // A 401 means invalid key, anything else (including errors) means the key format is accepted
      const response = await fetch('https://api.anthropic.com/v1/models', {
        method: 'GET',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // 200 = valid, 401 = invalid key, anything else = assume valid (could be permission issue)
      if (response.ok) {
        return { valid: true }
      }

      const status = response.status
      if (status === 401) {
        return {
          valid: false,
          error: 'Invalid API key - authentication failed',
          errorType: 'invalid',
        }
      } else if (status === 429) {
        // Rate limited but key is valid
        return { valid: true }
      } else if (status === 403) {
        return {
          valid: false,
          error: 'Access denied - key may be expired or restricted',
          errorType: 'expired',
        }
      } else if (status >= 500) {
        return {
          valid: false,
          error: 'Anthropic service unavailable - try again later',
          errorType: 'network',
        }
      }

      // For other errors (like 404 if endpoint changes), assume key format is OK
      return { valid: true }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          valid: false,
          error: 'Request timed out - check your connection',
          errorType: 'network',
        }
      }
      return {
        valid: false,
        error: 'Network error - check your connection',
        errorType: 'network',
      }
    }
  }

  /**
   * Validate Google AI API key by listing models
   */
  private async validateGoogle(key: string): Promise<ValidationResult> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${key}`,
        { method: 'GET', signal: controller.signal }
      )

      clearTimeout(timeoutId)

      if (response.ok) {
        return { valid: true }
      }

      const status = response.status
      if (status === 400 || status === 403) {
        return {
          valid: false,
          error: 'Invalid API key',
          errorType: 'invalid',
        }
      } else if (status === 429) {
        return {
          valid: false,
          error: 'Rate limited - please try again later',
          errorType: 'rate_limited',
        }
      } else if (status >= 500) {
        return {
          valid: false,
          error: 'Google AI service unavailable - try again later',
          errorType: 'network',
        }
      }

      return {
        valid: false,
        error: `API error (${status})`,
        errorType: 'invalid',
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          valid: false,
          error: 'Request timed out - check your connection',
          errorType: 'network',
        }
      }
      return {
        valid: false,
        error: 'Network error - check your connection',
        errorType: 'network',
      }
    }
  }

  private async getHtmlForWebview(
    context: vscode.ExtensionContext
  ): Promise<string> {
    const keyStatus = await Promise.all(
      PROVIDERS.map(async (p) => ({
        provider: p.id,
        hasKey: !!(await context.secrets.get(`clarity-chat.${p.id}-key`)),
      }))
    )

    const providersJson = JSON.stringify(PROVIDERS)
    const keyStatusJson = JSON.stringify(keyStatus)

    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>API Key Manager</title>
  <style>
    :root {
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --gradient-start: #6366f1;
      --gradient-end: #8b5cf6;
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.1);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.1);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.1);
      --card-bg: rgba(255, 255, 255, 0.03);
      --card-border: rgba(255, 255, 255, 0.08);
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
      min-height: 100vh;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
      padding: 32px 24px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .header-content {
      position: relative;
      z-index: 1;
      max-width: 700px;
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

    /* Security Banner */
    .security-banner {
      max-width: 700px;
      margin: -20px auto 0;
      position: relative;
      z-index: 10;
    }

    .security-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      backdrop-filter: blur(8px);
    }

    .security-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .security-text h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--success);
    }

    .security-text p {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
    }

    /* Main Container */
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Provider Card */
    .provider-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      margin-bottom: 20px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .provider-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
    }

    .provider-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid var(--card-border);
    }

    .provider-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .provider-info {
      flex: 1;
    }

    .provider-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .provider-desc {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge.configured {
      background: var(--success-bg);
      color: var(--success);
    }

    .status-badge.not-configured {
      background: var(--danger-bg);
      color: var(--danger);
    }

    .provider-body {
      padding: 20px;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .input-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .input-label span {
      font-size: 13px;
      font-weight: 500;
    }

    .input-format {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      font-family: monospace;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      gap: 8px;
    }

    .api-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid var(--card-border);
      background: rgba(0, 0, 0, 0.2);
      color: var(--vscode-input-foreground);
      border-radius: 8px;
      font-size: 14px;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      transition: all 0.2s ease;
    }

    .api-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .api-input.valid {
      border-color: var(--success);
    }

    .api-input.invalid {
      border-color: var(--danger);
    }

    .toggle-visibility {
      padding: 12px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .toggle-visibility:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .validation-message {
      margin-top: 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .validation-message.success {
      color: var(--success);
    }

    .validation-message.error {
      color: var(--danger);
    }

    /* Button Group */
    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--vscode-foreground);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .btn-danger {
      background: transparent;
      border: 1px solid var(--danger);
      color: var(--danger);
    }

    .btn-danger:hover {
      background: var(--danger-bg);
    }

    .btn-link {
      background: transparent;
      border: none;
      color: var(--primary);
      padding: 10px 16px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    /* Provider Links */
    .provider-links {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--card-border);
    }

    .provider-link {
      font-size: 13px;
      color: var(--vscode-textLink-foreground);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .provider-link:hover {
      text-decoration: underline;
    }

    /* Footer */
    .footer {
      max-width: 700px;
      margin: 0 auto;
      padding: 24px;
      text-align: center;
    }

    .footer-text {
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 16px;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
    }

    /* Loading Animation */
    .loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: transform 0.3s ease;
      backdrop-filter: blur(8px);
      z-index: 100;
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
    }

    .toast.success {
      border-color: var(--success);
    }

    .toast.error {
      border-color: var(--danger);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <h1>
        <span>🔑</span>
        <span>API Key Manager</span>
      </h1>
      <p>Securely manage your AI provider credentials</p>
    </div>
  </div>

  <div class="security-banner">
    <div class="security-card">
      <div class="security-icon">🔒</div>
      <div class="security-text">
        <h3>Secure Storage</h3>
        <p>Your API keys are encrypted and stored in VS Code's secure credential storage. They are never written to disk in plain text or shared with any external services.</p>
      </div>
    </div>
  </div>

  <div class="container" id="providerList">
    <!-- Provider cards will be rendered here -->
  </div>

  <div class="footer">
    <p class="footer-text">Need help? Check out our documentation for setup guides.</p>
    <div class="footer-links">
      <a class="provider-link" onclick="openDocs('all')">
        📖 Documentation
      </a>
    </div>
  </div>

  <div class="toast" id="toast">
    <span id="toastIcon"></span>
    <span id="toastMessage"></span>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const providers = ${providersJson};
    const keyStatus = ${keyStatusJson};

    let visibleKeys = {};

    function renderProviders() {
      const container = document.getElementById('providerList');
      container.innerHTML = providers.map(provider => {
        const status = keyStatus.find(s => s.provider === provider.id);
        const hasKey = status?.hasKey || false;

        return \`
          <div class="provider-card" id="card-\${provider.id}">
            <div class="provider-header">
              <div class="provider-icon" style="background: \${provider.color}20">
                \${provider.icon}
              </div>
              <div class="provider-info">
                <div class="provider-name">
                  \${provider.name}
                </div>
                <div class="provider-desc">\${provider.description}</div>
              </div>
              <div class="status-badge \${hasKey ? 'configured' : 'not-configured'}">
                \${hasKey ? '✓ Configured' : '○ Not Configured'}
              </div>
            </div>
            <div class="provider-body">
              <div class="input-group">
                <div class="input-label">
                  <span>API Key</span>
                  <span class="input-format">Format: \${provider.keyFormat}</span>
                </div>
                <div class="input-wrapper">
                  <input
                    type="\${visibleKeys[provider.id] ? 'text' : 'password'}"
                    class="api-input"
                    id="input-\${provider.id}"
                    placeholder="\${hasKey ? '••••••••••••••••••••••••' : 'Enter your API key...'}"
                    oninput="onInputChange('\${provider.id}')"
                  />
                  <button class="toggle-visibility" onclick="toggleVisibility('\${provider.id}')">
                    \${visibleKeys[provider.id] ? '🙈' : '👁️'}
                  </button>
                </div>
                <div class="validation-message" id="validation-\${provider.id}"></div>
              </div>
              <div class="button-group">
                <button class="btn btn-primary" onclick="saveKey('\${provider.id}')" id="save-\${provider.id}">
                  \${hasKey ? 'Update Key' : 'Save Key'}
                </button>
                <button class="btn btn-secondary" onclick="validateKey('\${provider.id}')" id="validate-\${provider.id}">
                  Validate
                </button>
                \${hasKey ? \`
                  <button class="btn btn-danger" onclick="deleteKey('\${provider.id}')">
                    Remove
                  </button>
                \` : ''}
              </div>
              <div class="provider-links">
                <a class="provider-link" onclick="openDashboard('\${provider.id}')">
                  🔗 Get API Key
                </a>
                <a class="provider-link" onclick="openDocs('\${provider.id}')">
                  📖 Documentation
                </a>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function toggleVisibility(providerId) {
      visibleKeys[providerId] = !visibleKeys[providerId];
      renderProviders();
    }

    function onInputChange(providerId) {
      const input = document.getElementById('input-' + providerId);
      const validation = document.getElementById('validation-' + providerId);

      // Clear validation when typing
      input.classList.remove('valid', 'invalid');
      validation.innerHTML = '';
    }

    function saveKey(providerId) {
      const input = document.getElementById('input-' + providerId);
      const key = input.value.trim();

      if (!key || key === '••••••••••••••••••••••••') {
        showToast('Please enter a valid API key', 'error');
        return;
      }

      vscode.postMessage({
        command: 'saveKey',
        provider: providerId,
        key: key
      });

      input.value = '';
      showToast('API key saved securely', 'success');
    }

    function validateKey(providerId) {
      const input = document.getElementById('input-' + providerId);
      const key = input.value.trim();
      const validation = document.getElementById('validation-' + providerId);

      if (!key || key === '••••••••••••••••••••••••') {
        validation.innerHTML = '<span class="error">⚠️ Please enter a key to validate</span>';
        validation.className = 'validation-message error';
        return;
      }

      vscode.postMessage({
        command: 'validateKey',
        provider: providerId,
        key: key
      });

      validation.innerHTML = '<span class="loading"></span> Validating...';
      validation.className = 'validation-message';
    }

    function deleteKey(providerId) {
      vscode.postMessage({
        command: 'deleteKey',
        provider: providerId
      });
    }

    function openDashboard(providerId) {
      vscode.postMessage({
        command: 'openDashboard',
        provider: providerId
      });
    }

    function openDocs(providerId) {
      if (providerId === 'all') {
        vscode.postMessage({ command: 'openDocs', provider: 'openai' });
      } else {
        vscode.postMessage({
          command: 'openDocs',
          provider: providerId
        });
      }
    }

    function showToast(message, type) {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toastIcon');
      const msg = document.getElementById('toastMessage');

      icon.textContent = type === 'success' ? '✓' : '⚠️';
      msg.textContent = message;
      toast.className = 'toast show ' + type;

      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;

      if (message.command === 'validationResult') {
        const input = document.getElementById('input-' + message.provider);
        const validation = document.getElementById('validation-' + message.provider);

        if (message.valid) {
          input.classList.remove('invalid');
          input.classList.add('valid');
          validation.innerHTML = '✓ API key verified successfully!';
          validation.className = 'validation-message success';
          showToast('API key is valid!', 'success');
        } else {
          input.classList.remove('valid');
          input.classList.add('invalid');

          // Show specific error message
          const errorIcon = message.errorType === 'network' ? '🌐' :
                           message.errorType === 'rate_limited' ? '⏱️' :
                           message.errorType === 'format' ? '📝' : '✗';

          validation.innerHTML = errorIcon + ' ' + (message.error || 'Invalid key');
          validation.className = 'validation-message error';
        }
      }
    });

    // Initial render
    renderProviders();
  </script>
</body>
</html>`
  }
}
