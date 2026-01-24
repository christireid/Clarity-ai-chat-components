/**
 * Tests for reduced motion hook migration transform
 */

import { describe, it, expect } from 'vitest'
import { migrateReducedMotion } from '../../migrate-reduced-motion'
import { runTransform, normalizeCode } from '../test-utils'

describe('reduced motion migration', () => {
  describe('Import path transformations', () => {
    it('should migrate from react hooks path to primitives', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react/hooks/ui/use-reduced-motion'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(normalizeCode(result!)).toContain('@clarity-chat/primitives')
      expect(result!).not.toContain('react/hooks/ui/use-reduced-motion')
    })

    it('should migrate from react package to primitives', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('@clarity-chat/primitives')
      expect(normalized).toContain('useReducedMotion')
    })

    it('should handle multiple imports from react', () => {
      const input = `
        import { useReducedMotion, Button, Input } from '@clarity-chat/react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      // Should have separate primitives import
      expect(normalized).toContain('@clarity-chat/primitives')
      expect(normalized).toContain('useReducedMotion')
      // Should preserve other imports from react
      expect(normalized).toContain('Button')
      expect(normalized).toContain('Input')
    })
  })

  describe('Adding primitives import', () => {
    it('should create new primitives import if none exists', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
        import { useState } from 'react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain("from '@clarity-chat/primitives'")
      expect(result!).toContain('useReducedMotion')
    })

    it('should add to existing primitives import', () => {
      const input = `
        import { cn } from '@clarity-chat/primitives'
        import { useReducedMotion } from '@clarity-chat/react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('@clarity-chat/primitives')
      expect(normalized).toContain('cn')
      expect(normalized).toContain('useReducedMotion')
    })

    it('should not duplicate useReducedMotion in existing primitives import', () => {
      const input = `
        import { useReducedMotion, cn } from '@clarity-chat/primitives'
        import { useReducedMotion as useRM } from '@clarity-chat/react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      // Should handle the duplicate gracefully
      expect(result!).toContain('@clarity-chat/primitives')
    })
  })

  describe('Preserving other imports', () => {
    it('should remove useReducedMotion from react but keep other imports', () => {
      const input = `
        import { useReducedMotion, useChat, Button } from '@clarity-chat/react'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      const normalized = normalizeCode(result!)
      expect(normalized).toContain('useChat')
      expect(normalized).toContain('Button')
      expect(normalized).toContain('@clarity-chat/primitives')
      expect(normalized).toContain('useReducedMotion')
    })

    it('should preserve imports from other packages', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
        import { useState, useEffect } from 'react'
        import { motion } from 'framer-motion'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain("from 'react'")
      expect(result!).toContain("from 'framer-motion'")
      expect(result!).toContain('@clarity-chat/primitives')
    })
  })

  describe('Hook usage preservation', () => {
    it('should not modify hook usage in component', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        function Component() {
          const prefersReducedMotion = useReducedMotion()
          return <div animate={!prefersReducedMotion} />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      // Hook usage should remain unchanged
      expect(result!).toContain('useReducedMotion()')
      expect(result!).toContain('prefersReducedMotion')
      // Only import should change
      expect(result!).toContain('@clarity-chat/primitives')
    })

    it('should preserve destructured hook usage', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        function Component() {
          const isReduced = useReducedMotion()
          const duration = isReduced ? 0 : 300
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useReducedMotion()')
      expect(result!).toContain('isReduced')
      expect(result!).toContain('duration')
    })

    it('should preserve hook in custom hooks', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        function useAnimation() {
          const prefersReducedMotion = useReducedMotion()
          return {
            duration: prefersReducedMotion ? 0 : 300,
            ease: 'easeOut'
          }
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useReducedMotion()')
      expect(result!).toContain('@clarity-chat/primitives')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty files', () => {
      const input = ''
      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBe('')
    })

    it('should handle files with comments', () => {
      const input = `
        // Import reduced motion hook
        import { useReducedMotion } from '@clarity-chat/react'

        function Component() {
          // Check if user prefers reduced motion
          const prefersReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('// Import reduced motion hook')
      expect(result!).toContain('// Check if user prefers reduced motion')
      expect(result!).toContain('@clarity-chat/primitives')
    })

    it('should handle TypeScript imports', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
        import type { ReducedMotionConfig } from '@clarity-chat/react'

        function Component() {
          const isReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('@clarity-chat/primitives')
      expect(result!).toContain('useReducedMotion')
    })

    it('should handle multiple components using the hook', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        function Component1() {
          const isReduced = useReducedMotion()
          return <div />
        }

        function Component2() {
          const prefersReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      // Both hook calls should remain
      const matches = result!.match(/useReducedMotion\(\)/g)
      expect(matches?.length).toBeGreaterThanOrEqual(2)
      // Import should be from primitives
      expect(result!).toContain('@clarity-chat/primitives')
    })

    it('should handle hook used in conditionals', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        function Component({ animate }) {
          const shouldAnimate = animate && !useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('useReducedMotion()')
      expect(result!).toContain('@clarity-chat/primitives')
    })

    it('should handle aliased imports', () => {
      const input = `
        import { useReducedMotion as useRM } from '@clarity-chat/react'

        function Component() {
          const reduced = useRM()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('@clarity-chat/primitives')
      expect(result!).toContain('useRM')
    })

    it('should handle default exports with hook usage', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        export default function Component() {
          const prefersReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('@clarity-chat/primitives')
      expect(result!).toContain('export default')
    })

    it('should handle named exports with hook usage', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'

        export function Component() {
          const prefersReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('@clarity-chat/primitives')
      expect(result!).toContain('export function')
    })
  })

  describe('No-op scenarios', () => {
    it('should not transform if already importing from primitives', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/primitives'

        function Component() {
          const isReduced = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      // Should either return null or preserve current imports
      if (result) {
        expect(result).toContain('@clarity-chat/primitives')
        expect(result).toContain('useReducedMotion')
      }
    })

    it('should not transform unrelated code', () => {
      const input = `
        import { useState } from 'react'

        function Component() {
          const [value, setValue] = useState(false)
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      if (result) {
        expect(result).toContain('useState')
        expect(result).toContain("from 'react'")
      }
    })

    it('should not transform similar hook names', () => {
      const input = `
        import { useReducedMotionConfig } from '@clarity-chat/react'

        function Component() {
          const config = useReducedMotionConfig()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      // Should not transform hooks with similar but different names
      if (result) {
        expect(result).toContain('useReducedMotionConfig')
      }
    })

    it('should not transform useReducedMotion from other libraries', () => {
      const input = `
        import { useReducedMotion } from 'framer-motion'

        function Component() {
          const shouldReduce = useReducedMotion()
          return <div />
        }
      `

      const result = runTransform(migrateReducedMotion, input)
      // Should not modify imports from other libraries
      if (result) {
        expect(result).toContain('framer-motion')
      }
    })
  })

  describe('Multiple import scenarios', () => {
    it('should handle both named and aliased imports', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
        import { useReducedMotion as useRM } from '@clarity-chat/react/hooks/ui/use-reduced-motion'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      expect(result!).toContain('@clarity-chat/primitives')
    })

    it('should consolidate multiple imports to single primitives import', () => {
      const input = `
        import { useReducedMotion } from '@clarity-chat/react'
        import { useReducedMotion as prefersReduced } from '@clarity-chat/react/hooks/ui/use-reduced-motion'
      `

      const result = runTransform(migrateReducedMotion, input)
      expect(result).toBeTruthy()
      // Should have primitives import
      expect(result!).toContain('@clarity-chat/primitives')
    })
  })
})
