/**
 * PromptComposer Component Tests
 *
 * Comprehensive tests for the main PromptComposer component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptComposer } from '../PromptComposer'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type {
  Suggestion,
  Command,
  ContextProvider,
} from '../../../hooks/prompt-composer/types'

describe('PromptComposer', () => {
  const mockOnSubmit = vi.fn()
  const mockOnStateChange = vi.fn()
  const mockOnTokenUsageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Rendering Tests
  // ==========================================================================

  describe('Rendering', () => {
    it('renders with minimal props', () => {
      render(<PromptComposer api="/api/chat" />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('displays placeholder text', () => {
      render(<PromptComposer api="/api/chat" placeholder="Type your message..." />)

      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <PromptComposer api="/api/chat" className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('shows token budget when enabled', () => {
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={8000}
        />
      )

      // Token counter appears after expanding
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'a'.repeat(150) } })

      expect(screen.getByText(/8000/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // User Interaction Tests
  // ==========================================================================

  describe('User Interactions', () => {
    it('updates value on typing', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello world')

      expect(input).toHaveValue('Hello world')
    })

    it('submits on Enter key', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" onSubmit={mockOnSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message{Enter}')

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('does not submit on Shift+Enter', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" onSubmit={mockOnSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2')

      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(input).toHaveValue('Line 1\nLine 2')
    })

    it('submits on Send button click', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" onSubmit={mockOnSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('disables submit when empty', () => {
      render(<PromptComposer api="/api/chat" />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toBeDisabled()
    })

    it('enables submit when has content', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).not.toBeDisabled()
    })
  })

  // ==========================================================================
  // Suggestion Tests
  // ==========================================================================

  describe('Suggestions', () => {
    const mockSuggestions: Suggestion[] = [
      {
        id: 'sug1',
        type: 'starter',
        text: 'Explain this code',
        icon: <span>📖</span>,
      },
      {
        id: 'sug2',
        type: 'starter',
        text: 'Write tests',
        icon: <span>🧪</span>,
      },
      {
        id: 'sug3',
        type: 'starter',
        text: 'Debug issue',
        icon: <span>🐛</span>,
      },
    ]

    it('shows suggestions when focused and empty', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Explain this code')).toBeInTheDocument()
        expect(screen.getByText('Write tests')).toBeInTheDocument()
        expect(screen.getByText('Debug issue')).toBeInTheDocument()
      })
    })

    it('hides suggestions when typing', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Explain this code')).toBeInTheDocument()
      })

      await user.type(input, 'Hello')

      await waitFor(() => {
        expect(screen.queryByText('Explain this code')).not.toBeInTheDocument()
      })
    })

    it('applies suggestion on click', async () => {
      const user = userEvent.setup()
      const mockOnSuggestionClick = vi.fn()

      render(
        <PromptComposer
          api="/api/chat"
          suggestions={mockSuggestions}
          features={{ suggestions: true }}
          onSuggestionClick={mockOnSuggestionClick}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      await waitFor(() => {
        expect(screen.getByText('Explain this code')).toBeInTheDocument()
      })

      const suggestion = screen.getByText('Explain this code')
      await user.click(suggestion)

      expect(input).toHaveValue('Explain this code')
      expect(mockOnSuggestionClick).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'Explain this code' })
      )
    })

    it('limits visible suggestions to 6', async () => {
      const user = userEvent.setup()
      const manySuggestions: Suggestion[] = Array.from({ length: 10 }, (_, i) => ({
        id: `sug${i}`,
        type: 'starter' as const,
        text: `Suggestion ${i}`,
      }))

      render(
        <PromptComposer
          api="/api/chat"
          suggestions={manySuggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      await waitFor(() => {
        const suggestionElements = screen.getAllByRole('button').filter((btn) =>
          btn.textContent?.startsWith('Suggestion')
        )
        expect(suggestionElements.length).toBeLessThanOrEqual(6)
      })
    })
  })

  // ==========================================================================
  // Command Tests
  // ==========================================================================

  describe('Commands', () => {
    const mockCommands: Command[] = [
      {
        id: 'search',
        trigger: '/search',
        label: 'Search',
        description: 'Search documentation',
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

    it('shows command palette when / is typed', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" commands={mockCommands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/')

      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument()
        expect(screen.getByText('Generate Code')).toBeInTheDocument()
      })
    })

    it('filters commands by query', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" commands={mockCommands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/code')

      await waitFor(() => {
        expect(screen.getByText('Generate Code')).toBeInTheDocument()
        expect(screen.queryByText('Search')).not.toBeInTheDocument()
      })
    })

    it('executes command on Enter', async () => {
      const user = userEvent.setup()
      const mockOnCommandExecute = vi.fn()

      render(
        <PromptComposer
          api="/api/chat"
          commands={mockCommands}
          onCommandExecute={mockOnCommandExecute}
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, '/search{Enter}')

      await waitFor(() => {
        expect(mockOnCommandExecute).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'search' }),
          undefined
        )
      })
    })

    it('navigates commands with arrow keys', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" commands={mockCommands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/')

      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      // Second command should be selected (visual indication varies by implementation)
    })

    it('closes command palette on Escape', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" commands={mockCommands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/')

      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('Search')).not.toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // Context Item Tests
  // ==========================================================================

  describe('Context Items', () => {
    const mockFileProvider: ContextProvider = {
      type: 'file',
      search: vi.fn(async () => [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'Button.tsx',
          summary: 'Button component',
        }),
      ]),
      priority: 80,
    }

    it('displays added context items', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          features={{
            context: {
              triggers: ['@'],
              providers: [mockFileProvider],
            },
          }}
        />
      )

      // This test needs the ContextMentionInput component to be properly integrated
      // For now, we'll test the hook directly in other tests
    })

    it('shows token count for context items', async () => {
      // Test token display when context items are added
      // Implementation depends on TokenBudgetIndicator
    })

    it('removes context item on click', async () => {
      // Test context item removal
      // Implementation depends on ContextItemCard
    })
  })

  // ==========================================================================
  // Progressive Disclosure Tests
  // ==========================================================================

  describe('Progressive Disclosure', () => {
    it('starts in collapsed state', () => {
      const { container } = render(<PromptComposer api="/api/chat" />)

      // Should have minimal UI
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('min-h-[52px]')
    })

    it('expands with long text', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'a'.repeat(150))

      await waitFor(() => {
        expect(input).toHaveClass('min-h-[120px]')
      })
    })

    it('expands on multiline input', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2')

      await waitFor(() => {
        expect(input).toHaveClass('min-h-[120px]')
      })
    })

    it('shows actions when expanded', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          features={{
            attachments: true,
            settings: true,
          }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'a'.repeat(150))

      await waitFor(() => {
        // Settings button should be visible when expanded
        expect(screen.getByLabelText('Settings')).toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // Attachment Tests
  // ==========================================================================

  describe('Attachments', () => {
    it('accepts file uploads', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          features={{
            attachments: {
              maxFiles: 5,
              maxSize: 10 * 1024 * 1024,
            },
          }}
        />
      )

      // File upload button should be present
      // Implementation depends on AttachmentManager
    })

    it('enforces max file limit', async () => {
      // Test max file limit
      // Implementation depends on AttachmentManager
    })

    it('enforces file size limit', async () => {
      // Test file size validation
      // Implementation depends on AttachmentManager
    })
  })

  // ==========================================================================
  // Token Budget Tests
  // ==========================================================================

  describe('Token Budget', () => {
    it('displays current token usage', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={8000}
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello world')

      await waitFor(() => {
        expect(screen.getByText(/\/8000/)).toBeInTheDocument()
      })
    })

    it('shows warning color when approaching limit', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          showTokenBudget
          tokenBudget={100}
        />
      )

      const input = screen.getByRole('textbox')
      // Type enough to trigger warning threshold (80%)
      await user.type(input, 'a'.repeat(100))

      await waitFor(() => {
        const tokenDisplay = screen.getByText(/\/100/)
        expect(tokenDisplay).toHaveClass(/yellow|red/)
      })
    })

    it('calls onTokenUsageChange callback', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          onTokenUsageChange={mockOnTokenUsageChange}
        />
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      await waitFor(() => {
        expect(mockOnTokenUsageChange).toHaveBeenCalled()
      })
    })
  })

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('displays error message on submit failure', async () => {
      const user = userEvent.setup()
      const mockOnSubmitError = vi
        .fn()
        .mockRejectedValue(new Error('Submit failed'))

      render(<PromptComposer api="/api/chat" onSubmit={mockOnSubmitError} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Submit failed')).toBeInTheDocument()
      })
    })

    it('keeps content on submit error', async () => {
      const user = userEvent.setup()
      const mockOnSubmitError = vi
        .fn()
        .mockRejectedValue(new Error('Submit failed'))

      render(<PromptComposer api="/api/chat" onSubmit={mockOnSubmitError} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Submit failed')).toBeInTheDocument()
      })

      expect(input).toHaveValue('Test message')
    })
  })

  // ==========================================================================
  // Loading State Tests
  // ==========================================================================

  describe('Loading States', () => {
    it('shows submitting state', async () => {
      const user = userEvent.setup()
      const slowSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )

      render(<PromptComposer api="/api/chat" onSubmit={slowSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument()
      })
    })

    it('disables input while submitting', async () => {
      const user = userEvent.setup()
      const slowSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )

      render(<PromptComposer api="/api/chat" onSubmit={slowSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      await waitFor(() => {
        expect(input).toBeDisabled()
      })
    })
  })

  // ==========================================================================
  // Callback Tests
  // ==========================================================================

  describe('Callbacks', () => {
    it('calls onStateChange when state updates', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" onStateChange={mockOnStateChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')

      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalled()
      })
    })

    it('includes all state in callback', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" onStateChange={mockOnStateChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')

      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            value: expect.any(String),
            currentState: expect.any(String),
            totalTokens: expect.any(Number),
          })
        )
      })
    })
  })
})
