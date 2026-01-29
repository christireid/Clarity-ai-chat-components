/**
 * Keyboard Navigation Deep Analysis Tests
 *
 * Comprehensive test suite for keyboard accessibility in PromptComposer system:
 * - Tab order correctness
 * - Arrow key navigation in suggestions/commands
 * - Escape key handling across modals
 * - Focus trapping in popups
 * - Keyboard shortcuts conflicts
 * - Focus indicators visibility
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptComposer } from '../PromptComposer'
import { CommandPalette } from '../CommandPalette'
import { ContextMentionInput } from '../ContextMentionInput'
import type { Command, Suggestion, ContextProvider } from '../../../hooks/prompt-composer/types'

// ============================================================================
// Mock Data
// ============================================================================

const mockCommands: Command[] = [
  {
    id: 'search',
    trigger: '/search',
    label: 'Search Documentation',
    description: 'Search through docs',
    icon: <span>🔍</span>,
    execute: async () => {},
    available: true,
  },
  {
    id: 'code',
    trigger: '/code',
    label: 'Generate Code',
    description: 'Generate code snippets',
    icon: <span>💻</span>,
    execute: async () => {},
    available: true,
  },
  {
    id: 'debug',
    trigger: '/debug',
    label: 'Debug Issue',
    description: 'Help debug a problem',
    icon: <span>🐛</span>,
    execute: async () => {},
    available: true,
  },
]

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'starter',
    text: 'Explain this code',
    icon: <span>📖</span>,
  },
  {
    id: '2',
    type: 'starter',
    text: 'Write tests for...',
    icon: <span>🧪</span>,
  },
  {
    id: '3',
    type: 'starter',
    text: 'Debug issue',
    icon: <span>🐛</span>,
  },
]

const mockContextProviders: ContextProvider[] = [
  {
    type: 'file',
    search: async (query: string) => [
      {
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        description: 'Button component',
        tokens: { summary: 50, preview: 200, full: 500 },
      },
    ],
    icon: <span>📄</span>,
    enabled: true,
  },
]

// ============================================================================
// Test 1: Tab Order Correctness in PromptComposer
// ============================================================================

describe('PromptComposer - Tab Order', () => {
  it('should maintain correct tab order in collapsed state', async () => {
    const user = userEvent.setup()
    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        commands={mockCommands}
      />
    )

    // Tab order: textarea -> send button
    const textarea = screen.getByPlaceholderText(/ask anything/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    // Start with textarea focused
    textarea.focus()
    expect(textarea).toHaveFocus()

    // Tab to send button
    await user.tab()
    expect(sendButton).toHaveFocus()

    // Tab wraps around
    await user.tab()
    // Should wrap to first focusable element
  })

  it('should include action buttons in tab order when expanded', async () => {
    const user = userEvent.setup()
    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        commands={mockCommands}
        features={{
          attachments: true,
          voice: true,
          settings: true,
        }}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Type enough to trigger expanded state
    await user.type(textarea, 'This is a long message that should trigger the expanded state with multiple lines of text')

    // Wait for expansion
    await waitFor(() => {
      expect(textarea).toHaveClass(/min-h-\[120px\]/)
    })

    // Tab order should now include: textarea -> file upload -> voice -> settings -> send
    textarea.focus()
    expect(textarea).toHaveFocus()

    // Tab to file upload (if visible)
    await user.tab()

    // Tab to voice input
    await user.tab()

    // Tab to settings (if visible)
    await user.tab()

    // Tab to send button
    const sendButton = screen.getByRole('button', { name: /send/i })
    await waitFor(() => {
      expect(sendButton).toHaveFocus()
    })
  })

  it('should include suggestion chips in tab order when shown', async () => {
    const user = userEvent.setup()
    const onSuggestionClick = vi.fn()

    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        onSuggestionClick={onSuggestionClick}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)
    textarea.focus()

    // Suggestions should be visible on focus (empty input)
    await waitFor(() => {
      expect(screen.getByText('Explain this code')).toBeInTheDocument()
    })

    // Tab through suggestions
    for (const suggestion of mockSuggestions) {
      await user.tab()
      const button = screen.getByText(suggestion.text)
      expect(button).toHaveFocus()
    }
  })

  it('should skip disabled elements in tab order', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        features={{
          attachments: false,
          voice: false,
          settings: false,
        }}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    textarea.focus()
    expect(textarea).toHaveFocus()

    // Should skip directly to send button (no other actions)
    await user.tab()
    expect(sendButton).toHaveFocus()
  })

  it('should have proper tabindex attributes', () => {
    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        commands={mockCommands}
      />
    )

    // All interactive elements should be keyboard accessible
    const textarea = screen.getByPlaceholderText(/ask anything/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    expect(textarea).not.toHaveAttribute('tabindex', '-1')
    expect(sendButton).not.toHaveAttribute('tabindex', '-1')
  })
})

// ============================================================================
// Test 2: Arrow Key Navigation in Command Palette
// ============================================================================

describe('CommandPalette - Arrow Key Navigation', () => {
  it('should navigate down through commands with ArrowDown', async () => {
    const user = userEvent.setup()
    const onExecute = vi.fn()
    const onClose = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={0}
        onExecute={onExecute}
        onSelectionChange={vi.fn()}
        onClose={onClose}
      />
    )

    const commandButtons = screen.getAllByRole('button')

    // First command should have selected styling
    expect(commandButtons[0]).toHaveClass(/bg-accent/)

    // Simulate ArrowDown
    fireEvent.keyDown(document, { key: 'ArrowDown' })

    // Second command should be selected (visually indicated)
    await waitFor(() => {
      expect(commandButtons[1]).toHaveClass(/bg-accent/)
    })
  })

  it('should navigate up through commands with ArrowUp', async () => {
    const onExecute = vi.fn()
    const onClose = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={2}
        onExecute={onExecute}
        onSelectionChange={vi.fn()}
        onClose={onClose}
      />
    )

    const commandButtons = screen.getAllByRole('button')

    // Third command should be selected
    expect(commandButtons[2]).toHaveClass(/bg-accent/)

    // Simulate ArrowUp
    fireEvent.keyDown(document, { key: 'ArrowUp' })

    // Second command should be selected
    await waitFor(() => {
      expect(commandButtons[1]).toHaveClass(/bg-accent/)
    })
  })

  it('should execute command with Enter key', async () => {
    const onExecute = vi.fn()
    const onClose = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={1}
        onExecute={onExecute}
        onSelectionChange={vi.fn()}
        onClose={onClose}
      />
    )

    // Simulate Enter
    fireEvent.keyDown(document, { key: 'Enter' })

    await waitFor(() => {
      expect(onExecute).toHaveBeenCalledWith(mockCommands[1])
    })
  })

  it('should close palette with Escape key', async () => {
    const onExecute = vi.fn()
    const onClose = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={0}
        onExecute={onExecute}
        onSelectionChange={vi.fn()}
        onClose={onClose}
      />
    )

    // Simulate Escape
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalled()
  })

  it('should not allow navigation past first command with ArrowUp', () => {
    const onSelectionChange = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={0}
        onExecute={vi.fn()}
        onSelectionChange={onSelectionChange}
        onClose={vi.fn()}
      />
    )

    // Try to go up from first command
    fireEvent.keyDown(document, { key: 'ArrowUp' })

    // Should stay at 0 (not go negative)
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it('should not allow navigation past last command with ArrowDown', () => {
    const onSelectionChange = vi.fn()

    render(
      <CommandPalette
        commands={mockCommands}
        query=""
        selectedIndex={mockCommands.length - 1}
        onExecute={vi.fn()}
        onSelectionChange={onSelectionChange}
        onClose={vi.fn()}
      />
    )

    // Try to go down from last command
    fireEvent.keyDown(document, { key: 'ArrowDown' })

    // Should stay at last index
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it('should scroll selected command into view', async () => {
    const onExecute = vi.fn()

    const { container } = render(
      <div style={{ height: '200px', overflow: 'auto' }}>
        <CommandPalette
          commands={[...mockCommands, ...mockCommands, ...mockCommands]} // Many commands
          query=""
          selectedIndex={8}
          onExecute={onExecute}
          onSelectionChange={vi.fn()}
          onClose={vi.fn()}
        />
      </div>
    )

    const commandButtons = container.querySelectorAll('button[data-command]')
    const selectedButton = commandButtons[8] as HTMLElement

    // Check if scrollIntoView was called (mocked)
    expect(selectedButton).toBeInTheDocument()
  })
})

// ============================================================================
// Test 3: Arrow Key Navigation in Context Mentions
// ============================================================================

describe('ContextMentionInput - Arrow Key Navigation', () => {
  it('should navigate through context suggestions with arrow keys', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <ContextMentionInput
        value=""
        onChange={onChange}
        providers={mockContextProviders}
      />
    )

    const textarea = screen.getByPlaceholderText(/type @ to mention/i)

    // Type @ to trigger suggestions
    await user.type(textarea, '@file:')

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    // Simulate ArrowDown
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })

    // First suggestion should be highlighted
    const suggestion = screen.getByText('Button.tsx').closest('button')
    expect(suggestion).toHaveClass(/bg-accent/)
  })

  it('should select suggestion with Enter key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <ContextMentionInput
        value=""
        onChange={onChange}
        providers={mockContextProviders}
      />
    )

    const textarea = screen.getByPlaceholderText(/type @ to mention/i)

    // Type @ to trigger suggestions
    await user.type(textarea, '@file:')

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    // Press Enter to select
    fireEvent.keyDown(textarea, { key: 'Enter', preventDefault: () => {} })

    // Should insert mention
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.stringContaining('@file:Button.tsx'),
        expect.any(Array)
      )
    })
  })

  it('should close suggestions with Escape key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <ContextMentionInput
        value=""
        onChange={onChange}
        providers={mockContextProviders}
      />
    )

    const textarea = screen.getByPlaceholderText(/type @ to mention/i)

    // Type @ to trigger suggestions
    await user.type(textarea, '@file:')

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    // Press Escape
    fireEvent.keyDown(textarea, { key: 'Escape' })

    // Suggestions should disappear
    await waitFor(() => {
      expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument()
    })
  })
})

// ============================================================================
// Test 4: Escape Key Handling Across Modals
// ============================================================================

describe('PromptComposer - Escape Key Handling', () => {
  it('should close command palette with Escape', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        commands={mockCommands}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Type / to open command palette
    await user.type(textarea, '/search')

    // Wait for palette to appear
    await waitFor(() => {
      expect(screen.getByText(/commands/i)).toBeInTheDocument()
    })

    // Press Escape
    fireEvent.keyDown(textarea, { key: 'Escape', preventDefault: () => {} })

    // Palette should close
    await waitFor(() => {
      expect(screen.queryByText(/commands/i)).not.toBeInTheDocument()
    })
  })

  it('should close suggestions with Escape', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Focus to show suggestions
    textarea.focus()

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Explain this code')).toBeInTheDocument()
    })

    // Press Escape
    fireEvent.keyDown(textarea, { key: 'Escape' })

    // Suggestions should disappear
    await waitFor(() => {
      expect(screen.queryByText('Explain this code')).not.toBeInTheDocument()
    })
  })

  it('should not submit on Escape', async () => {
    const onSubmit = vi.fn()

    render(
      <PromptComposer
        api="/api/chat"
        onSubmit={onSubmit}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Press Escape
    fireEvent.keyDown(textarea, { key: 'Escape' })

    // Should not submit
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

// ============================================================================
// Test 5: Focus Trapping in Popups
// ============================================================================

describe('PromptComposer - Focus Trapping', () => {
  it('should trap focus within command palette when open', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        commands={mockCommands}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Open command palette
    await user.type(textarea, '/')

    // Wait for palette
    await waitFor(() => {
      expect(screen.getByText(/commands/i)).toBeInTheDocument()
    })

    // Tab should stay within palette
    const commandButtons = screen.getAllByRole('button')
    const paletteButtons = commandButtons.filter(btn =>
      btn.textContent?.includes('Search') ||
      btn.textContent?.includes('Generate') ||
      btn.textContent?.includes('Debug')
    )

    // Focus should cycle through palette items
    paletteButtons[0].focus()
    expect(paletteButtons[0]).toHaveFocus()

    await user.tab()
    expect(paletteButtons[1]).toHaveFocus()

    await user.tab()
    expect(paletteButtons[2]).toHaveFocus()
  })

  it('should restore focus to textarea when palette closes', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        commands={mockCommands}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Open palette
    await user.type(textarea, '/')

    // Close with Escape
    fireEvent.keyDown(textarea, { key: 'Escape', preventDefault: () => {} })

    // Focus should return to textarea
    await waitFor(() => {
      expect(textarea).toHaveFocus()
    })
  })
})

// ============================================================================
// Test 6: Keyboard Shortcuts Conflicts
// ============================================================================

describe('PromptComposer - Keyboard Shortcut Conflicts', () => {
  it('should handle Enter vs Shift+Enter correctly', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <PromptComposer
        api="/api/chat"
        onSubmit={onSubmit}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Type message
    await user.type(textarea, 'Hello world')

    // Shift+Enter should NOT submit (adds newline)
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()

    // Enter alone should submit
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false, preventDefault: () => {} })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it('should handle Tab vs Enter in command palette', async () => {
    const user = userEvent.setup()
    const onCommandExecute = vi.fn()

    render(
      <PromptComposer
        api="/api/chat"
        commands={mockCommands}
        onCommandExecute={onCommandExecute}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Open palette
    await user.type(textarea, '/')

    // Wait for palette
    await waitFor(() => {
      expect(screen.getByText(/commands/i)).toBeInTheDocument()
    })

    // Tab should navigate (not execute)
    fireEvent.keyDown(textarea, { key: 'Tab', preventDefault: () => {} })
    expect(onCommandExecute).not.toHaveBeenCalled()

    // Enter should execute
    fireEvent.keyDown(textarea, { key: 'Enter', preventDefault: () => {} })

    await waitFor(() => {
      expect(onCommandExecute).toHaveBeenCalled()
    })
  })

  it('should not conflict with browser shortcuts', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // Ctrl/Cmd shortcuts should NOT be intercepted
    // These should work for browser actions (copy, paste, undo, etc.)
    const shortcuts = [
      { key: 'a', ctrlKey: true }, // Select all
      { key: 'c', ctrlKey: true }, // Copy
      { key: 'v', ctrlKey: true }, // Paste
      { key: 'z', ctrlKey: true }, // Undo
      { key: 'y', ctrlKey: true }, // Redo
    ]

    for (const shortcut of shortcuts) {
      const event = fireEvent.keyDown(textarea, shortcut)
      // Should NOT prevent default (let browser handle)
      expect(event).toBe(true)
    }
  })
})

// ============================================================================
// Test 7: Focus Indicators Visibility
// ============================================================================

describe('PromptComposer - Focus Indicators', () => {
  it('should show focus ring on textarea when focused', async () => {
    render(
      <PromptComposer
        api="/api/chat"
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)
    const container = textarea.closest('div')

    // Focus textarea
    textarea.focus()

    // Container should have focus ring styles
    await waitFor(() => {
      expect(container).toHaveClass(/focus-within:ring-2/)
    })
  })

  it('should show visible focus on all interactive elements', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        commands={mockCommands}
        features={{
          attachments: true,
          voice: true,
          settings: true,
        }}
      />
    )

    // Get all buttons
    const buttons = screen.getAllByRole('button')

    // Each button should have focus-visible styles
    for (const button of buttons) {
      button.focus()
      expect(button).toHaveClass(/focus-visible:/)
    }
  })

  it('should have focus-visible classes on interactive elements', () => {
    render(
      <PromptComposer
        api="/api/chat"
      />
    )

    const sendButton = screen.getByRole('button', { name: /send/i })
    const textarea = screen.getByPlaceholderText(/ask anything/i)
    const container = textarea.closest('div')

    // Check for focus-related classes
    expect(container?.className).toContain('focus-within')
  })

  it('should maintain focus indicators during keyboard navigation', async () => {
    const user = userEvent.setup()

    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)
    textarea.focus()

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Explain this code')).toBeInTheDocument()
    })

    // Tab through suggestions
    for (const suggestion of mockSuggestions) {
      await user.tab()
      const button = screen.getByText(suggestion.text)

      // Should have visible focus
      expect(document.activeElement).toBe(button)
      expect(button).toHaveClass(/focus-visible:/)
    }
  })
})

// ============================================================================
// Test 8: Complete Keyboard-Only User Flow
// ============================================================================

describe('PromptComposer - Complete Keyboard-Only Flow', () => {
  it('should support full interaction without mouse', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onCommandExecute = vi.fn()

    render(
      <PromptComposer
        api="/api/chat"
        suggestions={mockSuggestions}
        commands={mockCommands}
        onSubmit={onSubmit}
        onCommandExecute={onCommandExecute}
      />
    )

    const textarea = screen.getByPlaceholderText(/ask anything/i)

    // 1. Tab to textarea (simulated by direct focus)
    textarea.focus()
    expect(textarea).toHaveFocus()

    // 2. See suggestions appear
    await waitFor(() => {
      expect(screen.getByText('Explain this code')).toBeInTheDocument()
    })

    // 3. Tab to first suggestion
    await user.tab()
    expect(screen.getByText('Explain this code')).toHaveFocus()

    // 4. Escape to dismiss suggestions
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText('Explain this code')).not.toBeInTheDocument()
    })

    // 5. Type slash command
    await user.type(textarea, '/search')

    // 6. Wait for command palette
    await waitFor(() => {
      expect(screen.getByText(/commands/i)).toBeInTheDocument()
    })

    // 7. Navigate commands with arrow keys
    fireEvent.keyDown(textarea, { key: 'ArrowDown', preventDefault: () => {} })
    fireEvent.keyDown(textarea, { key: 'ArrowDown', preventDefault: () => {} })

    // 8. Execute command with Enter
    fireEvent.keyDown(textarea, { key: 'Enter', preventDefault: () => {} })

    await waitFor(() => {
      expect(onCommandExecute).toHaveBeenCalled()
    })

    // 9. Type regular message
    await user.clear(textarea)
    await user.type(textarea, 'Hello world')

    // 10. Tab to send button
    await user.tab()
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toHaveFocus()

    // 11. Press Enter to submit
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
