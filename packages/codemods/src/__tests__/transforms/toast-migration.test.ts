/**
 * Tests for toast migration transform
 */

import { describe, it, expect } from 'vitest'
import { migrateToast } from '../../migrate-toast'
import { runTransform, normalizeCode } from '../test-utils'

describe('toast migration transform', () => {
  describe('Import transformations', () => {
    it('should replace useToast with toast and ClarityToaster', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('ClarityToaster')
      expect(normalized).toContain('toast')
      expect(normalized).not.toContain('useToast')
    })

    it('should remove ToastProvider import', () => {
      const input = `
        import { ToastProvider } from '@clarity-chat/react'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('ToastProvider')
    })

    it('should remove ToastContainer import', () => {
      const input = `
        import { ToastContainer } from '@clarity-chat/react'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('ToastContainer')
    })

    it('should handle multiple toast-related imports', () => {
      const input = `
        import { useToast, ToastProvider, ToastContainer } from '@clarity-chat/react'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('ClarityToaster')
      expect(normalized).toContain('toast')
      expect(normalized).not.toContain('useToast')
      expect(normalized).not.toContain('ToastProvider')
      expect(normalized).not.toContain('ToastContainer')
    })

    it('should preserve other imports from same package', () => {
      const input = `
        import { useToast, Button, Input } from '@clarity-chat/react'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('Button')
      expect(normalized).toContain('Input')
      expect(normalized).toContain('ClarityToaster')
      expect(normalized).toContain('toast')
    })

    it('should handle alternate package name', () => {
      const input = `
        import { useToast } from '@clarity/chat-components'
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ClarityToaster')
      expect(result!).toContain('toast')
    })
  })

  describe('JSX transformations', () => {
    it('should replace ToastProvider with ClarityToaster', () => {
      const input = `
        import { ToastProvider } from '@clarity-chat/react'

        function App() {
          return (
            <ToastProvider>
              <div>Content</div>
            </ToastProvider>
          )
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('<ClarityToaster/>')
      expect(result!).not.toContain('ToastProvider')
    })

    it('should remove ToastContainer elements', () => {
      const input = `
        import { ToastContainer } from '@clarity-chat/react'

        function App() {
          return (
            <div>
              <ToastContainer />
              <Content />
            </div>
          )
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('ToastContainer')
      expect(result!).toContain('Content')
    })

    it('should handle ToastProvider with props', () => {
      const input = `
        import { ToastProvider } from '@clarity-chat/react'

        function App() {
          return (
            <ToastProvider position="top-right" duration={3000}>
              <Content />
            </ToastProvider>
          )
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('ClarityToaster')
      expect(result!).not.toContain('ToastProvider')
    })
  })

  describe('Hook usage transformations', () => {
    it('should remove useToast hook destructuring', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()
          return <div>Content</div>
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      // The destructuring should be removed since toast is now a direct import
      expect(result!).not.toContain('useToast()')
    })

    it('should handle showToast alias', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { showToast } = useToast()
          return <div>Content</div>
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('useToast()')
    })
  })

  describe('Toast method call transformations', () => {
    it('should preserve toast.success() calls', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()

          const handleClick = () => {
            toast.success('Success message')
          }

          return <button onClick={handleClick}>Click</button>
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      // Method calls should be preserved as Sonner uses the same API
      expect(result!).toContain('toast.success')
    })

    it('should preserve toast.error() calls', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()
          toast.error('Error message')
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.error')
    })

    it('should preserve toast.info() calls', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()
          toast.info('Info message')
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.info')
    })

    it('should preserve toast.warning() calls', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()
          toast.warning('Warning message')
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.warning')
    })

    it('should handle multiple toast calls', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()

          const handleSuccess = () => toast.success('Success')
          const handleError = () => toast.error('Error')
          const handleInfo = () => toast.info('Info')

          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.success')
      expect(result!).toContain('toast.error')
      expect(result!).toContain('toast.info')
    })
  })

  describe('Combined transformations', () => {
    it('should apply all transformations together', () => {
      const input = `
        import { useToast, ToastProvider } from '@clarity-chat/react'

        function App() {
          return (
            <ToastProvider>
              <Component />
            </ToastProvider>
          )
        }

        function Component() {
          const { toast } = useToast()

          const handleClick = () => {
            toast.success('Operation completed')
          }

          return <button onClick={handleClick}>Click</button>
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)

      // Check import transformation
      expect(normalized).toContain('ClarityToaster')
      expect(normalized).toContain('toast')
      expect(normalized).not.toContain('useToast')
      expect(normalized).not.toContain('ToastProvider')

      // Check JSX transformation
      expect(result!).toContain('ClarityToaster')

      // Check toast calls preserved
      expect(result!).toContain('toast.success')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty files', () => {
      const input = ''
      const result = runTransform(migrateToast, input)
      expect(result).toBe('')
    })

    it('should handle files with comments', () => {
      const input = `
        // Import toast functionality
        import { useToast } from '@clarity-chat/react'

        /*
         * Component using toast
         */
        function Component() {
          const { toast } = useToast() // Get toast
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('// Import toast functionality')
      expect(result!).toContain('/*')
    })

    it('should handle nested ToastProvider', () => {
      const input = `
        import { ToastProvider } from '@clarity-chat/react'

        function App() {
          return (
            <div>
              <ToastProvider>
                <div>
                  <ToastProvider>
                    <Content />
                  </ToastProvider>
                </div>
              </ToastProvider>
            </div>
          )
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).not.toContain('ToastProvider')
      expect(result!).toContain('ClarityToaster')
    })

    it('should handle toast in conditionals', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component({ success }) {
          const { toast } = useToast()

          if (success) {
            toast.success('Success')
          } else {
            toast.error('Error')
          }

          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.success')
      expect(result!).toContain('toast.error')
    })

    it('should handle toast in callbacks', () => {
      const input = `
        import { useToast } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()

          const handleAsync = async () => {
            try {
              await doSomething()
              toast.success('Done')
            } catch (error) {
              toast.error('Failed')
            }
          }

          return <button onClick={handleAsync}>Click</button>
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('toast.success')
      expect(result!).toContain('toast.error')
    })

    it('should not add duplicate imports', () => {
      const input = `
        import { useToast, ClarityToaster } from '@clarity-chat/react'

        function Component() {
          const { toast } = useToast()
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      expect(result).toBeTruthy()
      // Should not duplicate ClarityToaster import
      const matches = result!.match(/ClarityToaster/g)
      expect(matches?.length).toBeLessThanOrEqual(2) // Import + potential usage
    })
  })

  describe('No-op scenarios', () => {
    it('should not transform if already using new API', () => {
      const input = `
        import { toast, ClarityToaster } from '@clarity-chat/react'

        function Component() {
          toast.success('Success')
          return <ClarityToaster />
        }
      `

      const result = runTransform(migrateToast, input)
      // May still return result if hasChanges flag is set
      // Main check is that output is valid and doesn't break
      if (result) {
        expect(result).toContain('toast')
        expect(result).toContain('ClarityToaster')
      }
    })

    it('should not transform unrelated code', () => {
      const input = `
        import { useState } from 'react'

        function Component() {
          const [value, setValue] = useState('')
          return <input value={value} onChange={e => setValue(e.target.value)} />
        }
      `

      const result = runTransform(migrateToast, input)
      // Should either be null or unchanged
      if (result) {
        expect(result).toContain('useState')
        expect(result).toContain('setValue')
      }
    })

    it('should not transform toast from other libraries', () => {
      const input = `
        import { toast } from 'react-hot-toast'

        function Component() {
          toast.success('Success')
          return <div />
        }
      `

      const result = runTransform(migrateToast, input)
      // Should not modify imports from other libraries
      if (result) {
        expect(result).toContain('react-hot-toast')
      }
    })
  })
})
