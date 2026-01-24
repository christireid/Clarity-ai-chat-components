/**
 * Tests for markdown renderer migration transform
 */

import { describe, it, expect } from 'vitest'
import { migrateMarkdownRenderers } from '../../migrate-markdown-renderers'
import { runTransform, normalizeCode } from '../test-utils'

describe('markdown renderer migration', () => {
  describe('Import transformations', () => {
    it('should rename MarkdownRendererEnhanced to EnhancedMarkdownRenderer', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('import{EnhancedMarkdownRenderer}from')
      expect(result!).not.toContain('MarkdownRendererEnhanced')
    })

    it('should remove MessageMarkdownRenderer import', () => {
      const input = `
        import { MessageMarkdownRenderer } from '@clarity-chat/react'
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('MessageMarkdownRenderer')
    })

    it('should handle both deprecated imports together', () => {
      const input = `
        import { MarkdownRendererEnhanced, MessageMarkdownRenderer } from '@clarity-chat/react'
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('EnhancedMarkdownRenderer')
      expect(result!).not.toContain('MarkdownRendererEnhanced')
      expect(result!).not.toContain('MessageMarkdownRenderer')
    })

    it('should preserve other imports', () => {
      const input = `
        import { MarkdownRendererEnhanced, Button, Input } from '@clarity-chat/react'
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('EnhancedMarkdownRenderer')
      expect(normalized).toContain('Button')
      expect(normalized).toContain('Input')
    })

    it('should handle internal package imports', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
    })
  })

  describe('JSX transformations', () => {
    it('should rename MarkdownRendererEnhanced component', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="# Hello" />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('<EnhancedMarkdownRenderer')
      expect(normalizeCode(result!)).toContain('</EnhancedMarkdownRenderer>')
    })

    it('should handle self-closing components', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="Hello" />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
    })

    it('should replace MessageMarkdownRenderer with EnhancedMarkdownRenderer', () => {
      const input = `
        import { MessageMarkdownRenderer } from '@clarity-chat/react'

        function Component() {
          return <MessageMarkdownRenderer content="Hello" />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).not.toContain('MessageMarkdownRenderer')
    })
  })

  describe('Props transformations', () => {
    it('should convert enableHighlight to config.enableSyntaxHighlight', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="code" enableHighlight={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableSyntaxHighlight')
      expect(result!).not.toContain('enableHighlight')
    })

    it('should convert enableMath to config.enableKaTeX', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="$x^2$" enableMath={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableKaTeX')
      expect(result!).not.toContain('enableMath')
    })

    it('should convert enableGFM to config.enableGFM', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="text" enableGFM={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableGFM')
    })

    it('should merge multiple boolean props into config object', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return (
            <MarkdownRendererEnhanced
              content="# Title"
              enableHighlight={true}
              enableMath={true}
              enableGFM={true}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableSyntaxHighlight')
      expect(result!).toContain('enableKaTeX')
      expect(result!).toContain('enableGFM')
    })

    it('should handle false values in props', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return <MarkdownRendererEnhanced content="text" enableHighlight={false} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableSyntaxHighlight')
    })

    it('should preserve non-deprecated props', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return (
            <MarkdownRendererEnhanced
              content="text"
              className="markdown"
              theme="dark"
              enableHighlight={true}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('className')
      expect(result!).toContain('theme')
      expect(result!).toContain('config')
    })
  })

  describe('Combined transformations', () => {
    it('should apply all transformations together', () => {
      const input = `
        import { MarkdownRendererEnhanced, MessageMarkdownRenderer } from '@clarity-chat/react'

        function Component1() {
          return (
            <MarkdownRendererEnhanced
              content="# Hello"
              enableHighlight={true}
              enableMath={true}
            />
          )
        }

        function Component2() {
          return <MessageMarkdownRenderer content="World" />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()

      // Check import transformation
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).not.toContain('MarkdownRendererEnhanced')
      expect(result!).not.toContain('MessageMarkdownRenderer')

      // Check props transformation
      expect(result!).toContain('config')
      expect(result!).toContain('enableSyntaxHighlight')
      expect(result!).toContain('enableKaTeX')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty files', () => {
      const input = ''
      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBe('')
    })

    it('should handle files with comments', () => {
      const input = `
        // Import markdown renderer
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          // Render markdown with highlighting
          return <MarkdownRendererEnhanced content="code" enableHighlight={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('// Import markdown renderer')
      expect(result!).toContain('// Render markdown with highlighting')
      expect(result!).toContain('EnhancedMarkdownRenderer')
    })

    it('should handle nested components', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return (
            <div>
              <MarkdownRendererEnhanced content="# Title" enableHighlight={true} />
              <div>
                <MarkdownRendererEnhanced content="body" enableMath={true} />
              </div>
            </div>
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      const matches = result!.match(/EnhancedMarkdownRenderer/g)
      expect(matches?.length).toBeGreaterThanOrEqual(2)
    })

    it('should handle component with spread props', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component({ markdownProps }) {
          return (
            <MarkdownRendererEnhanced
              {...markdownProps}
              enableHighlight={true}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).toContain('...markdownProps')
      expect(result!).toContain('config')
    })

    it('should handle dynamic prop values', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component({ enableHighlight }) {
          return (
            <MarkdownRendererEnhanced
              content="code"
              enableHighlight={enableHighlight}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('config')
      expect(result!).toContain('enableSyntaxHighlight')
    })

    it('should handle TypeScript generic props', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'
        import type { MarkdownProps } from '@clarity-chat/react'

        function Component<T extends MarkdownProps>() {
          return <MarkdownRendererEnhanced content="text" enableHighlight={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).toContain('config')
    })

    it('should handle multiple components in same file', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component1() {
          return <MarkdownRendererEnhanced content="text1" enableHighlight={true} />
        }

        function Component2() {
          return <MarkdownRendererEnhanced content="text2" enableMath={true} />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      const matches = result!.match(/EnhancedMarkdownRenderer/g)
      expect(matches?.length).toBeGreaterThanOrEqual(3) // Import + 2 usages
    })

    it('should preserve JSX expression values', () => {
      const input = `
        import { MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component({ content, highlight }) {
          return (
            <MarkdownRendererEnhanced
              content={content}
              enableHighlight={highlight || false}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('content={content}')
      expect(result!).toContain('config')
    })
  })

  describe('No-op scenarios', () => {
    it('should not transform if already using new API', () => {
      const input = `
        import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

        function Component() {
          return (
            <EnhancedMarkdownRenderer
              content="text"
              config={{ enableSyntaxHighlight: true }}
            />
          )
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      // May still process but should preserve correct API
      if (result) {
        expect(result).toContain('EnhancedMarkdownRenderer')
        expect(result).toContain('config')
      }
    })

    it('should not transform unrelated code', () => {
      const input = `
        import { useState } from 'react'

        function Component() {
          const [markdown, setMarkdown] = useState('')
          return <div>{markdown}</div>
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      if (result) {
        expect(result).toContain('useState')
      }
    })

    it('should not transform similar component names', () => {
      const input = `
        import { CustomMarkdownRenderer } from 'other-library'

        function Component() {
          return <CustomMarkdownRenderer content="text" />
        }
      `

      const result = runTransform(migrateMarkdownRenderers, input)
      // Should not modify components from other libraries
      if (result) {
        expect(result).toContain('CustomMarkdownRenderer')
        expect(result).toContain('other-library')
      }
    })
  })
})
