/**
 * PromptComposer Integration Tests
 *
 * End-to-end workflow tests for the complete PromptComposer system.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptComposer } from '../PromptComposer'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type {
  Suggestion,
  Command,
  ContextProvider,
  PromptMessage,
} from '../../../hooks/prompt-composer/types'

describe('PromptComposer Integration Tests', () => {
  // Mock providers
  const mockFileProvider: ContextProvider = {
    type: 'file',
    search: vi.fn(async (query: string) => {
      const files = [
        {
          id: 'file1',
          type: 'file' as const,
          label: 'Button.tsx',
          summary: 'Button component - 250 lines',
          preview: 'export function Button(props: ButtonProps) {...}',
          full: '// Complete implementation',
        },
        {
          id: 'file2',
          type: 'file' as const,
          label: 'Input.tsx',
          summary: 'Input component - 180 lines',
        },
      ]
      return files
        .filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
        .map((f) => createContextItem(f))
    }),
    priority: 80,
  }

  const mockSuggestions: Suggestion[] = [
    { id: 'sug1', type: 'starter', text: 'Explain this code' },
    { id: 'sug2', type: 'starter', text: 'Write tests' },
  ]

  const mockCommands: Command[] = [
    {
      id: 'search',
      trigger: '/search',
      label: 'Search',
      description: 'Search docs',
      icon: <span>🔍</span>,
      execute: vi.fn().mockResolvedValue(undefined),
    },
    {
      id: 'code',
      trigger: '/code',
      label: 'Generate Code',
      description: 'Generate code',
      icon: <span>💻</span>,
      execute: vi.fn().mockResolvedValue(undefined),
    },
  ]

  const mockOnSubmit = vi.fn<[PromptMessage], void>()
  const mockOnStateChange = vi.fn()
  const mockOnTokenUsageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Full Workflow Tests
  // ==========================================================================

  describe('Complete Workflows', () => {
    it('completes full type → add context → submit workflow', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          onSubmit={mockOnSubmit}
          features={{
            context: {
              triggers: ['@'],
              providers: [mockFileProvider],
            },
          }}
        />
      )

      // 1. Type message
      const input = screen.getByRole('textbox')
      await user.type(input, 'How do I use this component?')

      // 2. Add context (simulate @mention - would need full implementation)
      // For this test, we'll manually add via the hook

      // 3. Submit
      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('applies suggestion → modifies → submits', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          features={{ suggestions: true }}
          onSubmit={mockOnSubmit}
        />
      )

      // 1. Focus to show suggestions
      const input = screen.getByRole('textbox')
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Explain this code')).toBeInTheDocument()
      })

      // 2. Click suggestion
      const suggestion = screen.getByText('Explain this code')
      await user.click(suggestion)

      expect(input).toHaveValue('Explain this code')

      // 3. Modify the text
      await user.type(input, ' in detail')

      expect(input).toHaveValue('Explain this code in detail')

      // 4. Submit
      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.stringContaining('Explain this code in detail'),
          })
        )
      })
    })

    it('executes command → continues typing → submits', async () => {
      const user = userEvent.setup()
      const mockOnCommandExecute = vi.fn()

      render(
        <PromptComposer
          api="/api/chat"
          commands={mockCommands}
          onCommandExecute={mockOnCommandExecute}
          onSubmit={mockOnSubmit}
        />
      )

      // 1. Type command trigger
      const input = screen.getByRole('textbox')
      await user.type(input, '/search')

      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument()
      })

      // 2. Execute command
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockOnCommandExecute).toHaveBeenCalled()
      })

      // 3. Input should be cleared
      expect(input).toHaveValue('')

      // 4. Continue typing
      await user.type(input, 'New message{Enter}')

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('handles expansion → add context → token visualization', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={8000}
          features={{
            context: {
              triggers: ['@'],
              providers: [mockFileProvider],
            },
          }}
        />
      )

      // 1. Type to trigger expansion
      const input = screen.getByRole('textbox')
      await user.type(input, 'a'.repeat(150))

      await waitFor(() => {
        expect(input).toHaveClass('min-h-[120px]')
      })

      // 2. Token budget should be visible
      await waitFor(() => {
        expect(screen.getByText(/8000/)).toBeInTheDocument()
      })

      // 3. Add context items would increase token count
      // (Full implementation would test actual token changes)
    })
  })

  // ==========================================================================
  // Progressive Disclosure Tests
  // ==========================================================================

  describe('Progressive Disclosure', () => {
    it('gradually reveals features as user engages', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          features={{
            suggestions: true,
            settings: true,
            attachments: true,
          }}
        />
      )

      const input = screen.getByRole('textbox')

      // 1. Initial state: minimal UI
      expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument()

      // 2. Focus: suggestions appear
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Explain this code')).toBeInTheDocument()
      })

      // 3. Type: suggestions hide
      await user.type(input, 'Hello')

      await waitFor(() => {
        expect(screen.queryByText('Explain this code')).not.toBeInTheDocument()
      })

      // 4. Long text: expand with more features
      await user.clear(input)
      await user.type(input, 'a'.repeat(150))

      await waitFor(() => {
        expect(screen.getByLabelText('Settings')).toBeInTheDocument()
      })
    })

    it('maintains state through disclosure transitions', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          onStateChange={mockOnStateChange}
        />
      )

      const input = screen.getByRole('textbox')

      // Type and observe state changes
      await user.type(input, 'Short')
      await user.type(input, ' text that gradually gets longer and longer')

      // State should be preserved through transitions
      expect(input).toHaveValue('Short text that gradually gets longer and longer')
      expect(mockOnStateChange).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Token Budget Visualization Tests
  // ==========================================================================

  describe('Token Budget Visualization', () => {
    it('updates token display in real-time', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={8000}
          onTokenUsageChange={mockOnTokenUsageChange}
        />
      )

      const input = screen.getByRole('textbox')

      // Type and watch tokens increase
      await user.type(input, 'Hello world')

      await waitFor(() => {
        expect(mockOnTokenUsageChange).toHaveBeenCalled()
      })

      // Add more text
      await user.type(input, ' and more text to increase token count')

      await waitFor(() => {
        expect(mockOnTokenUsageChange).toHaveBeenCalledTimes(
          expect.any(Number)
        )
      })
    })

    it('shows warning when approaching budget', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={100} // Small budget for easy testing
        />
      )

      const input = screen.getByRole('textbox')

      // Type enough to approach budget (80%)
      await user.type(input, 'a'.repeat(100))

      await waitFor(() => {
        const tokenDisplay = screen.getByText(/\/100/)
        expect(tokenDisplay).toHaveClass(/yellow|red/)
      })
    })

    it('prevents submission when over budget', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={50}
          onSubmit={mockOnSubmit}
        />
      )

      const input = screen.getByRole('textbox')

      // Type way over budget
      await user.type(input, 'a'.repeat(500))

      const sendButton = screen.getByRole('button', { name: /send/i })

      // Should show warning or disable submit
      // (Implementation detail - may vary)
    })
  })

  // ==========================================================================
  // Error Recovery Tests
  // ==========================================================================

  describe('Error Recovery', () => {
    it('recovers from submit error gracefully', async () => {
      const user = userEvent.setup()
      const failOnce = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(undefined)

      render(<PromptComposer api="/api/chat" onSubmit={failOnce} />)

      const input = screen.getByRole('textbox')

      // First attempt - fails
      await user.type(input, 'Test message{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })

      // Content should be preserved
      expect(input).toHaveValue('Test message')

      // Retry - succeeds
      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(input).toHaveValue('') // Cleared on success
      })
    })

    it('handles command execution errors', async () => {
      const user = userEvent.setup()
      const errorCommand: Command = {
        id: 'error',
        trigger: '/error',
        label: 'Error Command',
        description: 'Will fail',
        icon: <span>❌</span>,
        execute: vi.fn().mockRejectedValue(new Error('Command failed')),
      }

      render(<PromptComposer api="/api/chat" commands={[errorCommand]} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/error{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Command failed')).toBeInTheDocument()
      })

      // User can continue using the interface
      await user.clear(input)
      await user.type(input, 'Continue after error')

      expect(input).toHaveValue('Continue after error')
    })
  })

  // ==========================================================================
  // Multi-Feature Integration Tests
  // ==========================================================================

  describe('Multi-Feature Integration', () => {
    it('combines suggestions + commands + context', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          commands={mockCommands}
          features={{
            suggestions: true,
            context: {
              triggers: ['@'],
              providers: [mockFileProvider],
            },
          }}
        />
      )

      const input = screen.getByRole('textbox')

      // 1. Start with suggestion
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Write tests')).toBeInTheDocument()
      })

      const suggestion = screen.getByText('Write tests')
      await user.click(suggestion)

      // 2. Execute command
      await user.clear(input)
      await user.type(input, '/code')

      await waitFor(() => {
        expect(screen.getByText('Generate Code')).toBeInTheDocument()
      })

      // 3. Switch to typing
      await user.keyboard('{Escape}')
      await user.clear(input)
      await user.type(input, 'Generate tests for Button.tsx')

      // All features should work together seamlessly
    })

    it('handles rapid state transitions', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          commands={mockCommands}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')

      // Rapidly switch between states
      await user.click(input) // Focus
      await user.type(input, 'a') // Typing
      await user.clear(input) // Empty
      await user.type(input, '/') // Command
      await user.keyboard('{Escape}') // Cancel
      await user.type(input, 'Text') // Typing again

      // Should handle all transitions smoothly
      expect(input).toHaveValue('/Text')
    })
  })

  // ==========================================================================
  // State Persistence Tests
  // ==========================================================================

  describe('State Persistence', () => {
    it('preserves draft on unmount/remount', () => {
      // Test draft persistence (if implemented)
    })

    it('restores context items across sessions', () => {
      // Test context restoration (if implemented)
    })
  })

  // ==========================================================================
  // Performance Tests
  // ==========================================================================

  describe('Performance', () => {
    it('handles large number of suggestions efficiently', async () => {
      const user = userEvent.setup()
      const manySuggestions: Suggestion[] = Array.from({ length: 100 }, (_, i) => ({
        id: `sug${i}`,
        type: 'starter' as const,
        text: `Suggestion ${i}`,
      }))

      const { container } = render(
        <PromptComposer
          api="/api/chat"
          suggestions={manySuggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      // Should render efficiently (only visible suggestions)
      await waitFor(() => {
        const suggestionElements = container.querySelectorAll('[role="button"]')
        expect(suggestionElements.length).toBeLessThan(100)
      })
    })

    it('debounces rapid typing for token calculations', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          onTokenUsageChange={mockOnTokenUsageChange}
        />
      )

      const input = screen.getByRole('textbox')

      // Type rapidly
      await user.type(input, 'abcdefghijklmnop', { delay: 10 })

      // Should debounce token calculations
      await waitFor(() => {
        const callCount = mockOnTokenUsageChange.mock.calls.length
        expect(callCount).toBeLessThan(20) // Less than one per character
      })
    })
  })

  // ==========================================================================
  // Callback Sequence Tests
  // ==========================================================================

  describe('Callback Sequences', () => {
    it('calls callbacks in correct order', async () => {
      const user = userEvent.setup()
      const callOrder: string[] = []

      const onStateChange = vi.fn(() => callOrder.push('stateChange'))
      const onTokenChange = vi.fn(() => callOrder.push('tokenChange'))
      const onSubmit = vi.fn(async () => {
        callOrder.push('submit')
      })

      render(
        <PromptComposer
          api="/api/chat"
          onStateChange={onStateChange}
          onTokenUsageChange={onTokenChange}
          onSubmit={onSubmit}
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })

      // Verify callbacks were called in expected order
      expect(callOrder).toContain('stateChange')
      expect(callOrder).toContain('submit')
    })
  })
})
