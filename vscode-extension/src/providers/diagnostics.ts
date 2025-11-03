/**
 * Diagnostics Provider
 * Provides real-time error detection and quick fixes for Clarity Chat code
 */

import * as vscode from 'vscode'

export class DiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('clarity-chat')
  }

  /**
   * Update diagnostics for a document
   */
  updateDiagnostics(document: vscode.TextDocument): void {
    if (
      !document.fileName.endsWith('.ts') &&
      !document.fileName.endsWith('.tsx') &&
      !document.fileName.endsWith('.js') &&
      !document.fileName.endsWith('.jsx')
    ) {
      return
    }

    const diagnostics: vscode.Diagnostic[] = []
    const text = document.getText()

    // Check 1: Missing API key configuration
    if (this.hasProviderImport(text) && !this.hasApiKeyConfig(text)) {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 0),
        'API key configuration missing. Add your API key to environment variables.',
        vscode.DiagnosticSeverity.Warning
      )
      diagnostic.code = 'missing-api-key'
      diagnostic.source = 'clarity-chat'
      diagnostics.push(diagnostic)
    }

    // Check 2: Deprecated API usage
    const deprecatedPatterns = [
      { pattern: /ChatWindow/g, replacement: 'ChatInterface', message: 'ChatWindow is deprecated, use ChatInterface instead' },
      { pattern: /onMessage=/g, replacement: 'onSend=', message: 'onMessage prop is deprecated, use onSend instead' },
    ]

    deprecatedPatterns.forEach(({ pattern, replacement, message }) => {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match.index !== undefined) {
          const position = document.positionAt(match.index)
          const range = new vscode.Range(position, position.translate(0, match[0].length))
          
          const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning)
          diagnostic.code = 'deprecated-api'
          diagnostic.source = 'clarity-chat'
          diagnostic.relatedInformation = [
            new vscode.DiagnosticRelatedInformation(
              new vscode.Location(document.uri, range),
              `Replace with: ${replacement}`
            ),
          ]
          diagnostics.push(diagnostic)
        }
      }
    })

    // Check 3: Missing error handling
    if (this.hasAsyncChatCall(text) && !this.hasTryCatch(text)) {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 0),
        'Consider adding error handling for AI API calls',
        vscode.DiagnosticSeverity.Information
      )
      diagnostic.code = 'missing-error-handling'
      diagnostic.source = 'clarity-chat'
      diagnostics.push(diagnostic)
    }

    // Check 4: Inefficient API usage
    if (this.hasMultipleSequentialCalls(text)) {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 0),
        'Multiple sequential API calls detected. Consider batching or using streaming.',
        vscode.DiagnosticSeverity.Hint
      )
      diagnostic.code = 'inefficient-api-usage'
      diagnostic.source = 'clarity-chat'
      diagnostics.push(diagnostic)
    }

    // Check 5: Hardcoded API keys
    if (this.hasHardcodedApiKey(text)) {
      const matches = text.matchAll(/(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,})/g)
      for (const match of matches) {
        if (match.index !== undefined) {
          const position = document.positionAt(match.index)
          const range = new vscode.Range(position, position.translate(0, match[0].length))
          
          const diagnostic = new vscode.Diagnostic(
            range,
            '⚠️ Hardcoded API key detected! Use environment variables instead.',
            vscode.DiagnosticSeverity.Error
          )
          diagnostic.code = 'hardcoded-api-key'
          diagnostic.source = 'clarity-chat'
          diagnostics.push(diagnostic)
        }
      }
    }

    this.diagnosticCollection.set(document.uri, diagnostics)
  }

  /**
   * Clear diagnostics for a document
   */
  clearDiagnostics(document: vscode.TextDocument): void {
    this.diagnosticCollection.delete(document.uri)
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.diagnosticCollection.clear()
    this.diagnosticCollection.dispose()
  }

  // Helper methods
  private hasProviderImport(text: string): boolean {
    return /from\s+['"]openai['"]|from\s+['"]@anthropic-ai\/sdk['"]|from\s+['"]@google\/generative-ai['"]/.test(text)
  }

  private hasApiKeyConfig(text: string): boolean {
    return /process\.env\.\w+_API_KEY|apiKey:\s*process\.env/.test(text)
  }

  private hasAsyncChatCall(text: string): boolean {
    return /await\s+\w+\.chat\.completions\.create|await\s+\w+\.messages\.create|await\s+\w+\.generateContent/.test(text)
  }

  private hasTryCatch(text: string): boolean {
    return /try\s*{[\s\S]*catch/.test(text)
  }

  private hasMultipleSequentialCalls(text: string): boolean {
    const asyncCalls = text.match(/await\s+\w+\.(chat|messages|generateContent)/g)
    return asyncCalls ? asyncCalls.length > 1 : false
  }

  private hasHardcodedApiKey(text: string): boolean {
    return /(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,})/.test(text)
  }
}

/**
 * Code Action Provider for Quick Fixes
 */
export class QuickFixProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const codeActions: vscode.CodeAction[] = []

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'clarity-chat') continue

      switch (diagnostic.code) {
        case 'deprecated-api':
          codeActions.push(this.createDeprecationFix(document, diagnostic))
          break

        case 'missing-error-handling':
          codeActions.push(this.createErrorHandlingFix(document, diagnostic))
          break

        case 'hardcoded-api-key':
          codeActions.push(this.createApiKeyFix(document, diagnostic))
          break

        case 'missing-api-key':
          codeActions.push(this.createAddApiKeyFix(document, diagnostic))
          break
      }
    }

    return codeActions
  }

  private createDeprecationFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      'Update to new API',
      vscode.CodeActionKind.QuickFix
    )
    fix.diagnostics = [diagnostic]
    fix.edit = new vscode.WorkspaceEdit()

    const text = document.getText(diagnostic.range)
    let replacement = text

    if (text === 'ChatWindow') {
      replacement = 'ChatInterface'
    } else if (text === 'onMessage=') {
      replacement = 'onSend='
    }

    fix.edit.replace(document.uri, diagnostic.range, replacement)
    fix.isPreferred = true

    return fix
  }

  private createErrorHandlingFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      'Add error handling',
      vscode.CodeActionKind.QuickFix
    )
    fix.diagnostics = [diagnostic]
    fix.command = {
      title: 'Add try-catch block',
      command: 'clarity-chat.addErrorHandling',
      arguments: [document.uri],
    }

    return fix
  }

  private createApiKeyFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      'Move API key to environment variable',
      vscode.CodeActionKind.QuickFix
    )
    fix.diagnostics = [diagnostic]
    fix.edit = new vscode.WorkspaceEdit()

    fix.edit.replace(document.uri, diagnostic.range, 'process.env.OPENAI_API_KEY')
    fix.isPreferred = true

    return fix
  }

  private createAddApiKeyFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      'Add API key configuration',
      vscode.CodeActionKind.QuickFix
    )
    fix.diagnostics = [diagnostic]
    fix.command = {
      title: 'Configure API keys',
      command: 'clarity-chat.addProvider',
    }

    return fix
  }
}

