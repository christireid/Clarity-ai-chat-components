/**
 * Completion Provider for Clarity Chat
 * 
 * Provides intelligent code completion for AI SDKs
 */

import * as vscode from 'vscode'

export class CompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character)
    
    const completions: vscode.CompletionItem[] = []

    // OpenAI completions
    if (linePrefix.includes('openai.chat.completions.create')) {
      completions.push(...this.getOpenAICompletions())
    }

    // Anthropic completions
    if (linePrefix.includes('anthropic.messages.create')) {
      completions.push(...this.getAnthropicCompletions())
    }

    // Google AI completions
    if (linePrefix.includes('generateContent')) {
      completions.push(...this.getGoogleAICompletions())
    }

    // Model suggestions
    if (linePrefix.includes('model:') || linePrefix.includes('model =')) {
      completions.push(...this.getModelCompletions())
    }

    // Environment variable suggestions
    if (linePrefix.includes('process.env.')) {
      completions.push(...this.getEnvCompletions())
    }

    return completions
  }

  private getOpenAICompletions(): vscode.CompletionItem[] {
    const models = [
      { name: 'gpt-4-turbo', detail: 'Latest GPT-4 Turbo (128K context)', cost: '$0.01/$0.03 per 1K tokens' },
      { name: 'gpt-4', detail: 'GPT-4 (8K context)', cost: '$0.03/$0.06 per 1K tokens' },
      { name: 'gpt-3.5-turbo', detail: 'GPT-3.5 Turbo (16K context)', cost: '$0.0005/$0.0015 per 1K tokens' }
    ]

    return models.map(model => {
      const item = new vscode.CompletionItem(model.name, vscode.CompletionItemKind.Value)
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getAnthropicCompletions(): vscode.CompletionItem[] {
    const models = [
      { name: 'claude-3-opus-20240229', detail: 'Most capable Claude 3 model', cost: '$0.015/$0.075 per 1K tokens' },
      { name: 'claude-3-sonnet-20240229', detail: 'Balanced Claude 3 model', cost: '$0.003/$0.015 per 1K tokens' },
      { name: 'claude-3-haiku-20240307', detail: 'Fastest Claude 3 model', cost: '$0.00025/$0.00125 per 1K tokens' }
    ]

    return models.map(model => {
      const item = new vscode.CompletionItem(model.name, vscode.CompletionItemKind.Value)
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getGoogleAICompletions(): vscode.CompletionItem[] {
    const models = [
      { name: 'gemini-pro', detail: 'Gemini Pro text model', cost: '$0.00025/$0.0005 per 1K tokens' },
      { name: 'gemini-pro-vision', detail: 'Gemini Pro with vision', cost: '$0.00025/$0.0005 per 1K tokens' }
    ]

    return models.map(model => {
      const item = new vscode.CompletionItem(model.name, vscode.CompletionItemKind.Value)
      item.detail = model.detail
      item.documentation = new vscode.MarkdownString(
        `**${model.name}**\n\n${model.detail}\n\n**Pricing**: ${model.cost}`
      )
      item.insertText = `'${model.name}'`
      return item
    })
  }

  private getModelCompletions(): vscode.CompletionItem[] {
    return [
      ...this.getOpenAICompletions(),
      ...this.getAnthropicCompletions(),
      ...this.getGoogleAICompletions()
    ]
  }

  private getEnvCompletions(): vscode.CompletionItem[] {
    const envVars = [
      { name: 'OPENAI_API_KEY', detail: 'OpenAI API key', docs: 'Get your API key from https://platform.openai.com/api-keys' },
      { name: 'ANTHROPIC_API_KEY', detail: 'Anthropic API key', docs: 'Get your API key from https://console.anthropic.com/settings/keys' },
      { name: 'GOOGLE_API_KEY', detail: 'Google AI API key', docs: 'Get your API key from https://makersuite.google.com/app/apikey' }
    ]

    return envVars.map(env => {
      const item = new vscode.CompletionItem(env.name, vscode.CompletionItemKind.Variable)
      item.detail = env.detail
      item.documentation = new vscode.MarkdownString(env.docs)
      item.insertText = env.name
      return item
    })
  }
}
