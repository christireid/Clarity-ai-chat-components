/**
 * Tests for useChat to useClarityChat migration transform
 */

import { describe, it, expect } from 'vitest'
import transform from '../../transforms/use-chat-to-use-clarity-chat'
import { runTransform, normalizeCode } from '../test-utils'

describe('useChat to useClarityChat migration', () => {
  describe('Import transformations', () => {
    it('should rename useChat to useClarityChat in imports', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('import{useClarityChat}from')
      expect(result!).not.toContain('useChat')
    })

    it('should handle aliased imports', () => {
      const input = `
        import { useChat as useMyChatHook } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat')
    })

    it('should preserve other imports', () => {
      const input = `
        import { useChat, Button, Input } from '@clarity-chat/react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('useClarityChat')
      expect(normalized).toContain('Button')
      expect(normalized).toContain('Input')
      expect(normalized).not.toContain('useChat')
    })

    it('should handle multiple imports on separate lines', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'
        import { useState } from 'react'
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat')
      expect(result!).toContain('useState')
    })
  })

  describe('Hook call transformations', () => {
    it('should transform useChat() calls to useClarityChat()', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('useClarityChat()')
      expect(result!).not.toContain('useChat()')
    })

    it('should transform useChat with arguments', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const chat = useChat({
            apiKey: 'test-key',
            model: 'claude-3'
          })
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat({')
      expect(result!).toContain('apiKey')
      expect(result!).toContain('model')
    })

    it('should transform destructured hook calls', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const { messages, sendMessage } = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat()')
      expect(result!).toContain('messages')
      expect(result!).toContain('sendMessage')
    })

    it('should handle multiple hook calls in same component', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const chat1 = useChat({ id: 'chat1' })
          const chat2 = useChat({ id: 'chat2' })
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const matches = result!.match(/useClarityChat/g)
      expect(matches?.length).toBeGreaterThanOrEqual(3) // Import + 2 calls
    })
  })

  describe('Hook calls in expressions', () => {
    it('should transform hook calls in inline expressions', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          return <ChatDisplay messages={useChat().messages} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat()')
    })

    it('should transform hook calls in conditionals', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component({ enabled }) {
          const chat = enabled ? useChat() : null
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat()')
    })

    it('should transform hook calls in callbacks', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const createChat = () => {
            const chat = useChat()
            return chat
          }
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat()')
    })
  })

  describe('Complex scenarios', () => {
    it('should handle hook with complex configuration', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const chat = useChat({
            apiKey: process.env.API_KEY,
            model: 'claude-3',
            temperature: 0.7,
            maxTokens: 1000,
            onError: (error) => console.error(error),
            onSuccess: (data) => console.log(data)
          })
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat({')
      expect(result!).toContain('process.env.API_KEY')
      expect(result!).toContain('onError')
      expect(result!).toContain('onSuccess')
    })

    it('should handle hook with spread props', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component({ chatConfig }) {
          const chat = useChat({
            ...chatConfig,
            model: 'claude-3'
          })
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat({')
      expect(result!).toContain('...chatConfig')
    })

    it('should handle hook in custom hooks', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'
        import { useState } from 'react'

        function useCustomChat(options) {
          const chat = useChat(options)
          const [state, setState] = useState()

          return {
            ...chat,
            state,
            setState
          }
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat(')
      expect(result!).toContain('useState')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty files', () => {
      const input = ''
      const result = runTransform(transform, input)
      expect(result).toBe('')
    })

    it('should handle files with comments', () => {
      const input = `
        // Import the chat hook
        import { useChat } from '@clarity-chat/react'

        function Component() {
          // Initialize chat
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('// Import the chat hook')
      expect(result!).toContain('// Initialize chat')
      expect(result!).toContain('useClarityChat')
    })

    it('should handle TypeScript types', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'
        import type { ChatOptions } from '@clarity-chat/react'

        function Component() {
          const options: ChatOptions = { model: 'claude-3' }
          const chat = useChat(options)
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat(')
      expect(result!).toContain('ChatOptions')
    })

    it('should not transform useChat in strings', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Component() {
          const description = "This component uses useChat hook"
          const chat = useChat()
          return <div>{description}</div>
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('"This component uses useChat hook"')
      expect(result!).toContain('useClarityChat()')
    })

    it('should handle multiple components in same file', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        function Chat1() {
          const chat = useChat()
          return <div />
        }

        function Chat2() {
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      const matches = result!.match(/useClarityChat/g)
      expect(matches?.length).toBeGreaterThanOrEqual(3) // Import + 2 calls
    })

    it('should handle hook with default export', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        export default function Component() {
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat')
      expect(result!).toContain('export default')
    })

    it('should handle hook with named export', () => {
      const input = `
        import { useChat } from '@clarity-chat/react'

        export function Component() {
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat')
      expect(result!).toContain('export function')
    })
  })

  describe('No-op scenarios', () => {
    it('should not transform if already using useClarityChat', () => {
      const input = `
        import { useClarityChat } from '@clarity-chat/react'

        function Component() {
          const chat = useClarityChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      // Should return empty string or original source
      expect(result).toBeTruthy()
      expect(result!).toContain('useClarityChat')
    })

    it('should not transform unrelated code', () => {
      const input = `
        import { useState } from 'react'

        function Component() {
          const [value, setValue] = useState('')
          return <div />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result).toContain('useState')
    })

    it('should not transform useChat from other libraries', () => {
      const input = `
        import { useChat } from 'other-chat-library'

        function Component() {
          const chat = useChat()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      // Should not modify other library imports
      expect(result).toBeTruthy()
      expect(result).toContain('other-chat-library')
    })

    it('should not transform similar hook names', () => {
      const input = `
        import { useChats, useChatbot } from '@clarity-chat/react'

        function Component() {
          const chats = useChats()
          const bot = useChatbot()
          return <div />
        }
      `

      const result = runTransform(transform, input)
      // Should not transform hooks with similar but different names
      if (result) {
        expect(result).toContain('useChats')
        expect(result).toContain('useChatbot')
      }
    })
  })
})
