/**
 * Hover Provider Tests
 *
 * Tests for documentation on hover functionality
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import { HoverProvider } from '../../providers/hover'

suite('HoverProvider', () => {
  let provider: HoverProvider

  setup(() => {
    provider = new HoverProvider()
  })

  suite('Model Hover Information', () => {
    test('should provide hover for GPT-4 Turbo model', async () => {
      const document = await createMockDocument("model: 'gpt-4-turbo'")
      const position = new vscode.Position(0, 10)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0]
      assert.ok(content instanceof vscode.MarkdownString, 'Should return MarkdownString')

      const markdown = content as vscode.MarkdownString
      assert.ok(markdown.value.includes('GPT-4 Turbo'), 'Should include model name')
      assert.ok(markdown.value.includes('OpenAI'), 'Should include provider')
      assert.ok(markdown.value.includes('128,000'), 'Should include context window')
    })

    test('should provide hover for Claude models', async () => {
      const document = await createMockDocument("model: 'claude-3-opus-20240229'")
      const position = new vscode.Position(0, 15)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0]
      const markdown = content as vscode.MarkdownString

      assert.ok(markdown.value.includes('Claude 3 Opus'), 'Should include model name')
      assert.ok(markdown.value.includes('Anthropic'), 'Should include provider')
      assert.ok(markdown.value.includes('200,000'), 'Should include context window')
    })

    test('should provide hover for Gemini models', async () => {
      const document = await createMockDocument("model: 'gemini-pro'")
      const position = new vscode.Position(0, 12)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0]
      const markdown = content as vscode.MarkdownString

      assert.ok(markdown.value.includes('Gemini Pro'), 'Should include model name')
      assert.ok(markdown.value.includes('Google'), 'Should include provider')
    })

    test('hover should include pricing information', async () => {
      const document = await createMockDocument("model: 'gpt-4-turbo'")
      const position = new vscode.Position(0, 10)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('Pricing'), 'Should include pricing section')
      assert.ok(content.value.includes('Input'), 'Should include input pricing')
      assert.ok(content.value.includes('Output'), 'Should include output pricing')
    })

    test('hover should include capabilities', async () => {
      const document = await createMockDocument("model: 'gpt-4-turbo'")
      const position = new vscode.Position(0, 10)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('Capabilities'), 'Should include capabilities')
    })

    test('hover should include documentation link', async () => {
      const document = await createMockDocument("model: 'gpt-4-turbo'")
      const position = new vscode.Position(0, 10)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('Documentation'), 'Should include documentation link')
      assert.ok(content.value.includes('https://'), 'Should include URL')
    })
  })

  suite('Environment Variable Hover', () => {
    test('should provide hover for OPENAI_API_KEY', async () => {
      const document = await createMockDocument("process.env.OPENAI_API_KEY")
      const position = new vscode.Position(0, 15)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('OPENAI_API_KEY'), 'Should include env var name')
      assert.ok(content.value.includes('OpenAI'), 'Should include provider')
    })

    test('should provide hover for ANTHROPIC_API_KEY', async () => {
      const document = await createMockDocument("process.env.ANTHROPIC_API_KEY")
      const position = new vscode.Position(0, 15)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('ANTHROPIC_API_KEY'), 'Should include env var name')
      assert.ok(content.value.includes('Anthropic'), 'Should include provider')
    })

    test('env var hover should include setup instructions', async () => {
      const document = await createMockDocument("process.env.OPENAI_API_KEY")
      const position = new vscode.Position(0, 15)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.ok(hover, 'Should return hover information')
      const content = hover.contents[0] as vscode.MarkdownString

      assert.ok(content.value.includes('Setup'), 'Should include setup instructions')
      assert.ok(content.value.includes('.env.local'), 'Should reference .env.local')
    })
  })

  suite('No Hover Cases', () => {
    test('should return undefined for unknown identifiers', async () => {
      const document = await createMockDocument("const foo = 'bar'")
      const position = new vscode.Position(0, 14)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.strictEqual(hover, undefined, 'Should not return hover for unknown identifiers')
    })

    test('should return undefined for non-string positions', async () => {
      const document = await createMockDocument('const x = 42')
      const position = new vscode.Position(0, 10)

      const hover = await provider.provideHover(
        document,
        position,
        new vscode.CancellationTokenSource().token
      )

      assert.strictEqual(hover, undefined, 'Should not return hover for numbers')
    })
  })
})

/**
 * Helper function to create a mock document for testing
 */
async function createMockDocument(content: string): Promise<vscode.TextDocument> {
  return await vscode.workspace.openTextDocument({
    content,
    language: 'typescript'
  })
}
