/**
 * Extension Activation Tests
 *
 * Tests for the main extension lifecycle and command registration
 */

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension Activation', () => {
  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('clarity-chat.clarity-chat')
    assert.ok(extension !== undefined, 'Extension should be available')
  })

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('clarity-chat.clarity-chat')
    if (extension) {
      await extension.activate()
      assert.strictEqual(extension.isActive, true, 'Extension should be active')
    }
  })

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true)

    const expectedCommands = [
      'clarity-chat.initProject',
      'clarity-chat.addProvider',
      'clarity-chat.validateConfig',
      'clarity-chat.showExamples',
      'clarity-chat.showPreview',
      'clarity-chat.manageApiKeys'
    ]

    expectedCommands.forEach(cmd => {
      assert.ok(
        commands.includes(cmd),
        `Command ${cmd} should be registered`
      )
    })
  })
})

suite('Configuration', () => {
  test('Default configuration values should be set', () => {
    const config = vscode.workspace.getConfiguration('clarity-chat')

    assert.strictEqual(
      config.get('enableIntelliSense'),
      true,
      'enableIntelliSense should default to true'
    )

    assert.strictEqual(
      config.get('enableCodeLens'),
      true,
      'enableCodeLens should default to true'
    )

    assert.strictEqual(
      config.get('defaultProvider'),
      'openai',
      'defaultProvider should default to openai'
    )

    assert.strictEqual(
      config.get('showInlineHints'),
      true,
      'showInlineHints should default to true'
    )
  })
})
