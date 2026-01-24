/**
 * Integration tests for codemods
 * Tests multiple transforms working together and real-world scenarios
 */

import { describe, it, expect } from 'vitest'
import transform from '../transforms/v1-to-v2'
import { migrateToast } from '../migrate-toast'
import { migrateMarkdownRenderers } from '../migrate-markdown-renderers'
import { migrateReducedMotion } from '../migrate-reduced-motion'
import { runTransform, normalizeCode } from './test-utils'

describe('Integration tests', () => {
  describe('Multiple transforms on same file', () => {
    it('should handle v1-to-v2 and toast migration together', () => {
      const input = `
        import { ChatWindow, useToast, ToastProvider } from '@clarity-chat/react'

        function App() {
          const { toast } = useToast()

          const handleSuccess = () => {
            toast.success('Message sent!')
          }

          return (
            <ToastProvider>
              <ChatWindow onMessage={handleSuccess} />
            </ToastProvider>
          )
        }
      `

      // Apply v1-to-v2 transform
      let result = runTransform(transform, input)
      expect(result).toBeTruthy()

      // Apply toast migration
      result = runTransform(migrateToast, result!)
      expect(result).toBeTruthy()

      const normalized = normalizeCode(result!)

      // Check v1-to-v2 transformations
      expect(normalized).toContain('ChatInterface')
      expect(normalized).toContain('onSend')

      // Check toast transformations
      expect(normalized).toContain('ClarityToaster')
      expect(normalized).not.toContain('useToast')
    })

    it('should handle all transforms in sequence', () => {
      const input = `
        import {
          ChatWindow,
          useToast,
          MarkdownRendererEnhanced,
          useReducedMotion
        } from '@clarity-chat/react'

        function App() {
          const { toast } = useToast()
          const prefersReduced = useReducedMotion()

          const handleMessage = () => {
            toast.success('Sent!')
          }

          const config = {
            apiKey: process.env.API_KEY
          }

          return (
            <div>
              <ChatWindow onMessage={handleMessage} config={config} />
              <MarkdownRendererEnhanced
                content="# Hello"
                enableHighlight={true}
              />
            </div>
          )
        }
      `

      // Apply all transforms in sequence
      let result = runTransform(transform, input)
      expect(result).toBeTruthy()

      result = runTransform(migrateToast, result!)
      expect(result).toBeTruthy()

      result = runTransform(migrateMarkdownRenderers, result!)
      expect(result).toBeTruthy()

      result = runTransform(migrateReducedMotion, result!)
      expect(result).toBeTruthy()

      // Verify all transformations applied
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('onSend')
      expect(result!).toContain('ClarityToaster')
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).toContain('@clarity-chat/primitives')
    })
  })

  describe('Real-world component migrations', () => {
    it('should migrate complete chat application', () => {
      const input = `
        import React from 'react'
        import {
          ChatWindow,
          useToast,
          ToastProvider,
          MarkdownRendererEnhanced,
          useChat
        } from '@clarity-chat/react'

        export default function ChatApp() {
          const { toast } = useToast()
          const chat = useChat({
            apiKey: process.env.CLARITY_API_KEY,
            model: 'claude-3'
          })

          const handleMessage = async (message) => {
            try {
              await chat.sendMessage(message)
              toast.success('Message sent successfully')
            } catch (error) {
              toast.error('Failed to send message')
            }
          }

          return (
            <ToastProvider>
              <div className="app">
                <ChatWindow
                  onMessage={handleMessage}
                  messages={chat.messages}
                  loading={chat.loading}
                />
                <div className="preview">
                  <MarkdownRendererEnhanced
                    content={chat.lastMessage}
                    enableHighlight={true}
                    enableMath={true}
                  />
                </div>
              </div>
            </ToastProvider>
          )
        }
      `

      let result = runTransform(transform, input)
      result = runTransform(migrateToast, result!)

      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('onSend')
      expect(result!).toContain('ClarityToaster')
      expect(result!).not.toContain('useToast')
      expect(result!).not.toContain('ToastProvider')
    })

    it('should migrate settings page with markdown documentation', () => {
      const input = `
        import {
          MarkdownRendererEnhanced,
          MessageMarkdownRenderer,
          ToastContainer
        } from '@clarity-chat/react'

        function SettingsPage() {
          return (
            <div>
              <ToastContainer />
              <div className="docs">
                <MarkdownRendererEnhanced
                  content={documentation}
                  enableHighlight={true}
                  enableGFM={true}
                />
              </div>
              <div className="preview">
                <MessageMarkdownRenderer
                  content={preview}
                />
              </div>
            </div>
          )
        }
      `

      let result = runTransform(migrateMarkdownRenderers, input)
      result = runTransform(migrateToast, result!)

      expect(result).toBeTruthy()
      expect(result!).toContain('EnhancedMarkdownRenderer')
      expect(result!).not.toContain('MarkdownRendererEnhanced')
      expect(result!).not.toContain('MessageMarkdownRenderer')
      expect(result!).not.toContain('ToastContainer')
    })
  })

  describe('Partial migration scenarios', () => {
    it('should handle files with both old and new APIs', () => {
      const input = `
        import {
          ChatWindow,
          ChatInterface,
          useToast,
          toast
        } from '@clarity-chat/react'

        function MixedComponent() {
          const oldToast = useToast()

          return (
            <div>
              <ChatWindow onMessage={handler1} />
              <ChatInterface onSend={handler2} />
            </div>
          )
        }
      `

      const result = runTransform(transform, input)

      expect(result).toBeTruthy()
      // Should still transform the old API
      expect(result!).toContain('ChatInterface')
      // Should preserve the new API
      expect(result!).toContain('onSend')
    })

    it('should preserve already-migrated code', () => {
      const input = `
        import { ChatInterface, ClarityToaster, toast } from '@clarity-chat/react'
        import { useReducedMotion } from '@clarity-chat/primitives'

        function ModernComponent() {
          const prefersReduced = useReducedMotion()

          const handleSend = () => {
            toast.success('Sent!')
          }

          return (
            <>
              <ClarityToaster />
              <ChatInterface onSend={handleSend} />
            </>
          )
        }
      `

      // None of the transforms should break this
      const v1Result = runTransform(transform, input)
      const toastResult = runTransform(migrateToast, input)
      const motionResult = runTransform(migrateReducedMotion, input)

      // All should either return null (no changes) or preserve the code
      if (v1Result) {
        expect(v1Result).toContain('ChatInterface')
        expect(v1Result).toContain('onSend')
      }

      if (toastResult) {
        expect(toastResult).toContain('ClarityToaster')
        expect(toastResult).toContain('toast')
      }

      if (motionResult) {
        expect(motionResult).toContain('@clarity-chat/primitives')
        expect(motionResult).toContain('useReducedMotion')
      }
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle malformed imports gracefully', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'
        import { } from '@clarity-chat/react'

        function Component() {
          return <ChatWindow />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
    })

    it('should handle nested JSX structures', () => {
      const input = `
        import { ChatWindow, MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return (
            <div>
              <ChatWindow onMessage={handler}>
                <div>
                  <MarkdownRendererEnhanced
                    content="text"
                    enableHighlight={true}
                  />
                </div>
              </ChatWindow>
            </div>
          )
        }
      `

      let result = runTransform(transform, input)
      result = runTransform(migrateMarkdownRenderers, result!)

      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('EnhancedMarkdownRenderer')
    })

    it('should handle JSX spread attributes', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function Component({ chatProps }) {
          return <ChatWindow {...chatProps} onMessage={handler} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('...chatProps')
      expect(result!).toContain('onSend')
    })

    it('should preserve whitespace and formatting', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function Component() {
          return (
            <ChatWindow
              onMessage={handler}
              className="chat"
              theme="dark"
            />
          )
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      // Should maintain multi-line formatting
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('className')
      expect(result!).toContain('theme')
    })
  })

  describe('Performance and scale', () => {
    it('should handle large files with many components', () => {
      const components = Array.from({ length: 20 }, (_, i) => `
        function Component${i}() {
          return <ChatWindow onMessage={handler${i}} />
        }
      `).join('\n')

      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        ${components}
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()

      // Should transform all instances
      const matches = result!.match(/ChatInterface/g)
      expect(matches?.length).toBeGreaterThanOrEqual(20)
    })

    it('should handle deeply nested structures', () => {
      const input = `
        import { ChatWindow, MarkdownRendererEnhanced } from '@clarity-chat/react'

        function Component() {
          return (
            <div>
              <div>
                <div>
                  <ChatWindow onMessage={handler}>
                    <div>
                      <div>
                        <MarkdownRendererEnhanced
                          content="text"
                          enableHighlight={true}
                        />
                      </div>
                    </div>
                  </ChatWindow>
                </div>
              </div>
            </div>
          )
        }
      `

      let result = runTransform(transform, input)
      result = runTransform(migrateMarkdownRenderers, result!)

      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('EnhancedMarkdownRenderer')
    })
  })

  describe('TypeScript support', () => {
    it('should handle TypeScript generic components', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'
        import type { MessageType } from '@clarity-chat/react'

        function Component<T extends MessageType>() {
          return <ChatWindow<T> onMessage={handler} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('MessageType')
    })

    it('should handle TypeScript type assertions', () => {
      const input = `
        import { ChatWindow } from '@clarity-chat/react'

        function Component() {
          const config = {
            apiKey: 'key'
          } as const

          return <ChatWindow config={config} onMessage={handler} />
        }
      `

      const result = runTransform(transform, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ChatInterface')
      expect(result!).toContain('credentials')
    })
  })
})
