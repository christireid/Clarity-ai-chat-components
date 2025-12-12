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

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Clarity Chat extension is now active')

  // Get configuration
  const config = vscode.workspace.getConfiguration('clarityChat')

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
        '<'
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

  // Register commands
  context.subscriptions.push(
    // New Clarity Chat specific commands
    vscode.commands.registerCommand('clarity-chat.addComponent', () =>
      addComponentCommand(context)
    ),
    vscode.commands.registerCommand('clarity-chat.addHook', () =>
      addHookCommand(context)
    ),
    vscode.commands.registerCommand(
      'clarity-chat.createApiRoute',
      (uri?: vscode.Uri) => createApiRouteCommand(context, uri)
    ),
    vscode.commands.registerCommand(
      'clarity-chat.convertToClarity',
      convertToClarityCommand
    ),
    vscode.commands.registerCommand('clarity-chat.openDocs', openDocsCommand),
    vscode.commands.registerCommand(
      'clarity-chat.openStorybook',
      openStorybookCommand
    ),

    // Existing commands
    vscode.commands.registerCommand(
      'clarity-chat.initProject',
      initProjectCommand
    ),
    vscode.commands.registerCommand(
      'clarity-chat.addProvider',
      addProviderCommand
    ),
    vscode.commands.registerCommand(
      'clarity-chat.validateConfig',
      validateConfigCommand
    ),
    vscode.commands.registerCommand(
      'clarity-chat.showExamples',
      showExamplesCommand
    ),
    vscode.commands.registerCommand('clarity-chat.showPreview', () => {
      PreviewPanel.createOrShow(context.extensionUri)
    }),
    vscode.commands.registerCommand('clarity-chat.manageApiKeys', () => {
      ApiKeyManager.createOrShow(context)
    })
  )

  // Register Copilot chat participant (requires VS Code 1.90+)
  registerChatParticipant(context)

  // Show welcome message on first install
  const hasShownWelcome = context.globalState.get(
    'clarity-chat.hasShownWelcome',
    false
  )
  if (!hasShownWelcome) {
    showWelcomeMessage(context)
  }

  // Configuration change listener
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('clarityChat')) {
      vscode.window
        .showInformationMessage(
          'Clarity Chat configuration changed. Reload window to apply changes.',
          'Reload'
        )
        .then((selection) => {
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
  const message =
    'Welcome to Clarity Chat! Get started by adding a component or initializing a new project.'

  vscode.window
    .showInformationMessage(
      message,
      'Add Component',
      'Initialize Project',
      'View Documentation',
      "Don't Show Again"
    )
    .then((selection) => {
      if (selection === 'Add Component') {
        vscode.commands.executeCommand('clarity-chat.addComponent')
      } else if (selection === 'Initialize Project') {
        vscode.commands.executeCommand('clarity-chat.initProject')
      } else if (selection === 'View Documentation') {
        vscode.commands.executeCommand('clarity-chat.openDocs')
      } else if (selection === "Don't Show Again") {
        context.globalState.update('clarity-chat.hasShownWelcome', true)
      }
    })
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Clarity Chat extension is now deactivated')
}
