/**
 * AdvancedChatInput Performance Regression Tests
 *
 * Tests for ISSUE-018: AdvancedChatInput Debounce Lag
 * Ensures visual feedback is immediate while expensive operations are properly debounced.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdvancedChatInput } from '../AdvancedChatInput'

// Mock useDebounce to control timing in tests
vi.mock('../../hooks/ui/use-debounce', () => ({
  useDebounce: vi.fn((value: string, delay: number) => value), // Return immediate value for visual feedback tests
}))

describe('AdvancedChatInput Performance Regression', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visual Feedback Performance', () => {
    it('renders text immediately without debounce lag', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <AdvancedChatInput value="" onChange={onChange} onSubmit={() => {}} />
      )

      const textarea = screen.getByRole('textbox')

      // Type rapidly - should update immediately
      await user.type(textarea, 'hello world')

      // Should call onChange immediately for each keystroke (immediate visual feedback)
      expect(onChange).toHaveBeenCalledTimes(11) // 'h' 'e' 'l' 'l' 'o' ' ' 'w' 'o' 'r' 'l' 'd'
      expect(onChange).toHaveBeenLastCalledWith('hello world')
    })

    it('maintains responsive typing experience', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <AdvancedChatInput value="" onChange={onChange} onSubmit={() => {}} />
      )

      const textarea = screen.getByRole('textbox')

      // Simulate rapid typing
      const startTime = Date.now()
      await user.type(textarea, 'typing rapidly here')
      const endTime = Date.now()

      // Should complete within reasonable time (no debouncing blocking visual updates)
      expect(endTime - startTime).toBeLessThan(500) // Should be fast
      expect(onChange).toHaveBeenCalledTimes(18) // All characters typed
    })

    it('handles backspace and cursor movement immediately', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <AdvancedChatInput
          value="initial text"
          onChange={onChange}
          onSubmit={() => {}}
        />
      )

      const textarea = screen.getByRole('textbox')

      // Move cursor and delete
      await user.type(
        textarea,
        '{backspace}{backspace}{backspace}{backspace}{backspace}'
      )

      // Should update immediately
      expect(onChange).toHaveBeenLastCalledWith('initial')
    })
  })

  describe('Suggestion Loading Performance', () => {
    it('does not trigger excessive suggestion requests during rapid typing', async () => {
      const onSuggestionRequest = vi.fn().mockResolvedValue([])
      const onChange = vi.fn()

      render(
        <AdvancedChatInput
          value=""
          onChange={onChange}
          onSubmit={() => {}}
          onSuggestionRequest={onSuggestionRequest}
        />
      )

      const textarea = screen.getByRole('textbox')

      // Type rapidly to trigger suggestions
      await user.type(textarea, '@rapidtyping')

      // With debouncing, should not call API for every keystroke
      await waitFor(
        () => {
          // API should be called at most once or twice due to debouncing
          expect(onSuggestionRequest).toHaveBeenCalledTimes(1)
        },
        { timeout: 300 }
      )
    })

    it('maintains suggestion functionality after debounce', async () => {
      const suggestions = [
        {
          id: '1',
          type: 'prompt' as const,
          label: 'test',
          value: 'test content',
        },
      ]
      const onSuggestionRequest = vi.fn().mockResolvedValue(suggestions)
      const onChange = vi.fn()

      render(
        <AdvancedChatInput
          value=""
          onChange={onChange}
          onSubmit={() => {}}
          onSuggestionRequest={onSuggestionRequest}
        />
      )

      const textarea = screen.getByRole('textbox')

      // Type @ to trigger suggestions
      await user.type(textarea, '@test')

      // Wait for debounced suggestion loading
      await waitFor(() => {
        expect(onSuggestionRequest).toHaveBeenCalledWith('test', '@')
      })

      // Should show suggestions after debounce delay
      await waitFor(() => {
        expect(screen.getByText('test')).toBeInTheDocument()
      })
    })
  })

  describe('Performance Edge Cases', () => {
    it('handles long text input efficiently', async () => {
      const onChange = vi.fn()
      const longText = 'a'.repeat(1000)

      const { rerender } = render(
        <AdvancedChatInput value="" onChange={onChange} onSubmit={() => {}} />
      )

      const textarea = screen.getByRole('textbox')

      // Type long text
      await user.type(textarea, longText)

      // Should handle without performance degradation
      expect(onChange).toHaveBeenCalledTimes(1000)
      expect(onChange).toHaveBeenLastCalledWith(longText)
    })

    it('maintains performance with many saved prompts', async () => {
      const manyPrompts = Array.from({ length: 100 }, (_, i) => ({
        id: `prompt-${i}`,
        userId: 'user1',
        name: `prompt-${i}`,
        content: `Content ${i}`,
        description: `Description ${i}`,
        category: 'Test',
        tags: [`tag${i}`],
        variables: [],
        usageCount: i,
        isFavorite: i % 10 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      const onChange = vi.fn()

      render(
        <AdvancedChatInput
          value=""
          onChange={onChange}
          onSubmit={() => {}}
          savedPrompts={manyPrompts}
        />
      )

      const textarea = screen.getByRole('textbox')

      // Type @ to trigger prompt suggestions
      await user.type(textarea, '@prompt-50')

      // Should filter efficiently without blocking UI
      await waitFor(() => {
        expect(screen.getByText('prompt-50')).toBeInTheDocument()
      })
    })

    it('handles rapid suggestion navigation', async () => {
      const suggestions = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        type: 'command' as const,
        label: `command-${i}`,
        value: `cmd-${i}`,
      }))

      const onSuggestionRequest = vi.fn().mockResolvedValue(suggestions)
      const onChange = vi.fn()

      render(
        <AdvancedChatInput
          value=""
          onChange={onChange}
          onSubmit={() => {}}
          onSuggestionRequest={onSuggestionRequest}
        />
      )

      const textarea = screen.getByRole('textbox')

      // Trigger suggestions
      await user.type(textarea, '/cmd')

      await waitFor(() => {
        expect(screen.getByText('command-0')).toBeInTheDocument()
      })

      // Rapid arrow key navigation should be smooth
      const startTime = Date.now()
      await user.keyboard('{arrowdown}{arrowdown}{arrowdown}{arrowup}{arrowup}')
      const endTime = Date.now()

      // Should handle navigation quickly
      expect(endTime - startTime).toBeLessThan(200)
    })
  })
})
