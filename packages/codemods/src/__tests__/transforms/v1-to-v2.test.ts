/**
 * Tests for v1 to v2 migration transform
 */

import { describe, it, expect } from 'vitest'
import transform from '../../transforms/v1-to-v2'
import { runTransform, normalizeCode } from '../test-utils'

describe('v1-to-v2 transform', () => {
  describe('Import transformations', () => {
    it('should rename ChatWindow to ChatInterface in imports', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('import{ChatInterface}from')
    })

    it('should rename aliased ChatWindow imports', () => {
      const input = `
        import { ChatWindow as MyChat } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('ChatInterface')
    })

    it('should handle multiple imports including ChatWindow', () => {
      const input = `
        import { ChatWindow, useChat, Button } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('ChatInterface')
      expect(normalized).toContain('useChat')
      expect(normalized).toContain('Button')
    })

    it('should not modify imports without ChatWindow', () => {
      const input = `
        import { useChat, Button } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeNull()
    })
  })

  describe('JSX transformations', () => {
    it('should rename ChatWindow component to ChatInterface', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('<ChatInterface')
      expect(normalizeCode(result!)).toContain('</ChatInterface>')
    })

    it('should handle ChatWindow with children', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          return (
            <ChatWindow>
              <div>Content</div>
            </ChatWindow>
          )
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('<ChatInterface>')
      expect(normalized).toContain('</ChatInterface>')
      expect(normalized).toContain('<div>Content</div>')
    })

    it('should handle self-closing ChatWindow', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        export default function App() {
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
    })

    it('should handle namespaced ChatWindow (JSXMemberExpression)', () => {
      const input = `
        import * as Chat from '@clarity-chat/react'

        function App() {
          return <Chat.ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('Chat.ChatInterface')
    })
  })

  describe('Prop transformations', () => {
    it('should rename onMessage to onSend', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          const handleMessage = () => {}
          return <ChatWindow onMessage={handleMessage} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('onSend=')
      expect(normalizeCode(result!)).not.toContain('onMessage=')
    })

    it('should handle multiple onMessage props in different components', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          return (
            <div>
              <ChatWindow onMessage={handler1} />
              <ChatWindow onMessage={handler2} />
            </div>
          )
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized.match(/onSend=/g)?.length).toBe(2)
      expect(normalized).not.toContain('onMessage=')
    })
  })

  describe('Config object transformations', () => {
    it('should transform apiKey to credentials object', () => {
      const input = `
        const config = {
          apiKey: 'my-api-key',
          timeout: 5000
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('credentials:{apiKey:')
      expect(normalizeCode(result!)).toContain('timeout:5000')
    })

    it('should handle apiKey in nested objects', () => {
      const input = `
        const settings = {
          chat: {
            apiKey: process.env.API_KEY
          }
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('credentials')
    })

    it('should handle multiple apiKey occurrences', () => {
      const input = `
        const config1 = { apiKey: 'key1' }
        const config2 = { apiKey: 'key2' }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const matches = result!.match(/credentials/g)
      expect(matches?.length).toBeGreaterThanOrEqual(2)
    })

    it('should preserve non-apiKey properties', () => {
      const input = `
        const config = {
          apiKey: 'key',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('model:')
      expect(normalized).toContain('temperature:')
      expect(normalized).toContain('maxTokens:')
    })
  })

  describe('Combined transformations', () => {
    it('should apply all transformations together', () => {
      const input = `
        import { ChatWindow, useChat } from '@clarity-chat/react'

        function App() {
          const config = {
            apiKey: process.env.CLARITY_API_KEY,
            model: 'claude-3'
          }

          return (
            <ChatWindow
              onMessage={(msg) => console.log(msg)}
              config={config}
            />
          )
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)

      // Check import transformation
      expect(normalized).toContain('ChatInterface')

      // Check JSX transformation
      expect(normalized).toContain('<ChatInterface')

      // Check prop transformation
      expect(normalized).toContain('onSend=')

      // Check config transformation
      expect(normalized).toContain('credentials')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty files', () => {
      const input = ''
      const result = runTransform(transform, input)
      expect(result).toBeNull()
    })

    it('should handle files with comments', () => {
      const input = `
        // Import ChatWindow
        import { ChatWindow } from '@clarity-chat/react'

        /*
         * Use ChatWindow component
         */
        function App() {
          return <ChatWindow /> // Main chat interface
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('// Import ChatWindow')
      expect(result!).toContain('// Main chat interface')
    })

    it('should handle TypeScript type annotations', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'
        import type { ChatWindowProps } from '@clarity-chat/react'

        function App() {
          const props: ChatWindowProps = {}
          return <ChatWindow {...props} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
    })

    it('should not transform ChatWindow in strings', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          const text = "Use ChatWindow component"
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('"Use ChatWindow component"')
      expect(result!).toContain('<ChatInterface')
    })

    it('should handle ChatWindow in template literals', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          const msg = \`Using ChatWindow\`
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('`Using ChatWindow`')
      expect(result!).toContain('<ChatInterface')
    })

    it('should handle multiple components in same file', () => {
      const input = `
        import { ChatWindow, Button } from '@clarity-chat/react'

        function Chat() {
          return <ChatWindow onMessage={handler} />
        }

        function Sidebar() {
          return <ChatWindow onMessage={otherHandler} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const matches = normalizeCode(result!).match(/ChatInterface/g)
      expect(matches?.length).toBeGreaterThanOrEqual(3) // Import + 2 usages
    })

    it('should handle spread props', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          const props = { onMessage: handler }
          return <ChatWindow {...props} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('...props')
    })

    it('should handle JSX fragments', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function App() {
          return (
            <>
              <ChatWindow onMessage={handler1} />
              <ChatWindow onMessage={handler2} />
            </>
          )
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!).match(/ChatInterface/g)?.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('No-op scenarios', () => {
    it('should not transform if already using v2 API', () => {
      const input = `
        import { ChatInterface } from '@clarity-chat/react'

        function App() {
          return <ChatInterface onSend={handler} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeNull()
    })

    it('should not transform unrelated code', () => {
      const input = `
        import { useState } from 'react'

        function App() {
          const [value, setValue] = useState('')
          return <div>{value}</div>
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeNull()
    })

    it('should not transform similar but different imports', () => {
      const input = `
        import { ChatWindow } from 'other-library'

        function App() {
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeNull()
    })
  })
})
