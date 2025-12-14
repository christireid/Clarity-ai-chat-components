/**
 * Unit tests for import-utils.ts
 * Tests import merging, location finding, and icon stripping utilities
 */

import * as assert from 'assert'
import { stripIconPrefix } from '../utils/import-utils'

suite('Import Utils Test Suite', () => {
  suite('stripIconPrefix', () => {
    test('should remove VS Code icon prefix from label', () => {
      const result = stripIconPrefix('$(symbol-method) useClarityChat')
      assert.strictEqual(result, 'useClarityChat')
    })

    test('should remove icon prefix with complex icons', () => {
      const result = stripIconPrefix('$(loading~spin) ThinkingIndicator')
      assert.strictEqual(result, 'ThinkingIndicator')
    })

    test('should handle label without icon prefix', () => {
      const result = stripIconPrefix('ClarityChat')
      assert.strictEqual(result, 'ClarityChat')
    })

    test('should handle empty string', () => {
      const result = stripIconPrefix('')
      assert.strictEqual(result, '')
    })

    test('should handle label with multiple words', () => {
      const result = stripIconPrefix('$(comment-discussion) Clarity Chat Component')
      assert.strictEqual(result, 'Clarity Chat Component')
    })

    test('should handle icon at end (should not remove)', () => {
      const result = stripIconPrefix('Component $(icon)')
      assert.strictEqual(result, 'Component $(icon)')
    })
  })

  suite('Import regex patterns', () => {
    // Test the regex pattern used in addImportToFile
    const importRegex =
      /import\s+\{([^}]+)\}\s+from\s+['"]@clarity-chat\/react['"]/

    test('should match simple import', () => {
      const code = `import { ClarityChat } from '@clarity-chat/react'`
      const match = code.match(importRegex)
      assert.ok(match)
      assert.strictEqual(match[1].trim(), 'ClarityChat')
    })

    test('should match multiple imports', () => {
      const code = `import { ClarityChat, ChatInput, MessageList } from '@clarity-chat/react'`
      const match = code.match(importRegex)
      assert.ok(match)
      assert.strictEqual(match[1], ' ClarityChat, ChatInput, MessageList ')
    })

    test('should match import with double quotes', () => {
      const code = `import { ClarityChat } from "@clarity-chat/react"`
      const match = code.match(importRegex)
      assert.ok(match)
    })

    test('should not match different package', () => {
      const code = `import { useState } from 'react'`
      const match = code.match(importRegex)
      assert.strictEqual(match, null)
    })

    test('should match multiline import', () => {
      const multilineRegex =
        /import\s+\{([^}]+)\}\s+from\s+['"]@clarity-chat\/react['"]/s
      const code = `import {
  ClarityChat,
  ChatInput,
  MessageList
} from '@clarity-chat/react'`
      const match = code.match(multilineRegex)
      assert.ok(match)
      assert.ok(match[1].includes('ClarityChat'))
      assert.ok(match[1].includes('ChatInput'))
    })
  })

  suite('Import merging logic', () => {
    function mergeImports(
      existingImports: string,
      newImports: string
    ): string[] {
      const existing = existingImports.split(',').map((s) => s.trim()).filter(Boolean)
      const newItems = newImports.split(',').map((s) => s.trim()).filter(Boolean)
      return [...new Set([...existing, ...newItems])]
    }

    test('should merge without duplicates', () => {
      const result = mergeImports('ClarityChat, ChatInput', 'ChatInput, MessageList')
      assert.deepStrictEqual(result, ['ClarityChat', 'ChatInput', 'MessageList'])
    })

    test('should handle empty existing imports', () => {
      const result = mergeImports('', 'ClarityChat')
      assert.deepStrictEqual(result, ['ClarityChat'])
    })

    test('should handle whitespace variations', () => {
      const result = mergeImports('  ClarityChat  ,  ChatInput  ', 'MessageList')
      assert.deepStrictEqual(result, ['ClarityChat', 'ChatInput', 'MessageList'])
    })

    test('should preserve type imports', () => {
      const result = mergeImports('type Message, ClarityChat', 'ChatInput')
      assert.deepStrictEqual(result, ['type Message', 'ClarityChat', 'ChatInput'])
    })
  })

  suite('Import location finding', () => {
    function findLastImportLine(lines: string[]): number {
      let lastImportLine = -1
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('import ') || line.startsWith('import{')) {
          lastImportLine = i
        } else if (
          lastImportLine >= 0 &&
          line &&
          !line.startsWith('//') &&
          !line.startsWith('/*')
        ) {
          break
        }
      }
      return lastImportLine
    }

    test('should find last import in simple file', () => {
      const lines = [
        "import { useState } from 'react'",
        "import { ClarityChat } from '@clarity-chat/react'",
        '',
        'function App() {}',
      ]
      assert.strictEqual(findLastImportLine(lines), 1)
    })

    test('should handle use client directive', () => {
      const lines = [
        "'use client'",
        '',
        "import { useState } from 'react'",
        '',
        'function App() {}',
      ]
      assert.strictEqual(findLastImportLine(lines), 2)
    })

    test('should handle no imports', () => {
      const lines = ['function App() {}', 'export default App']
      assert.strictEqual(findLastImportLine(lines), -1)
    })

    test('should skip comments after imports', () => {
      const lines = [
        "import { useState } from 'react'",
        "import { ClarityChat } from '@clarity-chat/react'",
        '// This is a comment',
        '/* Multi-line comment */',
        'function App() {}',
      ]
      assert.strictEqual(findLastImportLine(lines), 1)
    })

    test('should handle import without space', () => {
      const lines = [
        "import{useState}from 'react'",
        'function App() {}',
      ]
      assert.strictEqual(findLastImportLine(lines), 0)
    })
  })
})
