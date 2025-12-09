/**
 * Completion Provider Tests
 *
 * Tests for intelligent code completion functionality
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import { CompletionProvider } from '../../providers/completion'

suite('CompletionProvider', () => {
  let provider: CompletionProvider

  setup(() => {
    provider = new CompletionProvider()
  })

  suite('Model Completions', () => {
    test('should provide OpenAI model completions', async () => {
      const document = await createMockDocument(
        'const completion = await openai.chat.completions.create({'
      )
      const position = new vscode.Position(0, 55)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      assert.ok(completions, 'Should return completions')
      const items = Array.isArray(completions) ? completions : completions?.items || []

      const modelNames = items.map(item => {
        if (typeof item.label === 'string') return item.label
        return item.label.label
      })

      assert.ok(
        modelNames.some(name => name.includes('gpt-4')),
        'Should include GPT-4 models'
      )
    })

    test('should provide Anthropic model completions', async () => {
      const document = await createMockDocument(
        'const response = await anthropic.messages.create({'
      )
      const position = new vscode.Position(0, 50)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      assert.ok(completions, 'Should return completions')
      const items = Array.isArray(completions) ? completions : completions?.items || []

      const modelNames = items.map(item => {
        if (typeof item.label === 'string') return item.label
        return item.label.label
      })

      assert.ok(
        modelNames.some(name => name.includes('claude')),
        'Should include Claude models'
      )
    })

    test('should provide Google AI model completions', async () => {
      const document = await createMockDocument(
        'const result = await model.generateContent('
      )
      const position = new vscode.Position(0, 42)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      assert.ok(completions, 'Should return completions')
      const items = Array.isArray(completions) ? completions : completions?.items || []

      const modelNames = items.map(item => {
        if (typeof item.label === 'string') return item.label
        return item.label.label
      })

      assert.ok(
        modelNames.some(name => name.includes('gemini')),
        'Should include Gemini models'
      )
    })

    test('should provide model completions when typing model:', async () => {
      const document = await createMockDocument('  model:')
      const position = new vscode.Position(0, 8)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      assert.ok(completions, 'Should return completions')
      const items = Array.isArray(completions) ? completions : completions?.items || []

      // Should include models from all providers
      assert.ok(items.length >= 3, 'Should include models from multiple providers')
    })
  })

  suite('Environment Variable Completions', () => {
    test('should provide env completions for process.env', async () => {
      const document = await createMockDocument('const key = process.env.')
      const position = new vscode.Position(0, 24)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' }
      )

      assert.ok(completions, 'Should return completions')
      const items = Array.isArray(completions) ? completions : completions?.items || []

      const envVars = items.map(item => {
        if (typeof item.label === 'string') return item.label
        return item.label.label
      })

      assert.ok(
        envVars.includes('OPENAI_API_KEY'),
        'Should include OPENAI_API_KEY'
      )
      assert.ok(
        envVars.includes('ANTHROPIC_API_KEY'),
        'Should include ANTHROPIC_API_KEY'
      )
      assert.ok(
        envVars.includes('GOOGLE_API_KEY'),
        'Should include GOOGLE_API_KEY'
      )
    })

    test('completion items should have correct kind', async () => {
      const document = await createMockDocument('const key = process.env.')
      const position = new vscode.Position(0, 24)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' }
      )

      const items = Array.isArray(completions) ? completions : completions?.items || []

      items.forEach(item => {
        assert.strictEqual(
          item.kind,
          vscode.CompletionItemKind.Variable,
          'Environment variables should have Variable kind'
        )
      })
    })
  })

  suite('Completion Item Properties', () => {
    test('model completions should have documentation', async () => {
      const document = await createMockDocument('  model:')
      const position = new vscode.Position(0, 8)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      const items = Array.isArray(completions) ? completions : completions?.items || []

      items.forEach(item => {
        assert.ok(item.detail, 'Should have detail')
        assert.ok(item.documentation, 'Should have documentation')
      })
    })

    test('model completions should have correct insert text', async () => {
      const document = await createMockDocument('  model:')
      const position = new vscode.Position(0, 8)

      const completions = await provider.provideCompletionItems(
        document,
        position,
        new vscode.CancellationTokenSource().token,
        { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
      )

      const items = Array.isArray(completions) ? completions : completions?.items || []

      items.forEach(item => {
        if (item.insertText) {
          const text = item.insertText.toString()
          assert.ok(
            text.startsWith("'") && text.endsWith("'"),
            'Insert text should be quoted'
          )
        }
      })
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
