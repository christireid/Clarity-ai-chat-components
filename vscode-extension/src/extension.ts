/**
 * Clarity Chat VS Code Extension
 * 
 * Provides IntelliSense, code snippets, and productivity features
 * for developing with the Clarity Chat AI framework.
 */

import * as vscode from 'vscode'
import { CompletionProvider } from './providers/completion'
import { HoverProvider } from './providers/hover'
import { CodeLensProvider } from './providers/codelens'
import { initProjectCommand } from './commands/init'
import { addProviderCommand } from './commands/add-provider'
import { validateConfigCommand } from './commands/validate'
import { showExamplesCommand } from './commands/examples'

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Clarity Chat extension is now active')

  // Get configuration
  const config = vscode.workspace.getConfiguration('clarity-chat')

  // Register completion provider
  if (config.get('enableIntelliSense', true)) {
    const completionProvider = new CompletionProvider()
    
    const completionDisposable = vscode.languages.registerCompletionItemProvider(
      [
        { language: 'typescript', scheme: 'file' },
        { language: 'javascript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' }
      ],
      completionProvider,
      '.', '"', "'"
    )
    
    context.subscriptions.push(completionDisposable)
  }

  // Register hover provider
  const hoverProvider = new HoverProvider()
  const hoverDisposable = vscode.languages.registerHoverProvider(
    [
      { language: 'typescript', scheme: 'file' },
      { language: 'javascript', scheme: 'file' },
      { language: 'typescriptreact', scheme: 'file' },
      { language: 'javascriptreact', scheme: 'file' }
    ],
    hoverProvider
  )
  context.subscriptions.push(hoverDisposable)

  // Register CodeLens provider
  if (config.get('enableCodeLens', true)) {
    const codeLensProvider = new CodeLensProvider()
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
      [
        { language: 'typescript', scheme: 'file' },
        { language: 'javascript', scheme: 'file' }
      ],
      codeLensProvider
    )
    context.subscriptions.push(codeLensDisposable)
  }

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('clarity-chat.initProject', initProjectCommand),
    vscode.commands.registerCommand('clarity-chat.addProvider', addProviderCommand),
    vscode.commands.registerCommand('clarity-chat.validateConfig', validateConfigCommand),
    vscode.commands.registerCommand('clarity-chat.showExamples', showExamplesCommand)
  )

  // Show welcome message on first install
  const hasShownWelcome = context.globalState.get('hasShownWelcome', false)
  if (!hasShownWelcome) {
    showWelcomeMessage(context)
  }

  // Configuration change listener
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('clarity-chat')) {
      vscode.window.showInformationMessage(
        'Clarity Chat configuration changed. Reload window to apply changes.',
        'Reload'
      ).then(selection => {
        if (selection === 'Reload') {
          vscode.commands.executeCommand('workbench.action.reloadWindow')
        }
      })
    }
  })
}

/**
 * Show welcome message
 */
function showWelcomeMessage(context: vscode.ExtensionContext) {
  const message = 'Welcome to Clarity Chat! Get started by initializing a new project.'
  
  vscode.window.showInformationMessage(
    message,
    'Initialize Project',
    'Show Examples',
    'Don\'t Show Again'
  ).then(selection => {
    if (selection === 'Initialize Project') {
      vscode.commands.executeCommand('clarity-chat.initProject')
    } else if (selection === 'Show Examples') {
      vscode.commands.executeCommand('clarity-chat.showExamples')
    } else if (selection === 'Don\'t Show Again') {
      context.globalState.update('hasShownWelcome', true)
    }
  })
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Clarity Chat extension is now deactivated')
}
